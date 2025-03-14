document.addEventListener('DOMContentLoaded', () => {
    const firebaseConfig = {
        apiKey: "AIzaSyC7_oviEfQMtGAFHMDEHDpLngyRlMfBv38",
        authDomain: "biblioteca-sesi-dom-bosco.firebaseapp.com",
        projectId: "biblioteca-sesi-dom-bosco",
        storageBucket: "biblioteca-sesi-dom-bosco.firebasestorage.app",
        messagingSenderId: "524040328540",
        appId: "1:524040328540:web:4c5e789c73237dd64cdd99",
        measurementId: "G-GQSKF98EXF"
    };

    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();
    const database = firebase.database();

    const googleLoginButton = document.getElementById('google-login-button');
    const logoutButton = document.getElementById('logout-button');
    const authContainer = document.getElementById('auth-container');
    const mainContent = document.querySelector('main');

    // Função para exibir livros
    function exibirLivros(filtrados) {
        if (!mainContent) return;
        mainContent.innerHTML = '';
        filtrados.forEach(livro => {
            const div = document.createElement('div');
            div.className = 'book';
            div.innerHTML = `
                <div class="title">${livro.titulo}</div>
                <div class="author">${livro.autor}</div>
                <img src="${livro.capa}" alt="Capa do Livro" class="book-cover">
                <div class="location">Prateleira: ${livro.prateleira}</div>
                <div class="resumo" style="display: none;">${livro.resumo}</div>
                <div class="rating" data-book-id="${livro.id}">
                    ${[...Array(5)].map((_, i) => `<span class="star" data-value="${i + 1}">&#9733;</span>`).join('')}
                </div>
                <div class="average-rating" id="average-rating-${livro.id}"></div>
            `;
            mainContent.appendChild(div);

            const ratingStars = div.querySelectorAll('.star');
            ratingStars.forEach(star => {
                star.addEventListener('click', (e) => {
                    if (auth.currentUser) {
                        const bookId = e.target.parentNode.getAttribute('data-book-id');
                        const rating = e.target.getAttribute('data-value');
                        database.ref(`ratings/${bookId}/${auth.currentUser.uid}`).set(parseInt(rating))
                            .then(() => {
                                marcarEstrelas(ratingStars, rating);
                                atualizarAvaliacoes(bookId);
                                alert('Avaliação registrada com sucesso!');
                            })
                            .catch(error => {
                                console.error('Erro ao registrar avaliação:', error);
                                alert('Erro ao registrar avaliação: ' + error.message);
                            });
                    } else {
                        alert('Você precisa estar logado para avaliar.');
                    }
                });
            });

            // Atualiza as avaliações ao carregar
            atualizarAvaliacoes(livro.id);

            div.querySelector('.book-cover').addEventListener('click', () => {
                const resumoContainer = document.getElementById('resumo-container');
                resumoContainer.style.display = 'flex';
                document.getElementById('resumo-capa').src = livro.capa;
                document.getElementById('resumo-sinopse').textContent = livro.resumo;

                // Adiciona evento ao botão de voltar
                const voltarButton = document.getElementById('voltar-resumo');
                voltarButton.addEventListener('click', () => {
                    resumoContainer.style.display = 'none';
                    exibirLivros(livros); // Retorna à lista de livros
                });
            });
        });
    }

    // Função para buscar livros
    function buscarLivros(query, livros) {
        console.log(`Busca iniciada com query: ${query}`);
        const filtrados = livros.filter(livro => {
            return livro.titulo.toLowerCase().includes(query.toLowerCase()) ||
                   livro.autor.toLowerCase().includes(query.toLowerCase());
        });
        console.log(`Livros encontrados:`, filtrados);
        exibirLivros(filtrados);
    }

    // Exibir livros ao carregar a página
    exibirLivros(livros);

    // Configurar menus de título e autor
    const menuTitulo = document.getElementById('menu-titulo');
    const menuAutor = document.getElementById('menu-autor');

    const titulos = [...new Set(livros.map(livro => livro.titulo))];
    const autores = [...new Set(livros.map(livro => livro.autor))];

    titulos.forEach(titulo => {
        const option = document.createElement('option');
        option.value = titulo;
        option.textContent = titulo;
        menuTitulo.appendChild(option);
    });

    autores.forEach(autor => {
        const option = document.createElement('option');
        option.value = autor;
        option.textContent = autor;
        menuAutor.appendChild(option);
    });

    if (menuTitulo) {
        menuTitulo.addEventListener('change', (e) => {
            console.log(`Título selecionado: ${e.target.value}`);
            const query = e.target.value;
            buscarLivros(query, livros);
        });
    }

    if (menuAutor) {
        menuAutor.addEventListener('change', (e) => {
            console.log(`Autor selecionado: ${e.target.value}`);
            const query = e.target.value;
            buscarLivros(query, livros);
        });
    }

    // Função para atualizar avaliações
    function atualizarAvaliacoes(bookId) {
        const ratingsRef = database.ref(`ratings/${bookId}`);
        ratingsRef.once('value', snapshot => {
            const ratings = snapshot.val();
            if (ratings) {
                const total = Object.values(ratings).reduce((acc, rating) => acc + rating, 0);
                const count = Object.keys(ratings).length;
                const average = total / count;
                const averageRatingElem = document.getElementById(`average-rating-${bookId}`);
                if (averageRatingElem) {
                    averageRatingElem.textContent = `Avaliação Média: ${average.toFixed(1)} estrelas`;
                }
                marcarEstrelas(document.querySelectorAll(`.rating[data-book-id="${bookId}"] .star`), average);
            }
        });
    }

    // Função para marcar estrelas
    function marcarEstrelas(ratingStars, rating) {
        ratingStars.forEach(star => {
            star.classList.toggle('filled', star.getAttribute('data-value') <= rating);
        });
    }

    // Controle de autenticação
    if (googleLoginButton) {
        googleLoginButton.addEventListener('click', () => {
            const provider = new firebase.auth.GoogleAuthProvider();
            auth.signInWithPopup(provider)
                .then(result => {
                    alert('Login com Google realizado com sucesso!');
                })
                .catch(error => {
                    console.error('Erro ao fazer login com Google:', error);
                    alert('Erro ao fazer login com Google: ' + error.message);
                });
        });
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            auth.signOut()
                .then(() => {
                    alert('Logout realizado com sucesso!');
                })
                .catch(error => {
                    console.error('Erro ao fazer logout:', error);
                    alert('Erro ao fazer logout: ' + error.message);
                });
        });
    }

    auth.onAuthStateChanged(user => {
        if (user) {
            if (authContainer) authContainer.style.display = 'none';
            if (logoutButton) logoutButton.style.display = 'block';
        } else {
            if (authContainer) authContainer.style.display = 'block';
            if (logoutButton) logoutButton.style.display = 'none';
        }
    });
});

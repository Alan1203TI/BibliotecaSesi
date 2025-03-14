document.addEventListener('DOMContentLoaded', () => {
    // Configuração do Firebase
    const firebaseConfig = {
        apiKey: "AIzaSyC7_oviEfQMtGAFHMDEHDpLngyRlMfBv38",
        authDomain: "biblioteca-sesi-dom-bosco.firebaseapp.com",
        projectId: "biblioteca-sesi-dom-bosco",
        storageBucket: "biblioteca-sesi-dom-bosco.firebasestorage.app",
        messagingSenderId: "524040328540",
        appId: "1:524040328540:web:4c5e789c73237dd64cdd99",
        measurementId: "G-GQSKF98EXF"
    };

    // Inicializar Firebase
    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();

    // Função de login com Google
    document.getElementById('google-login-button').addEventListener('click', () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider)
            .then(result => {
                alert('Login com Google realizado com sucesso!');
            })
            .catch(error => {
                alert('Erro ao fazer login com Google: ' + error.message);
            });
    });

    // Função de logout
    document.getElementById('logout-button').addEventListener('click', () => {
        auth.signOut()
            .then(() => {
                alert('Logout realizado com sucesso!');
            })
            .catch(error => {
                alert('Erro ao fazer logout: ' + error.message);
            });
    });

    // Verificar estado de autenticação
    auth.onAuthStateChanged(user => {
        if (user) {
            // Usuário está logado
            document.getElementById('auth-container').style.display = 'none';
            document.querySelector('main').style.display = 'block';
            document.getElementById('logout-button').style.display = 'block';
        } else {
            // Usuário não está logado
            document.getElementById('auth-container').style.display = 'block';
            document.querySelector('main').style.display = 'none';
            document.getElementById('logout-button').style.display = 'none';
        }
    });

    // Função para exibir livros
    function exibirLivros(filtrados) {
        const main = document.querySelector('main');
        main.innerHTML = '';  // Limpa o conteúdo atual
        filtrados.forEach(livro => {
            const div = document.createElement('div');
            div.className = 'book';
            div.innerHTML = `
                <div class="title">${livro.titulo}</div>
                <div class="author">${livro.autor}</div>
                <img src="${livro.capa}" alt="Capa do Livro" class="book-cover">
                <div class="location">Prateleira: ${livro.prateleira}</div>
                <div class="resumo" style="display: none;">${livro.resumo}</div>
            `;
            main.appendChild(div);

            div.querySelector('.book-cover').addEventListener('click', () => {
                main.innerHTML = '';  // Limpa todos os livros
                const selectedBook = document.createElement('div');
                selectedBook.className = 'book';
                selectedBook.innerHTML = `
                    <div class="title">${livro.titulo}</div>
                    <div class="author">${livro.autor}</div>
                    <img src="${livro.capa}" alt="Capa do Livro" class="book-cover">
                    <div class="location">Prateleira: ${livro.prateleira}</div>
                    <div class="resumo">${livro.resumo}</div>
                    <button id="voltar">Voltar à lista de livros</button>
                `;
                main.appendChild(selectedBook);

                document.getElementById('voltar').addEventListener('click', () => {
                    exibirLivros(livros);
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

    // Exibir livros inicialmente
    exibirLivros(livros);

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

    menuTitulo.addEventListener('change', (e) => {
        console.log(`Título selecionado: ${e.target.value}`);
        const query = e.target.value;
        buscarLivros(query, livros);
    });

    menuAutor.addEventListener('change', (e) => {
        console.log(`Autor selecionado: ${e.target.value}`);
        const query = e.target.value;
        buscarLivros(query, livros);
    });
});

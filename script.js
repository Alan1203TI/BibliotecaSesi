console.log("Início do script.js");
console.log("Verificando a variável 'livros':", window.livros);

if (!window.livros || !Array.isArray(livros)) {
    console.error("A variável 'livros' não foi encontrada ou não é um array.");
} else {
    console.log("A variável 'livros' foi carregada com sucesso:", livros);
}

document.addEventListener('DOMContentLoaded', () => {
    // Valida se a variável 'livros' existe e é um array
    if (!window.livros || !Array.isArray(livros)) {
        console.error("A variável 'livros' não foi encontrada ou não é um array.");
        return;
    }

    const main = document.querySelector('main');
    if (!main) {
        console.error("O elemento 'main' não foi encontrado.");
        return;
    }

    const menuTitulo = document.getElementById('menu-titulo');
    const menuAutor = document.getElementById('menu-autor');
    if (!menuTitulo || !menuAutor) {
        console.error("Os elementos 'menu-titulo' ou 'menu-autor' não foram encontrados.");
        return;
    }

    // Popula os menus com títulos e autores únicos
    console.log("Populando os menus de seleção...");
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

    // Função para exibir livros na tela
    function exibirLivros(filtrados) {
        console.log("Livros a serem exibidos:", filtrados);
        main.innerHTML = ''; // Limpa o conteúdo anterior

        if (filtrados.length === 0) {
            main.innerHTML = '<p>Nenhum livro encontrado.</p>';
            return;
        }

        filtrados.forEach(livro => {
            const div = document.createElement('div');
            div.className = 'book';

            // Garante que a capa do livro será exibida corretamente
            const imgSrc = livro.capa ? livro.capa : "default.jpg"; // Certifique-se de que 'default.jpg' esteja na pasta raiz

            div.innerHTML = `
                <div class="title">${livro.titulo}</div>
                <div class="author">${livro.autor}</div>
                <img src="${imgSrc}" alt="Capa do Livro" class="book-cover">
                <div class="location">Prateleira: ${livro.prateleira}</div>
                <div class="resumo" style="display: none;">${livro.resumo || "Resumo indisponível."}</div>
            `;
            main.appendChild(div);

            // Adiciona evento de clique na capa para exibir mais informações
            div.querySelector('.book-cover').addEventListener('click', () => {
                console.log(`Livro selecionado: ${livro.titulo}`);
                main.innerHTML = ''; // Limpa a lista de livros

                const selectedBook = document.createElement('div');
                selectedBook.className = 'book';
                selectedBook.innerHTML = `
                    <div class="title">${livro.titulo}</div>
                    <div class="author">${livro.autor}</div>
                    <img src="${imgSrc}" alt="Capa do Livro">
                    <div class="location">Prateleira: ${livro.prateleira}</div>
                    <div class="resumo">${livro.resumo || "Resumo indisponível."}</div>
                    <button id="voltar">Voltar à lista de livros</button>
                `;
                main.appendChild(selectedBook);

                // Evento para voltar à lista de livros
                document.getElementById('voltar').addEventListener('click', () => {
                    exibirLivros(livros);
                });
            });
        });
    }

    // Exibe todos os livros inicialmente
    console.log("Exibindo todos os livros...");
    exibirLivros(livros);

    // Eventos para os menus de filtro
    menuTitulo.addEventListener('change', (e) => {
        const query = e.target.value;
        const filtrados = livros.filter(livro => livro.titulo === query);
        exibirLivros(filtrados);
    });

    menuAutor.addEventListener('change', (e) => {
        const query = e.target.value;
        const filtrados = livros.filter(livro => livro.autor === query);
        exibirLivros(filtrados);
    });
});

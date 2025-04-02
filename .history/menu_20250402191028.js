var menuItem = document.querySelectorAll('.item-menu')

function selectlink(){
    menuItem.forEach((item)=> 
        item.classList.remove('ativo') 
)
this.classList.add('ativo')
}
menuItem.forEach((item)=>
    item.addEventListener('click',selectlink)
)


document.addEventListener("DOMContentLoaded", () => {
    const textComent = document.getElementById("inputText"); // Campo de texto
    const form = document.getElementById("formulario"); // Formulário
    const commentPost = document.getElementById("commentPost"); // Área onde os comentários aparecem
    const player = document.getElementById("player"); // Player de música

    console.log("Página carregada!"); // Verifica se o JS está rodando

    // Função para obter um ID único para cada música
    function getMusicId() {
        return player ? player.src || "default" : "default";
    }

    // Função para exibir comentários na tela
    function displayComments() {
        commentPost.innerHTML = "<h5>Comentários</h5>"; // Mantém o título

        let comments = JSON.parse(localStorage.getItem("comments")) || {};
        let musicId = getMusicId();

        if (comments[musicId]) {
            comments[musicId].forEach(comment => {
                addCommentToScreen(comment);
            });
        }
    }

    // Função para adicionar um comentário na tela (sem precisar recarregar)
    function addCommentToScreen(comment) {
        let p = document.createElement("p");
        p.classList.add("p-2", "text-wrap", "text-white");
        p.innerHTML = `<strong>${comment}</strong>`;
        commentPost.appendChild(p);
    }

    // Evento para adicionar comentários
    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const musicId = getMusicId();
        const commentText = textComent.value.trim();

        if (commentText === "") {
            return; // Impede comentários vazios
        }

        let comments = JSON.parse(localStorage.getItem("comments")) || {};
        if (!comments[musicId]) {
            comments[musicId] = [];
        }

        comments[musicId].push(commentText);
        localStorage.setItem("comments", JSON.stringify(comments));

        addCommentToScreen(commentText); // Adiciona o comentário à tela
        textComent.value = ""; // Limpa o campo de texto
    });

    // Atualiza os comentários ao carregar a página
    displayComments();
});
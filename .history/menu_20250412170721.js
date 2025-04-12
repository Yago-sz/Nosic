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
    const adminLoginButton = document.getElementById("adminLogin"); // Botão para ativar modo admin

    let isAdmin = false; // Por padrão, ninguém é admin

    console.log("Página carregada!");

    // Função para obter um ID único baseado no nome da música
    function getMusicId() {
        return player ? player.src.split("/").pop() : "default";
    }

    // Função para exibir apenas os comentários da música atual
    function displayComments() {
        commentPost.innerHTML = "<h5>Comentários</h5>"; // Mantém o título

        let comments = JSON.parse(localStorage.getItem("comments")) || {};
        let musicId = getMusicId();

        if (comments[musicId]) {
            comments[musicId].forEach((comment, index) => {
                addCommentToScreen(comment, index);
            });
        }
    }

    // Função para adicionar um comentário na tela
    function addCommentToScreen(comment, index) {
        let commentContainer = document.createElement("div");
        commentContainer.classList.add("d-flex", "justify-content-between", "align-items-center", "mb-2");

        let p = document.createElement("p");
        p.classList.add("p-2", "text-wrap", "text-white", "m-0");
        p.innerHTML = `<strong>${comment}</strong>`;

        // Adiciona o botão de excluir apenas se for admin
        if (isAdmin) {
            let deleteButton = document.createElement("button");
            deleteButton.classList.add("btn", "btn-danger", "btn-sm");
            deleteButton.innerHTML = "❌";
            deleteButton.onclick = () => removeComment(index);

            commentContainer.appendChild(deleteButton);
        }

        commentContainer.appendChild(p);
        commentPost.appendChild(commentContainer);
    }

    // Função para remover um comentário
    function removeComment(index) {
        let comments = JSON.parse(localStorage.getItem("comments")) || {};
        let musicId = getMusicId();

        if (comments[musicId]) {
            comments[musicId].splice(index, 1); // Remove o comentário pelo índice
            localStorage.setItem("comments", JSON.stringify(comments)); // Atualiza o armazenamento

            displayComments(); // Recarrega a lista de comentários
        }
    }

    // Evento para adicionar novos comentários
    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const musicId = getMusicId();
        const commentText = textComent.value.trim();

        if (commentText === "") return;

        let comments = JSON.parse(localStorage.getItem("comments")) || {};
        if (!comments[musicId]) {
            comments[musicId] = [];
        }

        comments[musicId].push(commentText);
        localStorage.setItem("comments", JSON.stringify(comments));

        displayComments(); // Atualiza a tela
        textComent.value = ""; // Limpa o campo de texto
    });
    const loadMusic = (index) => {
        player.src = songs[index].src;
        musicName.innerHTML = songs[index].name;
        musicCover.src = songs[index].cover;
        player.load();
        
        displayComments(); // 🔥 Carrega os comentários sempre que mudar de música
    };

    // Botão para ativar modo admin
    adminLoginButton.addEventListener("click", () => {
        let senha = prompt("Digite a senha de admin:");

        if (senha === "sylv") { // 🔥 Troque "1234" pela senha que quiser
            isAdmin = true;
            alert("Modo Admin ativado!");
            displayComments(); // Atualiza para mostrar os botões ❌
        } else {
            alert("Senha incorreta!");
        }
    });

    // Atualiza os comentários ao trocar de música
    player.addEventListener("loadeddata", displayComments);

    // Carrega os comentários ao iniciar
    displayComments();

    function adjustLayout() {
        // Verifica se um campo de entrada está ativo
        if (document.activeElement.tagName === "TEXTAREA") {
            return; // Sai da função se estiver digitando no textarea
        }
    
        if (window.innerWidth > 768) {
            document.querySelector('.player').style.display = "flex";
            document.querySelector('.Coment').style.display = "block";
        } else {
            document.querySelector('.player').style.display = "flex";
            document.querySelector('.Coment').style.display = "none";
        }
    }
    
    // Atualiza quando a página carrega e na mudança de tamanho
    window.addEventListener('resize', adjustLayout);
    document.addEventListener("DOMContentLoaded", adjustLayout);
    
    document.getElementById("formulario").addEventListener("submit", function(e) {
        e.preventDefault(); // Impede que a página recarregue
        // Seu código para enviar o comentário aqui
    });
});


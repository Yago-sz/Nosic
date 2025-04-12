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
    const textComent = document.getElementById("inputText");
    const form = document.getElementById("formulario");
    const commentPost = document.getElementById("commentPost");
    const player = document.getElementById("player");
    const adminLoginButton = document.getElementById("adminLogin");

    let isAdmin = false;

    // Inicializar Firebase (caso ainda não esteja feito no HTML)
    const firebaseConfig = {
        apiKey: "AIzaSyAj0AEdWvXFgC9YKza5tDK4zSzAxDxPa6g",
        authDomain: "comentarios-71b56.firebaseapp.com",
        databaseURL: "https://comentarios-71b56-default-rtdb.firebaseio.com",
        projectId: "comentarios-71b56",
        storageBucket: "comentarios-71b56.appspot.com",
        messagingSenderId: "440922051626",
        appId: "1:440922051626:web:0c87bcd54a2d842a725f53",
        measurementId: "G-0TS04ED0GE"
    };
    const app = firebase.initializeApp(firebaseConfig);
    const db = firebase.database();

    // Gera um ID único com base na música
    function getMusicId() {
        const src = player?.src || "default";
        return src.split("/").pop().replace(/\.[^/.]+$/, "");
    }
    let commentRef = null;
    // Mostra os comentários da música atual
    function displayComments() {
        const musicId = getMusicId(); // ID da música atual
      
        // Se já havia um listener antigo, remove ele
        if (commentRef) {
            commentRef.off(); // Remove o listener anterior
        }
      
        commentRef = db.ref('comentarios/' + musicId); // Atualiza referência
        commentPost.innerHTML = "<h5>Comentários</h5>"; // Limpa a seção
      
        // Adiciona novo listener
        commentRef.on('child_added', function(snapshot) {
            const comentario = snapshot.val();
            addCommentToScreen(comentario.texto, comentario.timestamp, snapshot.key); // Passa a chave do comentário
        });
    }

 // Mostra comentário na tela
function addCommentToScreen(commentText, timestamp, commentKey) {
    const commentContainer = document.createElement("div");
    commentContainer.classList.add("d-flex", "justify-content-between", "align-items-center", "mb-2");

    let p = document.createElement("p");
    p.classList.add("p-2", "text-wrap", "text-white", "m-0");
    p.innerHTML = `<strong>${commentText}</strong><br><small>${formatTimestamp(timestamp)}</small>`;

    if (isAdmin) {
        let deleteButton = document.createElement("button");
        deleteButton.classList.add("btn", "btn-danger", "btn-sm");
        deleteButton.innerHTML = "❌";
        deleteButton.onclick = () => {
            const musicId = getMusicId();
            db.ref(`comentarios/${musicId}/${commentKey}`).remove();
            displayComments(); // Atualiza a lista após exclusão
        };

        commentContainer.appendChild(deleteButton);
    }

    commentContainer.appendChild(p);
    commentPost.appendChild(commentContainer);
}

// Função para formatar o timestamp
function formatTimestamp(timestamp) {
    if (!timestamp) return "Data inválida"; // Fallback caso o timestamp não exista ou seja inválido

    const date = new Date(timestamp);

    // Verifica se a data é válida
    if (isNaN(date.getTime())) return "Data inválida"; // Se for uma data inválida, retorna "Data inválida"

    return date.toLocaleString('pt-BR'); // Caso seja válida, formata a data no formato brasileiro
}

    // Envia novo comentário
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const musicId = getMusicId();
        const commentText = textComent.value.trim();

        if (commentText === "") return;

        db.ref(`comentarios/${musicId}`).push({
            texto: commentText,
            timestamp: new Date().toISOString()
        });

        textComent.value = "";
    });

    // Ativa modo Admin
    adminLoginButton.addEventListener("click", () => {
        let senha = prompt("Digite a senha de admin:");
        if (senha === "sylv") {
            isAdmin = true;
            alert("Modo Admin ativado!");
            displayComments(); // Atualiza para mostrar ❌
        } else {
            alert("Senha incorreta!");
        }
    });

    // Recarrega comentários ao trocar de música
    player.addEventListener("loadeddata", displayComments);

    // Carrega comentários ao entrar na página
    displayComments();
    
});
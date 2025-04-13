var menuItem = document.querySelectorAll('.item-menu');

function selectlink() {
    menuItem.forEach((item) => item.classList.remove('ativo'));
    this.classList.add('ativo');
}
menuItem.forEach((item) => item.addEventListener('click', selectlink));

let isAdmin = false;

document.addEventListener("DOMContentLoaded", () => {
    const textComent = document.getElementById("inputText");
    const inputNome = document.getElementById('inputNome');
    const form = document.getElementById("formulario");
    const commentPost = document.getElementById("commentPost");
    const player = document.getElementById("player");
    const adminLoginButton = document.getElementById("adminLogin");

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

    // Função para mostrar os comentários na tela
    function displayComments() {
        const musicId = getMusicId(); // ID da música atual
        if (commentRef) {
            commentRef.off(); // Remove o listener anterior
        }
        commentRef = db.ref('comentarios/' + musicId); // Atualiza referência
        commentPost.innerHTML = "<h5>Comentários</h5>"; // Limpa a seção
        commentRef.on('child_added', function(snapshot) {
            const comentario = snapshot.val();
            addCommentToScreen(comentario.texto, comentario.timestamp, snapshot.key, comentario.nome, comentario.isAdmin); // Passa a chave do comentário
        });
    }

    // Função para adicionar comentário na tela
   function addCommentToScreen(commentText, timestamp, commentKey, nome = null, isAdminComment = false) {
    const commentContainer = document.createElement("div");
    commentContainer.classList.add("d-flex", "flex-column", "mb-3", "p-2", "rounded");

    // Destaque para comentários do admin
    if (isAdminComment) {
        commentContainer.classList.add("bg-warning-subtle", "border", "border-warning"); // Destaque para comentários do admin
    } else {
        commentContainer.classList.add("bg-white");
    }

    const p = document.createElement("p");
    p.classList.add("text-black", "mb-1");

    let innerHtml = '';

    // Mostra nome do admin sempre
    if (isAdminComment && nome) {
        innerHtml += `<strong class="text-warning">🛡️ ${nome}</strong><br>`;
    }

    // Mostra nome dos usuários comuns apenas para o admin
    if (!isAdminComment && isAdmin && nome) {
        innerHtml += `<small class="text-muted">🗣 ${nome}</small><br>`;
    }

    innerHtml += `<span>${commentText}</span><br><small class="text-muted">${formatTimestamp(timestamp)}</small>`;
    p.innerHTML = innerHtml;

    commentContainer.appendChild(p);

    // Botão deletar (visível só para o admin logado)
    if (isAdmin) {
        const deleteButton = document.createElement("button");
        deleteButton.classList.add("btn", "btn-danger", "btn-sm", "align-self-end");
        deleteButton.innerText = "❌";
        deleteButton.onclick = () => {
            const musicId = getMusicId();
            db.ref(`comentarios/${musicId}/${commentKey}`).remove();
            displayComments(); // Atualiza os comentários após deletar
        };
        commentContainer.appendChild(deleteButton);
    }

    // Coloca os comentários do admin no topo para todos
    if (isAdminComment) {
        commentPost.insertBefore(commentContainer, commentPost.firstChild);  // Coloca no topo
    } else {
        commentPost.appendChild(commentContainer);  // Coloca no final se não for admin
    }
}

    // Função para formatar o timestamp
    function formatTimestamp(timestamp) {
        if (!timestamp) return "Data inválida"; // Fallback caso o timestamp não exista ou seja inválido
        const date = new Date(timestamp);
        if (isNaN(date.getTime())) return "Data inválida"; // Se for uma data inválida, retorna "Data inválida"
        return date.toLocaleString('pt-BR'); // Caso seja válida, formata a data no formato brasileiro
    }

    // Botão para login de admin
    adminLoginButton.addEventListener('click', function() {
        const senha = prompt("Digite a senha de admin:");
        if (senha === "sylv") {
            isAdmin = true;
            alert("Modo admin ativado.");
            displayComments(); // recarrega os comentários com o admin ativo
        } else {
            alert("Senha incorreta.");
        }
    });

    // Recarrega comentários ao trocar de música
    player.addEventListener("loadeddata", displayComments);

    // Carrega comentários ao entrar na página
    displayComments();

    // Ajuste automático do tamanho do textarea conforme o conteúdo
    const textarea = document.querySelector('textarea');
    textarea.addEventListener('input', function() {
        this.style.height = 'auto';  // Reseta a altura para recalcular
        this.style.height = (this.scrollHeight) + 'px';  // Ajusta a altura conforme o conteúdo
    });
});
var menuItem = document.querySelectorAll('.item-menu');

function selectlink(){
    menuItem.forEach((item) => 
        item.classList.remove('ativo')
    );
    this.classList.add('ativo');
}

menuItem.forEach((item) =>
    item.addEventListener('click', selectlink)
);

let isAdmin = false;

document.addEventListener("DOMContentLoaded", () => {
    const textComent = document.getElementById("inputText");
    const inputNome = document.getElementById('inputNome');
    const form = document.getElementById("formulario");
    const commentPost = document.getElementById("commentPost");
    const player = document.getElementById("player");

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
        const musicId = getMusicId();
    
        if (commentRef) commentRef.off();
        
        commentRef = db.ref('comentarios/' + musicId);
        commentPost.innerHTML = "<h5>Comentários</h5>";
    
        let comentariosNormais = [];
        let comentariosAdmin = [];
    
        commentRef.on('child_added', function(snapshot) {
            const comentario = snapshot.val();
            const dados = {
                key: snapshot.key,
                texto: comentario.texto,
                timestamp: comentario.timestamp,
                nome: comentario.nome,
                isAdmin: comentario.isAdmin || false
            };
    
            if (dados.isAdmin) {
                comentariosAdmin.push(dados);
            } else {
                comentariosNormais.push(dados);
            }
    
            renderizarComentarios(comentariosAdmin, comentariosNormais);
        });
    }

    // Mostra comentário na tela
    function addCommentToScreen(commentText, timestamp, commentKey, nome = null, isAdminComment = false) {
        const commentContainer = document.createElement("div");
        commentContainer.classList.add("d-flex", "flex-column", "mb-3", "p-2", "rounded");
    
        // Aplica destaque se for comentário do admin
        if (isAdminComment) {
            commentContainer.classList.add("bg-warning-subtle", "border", "border-warning");
        } else {
            commentContainer.classList.add("bg-white");
        }
    
        const p = document.createElement("p");
        p.classList.add("text-black", "mb-1");
    
        let innerHtml = '';
    
        // ✅ Exibe o nome apenas se o comentário for de admin
        if (isAdminComment && nome) {
            innerHtml += `<strong class="text-warning">🛡️ ${nome}</strong><br>`;
        }
    
        innerHtml += `<span>${commentText}</span><br><small class="text-muted">${formatTimestamp(timestamp)}</small>`;
        p.innerHTML = innerHtml;
    
        commentContainer.appendChild(p);
    
        // ✅ Botão de deletar só aparece se o usuário logado for admin
        if (isAdmin) {
            const deleteButton = document.createElement("button");
            deleteButton.classList.add("btn", "btn-danger", "btn-sm", "align-self-end");
            deleteButton.innerText = "❌";
            deleteButton.onclick = () => {
                const musicId = getMusicId();
                db.ref(`comentarios/${musicId}/${commentKey}`).remove();
                displayComments();
            };
            commentContainer.appendChild(deleteButton);
        }
    
        // ✅ Coloca comentário de admin no topo
        if (isAdminComment) {
            commentPost.insertBefore(commentContainer, commentPost.firstChild);
        } else {
            commentPost.appendChild(commentContainer);
        }
    }

    // Função para formatar o timestamp
    function formatTimestamp(timestamp) {
        if (!timestamp) return "Data inválida";

        const date = new Date(timestamp);

        if (isNaN(date.getTime())) return "Data inválida";

        return date.toLocaleString('pt-BR');
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const texto = textComent.value.trim();
        const nome = inputNome.value.trim();
        if (texto === '' || nome === '') return;
    
        const musicId = getMusicId();
    
        db.ref('comentarios/' + musicId).push({
            nome: nome,
            texto: texto,
            timestamp: new Date().toISOString(),
            isAdmin: isAdmin  // Marca se é admin
        });
    
        textComent.value = '';
        inputNome.value = '';
    }); 

    document.getElementById('adminLogin').addEventListener('click', function() {
        const senha = prompt("Digite a senha de admin:");
        if (senha === "sylv") {
            isAdmin = true;
            alert("Modo admin ativado.");
            displayComments(); // recarrega com os nomes visíveis
        } else {
            alert("Senha incorreta.");
        }
    });

    // Recarrega comentários ao trocar de música
    player.addEventListener("loadeddata", displayComments);

    // Carrega comentários ao entrar na página
    displayComments();

    const textarea = document.querySelector('textarea');
    textarea.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });
    function renderizarComentarios(admins, comuns) {
        commentPost.innerHTML = "<h5>Comentários</h5>";
    
        // Comentários de admin (no topo)
        admins.forEach(comentario => {
            addCommentToScreen(comentario.texto, comentario.timestamp, comentario.key, comentario.nome, true);
        });
    
        // Comentários comuns
        comuns.forEach(comentario => {
            addCommentToScreen(comentario.texto, comentario.timestamp, comentario.key, comentario.nome, false);
        });
    }
});
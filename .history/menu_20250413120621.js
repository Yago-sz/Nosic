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
            addCommentToScreen(comentario.texto, comentario.timestamp, snapshot.key, comentario.nome); // Passa a chave do comentário
        });
    }

 // Mostra comentário na tela
 function addCommentToScreen(commentText, timestamp, commentKey, nome = null) {
    const commentContainer = document.createElement("div");
    commentContainer.classList.add("d-flex", "flex-column", "mb-3", "bg-white", "p-2", "rounded");

    const p = document.createElement("p");
    p.classList.add("text-black", "mb-1");

    // Começa com nome (se for admin)
    let innerHtml = '';

    if (isAdmin && nome) {
        innerHtml += `<strong class="text-warning">👒 ${nome}</strong><br>`;
    }

    // Depois o comentário e a data
    innerHtml += `<span>${commentText}</span><br><small class="text-muted">${formatTimestamp(timestamp)}</small>`;

    p.innerHTML = innerHtml;

    commentContainer.appendChild(p);

    // Botão de deletar, se admin
    if (isAdmin) {
        const deleteButton = document.createElement("button");
        deleteButton.classList.add("btn", "btn-danger", "btn-sm", "align-self-end");
        deleteButton.innerText = "❌";
        deleteButton.onclick = () => {
            const musicId = getMusicId();
            db.ref(`comentarios/${musicId}/${commentKey}`).remove();
            displayComments(); // atualiza após deletar
        };
        commentContainer.appendChild(deleteButton);
    }

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

formulario.addEventListener('submit', function(e) {
    e.preventDefault();
    const texto = inputText.value.trim();
    const nome = inputNome.value.trim();
    if (texto === '' || nome === '') return;

    const musicId = getMusicId();

    db.ref('comentarios/' + musicId).push({
        nome: nome, // nome oculto, só para o admin
        texto: texto,
        timestamp: new Date().toISOString()
    });

    inputText.value = '';
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
    this.style.height = 'auto';  // Reseta a altura para recalcular
    this.style.height = (this.scrollHeight) + 'px';  // Ajusta a altura conforme o conteúdo
});
function adicionarComentarioNaTela(texto, timestamp, nome = null) {
    const container = document.createElement('div');
    container.className = 'comentario';

    const textoElem = document.createElement('p');
    textoElem.textContent = texto;

    const data = new Date(timestamp);
    const dataElem = document.createElement('small');
    dataElem.textContent = `Postado em: ${data.toLocaleString()}`;

    container.appendChild(textoElem);

    if (isAdmin && nome) {
        const nomeElem = document.createElement('small');
        nomeElem.textContent = `👤 Nome: ${nome}`;
        container.appendChild(nomeElem);
    }

    container.appendChild(dataElem);
    commentPost.appendChild(container);
}

function adicionarComentarioNaTela(texto, timestamp, nome) {
    const div = document.createElement('div');
    div.classList.add('comentario');
  
    // Formatação do timestamp
    const data = new Date(timestamp);
    const horario = data.toLocaleString("pt-BR");
  
    let conteudoHTML = `
      <p class="comentario-texto">${texto}</p>
      <small class="comentario-timestamp">${horario}</small>
    `;
  
    // Só mostra o nome se o admin estiver logado
    if (adminLogado) {
      conteudoHTML += `<p class="comentario-nome"><strong>Nome:</strong> ${nome || "Desconhecido"}</p>`;
    }
  
    div.innerHTML = conteudoHTML;
  
    commentPost.appendChild(div);
  }
  formulario.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Salva no Firebase com nome também
    db.ref('comentarios/' + musicId).push({
      nome: nome,
      texto: texto,
      timestamp: new Date().toISOString()
    });
  
    inputText.value = '';
    document.getElementById('inputNome').value = ''; // limpa o nome também, se quiser
  });
});
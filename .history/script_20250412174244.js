import songs from "./Songs.js"; // Supondo que 'Songs.js' contém informações das músicas, incluindo o ID.

// Função para obter o ID único da música atual
function getMusicId() {
    return songs[index].id;  // Pegando o ID da música com base no índice atual
}

// Função para exibir os comentários da música
function displayComments() {
    const commentPost = document.getElementById("commentPost");  // Área onde os comentários aparecem
    commentPost.innerHTML = "<h5>Comentários</h5>";  // Mantém o título da seção de comentários

    const musicId = getMusicId(); // Obtém o ID da música atual
    const commentsRef = ref(db, 'comentarios/' + musicId); // Referência ao nó de comentários da música no Firebase

    // Ouvindo mudanças nos comentários
    onValue(commentsRef, (snapshot) => {
        const comments = snapshot.val();
        if (comments) {
            Object.values(comments).forEach(comment => {
                addCommentToScreen(comment.text); // Exibe o comentário na tela
            });
        } else {
            commentPost.innerHTML += "<p><em>Sem comentários ainda...</em></p>";
        }
    });
}

// Função para adicionar um comentário na tela (sem precisar recarregar)
function addCommentToScreen(comment) {
    const commentPost = document.getElementById("commentPost");
    let p = document.createElement("p");
    p.classList.add("p-2", "text-wrap", "text-white");
    p.innerHTML = `<strong>${comment}</strong>`;
    commentPost.appendChild(p);
}

// Evento para adicionar comentários
form.addEventListener("submit", (event) => {
    event.preventDefault();

    const musicId = getMusicId();  // Obtém o ID da música atual
    const commentText = textComent.value.trim();

    if (commentText === "") {
        return; // Impede comentários vazios
    }

    const commentsRef = ref(db, 'comentarios/' + musicId); // Referência para o nó de comentários da música

    // Salva o novo comentário no Firebase
    const newCommentRef = push(commentsRef);
    set(newCommentRef, {
        text: commentText,
        timestamp: new Date().toISOString()
    }).then(() => {
        addCommentToScreen(commentText);  // Exibe o comentário na tela
        textComent.value = "";  // Limpa o campo de texto
    }).catch((error) => {
        console.error("Erro ao salvar comentário:", error);
    });
});
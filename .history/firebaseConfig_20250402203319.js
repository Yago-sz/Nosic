// Comments.js
import { db } from "./firebaseConfig.js";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";

// Função para salvar comentários
async function salvarComentario(musicaId, comentario) {
    try {
        await addDoc(collection(db, "comentarios"), {
            musicaId: musicaId,
            comentario: comentario,
            timestamp: new Date()
        });
        console.log("Comentário salvo com sucesso!");
        carregarComentarios(musicaId); // Atualiza os comentários na tela após salvar
    } catch (error) {
        console.error("Erro ao salvar comentário:", error);
    }
}

// Função para carregar comentários da música específica
async function carregarComentarios(musicaId) {
    const querySnapshot = await getDocs(collection(db, "comentarios"));
    let comentariosHtml = "";

    querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.musicaId === musicaId) {
            comentariosHtml += `<p>${data.comentario}</p>`;
        }
    });

    const commentContainer = document.getElementById("commentPost");
    if (commentContainer) {
        commentContainer.innerHTML = comentariosHtml;
    } else {
        console.error("Elemento 'commentPost' não encontrado!");
    }
}

// Evento para enviar comentário ao clicar no botão
document.getElementById("formulario").addEventListener("submit", function (event) {
    event.preventDefault();
    
    const musicaId = "musica_teste"; // Você deve alterar para pegar o ID real da música
    const comentario = document.getElementById("inputText").value;
    
    if (comentario.trim() !== "") {
        salvarComentario(musicaId, comentario);
        document.getElementById("inputText").value = ""; // Limpa o campo de comentário
    } else {
        alert("Digite um comentário antes de enviar!");
    }
});

// Carrega os comentários ao carregar a página (ajuste conforme necessário)
window.addEventListener("DOMContentLoaded", () => {
    const musicaId = "musica_teste"; // Mudar para a música correta dinamicamente
    carregarComentarios(musicaId);
});
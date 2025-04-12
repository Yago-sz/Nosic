// Importando o Firebase e Firestore
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyB6Ot...D91-FUKRc",
    authDomain: "nosic-a658c.firebaseapp.com",
    projectId: "nosic-a658c",
    storageBucket: "nosic-a658c.appspot.com",
    messagingSenderId: "490012252198",
    appId: "1:490012252198:web:a04dfbb7863757e5b72ee7",
    measurementId: "G-97TFMCJ9QT"
};

// Inicializando o Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, addDoc, getDocs };

import { db, collection, addDoc, getDocs } from "./firebaseConfig.js";

// Função para salvar o comentário no Firestore
async function salvarComentario(musicaId, comentario) {
    try {
        await addDoc(collection(db, "comentarios"), {
            musicaId: musicaId,
            comentario: comentario,
            timestamp: new Date()
        });

        console.log("Comentário salvo com sucesso!");
        carregarComentarios(musicaId); // Atualiza os comentários na tela
    } catch (error) {
        console.error("Erro ao salvar comentário:", error);
    }
}

// Função para carregar os comentários da música selecionada
async function carregarComentarios(musicaId) {
    const querySnapshot = await getDocs(collection(db, "comentarios"));
    let comentariosHtml = "";

    querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.musicaId === musicaId) {
            comentariosHtml += `<p>${data.comentario}</p>`;
        }
    });

    document.getElementById("commentPost").innerHTML = comentariosHtml;
}

// Adicionando evento ao formulário
document.getElementById("formulario").addEventListener("submit", async function (event) {
    event.preventDefault();
    const inputText = document.getElementById("inputText").value;
    const musicaId = "musica123"; // Substituir pelo ID correto da música

    if (inputText.trim() !== "") {
        await salvarComentario(musicaId, inputText);
        document.getElementById("inputText").value = ""; // Limpa o campo de texto após envio
    }
});

// Carregar comentários ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
    const musicaId = "musica123"; // Substituir pelo ID correto da música
    carregarComentarios(musicaId);
});

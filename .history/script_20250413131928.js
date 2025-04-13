import songs from "./Songs.js"; // Supondo que 'Songs.js' contém informações das músicas, incluindo o ID.

// Função para obter o ID único da música atual
function getMusicId() {
    return songs[index].id;  // Pegando o ID da música com base no índice atual
}

// Selecionando elementos do player
const player = document.querySelector("#player");
const musicName = document.querySelector("#musicName");
const playPauseButton = document.querySelector("#playPauseButton");
const prevButton = document.querySelector("#prevButton");
const nextButton = document.querySelector("#nextButton");
const currentTime = document.querySelector("#currentTime");
const duration = document.querySelector("#duration");
const progressBar = document.querySelector(".progress-bar");
const progress = document.querySelector(".progress");
const musicCover = document.querySelector("#musicCover");
const textButtonPlay = "<i class='bx bx-caret-right'></i>";
const textButtonPause = "<i class='bx bx-pause'></i>";

let index = 0;




// Função para carregar uma música
const loadMusic = (index) => {
    player.src = songs[index].src;
    musicName.innerHTML = songs[index].name;
    musicCover.src = songs[index].cover;
    player.load();
    displayComments();  // Carrega os comentários da música atual
};


// Função Play/Pause
const playPause = () => {
    if (player.paused) {
        player.play().then(() => {
            playPauseButton.innerHTML = textButtonPause;
        }).catch(error => console.error("Erro ao tentar dar play:", error));
    } else {
        player.pause();
        playPauseButton.innerHTML = textButtonPlay;
    }
};


player.ontimeupdate = () => updateTime();

const updateTime = () => {
  const currentMinutes = Math.floor(player.currentTime / 60);
  const currentSeconds = Math.floor(player.currentTime % 60);
  currentTime.textContent = currentMinutes + ":" + formatZero(currentSeconds);

  const durationFormatted = isNaN(player.duration) ? 0 : player.duration;
  const durationMinutes = Math.floor(durationFormatted / 60);
  const durationSeconds = Math.floor(durationFormatted % 60);
  duration.textContent = durationMinutes + ":" + formatZero(durationSeconds);

  const progressWidth = durationFormatted
    ? (player.currentTime / durationFormatted) * 100
    : 0;

  progress.style.width = progressWidth + "%";
};





progressBar.onclick = (e) => {
  const newTime = (e.offsetX / progressBar.offsetWidth) * player.duration;
  player.currentTime = newTime;
};

// Função para alternar entre músicas
const prevNextMusic = (type = "next") => {
    index = (type === "next") ? (index + 1) % songs.length : (index - 1 + songs.length) % songs.length;
    loadMusic(index);
    playPause(); // 🔥 Toca automaticamente
};

// Atualizar tempo e barra de progresso
player.ontimeupdate = () => {
    const currentMinutes = Math.floor(player.currentTime / 60);
    const currentSeconds = Math.floor(player.currentTime % 60);
    currentTime.textContent = currentMinutes + ":" + formatZero(currentSeconds);

    const durationFormatted = isNaN(player.duration) ? 0 : player.duration;
    const durationMinutes = Math.floor(durationFormatted / 60);
    const durationSeconds = Math.floor(durationFormatted % 60);
    duration.textContent = durationMinutes + ":" + formatZero(durationSeconds);

    const progressWidth = durationFormatted ? (player.currentTime / durationFormatted) * 100 : 0;
    progress.style.width = progressWidth + "%";
};
prevButton.onclick = () => {
    const currentTime = new Date().getTime(); // Hora do clique atual
    const timeDifference = currentTime - lastClickTime; // Diferença de tempo entre os cliques
    
    if (timeDifference < 500) {  // Se o tempo entre os cliques for menor que 500ms, é considerado um clique duplo
        goToPreviousMusic(); // Vai para a música anterior
    } else {
        restartMusic();  // Reinicia a música
    }

    lastClickTime = currentTime; // Atualiza o tempo do último clique
};
const restartMusic = () => {
    player.currentTime = 0;  // Reinicia a música
    player.play();  // Recomeça a música
};
const goToPreviousMusic = () => {
    index = (index - 1 + songs.length) % songs.length;  // Vai para a música anterior
    loadMusic(index);  // Carrega a música anterior
    playPause();  // Toca a música anterior
};

// Atualizar tempo quando clicar na barra de progresso
progressBar.onclick = (e) => {
    const newTime = (e.offsetX / progressBar.offsetWidth) * player.duration;
    player.currentTime = newTime;
};

// Formatar segundos para 00:00
const formatZero = (n) => (n < 10 ? "0" + n : n);

// Adicionando eventos aos botões
playPauseButton.onclick = playPause;
prevButton.onclick = () => prevNextMusic("prev");
nextButton.onclick = () => prevNextMusic("next");

// Iniciar com a primeira música
loadMusic(0);

function alterarImagemCapa(caminhoImagem) {
    const imagemCapa = document.getElementById("musicCover");
    imagemCapa.src = caminhoImagem;
  }
  
  const musica = {
    nome: "Nome da Música",
    arquivo: "caminho-da-musica.mp3",
    capa: "caminho-da-imagem-da-musica.jpg"
  };
  
  function carregarMusica(musica) {
    const player = document.getElementById("audioPlayer");
    player.src = musica.arquivo;
    alterarImagemCapa(musica.capa);
  }
  
  carregarMusica(musica);

  document.addEventListener("DOMContentLoaded", () => {
    const inputText = document.getElementById("inputText"); // Campo de texto
    const form = document.getElementById("formulario"); // Formulário
    const commentPost = document.getElementById("commentPost"); // Área onde os comentários aparecem
    const player = document.getElementById("player"); // Player de música

    console.log("Página carregada!"); // Verifica se o JS está rodando

    // Função para obter o ID único para cada música
    function getMusicId() {
        return songs[index].id;  // Pegando o ID da música com base no índice atual
    }

    // Função para adicionar um comentário na tela (sem precisar recarregar)
    function addCommentToScreen(comment, isAdmin = false) {
        const commentContainer = document.createElement("div");
        commentContainer.classList.add("comment-container", "p-2", "text-wrap", "text-black");
    
        let p = document.createElement("p");
        p.innerHTML = isAdmin
            ? `<strong class="text-warning">🛡️ Admin: </strong><span>${comment}</span>`
            : `<span>${comment}</span>`;
    
        commentContainer.appendChild(p);
    
        // Se for um comentário de admin, insira no topo
        if (isAdmin) {
            commentPost.insertBefore(commentContainer, commentPost.firstChild);
        } else {
            commentPost.appendChild(commentContainer);  // Coloca no final
        }
    }

    // Função para carregar os comentários do Firebase
    function loadComments() {
        const musicId = getMusicId();
        commentPost.innerHTML = ''; // Limpa os comentários antigos

        // Carregar comentários da Firebase
        db.ref(`comentarios/${musicId}`).on('child_added', function(snapshot) {
            const comment = snapshot.val();
            addCommentToScreen(comment.texto, comment.isAdmin);  // Passa o `isAdmin` junto com o comentário
        });
    }

    // Verifique se o usuário é admin (isso depende da sua lógica de login)
    const isAdmin = false; // Aqui você pode implementar a verificação de admin (login/admin flag)

    // Enviar novo comentário
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const texto = inputText.value.trim();
        if (texto === '') return;

        const musicId = getMusicId();

        // Salvar o novo comentário no Firebase
        const newCommentRef = db.ref(`comentarios/${musicId}`).push();
        newCommentRef.set({
            texto: texto,
            timestamp: new Date().toISOString(),
            isAdmin: isAdmin  // Passando o flag `isAdmin`
        }).then(() => {
            addCommentToScreen(texto, isAdmin);  // Adiciona à tela diretamente
            inputText.value = '';  // Limpa o campo de texto
        }).catch((error) => {
            console.error("Erro ao salvar comentário:", error);
        });
    });

    // Carregar comentários assim que a página é carregada
    loadComments();
});
function getMusicaAtualId() {
    const nome = document.getElementById('musicName').innerText;
    // Transforma em um ID seguro (ex: "Lo-Fi Beats" -> "lo-fi-beats")
    return nome.trim().toLowerCase().replace(/\s+/g, '-');
  }


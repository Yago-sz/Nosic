import songs from "./Songs.js";

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
    const textComent = document.getElementById('inputText'); // Campo de texto
    const form = document.getElementById('formulario'); // Formulário
    const commentPost = document.getElementById('commentPost'); // Área onde os comentários aparecem
    const player = document.getElementById('player'); // Player de música

    // Função para obter um ID único para cada música
    function getMusicId() {
        return player.src || "default";
    }

    // Função para carregar e exibir os comentários na tela
    function displayComments() {
        commentPost.innerHTML = "<h5>Comentários</h5>"; // Reseta os comentários antes de adicionar os novos

        let comments = JSON.parse(localStorage.getItem('comments')) || {};
        let musicId = getMusicId();

        if (comments[musicId]) {
            comments[musicId].forEach(comment => {
                let p = document.createElement('p');
                p.classList.add('p-2', 'text-wrap', 'text-white');
                p.innerHTML = `<strong>${comment}</strong>`;
                commentPost.appendChild(p);
            });
        }
    }

    // Evento para adicionar comentários ao clicar no botão
    form.addEventListener('submit', (event) => {
        event.preventDefault(); // Impede o reload da página

        const musicId = getMusicId();
        const commentText = textComent.value.trim();

        if (commentText === "") return; // Impede comentários vazios

        let comments = JSON.parse(localStorage.getItem('comments')) || {};
        if (!comments[musicId]) {
            comments[musicId] = [];
        }

        comments[musicId].push(commentText);
        localStorage.setItem('comments', JSON.stringify(comments));

        textComent.value = ""; // Limpa o campo de entrada

        displayComments(); // Atualiza os comentários na tela imediatamente
    });

    // Atualiza os comentários ao carregar a página
    displayComments();
});
// ==========================================
// 1. PERSONALIZE SUA PLAYLIST AQUI
// ==========================================
const playlist = [
    {
        title: "Nossa Música #1",
        note: "Coloquei essa porque sempre me lembra a primeira vez que a gente ficou.",
        cover: "foto1.jpeg", // Usa a própria foto de vocês como capa da primeira faixa!
        src: "Orgânico Verão 1 - Lourena e Sant - Dizeres - Rap Box.mp3"
    },
    {
        title: "Vibe de Sexta",
        note: "A trilha sonora oficial dos nossos rolês.",
        src: "Pitty - Dançando.mp3"
    },
    {
        title: "Só Pra Você Ouvir",
        note: "Presta atenção na letra dessa aqui...",
        src: "Maneva - Seja Para Mim.mp3"
    },
    {
        src: "Charlie Brown Jr - Céu Azul.mp3"
    },
    {
        src: "Edu Ribeiro - Me Namora.mp3"
    },
    {
        src: "IZA - Meu Talismã.mp3"
    },
    {
        src: "Maneva - Luz Que Me Traz Paz.mp3"
    },
    {
        src: "Pitty - Dançando.mp3"
    },
    {
        src: "SOJA - True Love.mp3"
    },
    {
        src: "Vibrações - Olhos Verdes.mp3"
    }
];

// ==========================================
// 2. PERSONALIZE AS PERGUNTAS DO QUIZ E SEU WHATSAPP
// ==========================================
const seuNumeroWhatsApp = "5582999011318"; // Coloque seu número com DDD (ex: 5582999999999)

const quizData = [
    {
        question: "Qual a vibe ideal pro nosso próximo encontro?",
        options: [
            "🍿 Preguiça, filme e pedir pizza de camarão",
            "🍻 Sair pra beber num barzinho duvidoso e conversar até tarde",
            "🍔 Jantar em algum lugar legal (pastelzinho do seu Zé)",
            "🌙 Dar uma volta sem rumo ouvindo música na sua motoquinha"
        ]
    },
    {
        question: "O que não pode faltar de jeito nenhum?",
        options: [
            "Música boa tocando",
            "Comida boa (prioridades!)",
            "Muitos beijos (óbvio)",
            "Boas risadas e zero pressa"
        ]
    },
    {
        question: "Quando a gente vai colocar esse plano em prática?",
        options: [
            "Hoje mesmo se deixar 👀",
            "Nesse final de semana",
            "Você escolhe o dia, eu só vou",
            "Vou te sequestrar jaja"
        ]
    }
];

// ==========================================
// LÓGICA DO PLAYER DE ÁUDIO
// ==========================================
let currentTrackIndex = 0;
let isPlaying = false;
const audio = document.getElementById('audio-player');
const progressBar = document.getElementById('progress-bar');

function loadTrack(index) {
    currentTrackIndex = index;
    const track = playlist[index];
    document.getElementById('track-title').innerText = track.title;
    document.getElementById('track-artist').innerText = track.artist;
    document.getElementById('track-note').innerText = `"${track.note}"`;
    document.getElementById('track-cover').src = track.cover;
    audio.src = track.src;
    renderPlaylist();
}

function startExperience() {
    const welcome = document.getElementById('welcome-screen');
    welcome.style.opacity = '0';
    setTimeout(() => welcome.style.display = 'none', 500);
    
    loadTrack(0);
    audio.volume = 0.5;
    audio.play().then(() => {
        isPlaying = true;
        updatePlayIcon();
    }).catch(e => console.log("Erro ao tocar áudio:", e));
}

function togglePlay() {
    if (isPlaying) {
        audio.pause();
        isPlaying = false;
    } else {
        audio.play();
        isPlaying = true;
    }
    updatePlayIcon();
}

function updatePlayIcon() {
    const icon = document.getElementById('play-icon');
    if (isPlaying) {
        icon.innerHTML = '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>';
    } else {
        icon.innerHTML = '<path d="M8 5v14l11-7z"/>';
    }
}

function nextTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    loadTrack(currentTrackIndex);
    if (isPlaying) audio.play();
}

function prevTrack() {
    currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    loadTrack(currentTrackIndex);
    if (isPlaying) audio.play();
}

function selectTrack(index) {
    loadTrack(index);
    audio.play();
    isPlaying = true;
    updatePlayIcon();
}

function renderPlaylist() {
    const container = document.getElementById('playlist-container');
    container.innerHTML = playlist.map((track, idx) => `
        <button onclick="selectTrack(${idx})" class="w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition ${idx === currentTrackIndex ? 'bg-emerald-500/25 text-emerald-300 font-bold' : 'hover:bg-white/10 text-zinc-200'}">
            <div class="truncate pr-2">
                <span>${idx + 1}. ${track.title}</span>
                <span class="text-zinc-400 ml-1">- ${track.artist}</span>
            </div>
            <span>${idx === currentTrackIndex ? '🔊' : '▶️'}</span>
        </button>
    `).join('');
}

audio.addEventListener('timeupdate', () => {
    if (audio.duration) {
        const progress = (audio.currentTime / audio.duration) * 100;
        progressBar.value = progress;
        document.getElementById('current-time').innerText = formatTime(audio.currentTime);
        document.getElementById('duration').innerText = formatTime(audio.duration);
    }
});

audio.addEventListener('ended', nextTrack);

progressBar.addEventListener('input', () => {
    if (audio.duration) {
        audio.currentTime = (progressBar.value / 100) * audio.duration;
    }
});

function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

// ==========================================
// LÓGICA DO QUIZ
// ==========================================
let currentQuestion = 0;
let userAnswers = [];

function renderQuiz() {
    const q = quizData[currentQuestion];
    document.getElementById('quiz-step').innerText = `${currentQuestion + 1} de ${quizData.length}`;
    document.getElementById('quiz-question').innerText = q.question;
    
    const optionsContainer = document.getElementById('quiz-options');
    optionsContainer.innerHTML = q.options.map(opt => `
        <button onclick="answerQuiz('${opt}')" class="w-full text-left p-3.5 rounded-xl bg-white/10 hover:bg-purple-500/30 border border-white/15 hover:border-purple-400 text-sm transition">
            ${opt}
        </button>
    `).join('');
}

function answerQuiz(answer) {
    userAnswers.push(answer);
    if (currentQuestion + 1 < quizData.length) {
        currentQuestion++;
        renderQuiz();
    } else {
        showResult();
    }
}

function showResult() {
    document.getElementById('quiz-box').classList.add('hidden');
    document.getElementById('quiz-result').classList.remove('hidden');

    const summary = `• <b>Vibe:</b> ${userAnswers[0]}<br>• <b>Essencial:</b> ${userAnswers[1]}<br>• <b>Quando:</b> ${userAnswers[2]}`;
    document.getElementById('result-summary').innerHTML = summary;

    const msgWhats = `Oi! Respondi seu quiz e quero resgatar meu vale-encontro:\n\n- ${userAnswers[0]}\n- ${userAnswers[1]}\n- ${userAnswers[2]}`;
    document.getElementById('whatsapp-btn').href = `https://wa.me/${seuNumeroWhatsApp}?text=${encodeURIComponent(msgWhats)}`;
}

function resetQuiz() {
    currentQuestion = 0;
    userAnswers = [];
    document.getElementById('quiz-result').classList.add('hidden');
    document.getElementById('quiz-box').classList.remove('hidden');
    renderQuiz();
}

// Inicializa o Quiz
renderQuiz();

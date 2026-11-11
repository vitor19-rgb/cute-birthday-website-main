/* ================================================================
   TRANSIÇÃO DE DESFOQUE ENTRE PÁGINAS — funciona em TODAS as páginas
================================================================= */
(function(){
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.body.classList.remove('blur-in-start');
    });
  });
})();

document.body.addEventListener('click', function(e){
  const link = e.target.closest('a');
  if (!link) return;
  const href = link.getAttribute('href');
  if (!href || href.startsWith('#') || href.startsWith('http')) return;

  e.preventDefault();
  document.body.classList.add('blur-out');
  if (typeof saveMusicState === 'function') saveMusicState();
  setTimeout(() => { window.location.href = href; }, 550);
});

/* ================================================================
   A NOTINHA DELA — botão de recado que pode ser editado
   -----------------------------------------------------------
   Funciona em TODAS as páginas. É salvo usando localStorage,
   então continua lá mesmo se o navegador for fechado.
================================================================= */
const NOTE_STORAGE_KEY = 'gfNoteContent';

let noteBtn = document.getElementById('noteBtn');
if (!noteBtn){
  noteBtn = document.createElement('button');
  noteBtn.id = 'noteBtn';
  noteBtn.className = 'note-btn';
  noteBtn.setAttribute('aria-label', 'escrever uma notinha');
  noteBtn.title = 'deixe um recadinho';
  noteBtn.innerHTML = '<span class="note-icon">📝</span>';
  document.body.appendChild(noteBtn);
}

let noteOverlay = document.getElementById('noteOverlay');
if (!noteOverlay){
  noteOverlay = document.createElement('div');
  noteOverlay.id = 'noteOverlay';
  noteOverlay.className = 'note-overlay';
  
  // Aqui eu adicionei o botão de salvar e a área de exibição da mensagem
  noteOverlay.innerHTML = `
    <div class="note-paper" id="notePaper">
      <button class="note-close" id="noteClose" aria-label="fechar nota">✕</button>
      <h3 class="note-title">só para você preencher 💌</h3>
      <p class="note-hint">escreva o que quiser me dizer, ou a nossa lista de desejos para o futuro~</p>
      <textarea id="noteTextarea" class="note-textarea" placeholder="meu amor... eu queria te dizer..."></textarea>
      
      <button id="noteSaveBtn" style="margin-top: 10px; padding: 10px 20px; border-radius: 8px; border: none; background: #ff6b81; color: white; font-family: 'Quicksand', sans-serif; font-weight: bold; cursor: pointer; font-size: 1rem; width: 100%; transition: 0.3s;">Salvar Mensagem</button>
      
      <div id="noteDisplayArea" style="margin-top: 15px; font-family: 'Quicksand', sans-serif; font-size: 0.95rem; color: #555; white-space: pre-wrap; max-height: 120px; overflow-y: auto; text-align: left; padding: 10px; background: rgba(255,255,255,0.6); border-radius: 8px; border: 1px dashed #ff6b81; display: none;"></div>

      <span class="note-saved" id="noteSaved">salvo ✓</span>
    </div>
  `;
  document.body.appendChild(noteOverlay);
}

const noteTextarea = document.getElementById('noteTextarea');
const noteClose    = document.getElementById('noteClose');
const noteSavedTag = document.getElementById('noteSaved');
const noteSaveBtn  = document.getElementById('noteSaveBtn');
const noteDisplayArea = document.getElementById('noteDisplayArea');

// Carrega o texto salvo (se houver) ao iniciar
const savedText = localStorage.getItem(NOTE_STORAGE_KEY) || '';
noteTextarea.value = savedText;
if (savedText.trim() !== '') {
    noteDisplayArea.textContent = savedText;
    noteDisplayArea.style.display = 'block';
}

function openNote(){
  noteOverlay.classList.add('open');
  setTimeout(() => noteTextarea.focus(), 200);
}

function closeNote(){
  noteOverlay.classList.remove('open');
}

noteBtn.addEventListener('click', openNote);
noteClose.addEventListener('click', closeNote);

noteOverlay.addEventListener('click', (e) => {
  if (e.target === noteOverlay) closeNote();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && noteOverlay.classList.contains('open')) closeNote();
});

// Ação de clique no botão salvar
noteSaveBtn.addEventListener('click', () => {
  const text = noteTextarea.value;
  localStorage.setItem(NOTE_STORAGE_KEY, text); // Salva no navegador
  
  if (text.trim() !== '') {
      noteDisplayArea.textContent = text;
      noteDisplayArea.style.display = 'block'; // Mostra a caixa com o texto
  } else {
      noteDisplayArea.style.display = 'none'; // Esconde se estiver vazio
  }

  // Mostra o "salvo ✓" bonitinho
  noteSavedTag.classList.remove('show');
  void noteSavedTag.offsetWidth; // Força o reflow para a animação reiniciar
  noteSavedTag.classList.add('show');
  setTimeout(() => noteSavedTag.classList.remove('show'), 1400);
});


/* ================================================================
   MÚSICA DE FUNDO CONTÍNUA — funciona em TODAS as páginas
   -----------------------------------------------------------
   Para trocar a música, basta substituir o arquivo assets/music.mp3
================================================================= */
const MUSIC_STORAGE_KEY = 'bgMusicState';

let bgMusic = document.getElementById('bgMusic');
if (!bgMusic){
  bgMusic = document.createElement('audio');
  bgMusic.id = 'bgMusic';
  bgMusic.loop = true;
  bgMusic.preload = 'auto';
  const source = document.createElement('source');
  source.src = 'assets/music.mp3';
  source.type = 'audio/mpeg';
  bgMusic.appendChild(source);
  document.body.appendChild(bgMusic);
}

let musicBtn = document.getElementById('musicBtn');
if (!musicBtn){
  musicBtn = document.createElement('button');
  musicBtn.id = 'musicBtn';
  musicBtn.className = 'music-btn';
  musicBtn.setAttribute('aria-label', 'tocar música');
  musicBtn.title = 'tocar nossa música';
  musicBtn.innerHTML = '<span class="music-icon">🎵</span>';
  document.body.appendChild(musicBtn);
}

const musicIcon = musicBtn.querySelector('.music-icon');
let noteInterval = null;

function spawnMusicNote(){
  const notes = ['🎵', '🎶', '💫'];
  const note = document.createElement('span');
  note.className = 'music-note';
  note.textContent = notes[Math.floor(Math.random() * notes.length)];
  note.style.setProperty('--drift', (Math.random() * 40 - 20) + 'px');
  musicBtn.appendChild(note);
  setTimeout(() => note.remove(), 1400);
}

function setMusicUI(isPlaying){
  musicBtn.classList.toggle('playing', isPlaying);
  musicIcon.textContent = isPlaying ? '🎶' : '🎵';
  clearInterval(noteInterval);
  if (isPlaying) noteInterval = setInterval(spawnMusicNote, 500);
}

function saveMusicState(){
  sessionStorage.setItem(MUSIC_STORAGE_KEY, JSON.stringify({
    playing: !bgMusic.paused,
    time: bgMusic.currentTime || 0
  }));
}

const savedMusicState = JSON.parse(sessionStorage.getItem(MUSIC_STORAGE_KEY) || 'null');

function resumeMusic(){
  if (!savedMusicState || !savedMusicState.playing) return;
  bgMusic.currentTime = savedMusicState.time || 0;
  bgMusic.play().then(() => {
    setMusicUI(true);
  }).catch(() => {
    setMusicUI(false);
  });
}

if (savedMusicState){
  if (bgMusic.readyState >= 1){
    resumeMusic();
  } else {
    bgMusic.addEventListener('loadedmetadata', resumeMusic, { once: true });
  }
}

musicBtn.addEventListener('click', () => {
  if (bgMusic.paused){
    bgMusic.play().catch(() => {});
    setMusicUI(true);
  } else {
    bgMusic.pause();
    setMusicUI(false);
  }
  saveMusicState();
});

bgMusic.addEventListener('timeupdate', () => {
  if (!bgMusic.paused) saveMusicState();
});

window.addEventListener('beforeunload', saveMusicState);

/* ================================================================
   FUNDO COM CORAÇÕES E ESTRELAS FLUTUANTES
================================================================= */
const floatingBg = document.getElementById('floating-bg');
const floatEmojis = ['💖', '✨', '🩷', '💫', '💙', '💜'];

if (floatingBg){
  function spawnFloaty(){
    const el = document.createElement('div');
    el.className = 'floaty';
    el.textContent = floatEmojis[Math.floor(Math.random() * floatEmojis.length)];
    el.style.left = Math.random() * 100 + 'vw';
    el.style.fontSize = (16 + Math.random() * 18) + 'px';
    const duration = 8 + Math.random() * 8;
    el.style.animationDuration = duration + 's';
    floatingBg.appendChild(el);
    setTimeout(() => el.remove(), duration * 1000);
  }
  setInterval(spawnFloaty, 700);
}

/* ================================================================
   EFEITO MÁQUINA DE ESCREVER — só funciona no letter.html
================================================================= */
const letterMessage = "Faz 8 meses que te conheci. Eu sei que não sou a pessoa mais fácil de lidar e sei que às vezes sou irritante, mas eu gosto de verdade de você. Gosto muito de passar o meu tempo ao seu lado. Sei que muitas vezes não demonstro isso porque sou mais fechado, mas quero que saiba que vou dar o meu melhor. Quero aproveitar meu tempo com você, falando, conversando e dividindo a vida. Eu sei que não vai ser fácil, a gente vai brigar, mas sempre vamos dar um jeito de nos acertar. Quero que um puxe a orelha do outro quando precisar, porque, no final das contas, nós dois estamos aprendendo juntos o que é amar alguém.";
const letterEl = document.getElementById('letter-text');
let typeIndex = 0;

function typeWriter(){
  if (!letterEl) return;
  if (typeIndex < letterMessage.length){
    const chunk = letterMessage.slice(0, typeIndex + 1).replace(/\n/g, '<br>');
    letterEl.innerHTML = chunk + '<span class="cursor">&nbsp;</span>';
    typeIndex++;
    setTimeout(typeWriter, 22);
  } else {
    letterEl.innerHTML = letterMessage.replace(/\n/g, '<br>');
  }
}

/* ================================================================
   EXPLOSÃO DE CONFETES — só funciona no letter.html
================================================================= */
const canvas = document.getElementById('confetti-canvas');

if (canvas){
  const ctx = canvas.getContext('2d');
  let confettiPieces = [];
  const confettiColors = ['#ffd6e8', '#ff9fc7', '#d6ecff', '#a8d8ff', '#e6d9ff', '#c7a9ff', '#ffffff'];

  function resizeCanvas(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  function createConfetti(){
    confettiPieces = [];
    const count = 140;
    for (let i = 0; i < count; i++){
      confettiPieces.push({
        x: Math.random() * canvas.width,
        y: -20 - Math.random() * canvas.height * 0.5,
        size: 6 + Math.random() * 6,
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        speedY: 2 + Math.random() * 3,
        speedX: (Math.random() - 0.5) * 2,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 8,
        shape: Math.random() > 0.5 ? 'circle' : 'rect'
      });
    }
  }

  let confettiActive = false;
  let confettiFrames = 0;
  const maxConfettiFrames = 260;

  function animateConfetti(){
    if (!confettiActive) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    confettiPieces.forEach(p => {
      p.y += p.speedY;
      p.x += p.speedX;
      p.rotation += p.rotationSpeed;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation * Math.PI / 180);
      ctx.fillStyle = p.color;

      if (p.shape === 'circle'){
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size * 0.6);
      }
      ctx.restore();
    });

    confettiFrames++;
    if (confettiFrames < maxConfettiFrames){
      requestAnimationFrame(animateConfetti);
    } else {
      confettiActive = false;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  function fireConfetti(){
    createConfetti();
    confettiActive = true;
    confettiFrames = 0;
    animateConfetti();
  }

  window.addEventListener('load', () => {
    typeWriter();
    fireConfetti();
  });
}
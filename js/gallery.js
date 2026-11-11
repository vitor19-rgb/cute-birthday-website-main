/* ================================================================
   INTERACTIVE PHOTO SLIDESHOW — gallery.html only
   -----------------------------------------------------------
   Galeria adaptada para 4 fotos e legendas em português
================================================================= */
const photos = [
  {
    src: "photos/photo1.jpg",
    caption: "A primeira de muitas lembranças. Desde o começo eu já sabia que você seria especial."
  },
  {
    src: "photos/photo2.jpg",
    caption: "Você faz até os dias mais normais parecerem uma aventura incrível, fofuxa."
  },
  {
    src: "photos/photo3.jpg",
    caption: "Nenhum abraço no mundo se compara ao seu. É o meu lugar favorito."
  },
  {
    src: "photos/photo4.jpg",
    caption: "Já são 8 meses construindo histórias e 4 meses tendo você como minha namorada oficial. Te amo!"
  }
];

const photoEl    = document.getElementById('currentPhoto');
const captionEl  = document.getElementById('currentCaption');
const counterEl  = document.getElementById('counter');
const polaroidEl = document.getElementById('polaroid');
const dotsWrap   = document.getElementById('dots');
const prevBtn    = document.getElementById('prevBtn');
const nextBtn    = document.getElementById('nextBtn');
const photoStage = document.getElementById('photoStage');

let currentIndex = 0;
let isAnimating  = false;

const tilts = ['-3deg', '2deg', '-1.5deg', '3deg'];

// Recria as bolinhas caso o HTML original tenha sumido com alguma
dotsWrap.innerHTML = '';
photos.forEach((_, i) => {
  const dot = document.createElement('button');
  dot.className = i === 0 ? 'dot active' : 'dot';
  dot.dataset.index = i;
  dot.setAttribute('aria-label', `foto ${i + 1}`);
  dotsWrap.appendChild(dot);
});

function renderSlide(newIndex){
  if (isAnimating || newIndex === currentIndex) return;
  isAnimating = true;

  photoEl.classList.add('is-transitioning');
  captionEl.classList.add('is-transitioning');

  setTimeout(() => {
    currentIndex = newIndex;
    const data = photos[currentIndex];

    photoEl.src = data.src;
    photoEl.alt = "lembrança " + (currentIndex + 1);
    captionEl.textContent = data.caption;
    counterEl.textContent = `foto ${currentIndex + 1} de ${photos.length}`;
    polaroidEl.style.setProperty('--tilt', tilts[currentIndex % tilts.length]);

    dotsWrap.querySelectorAll('.dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });

    requestAnimationFrame(() => {
      photoEl.classList.remove('is-transitioning');
      captionEl.classList.remove('is-transitioning');
      isAnimating = false;
    });
  }, 400);
}

function goNext(){
  renderSlide((currentIndex + 1) % photos.length);
}

function goPrev(){
  renderSlide((currentIndex - 1 + photos.length) % photos.length);
}

nextBtn.addEventListener('click', goNext);
prevBtn.addEventListener('click', goPrev);

dotsWrap.querySelectorAll('.dot').forEach((dot) => {
  dot.addEventListener('click', () => {
    renderSlide(parseInt(dot.dataset.index, 10));
  });
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') goNext();
  if (e.key === 'ArrowLeft')  goPrev();
});

let touchStartX = 0;
photoStage.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

photoStage.addEventListener('touchend', (e) => {
  const touchEndX = e.changedTouches[0].screenX;
  const delta = touchEndX - touchStartX;
  if (Math.abs(delta) > 40){
    if (delta < 0) goNext();
    else goPrev();
  }
}, { passive: true });

polaroidEl.addEventListener('click', (e) => {
  const rect = polaroidEl.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const heart = document.createElement('span');
  heart.className = 'mini-heart';
  heart.textContent = ['💖','💕','✨','🩷'][Math.floor(Math.random() * 4)];
  heart.style.left = x + 'px';
  heart.style.top  = y + 'px';
  polaroidEl.appendChild(heart);

  setTimeout(() => heart.remove(), 1000);
});

// Força o carregamento da primeira imagem e texto logo de cara com o nome certo
photoEl.src = photos[0].src;
captionEl.textContent = photos[0].caption;
counterEl.textContent = `foto 1 de ${photos.length}`;
polaroidEl.style.setProperty('--tilt', tilts[0]);
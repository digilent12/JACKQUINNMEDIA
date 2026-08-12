
const BASE_URL = './images/';

const photos = [
  { file: 'DSC01140.jpg', tall: true },
  { file: 'DSC01574.jpg', tall: false },
  { file: 'DSC01903.jpg', tall: false },
  { file: 'DSC02499.jpg', tall: false },
  { file: 'DSC02733.jpg', tall: false },
  { file: 'DSC03190.jpg', tall: false },
  { file: 'DSC03486.jpg', tall: false },
  { file: 'DSC03540.jpg', tall: false },
  { file: 'DSC04039.jpg', tall: true },
  { file: 'DSC04062.jpg', tall: false },
  { file: 'DSC04090.jpg', tall: true },
  { file: 'DSC05403.jpg', tall: false },
  { file: 'DSC05524.jpg', tall: false },
  { file: 'DSC05911.jpg', tall: false },
  { file: 'DSC05998.jpg', tall: false },
  { file: 'DSC06035.jpg', tall: false },
  { file: 'DSC06204.jpg', tall: false },
  { file: 'DSC06275.jpg', tall: false },
  { file: 'DSC06554.jpg', tall: false },
  { file: 'DSC06611.jpg', tall: false },
  { file: 'DSC06997.jpg', tall: false },
  { file: 'DSC07092.jpg', tall: false },
  { file: 'DSC07158.jpg', tall: false },
  { file: 'DSC07185.jpg', tall: false },
  { file: 'DSC07302.jpg', tall: false },
  { file: 'DSC07523.jpg', tall: true },
  { file: 'DSC07575.jpg', tall: true },
  { file: 'DSC07696.jpg', tall: false },
  { file: 'DSC07787.jpg', tall: true },
  { file: 'DSC07941.jpg', tall: false },
  { file: 'DSC08022.jpg', tall: false },
  { file: 'DSC08658.jpg', tall: false },
  { file: 'DSC09227.jpg', tall: true }
];

function photoUrl(file) {
  return BASE_URL + file;
}

function buildGallery() {
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;

  photos.forEach((photo, index) => {
    const item = document.createElement('div');
    
    // Add 'tall' class if photo.tall is true, otherwise keep it regular
    item.className = `gallery-item ${photo.tall ? 'tall' : ''}`;
    item.dataset.index = index;

    const img = document.createElement('img');
    img.src = photoUrl(photo.file);
    img.alt = `Concert photography ${index + 1} by JackQuinnMedia`;
    img.loading = 'lazy';

    item.appendChild(img);
    grid.appendChild(item);
  });
}

function buildCarousel() {
  const track = document.getElementById('instagram-track');
  if (!track) return;

  const carouselPhotos = photos.slice(0, 8);
  carouselPhotos.forEach((photo, index) => {
    const img = document.createElement('img');
    img.src = photoUrl(photo.file);
    img.alt = `Instagram preview ${index + 1}`;
    img.loading = 'lazy';
    track.appendChild(img);
  });
}

function initCarousel() {
  const track = document.getElementById('instagram-track');
  const prevBtn = document.querySelector('.carousel-prev');
  const nextBtn = document.querySelector('.carousel-next');
  if (!track || !prevBtn || !nextBtn) return;

  let offset = 0;
  const images = track.querySelectorAll('img');
  if (!images.length) return;

  function getSlideWidth() {
    const img = images[0];
    const gap = 6;
    return img.offsetWidth + gap;
  }

  function getMaxOffset() {
    const slideWidth = getSlideWidth();
    const visibleCount = Math.floor(track.offsetWidth / slideWidth);
    const maxIndex = Math.max(0, images.length - visibleCount);
    return maxIndex * slideWidth;
  }

  function updateTrack() {
    track.style.transform = `translateX(-${offset}px)`;
    track.style.transition = 'transform 0.4s ease';
  }

  prevBtn.addEventListener('click', () => {
    const slideWidth = getSlideWidth();
    offset = Math.max(0, offset - slideWidth);
    updateTrack();
  });

  nextBtn.addEventListener('click', () => {
    const slideWidth = getSlideWidth();
    offset = Math.min(getMaxOffset(), offset + slideWidth);
    updateTrack();
  });
}

function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = lightbox?.querySelector('.lightbox-img');
  const closeBtn = lightbox?.querySelector('.lightbox-close');
  const prevBtn = lightbox?.querySelector('.lightbox-prev');
  const nextBtn = lightbox?.querySelector('.lightbox-next');
  const grid = document.getElementById('gallery-grid');

  if (!lightbox || !lightboxImg || !grid) return;

  let currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    lightboxImg.src = photoUrl(photos[index].file);
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.hidden = true;
    document.body.style.overflow = '';
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + photos.length) % photos.length;
    lightboxImg.src = photoUrl(photos[currentIndex].file);
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % photos.length;
    lightboxImg.src = photoUrl(photos[currentIndex].file);
  }

  grid.addEventListener('click', (e) => {
    const item = e.target.closest('.gallery-item');
    if (!item) return;
    openLightbox(Number(item.dataset.index));
  });

  closeBtn?.addEventListener('click', closeLightbox);
  prevBtn?.addEventListener('click', showPrev);
  nextBtn?.addEventListener('click', showNext);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'ArrowRight') showNext();
  });
}

function initBackToTop() {
  document.querySelectorAll('.back-to-top').forEach((btn) => {
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
}

function initContactForm() {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      status.textContent = 'Please fill in all required fields.';
      status.className = 'form-status error';
      status.hidden = false;
      return;
    }

    const subject = encodeURIComponent(`Inquiry from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    window.location.href = `mailto:jackquinnmedia@gmail.com?subject=${subject}&body=${body}`;

    status.textContent = 'Opening your email client…';
    status.className = 'form-status success';
    status.hidden = false;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  buildGallery();
  buildCarousel();
  initCarousel();
  initLightbox();
  initBackToTop();
  initContactForm();
});

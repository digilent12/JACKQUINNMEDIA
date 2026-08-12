const BASE_URL = './images/';

const photos = [
  { file: 'DSC01140.webp', tall: true },
  { file: 'DSC01574.webp', tall: false },
  { file: 'DSC01903.webp', tall: false },
  { file: 'DSC02499.webp', tall: false },
  { file: 'DSC02733.webp', tall: false },
  { file: 'DSC03190.webp', tall: false },
  { file: 'DSC03486.webp', tall: false },
  { file: 'DSC03540.webp', tall: false },
  { file: 'DSC04039.webp', tall: true },
  { file: 'DSC04062.webp', tall: false },
  { file: 'DSC04090.webp', tall: true },
  { file: 'DSC05403.webp', tall: false },
  { file: 'DSC05524.webp', tall: false },
  { file: 'DSC05911.webp', tall: false },
  { file: 'DSC05998.webp', tall: false },
  { file: 'DSC06035.webp', tall: false },
  { file: 'DSC06204.webp', tall: false },
  { file: 'DSC06275.webp', tall: false },
  { file: 'DSC06554.webp', tall: false },
  { file: 'DSC06611.webp', tall: false },
  { file: 'DSC06997.webp', tall: false },
  { file: 'DSC07092.webp', tall: false },
  { file: 'DSC07158.webp', tall: false },
  { file: 'DSC07185.webp', tall: false },
  { file: 'DSC07302.webp', tall: false },
  { file: 'DSC07523.webp', tall: true },
  { file: 'DSC07575.webp', tall: true },
  { file: 'DSC07696.webp', tall: false },
  { file: 'DSC07787.webp', tall: true },
  { file: 'DSC07941.webp', tall: false },
  { file: 'DSC08022.webp', tall: false },
  { file: 'DSC08658.webp', tall: false },
  { file: 'DSC09227.webp', tall: true }
];

function photoUrl(file) {
  return BASE_URL + file;
}

function buildGallery() {
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;

  // DocumentFragment prevents repeated DOM layout reflows
  const fragment = document.createDocumentFragment();

  photos.forEach((photo, index) => {
    const item = document.createElement('div');
    item.className = `gallery-item ${photo.tall ? 'tall' : ''}`.trim();
    item.dataset.index = index;

    // Accessibility attributes
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label', `View concert photo ${index + 1}`);

    const img = document.createElement('img');
    img.src = photoUrl(photo.file);
    img.alt = `Concert photography ${index + 1} by JackQuinnMedia`;
    img.loading = 'lazy';
    img.decoding = 'async';

    item.appendChild(img);
    fragment.appendChild(item);
  });

  // Single DOM insertion
  grid.appendChild(fragment);

  // Event Delegation for image clicks / lightbox triggers
  grid.addEventListener('click', handleGalleryInteraction);
  grid.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleGalleryInteraction(e);
    }
  });
}

function handleGalleryInteraction(e) {
  const item = e.target.closest('.gallery-item');
  if (!item) return;

  const photoIndex = parseInt(item.dataset.index, 10);
  const selectedPhoto = photos[photoIndex];
  
  // Custom click action (e.g. open in modal / lightbox)
  console.log('Selected photo index:', photoIndex, selectedPhoto);
}

// Initialize gallery on DOM ready
document.addEventListener('DOMContentLoaded', buildGallery);

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

  // Initialize EmailJS with your Public Key
  emailjs.init("hLSnXOATDYvTOxlDS");

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

    // Show sending state
    status.textContent = 'Sending message...';
    status.className = 'form-status sending';
    status.hidden = false;

    // Send email via EmailJS
    emailjs.sendForm('service_ljz2k14', 'template_wn2322l', form)
      .then(() => {
        status.textContent = 'Message sent successfully!';
        status.className = 'form-status success';
        form.reset(); // Clear the form fields
      })
      .catch((error) => {
        console.error('EmailJS Error:', error);
        status.textContent = 'Failed to send message. Please try again.';
        status.className = 'form-status error';
      });
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

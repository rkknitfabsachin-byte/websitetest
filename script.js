// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const navUl = document.querySelector('nav ul');

  if (hamburger && navUl) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navUl.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
      if (!navUl.contains(e.target) && !hamburger.contains(e.target) && navUl.classList.contains('active')) {
        navUl.classList.remove('active');
        hamburger.classList.remove('active');
      }
    });

    navUl.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navUl.classList.remove('active');
        hamburger.classList.remove('active');
      });
    });
  }

  // --- CAROUSEL & LIGHTBOX LOGIC ---
  // Only run if we are on a product page with #slides
  const sliderContainer = document.querySelector('.slider');
  const slidesContainer = document.getElementById('slides');

  if (sliderContainer && slidesContainer) {
    const images = Array.from(slidesContainer.querySelectorAll('img'));

    // 1. Create Thumbnails Container
    const thumbContainer = document.createElement('div');
    thumbContainer.className = 'thumbnails-row';
    const wrapper = document.createElement('div');
    wrapper.className = 'slider-wrapper';
    sliderContainer.parentNode.insertBefore(wrapper, sliderContainer);
    wrapper.appendChild(sliderContainer);
    wrapper.appendChild(thumbContainer);

    // 2. Generate Thumbnails
    images.forEach((img, index) => {
      const thumb = document.createElement('img');
      thumb.src = img.src;
      thumb.className = index === 0 ? 'thumb active' : 'thumb';
      thumb.onclick = () => {
        // Update specific page slide index if it exists in global scope or manage locally
        // The pages use 'move(d)' or 'moveSlide(d)' which rely on global 'i' or 'slideIndex'
        // We will try to update the existing global variables if possible, or just force the transform.

        // Try to find which variable is being used. DOT KNIT uses 'i'.
        // To be safe, we will just manually update the transform and the index.
        if (typeof i !== 'undefined') i = index;
        if (typeof slideIndex !== 'undefined') slideIndex = index;

        slidesContainer.style.transform = `translateX(-${index * 100}%)`;

        // Update active thumb
        document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
      };
      thumbContainer.appendChild(thumb);
    });

    // 3. Lightbox (Zoom)
    // Create Lightbox Elements
    const lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
            <span class="close-lightbox">&times;</span>
            <img class="lightbox-content" id="lightbox-img">
        `;
    document.body.appendChild(lightbox);

    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.close-lightbox');

    // Open Lightbox on Main Image Click
    images.forEach(img => {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', () => {
        lightbox.style.display = 'block';
        lightboxImg.src = img.src;
      });
    });

    // Close Logic
    closeBtn.onclick = () => {
      lightbox.style.display = 'none';
    }

    lightbox.onclick = (e) => {
      if (e.target === lightbox) {
        lightbox.style.display = 'none';
      }
    }
  }
});

// Slider logic for fabric pages
let slideIndex = 0;
function moveSlide(dir) {
  const slides = document.querySelector('.slides');
  if (!slides) return;
  const total = slides.children.length;
  slideIndex = (slideIndex + dir + total) % total;
  slides.style.transform = `translateX(-${slideIndex * 100}%)`;
}

// --- INTERACTIVE ANIMATIONS ---
document.addEventListener('DOMContentLoaded', () => {
  // Parallax Blobs
  const blobs = document.querySelectorAll('.fabric-blob');
  if (blobs.length) {
    let mouseX = 0, mouseY = 0;
    window.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });

    function animate() {
      const time = Date.now() * 0.001;
      blobs.forEach((b, i) => {
        const speed = 0.5 + (i * 0.2);
        const dx = Math.sin(time * 0.5 + i) * 20;
        const dy = Math.cos(time * 0.3 + i) * 20;
        const mx = (mouseX - window.innerWidth / 2) * 0.05 * speed;
        const my = (mouseY - window.innerHeight / 2) * 0.05 * speed;
        b.style.transform = `translate3d(${dx + mx}px, ${dy + my}px, 0)`;
      });
      requestAnimationFrame(animate);
    }
    animate();
  }

  // Scroll Reveal
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

  document.querySelectorAll('section, .card, h2, p, footer').forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
  });
});

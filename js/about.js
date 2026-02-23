/* ============================================
   EL CHILAQUIL - About Page JS
   Counter animation
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    const statNumbers = document.querySelectorAll('.stat-number');

    if (statNumbers.length > 0) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.dataset.count);
                    animateCounter(el, target);
                    counterObserver.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        statNumbers.forEach(num => counterObserver.observe(num));
    }

    function animateCounter(el, target) {
        const duration = 2000;
        const start = performance.now();

        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(eased * target);

            if (target >= 10000) {
                el.textContent = (current / 1000).toFixed(current >= target ? 0 : 1) + 'k';
            } else {
                el.textContent = current.toLocaleString();
            }

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                if (target >= 10000) {
                    el.textContent = (target / 1000) + 'k';
                } else {
                    el.textContent = target.toLocaleString();
                }
            }
        }

        requestAnimationFrame(update);
    }

    // --- Photo Gallery Lightbox ---
    const galleryItems = document.querySelectorAll('.gallery-item');
    if (galleryItems.length > 0) {
        const lightbox = document.createElement('div');
        lightbox.classList.add('lightbox-overlay');
        lightbox.innerHTML = '<button class="lightbox-close" aria-label="Close">&times;</button>' +
            '<button class="lightbox-arrow lightbox-prev" aria-label="Previous">&#8249;</button>' +
            '<div class="lightbox-content"><img src="" alt=""></div>' +
            '<button class="lightbox-arrow lightbox-next" aria-label="Next">&#8250;</button>';
        document.body.appendChild(lightbox);

        const lightboxImg = lightbox.querySelector('.lightbox-content img');
        let currentIndex = 0;

        function getImageSrc(item) {
            const source = item.querySelector('source');
            const img = item.querySelector('img');
            return source ? source.srcset : (img ? img.src : '');
        }

        function getImageAlt(item) {
            const img = item.querySelector('img');
            return img ? img.alt : '';
        }

        function openLightbox(index) {
            currentIndex = index;
            lightboxImg.src = getImageSrc(galleryItems[currentIndex]);
            lightboxImg.alt = getImageAlt(galleryItems[currentIndex]);
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeLightbox() {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }

        function nextImage() {
            currentIndex = (currentIndex + 1) % galleryItems.length;
            lightboxImg.src = getImageSrc(galleryItems[currentIndex]);
            lightboxImg.alt = getImageAlt(galleryItems[currentIndex]);
        }

        function prevImage() {
            currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
            lightboxImg.src = getImageSrc(galleryItems[currentIndex]);
            lightboxImg.alt = getImageAlt(galleryItems[currentIndex]);
        }

        galleryItems.forEach((item, i) => {
            item.addEventListener('click', () => openLightbox(i));
        });

        lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
        lightbox.querySelector('.lightbox-prev').addEventListener('click', prevImage);
        lightbox.querySelector('.lightbox-next').addEventListener('click', nextImage);

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
        });
    }

});

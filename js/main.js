/* ============================================
   EL CHILAQUIL - Shared JavaScript
   Nav, scroll reveal, mobile menu, progress bar,
   dark mode, back to top, carousel, PWA, GA4
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // --- Page Loader ---
    const loader = document.querySelector('.page-loader');
    if (loader) {
        const hideLoader = () => {
            loader.classList.add('hidden');
            setTimeout(() => { if (loader.parentNode) loader.parentNode.removeChild(loader); }, 500);
        };
        // Hide after DOM ready, max 1.5s
        setTimeout(hideLoader, 800);
        // Safety net
        setTimeout(hideLoader, 1500);
    }

    // --- Announcement Bar ---
    if (!sessionStorage.getItem('announcementDismissed')) {
        const bar = document.getElementById('announcementBar');
        if (bar) {
            bar.style.display = '';
            const closeBtn = bar.querySelector('.announcement-bar-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    bar.style.display = 'none';
                    sessionStorage.setItem('announcementDismissed', '1');
                });
            }
        }
    }

    // --- Floating Social Sidebar ---
    const sidebar = document.createElement('div');
    sidebar.classList.add('social-sidebar');
    sidebar.innerHTML = '<a href="https://www.instagram.com/foodtruckelchilaquil/" target="_blank" rel="noopener" aria-label="Instagram">&#9829;</a>' +
        '<a href="https://www.facebook.com/elchilaquilfoodtruck" target="_blank" rel="noopener" aria-label="Facebook">f</a>' +
        '<a href="tel:+15196948478" aria-label="Call us">&#9742;</a>';
    document.body.appendChild(sidebar);

    // --- Cookie Consent ---
    if (!localStorage.getItem('cookieConsent')) {
        const cookie = document.createElement('div');
        cookie.classList.add('cookie-consent');
        cookie.innerHTML = '<p>We use cookies to improve your experience on our site.</p>' +
            '<button class="cookie-consent-btn">Accept</button>';
        document.body.appendChild(cookie);
        // Show after a brief delay
        setTimeout(() => cookie.classList.add('visible'), 500);
        cookie.querySelector('.cookie-consent-btn').addEventListener('click', () => {
            cookie.classList.remove('visible');
            localStorage.setItem('cookieConsent', '1');
            setTimeout(() => { if (cookie.parentNode) cookie.parentNode.removeChild(cookie); }, 500);
        });
    }

    // --- Newsletter Signup (Footer) ---
    document.querySelectorAll('.newsletter-form').forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = form.querySelector('input');
            const success = form.nextElementSibling;
            if (input.value) {
                input.value = '';
                if (success) {
                    success.style.display = 'block';
                    success.textContent = 'Thanks for subscribing!';
                    setTimeout(() => { success.style.display = 'none'; }, 4000);
                }
            }
        });
    });

    // --- Scroll Progress Bar ---
    const progressBar = document.createElement('div');
    progressBar.classList.add('scroll-progress');
    document.body.prepend(progressBar);

    // --- Back to Top Button ---
    const backToTop = document.createElement('button');
    backToTop.classList.add('back-to-top');
    backToTop.setAttribute('aria-label', 'Back to top');
    backToTop.innerHTML = '&#8679;';
    document.body.appendChild(backToTop);

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // --- Dark Mode Toggle ---
    const darkToggle = document.createElement('button');
    darkToggle.classList.add('dark-mode-toggle');
    darkToggle.setAttribute('aria-label', 'Toggle dark mode');
    darkToggle.innerHTML = document.documentElement.getAttribute('data-theme') === 'dark' ? '&#9788;' : '&#9790;';
    document.body.appendChild(darkToggle);

    darkToggle.addEventListener('click', () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const newTheme = isDark ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        darkToggle.innerHTML = newTheme === 'dark' ? '&#9788;' : '&#9790;';
    });

    // --- Navbar Scroll Effect ---
    const navbar = document.getElementById('navbar');

    function updateNavbar() {
        const scrollY = window.scrollY;

        // Progress bar
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (docHeight > 0) {
            const progress = (scrollY / docHeight) * 100;
            progressBar.style.width = progress + '%';
        }

        // Navbar scroll state
        if (scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Back to top visibility
        if (scrollY > 400) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }

    window.addEventListener('scroll', updateNavbar, { passive: true });
    updateNavbar();

    // --- Mobile Menu Toggle ---
    const navToggle = document.getElementById('navToggle');
    const navLinksContainer = document.getElementById('navLinks');

    if (navToggle && navLinksContainer) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navLinksContainer.classList.toggle('open');
            document.body.style.overflow = navLinksContainer.classList.contains('open') ? 'hidden' : '';
        });

        navLinksContainer.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navLinksContainer.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }

    // --- Scroll Reveal ---
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

        revealElements.forEach(el => revealObserver.observe(el));
    }

    // --- Smooth Scroll for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Testimonials Carousel (Mobile) ---
    const testimonialsGrid = document.querySelector('.testimonials-grid');
    if (testimonialsGrid) {
        const cards = testimonialsGrid.querySelectorAll('.testimonial-card');
        if (cards.length > 1) {
            // Create carousel controls
            const carouselNav = document.createElement('div');
            carouselNav.classList.add('carousel-nav');

            const prevBtn = document.createElement('button');
            prevBtn.classList.add('carousel-arrow', 'carousel-prev');
            prevBtn.setAttribute('aria-label', 'Previous testimonial');
            prevBtn.innerHTML = '&#8249;';

            const nextBtn = document.createElement('button');
            nextBtn.classList.add('carousel-arrow', 'carousel-next');
            nextBtn.setAttribute('aria-label', 'Next testimonial');
            nextBtn.innerHTML = '&#8250;';

            const dots = document.createElement('div');
            dots.classList.add('carousel-dots');
            cards.forEach((_, i) => {
                const dot = document.createElement('button');
                dot.classList.add('carousel-dot');
                if (i === 0) dot.classList.add('active');
                dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
                dot.addEventListener('click', () => goToSlide(i));
                dots.appendChild(dot);
            });

            carouselNav.appendChild(prevBtn);
            carouselNav.appendChild(dots);
            carouselNav.appendChild(nextBtn);
            testimonialsGrid.parentNode.insertBefore(carouselNav, testimonialsGrid.nextSibling);

            let currentSlide = 0;
            let autoAdvance;

            function goToSlide(index) {
                currentSlide = index;
                if (window.innerWidth < 768) {
                    testimonialsGrid.style.transform = `translateX(-${currentSlide * 100}%)`;
                }
                dots.querySelectorAll('.carousel-dot').forEach((d, i) => {
                    d.classList.toggle('active', i === currentSlide);
                });
                resetAutoAdvance();
            }

            prevBtn.addEventListener('click', () => {
                goToSlide(currentSlide === 0 ? cards.length - 1 : currentSlide - 1);
            });

            nextBtn.addEventListener('click', () => {
                goToSlide(currentSlide === cards.length - 1 ? 0 : currentSlide + 1);
            });

            function resetAutoAdvance() {
                clearInterval(autoAdvance);
                autoAdvance = setInterval(() => {
                    if (window.innerWidth < 768) {
                        goToSlide(currentSlide === cards.length - 1 ? 0 : currentSlide + 1);
                    }
                }, 5000);
            }

            resetAutoAdvance();

            // Touch/swipe support
            let touchStartX = 0;
            testimonialsGrid.addEventListener('touchstart', (e) => {
                touchStartX = e.touches[0].clientX;
            }, { passive: true });

            testimonialsGrid.addEventListener('touchend', (e) => {
                const diff = touchStartX - e.changedTouches[0].clientX;
                if (Math.abs(diff) > 50) {
                    if (diff > 0) {
                        goToSlide(currentSlide === cards.length - 1 ? 0 : currentSlide + 1);
                    } else {
                        goToSlide(currentSlide === 0 ? cards.length - 1 : currentSlide - 1);
                    }
                }
            }, { passive: true });

            // Reset on resize
            window.addEventListener('resize', () => {
                if (window.innerWidth >= 768) {
                    testimonialsGrid.style.transform = '';
                } else {
                    testimonialsGrid.style.transform = `translateX(-${currentSlide * 100}%)`;
                }
            });
        }
    }

    // --- Homepage Stats Counter ---
    const homeStats = document.querySelectorAll('.home-stat-number');
    if (homeStats.length > 0) {
        const homeCounterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.dataset.count);
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
                            el.textContent = target >= 10000 ? (target / 1000) + 'k' : target.toLocaleString();
                        }
                    }
                    requestAnimationFrame(update);
                    homeCounterObserver.unobserve(el);
                }
            });
        }, { threshold: 0.5 });
        homeStats.forEach(num => homeCounterObserver.observe(num));
    }

    // --- Service Worker Registration (PWA) ---
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js').catch(() => {});
    }

    // --- Google Analytics 4 (Placeholder) ---
    const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';
    if (GA_MEASUREMENT_ID !== 'G-XXXXXXXXXX') {
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_MEASUREMENT_ID;
        document.head.appendChild(script);
        window.dataLayer = window.dataLayer || [];
        function gtag() { window.dataLayer.push(arguments); }
        gtag('js', new Date());
        gtag('config', GA_MEASUREMENT_ID);
    }

});

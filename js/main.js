/* ============================================
   EL CHILAQUIL - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // --- Page Loader ---
    const loader = document.getElementById('loader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 800);
    });
    // Fallback: hide loader after 3s max
    setTimeout(() => loader.classList.add('hidden'), 3000);

    // --- Scroll Progress Bar ---
    const progressBar = document.createElement('div');
    progressBar.classList.add('scroll-progress');
    document.body.prepend(progressBar);

    // --- Navbar Scroll Effect ---
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    function updateNavbar() {
        const scrollY = window.scrollY;

        // Progress bar
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollY / docHeight) * 100;
        progressBar.style.width = progress + '%';

        // Navbar background
        if (scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active nav link
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 200;
            if (scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateNavbar, { passive: true });

    // --- Mobile Menu Toggle ---
    const navToggle = document.getElementById('navToggle');
    const navLinksContainer = document.getElementById('navLinks');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinksContainer.classList.toggle('open');
        document.body.style.overflow = navLinksContainer.classList.contains('open') ? 'hidden' : '';
    });

    // Close mobile menu on link click
    navLinksContainer.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinksContainer.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // --- Scroll Reveal ---
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- Menu Cards Stagger Reveal ---
    const menuCards = document.querySelectorAll('.menu-card');
    const menuObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger the animation
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 60);
                menuObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    menuCards.forEach(card => menuObserver.observe(card));

    // --- Menu Filter Tabs ---
    const menuTabs = document.querySelectorAll('.menu-tab');
    const menuGrid = document.getElementById('menuGrid');

    menuTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const category = tab.dataset.category;

            // Update active tab
            menuTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Filter cards
            const allCards = menuGrid.querySelectorAll('.menu-card');
            allCards.forEach((card, i) => {
                if (category === 'all' || card.dataset.category === category) {
                    card.classList.remove('hidden-card');
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, i * 40);
                } else {
                    card.classList.add('hidden-card');
                }
            });
        });
    });

    // --- Counter Animation ---
    const statNumbers = document.querySelectorAll('.stat-number');

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

    function animateCounter(el, target) {
        const duration = 2000;
        const start = performance.now();

        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
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

    // --- Hero Particles ---
    const particlesContainer = document.getElementById('heroParticles');
    const emojis = ['🌶️', '🌮', '🌽', '🥑', '🔥', '💃'];

    function createParticle() {
        const particle = document.createElement('span');
        particle.classList.add('particle');
        particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        particle.style.left = Math.random() * 100 + '%';
        particle.style.fontSize = (Math.random() * 1.5 + 0.8) + 'rem';
        particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
        particle.style.animationDelay = Math.random() * 5 + 's';
        particlesContainer.appendChild(particle);

        // Clean up after animation
        setTimeout(() => particle.remove(), 25000);
    }

    // Create initial particles
    for (let i = 0; i < 8; i++) {
        setTimeout(createParticle, i * 600);
    }

    // Continue creating particles
    setInterval(createParticle, 3000);

    // --- Contact Form ---
    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const btn = contactForm.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        btn.textContent = 'Sending...';
        btn.disabled = true;

        // Simulate form submission
        setTimeout(() => {
            btn.textContent = 'Sent! We\'ll be in touch 🎉';
            btn.style.background = 'var(--secondary)';

            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
                btn.disabled = false;
                contactForm.reset();
            }, 3000);
        }, 1500);
    });

    // --- Smooth Scroll for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Parallax on Hero (subtle) ---
    const heroBg = document.querySelector('.hero-bg');
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        if (scrollY < window.innerHeight) {
            heroBg.style.transform = `translateY(${scrollY * 0.3}px)`;
        }
    }, { passive: true });

});

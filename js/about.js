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

});

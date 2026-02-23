/* ============================================
   EL CHILAQUIL - Catering Page JS
   Contact form, FAQ accordion, cost estimator
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // --- FAQ Accordion ---
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');
            // Close all
            faqItems.forEach(i => i.classList.remove('open'));
            // Toggle clicked
            if (!isOpen) {
                item.classList.add('open');
            }
        });
    });

    // --- Cost Estimator ---
    const estPackage = document.getElementById('estPackage');
    const estGuests = document.getElementById('estGuests');
    const estGuac = document.getElementById('estGuac');
    const estTotal = document.getElementById('estTotal');
    const estBreakdown = document.getElementById('estBreakdown');

    function updateEstimate() {
        if (!estPackage || !estGuests || !estTotal) return;
        const price = parseFloat(estPackage.value) || 0;
        const guests = parseInt(estGuests.value) || 0;
        const guac = estGuac && estGuac.checked ? 5 : 0;
        const perPerson = price + guac;
        const total = perPerson * guests;
        estTotal.textContent = total.toLocaleString();
        let breakdown = `${guests} guest${guests !== 1 ? 's' : ''} × $${perPerson}/person`;
        if (guac) breakdown += ' (incl. guac)';
        estBreakdown.textContent = breakdown;
    }

    if (estPackage) {
        estPackage.addEventListener('change', updateEstimate);
        estGuests.addEventListener('input', updateEstimate);
        estGuac.addEventListener('change', updateEstimate);
        updateEstimate();
    }

    // --- Contact Form ---
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.textContent;
            btn.textContent = 'Sending...';
            btn.disabled = true;

            setTimeout(() => {
                btn.textContent = 'Sent! We\'ll be in touch';
                btn.style.background = 'var(--secondary)';

                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.background = '';
                    btn.disabled = false;
                    contactForm.reset();
                }, 3000);
            }, 1500);
        });
    }

});

/* ============================================
   EL CHILAQUIL - Menu Page JS
   Menu filtering logic + card stagger reveal
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // --- Menu Filter Tabs ---
    const menuTabs = document.querySelectorAll('.menu-tab');
    const menuGrid = document.getElementById('menuGrid');

    if (menuTabs.length > 0 && menuGrid) {
        menuTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const category = tab.dataset.category;

                menuTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

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
    }

    // --- Menu Cards Stagger Reveal ---
    const menuCards = document.querySelectorAll('.menu-card');
    if (menuCards.length > 0) {
        const menuObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, index * 60);
                    menuObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        menuCards.forEach(card => menuObserver.observe(card));
    }

});

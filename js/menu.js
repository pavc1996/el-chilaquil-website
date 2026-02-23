/* ============================================
   EL CHILAQUIL - Menu Page JS
   Menu filtering (category + dietary) + card stagger reveal
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    const menuTabs = document.querySelectorAll('.menu-tab');
    const dietaryFilters = document.querySelectorAll('.dietary-filter');
    const menuGrid = document.getElementById('menuGrid');

    let activeCategory = 'all';
    let activeDietary = 'all';

    function filterMenu() {
        menuTabs.forEach(t => {
            t.classList.toggle('active', t.dataset.category === activeCategory);
        });
        dietaryFilters.forEach(f => {
            f.classList.toggle('active', f.dataset.dietary === activeDietary);
        });

        const allCards = menuGrid.querySelectorAll('.menu-card');
        let visibleIndex = 0;

        allCards.forEach(card => {
            const categoryMatch = activeCategory === 'all' || card.dataset.category === activeCategory;
            const cardDiets = card.dataset.dietary ? card.dataset.dietary.split(',') : [];
            const dietaryMatch = activeDietary === 'all' || cardDiets.includes(activeDietary);

            if (categoryMatch && dietaryMatch) {
                card.classList.remove('hidden-card');
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                const delay = visibleIndex * 40;
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, delay);
                visibleIndex++;
            } else {
                card.classList.add('hidden-card');
            }
        });
    }

    if (menuTabs.length > 0 && menuGrid) {
        menuTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                activeCategory = tab.dataset.category;
                filterMenu();
            });
        });

        dietaryFilters.forEach(filter => {
            filter.addEventListener('click', () => {
                activeDietary = filter.dataset.dietary;
                filterMenu();
            });
        });

        // Handle URL parameter ?category=tacos etc.
        const urlParams = new URLSearchParams(window.location.search);
        const urlCategory = urlParams.get('category');
        if (urlCategory) {
            activeCategory = urlCategory;
            filterMenu();
        }
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

    // --- Quick View Modal ---
    const modalOverlay = document.createElement('div');
    modalOverlay.classList.add('menu-modal-overlay');
    modalOverlay.innerHTML = '<div class="menu-modal">' +
        '<button class="menu-modal-close" aria-label="Close">&times;</button>' +
        '<div class="menu-modal-img"><img src="" alt=""></div>' +
        '<div class="menu-modal-body"><h3></h3><div class="menu-modal-price"></div><p></p><div class="menu-modal-tags"></div></div>' +
        '</div>';
    document.body.appendChild(modalOverlay);

    function openModal(card) {
        const img = card.querySelector('.menu-card-img img');
        const source = card.querySelector('.menu-card-img source');
        const h3 = card.querySelector('.menu-card-header h3');
        const price = card.querySelector('.menu-price');
        const desc = card.querySelector('.menu-card-content p');
        const tags = card.querySelector('.dietary-tags');
        const spice = card.querySelector('.spice-level');

        const modalImg = modalOverlay.querySelector('.menu-modal-img img');
        modalImg.src = source ? source.srcset : (img ? img.src : '');
        modalImg.alt = img ? img.alt : '';
        modalOverlay.querySelector('.menu-modal-body h3').textContent = (h3 ? h3.textContent : '') + (spice ? ' ' + spice.textContent : '');
        modalOverlay.querySelector('.menu-modal-price').textContent = price ? price.textContent : '';
        modalOverlay.querySelector('.menu-modal-body p').textContent = desc ? desc.textContent : '';
        const modalTags = modalOverlay.querySelector('.menu-modal-tags');
        modalTags.innerHTML = tags ? tags.innerHTML : '';
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (menuGrid) {
        menuGrid.addEventListener('click', (e) => {
            const card = e.target.closest('.menu-card');
            if (card) openModal(card);
        });
    }

    modalOverlay.querySelector('.menu-modal-close').addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('active')) closeModal();
    });

    // --- Print Menu ---
    const printBtn = document.querySelector('.print-menu-btn');
    if (printBtn) {
        printBtn.addEventListener('click', () => window.print());
    }

    // --- Combo / Meal Builder ---
    const mealBuilder = document.getElementById('mealBuilder');
    if (mealBuilder) {
        const steps = mealBuilder.querySelectorAll('.meal-step');
        const totalPrice = mealBuilder.querySelector('.total-price');
        const totalItems = mealBuilder.querySelector('.total-items');
        const selections = {};

        mealBuilder.querySelectorAll('.meal-option').forEach(option => {
            option.addEventListener('click', () => {
                const step = option.closest('.meal-step');
                const stepNum = step.dataset.step;

                // Toggle selection within step
                step.querySelectorAll('.meal-option').forEach(o => o.classList.remove('selected'));
                option.classList.add('selected');
                selections[stepNum] = {
                    name: option.dataset.name,
                    price: parseFloat(option.dataset.price)
                };

                // Update total
                let total = 0;
                let items = [];
                Object.values(selections).forEach(s => {
                    total += s.price;
                    items.push(s.name);
                });
                if (totalPrice) totalPrice.textContent = '$' + total.toFixed(2);
                if (totalItems) totalItems.textContent = items.length > 0 ? items.join(' + ') : 'Select items above';

                // Highlight active steps
                steps.forEach(s => {
                    s.classList.toggle('active', !!selections[s.dataset.step]);
                });
            });
        });
    }

});

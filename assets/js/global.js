const select = (selector, node) => (node || document).querySelector(selector);

const selectAll = (selector, node) =>
    Array.from((node || document).querySelectorAll(selector));

const initPage = () => {
    // Accordions
    const $accordions = selectAll('.js-accordion');

    $accordions.forEach(($accordion) => {
        const $trigger = select('.js-accordion-trigger', $accordion);
        const $content = select('.js-accordion-content', $accordion);
        const $isOpenIcon = select('.js-accordion-icon-is-open', $accordion);
        const $isClosedIcon = select(
            '.js-accordion-icon-is-closed',
            $accordion
        );

        if (
            $accordion.className.indexOf('is-open') === -1 &&
            $accordion.className.indexOf('is-closed') === -1
        ) {
            $accordion.classList.add('is-closed');
        }

        const render = () => {
            const accordionClasses = Array.from($accordion.classList);
            const isOpen =
                accordionClasses.includes('is-open') ||
                !accordionClasses.includes('is-closed');

            $content.style.display = isOpen ? '' : 'none';
            $isOpenIcon.style.display = isOpen ? '' : 'none';
            $isClosedIcon.style.display = isOpen ? 'none' : '';
        };

        $trigger.addEventListener('click', (e) => {
            e.preventDefault();

            $accordion.classList.toggle('is-open');
            $accordion.classList.toggle('is-closed');

            render();
        });

        render();
    });

    // Menu
    const $menu = select('.js-menu');
    const $menuToggleButton = select('.js-menu-toggle-button', $menu);
    const $menuToggleButtonIconOpen = select(
        '.js-menu-toggle-button-icon-open',
        $menu
    );
    const $menuToggleButtonIconClose = select(
        '.js-menu-toggle-button-icon-close',
        $menu
    );

    const renderMenu = () => {
        const isOpen = Array.from($menu.classList).includes('is-open');

        $menuToggleButtonIconOpen.style.display = isOpen ? 'none' : '';
        $menuToggleButtonIconClose.style.display = isOpen ? '' : 'none';
    };

    $menuToggleButton.addEventListener('click', () => {
        $menu.classList.toggle('is-open');
        $menu.classList.toggle('is-closed');

        renderMenu();
    });

    renderMenu();

    // Modal Windows
    const toggleModal = (modalId) => {
        const $modalWindow = select(`.js-modal[data-modal-id="${modalId}"]`);

        $modalWindow.classList.toggle('is-closed');
        $modalWindow.classList.toggle('is-open');
    };

    const $modalWindowTriggers = selectAll('.js-modal-trigger[data-modal-id]');

    $modalWindowTriggers.forEach(($modalWindowTrigger) => {
        const modalId = $modalWindowTrigger.dataset.modalId;

        $modalWindowTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            toggleModal(modalId);
        });
    });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const $openModalTrigger = select(
                '.js-modal.is-open .js-modal-trigger'
            );

            if ($openModalTrigger) {
                $openModalTrigger.click();
            }
        }
    });
};

document.addEventListener('DOMContentLoaded', initPage);

// Twitter
window.twttr = (function (d, s, id) {
    var js,
        fjs = d.getElementsByTagName(s)[0],
        t = window.twttr || {};
    if (d.getElementById(id)) return t;
    js = d.createElement(s);
    js.id = id;
    js.src = 'https://platform.twitter.com/widgets.js';
    fjs.parentNode.insertBefore(js, fjs);

    t._e = [];
    t.ready = function (f) {
        t._e.push(f);
    };

    return t;
})(document, 'script', 'twitter-wjs');

const taggedElements = [
    '.iubenda_legal_document',
    '.iub_header',
    '.expand-content',
    '.box_primary',
];

window.addEventListener('load', () => {
    let classAttempt = setInterval(() => {
        const $elementsToTag = taggedElements.map((selector) =>
            selectAll(selector)
        );

        if ($elementsToTag[0][0]) {
            $elementsToTag.forEach(($elementToTag) => {
                [].concat($elementToTag).forEach(($e) => {
                    $e.classList.add('u-rowGap--normal');
                });
            });

            classAttempt = clearInterval(classAttempt);
        }
    }, 250);
});

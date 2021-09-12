const select = (selector, node) => (node || document).querySelector(selector);

const selectAll = (selector, node) =>
    Array.from((node || document).querySelectorAll(selector));

const initPage = () => {
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

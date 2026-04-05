document.addEventListener('DOMContentLoaded', () => {

    /* ----------------------------------------------------------------
       Mark body as JS-ready so CSS reveal animations activate.
       Without this flag, all .reveal elements are visible by default
       — no flash of invisible content on slow connections.
    ---------------------------------------------------------------- */
    document.body.classList.add('js-ready');

    /* ----------------------------------------------------------------
       Scroll Progress Bar
    ---------------------------------------------------------------- */
    const scrollProgress = document.getElementById('scrollProgress');
    if (scrollProgress) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            scrollProgress.style.width = pct + '%';
        }, { passive: true });
    }

    /* ----------------------------------------------------------------
       Floating Navigation – appears after scrolling past the header or hero title
    ---------------------------------------------------------------- */
    const floatingNav = document.getElementById('floatingNav');
    // Fallback if header is hidden
    const headerNode = document.querySelector('.header-logo') || document.querySelector('.hero-subtitle');

    if (floatingNav && headerNode) {
        const headerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show floating nav when the trigger element is scrolled past the top
                if (!entry.isIntersecting && entry.boundingClientRect.bottom < 0) {
                    floatingNav.classList.add('visible');
                } else {
                    floatingNav.classList.remove('visible');
                }
            });
        }, { threshold: 0 });

        headerObserver.observe(headerNode);
    }

    /* ----------------------------------------------------------------
       Smooth scrolling for anchor links
    ---------------------------------------------------------------- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });

    /* ----------------------------------------------------------------
       Scroll Reveal – IntersectionObserver
    ---------------------------------------------------------------- */
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    // rootMargin: positive bottom value = start revealing 200px BEFORE entering viewport
    }, { rootMargin: '0px 0px 200px 0px', threshold: 0 });

    // Stagger delay for cards in the same grid
    document.querySelectorAll('.audience-grid, .pricing-steps, .path-items').forEach(group => {
        group.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach((child, i) => {
            child.style.transitionDelay = `${i * 0.07}s`;
        });
    });

    // Observe text/card reveal elements only
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
        revealObserver.observe(el);
    });

    // Images: NO reveal animation — just display immediately

    /* ----------------------------------------------------------------
       FAQ Accordion Logic
    ---------------------------------------------------------------- */
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const isExpanded = question.getAttribute('aria-expanded') === 'true';
            
            // Close all others
            faqQuestions.forEach(q => {
                q.setAttribute('aria-expanded', 'false');
                if(q.nextElementSibling) q.nextElementSibling.style.maxHeight = null;
            });
            
            if (!isExpanded) {
                question.setAttribute('aria-expanded', 'true');
                const answer = question.nextElementSibling;
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    });

});

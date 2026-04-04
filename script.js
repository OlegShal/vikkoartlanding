document.addEventListener('DOMContentLoaded', () => {

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
       Floating Navigation – appears after scrolling past the header
    ---------------------------------------------------------------- */
    const floatingNav = document.getElementById('floatingNav');
    const header = document.querySelector('.header-logo');

    if (floatingNav && header) {
        const showNav = () => {
            const headerBottom = header.getBoundingClientRect().bottom;
            if (headerBottom < 0) {
                floatingNav.classList.add('visible');
            } else {
                floatingNav.classList.remove('visible');
            }
        };
        window.addEventListener('scroll', showNav, { passive: true });
        showNav();
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
    }, { rootMargin: '0px 0px -60px 0px', threshold: 0.12 });

    // Stagger delay for cards/images in the same parent
    const revealGroups = document.querySelectorAll(
        '.audience-grid, .pricing-steps, .image-gallery, .path-items'
    );
    revealGroups.forEach(group => {
        const children = group.querySelectorAll('.reveal, .reveal-left, .reveal-right, .img-wrap img');
        children.forEach((child, i) => {
            child.style.transitionDelay = `${i * 0.07}s`;
        });
    });

    // Observe all reveal elements
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
        revealObserver.observe(el);
    });

    // Observe gallery images
    document.querySelectorAll('.image-gallery img').forEach((img, i) => {
        img.classList.add('reveal');
        img.style.transitionDelay = `${(i % 4) * 0.1}s`;
        revealObserver.observe(img);
    });

    /* ----------------------------------------------------------------
       Lightbox
    ---------------------------------------------------------------- */
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');

    if (lightbox && lightboxImg) {
        // Open when clicking any gallery image
        document.querySelectorAll('.img-wrap img, .image-gallery img').forEach(img => {
            img.style.cursor = 'zoom-in';
            img.addEventListener('click', () => {
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt;
                lightbox.classList.add('open');
                document.body.style.overflow = 'hidden';
            });
        });

        const closeLightbox = () => {
            lightbox.classList.remove('open');
            document.body.style.overflow = '';
            setTimeout(() => { lightboxImg.src = ''; }, 350);
        };

        // Close via button, backdrop click, or Escape key
        if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
        document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
    }

});

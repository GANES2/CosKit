
document.addEventListener("DOMContentLoaded", () => {
    // Performance optimization: Use requestAnimationFrame for smooth animations
    let animationFrameId = null;

    // Check for fine pointer devices (desktop with mouse)
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;

    // Throttle function for performance
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    // Debounce function for performance
    function debounce(func, delay) {
        let timeoutId;
        return function() {
            const args = arguments;
            const context = this;
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(context, args), delay);
        }
    }

    // 1. Hero Slider Logic
    const slides = document.querySelectorAll('.hero-slide');
    let currentSlide = 0;
    const slideInterval = 5000;
    let slideTimer = null;

    function nextSlide() {
        if (slides.length === 0) return;
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }

    function startSlider() {
        if (slides.length > 0 && !slideTimer) {
            slideTimer = setInterval(nextSlide, slideInterval);
        }
    }

    function stopSlider() {
        if (slideTimer) {
            clearInterval(slideTimer);
            slideTimer = null;
        }
    }

    // Pause slider when page is not visible to save resources
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopSlider();
        } else {
            startSlider();
        }
    });

    startSlider();

    // 2. [DEPRECATED OLD LOGIC - MERGED INTO STEP 7]

    // 3. Tilt Effect Logic & Magnetic Buttons (only on fine pointer devices)
    if (isFinePointer) {
        const cards = document.querySelectorAll('.team-card, .card');
        const magneticBtns = document.querySelectorAll('.magnetic');

        // Magnetic Logic
        magneticBtns.forEach(btn => {
            const debouncedMagnetic = debounce((e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
            }, 16);
            btn.addEventListener('mousemove', debouncedMagnetic);
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = `translate(0, 0)`;
            });
        });

        // Optimized tilt effects with debouncing
        cards.forEach(card => {
            let cardAnimationId = null;

            const handleMouseMove = debounce((e) => {
                if (cardAnimationId) cancelAnimationFrame(cardAnimationId);

                cardAnimationId = requestAnimationFrame(() => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;

                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;

                    const rotateX = (y - centerY) / 20;
                    const rotateY = (centerX - x) / 20;

                    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
                });
            }, 16);

            const handleMouseLeave = () => {
                if (cardAnimationId) cancelAnimationFrame(cardAnimationId);
                cardAnimationId = requestAnimationFrame(() => {
                    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
                });
            };

            card.addEventListener('mousemove', handleMouseMove);
            card.addEventListener('mouseleave', handleMouseLeave);
        });
    }

    // 4. Custom Cursor Logic (only on fine pointer devices)
    if (isFinePointer) {
        const cursor = document.querySelector('.custom-cursor');
        const cursorDot = document.querySelector('.custom-cursor-dot');

        const debouncedCursorMove = debounce((e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            cursorDot.style.left = e.clientX + 'px';
            cursorDot.style.top = e.clientY + 'px';
        }, 16);
        document.addEventListener('mousemove', debouncedCursorMove);

        const activeElements = document.querySelectorAll('a, button, .team-card, .card');
        activeElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('link-hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('link-hover'));
        });
    }

    // 5. Mobile Menu Logic
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav-links a');

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            const isActive = nav.classList.toggle('active');
            menuToggle.classList.toggle('active');

            // Prevent scrolling when menu is open
            document.body.classList.toggle('menu-open', isActive);
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                menuToggle.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });
    }

    // 6. Theme Toggle Logic
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;

    if (localStorage.getItem('theme') === 'light') {
        body.classList.add('light-mode');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('light-mode');
            localStorage.setItem('theme', body.classList.contains('light-mode') ? 'light' : 'dark');
        });
    }

    // 7. Advanced Scroll Reveal Engine (Entry & Exit) - Optimized
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                // Only remove visible class if element is above viewport (for re-triggering)
                const rect = entry.boundingClientRect;
                if (rect.top > 0) {
                    entry.target.classList.remove('visible');
                }
            }
        });
    }, observerOptions);

    // Use passive listeners for better performance
    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
        if (slideTimer) {
            clearInterval(slideTimer);
        }
        revealObserver.disconnect();
    });
});

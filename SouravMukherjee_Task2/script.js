document.addEventListener('DOMContentLoaded', () => {
    const carImage = document.getElementById('car-image');
    const buttons = document.querySelectorAll('.color-btn');

    // Map colors to image filenames (we will need to verify the exact filenames generated)
    // For now assuming a naming convention based on my plan
    // I will update these lines once I see the generated file paths/names
    const cars = {
        'black': 'assets/aventador_black.png',
        'orange': 'assets/aventador_orange.png',
        'white': 'assets/aventador_white.png',
        'yellow': 'assets/aventador_yellow.png'
    };

    // Sound Effect
    const engineSound = new Audio('assets/engine.mp3');
    engineSound.volume = 0.5; // Set volume to 50%

    // Set initial image
    // Note: I will need to move the generated images to a proper folder or reference them correctly.
    // For now, I'll set a default.
    carImage.src = cars['black'];

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            buttons.forEach(b => b.classList.remove('active'));
            // Add active to clicked
            btn.classList.add('active');

            const color = btn.getAttribute('data-color');
            const newSrc = cars[color];

            if (newSrc) {
                // Play Sound
                engineSound.currentTime = 0;
                engineSound.play().catch(error => console.log("Audio play failed (user interaction required first):", error));

                // 1. Driving Away (Slide Left)
                carImage.classList.add('drive-out');

                // Wait for the drive-out animation to finish (approx 600ms)
                setTimeout(() => {
                    // 2. Change Source
                    carImage.src = newSrc;

                    // 3. Prepare Entry (Teleport to Right) without transition
                    carImage.classList.remove('drive-out');
                    carImage.classList.add('prepare-enter');

                    // Force Reflow
                    void carImage.offsetWidth;

                    // 4. Drive In (Slide to Center)
                    carImage.onload = () => {
                        carImage.classList.remove('prepare-enter');
                    };
                }, 600);
            }
        });
    });

    // Clean up entry animation so it doesn't conflict with transitions
    carImage.addEventListener('animationend', () => {
        carImage.classList.remove('entry-anim');
    });

    // Scroll to About section on Start Click
    const startBtn = document.querySelector('.start-btn');
    const aboutSection = document.getElementById('about');

    if (startBtn && aboutSection) {
        startBtn.addEventListener('click', () => {
            aboutSection.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Scroll Observer for Animations
    const observerOptions = {
        threshold: 0.3
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, observerOptions);

    const sections = document.querySelectorAll('section, main');
    sections.forEach(sec => observer.observe(sec));

    // Models Carousel Logic
    const modelImage = document.getElementById('model-image');
    const prevModelBtn = document.getElementById('prev-model');
    const nextModelBtn = document.getElementById('next-model');

    if (modelImage && prevModelBtn && nextModelBtn) {
        const modelImages = [
            'assets/ultimae_side.png',   // Orange (Default)
            'assets/ultimae_silver.png', // Silver
            'assets/ultimae_yellow.png'  // Yellow
        ];
        let currentModelIndex = 0;

        function updateModelImage(index) {
            // Fade out
            modelImage.style.opacity = '0';
            modelImage.style.transform = 'translateX(-20px)';

            setTimeout(() => {
                modelImage.src = modelImages[index];
                // Fade in
                modelImage.onload = () => {
                    modelImage.style.opacity = '1';
                    modelImage.style.transform = 'translateX(0)';
                };
            }, 300);
        }

        nextModelBtn.addEventListener('click', () => {
            currentModelIndex = (currentModelIndex + 1) % modelImages.length;
            updateModelImage(currentModelIndex);
        });

        prevModelBtn.addEventListener('click', () => {
            currentModelIndex = (currentModelIndex - 1 + modelImages.length) % modelImages.length;
            updateModelImage(currentModelIndex);
        });
    }

    // Scroll Spy for Navigation
    const navLinks = document.querySelectorAll('nav a');
    const scrollSpyOptions = {
        threshold: 0.5 // Trigger when 50% of section is visible
    };

    const scrollSpy = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                // Remove active class from all links
                navLinks.forEach(link => link.classList.remove('active'));
                // Add active class to corresponding link
                const activeLink = document.querySelector(`nav a[href="#${id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, scrollSpyOptions);

    sections.forEach(sec => scrollSpy.observe(sec));

    // Force run once on load to highlight current section
    const currentSection = [...sections].find(sec => {
        const rect = sec.getBoundingClientRect();
        return rect.top <= 100 && rect.bottom >= 100;
    });

    if (currentSection) {
        const id = currentSection.getAttribute('id');
        const activeLink = document.querySelector(`nav a[href="#${id}"]`);
        if (activeLink) navLinks.forEach(l => l.classList.remove('active'));
        if (activeLink) activeLink.classList.add('active');
    } else if (window.scrollY < 100) {
        // Fallback for top of page
        const homeLink = document.querySelector('nav a[href="#hero"]');
        if (homeLink) homeLink.classList.add('active');
    }

    // Scroll to Top Logic
    const scrollTopBtn = document.getElementById('scrollTopBtn');

    if (scrollTopBtn) {
        const header = document.querySelector('header');

        window.addEventListener('scroll', () => {
            // Header Logic
            if (window.scrollY > 50) {
                if (header) header.classList.add('scrolled');
            } else {
                if (header) header.classList.remove('scrolled');
            }

            // Scroll Top Button Logic
            if (window.scrollY > 500) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });

        scrollTopBtn.addEventListener('click', () => {
            // Trigger Launch Animation
            scrollTopBtn.classList.add('launching');

            // Smooth Scroll to Top
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });

            // Reset animation class after it finishes
            setTimeout(() => {
                scrollTopBtn.classList.remove('launching');
            }, 800);
        });
    }
});

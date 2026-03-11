document.addEventListener('DOMContentLoaded', () => {
    /* ==========================================================================
       Hero Canvas Network Animation
       ========================================================================== */
    const canvas = document.getElementById('hero-network');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];
        
        // Colors from our corporate palette (Deep Blue / White / Gold)
        const particleColor = 'rgba(255, 255, 255, 0.4)';
        const lineColor = 'rgba(212, 175, 55, 0.15)'; // Gold tint for connections

        function initCanvas() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = document.querySelector('.hero').offsetHeight;
            
            // Number of particles depends on screen size - significantly reduced for mobile
            const isMobile = width < 768;
            const particleFactor = isMobile ? 25000 : 12000; 
            const particleCount = Math.min(Math.floor(width * height / particleFactor), isMobile ? 30 : 100);
            
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * (isMobile ? 0.3 : 0.5), // Slower on mobile
                    vy: (Math.random() - 0.5) * (isMobile ? 0.3 : 0.5),
                    radius: Math.random() * (isMobile ? 1.5 : 2) + 1
                });
            }
        }

        function animateCanvas() {
            requestAnimationFrame(animateCanvas);
            ctx.clearRect(0, 0, width, height);

            // Update and draw particles
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                
                // Move
                p.x += p.vx;
                p.y += p.vy;
                
                // Bounce off edges
                if (p.x < 0 || p.x > width) p.vx = -p.vx;
                if (p.y < 0 || p.y > height) p.vy = -p.vy;

                // Draw dot
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = particleColor;
                ctx.fill();

                // Connect to nearby particles
                const connectionDist = width < 768 ? 100 : 150;
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const distance = Math.sqrt(dx*dx + dy*dy);
                    
                    if (distance < connectionDist) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        // Opacity based on distance
                        ctx.strokeStyle = `rgba(212, 175, 55, ${0.15 * (1 - distance/connectionDist)})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            }
        }

        // Initialize and handle resize
        initCanvas();
        animateCanvas();
        
        window.addEventListener('resize', () => {
            initCanvas();
        });
    }


    /* ==========================================================================
       Navigation Scroll Effect & Mobile Menu
       ========================================================================== */
    const navbar = document.getElementById('navbar');
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links a');
    const mobileIcon = mobileBtn.querySelector('i');

    // Handle scroll for navbar background
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            if (!navLinks.classList.contains('active')) {
                navbar.classList.remove('scrolled');
            }
        }
    });

    function toggleMenu() {
        navLinks.classList.toggle('active');
        const isActive = navLinks.classList.contains('active');
        
        mobileIcon.className = isActive ? 'fas fa-times' : 'fas fa-bars';
        
        if (isActive) {
            navbar.classList.add('scrolled');
            document.body.style.overflow = 'hidden'; // Prevent scroll when menu open
        } else {
            if (window.scrollY <= 50) {
                navbar.classList.remove('scrolled');
            }
            document.body.style.overflow = 'auto';
        }
    }

    // Mobile menu toggle
    mobileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });

    // Close mobile menu when a link is clicked
    navLinksItems.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navLinks.classList.contains('active') && !navLinks.contains(e.target) && !mobileBtn.contains(e.target)) {
            toggleMenu();
        }
    });

    /* ==========================================================================
       Scroll Animations (Intersection Observer)
       ========================================================================== */
    // Elements to animate
    const fadeElements = document.querySelectorAll('.fade-in-section');

    const appearOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            
            // Add visibility class
            entry.target.classList.add('is-visible');
            // Stop observing once appeared
            observer.unobserve(entry.target);
        });
    }, appearOptions);

    fadeElements.forEach(element => {
        appearOnScroll.observe(element);
    });

    /* ==========================================================================
       Contact Form Submission Handling 
       ========================================================================== */
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form button
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.textContent;
            
            // Animate button
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            btn.style.opacity = '0.8';
            btn.disabled = true;

            // Simulate form submission (e.g., API call)
            setTimeout(() => {
                // Success message
                formStatus.textContent = 'Thank you! Your message has been sent successfully. We will contact you soon.';
                formStatus.className = 'form-status success';
                
                // Reset form
                contactForm.reset();
                
                // Reset button
                btn.textContent = originalText;
                btn.style.opacity = '1';
                btn.disabled = false;
                
                // Hide message after 5 seconds
                setTimeout(() => {
                    formStatus.style.display = 'none';
                    formStatus.className = 'form-status';
                }, 5000);
                
            }, 1500); // 1.5s simulated delay
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // 1. Navbar Scroll Effect & Sticky Blur
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            // Toggle icon between bars and times
            const icon = hamburger.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close mobile menu when clicking a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = hamburger.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
    }

    // 3. Scroll Reveal Animations
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        });
    }, revealOptions);

    revealElements.forEach(el => revealOnScroll.observe(el));
    
    // Check if some elements are already in view on load
    setTimeout(() => {
        revealElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if(rect.top < window.innerHeight) {
                el.classList.add('active');
            }
        });
    }, 100);

    // 4. Animated Counters for Stats Section
    const counters = document.querySelectorAll('.stat-number');
    let counted = false;
    
    const counterObserver = new IntersectionObserver((entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !counted) {
            counted = true;
            counters.forEach(counter => {
                const target = +counter.getAttribute('data-target');
                const duration = 2000; // ms
                const increment = target / (duration / 16); // ~60fps
                
                let current = 0;
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.innerText = Math.ceil(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.innerText = target;
                        // Add + sign for some
                        if(target === 150 || target === 320 || target === 250) counter.innerText += '+';
                        if(target === 98) counter.innerText += '%';
                    }
                };
                updateCounter();
            });
        }
    }, { threshold: 0.5 });
    
    const eventsSection = document.querySelector('#events');
    if(eventsSection) counterObserver.observe(eventsSection);

    // 5. Contact Form Submission (Active via FormSubmit)
    const contactForm = document.getElementById('contactForm');
    if(contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerHTML;
            
            btn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';
            btn.style.opacity = '0.8';
            btn.disabled = true;

            // Gather form data
            const formData = new FormData(contactForm);

            // Send using FormSubmit AJAX
            fetch('https://formsubmit.co/ajax/contact@aanspire.com', {
                method: 'POST',
                headers: { 
                    'Accept': 'application/json'
                },
                body: formData
            })
            .then(response => {
                if(response.ok) {
                    return response.json();
                }
                throw new Error('Network response was not ok.');
            })
            .then(data => {
                btn.innerHTML = 'Message Sent! <i class="fas fa-check"></i>';
                btn.style.background = '#48BB78'; // success green
                btn.style.color = 'white';
                contactForm.reset();
                
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.background = ''; // revert to css
                    btn.style.color = '';
                    btn.style.opacity = '1';
                    btn.disabled = false;
                }, 3000);
            })
            .catch(error => {
                console.error('Error submitting form:', error);
                btn.innerHTML = 'Failed to Send. <i class="fas fa-times"></i>';
                btn.style.background = '#E53E3E'; // error red
                btn.style.color = 'white';
                
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.background = ''; // revert to css
                    btn.style.color = '';
                    btn.style.opacity = '1';
                    btn.disabled = false;
                }, 3000);
            });
        });
    }

    // 6. Simple Particles Effect for Hero Background (Lightweight manual implementation)
    const initParticles = () => {
        const particlesContainer = document.getElementById('particles-js');
        if (!particlesContainer) return;
        
        const particleCount = 20;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            
            // Random properties
            const size = Math.random() * 6 + 2;
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const opacity = Math.random() * 0.4 + 0.1;
            const duration = Math.random() * 15 + 10;
            const delay = Math.random() * 5;
            
            // Styles
            particle.style.position = 'absolute';
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.background = 'var(--primary-color)';
            particle.style.borderRadius = '50%';
            particle.style.left = `${x}%`;
            particle.style.top = `${y}%`;
            particle.style.opacity = opacity;
            
            // CSS Web Animation API
            particle.animate([
                { transform: `translate(0, 0)`, opacity: opacity },
                { transform: `translate(${Math.random() * 100 - 50}px, ${Math.random() * -150 - 50}px)`, opacity: 0 }
            ], {
                duration: duration * 1000,
                delay: delay * 1000,
                iterations: Infinity,
                direction: 'alternate',
                easing: 'ease-in-out'
            });
            
            particlesContainer.appendChild(particle);
        }
    };
    
    initParticles();
});

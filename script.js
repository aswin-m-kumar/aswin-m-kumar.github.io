// script.js
document.addEventListener('DOMContentLoaded', function() {
    // --- Gemini API Configuration ---
    const API_KEY = ""; // Leave this empty, it will be handled by the environment
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${API_KEY}`;

    // --- Theme toggle functionality ---
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    const themeIcon = themeToggle.querySelector('.material-icons');
    
    const currentTheme = localStorage.getItem('theme') || 'light';
    body.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
        
        themeToggle.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            themeToggle.style.transform = 'rotate(0deg)';
        }, 300);
    });
    
    function updateThemeIcon(theme) {
        themeIcon.textContent = theme === 'dark' ? 'light_mode' : 'dark_mode';
    }
    
    // --- Mobile navigation toggle ---
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // --- Smooth scrolling for navigation links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 70;
                const elementPosition = target.offsetTop;
                const offsetPosition = elementPosition - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // --- Navbar background on scroll ---
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.style.background = body.getAttribute('data-theme') === 'dark' 
                ? 'rgba(15, 23, 42, 0.98)' 
                : 'rgba(255, 255, 255, 0.98)';
        } else {
            navbar.style.background = body.getAttribute('data-theme') === 'dark' 
                ? 'rgba(15, 23, 42, 0.95)' 
                : 'rgba(255, 255, 255, 0.95)';
        }
    });
    
    // --- Intersection Observer for animations ---
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    const animateElements = document.querySelectorAll('.skill-category, .project-card, .certificate-card, .stat-card, .contact-item');
    animateElements.forEach((el, index) => {
        el.classList.add('fade-in');
        el.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(el);
    });
    
    // --- Active navigation link highlighting ---
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    function highlightNavigation() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
    window.addEventListener('scroll', highlightNavigation);

    // --- SMART CONTACT FORM ---
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('contactSubmitBtn');
    const formResponseDiv = document.getElementById('form-response');

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const name = document.getElementById('contactName').value;
            const email = document.getElementById('contactEmail').value;
            const message = document.getElementById('contactMessage').value;
            const originalBtnText = submitBtn.innerHTML;

            submitBtn.innerHTML = 'Thinking...';
            submitBtn.disabled = true;

            const prompt = `
                You are a friendly and professional assistant for Aswin M Kumar, an engineering student. 
                A person named ${name} has sent the following message through his portfolio contact form. 
                Analyze the message and draft a brief, encouraging, and relevant reply that I can show as an instant confirmation.
                Keep it under 30 words.
                The message is: "${message}"
            `;
            
            const payload = {
                contents: [{ role: "user", parts: [{ text: prompt }] }]
            };

            try {
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const result = await response.json();

                let aiResponse = "Thank you for your message! I'll get back to you soon.";
                if (result.candidates && result.candidates[0].content.parts[0].text) {
                    aiResponse = result.candidates[0].content.parts[0].text;
                }
                
                formResponseDiv.textContent = `✨ ${aiResponse}`;
                formResponseDiv.className = 'form-response success';
                formResponseDiv.style.display = 'block';
                submitBtn.innerHTML = 'Message Sent!';
                contactForm.reset();

            } catch (error) {
                console.error("Error with contact form AI:", error);
                formResponseDiv.textContent = 'Sorry, there was an error. Please try sending your message again.';
                formResponseDiv.className = 'form-response error';
                formResponseDiv.style.display = 'block';
            } finally {
                setTimeout(() => {
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                    formResponseDiv.style.display = 'none';
                }, 5000);
            }
        });
    }

    // --- General page animations and effects ---
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const text = heroTitle.innerHTML;
        heroTitle.innerHTML = '';
        let i = 0;
        function typeWriter() {
            if (i < text.length) {
                heroTitle.innerHTML += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        }
        setTimeout(typeWriter, 1000);
    }
    
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const parallax = hero.querySelector('.hero-visual');
            if (parallax) {
                parallax.style.transform = `translateY(${window.pageYOffset * 0.5}px)`;
            }
        });
    }
    
    const hoverCards = document.querySelectorAll('.project-card, .certificate-card');
    hoverCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    const skillTags = document.querySelectorAll('.skill-tag');
    skillTags.forEach(tag => {
        tag.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) rotate(5deg)';
        });
        tag.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    });
    
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });
    
    const revealElements = document.querySelectorAll('.about-text, .hero-text, .section-title');
    revealElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s ease';
        el.style.transitionDelay = `${index * 0.2}s`;
        
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 500);
    });
});

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

    // ============================================================
    // --- SMART GITHUB PROJECT LOADER (Step 1 - PRO VERSION) ---
    // ============================================================
    async function loadProjects() {
        const container = document.getElementById('auto-projects-container');
        if (!container) return;

        // Show skeleton loading cards
        container.innerHTML = `
            <div class="project-card skeleton-card">
                <div class="skeleton skeleton-icon"></div>
                <div class="skeleton skeleton-title"></div>
                <div class="skeleton skeleton-text"></div>
                <div class="skeleton skeleton-text short"></div>
                <div class="skeleton skeleton-tags"></div>
            </div>
            <div class="project-card skeleton-card">
                <div class="skeleton skeleton-icon"></div>
                <div class="skeleton skeleton-title"></div>
                <div class="skeleton skeleton-text"></div>
                <div class="skeleton skeleton-text short"></div>
                <div class="skeleton skeleton-tags"></div>
            </div>
            <div class="project-card skeleton-card">
                <div class="skeleton skeleton-icon"></div>
                <div class="skeleton skeleton-title"></div>
                <div class="skeleton skeleton-text"></div>
                <div class="skeleton skeleton-text short"></div>
                <div class="skeleton skeleton-tags"></div>
            </div>
        `;

        try {
            const response = await fetch(
                "https://api.github.com/users/aswin-m-kumar/repos?per_page=100",
                {
                    headers: {
                        'Accept': 'application/vnd.github.mercy-preview+json' // Enables topics in response
                    }
                }
            );

            if (!response.ok) {
                throw new Error(`GitHub API error: ${response.status}`);
            }

            let repos = await response.json();

            // --- FILTER: Remove forks and repos without descriptions ---
            repos = repos.filter(repo =>
                !repo.fork &&
                repo.description &&
                repo.description.trim() !== '' &&
                !repo.name.includes('.github.io') // Exclude the portfolio repo itself
            );

            // --- SORT: Stars first, then by most recently updated ---
            repos.sort((a, b) =>
                b.stargazers_count - a.stargazers_count ||
                new Date(b.updated_at) - new Date(a.updated_at)
            );

            // --- TAKE TOP 6 ---
            const topRepos = repos.slice(0, 6);

            container.innerHTML = '';

            if (topRepos.length === 0) {
                container.innerHTML = `
                    <div class="no-projects-msg">
                        <span class="material-icons">info</span>
                        <p>No public repos with descriptions found. Add descriptions to your GitHub repos to show them here!</p>
                    </div>
                `;
                return;
            }

            topRepos.forEach((repo, index) => {
                const card = document.createElement('div');
                card.classList.add('project-card', 'auto-project-card');
                card.style.animationDelay = `${index * 0.1}s`;

                // Pick a language icon/color
                const langColor = getLanguageColor(repo.language);
                const updatedDate = new Date(repo.updated_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

                // Build topic tags (if any)
                const topicTagsHTML = repo.topics && repo.topics.length > 0
                    ? repo.topics.slice(0, 3).map(t => `<span class="tag topic-tag">${t}</span>`).join('')
                    : '';

                card.innerHTML = `
                    <div class="project-icon" style="background: ${langColor.bg}">
                        <span class="material-icons" style="color:${langColor.icon}">code</span>
                    </div>
                    <h3>${formatRepoName(repo.name)}</h3>
                    <p>${repo.description}</p>
                    <div class="project-meta-row">
                        ${repo.language ? `<span class="meta-badge lang-badge"><span class="lang-dot" style="background:${langColor.dot}"></span>${repo.language}</span>` : ''}
                        ${repo.stargazers_count > 0 ? `<span class="meta-badge"><span class="material-icons" style="font-size:0.9rem;">star</span>${repo.stargazers_count}</span>` : ''}
                        <span class="meta-badge"><span class="material-icons" style="font-size:0.9rem;">schedule</span>${updatedDate}</span>
                    </div>
                    <div class="project-tags">
                        ${topicTagsHTML}
                    </div>
                    <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary project-btn">
                        <span class="material-icons">open_in_new</span>
                        View on GitHub
                    </a>
                `;
                container.appendChild(card);
            });

        } catch (error) {
            console.error('Failed to load GitHub projects:', error);
            container.innerHTML = `
                <div class="no-projects-msg">
                    <span class="material-icons">wifi_off</span>
                    <p>Could not load projects right now. <a href="https://github.com/aswin-m-kumar" target="_blank">View on GitHub →</a></p>
                </div>
            `;
        }
    }

    // Helper: Format repo name (kebab-case → Title Case)
    function formatRepoName(name) {
        return name
            .replace(/[-_]/g, ' ')
            .replace(/\b\w/g, c => c.toUpperCase());
    }

    // Helper: Language → color mapping
    function getLanguageColor(language) {
        const colors = {
            'Python':     { bg: 'linear-gradient(135deg,#3572A5,#1e4d6b)', icon: '#fff', dot: '#3572A5' },
            'JavaScript': { bg: 'linear-gradient(135deg,#f1e05a,#b8a800)', icon: '#1a1a1a', dot: '#f1e05a' },
            'HTML':       { bg: 'linear-gradient(135deg,#e34c26,#a0311a)', icon: '#fff', dot: '#e34c26' },
            'CSS':        { bg: 'linear-gradient(135deg,#563d7c,#3a2752)', icon: '#fff', dot: '#563d7c' },
            'C':          { bg: 'linear-gradient(135deg,#555555,#333)', icon: '#fff', dot: '#555555' },
            'C++':        { bg: 'linear-gradient(135deg,#f34b7d,#a0183f)', icon: '#fff', dot: '#f34b7d' },
            'Dart':       { bg: 'linear-gradient(135deg,#00B4AB,#006b67)', icon: '#fff', dot: '#00B4AB' },
            'default':    { bg: 'linear-gradient(135deg,#6366f1,#8b5cf6)', icon: '#fff', dot: '#6366f1' }
        };
        return colors[language] || colors['default'];
    }

    // Kick off the loader
    loadProjects();

    // --- SMART CONTACT FORM with Formspree Integration ---
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('contactSubmitBtn');
    const formResponseDiv = document.getElementById('form-response');

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const originalBtnText = submitBtn.innerHTML;

            submitBtn.innerHTML = 'Sending...';
            submitBtn.disabled = true;

            try {
                const formspreeResponse = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (!formspreeResponse.ok) {
                    throw new Error('Failed to send message. Please try again later.');
                }
                
                const message = formData.get('message');
                const name = formData.get('name');

                const prompt = `
                    You are a friendly and professional assistant for Aswin M Kumar, an engineering student. 
                    A person named ${name} has sent the following message through his portfolio contact form. 
                    Analyze the message and draft a brief, encouraging, and relevant reply that I can show as an instant confirmation.
                    Keep it under 30 words.
                    The message is: "${message}"
                `;
                
                const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] };

                const geminiResponse = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                let aiResponse = "Thank you for your message! I'll get back to you soon.";
                if (geminiResponse.ok) {
                    const result = await geminiResponse.json();
                    if (result.candidates && result.candidates[0].content.parts[0].text) {
                        aiResponse = result.candidates[0].content.parts[0].text;
                    }
                }
                
                formResponseDiv.textContent = `✨ ${aiResponse}`;
                formResponseDiv.className = 'form-response success';
                formResponseDiv.style.display = 'block';
                submitBtn.innerHTML = 'Message Sent!';
                contactForm.reset();

            } catch (error) {
                console.error("Error with contact form submission:", error);
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
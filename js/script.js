// ============================================
// MENU HAMBURGER
// ============================================

const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

if (hamburger && navMenu) {
    // Toggle menu mobile
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Fermer le menu au clic sur un lien
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // Fermer le menu si on clique en dehors
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
}

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================

let lastScroll = 0;
const navbar = document.getElementById('navbar');

if (navbar) {
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Effet ombre au scroll
        if (currentScroll > 50) {
            navbar.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
            navbar.style.padding = '15px 0';
        } else {
            navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
            navbar.style.padding = '20px 0';
        }
        
        lastScroll = currentScroll;
    });
}

// ============================================
// SMOOTH SCROLL
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        
        // Ignore si c'est juste "#"
        if (targetId === '#' || targetId === '') return;
        
        e.preventDefault();
        
        const targetElement = document.querySelector(targetId);
        
        if (targetElement && navbar) {
            // Offset pour la navbar fixe
            const navbarHeight = navbar.offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// ACTIVE LINK ON SCROLL
// ============================================

const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ============================================
// ANIMATED COUNTERS (Hero Stats)
// ============================================

const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counters = entry.target.querySelectorAll('.stat-number');
            counters.forEach(counter => {
                const target = counter.textContent;
                
                // Anime seulement les nombres avec "+"
                if (target.includes('+')) {
                    const num = parseInt(target);
                    animateCounter(counter, 0, num, 2000);
                } else if (target.includes('sem')) {
                    // Pas d'animation pour "2 sem"
                    return;
                }
            });
            counterObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    counterObserver.observe(heroStats);
}

function animateCounter(element, start, end, duration) {
    let startTime = null;
    
    function step(currentTime) {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const current = Math.floor(progress * (end - start) + start);
        element.textContent = current + '+';
        
        if (progress < 1) {
            requestAnimationFrame(step);
        }
    }
    
    requestAnimationFrame(step);
}

// ============================================
// SCROLL ANIMATIONS (Fade in cards)
// ============================================

const animateOnScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

document.querySelectorAll('.service-card, .project-card').forEach(el => {
    animateOnScroll.observe(el);
});

// ============================================
// FORMULAIRE DE CONTACT - VALIDATION
// ============================================

const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');

if (contactForm) {
    // Validation en temps réel
    const inputs = contactForm.querySelectorAll('input, select, textarea');

    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            // Enlève l'erreur quand l'utilisateur tape
            this.classList.remove('error');
            const errorMsg = this.parentElement.querySelector('.error-message');
            if (errorMsg) {
                errorMsg.remove();
            }
        });
    });

    // Validation au submit
    contactForm.addEventListener('submit', function(e) {
        let isValid = true;
        const requiredFields = contactForm.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            e.preventDefault();
            
            // Scroll vers le premier champ en erreur
            const firstError = contactForm.querySelector('.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstError.focus();
            }
            return;
        }
        
        // Loading state
        const submitBtn = contactForm.querySelector('.btn-submit');
        if (submitBtn) {
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Envoi en cours...</span>';
        }
    });
}

// Fonction de validation
function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Enlève les erreurs existantes
    field.classList.remove('error');
    const existingError = field.parentElement.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Champs requis
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'Ce champ est obligatoire';
    }
    
    // Email
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Email invalide';
        }
    }
    
    // Téléphone français
    if (field.type === 'tel' && value) {
        const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
        if (!phoneRegex.test(value.replace(/\s/g, ''))) {
            isValid = false;
            errorMessage = 'Numéro invalide';
        }
    }
    
    // Affiche l'erreur si nécessaire
    if (!isValid) {
        field.classList.add('error');
        const errorDiv = document.createElement('span');
        errorDiv.className = 'error-message';
        errorDiv.textContent = errorMessage;
        field.parentElement.appendChild(errorDiv);
    }
    
    return isValid;
}

// Format automatique du téléphone
const phoneInput = document.getElementById('telephone');
if (phoneInput) {
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\s/g, '');
        
        // Ajoute des espaces tous les 2 chiffres
        if (value.length > 2) {
            value = value.match(/.{1,2}/g).join(' ');
        }
        
        e.target.value = value;
    });
}

// Message de succès après redirection Formspree
if (window.location.hash === '#contact' && document.referrer.includes('formspree')) {
    if (formSuccess && contactForm) {
        contactForm.style.display = 'none';
        formSuccess.style.display = 'block';
        
        setTimeout(() => {
            formSuccess.style.display = 'none';
            contactForm.style.display = 'block';
            contactForm.reset();
        }, 5000);
    }
}

// ============================================
// COPIE EMAIL AU CLIC (Desktop)
// ============================================

const emailLinks = document.querySelectorAll('a[href^="mailto:"]');

emailLinks.forEach(link => {
    // Seulement sur desktop
    if (!/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const email = this.getAttribute('href').replace('mailto:', '');
            
            // Copie dans le presse-papier
            navigator.clipboard.writeText(email).then(() => {
                // Affiche un message de confirmation
                const originalText = this.textContent;
                this.textContent = '✓ Copié !';
                this.style.color = '#10b981';
                
                setTimeout(() => {
                    this.textContent = originalText;
                    this.style.color = '';
                }, 2000);
            });
        });
    }
});

// ============================================
// MOBILE DETECTION
// ============================================

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
if (isMobile) {
    document.body.classList.add('mobile');
}

// ============================================
// CONSOLE MESSAGE
// ============================================

console.log('%c👋 Salut ! Tu regardes le code ? 🧑‍💻', 'color: #6366f1; font-size: 16px; font-weight: bold;');
console.log('%cSi tu as des questions sur mon portfolio, contacte-moi !', 'color: #64748b; font-size: 14px;');
console.log('%c📧 merickoken54@gmail.com', 'color: #6366f1; font-size: 14px;');
console.log('%c🌐 https://nexusproject2077.github.io/portfolio/', 'color: #6366f1; font-size: 14px;');

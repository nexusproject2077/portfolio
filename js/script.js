// ============================================
// MENU HAMBURGER
// ============================================

const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

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

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================

let lastScroll = 0;
const navbar = document.getElementById('navbar');

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
    
    // Cache la navbar au scroll down, affiche au scroll up (optionnel)
    // Décommente si tu veux cet effet
    /*
    if (currentScroll > lastScroll && currentScroll > 100) {
        navbar.style.transform = 'translateY(-100%)';
    } else {
        navbar.style.transform = 'translateY(0)';
    }
    */
    
    lastScroll = currentScroll;
});

// ============================================
// SMOOTH SCROLL
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        
        // Ignore si c'est juste "#"
        if (targetId === '#') return;
        
        e.preventDefault();
        
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
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
// FORMULAIRE DE CONTACT - VALIDATION
// ============================================

const contactForm = document.getElementById('contact-form');

// Validation en temps réel
const inputs = contactForm.querySelectorAll('input, select, textarea');

inputs.forEach(input => {
    input.addEventListener('blur', () => {
        validateInput(input);
    });
    
    input.addEventListener('input', () => {
        if (input.classList.contains('error')) {
            validateInput(input);
        }
    });
});

function validateInput(input) {
    const value = input.value.trim();
    
    // Retirer les erreurs précédentes
    input.classList.remove('error');
    const existingError = input.parentElement.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Validation selon le type de champ
    let isValid = true;
    let errorMessage = '';
    
    if (input.hasAttribute('required') && value === '') {
        isValid = false;
        errorMessage = 'Ce champ est obligatoire';
    } else if (input.type === 'email' && value !== '') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Email invalide';
        }
    } else if (input.type === 'tel' && value !== '') {
        const telRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
        if (!telRegex.test(value.replace(/\s/g, ''))) {
            isValid = false;
            errorMessage = 'Numéro de téléphone invalide';
        }
    }
    
    // Afficher l'erreur si nécessaire
    if (!isValid) {
        input.classList.add('error');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = errorMessage;
        input.parentElement.appendChild(errorDiv);
    }
    
    return isValid;
}

// Soumission du formulaire
contactForm.addEventListener('submit', function(e) {
    // Valider tous les champs
    let isFormValid = true;
    
    inputs.forEach(input => {
        if (!validateInput(input)) {
            isFormValid = false;
        }
    });
    
    if (!isFormValid) {
        e.preventDefault();
        
        // Scroll vers la première erreur
        const firstError = contactForm.querySelector('.error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstError.focus();
        }
        
        return;
    }
    
    // Si le formulaire est valide, afficher un loading
    const submitButton = contactForm.querySelector('.btn-submit');
    const originalText = submitButton.textContent;
    
    submitButton.textContent = 'Envoi en cours...';
    submitButton.disabled = true;
    submitButton.style.opacity = '0.7';
    submitButton.style.cursor = 'not-allowed';
    
    // Note: Formspree gère l'envoi, ce code est juste pour l'UX
    // Le formulaire sera réellement soumis après ce code
    
    // Après soumission, on peut afficher un message de succès
    // (Formspree redirige par défaut, mais on peut personnaliser)
    
    // Reset du bouton après 2 secondes (au cas où)
    setTimeout(() => {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        submitButton.style.opacity = '1';
        submitButton.style.cursor = 'pointer';
    }, 2000);
});

// ============================================
// ANIMATIONS AU SCROLL
// ============================================

// Observer pour les animations d'entrée
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            
            // Unobserve après animation (performance)
            fadeInObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// Appliquer aux cartes de services et projets
document.querySelectorAll('.service-card, .project-card').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    fadeInObserver.observe(card);
});

// Animation des statistiques hero
const stats = document.querySelectorAll('.stat');
stats.forEach((stat, index) => {
    stat.style.opacity = '0';
    stat.style.transform = 'translateY(20px)';
    stat.style.transition = `opacity 0.6s ease ${0.6 + index * 0.1}s, transform 0.6s ease ${0.6 + index * 0.1}s`;
    
    setTimeout(() => {
        stat.style.opacity = '1';
        stat.style.transform = 'translateY(0)';
    }, 100);
});

// ============================================
// COMPTEUR ANIMÉ POUR LES STATISTIQUES
// ============================================

function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16); // 60 FPS
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + '+';
        }
    }, 16);
}

// Lancer l'animation des compteurs quand la section hero est visible
const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = document.querySelectorAll('.stat-number');
            
            // Animer le compteur "6+"
            if (statNumbers[0]) {
                animateCounter(statNumbers[0], 6);
            }
            
            // Animer le compteur "15+"
            if (statNumbers[1]) {
                animateCounter(statNumbers[1], 15);
            }
            
            heroObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroSection = document.querySelector('.hero');
if (heroSection) {
    heroObserver.observe(heroSection);
}

// ============================================
// HOVER EFFECT SUR LES CARTES PROJETS
// ============================================

const projectCards = document.querySelectorAll('.project-card');

projectCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// ============================================
// ACTIVE LINK DANS LA NAVIGATION
// ============================================

function setActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const navbarHeight = navbar.offsetHeight;
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - navbarHeight - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.pageYOffset >= sectionTop && 
            window.pageYOffset < sectionTop + sectionHeight) {
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

window.addEventListener('scroll', setActiveLink);

// ============================================
// PRELOADER (OPTIONNEL)
// ============================================

window.addEventListener('load', () => {
    // Cacher le preloader si tu en ajoutes un
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 300);
    }
    
    // Animation d'entrée de la hero section
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '1';
        heroContent.style.transform = 'translateY(0)';
    }
});

// ============================================
// FORMAT AUTOMATIQUE DU NUMÉRO DE TÉLÉPHONE
// ============================================

const telInput = document.getElementById('telephone');

if (telInput) {
    telInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\s/g, '');
        
        // Format français : 06 12 34 56 78
        if (value.length > 0) {
            value = value.match(/.{1,2}/g).join(' ');
        }
        
        e.target.value = value;
    });
}

// ============================================
// COPIER EMAIL AU CLIC
// ============================================

const emailLinks = document.querySelectorAll('a[href^="mailto:"]');

emailLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        // Sur desktop, on peut ajouter une option pour copier
        if (window.innerWidth > 768) {
            const showCopyOption = confirm('Voulez-vous copier l\'email dans le presse-papier ?');
            
            if (showCopyOption) {
                e.preventDefault();
                const email = this.textContent;
                
                navigator.clipboard.writeText(email).then(() => {
                    // Créer une notification de succès
                    const notification = document.createElement('div');
                    notification.className = 'copy-notification';
                    notification.textContent = '✓ Email copié !';
                    notification.style.cssText = `
                        position: fixed;
                        bottom: 30px;
                        right: 30px;
                        background: #6366f1;
                        color: white;
                        padding: 15px 25px;
                        border-radius: 8px;
                        font-weight: 600;
                        z-index: 10000;
                        animation: slideIn 0.3s ease;
                    `;
                    
                    document.body.appendChild(notification);
                    
                    setTimeout(() => {
                        notification.style.animation = 'slideOut 0.3s ease';
                        setTimeout(() => {
                            notification.remove();
                        }, 300);
                    }, 2000);
                });
            }
        }
    });
});

// ============================================
// DÉTECTION MOBILE
// ============================================

const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

if (isMobile) {
    // Ajustements spécifiques mobile
    document.body.classList.add('mobile-device');
    
    // Améliorer les liens tel: et mailto: sur mobile
    console.log('Version mobile détectée - UX optimisée');
}

// ============================================
// LAZY LOADING IMAGES
// ============================================

const images = document.querySelectorAll('img[data-src]');

const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
        }
    });
});

images.forEach(img => imageObserver.observe(img));

// ============================================
// BOUTON SCROLL TO TOP (OPTIONNEL)
// ============================================

// Créer le bouton si tu veux cette fonctionnalité
const createScrollTopButton = () => {
    const button = document.createElement('button');
    button.innerHTML = '↑';
    button.className = 'scroll-top-btn';
    button.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: #6366f1;
        color: white;
        border: none;
        font-size: 24px;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 999;
        box-shadow: 0 5px 15px rgba(99,102,241,0.3);
    `;
    
    document.body.appendChild(button);
    
    // Afficher/cacher selon le scroll
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            button.style.opacity = '1';
            button.style.visibility = 'visible';
        } else {
            button.style.opacity = '0';
            button.style.visibility = 'hidden';
        }
    });
    
    // Scroll to top au clic
    button.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Effet hover
    button.addEventListener('mouseenter', () => {
        button.style.transform = 'scale(1.1)';
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.transform = 'scale(1)';
    });
};

// Décommente si tu veux le bouton scroll to top
// createScrollTopButton();

// ============================================
// ANIMATIONS CSS (à ajouter dans le style.css)
// ============================================

// Ajouter ces keyframes dans ton CSS si tu utilises les notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    .error-message {
        color: #ef4444;
        font-size: 12px;
        margin-top: 5px;
        display: block;
    }
    
    .form-group input.error,
    .form-group select.error,
    .form-group textarea.error {
        border-color: #ef4444;
    }
    
    .nav-link.active {
        color: #6366f1;
    }
    
    .nav-link.active::after {
        width: 100%;
    }
`;

document.head.appendChild(style);

// ============================================
// CONSOLE MESSAGE (Easter Egg)
// ============================================

console.log('%c👋 Salut ! ', 'font-size: 20px; font-weight: bold; color: #6366f1;');
console.log('%cSi tu regardes ici, c\'est que tu t\'intéresses au code ! 🚀', 'font-size: 14px; color: #64748b;');
console.log('%cCe portfolio a été codé avec ❤️ par Meric', 'font-size: 12px; color: #64748b;');
console.log('%cBesoin d\'un développeur ? → merickoken54@gmail.com', 'font-size: 12px; color: #6366f1; font-weight: bold;');

// ============================================
// INITIALISATION
// ============================================

console.log('✅ Portfolio chargé avec succès');

// Vérifier que tous les éléments sont présents
const checkElements = () => {
    const requiredElements = {
        'navbar': navbar,
        'hamburger': hamburger,
        'navMenu': navMenu,
        'contactForm': contactForm
    };
    
    Object.entries(requiredElements).forEach(([name, element]) => {
        if (!element) {
            console.warn(`⚠️ Élément manquant : ${name}`);
        }
    });
};

checkElements();

// ============================================
// GOOGLE reCAPTCHA v3 - PROTECTION ANTI-SPAM
// ============================================

// Fonction appelée quand le reCAPTCHA est validé
function onSubmit(token) {
    // Le formulaire est maintenant soumis automatiquement
    document.getElementById("contact-form").submit();
}

// Gestion du formulaire avec reCAPTCHA
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Empêche la soumission directe
        
        // Validation des champs
        let isValid = true;
        const requiredFields = contactForm.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('error');
                
                if (!field.parentElement.querySelector('.error-message')) {
                    const errorMsg = document.createElement('span');
                    errorMsg.className = 'error-message';
                    errorMsg.textContent = 'Ce champ est obligatoire';
                    field.parentElement.appendChild(errorMsg);
                }
            } else {
                field.classList.remove('error');
                const errorMsg = field.parentElement.querySelector('.error-message');
                if (errorMsg) {
                    errorMsg.remove();
                }
            }
        });
        
        if (!isValid) {
            const firstError = contactForm.querySelector('.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstError.focus();
            }
            return;
        }
        
        // Si tout est OK, déclenche le reCAPTCHA
        const submitBtn = document.getElementById('submit-btn');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Vérification en cours...</span>';
        
        // Exécute le reCAPTCHA invisible
        grecaptcha.execute();
    });
    
    // Enlève l'erreur quand l'utilisateur tape
    const inputs = contactForm.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            this.classList.remove('error');
            const errorMsg = this.parentElement.querySelector('.error-message');
            if (errorMsg) {
                errorMsg.remove();
            }
        });
    });
}

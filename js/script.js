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
// HERO CONTENT FADE IN
// ============================================

const heroContent = document.querySelector('.hero-content');
if (heroContent) {
    window.addEventListener('DOMContentLoaded', () => {
        heroContent.style.opacity = '1';
        heroContent.style.transform = 'translateY(0)';
    });
    // Fallback si DOMContentLoaded est déjà passé
    if (document.readyState !== 'loading') {
        heroContent.style.opacity = '1';
        heroContent.style.transform = 'translateY(0)';
    }
}

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
            submitBtn.innerHTML = '<span>' + translations[currentLang]['loading'] + '</span>';
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
        errorMessage = translations[currentLang]['validation.required'];
    }

    // Email
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = translations[currentLang]['validation.email'];
        }
    }

    // Téléphone français
    if (field.type === 'tel' && value) {
        const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
        if (!phoneRegex.test(value.replace(/\s/g, ''))) {
            isValid = false;
            errorMessage = translations[currentLang]['validation.phone'];
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
// TRANSLATION SYSTEM (FR/EN)
// ============================================

const translations = {
    fr: {
        'nav.home': 'Accueil',
        'nav.services': 'Services',
        'nav.projects': 'Projets',
        'nav.contact': 'Contact',

        'hero.tag': 'Développeur Web Freelance',
        'hero.title': 'Je crée votre <span class="gradient-text">site web professionnel</span> en 2 semaines',
        'hero.description': "Développeur Full-Stack avec 6 ans d'expérience. Spécialisé dans les sites vitrines et e-commerce pour PME de l'Aube.",
        'hero.cta_primary': 'Demander un devis gratuit',
        'hero.cta_secondary': 'Voir mes projets',
        'hero.stat1': "Années d'expérience",
        'hero.stat2': 'Projets réalisés',
        'hero.stat3': 'Délai moyen',

        'services.tag': 'Mes offres',
        'services.title': 'Services & Tarifs',
        'services.description': 'Des packages clairs et transparents adaptés à vos besoins',
        'services.order': 'Commander',
        'services.popular': 'Populaire',
        'services.starter.f1': '✓ Site vitrine 5 pages',
        'services.starter.f2': '✓ Design responsive (mobile/tablette)',
        'services.starter.f3': '✓ Formulaire de contact',
        'services.starter.f4': '✓ Optimisation SEO de base',
        'services.starter.f5': '✓ Hébergement 1 an offert',
        'services.starter.time': 'Livraison : 2 semaines',
        'services.business.f1': '✓ Site vitrine 10 pages',
        'services.business.f2': '✓ CMS intégré (gestion facile)',
        'services.business.f3': '✓ Intégration réseaux sociaux',
        'services.business.f4': '✓ Google Analytics + Search Console',
        'services.business.f5': '✓ 1 mois de support gratuit',
        'services.business.time': 'Livraison : 3 semaines',
        'services.ecommerce.f1': '✓ Boutique en ligne complète',
        'services.ecommerce.f2': '✓ Paiement sécurisé (Stripe/PayPal)',
        'services.ecommerce.f3': '✓ Gestion produits & stock',
        'services.ecommerce.f4': '✓ Tunnel de commande optimisé',
        'services.ecommerce.f5': '✓ Formation client incluse',
        'services.ecommerce.time': 'Livraison : 5 semaines',

        'projects.tag': 'Portfolio',
        'projects.title': 'Projets Réalisés',
        'projects.description': 'Une sélection de mes réalisations techniques',
        'projects.view': 'Voir le projet',
        'projects.nexus.desc': "Plateforme sociale complète avec système d'authentification, publications dynamiques, messagerie instantanée et système de likes/commentaires. 5000+ lignes de code.",
        'projects.nexus.feat1': 'Authentification sécurisée',
        'projects.nexus.feat2': 'Messagerie temps réel',
        'projects.nexus.feat3': 'Interface responsive',
        'projects.flux.desc': "Boutique en ligne streetwear avec catalogue produits, panier dynamique, gestion des commandes et interface d'administration complète.",
        'projects.flux.feat1': 'Catalogue avec filtres',
        'projects.flux.feat2': 'Paiement intégré',
        'projects.flux.feat3': 'Panel administrateur',
        'projects.bmw.title': 'Site Vitrine BMW',
        'projects.bmw.desc': 'Site corporate responsive réalisé dans le cadre d\'un projet académique (IUT Troyes). Design moderne, animations fluides et optimisation SEO. Note : 18/20.',
        'projects.bmw.feat1': 'Design professionnel',
        'projects.bmw.feat2': 'Animations fluides',
        'projects.bmw.feat3': 'SEO optimisé',

        'contact.tag': 'Parlons de votre projet',
        'contact.title': 'Demander un Devis',
        'contact.description': 'Réponse garantie sous 24h',
        'contact.info_title': 'Informations de contact',
        'contact.phone_label': 'Téléphone',
        'contact.location_label': 'Localisation',
        'contact.availability_label': 'Disponibilité',
        'contact.availability_value': 'Lun - Ven : 9h - 18h',
        'contact.form.name': 'Nom complet *',
        'contact.form.name_placeholder': 'Jean Dupont',
        'contact.form.email_placeholder': 'jean@exemple.fr',
        'contact.form.phone': 'Téléphone',
        'contact.form.company': 'Entreprise',
        'contact.form.company_placeholder': 'Nom de votre entreprise',
        'contact.form.project_type': 'Type de projet *',
        'contact.form.select': 'Sélectionnez...',
        'contact.form.type_showcase': 'Site vitrine',
        'contact.form.type_webapp': 'Application web',
        'contact.form.type_redesign': 'Refonte de site existant',
        'contact.form.type_other': 'Autre',
        'contact.form.budget': 'Budget estimé *',
        'contact.form.budget_1': 'Moins de 500€',
        'contact.form.budget_5': '3000€ et plus',
        'contact.form.deadline': 'Délai souhaité',
        'contact.form.deadline_urgent': 'Urgent (moins de 2 semaines)',
        'contact.form.deadline_2': '2-4 semaines',
        'contact.form.deadline_3': '1-2 mois',
        'contact.form.deadline_4': '2-3 mois',
        'contact.form.deadline_flex': 'Flexible',
        'contact.form.message': 'Décrivez votre projet *',
        'contact.form.message_placeholder': 'Décrivez vos besoins, objectifs, fonctionnalités souhaitées...',
        'contact.form.source': "Comment m'avez-vous trouvé ?",
        'contact.form.source_referral': 'Recommandation',
        'contact.form.source_other_social': 'Autre réseau social',
        'contact.form.submit': 'Envoyer ma demande',
        'contact.form.notice': '* Champs obligatoires - Vos données sont sécurisées et ne seront jamais partagées',
        'contact.form.recaptcha': 'Ce site est protégé par reCAPTCHA. Les <a href="https://policies.google.com/privacy" target="_blank">Règles de confidentialité</a> et <a href="https://policies.google.com/terms" target="_blank">Conditions d\'utilisation</a> de Google s\'appliquent.',
        'contact.success_title': 'Message envoyé avec succès ! ✅',
        'contact.success_message': 'Merci pour votre demande. Je vous répondrai dans les 24 heures.',
        'contact.success_btn': 'Envoyer un autre message',

        'footer.tagline': 'Développeur Web Freelance basé à Troyes',
        'footer.copyright': '© 2025 Meric - Développeur Web. Tous droits réservés.',
        'footer.status': 'Auto-entrepreneur en cours de création',

        'validation.required': 'Ce champ est obligatoire',
        'validation.email': 'Email invalide',
        'validation.phone': 'Numéro invalide',
        'loading': 'Envoi en cours...'
    },
    en: {
        'nav.home': 'Home',
        'nav.services': 'Services',
        'nav.projects': 'Projects',
        'nav.contact': 'Contact',

        'hero.tag': 'Freelance Web Developer',
        'hero.title': 'I build your <span class="gradient-text">professional website</span> in 2 weeks',
        'hero.description': 'Full-Stack Developer with 6 years of experience. Specialized in showcase and e-commerce websites for SMEs in the Aube region.',
        'hero.cta_primary': 'Get a free quote',
        'hero.cta_secondary': 'View my projects',
        'hero.stat1': 'Years of experience',
        'hero.stat2': 'Completed projects',
        'hero.stat3': 'Average delivery',

        'services.tag': 'My offers',
        'services.title': 'Services & Pricing',
        'services.description': 'Clear and transparent packages tailored to your needs',
        'services.order': 'Order',
        'services.popular': 'Popular',
        'services.starter.f1': '✓ 5-page showcase website',
        'services.starter.f2': '✓ Responsive design (mobile/tablet)',
        'services.starter.f3': '✓ Contact form',
        'services.starter.f4': '✓ Basic SEO optimization',
        'services.starter.f5': '✓ 1 year free hosting',
        'services.starter.time': 'Delivery: 2 weeks',
        'services.business.f1': '✓ 10-page showcase website',
        'services.business.f2': '✓ Integrated CMS (easy management)',
        'services.business.f3': '✓ Social media integration',
        'services.business.f4': '✓ Google Analytics + Search Console',
        'services.business.f5': '✓ 1 month free support',
        'services.business.time': 'Delivery: 3 weeks',
        'services.ecommerce.f1': '✓ Complete online store',
        'services.ecommerce.f2': '✓ Secure payment (Stripe/PayPal)',
        'services.ecommerce.f3': '✓ Product & inventory management',
        'services.ecommerce.f4': '✓ Optimized checkout flow',
        'services.ecommerce.f5': '✓ Client training included',
        'services.ecommerce.time': 'Delivery: 5 weeks',

        'projects.tag': 'Portfolio',
        'projects.title': 'Completed Projects',
        'projects.description': 'A selection of my technical achievements',
        'projects.view': 'View project',
        'projects.nexus.desc': 'Complete social platform with authentication system, dynamic posts, instant messaging and likes/comments system. 5000+ lines of code.',
        'projects.nexus.feat1': 'Secure authentication',
        'projects.nexus.feat2': 'Real-time messaging',
        'projects.nexus.feat3': 'Responsive interface',
        'projects.flux.desc': 'Streetwear online store with product catalog, dynamic cart, order management and complete admin interface.',
        'projects.flux.feat1': 'Catalog with filters',
        'projects.flux.feat2': 'Integrated payment',
        'projects.flux.feat3': 'Admin panel',
        'projects.bmw.title': 'BMW Showcase Website',
        'projects.bmw.desc': 'Responsive corporate website created as an academic project (IUT Troyes). Modern design, smooth animations and SEO optimization. Grade: 18/20.',
        'projects.bmw.feat1': 'Professional design',
        'projects.bmw.feat2': 'Smooth animations',
        'projects.bmw.feat3': 'Optimized SEO',

        'contact.tag': "Let's talk about your project",
        'contact.title': 'Request a Quote',
        'contact.description': 'Guaranteed response within 24h',
        'contact.info_title': 'Contact information',
        'contact.phone_label': 'Phone',
        'contact.location_label': 'Location',
        'contact.availability_label': 'Availability',
        'contact.availability_value': 'Mon - Fri: 9am - 6pm',
        'contact.form.name': 'Full name *',
        'contact.form.name_placeholder': 'John Doe',
        'contact.form.email_placeholder': 'john@example.com',
        'contact.form.phone': 'Phone',
        'contact.form.company': 'Company',
        'contact.form.company_placeholder': 'Your company name',
        'contact.form.project_type': 'Project type *',
        'contact.form.select': 'Select...',
        'contact.form.type_showcase': 'Showcase website',
        'contact.form.type_webapp': 'Web application',
        'contact.form.type_redesign': 'Website redesign',
        'contact.form.type_other': 'Other',
        'contact.form.budget': 'Estimated budget *',
        'contact.form.budget_1': 'Less than 500€',
        'contact.form.budget_5': '3000€ and more',
        'contact.form.deadline': 'Desired deadline',
        'contact.form.deadline_urgent': 'Urgent (less than 2 weeks)',
        'contact.form.deadline_2': '2-4 weeks',
        'contact.form.deadline_3': '1-2 months',
        'contact.form.deadline_4': '2-3 months',
        'contact.form.deadline_flex': 'Flexible',
        'contact.form.message': 'Describe your project *',
        'contact.form.message_placeholder': 'Describe your needs, goals, desired features...',
        'contact.form.source': 'How did you find me?',
        'contact.form.source_referral': 'Referral',
        'contact.form.source_other_social': 'Other social media',
        'contact.form.submit': 'Send my request',
        'contact.form.notice': '* Required fields - Your data is secure and will never be shared',
        'contact.form.recaptcha': 'This site is protected by reCAPTCHA. Google\'s <a href="https://policies.google.com/privacy" target="_blank">Privacy Policy</a> and <a href="https://policies.google.com/terms" target="_blank">Terms of Service</a> apply.',
        'contact.success_title': 'Message sent successfully! ✅',
        'contact.success_message': 'Thank you for your request. I will respond within 24 hours.',
        'contact.success_btn': 'Send another message',

        'footer.tagline': 'Freelance Web Developer based in Troyes',
        'footer.copyright': '© 2025 Meric - Web Developer. All rights reserved.',
        'footer.status': 'Sole proprietorship in progress',

        'validation.required': 'This field is required',
        'validation.email': 'Invalid email',
        'validation.phone': 'Invalid number',
        'loading': 'Sending...'
    }
};

let currentLang = localStorage.getItem('lang') || 'fr';

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;

    // Update text content
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) {
            // For elements that contain HTML (like hero title, recaptcha info)
            if (translations[lang][key].includes('<')) {
                el.innerHTML = translations[lang][key];
            } else {
                el.textContent = translations[lang][key];
            }
        }
    });

    // Update placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (translations[lang][key]) {
            el.placeholder = translations[lang][key];
        }
    });

    // Update active button
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
}

// Language switcher click handler
const langSwitcher = document.getElementById('lang-switcher');
if (langSwitcher) {
    langSwitcher.addEventListener('click', (e) => {
        const btn = e.target.closest('.lang-btn');
        if (btn) {
            const lang = btn.getAttribute('data-lang');
            if (lang !== currentLang) {
                setLanguage(lang);
            }
        }
    });
}

// Apply saved language on load
if (currentLang !== 'fr') {
    setLanguage(currentLang);
}

// ============================================
// CONSOLE MESSAGE
// ============================================

console.log('%c👋 Salut ! Tu regardes le code ? 🧑‍💻', 'color: #6366f1; font-size: 16px; font-weight: bold;');
console.log('%cSi tu as des questions sur mon portfolio, contacte-moi !', 'color: #64748b; font-size: 14px;');
console.log('%c📧 merickoken54@gmail.com', 'color: #6366f1; font-size: 14px;');
console.log('%c🌐 https://nexusproject2077.github.io/portfolio/', 'color: #6366f1; font-size: 14px;');

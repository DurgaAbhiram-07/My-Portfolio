// ===== LOADING SCREEN =====
const loadingScreen = document.getElementById('loading-screen');
const signatureText = document.querySelector('.signature-text');

if (signatureText) {
    const text = signatureText.dataset.text || signatureText.textContent.trim();
    signatureText.textContent = '';

    const delayPerLetter = 0.12;
    [...text].forEach((char, index) => {
        const span = document.createElement('span');
        if (char === ' ') {
            span.classList.add('space');
            span.innerHTML = '&nbsp;';
        } else {
            span.textContent = char;
        }
        span.style.animationDelay = `${index * delayPerLetter}s`;
        signatureText.appendChild(span);
    });

    const totalTimeMs = Math.max(3200, (text.length * delayPerLetter + 0.8) * 1000);
    setTimeout(() => {
        loadingScreen.classList.add('fade-out');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 1000);
    }, totalTimeMs);
}

// (theme toggle removed)

// ===== SMOOTH SCROLL ANIMATION =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== ANIME-STYLE TEXT ANIMATION =====
class TextAnimator {
    constructor() {
        this.init();
    }

    init() {
        this.animateOnScroll();
    }

    animateOnScroll() {
        const elements = document.querySelectorAll('.section-title');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        elements.forEach(el => observer.observe(el));
    }

    animateElement(element) {
        const text = element.textContent;
        element.innerHTML = '';
        
        for (let i = 0; i < text.length; i++) {
            const span = document.createElement('span');
            span.textContent = text[i];
            span.style.display = 'inline-block';
            span.style.animation = `charDrop 0.5s ease-out ${i * 0.05}s forwards`;
            span.style.opacity = '0';
            element.appendChild(span);
        }
    }
}

// ===== PARTICLE EFFECT ON MOUSE MOVE =====
class ParticleEffect {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '9999';
        document.body.appendChild(this.canvas);
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        window.addEventListener('mousemove', (e) => this.createParticles(e));
        
        this.animate();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles(e) {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
        
        for (let i = 0; i < 3; i++) {
            const particle = {
                x: e.clientX,
                y: e.clientY,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4,
                life: 1,
                size: Math.random() * 3 + 1,
                color: ['#00d4ff', '#ff006e', '#ffbe0b'][Math.floor(Math.random() * 3)]
            };
            this.particles.push(particle);
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles = this.particles.filter(p => p.life > 0);
        
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life -= 0.02;
            particle.vy += 0.1; // gravity effect
            
            this.ctx.globalAlpha = particle.life * 0.8;
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
        
        this.ctx.globalAlpha = 1;
        requestAnimationFrame(() => this.animate());
    }
}

// ===== INTERACTIVE CARDS =====
class CardInteraction {
    constructor() {
        this.cards = document.querySelectorAll('.project-card');
        this.init();
    }

    init() {
        this.cards.forEach(card => {
            card.addEventListener('mouseenter', () => this.addGlow(card));
            card.addEventListener('mouseleave', () => this.removeGlow(card));
        });
    }

    addGlow(card) {
        card.style.boxShadow = '0 0 30px rgba(0, 212, 255, 0.5)';
        card.style.transform = 'translateY(-10px) scale(1.02)';
    }

    removeGlow(card) {
        card.style.boxShadow = 'none';
        card.style.transform = 'translateY(0) scale(1)';
    }
}

// ===== SCROLL ANIMATIONS =====
class ScrollAnimations {
    constructor() {
        this.init();
    }

    init() {
        const elements = document.querySelectorAll('.stat-item, .tech-badge, .project-card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, { threshold: 0.1 });

        elements.forEach(el => observer.observe(el));
    }

    animateElement(element) {
        element.style.animation = 'fadeInUp 0.6s ease-out forwards';
        element.style.opacity = '0';
    }
}

// ===== BUTTON RIPPLE EFFECT =====
class RippleEffect {
    constructor() {
        this.buttons = document.querySelectorAll('.cta-button, .submit-button');
        this.init();
    }

    init() {
        this.buttons.forEach(button => {
            button.addEventListener('click', (e) => this.createRipple(e, button));
        });
    }

    createRipple(e, button) {
        const rect = button.getBoundingClientRect();
        const ripple = document.createElement('span');
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.position = 'absolute';
        ripple.style.width = size + 'px';
        ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.background = 'rgba(255, 255, 255, 0.6)';
        ripple.style.borderRadius = '50%';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'rippleAnimation 0.6s ease-out';
        ripple.style.pointerEvents = 'none';
        
        button.style.position = 'relative';
        button.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }
}

// ===== COUNTER ANIMATION =====
class CounterAnimation {
    constructor() {
        this.init();
    }

    init() {
        const statItems = document.querySelectorAll('.stat-item h3');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statItems.forEach(item => observer.observe(item));
    }

    animateCounter(element) {
        const target = parseInt(element.textContent);
        const duration = 1500;
        const increment = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target + '+';
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    }
}

// ===== NAVBAR ANIMATION =====
class NavbarAnimation {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                this.navbar.style.boxShadow = '0 10px 40px rgba(0, 212, 255, 0.1)';
            } else {
                this.navbar.style.boxShadow = 'none';
            }
        });
    }
}

// ===== FORM VALIDATION & ANIMATION =====
class FormHandler {
    constructor() {
        this.form = document.querySelector('form');
        this.init();
    }

    init() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const inputs = this.form.querySelectorAll('input, textarea');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                this.shakeElement(input);
            }
        });

        if (isValid) {
            const submitButton = this.form.querySelector('button[type="submit"]');
            const originalText = submitButton.querySelector('span').textContent;
            submitButton.querySelector('span').textContent = 'Sending...';
            submitButton.disabled = true;

            try {
                // Get form data
                const formData = new FormData(this.form);
                const data = {
                    name: formData.get('name'),
                    email: formData.get('email'),
                    message: formData.get('message')
                };

                // Send to server
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (response.ok) {
                    this.showSuccessMessage();
                    this.form.reset();
                } else {
                    this.showErrorMessage(result.message || 'Failed to send message');
                }
            } catch (error) {
                console.error('Form submission error:', error);
                this.showErrorMessage('Server connection failed. Please email directly at abhirampulicharla414@gmail.com');
            } finally {
                submitButton.querySelector('span').textContent = originalText;
                submitButton.disabled = false;
            }
        }
    }

    shakeElement(element) {
        element.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            element.style.animation = 'none';
        }, 500);
    }

    showSuccessMessage() {
        const message = document.createElement('div');
        message.textContent = '✓ Message sent successfully!';
        message.style.position = 'fixed';
        message.style.top = '20px';
        message.style.right = '20px';
        message.style.background = '#00d4ff';
        message.style.color = '#0a0e27';
        message.style.padding = '1rem 2rem';
        message.style.borderRadius = '50px';
        message.style.fontSize = '1rem';
        message.style.fontWeight = '600';
        message.style.zIndex = '10000';
        message.style.animation = 'slideInRight 0.5s ease-out';
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.style.animation = 'slideOutRight 0.5s ease-out';
            setTimeout(() => message.remove(), 500);
        }, 3000);
    }

    showErrorMessage(errorText) {
        const message = document.createElement('div');
        message.textContent = '✗ ' + errorText;
        message.style.position = 'fixed';
        message.style.top = '20px';
        message.style.right = '20px';
        message.style.background = '#ff4757';
        message.style.color = '#fff';
        message.style.padding = '1rem 2rem';
        message.style.borderRadius = '50px';
        message.style.fontSize = '0.9rem';
        message.style.fontWeight = '600';
        message.style.zIndex = '10000';
        message.style.animation = 'slideInRight 0.5s ease-out';
        message.style.maxWidth = '400px';
        message.style.textAlign = 'center';
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.style.animation = 'slideOutRight 0.5s ease-out';
            setTimeout(() => message.remove(), 500);
        }, 6000);
    }
}

// ===== CURSOR FOLLOW EFFECT =====
class CursorFollow {
    constructor() {
        this.cursor = document.createElement('div');
        this.cursor.style.position = 'fixed';
        this.cursor.style.width = '20px';
        this.cursor.style.height = '20px';
        this.cursor.style.border = '2px solid #00d4ff';
        this.cursor.style.borderRadius = '50%';
        this.cursor.style.pointerEvents = 'none';
        this.cursor.style.zIndex = '10001';
        this.cursor.style.display = 'none';
        this.cursor.style.boxShadow = '0 0 10px rgba(0, 212, 255, 0.5)';
        document.body.appendChild(this.cursor);

        this.x = 0;
        this.y = 0;
        this.targetX = 0;
        this.targetY = 0;

        document.addEventListener('mousemove', (e) => {
            this.targetX = e.clientX;
            this.targetY = e.clientY;
            this.cursor.style.display = 'block';
        });

        this.animate();
    }

    animate() {
        this.x += (this.targetX - this.x) * 0.2;
        this.y += (this.targetY - this.y) * 0.2;

        this.cursor.style.left = this.x - 10 + 'px';
        this.cursor.style.top = this.y - 10 + 'px';

        requestAnimationFrame(() => this.animate());
    }
}

// ===== ADD CUSTOM ANIMATIONS =====
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }

    @keyframes slideInRight {
        0% {
            opacity: 0;
            transform: translateX(100px);
        }
        100% {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes slideOutRight {
        0% {
            opacity: 1;
            transform: translateX(0);
        }
        100% {
            opacity: 0;
            transform: translateX(100px);
        }
    }

    @keyframes rippleAnimation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }

    @keyframes charDrop {
        0% {
            opacity: 0;
            transform: translateY(-50px) rotateX(90deg);
        }
        100% {
            opacity: 1;
            transform: translateY(0) rotateX(0deg);
        }
    }
`;
document.head.appendChild(style);

// ===== INITIALIZE ALL COMPONENTS =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎨 Premium Portfolio Loaded!');
    
    new TextAnimator();
    new ParticleEffect();
    new CardInteraction();
    new ScrollAnimations();
    new RippleEffect();
    new CounterAnimation();
    new NavbarAnimation();
    new FormHandler();
    new CursorFollow();

    // Easter egg animation
    let clickCount = 0;
    document.addEventListener('click', () => {
        clickCount++;
        if (clickCount === 5) {
            triggerConfetti();
            clickCount = 0;
        }
    });
});

// ===== CONFETTI EFFECT =====
function triggerConfetti() {
    const confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    confetti.style.width = '10px';
    confetti.style.height = '10px';
    confetti.style.background = ['#00d4ff', '#ff006e', '#ffbe0b'][Math.floor(Math.random() * 3)];
    confetti.style.left = Math.random() * 100 + '%';
    confetti.style.top = '-10px';
    confetti.style.zIndex = '9998';
    confetti.style.borderRadius = '50%';
    confetti.style.pointerEvents = 'none';
    confetti.style.animation = `fall ${Math.random() * 2 + 2}s linear forwards`;
    
    document.body.appendChild(confetti);
    
    setTimeout(() => confetti.remove(), 2500);
}

// Add confetti animation
const confettiStyle = document.createElement('style');
confettiStyle.textContent = `
    @keyframes fall {
        to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(confettiStyle);

// ===== CONTACT FORM SUBMISSION =====
const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitButton = contactForm.querySelector('.submit-button');
        const submitText = submitButton.querySelector('span');
        const originalText = submitText.textContent;
        
        // Get form data
        const formData = {
            name: contactForm.querySelector('input[type="text"]').value.trim(),
            email: contactForm.querySelector('input[type="email"]').value.trim(),
            message: contactForm.querySelector('textarea').value.trim()
        };
        
        // Basic validation
        if (!formData.name || !formData.email || !formData.message) {
            showNotification('Please fill in all fields', 'error');
            return;
        }
        
        // Disable button during submission
        submitButton.disabled = true;
        submitText.textContent = 'Sending...';
        
        try {
            const response = await fetch('http://localhost:5000/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            const data = await response.json();
            
            if (data.success) {
                showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
                contactForm.reset();
                
                // Add success animation
                submitButton.style.animation = 'pulse 0.6s ease';
                setTimeout(() => {
                    submitButton.style.animation = '';
                }, 600);
            } else {
                showNotification(data.message || 'Failed to send message. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification('Failed to send message. Please check your connection and try again.', 'error');
        } finally {
            // Re-enable button
            submitButton.disabled = false;
            submitText.textContent = originalText;
        }
    });
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove any existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// ===== PERFORMANCE OPTIMIZATION =====
if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('[data-src]');
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
    
    lazyImages.forEach(img => imageObserver.observe(img));
}

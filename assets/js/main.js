document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('nav ul');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function(e) {
            e.preventDefault();
            navMenu.classList.toggle('open');
        });
    }

    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768 && navMenu) {
                navMenu.classList.remove('open');
            }
        });
    });

    // Smooth Scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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

    // Set active nav link based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Form validation
    const forms = document.querySelectorAll('form:not(.subscribe-form)');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!validateForm(this)) {
                e.preventDefault();
            }
        });
    });

    function validateForm(form) {
        let isValid = true;
        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
        
        inputs.forEach(input => {
            let errorSpan = input.parentElement.querySelector('.error-message');
            
            if (!errorSpan) {
                errorSpan = document.createElement('span');
                errorSpan.className = 'error-message';
                errorSpan.style.color = '#ef4444';
                errorSpan.style.fontSize = '0.85rem';
                errorSpan.style.marginTop = '0.3rem';
                errorSpan.style.display = 'block';
                input.parentElement.appendChild(errorSpan);
            }
            
            if (!input.value.trim()) {
                errorSpan.textContent = 'This field is required';
                input.style.borderColor = '#ef4444';
                isValid = false;
            } else if (input.type === 'email' && !validateEmail(input.value)) {
                errorSpan.textContent = 'Please enter a valid email address';
                input.style.borderColor = '#ef4444';
                isValid = false;
            } else if (input.type === 'tel' && !validatePhone(input.value)) {
                errorSpan.textContent = 'Please enter a valid phone number';
                input.style.borderColor = '#ef4444';
                isValid = false;
            } else {
                errorSpan.textContent = '';
                input.style.borderColor = '';
            }
        });
        
        return isValid;
    }

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function validatePhone(phone) {
        return /^[\d\s\-\+\(\)]{10,15}$/.test(phone);
    }

    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe service cards and other elements
    document.querySelectorAll('.service-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // Newsletter subscription with email handling
    const subscribeForms = document.querySelectorAll('.subscribe-form');
    subscribeForms.forEach(subscribeForm => {
        subscribeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            
            if (emailInput && validateEmail(emailInput.value)) {
                const email = emailInput.value;
                
                // Here you can integrate with your email service
                // For now, we'll show a success message
                
                // Create mailto link (this will open user's email client)
                const mailtoLink = `mailto:nmdassociates.insurancebanking@gmail.com?subject=Newsletter Subscription&body=Please add ${email} to your newsletter list.`;
                
                // Show success message
                const button = this.querySelector('button');
                const originalText = button.textContent;
                button.textContent = 'Subscribed!';
                button.style.background = '#10b981';
                
                // Optional: Send email automatically (opens email client)
                // window.location.href = mailtoLink;
                
                // You can also integrate with services like:
                // - EmailJS
                // - Formspree
                // - Your own backend API
                
                // Example with fetch to your backend:
                /*
                fetch('/api/subscribe', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: email })
                })
                .then(response => response.json())
                .then(data => {
                    console.log('Success:', data);
                });
                */
                
                emailInput.value = '';
                
                setTimeout(() => {
                    button.textContent = originalText;
                    button.style.background = '';
                }, 3000);
            } else {
                // Show error
                const emailInput = this.querySelector('input[type="email"]');
                emailInput.style.borderColor = '#ef4444';
                emailInput.placeholder = 'Please enter a valid email';
                
                setTimeout(() => {
                    emailInput.style.borderColor = '';
                    emailInput.placeholder = 'Your email';
                }, 3000);
            }
        });
    });

    // Contact form submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm(this)) {
                const formData = {
                    name: document.getElementById('name').value,
                    email: document.getElementById('email').value,
                    phone: document.getElementById('phone').value,
                    subject: document.getElementById('subject').value,
                    message: document.getElementById('message').value
                };
                
                // Create mailto link with form data
                const mailtoLink = `mailto:nmdassociates.insurancebanking@gmail.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\n\nMessage:\n${formData.message}`)}`;
                
                // Show success message
                alert('Thank you for your message! We will get back to you soon.');
                
                // Optional: Open email client
                // window.location.href = mailtoLink;
                
                // Reset form
                this.reset();
                
                // Clear error messages
                const errorSpans = this.querySelectorAll('.error-message');
                errorSpans.forEach(span => span.textContent = '');
            }
        });
    }
});

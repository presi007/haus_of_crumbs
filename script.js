// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navLinksItems = document.querySelectorAll('.nav-links li');
const menuFilters = document.querySelectorAll('.menu-filter');
const menuItems = document.querySelectorAll('.menu-item');
const galleryItems = document.querySelectorAll('.gallery-item');
const testimonialItems = document.querySelectorAll('.testimonial');
const contactForm = document.querySelector('.contact-form');
const scrollTopBtn = document.querySelector('.scroll-top');

// Mobile Navigation Toggle
hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
});

// Close mobile menu when clicking on a nav link
navLinksItems.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Smooth scrolling for anchor links with offset
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerHeight = document.querySelector('header').offsetHeight;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 20;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Throttle function for scroll events
const throttle = (func, limit) => {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// Intersection Observer for scroll animations
const initIntersectionObserver = () => {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Don't need to unobserve if you want animations to replay when scrolling back up
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all sections and other elements that should animate on scroll
    document.querySelectorAll('section, .menu-item, .gallery-item, .testimonial, .cta-button, .about-content, .menu-category').forEach(el => {
        observer.observe(el);
    });
};

// Initialize animations on page load
document.addEventListener('DOMContentLoaded', () => {
    initIntersectionObserver();
    initMenuFiltering();
    initTestimonialSlider();
    initScrollTopButton();
    initImageLightbox();
    initFormValidation();
});

// Image lazy loading and fade-in effect
const initLazyLoading = () => {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.style.opacity = '0';
                
                img.addEventListener('load', () => {
                    img.style.transition = 'opacity 0.5s ease-in-out';
                    img.style.opacity = '1';
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                });
                
                img.addEventListener('error', () => {
                    console.error('Error loading image:', img.dataset.src);
                    observer.unobserve(img);
                });
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
};

// WhatsApp button with custom message
const initWhatsAppButton = () => {
    const whatsappButton = document.querySelector('.whatsapp-button');
    if (!whatsappButton) return;

    // Add hover effect
    whatsappButton.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px)';
        this.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.2)';
    });
    
    whatsappButton.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
    });

    // Add click effect
    whatsappButton.addEventListener('mousedown', function() {
        this.style.transform = 'translateY(1px)';
    });
    
    whatsappButton.addEventListener('mouseup', function() {
        this.style.transform = 'translateY(-3px)';
    });
};

// Menu filtering functionality
const initMenuFiltering = () => {
    if (!menuFilters.length) return;

    menuFilters.forEach(filter => {
        filter.addEventListener('click', (e) => {
            e.preventDefault();
            const filterValue = filter.getAttribute('data-filter');
            
            // Update active filter
            menuFilters.forEach(f => f.classList.remove('active'));
            filter.classList.add('active');
            
            // Filter menu items
            menuItems.forEach(item => {
                if (filterValue === 'all' || item.classList.contains(filterValue)) {
                    item.style.display = 'flex';
                    setTimeout(() => item.style.opacity = '1', 50);
                } else {
                    item.style.opacity = '0';
                    setTimeout(() => item.style.display = 'none', 300);
                }
            });
        });
    });
};

// Testimonial slider
const initTestimonialSlider = () => {
    if (!testimonialItems.length) return;
    
    let currentIndex = 0;
    const totalTestimonials = testimonialItems.length;
    
    const showTestimonial = (index) => {
        testimonialItems.forEach((item, i) => {
            item.style.display = i === index ? 'block' : 'none';
            item.style.opacity = i === index ? '1' : '0';
        });
    };
    
    // Auto-rotate testimonials
    setInterval(() => {
        currentIndex = (currentIndex + 1) % totalTestimonials;
        showTestimonial(currentIndex);
    }, 8000);
    
    // Initial display
    showTestimonial(0);
};

// Image lightbox for gallery
const initImageLightbox = () => {
    if (!galleryItems.length) return;
    
    // Create lightbox container
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <span class="close-lightbox">&times;</span>
            <img src="" alt="">
            <div class="lightbox-caption"></div>
        </div>
    `;
    document.body.appendChild(lightbox);
    
    const lightboxImg = lightbox.querySelector('img');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    const closeBtn = lightbox.querySelector('.close-lightbox');
    
    // Add click event to gallery items
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const imgSrc = item.querySelector('img').src;
            const caption = item.querySelector('img').alt || '';
            
            lightboxImg.src = imgSrc;
            lightboxCaption.textContent = caption;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Close lightbox
    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    };
    
    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (lightbox.classList.contains('active')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') navigateGallery(1);
            if (e.key === 'ArrowLeft') navigateGallery(-1);
        }
    });
    
    // Navigation between gallery images
    const navigateGallery = (direction) => {
        const currentImg = lightboxImg.src;
        let currentIndex = Array.from(galleryItems).findIndex(item => 
            item.querySelector('img').src === currentImg
        );
        
        currentIndex = (currentIndex + direction + galleryItems.length) % galleryItems.length;
        const nextItem = galleryItems[currentIndex];
        
        lightboxImg.style.opacity = '0';
        setTimeout(() => {
            lightboxImg.src = nextItem.querySelector('img').src;
            lightboxCaption.textContent = nextItem.querySelector('img').alt || '';
            lightboxImg.style.opacity = '1';
        }, 200);
    };
};

// Form validation
const initFormValidation = () => {
    if (!contactForm) return;
    
    const nameInput = contactForm.querySelector('input[type="text"]');
    const emailInput = contactForm.querySelector('input[type="email"]');
    const messageInput = contactForm.querySelector('textarea');
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    
    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };
    
    const validateForm = () => {
        let isValid = true;
        
        // Reset previous errors
        contactForm.querySelectorAll('.error-message').forEach(el => el.remove());
        contactForm.querySelectorAll('input, textarea').forEach(input => {
            input.classList.remove('error');
        });
        
        // Validate name
        if (!nameInput.value.trim()) {
            showError(nameInput, 'Name is required');
            isValid = false;
        }
        
        // Validate email
        if (!emailInput.value.trim()) {
            showError(emailInput, 'Email is required');
            isValid = false;
        } else if (!validateEmail(emailInput.value.trim())) {
            showError(emailInput, 'Please enter a valid email');
            isValid = false;
        }
        
        // Validate message
        if (!messageInput.value.trim()) {
            showError(messageInput, 'Message is required');
            isValid = false;
        }
        
        return isValid;
    };
    
    const showError = (input, message) => {
        input.classList.add('error');
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        input.parentNode.insertBefore(errorElement, input.nextSibling);
    };
    
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            // Disable submit button to prevent multiple submissions
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            
            // Simulate form submission (replace with actual form submission)
            setTimeout(() => {
                // Show success message
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.textContent = 'Thank you for your message! We\'ll get back to you soon.';
                contactForm.reset();
                contactForm.appendChild(successMessage);
                
                // Scroll to success message
                successMessage.scrollIntoView({ behavior: 'smooth' });
                
                // Reset form after delay
                setTimeout(() => {
                    successMessage.remove();
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Send Message';
                }, 5000);
            }, 1500);
        }
    });
};

// Scroll to top button
const initScrollTopButton = () => {
    if (!scrollTopBtn) return;
    
    // Show/hide button on scroll
    const toggleScrollButton = () => {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    };
    
    // Scroll to top when clicked
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };
    
    window.addEventListener('scroll', throttle(toggleScrollButton, 200));
    scrollTopBtn.addEventListener('click', scrollToTop);
    
    // Initial check
    toggleScrollButton();
};

// Active navigation highlighting
const initActiveNav = () => {
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links a');
    
    const highlightNav = () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= sectionTop - 200) {
                current = '#' + section.getAttribute('id');
            }
        });
        
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === current) {
                item.classList.add('active');
            }
        });
    };
    
    window.addEventListener('scroll', throttle(highlightNav, 100));
};

// Preloader
const initPreloader = () => {
    const preloader = document.querySelector('.preloader');
    if (!preloader) return;
    
    preloader.style.transition = 'opacity 0.5s ease';
    
    // Ensure preloader is visible initially
    preloader.style.display = 'flex';
    preloader.style.opacity = '1';
    
    // Hide preloader when everything is loaded
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }, 500); // Minimum display time
    });
};

// Hero Carousel
function initHeroCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    if (!slides.length) return;
    
    let currentSlide = 0;
    
    function showSlide(index) {
        // Hide all slides
        slides.forEach(slide => slide.classList.remove('active'));
        
        // Show current slide
        slides[index].classList.add('active');
        
        // Move to next slide
        currentSlide = (index + 1) % slides.length;
    }
    
    // Start the carousel
    showSlide(0);
    setInterval(() => showSlide(currentSlide), 5000);
}

// Hero Carousel with improved initialization
function initHeroCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    if (!slides.length) return;
    
    let currentSlide = 0;
    const slideCount = slides.length;
    let slideInterval;
    
    // Initialize the first slide
    function initializeCarousel() {
        // Hide all slides first and reset styles
        slides.forEach(slide => {
            slide.classList.remove('active');
            slide.style.opacity = '0';
        });
        
        // Show first slide
        slides[0].classList.add('active');
        slides[0].style.opacity = '1';
        currentSlide = 0;
        
        // Start the carousel after a short delay
        setTimeout(() => {
            startCarousel();
        }, 1000);
    }
    
    // Start the carousel
    function startCarousel() {
        // Clear any existing interval
        if (slideInterval) clearInterval(slideInterval);
        
        // Set new interval
        slideInterval = setInterval(showNextSlide, 5000); // Change slide every 5 seconds
    }
    
    // Change to next slide
    function showNextSlide() {
        // Fade out current slide
        const currentActive = document.querySelector('.carousel-slide.active');
        if (currentActive) {
            currentActive.style.opacity = '0';
            
            // After fade out, change the slide
            setTimeout(() => {
                currentActive.classList.remove('active');
                
                // Move to next slide
                currentSlide = (currentSlide + 1) % slideCount;
                
                // Show new slide
                const nextSlide = slides[currentSlide];
                nextSlide.classList.add('active');
                // Force reflow to ensure the transition works
                void nextSlide.offsetWidth;
                nextSlide.style.opacity = '1';
            }, 500); // Match this with the CSS transition time
        }
    }
    
    // Initialize the carousel when the page loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeCarousel);
    } else {
        initializeCarousel();
    }
}

// Initialize all functionality
document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initIntersectionObserver();
    initMenuFiltering();
    initTestimonialSlider();
    initImageLightbox();
    initFormValidation();
    initScrollTopButton();
    initActiveNav();
    initLazyLoading();
    initWhatsAppButton();
    
    // Initialize hero carousel last to ensure all other functionality is ready
    setTimeout(initHeroCarousel, 500);
});

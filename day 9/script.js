

document.addEventListener('DOMContentLoaded', () => {
    
    
    const navbar = document.getElementById('navbar');
    
    const handleScrollNavbar = () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleScrollNavbar);
    handleScrollNavbar(); 

    
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');
    
    const toggleMenu = () => {
        mobileMenuToggle.classList.toggle('open');
        mobileNav.classList.toggle('open');
        document.body.classList.toggle('no-scroll');
    };
    
    mobileMenuToggle.addEventListener('click', toggleMenu);
    
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileNav.classList.contains('open')) {
                toggleMenu();
            }
        });
    });

    
    const heroBgWrapper = document.querySelector('.hero-bg-wrapper');
    const heroBg = document.querySelector('.hero-bg');
    const heroOverlay = document.querySelector('.hero-overlay');
    const heroTextBlock = document.querySelector('.hero-text-block');
    const heroCardWrapper = document.getElementById('hero-floating-card-wrapper');
    const heroSection = document.getElementById('hero');
    
    if (heroSection) {
        
        setTimeout(() => {
            heroSection.classList.add('loaded');
        }, 80);
        
        const imageStart = window.innerHeight * 0.08;
        const imageEnd = window.innerHeight * 0.4;

        const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
        const updateHeroScroll = (scrolled) => {
            const progress = clamp((scrolled - imageStart) / (imageEnd - imageStart), 0, 1);
            const imageScale = 1 + progress * 0.14;
            const overlayOpacity = progress * 0.4;
            const textOpacity = 1 - progress;
            const textOffset = -16 * progress;
            const cardOpacity = progress;

            if (heroBgWrapper) {
                heroBgWrapper.style.transform = `translate3d(0, ${scrolled * 0.35}px, 0)`;
            }
            if (heroBg) {
                heroBg.style.transform = `scale(${imageScale})`;
                heroBg.style.opacity = progress;
            }
            if (heroOverlay) {
                heroOverlay.style.opacity = overlayOpacity;
            }
            if (heroTextBlock) {
                heroTextBlock.style.opacity = textOpacity;
                heroTextBlock.style.transform = `translate3d(0, ${textOffset}px, 0)`;
            }
            if (heroCardWrapper) {
                heroCardWrapper.style.transform = `translate3d(0, ${-scrolled * 0.22}px, 0)`;
                heroCardWrapper.style.opacity = cardOpacity;
            }
        };

        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            updateHeroScroll(scrolled);
        });

        updateHeroScroll(window.scrollY);
    }

    
    const heroCard = document.getElementById('hero-floating-card');
    
    if (heroSection && heroCard) {
        heroSection.addEventListener('mousemove', (e) => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            
            
            const moveX = (e.clientX - width / 2) / (width / 2);
            const moveY = (e.clientY - height / 2) / (height / 2);
            
            
            const rotateX = -moveY * 6; 
            const rotateY = moveX * 6;
            const translateX = moveX * 12;
            const translateY = moveY * 12;
            
            heroCard.style.transform = `perspective(1000px) translate3d(${translateX}px, ${translateY}px, 15px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        
        heroSection.addEventListener('mouseleave', () => {
            heroCard.style.transform = `perspective(1000px) translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg)`;
            heroCard.style.transition = 'transform 0.85s cubic-bezier(0.16, 1, 0.3, 1)';
        });
        
        heroSection.addEventListener('mouseenter', () => {
            heroCard.style.transition = 'none'; 
        });
    }

    
    const staggerContainers = document.querySelectorAll('.property-grid, .services-grid, .blog-grid, .feature-list');
    
    staggerContainers.forEach(container => {
        const children = container.children;
        Array.from(children).forEach((child, index) => {
            
            child.style.transitionDelay = `${index * 0.12}s`;
        });
    });

    
    const revealElements = document.querySelectorAll('.reveal-fade, .reveal-up, .reveal-left, .reveal-right, .scale-in');
    
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                observer.unobserve(entry.target);
            }
        });
    };
    
    const revealObserver = new IntersectionObserver(revealCallback, {
        root: null,
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px' 
    });
    
    revealElements.forEach(el => revealObserver.observe(el));

    
    const statsSection = document.getElementById('stats');
    const statNumbers = document.querySelectorAll('.stat-number');
    let countersAnimated = false;
    
    const animateCounter = (el) => {
        const target = parseInt(el.getAttribute('data-target'), 10);
        const duration = 2000; 
        let startTime = null;
        
        const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);
            
            
            const ease = percentage * (2 - percentage);
            
            el.textContent = Math.floor(ease * target);
            
            if (progress < duration) {
                window.requestAnimationFrame(step);
            } else {
                el.textContent = target;
            }
        };
        
        window.requestAnimationFrame(step);
    };
    
    if (statsSection && statNumbers.length > 0) {
        const statsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !countersAnimated) {
                    countersAnimated = true;
                    statNumbers.forEach(num => animateCounter(num));
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.25
        });
        
        statsObserver.observe(statsSection);
    }

    
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.getElementById('prev-testimonial');
    const nextBtn = document.getElementById('next-testimonial');
    let activeIndex = 0;
    
    const showSlide = (index) => {
        if (index < 0) {
            index = slides.length - 1;
        } else if (index >= slides.length) {
            index = 0;
        }
        
        
        slides[activeIndex].classList.remove('active');
        indicators[activeIndex].classList.remove('active');
        
        
        slides[index].classList.add('active');
        indicators[index].classList.add('active');
        
        activeIndex = index;
    };
    
    if (slides.length > 0 && indicators.length > 0) {
        prevBtn.addEventListener('click', () => {
            showSlide(activeIndex - 1);
        });
        
        nextBtn.addEventListener('click', () => {
            showSlide(activeIndex + 1);
        });
        
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                showSlide(index);
            });
        });
        
        
        let autoSlideInterval = setInterval(() => {
            showSlide(activeIndex + 1);
        }, 8000);
        
        
        const resetInterval = () => {
            clearInterval(autoSlideInterval);
            autoSlideInterval = setInterval(() => {
                showSlide(activeIndex + 1);
            }, 8000);
        };
        
        prevBtn.addEventListener('click', resetInterval);
        nextBtn.addEventListener('click', resetInterval);
        indicators.forEach(ind => ind.addEventListener('click', resetInterval));
    }
});
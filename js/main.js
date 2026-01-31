// Main Interactivity for Sornam Cool Care

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();

    // Loader
    const loader = document.getElementById('loader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 500);
    });

    // Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Active Section Highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const navLinksMobile = document.querySelectorAll('.nav-link-mobile');

    const highlightActiveSection = () => {
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop - 150) {
                currentSectionId = section.getAttribute('id');
            }
        });

        const updateLinks = (links, activeClass) => {
            links.forEach(link => {
                link.classList.remove(activeClass);
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add(activeClass);
                }
            });
        };

        updateLinks(navLinks, 'active');
        updateLinks(navLinksMobile, 'active');
    };

    window.addEventListener('scroll', highlightActiveSection);

    // Mobile Menu Toggle
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    let isMenuOpen = false;

    const toggleMenu = (open) => {
        isMenuOpen = open;
        if (isMenuOpen) {
            mobileMenu.classList.remove('hidden');
            setTimeout(() => {
                mobileMenu.classList.add('opacity-100', 'translate-y-0');
            }, 10);
            menuToggle.innerHTML = '<i data-lucide="x"></i>';
        } else {
            mobileMenu.classList.remove('opacity-100', 'translate-y-0');
            setTimeout(() => {
                mobileMenu.classList.add('hidden');
            }, 300);
            menuToggle.innerHTML = '<i data-lucide="menu"></i>';
        }
        lucide.createIcons();
    };

    menuToggle.addEventListener('click', () => toggleMenu(!isMenuOpen));

    // Close mobile menu on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => toggleMenu(false));
    });

    // Smooth Scroll for all links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // Reveal on Scroll with stagger
    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // Staggered children animation
                const animatedItems = entry.target.querySelectorAll('.product-card, .group, .reveal');
                animatedItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('active', 'fade-in');
                    }, index * 100);
                });
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // Form Submission
    const serviceForm = document.getElementById('service-form');
    if (serviceForm) {
        serviceForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = serviceForm.querySelector('button');
            const originalContent = submitBtn.innerHTML;

            submitBtn.innerHTML = '<span class="flex items-center gap-2 justify-center"><i data-lucide="loader-2" class="animate-spin w-5 h-5"></i> Processing...</span>';
            lucide.createIcons();
            submitBtn.disabled = true;

            setTimeout(() => {
                alert('Success! Your request has been sent. Our team will contact you within 2 hours.');
                serviceForm.reset();
                submitBtn.innerHTML = originalContent;
                submitBtn.disabled = false;
                lucide.createIcons();
            }, 1800);
        });
    }
});

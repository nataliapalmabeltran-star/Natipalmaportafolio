// Skills Section Functionality
document.addEventListener('DOMContentLoaded', function() {
    // ===== GALLERY MODAL FUNCTIONALITY =====
    let allGalleryImages = [];
    let currentImageIndex = 0;
    const modal = document.getElementById('galleryModal');
    const modalImage = document.getElementById('modalImage');
    const modalCounter = document.getElementById('modalCounter');
    const modalClose = document.getElementById('modalClose');
    const modalPrev = document.getElementById('modalPrev');
    const modalNext = document.getElementById('modalNext');
    const modalOverlay = document.getElementById('modalOverlay');

    function collectGalleryImages() {
        // Collect all images from skill galleries
        const skillGalleryItems = document.querySelectorAll('.skill-gallery .gallery-item img');
        const illustrationItems = document.querySelectorAll('.illustration-item');

        allGalleryImages = [];

        // Add skill gallery images
        skillGalleryItems.forEach(img => {
            allGalleryImages.push({
                src: img.src,
                alt: img.alt,
                type: 'skill'
            });
        });

        // Add illustration images
        illustrationItems.forEach(item => {
            const style = item.getAttribute('style');
            if (style) {
                const match = style.match(/url\('([^']+)'\)/);
                if (match) {
                    allGalleryImages.push({
                        src: match[1],
                        alt: item.textContent || 'Ilustración',
                        type: 'illustration'
                    });
                }
            }
        });
    }

    function openModal(imageIndex) {
        currentImageIndex = imageIndex;
        modal.classList.add('active');
        updateModalImage();
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    function updateModalImage() {
        const image = allGalleryImages[currentImageIndex];
        modalImage.src = image.src;
        modalImage.alt = image.alt;
        modalCounter.textContent = `Imagen ${currentImageIndex + 1} de ${allGalleryImages.length}`;
    }

    function nextImage() {
        currentImageIndex = (currentImageIndex + 1) % allGalleryImages.length;
        updateModalImage();
    }

    function prevImage() {
        currentImageIndex = (currentImageIndex - 1 + allGalleryImages.length) % allGalleryImages.length;
        updateModalImage();
    }

    // Event listeners for modal controls
    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);
    modalNext.addEventListener('click', nextImage);
    modalPrev.addEventListener('click', prevImage);

    // Keyboard controls
    document.addEventListener('keydown', (e) => {
        if (modal.classList.contains('active')) {
            if (e.key === 'Escape') closeModal();
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
        }
    });

    // Add click listeners to all gallery images
    function setupGalleryListeners() {
        const skillGalleryItems = document.querySelectorAll('.skill-gallery .gallery-item img');
        const illustrationItems = document.querySelectorAll('.illustration-item');

        skillGalleryItems.forEach((img, index) => {
            img.addEventListener('click', (e) => {
                collectGalleryImages();
                // Find the index in allGalleryImages
                const imageIndex = allGalleryImages.findIndex(item => item.src === img.src);
                openModal(imageIndex);
                e.stopPropagation();
            });
            img.style.cursor = 'pointer';
        });

        illustrationItems.forEach((item, index) => {
            item.addEventListener('click', (e) => {
                collectGalleryImages();
                const style = item.getAttribute('style');
                const match = style.match(/url\('([^']+)'\)/);
                if (match) {
                    const imageIndex = allGalleryImages.findIndex(img => img.src === match[1]);
                    openModal(imageIndex);
                }
                e.stopPropagation();
            });
            item.style.cursor = 'pointer';
        });
    }

    // Initial setup
    collectGalleryImages();
    setupGalleryListeners();

    const skillItems = document.querySelectorAll('.skill-item');
    const skillDetails = document.querySelector('.skill-details');
    let currentSkill = null;

    skillItems.forEach(item => {
        item.addEventListener('click', function() {
            const skill = this.getAttribute('data-skill');
            
            if (currentSkill === skill) {
                // Close if clicking the same skill
                closeSkillDetail();
                currentSkill = null;
            } else {
                // Open new skill
                openSkillDetail(skill);
                currentSkill = skill;
            }
        });
    });

    function openSkillDetail(skill) {
        // Close all details
        document.querySelectorAll('.skill-detail').forEach(detail => {
            detail.classList.remove('active');
        });

        // Open selected detail
        const detail = document.getElementById(skill);
        if (detail) {
            detail.classList.add('active');
        }

        // Show the details container
        skillDetails.classList.add('open');
    }

    function closeSkillDetail() {
        document.querySelectorAll('.skill-detail').forEach(detail => {
            detail.classList.remove('active');
        });
        skillDetails.classList.remove('open');
    }

    // Brand Section Functionality
    const brandHeaders = document.querySelectorAll('.brand-header');
    let currentBrand = null;

    brandHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const brand = this.getAttribute('data-brand');
            const brandDetail = document.getElementById(brand);

            if (brandDetail && brandDetail.classList.contains('active')) {
                // Close if clicking the same brand
                brandDetail.classList.remove('active');
                currentBrand = null;
            } else {
                // Close all other brands
                document.querySelectorAll('.brand-detail').forEach(detail => {
                    detail.classList.remove('active');
                });

                // Open selected brand
                if (brandDetail) {
                    brandDetail.classList.add('active');
                    currentBrand = brand;
                }
            }
        });
    });

    // Responsive navigation toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            const expanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', String(!expanded));
            navMenu.classList.toggle('open');
        });

        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function () {
                if (window.innerWidth <= 900) {
                    navMenu.classList.remove('open');
                    navToggle.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }

    // Smooth scroll behavior (optional)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer para animaciones de entrada en illustration sections
    const illustrationSections = document.querySelectorAll('.illustration');
    const otherSections = document.querySelectorAll('.skills, .brand');
    const allSections = [...illustrationSections, ...otherSections];
    
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Agregar clase para activar animaciones cuando entra en viewport
                entry.target.classList.add('animate-in');
                
                // Animar el h2 si existe
                const heading = entry.target.querySelector('h2');
                if (heading) {
                    heading.style.animation = 'fadeDownAnim 0.8s ease-out forwards';
                }
            } else {
                // Remover clase cuando sale del viewport para poder re-animar
                entry.target.classList.remove('animate-in');
                
                // Remover animación del h2
                const heading = entry.target.querySelector('h2');
                if (heading) {
                    heading.style.animation = '';
                }
            }
        });
    }, observerOptions);

    allSections.forEach(section => {
        observer.observe(section);
    });
});

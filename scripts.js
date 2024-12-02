// scripts.js
// Add this to your existing JavaScript
function showGallery(type) {
    // Hide all galleries
    document.querySelectorAll('.gallery').forEach(gallery => {
        gallery.classList.remove('active');
    });
    
    // Show selected gallery
    document.getElementById(`${type}-gallery`).classList.add('active');
    
    // Update button states
    document.querySelectorAll('.cake-gallery-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    const activeBtn = document.querySelector(`[onclick="showGallery('${type}')"]`);
    if (activeBtn) activeBtn.classList.add('active');
}

let currentGallery = [];
let currentIndex = 0;

async function loadGalleryImages(type) {
    try {
        const response = await fetch(`gallery/images/${type}`);
        const data = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(data, 'text/html');
        const links = Array.from(doc.querySelectorAll('a'))
            .filter(link => link.href.match(/\.(jpg|jpeg|png)$/i))
            .map(link => `gallery/images/${type}/${link.href.split('/').pop()}`);
        return links;
    } catch (error) {
        console.error('Error loading gallery images:', error);
        return [];
    }
}

async function showGallery(type) {
    currentGallery = await loadGalleryImages(type);
    if (currentGallery.length > 0) {
        currentIndex = 0;
        document.getElementById('gallery-popup').style.display = 'block';
        showImage(currentIndex);
    }
}

function showImage(index) {
    const img = document.getElementById('gallery-image');
    img.src = currentGallery[index];
}

function changeImage(direction) {
    currentIndex += direction;
    if (currentIndex >= currentGallery.length) currentIndex = 0;
    if (currentIndex < 0) currentIndex = currentGallery.length - 1;
    showImage(currentIndex);
}

// Close gallery when clicking the close button or outside the image
document.querySelector('.close-gallery').addEventListener('click', () => {
    document.getElementById('gallery-popup').style.display = 'none';
});

document.getElementById('gallery-popup').addEventListener('click', (e) => {
    if (e.target.id === 'gallery-popup') {
        document.getElementById('gallery-popup').style.display = 'none';
    }
});

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
    if (document.getElementById('gallery-popup').style.display === 'block') {
        if (e.key === 'ArrowLeft') changeImage(-1);
        if (e.key === 'ArrowRight') changeImage(1);
        if (e.key === 'Escape') document.getElementById('gallery-popup').style.display = 'none';
    }
});

// Initialize the gallery when the page loads
document.addEventListener('DOMContentLoaded', () => {
    showGallery('standard');
});
document.addEventListener('DOMContentLoaded', () => {
    // 1. Responsive Navigation Menu Toggle
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('open');
        hamburger.classList.toggle('active');
    });

    // Close the menu when a link is clicked (for mobile)
    const navItems = navLinks.querySelectorAll('a');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (navLinks.classList.contains('open')) {
                navLinks.classList.remove('open');
                hamburger.classList.remove('active');
            }
        });
    });

    // 2. Smooth Scrolling for Navigation Links
    const smoothScroll = (target, duration) => {
        const targetElement = document.querySelector(target);
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - 60; // Adjust for fixed header
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        const animation = currentTime => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        };

        // Ease function (easeInOutCubic)
        const ease = (t, b, c, d) => {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t * t + b;
            t -= 2;
            return c / 2 * (t * t * t + 2) + b;
        };

        requestAnimationFrame(animation);
    };

    const navLinkElements = document.querySelectorAll('nav ul li a');
    navLinkElements.forEach(link => {
        link.addEventListener('click', function(e) {
            const target = this.getAttribute('href');
            if (target.startsWith('#')) {
                e.preventDefault();
                smoothScroll(target, 1000);
            }
        });
    });

   
    // 4. Accordion Functionality for Guides and Tutorials
    const accordionButtons = document.querySelectorAll('.accordion-button');

    accordionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const accordionContent = button.nextElementSibling;
        
            // Toggle active state
            button.classList.toggle('active');
        
            // Toggle content visibility
            if (button.classList.contains('active')) {
                accordionContent.style.maxHeight = accordionContent.scrollHeight + 'px';
            } else {
                accordionContent.style.maxHeight = 0;
            }
        });
            // Optional: Close other accordion items
            // Close other accordions if you want only one open at a time
            /*
            accordionButtons.forEach(otherButton => {
                if (otherButton !== button && otherButton.classList.contains('active')) {
                    otherButton.classList.remove('active');
                    otherButton.nextElementSibling.style.maxHeight = 0;
                }
            });
            */
        });
 

    // 5. Contact Form Validation
    const contactForm = document.getElementById('contact-form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const messageError = document.getElementById('message-error');
    const formSuccess = document.getElementById('form-success');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Reset errors
        nameError.textContent = '';
        emailError.textContent = '';
        messageError.textContent = '';
        nameError.style.display = 'none';
        emailError.style.display = 'none';
        messageError.style.display = 'none';
        formSuccess.textContent = '';

        let isValid = true;

        // Validate Name
        if (nameInput.value.trim() === '') {
            nameError.textContent = 'Please enter your name.';
            nameError.style.display = 'block';
            isValid = false;
        }

        // Validate Email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailInput.value.trim() === '') {
            emailError.textContent = 'Please enter your email.';
            emailError.style.display = 'block';
            isValid = false;
        } else if (!emailRegex.test(emailInput.value.trim())) {
            emailError.textContent = 'Please enter a valid email.';
            emailError.style.display = 'block';
            isValid = false;
        }

        // Validate Message
        if (messageInput.value.trim() === '') {
            messageError.textContent = 'Please enter your message.';
            messageError.style.display = 'block';
            isValid = false;
        }

        if (isValid) {
            // Simulate form submission (replace with actual submission logic)
            formSuccess.textContent = 'Thank you for contacting us! We will get back to you shortly.';
            contactForm.reset();
        }
    });

    // 6. Dark Mode Toggle
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

    // Check for saved user preference, if any, on load of the website
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
    } else if (localStorage.getItem("theme") === "light") {
        document.body.classList.remove("dark-mode");
    } else if (prefersDarkScheme.matches) {
        document.body.classList.add("dark-mode");
    }

    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');

        // Save user preference in localStorage
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
            darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            localStorage.setItem('theme', 'light');
            darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
    });

    // Initialize Dark Mode Toggle Icon
    if (document.body.classList.contains('dark-mode')) {
        darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
});

// Dark mode toggle functionality
document.getElementById('dark-mode-toggle').addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
});

// Hamburger menu functionality
document.getElementById('hamburger').addEventListener('click', function() {
    document.getElementById('nav-links').classList.toggle('active');
});

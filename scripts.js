// scripts.js
// Add this to your existing JavaScript

let currentImages = [];
let currentIndex = 0;

function createCatalogView(type) {
    const catalogContainer = document.getElementById(`${type}-gallery`);
    
    // Check if container exists
    if (!catalogContainer) {
        console.error(`Gallery container for ${type} not found`);
        return;
    }
    
    // Clear existing content
    catalogContainer.innerHTML = '';
    
    // Create grid container
    const gridContainer = document.createElement('div');
    gridContainer.className = 'catalog-grid';
    
    // Fetch and create catalog items
    fetch(`gallery/images/${type}/`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const images = Array.from(doc.querySelectorAll('a'))
                .filter(a => a.href.match(/\.(jpg|jpeg|png|gif)$/i))
                .map(a => ({
                    src: a.href.split('/').pop(),
                    title: a.href.split('/').pop().replace(/\.[^/.]+$/, '').replace(/_/g, ' ')
                }));
            
            if (images.length === 0) {
                gridContainer.innerHTML = '<p>No images found in this gallery.</p>';
                return;
            }
            
            images.forEach((image, index) => {
                const catalogItem = document.createElement('div');
                catalogItem.className = 'catalog-item';
                
                catalogItem.innerHTML = `
                    <div class="catalog-image-container">
                        <img src="gallery/images/${type}/${image.src}" 
                             alt="${image.title}"
                             onclick="showGallery('${type}', ${index})"
                             onerror="handleImageError(this)">
                    </div>
                    <div class="catalog-info">
                        <h3>${image.title}</h3>
                    </div>
                `;
                
                gridContainer.appendChild(catalogItem);
            });
            
            catalogContainer.appendChild(gridContainer);
            
            // Store the images for gallery view
            currentImages = images.map(img => ({
                src: `gallery/images/${type}/${img.src}`,
                title: img.title
            }));
        })
        .catch(error => {
            console.error('Error loading images:', error);
            gridContainer.innerHTML = `
                <div class="error-message">
                    <p>Error loading images. Please try again later.</p>
                    <p class="error-details">${error.message}</p>
                </div>
            `;
            catalogContainer.appendChild(gridContainer);
        });
    
    // Show the appropriate gallery
    document.querySelectorAll('.gallery').forEach(g => g.classList.remove('active'));
    catalogContainer.classList.add('active');
}

function showGallery(type, startIndex = 0) {
    currentIndex = startIndex;
    updateGalleryImage();
    
    const popup = document.getElementById('gallery-popup');
    popup.style.display = 'block';
}

function updateGalleryImage() {
    const galleryImage = document.getElementById('gallery-image');
    const currentImage = currentImages[currentIndex];
    galleryImage.src = currentImage.src;
    galleryImage.alt = currentImage.title;
    
    // Update title if it exists
    const titleElement = document.getElementById('gallery-title');
    if (titleElement) {
        titleElement.textContent = currentImage.title;
    }
}

function changeImage(direction) {
    currentIndex += direction;
    
    // Loop around if we reach the end or beginning
    if (currentIndex >= currentImages.length) {
        currentIndex = 0;
    } else if (currentIndex < 0) {
        currentIndex = currentImages.length - 1;
    }
    
    updateGalleryImage();
}

// Add image loading error handling
function handleImageError(img) {
    img.onerror = null; // Prevent infinite loop
    img.src = 'images/placeholder.jpg'; // Path to your placeholder image
    console.log(`Failed to load image: ${img.src}`);
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Add click handlers for the gallery type buttons
    document.querySelectorAll('.cake-gallery-btn').forEach(btn => {
        btn.onclick = function() {
            // Try to get type from data attribute first, then fallback to onclick attribute
            const type = this.getAttribute('data-gallery-type') || 
                        this.getAttribute('onclick')?.match(/showGallery\('(\w+)'\)/)?.[1];
            
            if (!type) {
                console.error('Gallery type not specified on button');
                return;
            }
            createCatalogView(type);
        };
    });
    
    const popup = document.getElementById('gallery-popup');
    const closeBtn = document.querySelector('.close-gallery');
    const galleryImage = document.getElementById('gallery-image');
    
    // Add error handling for images
    galleryImage.onerror = function() {
        handleImageError(this);
    };
    
    closeBtn.onclick = function() {
        popup.style.display = 'none';
    }
    
    // Close if clicking outside the image
    popup.onclick = function(e) {
        if (e.target === popup) {
            popup.style.display = 'none';
        }
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (popup.style.display === 'block') {
            if (e.key === 'ArrowLeft') {
                changeImage(-1);
            } else if (e.key === 'ArrowRight') {
                changeImage(1);
            } else if (e.key === 'Escape') {
                popup.style.display = 'none';
            }
        }
    });

    // Add touch support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    popup.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    popup.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const swipeLength = touchEndX - touchStartX;
        
        if (Math.abs(swipeLength) > swipeThreshold) {
            if (swipeLength > 0) {
                changeImage(-1); // Swipe right, go to previous
            } else {
                changeImage(1); // Swipe left, go to next
            }
        }
    }
});

// Add this CSS to your stylesheet
const styles = `
    .catalog-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 20px;
        padding: 20px;
    }

    .catalog-item {
        background: white;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        transition: transform 0.3s ease;
    }

    .catalog-item:hover {
        transform: translateY(-5px);
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    }

    .catalog-image-container {
        position: relative;
        padding-top: 75%; /* 4:3 Aspect Ratio */
        overflow: hidden;
    }

    .catalog-image-container img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        cursor: pointer;
    }

    .catalog-info {
        padding: 15px;
    }

    .catalog-info h3 {
        margin: 0 0 10px 0;
        font-size: 1.2rem;
        color: #333;
    }

    .catalog-info p {
        margin: 0;
        font-size: 0.9rem;
        color: #666;
    }

    /* Dark mode support */
    @media (prefers-color-scheme: dark) {
        .catalog-item {
            background: #2d2d2d;
        }

        .catalog-info h3 {
            color: #fff;
        }

        .catalog-info p {
            color: #ccc;
        }
    }
`;

// Add the styles to the document
const styleSheet = document.createElement("style");
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

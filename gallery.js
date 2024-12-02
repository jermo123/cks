document.addEventListener('DOMContentLoaded', function() {
    // Determine which gallery to load based on current page
    const isStandardGallery = window.location.pathname.includes('standard-cakes');
    
    // Function to create gallery from a list of image paths
    function createGallery(imagePaths) {
        const gallery = document.getElementById('cakeGallery');
        
        imagePaths.forEach(imagePath => {
            // Extract filename without extension
            const filename = imagePath.split('/').pop().split('.')[0];
            // Create title by replacing hyphens with spaces and capitalizing
            const title = filename.replace(/-/g, ' ')
                                .split(' ')
                                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                .join(' ');
            
            const card = document.createElement('div');
            card.className = 'cake-card';
            
            card.innerHTML = `
                <div class="cake-image">
                    <img src="${imagePath}" alt="${title}" loading="lazy">
                </div>
                <div class="cake-info">
                    <h3>${title}</h3>
                </div>
            `;
            
            // Add click event for larger view
            card.addEventListener('click', () => {
                openLightbox(imagePath, title);
            });
            
            gallery.appendChild(card);
        });
    }

    // Lightbox functionality
    function openLightbox(imageSrc, title) {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <span class="close-lightbox">&times;</span>
                <img src="${imageSrc}" alt="${title}">
                <h3>${title}</h3>
            </div>
        `;
        
        // Close lightbox when clicking outside or on close button
        lightbox.addEventListener('click', (e) => {
            if (e.target.className === 'lightbox' || e.target.className === 'close-lightbox') {
                document.body.removeChild(lightbox);
            }
        });
        
        document.body.appendChild(lightbox);
    }

    // Load images based on gallery type
    if (isStandardGallery) {
        // Add your standard cake image paths here
        const standardCakes = [
            'images/standard-cakes/birthday-cake.jpg',
            'images/standard-cakes/chocolate-cake.jpg',
            'images/standard-cakes/vanilla-cake.jpg',
            // Add more paths as needed
        ];
        createGallery(standardCakes);
    } else {
        // Add your custom cake image paths here
        const customCakes = [
            'images/custom-cakes/wedding-cake.jpg',
            'images/custom-cakes/themed-cake.jpg',
            'images/custom-cakes/special-occasion.jpg',
            // Add more paths as needed
        ];
        createGallery(customCakes);
    }
}); 
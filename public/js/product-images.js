// Helper function to get product image or placeholder
function getProductImage(product) {
    if (product.image_url && product.image_url !== '/images/products/placeholder.jpg') {
        return `<img src="${product.image_url}" alt="${product.name}" class="w-full h-full object-cover" 
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <div class="product-image-placeholder ${getProductImageClass(product.category_name)}" style="display: none;">
                    ${getProductIcon(product.category_name)}
                </div>`;
    } else {
        return `<div class="product-image-placeholder ${getProductImageClass(product.category_name)}">
                    ${getProductIcon(product.category_name)}
                </div>`;
    }
}

function getProductImageClass(categoryName) {
    switch (categoryName?.toLowerCase()) {
        case 'sports cars':
            return 'product-image-sports-car';
        case 'helicopters':
            return 'product-image-helicopter';
        case 'fighter jets':
            return 'product-image-fighter-jet';
        case 'speed boats':
            return 'product-image-speed-boat';
        default:
            return '';
    }
}

function getProductIcon(categoryName) {
    switch (categoryName?.toLowerCase()) {
        case 'sports cars':
            return '<i class="fas fa-car"></i>';
        case 'helicopters':
            return '<i class="fas fa-helicopter"></i>';
        case 'fighter jets':
            return '<i class="fas fa-fighter-jet"></i>';
        case 'speed boats':
            return '<i class="fas fa-ship"></i>';
        default:
            return '<i class="fas fa-image"></i>';
    }
}

// Make functions globally available
window.getProductImage = getProductImage;
window.getProductImageClass = getProductImageClass;
window.getProductIcon = getProductIcon;
const fs = require('fs');
const path = require('path');

// Create images directory if it doesn't exist
const imagesDir = path.join(__dirname, 'public', 'images', 'products');
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
}

// SVG templates for different product categories
const svgTemplates = {
    'sports-car': `
        <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="carGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#ff6b6b;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#ee5a24;stop-opacity:1" />
                </linearGradient>
            </defs>
            <rect width="400" height="300" fill="url(#carGrad)"/>
            <text x="200" y="120" font-family="Arial, sans-serif" font-size="48" fill="white" text-anchor="middle">🏎️</text>
            <text x="200" y="180" font-family="Arial, sans-serif" font-size="24" fill="white" text-anchor="middle">RC Sports Car</text>
            <text x="200" y="220" font-family="Arial, sans-serif" font-size="16" fill="rgba(255,255,255,0.8)" text-anchor="middle">High-Performance Racing</text>
        </svg>
    `,
    'helicopter': `
        <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="heliGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#4834d4;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#686de0;stop-opacity:1" />
                </linearGradient>
            </defs>
            <rect width="400" height="300" fill="url(#heliGrad)"/>
            <text x="200" y="120" font-family="Arial, sans-serif" font-size="48" fill="white" text-anchor="middle">🚁</text>
            <text x="200" y="180" font-family="Arial, sans-serif" font-size="24" fill="white" text-anchor="middle">RC Helicopter</text>
            <text x="200" y="220" font-family="Arial, sans-serif" font-size="16" fill="rgba(255,255,255,0.8)" text-anchor="middle">Aerial Adventures</text>
        </svg>
    `,
    'fighter-jet': `
        <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="jetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#2c2c54;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#40407a;stop-opacity:1" />
                </linearGradient>
            </defs>
            <rect width="400" height="300" fill="url(#jetGrad)"/>
            <text x="200" y="120" font-family="Arial, sans-serif" font-size="48" fill="white" text-anchor="middle">✈️</text>
            <text x="200" y="180" font-family="Arial, sans-serif" font-size="24" fill="white" text-anchor="middle">RC Fighter Jet</text>
            <text x="200" y="220" font-family="Arial, sans-serif" font-size="16" fill="rgba(255,255,255,0.8)" text-anchor="middle">Military Aviation</text>
        </svg>
    `,
    'speed-boat': `
        <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="boatGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#00d2d3;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#54a0ff;stop-opacity:1" />
                </linearGradient>
            </defs>
            <rect width="400" height="300" fill="url(#boatGrad)"/>
            <text x="200" y="120" font-family="Arial, sans-serif" font-size="48" fill="white" text-anchor="middle">🚤</text>
            <text x="200" y="180" font-family="Arial, sans-serif" font-size="24" fill="white" text-anchor="middle">RC Speed Boat</text>
            <text x="200" y="220" font-family="Arial, sans-serif" font-size="16" fill="rgba(255,255,255,0.8)" text-anchor="middle">Water Racing</text>
        </svg>
    `
};

// Generate SVG files
Object.entries(svgTemplates).forEach(([category, svgContent]) => {
    const filename = `${category}-placeholder.svg`;
    const filepath = path.join(imagesDir, filename);
    fs.writeFileSync(filepath, svgContent.trim());
    console.log(`✅ Created ${filename}`);
});

console.log('🎨 Product placeholder images created successfully!');
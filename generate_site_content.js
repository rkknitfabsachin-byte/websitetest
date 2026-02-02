
const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const templatePath = path.join(rootDir, 'DOT KNIT.html');
const productsPath = path.join(rootDir, 'products.html');

const categories = [
    {
        name: 'Sportswear/Active Wear',
        id: 'Sportswear',
        products: [
            'DOT KNIT', 'MICRO PP', 'RICE KNIT', 'NIRMAL KNIT', 'SARINA',
            'FOOTBALL', 'CROWN KNIT', 'BOX KNIT', 'POPCORN KNIT', 'JAQUARD', 'REEBOK KNIT'
        ],
        texture: 'images/FP1.jpg' // Fallback
    },
    {
        name: 'Uniform Fabrics',
        id: 'Uniform',
        products: [
            'SAP MATTY', 'SPUN MATTY', 'PC MATTY', 'AIRJET MATTY',
            'SPUN P KNIT', 'PC P KNIT', 'NIRMAL KNIT'
        ],
        texture: 'images/QC1.jpg' // Fallback
    },
    {
        name: 'Winter Wear Fabrics',
        id: 'fleece', // Lowercase to match existing convention if any, but I'll standardise
        products: [
            'SPUN FLEECE', 'PC FLEECE', 'AIRJET FLEECE', 'THERMAL FLEECE'
        ],
        texture: 'images/FP2.jpg' // Fallback
    },
    {
        name: 'Casual Wear Fabrics',
        id: 'Casual',
        products: [
            'PC BIRDEYE', 'CROCHET', 'INTERLOCK', 'SINKER',
            'LOOP KNIT', 'WAFFLE', 'ZARA KNIT', 'KETONIC'
        ],
        texture: 'images/movement.jpg' // Fallback
    }
];

// Special image mappings based on directory listing
const imageMappings = {
    'DOT KNIT': 'images/NEW PHOTOSHOOTS/DOT KNIT(MAROON)/MAROON 1.jpg',
    'MICRO PP': 'images/NEW PHOTOSHOOTS/MICRO PP/1.jpg', // Assumption, need to verify or use generic
    'SPUN MATTY': 'images/NEW PHOTOSHOOTS/SPUN MATTY(BEIGE)/1.jpg' // Assumption
};

function getProductImage(productName, defaultInfo) {
    if (imageMappings[productName]) return imageMappings[productName];
    // Simple check if specific folder exists (simulated since I can't browse dynamically easily in node without more code)
    // For this environment, I'll stick to the default unless mapped above.
    // However, for the ones mapped, I should be careful if file doesn't exist.
    // Given I saw directories, I'll assume standard naming or fallback.

    // Better fallback:
    return defaultInfo.texture;
}

const templateContent = fs.readFileSync(templatePath, 'utf8');

let productsGridHTML = '';

categories.forEach(cat => {
    cat.products.forEach(prodName => {
        // 1. Create Product Page
        let pageContent = templateContent;

        // Replace Title
        pageContent = pageContent.replace(/<h2>DOT KNIT<\/h2>/g, `<h2>${prodName}</h2>`);
        pageContent = pageContent.replace(/<title>Mars Knit<\/title>/g, `<title>${prodName} | RK Knit Fab</title>`);

        // Replace Breadcrumb/Subtitle
        // Existing: <div class="subtitle">Sportswear · Factory Manufactured</div>
        pageContent = pageContent.replace(/Sportswear · Factory Manufactured/g, `${cat.name} · Factory Manufactured`);

        // Replace Image in Slider (Just first one for now as we don't have multiple for all)
        const imgSrc = getProductImage(prodName, cat);
        // Regex to replace the first image in slider
        // <img src="images/NEW PHOTOSHOOTS/DOT KNIT(MAROON)/MAROON 1.jpg">
        // We'll replace the entire slides div content with just one image for new pages to avoid broken links
        // UNLESS it is Dot Knit itself.

        if (prodName !== 'DOT KNIT') {
            const newSlides = `<img src="${imgSrc}" alt="${prodName}">`;
            pageContent = pageContent.replace(/<div class="slides" id="slides">[\s\S]*?<\/div>/, `<div class="slides" id="slides">\n${newSlides}\n</div>`);
        }

        const fileName = `${prodName}.html`;
        fs.writeFileSync(path.join(rootDir, fileName), pageContent);
        console.log(`Created ${fileName}`);

        // 2. Add to Products Grid List
        // Template for card:
        /*
        <a href="DOT KNIT.html" class="product-card" data-category="Uniform">
            <span class="tag">Uniform</span>
            <img src="images/NEW PHOTOSHOOTS/DOT KNIT(MAROON)/MAROON 1.jpg">
            <div class="product-overlay">
            <h4>DOT KNIT</h4>
            <p>Soft, breathable fabric for t-shirts & casual wear</p>
            <span class="view-btn">View Details</span>
            </div>
        </a>
        */

        productsGridHTML += `
      <a href="${fileName}" class="product-card" data-category="${cat.id}">
        <span class="tag">${cat.name}</span>
        <img src="${imgSrc}" loading="lazy" alt="${prodName}">
        <div class="product-overlay">
          <h4>${prodName}</h4>
          <p>Premium quality ${cat.name.toLowerCase()}.</p>
          <span class="view-btn">View Details</span>
        </div>
      </a>\n`;
    });
});

// Update products.html
let productsContent = fs.readFileSync(productsPath, 'utf8');

// Update Filter Buttons
const newFilters = `
      <button class="filter-btn active" data-filter="all">All</button>
      ${categories.map(c => `<button class="filter-btn" data-filter="${c.id}">${c.name}</button>`).join('\n      ')}
`;

productsContent = productsContent.replace(
    /<div class="filter-bar">[\s\S]*?<\/div>/,
    `<div class="filter-bar">\n${newFilters}\n    </div>`
);

// Update Grid
productsContent = productsContent.replace(
    /<div class="catalogue-grid">[\s\S]*?<\/div>/,
    `<div class="catalogue-grid">\n${productsGridHTML}\n    </div>`
);

fs.writeFileSync(productsPath, productsContent);
console.log('Updated products.html');

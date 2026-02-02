
const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const productsPath = path.join(rootDir, 'products.html');
let content = fs.readFileSync(productsPath, 'utf8');

// The file is currently broken with partial replacements.
// I can locate markers.
// Start of grid: <div class="catalogue-grid">
// End of section (which contains the grid): </section>

// I will rebuild the file content.
// 1. Get everything before <div class="catalogue-grid">
const startMarker = '<div class="catalogue-grid">';
const endMarker = '</section>';

const parts = content.split(startMarker);
const header = parts[0];

// 2. Get the footer part. Since the file is messy, I'll search for the last occurrence of </section> 
// or simply search for "<!-- FOOTER -->" and the closing section tag before it.
// The file structure was:
// <section> ... <div grid> ... </div> </section>
// <!-- FOOTER -->
const footerMarker = '<!-- FOOTER -->';
const footerParts = content.split(footerMarker);
const footer = footerMarker + footerParts[1];

// verify if there is a closing section tag before footer
// The messed up content has tags like </a> ... </div> ... </section> ...
// I will regenerate the grid HTML again to be sure.

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
        texture: 'images/QC1.jpg'
    },
    {
        name: 'Winter Wear Fabrics',
        id: 'fleece',
        products: [
            'SPUN FLEECE', 'PC FLEECE', 'AIRJET FLEECE', 'THERMAL FLEECE'
        ],
        texture: 'images/FP2.jpg'
    },
    {
        name: 'Casual Wear Fabrics',
        id: 'Casual',
        products: [
            'PC BIRDEYE', 'CROCHET', 'INTERLOCK', 'SINKER',
            'LOOP KNIT', 'WAFFLE', 'ZARA KNIT', 'KETONIC'
        ],
        texture: 'images/movement.jpg'
    }
];

const imageMappings = {
    'DOT KNIT': 'images/NEW PHOTOSHOOTS/DOT KNIT(MAROON)/MAROON 1.jpg',
    'MICRO PP': 'images/NEW PHOTOSHOOTS/MICRO PP/1.jpg',
    'SPUN MATTY': 'images/NEW PHOTOSHOOTS/SPUN MATTY(BEIGE)/1.jpg'
};

function getProductImage(productName, defaultInfo) {
    if (imageMappings[productName]) return imageMappings[productName];
    return defaultInfo.texture;
}

let productsGridHTML = '';
categories.forEach(cat => {
    cat.products.forEach(prodName => {
        const fileName = `${prodName}.html`;
        const imgSrc = getProductImage(prodName, cat);

        productsGridHTML += `
      <a href="${fileName}" class="product-card" data-category="${cat.id}">
        <span class="tag">${cat.name}</span>
        <img src="${imgSrc}" loading="lazy" alt="${prodName}" onerror="this.src='https://placehold.co/600x400?text=${prodName}'">
        <div class="product-overlay">
          <h4>${prodName}</h4>
          <p>Premium quality ${cat.name.toLowerCase()}.</p>
          <span class="view-btn">View Details</span>
        </div>
      </a>\n`;
    });
});

const newContent = `${header}
    <div class="catalogue-grid">
${productsGridHTML}
    </div>
  </section>

  ${footer}
`;

fs.writeFileSync(productsPath, newContent);
console.log('Fixed products.html');

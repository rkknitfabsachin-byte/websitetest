const fs = require('fs');
const path = require('path');
const dir = __dirname;
const waLink = 'https://wa.me/917837873646';

fs.readdir(dir, (err, files) => {
    if (err) throw err;
    files.forEach(file => {
        if (path.extname(file) === '.html') {
            const filePath = path.join(dir, file);
            let content = fs.readFileSync(filePath, 'utf8');
            let changed = false;

            // Logic to add "Calculators" link to Navbar
            // We look for <li><a href="products.html">Products</a></li> 
            // And append <li><a href="gsm-calculator.html">Calculators</a></li> after it.

            const productsLinkRegex = /(<li><a href="products\.html">Products<\/a><\/li>)/i;

            if (productsLinkRegex.test(content)) {
                // Check if Calculators link is already there
                if (!content.includes('gsm-calculator.html')) {
                    content = content.replace(productsLinkRegex, '$1\n      <li><a href="gsm-calculator.html">Calculators</a></li>');
                    changed = true;
                }
            }

            if (changed) {
                fs.writeFileSync(filePath, content);
                console.log(`Updated ${file}`);
            }
        }
    });
});

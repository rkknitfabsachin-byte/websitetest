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

            // Fix 1: Add Name to Logo (if missing inside .nav-logo)
            // Look for the image tag followed by closing anchor
            const logoRegex = /(<a href="index\.html" class="nav-logo">\s*<img [^>]+>)(\s*)(<\/a>)/i;

            if (logoRegex.test(content)) {
                // Check if h1 is already inside
                const match = content.match(/class="nav-logo"([\s\S]*?)<\/a>/);
                if (match && !match[1].includes('<h1>')) {
                    content = content.replace(logoRegex, '$1\n      <h1>RK Knit Fab</h1>$3');
                    changed = true;
                }
            }

            // Fix 2: WhatsApp Link
            // Replace href="" with actual link
            const waRegex = /<a href="" class="whatsapp">/g;
            if (waRegex.test(content)) {
                content = content.replace(waRegex, `<a href="${waLink}" class="whatsapp">`);
                changed = true;
            }

            const waRegex2 = /<a href="#" class="whatsapp">/g;
            if (waRegex2.test(content)) {
                content = content.replace(waRegex2, `<a href="${waLink}" class="whatsapp">`);
                changed = true;
            }

            if (changed) {
                fs.writeFileSync(filePath, content);
                console.log(`Updated ${file}`);
            }
        }
    });
});

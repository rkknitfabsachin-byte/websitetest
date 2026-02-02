const fs = require('fs');
const path = require('path');
const dir = __dirname;

const fabrics = [
    "AIRJET FLEECE", "AIRJET MATTY", "BOX KNIT", "CROCHET", "CROWN KNIT",
    "DOT KNIT", "FOOTBALL", "INTERLOCK", "JAQUARD", "KETONIC", "LOOP KNIT",
    "MICRO PP", "NIRMAL KNIT", "PC BIRDEYE", "PC FLEECE", "PC MATTY",
    "PC P KNIT", "POPCORN KNIT", "REEBOK KNIT", "RICE KNIT", "SAP MATTY",
    "SARINA", "SINKER", "SPUN FLEECE", "SPUN MATTY", "SPUN P KNIT",
    "THERMAL FLEECE", "WAFFLE", "ZARA KNIT"
];

function getRecommendations(excludeName) {
    // Filter out the current file name to avoid self-linking
    const filtered = fabrics.filter(f => f !== excludeName && f + '.html' !== excludeName);
    // Shuffle
    const shuffled = filtered.sort(() => 0.5 - Math.random());
    // Pick 2
    return shuffled.slice(0, 2);
}

fs.readdir(dir, (err, files) => {
    if (err) throw err;
    files.forEach(file => {
        // Process only HTML files
        if (path.extname(file) !== '.html') return;
        // Skip main pages
        if (['index.html', 'about.html', 'contact.html', 'products.html', 'gsm-calculator.html'].includes(file)) return;

        const filePath = path.join(dir, file);
        let content = fs.readFileSync(filePath, 'utf8');

        // Regex to find the More Fabrics section and its grid content
        const regex = /(<h3>More Fabrics<\/h3>\s*<div class="grid">)([\s\S]*?)(<\/div>)/i;

        if (regex.test(content)) {
            const currentName = path.parse(file).name;
            const recs = getRecommendations(currentName);

            let newLinks = '\n';
            recs.forEach(f => {
                newLinks += `      <a href="${f}.html" class="card">${f}</a>\n`;
            });
            newLinks += '    ';

            const newContent = content.replace(regex, `$1${newLinks}$3`);
            fs.writeFileSync(filePath, newContent);
            console.log(`Updated ${file}: Linked ${recs.join(', ')}`);
        }
    });
});

const fs = require('fs');
const path = require('path');

const dir = __dirname;
const logoHTML = `<a href="index.html" class="nav-logo">
      <img src="images/RKKNITFABLOGO.png" alt="RK Knit Fab">
    </a>`;

fs.readdir(dir, (err, files) => {
    if (err) {
        console.error("Could not list directory.", err);
        process.exit(1);
    }

    files.forEach(file => {
        if (path.extname(file) === '.html') {
            const filePath = path.join(dir, file);
            let content = fs.readFileSync(filePath, 'utf8');

            // Regex to match the h1 tag, handling potential whitespace
            // Original: <h1>RK Knit Fab</h1>
            // We look for <h1>RK Knit Fab</h1> specifically.
            if (content.includes('<h1>RK Knit Fab</h1>')) {
                const newContent = content.replace('<h1>RK Knit Fab</h1>', logoHTML);
                fs.writeFileSync(filePath, newContent, 'utf8');
                console.log(`Updated ${file}`);
            } else {
                console.log(`Skipped ${file} (Pattern not found)`);
            }
        }
    });
});

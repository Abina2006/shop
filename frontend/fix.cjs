const fs = require('fs');
let code = fs.readFileSync('src/utils/productImages.js', 'utf8');

code = code.replace(/name\.includes\('([^']+)'\)/g, "(new RegExp('\\\\b$1\\\\b', 'i')).test(name)");
code = code.replace(/category\.includes\('([^']+)'\)/g, "(new RegExp('\\\\b$1\\\\b', 'i')).test(category)");

code = code.replace(/\(new RegExp\('\\\\belectronics\\\\b', 'i'\)\)\.test\(category\)/g, 
  "(new RegExp('\\\\belectronics\\\\b', 'i')).test(category) || (new RegExp('\\\\baudio\\\\b', 'i')).test(category) || (new RegExp('\\\\bearbuds\\\\b', 'i')).test(name)");

fs.writeFileSync('src/utils/productImages.js', code);
console.log('Fixed productImages.js');

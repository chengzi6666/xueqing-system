const fs = require('fs');
const path = require('path');

const mathData = JSON.parse(fs.readFileSync(path.join(__dirname, 'math_outline.json'), 'utf8'));
const chineseData = JSON.parse(fs.readFileSync(path.join(__dirname, 'chinese_outline.json'), 'utf8'));

const combined = {
  math: mathData,
  chinese: chineseData
};

fs.writeFileSync(path.join(__dirname, 'server', 'data', 'outline.json'), JSON.stringify(combined, null, 2));
console.log('数据合并完成！');
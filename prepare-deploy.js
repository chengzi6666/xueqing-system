const fs = require('fs');
const path = require('path');

// 源图片目录
const sourceImagesDir = path.join(__dirname, 'images');
// 目标图片目录（确保在部署时能被访问到）
const targetImagesDir = path.join(__dirname, 'server', 'public', 'images');

console.log('========================================');
console.log('准备部署 - 图片资源处理');
console.log('========================================');
console.log(`源图片目录: ${sourceImagesDir}`);
console.log(`目标图片目录: ${targetImagesDir}`);

// 确保目标目录存在
if (!fs.existsSync(targetImagesDir)) {
    console.log(`创建目标目录: ${targetImagesDir}`);
    fs.mkdirSync(targetImagesDir, { recursive: true });
}

// 检查源目录是否存在
if (!fs.existsSync(sourceImagesDir)) {
    console.log('错误：源图片目录不存在！');
    process.exit(1);
}

// 复制图片文件
const imageFiles = fs.readdirSync(sourceImagesDir);
let copiedCount = 0;

imageFiles.forEach(file => {
    const sourcePath = path.join(sourceImagesDir, file);
    const targetPath = path.join(targetImagesDir, file);
    
    // 只处理图片文件
    if (file.match(/\.(png|jpg|jpeg|gif|webp)$/i)) {
        try {
            fs.copyFileSync(sourcePath, targetPath);
            copiedCount++;
            console.log(`已复制: ${file}`);
        } catch (err) {
            console.error(`复制失败: ${file} - ${err.message}`);
        }
    }
});

console.log(`========================================`);
console.log(`图片处理完成！共复制 ${copiedCount} 张图片`);
console.log(`========================================`);
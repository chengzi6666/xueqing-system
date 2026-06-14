const fs = require('fs');
const path = require('path');

const imagesDir = './images';
const envId = 'xueqing-system-d2g4d3p65a7bd1e18';

async function main() {
  const files = fs.readdirSync(imagesDir).filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.png', '.jpg', '.jpeg'].includes(ext);
  });

  console.log(`找到 ${files.length} 个图片文件`);

  for (const file of files) {
    const localPath = path.join(imagesDir, file);
    const cloudPath = `images/${file}`;
    
    console.log(`上传: ${file}`);
    
    const command = `tcb hosting deploy "${localPath}" "${cloudPath}" --env-id ${envId}`;
    
    const { execSync } = require('child_process');
    try {
      execSync(command, { stdio: 'ignore' });
      console.log(`  ✅ 成功`);
    } catch (e) {
      console.log(`  ❌ 失败: ${e.message}`);
    }
  }
  
  console.log('\n图片上传完成！');
}

main();

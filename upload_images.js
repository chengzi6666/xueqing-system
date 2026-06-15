const fs = require('fs');
const path = require('path');
const CloudBase = require('@cloudbase/manager-node');

const config = {
  secretId: process.env.CLOUDBASE_SECRET_ID || 'YOUR_SECRET_ID',
  secretKey: process.env.CLOUDBASE_SECRET_KEY || 'YOUR_SECRET_KEY',
  envId: process.env.CLOUDBASE_ENV_ID || 'YOUR_ENV_ID'
};

async function uploadImages() {
  try {
    console.log('初始化 CloudBase...');
    
    const app = new CloudBase({
      secretId: config.secretId,
      secretKey: config.secretKey,
      envId: config.envId
    });

    const { hosting } = app;
    const imagesDir = path.resolve(__dirname, 'images');
    
    const files = fs.readdirSync(imagesDir).filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.png', '.jpg', '.jpeg', '.gif', '.bmp'].includes(ext);
    });

    console.log(`找到 ${files.length} 个图片文件`);
    console.log('开始上传图片...');

    let successCount = 0;
    let failCount = 0;

    for (const file of files) {
      try {
        const localPath = path.join(imagesDir, file);
        const cloudPath = `images/${file}`;
        
        console.log(`  上传: ${file}`);
        
        await hosting.uploadFiles({
          files: [{
            localPath: localPath,
            cloudPath: cloudPath
          }]
        });

        console.log(`    成功: ${file}`);
        successCount++;
      } catch (error) {
        console.log(`    失败: ${file}`);
        console.log(`       错误: ${error.message}`);
        failCount++;
      }
    }

    console.log('\n上传完成！');
    console.log(`   成功: ${successCount}`);
    console.log(`   失败: ${failCount}`);

  } catch (error) {
    console.error('上传过程出错:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

uploadImages();
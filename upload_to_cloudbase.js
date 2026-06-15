const fs = require('fs');
const path = require('path');
const CloudBase = require('@cloudbase/manager-node');

const config = {
  secretId: process.env.CLOUDBASE_SECRET_ID || 'YOUR_SECRET_ID',
  secretKey: process.env.CLOUDBASE_SECRET_KEY || 'YOUR_SECRET_KEY',
  envId: process.env.CLOUDBASE_ENV_ID || 'YOUR_ENV_ID'
};

const filesToUpload = [
  { localPath: './developer.html', cloudPath: 'developer.html' },
  { localPath: './developer.js', cloudPath: 'developer.js' },
  { localPath: './developer.css', cloudPath: 'developer.css' },
  { localPath: './index.html', cloudPath: 'index.html' },
  { localPath: './teacher.js', cloudPath: 'teacher.js' },
  { localPath: './teacher.css', cloudPath: 'teacher.css' }
];

async function uploadFiles() {
  try {
    console.log('🔧 初始化 CloudBase...');
    
    const app = new CloudBase({
      secretId: config.secretId,
      secretKey: config.secretKey,
      envId: config.envId
    });

    const { hosting } = app;

    console.log('📤 开始上传文件...');
    let successCount = 0;
    let failCount = 0;

    for (const file of filesToUpload) {
      try {
        console.log(`  正在上传: ${file.localPath}`);
        
        const localFilePath = path.resolve(__dirname, file.localPath);
        
        if (!fs.existsSync(localFilePath)) {
          console.log(`    ❌ 文件不存在: ${file.localPath}`);
          failCount++;
          continue;
        }

        await hosting.uploadFiles({
          files: [{
            localPath: localFilePath,
            cloudPath: file.cloudPath
          }]
        });

        console.log(`    ✅ 上传成功: ${file.cloudPath}`);
        successCount++;
      } catch (error) {
        console.log(`    ❌ 上传失败: ${file.cloudPath}`);
        console.log(`       错误: ${error.message}`);
        failCount++;
      }
    }

    console.log('\n📊 上传完成！');
    console.log(`   成功: ${successCount}`);
    console.log(`   失败: ${failCount}`);
    
    if (successCount > 0) {
      console.log('\n🌐 访问地址:');
      console.log(`   开发者端: https://${config.envId}.tcloudbaseapp.com/developer.html`);
      console.log(`   老师端:   https://${config.envId}.tcloudbaseapp.com/index.html`);
    }

  } catch (error) {
    console.error('❌ 上传过程出错:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

uploadFiles();
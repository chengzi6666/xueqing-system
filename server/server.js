const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// 静态文件服务（图片和前端页面）
const imagesPath = path.join(__dirname, '../images');
const publicImagesPath = path.join(__dirname, 'public', 'images');
const deployTempPath = path.join(__dirname, '../deploy_temp/images');

// 确保图片目录存在
if (!fs.existsSync(imagesPath)) {
    console.log(`[静态文件配置] 图片目录不存在，正在创建: ${imagesPath}`);
    fs.mkdirSync(imagesPath, { recursive: true });
}

if (!fs.existsSync(publicImagesPath)) {
    console.log(`[静态文件配置] public/images目录不存在，正在创建: ${publicImagesPath}`);
    fs.mkdirSync(publicImagesPath, { recursive: true });
}

console.log(`[静态文件配置] 图片目录1: ${imagesPath}`);
console.log(`[静态文件配置] 图片目录2: ${publicImagesPath}`);
console.log(`[静态文件配置] 图片目录3: ${deployTempPath}`);
console.log(`[静态文件配置] 图片目录1存在: ${fs.existsSync(imagesPath)}`);
console.log(`[静态文件配置] 图片目录2存在: ${fs.existsSync(publicImagesPath)}`);
console.log(`[静态文件配置] 图片目录3存在: ${fs.existsSync(deployTempPath)}`);

// 列出三个目录的图片
let totalImages = 0;
let dir1Count = 0, dir2Count = 0, dir3Count = 0;

if (fs.existsSync(imagesPath)) {
    const imageFiles = fs.readdirSync(imagesPath);
    dir1Count = imageFiles.length;
    totalImages += dir1Count;
    console.log(`[静态文件配置] 目录1图片数量: ${dir1Count}`);
    if (dir1Count > 0) {
        console.log(`[静态文件配置] 目录1前5个图片: ${imageFiles.slice(0, 5).join(', ')}`);
    }
}

if (fs.existsSync(publicImagesPath)) {
    const publicImageFiles = fs.readdirSync(publicImagesPath);
    dir2Count = publicImageFiles.length;
    totalImages += dir2Count;
    console.log(`[静态文件配置] 目录2图片数量: ${dir2Count}`);
    if (dir2Count > 0) {
        console.log(`[静态文件配置] 目录2前5个图片: ${publicImageFiles.slice(0, 5).join(', ')}`);
    }
}

if (fs.existsSync(deployTempPath)) {
    const tempImageFiles = fs.readdirSync(deployTempPath);
    dir3Count = tempImageFiles.length;
    totalImages += dir3Count;
    console.log(`[静态文件配置] 目录3图片数量: ${dir3Count}`);
    if (dir3Count > 0) {
        console.log(`[静态文件配置] 目录3前5个图片: ${tempImageFiles.slice(0, 5).join(', ')}`);
    }
}

if (totalImages === 0) {
    console.log('[静态文件配置] 警告：所有图片目录都为空！请确保图片文件已正确部署');
}

// 确保主目录有图片 - 从所有可能的源目录复制
console.log('[静态文件配置] 确保主图片目录有图片...');
const allSourceDirs = [imagesPath, publicImagesPath, deployTempPath];
let copiedCount = 0;

allSourceDirs.forEach(sourceDir => {
    if (fs.existsSync(sourceDir) && sourceDir !== imagesPath) {
        const files = fs.readdirSync(sourceDir);
        files.forEach(file => {
            if (file.match(/\.(png|jpg|jpeg|gif|webp)$/i)) {
                const sourceFile = path.join(sourceDir, file);
                const destFile = path.join(imagesPath, file);
                if (!fs.existsSync(destFile)) {
                    try {
                        fs.copyFileSync(sourceFile, destFile);
                        copiedCount++;
                        console.log(`[静态文件配置] 已复制: ${file}`);
                    } catch (e) {
                        console.log(`[静态文件配置] 复制失败: ${file} - ${e.message}`);
                    }
                }
            }
        });
    }
});

if (copiedCount > 0) {
    console.log(`[静态文件配置] 图片复制完成，共复制 ${copiedCount} 张图片`);
} else {
    console.log('[静态文件配置] 所有图片已存在，无需复制');
}

// 重新检查主目录的图片数量
if (fs.existsSync(imagesPath)) {
    const updatedFiles = fs.readdirSync(imagesPath);
    console.log(`[静态文件配置] 更新后主目录图片数量: ${updatedFiles.length}`);
}

// 静态文件服务 - 直接服务 images 目录
app.use('/images', express.static(path.join(__dirname, '../images')));
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));
app.use('/images', express.static(path.join(__dirname, '../deploy_temp', 'images')));
app.use(express.static(path.join(__dirname, '..'), {
    index: 'index.html'
}));

// 数据存储路径
const DATA_DIR = path.join(__dirname, 'data');
const OUTLINE_FILE = path.join(DATA_DIR, 'outline.json');
const CONFIG_FILE = path.join(DATA_DIR, 'config.json');
const VERSION_FILE = path.join(DATA_DIR, 'version_history.json');
const HISTORY_DIR = path.join(DATA_DIR, 'history');

// 确保历史版本目录存在
if (!fs.existsSync(HISTORY_DIR)) {
    fs.mkdirSync(HISTORY_DIR, { recursive: true });
}

// 确保数据目录存在
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// 配置文件上传
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../images'));
    },
    filename: function (req, file, cb) {
        // 保留原始文件名（支持中文文件名）
        const originalName = Buffer.from(file.originalname, 'latin1').toString('utf8');
        cb(null, originalName);
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: function (req, file, cb) {
        const allowedTypes = /jpeg|jpg|png/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('只允许上传JPEG或PNG格式的图片'));
        }
    }
 });

// 初始化默认数据
function initData() {
    // 默认大纲数据
    if (!fs.existsSync(OUTLINE_FILE)) {
        const defaultOutline = {
            math: {
                subject: '数学',
                levels: ['L1', 'L2', 'L3', 'L4'],
                lessons: {}
            },
            chinese: {
                subject: '语文',
                levels: ['L1', 'L2', 'L3', 'L4'],
                lessons: {}
            }
        };
        fs.writeFileSync(OUTLINE_FILE, JSON.stringify(defaultOutline, null, 2));
    }
    
    // 默认配置
    if (!fs.existsSync(CONFIG_FILE)) {
        const defaultConfig = {
            currentVersion: 'v1.0.0',
            teacherName: '老师',
            teacherAvatar: '',
            lastUpdate: new Date().toISOString()
        };
        fs.writeFileSync(CONFIG_FILE, JSON.stringify(defaultConfig, null, 2));
    }
    
    // 默认版本历史
    if (!fs.existsSync(VERSION_FILE)) {
        const defaultVersion = {
            history: [{
                version: 'v1.0.0',
                date: new Date().toISOString().split('T')[0],
                description: '初始版本'
            }]
        };
        fs.writeFileSync(VERSION_FILE, JSON.stringify(defaultVersion, null, 2));
    }
}

initData();

// ============ API 接口 ============

// 获取大纲数据
app.get('/api/outline', (req, res) => {
    try {
        const data = fs.readFileSync(OUTLINE_FILE, 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        res.status(500).json({ error: '获取大纲数据失败' });
    }
});

// 获取指定科目的大纲数据
app.get('/api/outline/:subject', (req, res) => {
    try {
        const data = fs.readFileSync(OUTLINE_FILE, 'utf8');
        const outline = JSON.parse(data);
        const subject = req.params.subject;
        
        if (outline[subject]) {
            res.json(outline[subject]);
        } else {
            res.status(404).json({ error: '科目不存在' });
        }
    } catch (error) {
        res.status(500).json({ error: '获取大纲数据失败' });
    }
});

// 发布大纲数据（开发者端使用）
app.post('/api/outline', (req, res) => {
    try {
        const outlineData = req.body;
        
        // 添加更新时间
        const now = new Date().toISOString();
        outlineData.lastUpdate = now;
        
        fs.writeFileSync(OUTLINE_FILE, JSON.stringify(outlineData, null, 2));
        
        // 同时更新配置文件的更新时间，以便老师端检测到更新
        const configData = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
        configData.lastUpdate = now;
        fs.writeFileSync(CONFIG_FILE, JSON.stringify(configData, null, 2));
        
        console.log(`[${now}] 大纲数据已更新`);
        
        res.json({ 
            success: true, 
            message: '大纲数据已发布',
            lastUpdate: now
        });
    } catch (error) {
        console.error('发布大纲数据失败:', error);
        res.status(500).json({ error: '发布大纲数据失败' });
    }
});

// 更新指定科目的大纲数据
app.put('/api/outline/:subject', (req, res) => {
    try {
        const subject = req.params.subject;
        const subjectData = req.body;
        
        // 读取现有数据
        const data = fs.readFileSync(OUTLINE_FILE, 'utf8');
        const outline = JSON.parse(data);
        
        // 更新指定科目
        outline[subject] = subjectData;
        outline.lastUpdate = new Date().toISOString();
        
        fs.writeFileSync(OUTLINE_FILE, JSON.stringify(outline, null, 2));
        
        console.log(`[${new Date().toISOString()}] ${subject}大纲数据已更新`);
        
        res.json({ 
            success: true, 
            message: `${subject}大纲数据已发布`,
            lastUpdate: outline.lastUpdate
        });
    } catch (error) {
        console.error('更新大纲数据失败:', error);
        res.status(500).json({ error: '更新大纲数据失败' });
    }
});

// 获取配置信息
app.get('/api/config', (req, res) => {
    try {
        const data = fs.readFileSync(CONFIG_FILE, 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        res.status(500).json({ error: '获取配置失败' });
    }
});

// 更新配置信息（开发者端使用）
app.put('/api/config', (req, res) => {
    try {
        const configData = req.body;
        configData.lastUpdate = new Date().toISOString();
        
        fs.writeFileSync(CONFIG_FILE, JSON.stringify(configData, null, 2));
        
        console.log(`[${new Date().toISOString()}] 配置已更新`);
        
        res.json({ 
            success: true, 
            message: '配置已更新',
            lastUpdate: configData.lastUpdate
        });
    } catch (error) {
        console.error('更新配置失败:', error);
        res.status(500).json({ error: '更新配置失败' });
    }
});

// 获取版本历史
app.get('/api/version', (req, res) => {
    try {
        const data = fs.readFileSync(VERSION_FILE, 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        res.status(500).json({ error: '获取版本历史失败' });
    }
});

// 添加新版本记录
app.post('/api/version', (req, res) => {
    try {
        const versionData = req.body;
        const now = new Date().toISOString();
        
        // 读取现有版本历史
        const data = fs.readFileSync(VERSION_FILE, 'utf8');
        const versionHistory = JSON.parse(data);
        
        // 保存当前大纲数据到历史版本
        const outlineData = JSON.parse(fs.readFileSync(OUTLINE_FILE, 'utf8'));
        const historyFile = path.join(HISTORY_DIR, `${versionData.version}.json`);
        fs.writeFileSync(historyFile, JSON.stringify(outlineData, null, 2));
        
        // 添加新版本
        versionHistory.history.unshift({
            version: versionData.version,
            date: now.split('T')[0],
            description: versionData.description || '',
            timestamp: now
        });
        
        fs.writeFileSync(VERSION_FILE, JSON.stringify(versionHistory, null, 2));
        
        // 同时更新配置中的当前版本
        const configData = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
        configData.currentVersion = versionData.version;
        configData.lastUpdate = now;
        fs.writeFileSync(CONFIG_FILE, JSON.stringify(configData, null, 2));
        
        console.log(`[${now}] 新版本 ${versionData.version} 已发布`);
        
        res.json({ 
            success: true, 
            message: `版本 ${versionData.version} 已发布`,
            versionHistory: versionHistory
        });
    } catch (error) {
        console.error('发布版本失败:', error);
        res.status(500).json({ error: '发布版本失败' });
    }
});

// 获取指定版本的大纲数据
app.get('/api/version/:version/outline', (req, res) => {
    try {
        const version = req.params.version;
        const historyFile = path.join(HISTORY_DIR, `${version}.json`);
        
        if (fs.existsSync(historyFile)) {
            const outlineData = JSON.parse(fs.readFileSync(historyFile, 'utf8'));
            res.json(outlineData);
        } else {
            res.status(404).json({ error: '版本数据不存在' });
        }
    } catch (error) {
        console.error('获取版本大纲失败:', error);
        res.status(500).json({ error: '获取版本大纲失败' });
    }
});

// 获取图片列表接口
app.get('/api/images', (req, res) => {
    try {
        const imagesDir = path.join(__dirname, '../images');
        const publicImagesDir = path.join(__dirname, 'public', 'images');
        const deployTempDir = path.join(__dirname, '../deploy_temp/images');
        
        let imageFiles = [];
        
        // 从主图片目录读取
        if (fs.existsSync(imagesDir)) {
            imageFiles = fs.readdirSync(imagesDir).filter(file => 
                file.match(/\.(png|jpg|jpeg|gif|webp)$/i)
            );
        }
        
        // 如果主目录为空，从public目录读取
        if (imageFiles.length === 0 && fs.existsSync(publicImagesDir)) {
            imageFiles = fs.readdirSync(publicImagesDir).filter(file => 
                file.match(/\.(png|jpg|jpeg|gif|webp)$/i)
            );
        }
        
        // 如果还是为空，从deploy_temp目录读取
        if (imageFiles.length === 0 && fs.existsSync(deployTempDir)) {
            imageFiles = fs.readdirSync(deployTempDir).filter(file => 
                file.match(/\.(png|jpg|jpeg|gif|webp)$/i)
            );
        }
        
        console.log(`[API] 获取图片列表，共 ${imageFiles.length} 张图片`);
        
        res.json(imageFiles);
    } catch (error) {
        console.error('获取图片列表失败:', error);
        res.status(500).json({ error: '获取图片列表失败' });
    }
});

// 调试接口 - 检查服务器文件系统
app.get('/api/debug/fs', (req, res) => {
    try {
        const baseDir = __dirname;
        const imagesDir = path.join(__dirname, '../images');
        const publicImagesDir = path.join(__dirname, 'public', 'images');
        const deployTempDir = path.join(__dirname, '../deploy_temp/images');
        
        const result = {
            baseDir: baseDir,
            imagesDir: imagesDir,
            publicImagesDir: publicImagesDir,
            deployTempDir: deployTempDir,
            imagesDirExists: fs.existsSync(imagesDir),
            publicImagesDirExists: fs.existsSync(publicImagesDir),
            deployTempDirExists: fs.existsSync(deployTempDir),
            imagesDirFiles: fs.existsSync(imagesDir) ? fs.readdirSync(imagesDir).slice(0, 10) : [],
            publicImagesDirFiles: fs.existsSync(publicImagesDir) ? fs.readdirSync(publicImagesDir).slice(0, 10) : [],
            deployTempDirFiles: fs.existsSync(deployTempDir) ? fs.readdirSync(deployTempDir).slice(0, 10) : [],
            imagesDirCount: fs.existsSync(imagesDir) ? fs.readdirSync(imagesDir).length : 0,
            publicImagesDirCount: fs.existsSync(publicImagesDir) ? fs.readdirSync(publicImagesDir).length : 0,
            deployTempDirCount: fs.existsSync(deployTempDir) ? fs.readdirSync(deployTempDir).length : 0
        };
        
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 获取单张图片数据接口
app.get('/api/image/:filename', (req, res) => {
    try {
        const filename = decodeURIComponent(req.params.filename);
        const imagesDir = path.join(__dirname, '../images');
        const publicImagesDir = path.join(__dirname, 'public', 'images');
        const deployTempDir = path.join(__dirname, '../deploy_temp/images');
        
        let filePath = path.join(imagesDir, filename);
        
        if (!fs.existsSync(filePath)) {
            filePath = path.join(publicImagesDir, filename);
        }
        
        if (!fs.existsSync(filePath)) {
            filePath = path.join(deployTempDir, filename);
        }
        
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: '图片不存在' });
        }
        
        const ext = path.extname(filename).toLowerCase();
        let contentType = 'image/png';
        
        if (ext === '.jpg' || ext === '.jpeg') {
            contentType = 'image/jpeg';
        } else if (ext === '.gif') {
            contentType = 'image/gif';
        } else if (ext === '.webp') {
            contentType = 'image/webp';
        }
        
        const imageBuffer = fs.readFileSync(filePath);
        res.set('Content-Type', contentType);
        res.send(imageBuffer);
        
    } catch (error) {
        console.error('获取图片失败:', error);
        res.status(500).json({ error: '获取图片失败' });
    }
});

// 图片上传接口
app.post('/api/upload-image', upload.array('images', 10), (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.json({
                success: false,
                message: '请选择要上传的图片'
            });
        }
        
        const filenames = req.files.map(file => file.filename);
        res.json({
            success: true,
            message: `成功上传 ${req.files.length} 张图片`,
            filenames: filenames
        });
    } catch (error) {
        res.json({
            success: false,
            message: '图片上传失败: ' + error.message
        });
    }
});

// 头像上传接口
app.post('/api/upload-avatar', upload.single('avatar'), (req, res) => {
    try {
        if (!req.file) {
            return res.json({
                success: false,
                message: '请选择要上传的头像图片'
            });
        }
        
        res.json({
            success: true,
            message: '头像上传成功',
            filename: req.file.filename
        });
    } catch (error) {
        res.json({
            success: false,
            message: '头像上传失败: ' + error.message
        });
    }
});

// 检查更新（老师端轮询使用）
app.get('/api/check-update', (req, res) => {
    try {
        const configData = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
        const outlineData = JSON.parse(fs.readFileSync(OUTLINE_FILE, 'utf8'));
        
        res.json({
            currentVersion: configData.currentVersion,
            lastUpdate: configData.lastUpdate,
            hasUpdate: true
        });
    } catch (error) {
        res.status(500).json({ error: '检查更新失败' });
    }
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`=================================`);
    console.log(`学习报告系统后端服务器已启动`);
    console.log(`端口: ${PORT}`);
    console.log(`=================================`);
    console.log(`API接口列表:`);
    console.log(`  GET  /api/outline          - 获取全部大纲数据`);
    console.log(`  GET  /api/outline/:subject - 获取指定科目大纲`);
    console.log(`  POST /api/outline          - 发布大纲数据`);
    console.log(`  PUT  /api/outline/:subject - 更新指定科目大纲`);
    console.log(`  GET  /api/config           - 获取配置`);
    console.log(`  PUT  /api/config           - 更新配置`);
    console.log(`  GET  /api/version          - 获取版本历史`);
    console.log(`  POST /api/version          - 发布新版本`);
    console.log(`  GET  /api/check-update     - 检查更新`);
    console.log(`=================================`);
    console.log(`访问地址:`);
    console.log(`  开发者端: http://localhost:${PORT}/developer.html`);
    console.log(`  老师端:   http://localhost:${PORT}/index.html`);
    console.log(`=================================`);
});
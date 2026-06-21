let currentSubject = 'math';
let currentLevel = 'L1';
let currentLesson = '1';
let outlineData = null;
let configData = null;
let versionHistory = null;
let imagesList = [];
let imageUrlMap = {};

// 初始化所有数据结构（确保页面加载时就有正确的数据）
function initializeData() {
    console.log('初始化数据结构...');
    
    if (!outlineData) {
        outlineData = { 
            math: { lessons: { L1: {}, L2: {}, L3: {}, L4: {} } }, 
            chinese: { lessons: { L1: {}, L2: {}, L3: {}, L4: {} } } 
        };
    }
    
    if (!configData) {
        configData = {
            currentVersion: 'v5.0.1',
            teacherName: '老师',
            teacherAvatar: '',
            developerPassword: 'admin123'
        };
    }
    
    if (!versionHistory) {
        versionHistory = {
            history: [
                { version: 'v5.0.0', date: '2026-06-12', subject: 'both', description: '修复图片上传和预览问题' },
                { version: 'v4.0.0', date: '2026-06-11', subject: 'both', description: '优化图片URL映射' },
                { version: 'v3.0.0', date: '2026-06-10', subject: 'both', description: '修复数据初始化问题' },
                { version: 'v2.0.0', date: '2026-06-09', subject: 'both', description: '添加base64备用方案' },
                { version: 'v1.0.0', date: '2024-01-01', subject: 'both', description: '初始版本' }
            ]
        };
    }
    
    console.log('数据结构初始化完成');
}

// 立即初始化数据
initializeData();

// 云开发配置
let cloudbaseApp = null;
try {
    if (!window.location.origin.includes('localhost') && typeof cloudbase !== 'undefined') {
        cloudbaseApp = cloudbase.init({
            env: 'xueqing-system-d2g4d3p65a7bd1e18'
        });
        console.log('云开发初始化成功');
    } else {
        console.log('本地环境或云开发SDK未加载，使用本地模式');
    }
} catch (e) {
    console.error('云开发初始化失败:', e);
    cloudbaseApp = null;
}

// 云开发匿名登录（仅在云开发可用时）
if (cloudbaseApp) {
    cloudbaseApp.auth().anonymousAuthProvider().signIn()
        .then(() => console.log('云开发匿名登录成功'))
        .catch(err => console.error('云开发匿名登录失败:', err));
}

// 后端API地址（完全不使用后端API，仅使用云开发数据库和本地存储）
const API_BASE_URL = null;

async function init() {
    await loadData();
    updateUI();
}

// 从本地存储加载数据（作为缓存）
function loadFromStorage() {
    try {
        const savedOutline = localStorage.getItem('outlineData');
        if (savedOutline) {
            const parsed = JSON.parse(savedOutline);
            // 安全合并数据，保留默认结构
            if (parsed.math) {
                outlineData.math.lessons = {
                    ...outlineData.math.lessons,
                    ...parsed.math?.lessons
                };
            }
            if (parsed.chinese) {
                outlineData.chinese.lessons = {
                    ...outlineData.chinese.lessons,
                    ...parsed.chinese?.lessons
                };
            }
            console.log('已从本地存储加载大纲数据（缓存）');
        }
        
        const savedImages = localStorage.getItem('imagesList');
        if (savedImages) {
            imagesList = JSON.parse(savedImages);
            console.log('已从本地存储加载图片列表（缓存）');
        }
        
        const savedConfig = localStorage.getItem('configData');
        if (savedConfig) {
            const parsedConfig = JSON.parse(savedConfig);
            configData = { ...configData, ...parsedConfig };
            console.log('已从本地存储加载配置数据（缓存）');
        }
    } catch (e) {
        console.error('加载本地存储失败:', e);
    }
}

// 保存数据到本地存储（作为缓存）
function saveToStorage() {
    try {
        localStorage.setItem('outlineData', JSON.stringify(outlineData));
        localStorage.setItem('configData', JSON.stringify(configData));
        localStorage.setItem('imagesList', JSON.stringify(imagesList));
        console.log('数据已保存到本地存储（缓存）');
    } catch (e) {
        console.error('保存到本地存储失败:', e);
    }
}

async function loadData() {
    // 先尝试从本地存储加载（作为缓存）
    loadFromStorage();
    
    let outline = null;
    let config = null;
    let versions = null;
    
    try {
        // 尝试从云开发数据库加载数据
        if (cloudbaseApp) {
            try {
                console.log('正在从云开发数据库加载数据...');
                const db = cloudbaseApp.database();
                
                const outlineRes = await db.collection('outlines').get();
                if (outlineRes.data.length > 0) {
                    outline = outlineRes.data[0];
                }
                
                const configRes = await db.collection('config').get();
                if (configRes.data.length > 0) {
                    config = configRes.data[0];
                }
                
                const versionsRes = await db.collection('versions').get();
                if (versionsRes.data.length > 0) {
                    versions = versionsRes.data[0];
                }
                console.log('云开发数据库加载成功');
            } catch (e) {
                console.log('云开发数据库不可用:', e.message);
            }
        }
        
        // 如果云开发不可用，尝试从后端API加载（仅本地开发环境）
        if ((!outline || !config || !versions) && API_BASE_URL) {
            console.log('正在从后端API加载最新数据...');
            try {
                [outline, config, versions] = await Promise.all([
                    fetch(`${API_BASE_URL}/outline`).then(r => r.json()).catch(() => null),
                    fetch(`${API_BASE_URL}/config`).then(r => r.json()).catch(() => null),
                    fetch(`${API_BASE_URL}/version`).then(r => r.json()).catch(() => null)
                ]);
            } catch (e) {
                console.log('后端API不可用');
            }
        }
        
        // 如果数据加载成功，合并到默认数据（而不是直接替换）
        if (outline && outline.math && outline.chinese) {
            // 合理合并数据，保留默认结构
            outlineData = {
                math: { 
                    lessons: { 
                        L1: outline.math?.lessons?.L1 || outlineData.math?.lessons?.L1 || {},
                        L2: outline.math?.lessons?.L2 || outlineData.math?.lessons?.L2 || {},
                        L3: outline.math?.lessons?.L3 || outlineData.math?.lessons?.L3 || {},
                        L4: outline.math?.lessons?.L4 || outlineData.math?.lessons?.L4 || {}
                    }
                },
                chinese: { 
                    lessons: { 
                        L1: outline.chinese?.lessons?.L1 || outlineData.chinese?.lessons?.L1 || {},
                        L2: outline.chinese?.lessons?.L2 || outlineData.chinese?.lessons?.L2 || {},
                        L3: outline.chinese?.lessons?.L3 || outlineData.chinese?.lessons?.L3 || {},
                        L4: outline.chinese?.lessons?.L4 || outlineData.chinese?.lessons?.L4 || {}
                    }
                }
            };
            console.log('已从后端API加载大纲数据');
            saveToStorage();  // 同步到本地缓存
        } else {
            console.log('后端API不可用，使用默认数据');
        }
        
        // 确保数据结构始终正确
        ensureDataStructure();
        
        if (config) {
            // 合并配置数据
            configData = {
                ...configData,
                ...config
            };
        }
        
        if (versions && versions.history) {
            versionHistory = {
                history: versions.history || versionHistory.history
            };
        }
        
        document.getElementById('current-version').textContent = configData.currentVersion || 'v1.0.0';
        document.getElementById('default-teacher-name').value = configData.teacherName || '老师';
        document.getElementById('default-teacher-avatar').value = configData.teacherAvatar || '';
        
        await loadImagesList();
        renderVersions();
        
        console.log('数据加载完成');
    } catch (e) {
        console.error('加载数据失败:', e);
        // 使用默认数据
        console.log('使用默认数据');
    }
}

async function loadImagesList() {
    // 预定义的图片列表（根据实际文件名）
    const predefinedImages = [
        '数学-L1-第1讲.png', '数学-L1-第2讲.png', '数学-L1-第3讲.png', '数学-L1-第4讲.png', '数学-L1-第5讲.png',
        '数学-L2-第1讲.png', '数学-L2-第2讲.png', '数学-L2-第3讲.png', '数学-L2-第4讲.png', '数学-L2-第5讲.png',
        '数学-L3-第1讲.png', '数学-L3-第2讲.png', '数学-L3-第3讲.png', '数学-L3-第4讲.png', '数学-L3-第5讲.png',
        '数学-L4-第1讲.png', '数学-L4-第2讲.png', '数学-L4-第3讲.png', '数学-L4-第4讲.png', '数学-L4-第5讲.png',
        '语文-L1-第1讲.png', '语文-L1-第2讲.jpg', '语文-L1-第3讲.png', '语文-L1-第4讲.jpg', '语文-L1-第5讲.jpg',
        '语文-L2-第1讲.jpg', '语文-L2-第2讲.jpg', '语文-L2-第3讲.jpg', '语文-L2-第4讲.jpg', '语文-L2-第5讲.jpg',
        '语文-L3-第1讲.png', '语文-L3-第2讲.png', '语文-L3-第3讲.png', '语文-L3-第4讲.png', '语文-L3-第5讲.png',
        '语文-L4-第1讲.png', '语文-L4-第2讲.png', '语文-L4-第3讲.png', '语文-L4-第4讲.jpg', '语文-L4-第5讲.jpg',
        '语文-L4-第二讲.png'
    ];
    
    // 尝试从云开发数据库获取图片列表
    if (cloudbaseApp) {
        try {
            const db = cloudbaseApp.database();
            const result = await db.collection('images').get();
            if (result.data.length > 0) {
                // 合并数据库中的图片和预定义图片
                const dbImages = result.data.map(item => item.fileName);
                imagesList = [...new Set([...predefinedImages, ...dbImages])];
                
                // 加载图片URL映射
                result.data.forEach(item => {
                    if (item.base64Data) {
                        imageUrlMap[item.fileName] = item.base64Data;
                    }
                });
                
                console.log('从数据库加载图片列表成功');
                populateImageSelect();
                return;
            }
        } catch (e) {
            console.log('从数据库加载图片列表失败:', e.message);
        }
    }
    
    // 尝试从本地目录获取图片列表（仅本地开发环境）
    try {
        const response = await fetch('images/');
        if (response.ok) {
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const links = doc.querySelectorAll('a');
            const localImages = Array.from(links).map(a => a.textContent).filter(n => n.endsWith('.png') || n.endsWith('.jpg'));
            imagesList = [...new Set([...predefinedImages, ...localImages])];
            console.log('从本地目录加载图片列表成功');
            populateImageSelect();
            return;
        }
    } catch (e) {
        console.log('从本地目录加载图片列表失败:', e.message);
    }
    
    // 使用预定义图片列表
    imagesList = predefinedImages;
    console.log('使用预定义图片列表');
    populateImageSelect();
}

function populateImageSelect() {
    const select = document.getElementById('image-select');
    select.innerHTML = '<option value="">选择图片</option>';
    
    // 只显示当前科目的图片
    const subjectPrefix = currentSubject === 'math' ? '数学' : '语文';
    const subjectImages = imagesList.filter(img => img.startsWith(subjectPrefix));
    
    subjectImages.forEach(img => {
        const option = document.createElement('option');
        option.value = img;
        option.textContent = img;
        select.appendChild(option);
    });
    
    // 如果没有匹配的图片，显示提示
    if (subjectImages.length === 0) {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = '暂无该科目的图片';
        option.disabled = true;
        select.appendChild(option);
    }
}

function updateUI() {
    // 确保数据结构正确
    ensureDataStructure();
    renderLessonButtons();
    renderLessonData();
    renderImagesGrid();
}

// 确保数据结构始终正确
function ensureDataStructure() {
    // 确保 outlineData 存在
    if (!outlineData) {
        outlineData = {};
    }
    
    // 确保 math 和 chinese 存在
    if (!outlineData.math) {
        outlineData.math = { lessons: { L1: {}, L2: {}, L3: {}, L4: {} } };
    }
    if (!outlineData.chinese) {
        outlineData.chinese = { lessons: { L1: {}, L2: {}, L3: {}, L4: {} } };
    }
    
    // 确保 lessons 存在
    if (!outlineData.math.lessons) {
        outlineData.math.lessons = { L1: {}, L2: {}, L3: {}, L4: {} };
    }
    if (!outlineData.chinese.lessons) {
        outlineData.chinese.lessons = { L1: {}, L2: {}, L3: {}, L4: {} };
    }
    
    // 确保每个级别存在
    const levels = ['L1', 'L2', 'L3', 'L4'];
    for (const level of levels) {
        if (!outlineData.math.lessons[level]) {
            outlineData.math.lessons[level] = {};
        }
        if (!outlineData.chinese.lessons[level]) {
            outlineData.chinese.lessons[level] = {};
        }
    }
    
    console.log('数据结构检查完成');
}

// 清理多余讲次数据（每个级别最多5个）
function cleanExcessLessons() {
    for (const subject in outlineData) {
        if (!outlineData[subject]?.lessons) continue;
        
        for (const level in outlineData[subject].lessons) {
            const lessons = outlineData[subject].lessons[level];
            if (!lessons) continue;
            
            const keys = Object.keys(lessons).sort((a, b) => {
                const numA = parseInt(a.replace(/\D/g, ''));
                const numB = parseInt(b.replace(/\D/g, ''));
                return numA - numB;
            });
            
            // 删除超过5个的讲次
            if (keys.length > 5) {
                const excessKeys = keys.slice(5);
                excessKeys.forEach(key => {
                    delete lessons[key];
                });
                console.log(`清理${subject}-${level}: 删除了${excessKeys.length}个多余讲次`);
            }
        }
    }
}

// 动态生成讲次按钮（最多5个）
function renderLessonButtons() {
    // 先清理多余数据
    cleanExcessLessons();
    
    const lessonTabs = document.querySelector('.lesson-tabs');
    const lessons = outlineData[currentSubject]?.lessons[currentLevel] || {};
    
    // 获取讲次并排序，只保留前5个
    let lessonKeys = Object.keys(lessons).sort((a, b) => {
        const numA = parseInt(a.replace(/\D/g, ''));
        const numB = parseInt(b.replace(/\D/g, ''));
        return numA - numB;
    }).slice(0, 5); // 强制最多5个讲次
    
    // 确定当前活动的讲次
    let activeKey = currentLesson;
    if (lessonKeys.length > 0 && !lessonKeys.includes(currentLesson)) {
        activeKey = lessonKeys[0];
        currentLesson = activeKey;
    }
    
    if (lessonKeys.length === 0) {
        lessonTabs.innerHTML = `
            <button class="lesson-btn ${activeKey === '1' ? 'active' : ''}" data-lesson="1">第1讲</button>
            <button class="lesson-btn ${activeKey === '2' ? 'active' : ''}" data-lesson="2">第2讲</button>
            <button class="lesson-btn ${activeKey === '3' ? 'active' : ''}" data-lesson="3">第3讲</button>
            <button class="lesson-btn ${activeKey === '4' ? 'active' : ''}" data-lesson="4">第4讲</button>
            <button class="lesson-btn ${activeKey === '5' ? 'active' : ''}" data-lesson="5">第5讲</button>
        `;
    } else {
        lessonTabs.innerHTML = lessonKeys.map((key) => `
            <button class="lesson-btn ${key === activeKey ? 'active' : ''}" data-lesson="${key}">第${key.replace(/\D/g, '')}讲</button>
        `).join('');
    }
    
    // 更新当前讲次
    if (lessonKeys.length > 0 && !lessons[currentLesson]) {
        currentLesson = lessonKeys[0];
    }
}

// 讲次按钮点击处理（事件委托）
function handleLessonButtonClick(e) {
    const btn = e.target;
    if (!btn.classList.contains('lesson-btn')) return;
    
    // 移除所有active类
    document.querySelectorAll('.lesson-btn').forEach(b => b.classList.remove('active'));
    
    // 添加当前按钮的active类
    btn.classList.add('active');
    
    // 更新当前讲次并刷新UI
    currentLesson = btn.dataset.lesson;
    
    // 只刷新数据，不重新生成按钮（避免循环）
    renderLessonData();
    renderImagesGrid();
}

function renderLessonData() {
    const lessonData = outlineData[currentSubject]?.lessons[currentLevel]?.[currentLesson];
    if (!lessonData) return;

    document.getElementById('lesson-title').value = lessonData.title || '';
    document.getElementById('key-points').value = lessonData.keyPoints?.join('\n') || '';
    document.getElementById('lesson-summary').value = lessonData.summary || '';
    document.getElementById('image-select').value = lessonData.image || '';
    
    updateImagePreview();
}

function updateImagePreview() {
    const imagePath = document.getElementById('image-select').value;
    const preview = document.getElementById('preview-image');
    
    console.log('图片预览 - 选择的图片:', imagePath);
    
    if (imagePath) {
        const imgUrl = getImageUrl(imagePath);
        console.log('图片预览 - 完整路径:', imgUrl);
        preview.src = imgUrl;
        preview.style.display = 'block';
        
        // 添加错误处理
        preview.onerror = function() {
            console.error('图片加载失败:', imgUrl);
            preview.style.display = 'none';
            alert(`无法加载图片: ${imagePath}\n请检查图片文件是否存在`);
        };
    } else {
        preview.style.display = 'none';
    }
}

function renderImagesGrid() {
    const grid = document.getElementById('images-grid');
    const subjectPrefix = currentSubject === 'math' ? '数学' : '语文';
    const levelPattern = `-${currentLevel}-`;
    
    // 按科目和级别过滤图片
    const filteredImages = imagesList.filter(img => {
        return img.startsWith(subjectPrefix) && img.includes(levelPattern);
    });
    
    grid.innerHTML = `
        <div class="image-card upload-card">
            <div class="image-placeholder" onclick="triggerImagesUpload()">
                <span>📤</span>
                <p>上传图片</p>
            </div>
        </div>
    ` + filteredImages.map(img => `
        <div class="image-card" onclick="previewImage('${img}')" ondblclick="selectImage('${img}')">
            <img src="${getImageUrl(img)}" alt="${img}">
            <div class="image-info">
                <p>${img}</p>
            </div>
        </div>
    `).join('');
}

function selectImage(img) {
    document.getElementById('image-select').value = img;
    updateImagePreview();
}

// 获取图片URL（优先从映射表获取，否则使用本地路径）
function getImageUrl(imgName) {
    if (imageUrlMap[imgName]) {
        return imageUrlMap[imgName];
    }
    // 对中文文件名进行URL编码
    const encodedName = encodeURIComponent(imgName);
    return `images/${encodedName}`;
}

// 图片预览功能
function previewImage(imgName) {
    const modal = document.getElementById('image-preview-modal');
    const previewImg = document.getElementById('preview-full-image');
    const nameText = document.getElementById('preview-image-name');
    
    previewImg.src = getImageUrl(imgName);
    nameText.textContent = imgName;
    modal.style.display = 'flex';
}

function closeImagePreview() {
    document.getElementById('image-preview-modal').style.display = 'none';
}

// 图片批量上传功能
async function handleImagesUpload(event) {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    let matchedCount = 0;
    let unmatchedCount = 0;
    let uploadSuccessCount = 0;
    let uploadFailCount = 0;
    const results = [];
    
    // 保存上传前的状态
    const oldOutline = JSON.parse(JSON.stringify(outlineData));

    for (const file of files) {
        const fileName = file.name;
        
        // 上传图片到云存储
        let uploadSuccess = false;
        let errorMsg = '';
        if (cloudbaseApp) {
            try {
                console.log(`正在上传图片 ${fileName} 到云存储...`);
                const storage = cloudbaseApp.storage();
                const result = await storage.uploadFile({
                    cloudPath: `images/${fileName}`,
                    filePath: file
                });
                console.log(`图片 ${fileName} 上传成功，fileID: ${result.fileID}`);
                
                // 获取文件URL以便预览
                const fileUrl = await storage.getFileURL({
                    fileID: result.fileID
                });
                const tempFileURL = fileUrl.fileList[0].tempFileURL;
                console.log(`图片URL: ${tempFileURL}`);
                
                // 保存URL到映射表
                imageUrlMap[fileName] = tempFileURL;
                
                uploadSuccess = true;
            } catch (e) {
                errorMsg = e.message || '云存储上传失败';
                console.error(`图片 ${fileName} 云存储上传失败:`, e);
                // 尝试备用方案：将图片转为base64保存到数据库
                try {
                    console.log(`尝试使用base64方式保存图片 ${fileName}...`);
                    const base64Url = await saveImageAsBase64(file, fileName);
                    // 保存base64 URL到映射表
                    imageUrlMap[fileName] = base64Url;
                    uploadSuccess = true;
                    errorMsg = '';
                    console.log(`图片 ${fileName} base64保存成功`);
                } catch (base64Error) {
                    console.error(`图片 ${fileName} base64保存也失败:`, base64Error);
                    uploadFailCount++;
                }
            }
        } else {
            // 本地环境，上传到后端API或使用备用方案
            if (API_BASE_URL) {
                try {
                    const formData = new FormData();
                    formData.append('image', file);
                    const response = await fetch(`${API_BASE_URL}/upload-image`, {
                        method: 'POST',
                        body: formData
                    });
                    if (response.ok) {
                        const result = await response.json();
                        // 保存返回的URL到映射表
                        if (result.url) {
                            imageUrlMap[fileName] = result.url;
                        } else {
                            // 如果没有返回URL，使用本地路径
                            imageUrlMap[fileName] = `images/${fileName}`;
                        }
                        uploadSuccess = true;
                    } else {
                        // 尝试备用方案：保存到本地存储
                        const base64Url = await saveImageAsBase64(file, fileName);
                        imageUrlMap[fileName] = base64Url;
                        uploadSuccess = true;
                    }
                } catch (e) {
                    errorMsg = e.message || '上传请求失败';
                    console.error(`图片 ${fileName} 上传失败:`, e);
                    // 尝试备用方案：保存到本地存储
                    try {
                        const base64Url = await saveImageAsBase64(file, fileName);
                        imageUrlMap[fileName] = base64Url;
                        uploadSuccess = true;
                        errorMsg = '';
                    } catch (base64Error) {
                        console.error(`图片 ${fileName} base64保存也失败:`, base64Error);
                        uploadFailCount++;
                    }
                }
            }
        }
        
        if (uploadSuccess) {
            uploadSuccessCount++;
            // 将新上传的图片添加到全局图片列表
            if (!imagesList.includes(fileName)) {
                imagesList.push(fileName);
            }
            
            const parsedInfo = parseImageFileName(fileName);
            
            if (parsedInfo) {
                // 尝试匹配到大纲数据
                const matched = matchImageToOutline(parsedInfo, fileName);
                if (matched) {
                    matchedCount++;
                    results.push({ fileName, success: true, message: matched });
                } else {
                    unmatchedCount++;
                    results.push({ fileName, success: false, message: '未找到匹配的讲次' });
                }
            } else {
                unmatchedCount++;
                results.push({ fileName, success: false, message: '无法识别文件名格式' });
            }
        } else {
            results.push({ fileName, success: false, message: errorMsg ? `上传失败: ${errorMsg}` : '上传失败' });
        }
    }

    // 重新填充图片下拉框
    populateImageSelect();
    
    // 显示上传结果（包含上传成功/失败统计）
    showUploadResult(results, matchedCount, unmatchedCount, uploadSuccessCount, uploadFailCount);
    
    // 弹出上传结果汇总
    if (uploadSuccessCount > 0 || uploadFailCount > 0) {
        alert(`图片上传完成！\n成功: ${uploadSuccessCount} 张\n失败: ${uploadFailCount} 张\n\n成功匹配: ${matchedCount} 张\n未匹配: ${unmatchedCount} 张`);
    } else if (matchedCount > 0 || unmatchedCount > 0) {
        alert(`图片处理完成！\n成功匹配: ${matchedCount} 张\n未匹配: ${unmatchedCount} 张`);
    }
    
    // 更新UI
    updateUI();
    
    // 保存数据到本地存储
    saveToStorage();
    
    // 清空文件选择
    event.target.value = '';
}

// 中文数字转阿拉伯数字
function chineseToNumber(chinese) {
    const chineseNum = {'零':0,'一':1,'二':2,'三':3,'四':4,'五':5,'六':6,'七':7,'八':8,'九':9,'十':10};
    let result = 0;
    let temp = 0;
    
    for (let i = 0; i < chinese.length; i++) {
        const char = chinese[i];
        if (char === '十') {
            result += temp * 10 || 10;
            temp = 0;
        } else if (chineseNum[char] !== undefined) {
            temp = chineseNum[char];
        }
    }
    result += temp;
    return result || 1;
}

// 解析图片文件名
function parseImageFileName(fileName) {
    // 移除扩展名
    const nameWithoutExt = fileName.replace(/\.(png|jpg|jpeg)$/i, '');
    
    // 定义匹配模式（按优先级排序）
    const patterns = [
        // 数学-L1-第1讲
        /^(数学|语文)-L(\d)-第(\d+)讲$/,
        // 数学-L1-1
        /^(数学|语文)-L(\d)-(\d+)$/,
        // 数学-第1讲
        /^(数学|语文)-第(\d+)讲$/,
        // 数学L11 或 数学1
        /^(数学|语文)(L?)(\d+)$/,
        // 数学-L1
        /^(数学|语文)-L(\d)$/,
        // 支持中文数字：数学-L1-第一讲
        /^(数学|语文)-L(\d)-第([一二三四五])讲$/,
        // 支持中文数字：数学-第一讲
        /^(数学|语文)-第([一二三四五])讲$/
    ];

    for (const pattern of patterns) {
        const match = nameWithoutExt.match(pattern);
        if (match) {
            const subject = match[1] === '数学' ? 'math' : 'chinese';
            const level = match[2] === '' ? 'L1' : (match[2].startsWith('L') ? match[2] : `L${match[2]}`);
            let lesson = match[3] || '1';
            
            // 如果是中文数字，转换为阿拉伯数字
            if (/^[一二三四五]$/.test(lesson)) {
                lesson = chineseToNumber(lesson).toString();
            }
            
            return {
                subject,
                level: level.toUpperCase(),
                lesson: lesson.toString(),
                pattern: pattern.toString()
            };
        }
    }
    
    return null;
}

// 将图片匹配到大纲数据
function matchImageToOutline(parsedInfo, fileName) {
    const { subject, level, lesson } = parsedInfo;
    
    // 验证讲次范围（1-5）
    const lessonNum = parseInt(lesson);
    if (isNaN(lessonNum) || lessonNum < 1 || lessonNum > 5) {
        return `跳过: 讲次${lesson}超出范围(1-5)`;
    }
    
    // 如果当前科目不同，切换科目
    if (currentSubject !== subject) {
        currentSubject = subject;
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.subject === subject);
        });
    }
    
    // 初始化数据结构
    if (!outlineData[subject]) {
        outlineData[subject] = {
            subject: subject === 'math' ? '数学' : '语文',
            levels: ['L1', 'L2', 'L3', 'L4'],
            lessons: { L1: {}, L2: {}, L3: {}, L4: {} }
        };
    }
    
    if (!outlineData[subject].lessons) {
        outlineData[subject].lessons = { L1: {}, L2: {}, L3: {}, L4: {} };
    }
    
    if (!outlineData[subject].lessons[level]) {
        outlineData[subject].lessons[level] = {};
    }
    
    // 检查是否已达到5讲限制（仅对新讲次）
    const currentCount = Object.keys(outlineData[subject].lessons[level]).length;
    if (currentCount >= 5 && !outlineData[subject].lessons[level][lesson]) {
        return `跳过: ${level}级别已达到5讲限制`;
    }
    
    // 如果讲次不存在，创建新讲次
    if (!outlineData[subject].lessons[level][lesson]) {
        outlineData[subject].lessons[level][lesson] = {
            title: `第${lesson}讲`,
            keyPoints: [],
            summary: '',
            image: fileName
        };
    } else {
        // 覆盖更新图片（新图片替换旧图片）
        outlineData[subject].lessons[level][lesson].image = fileName;
    }
    
    return `匹配成功：${subject === 'math' ? '数学' : '语文'} ${level} 第${lesson}讲`;
}

// 显示上传结果
function showUploadResult(results, matchedCount, unmatchedCount, uploadSuccessCount = 0, uploadFailCount = 0) {
    const resultDiv = document.getElementById('upload-result');
    
    let html = `
        <div class="result-summary">
            <span class="success-count">📤 上传成功 ${uploadSuccessCount} 张</span>
            ${uploadFailCount > 0 ? `<span class="fail-count">❌ 上传失败 ${uploadFailCount} 张</span>` : ''}
            <span class="success-count">✅ 成功匹配 ${matchedCount} 张图片</span>
            <span class="fail-count">❌ 未匹配 ${unmatchedCount} 张图片</span>
        </div>
    `;
    
    if (results.length > 0) {
        html += '<div class="result-details">';
        results.forEach(r => {
            html += `<div class="result-item ${r.success ? 'success' : 'error'}">
                <span>${r.fileName}</span>
                <span>${r.message}</span>
            </div>`;
        });
        html += '</div>';
    }
    
    resultDiv.innerHTML = html;
    
    // 3秒后自动隐藏结果
    setTimeout(() => {
        resultDiv.innerHTML = '';
    }, 5000);
}

// 批量导入功能（支持Excel和CSV）
function handleExcelUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();
    
    if (fileName.endsWith('.csv')) {
        // 处理CSV文件
        handleCsvUpload(file);
    } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
        // 处理Excel文件
        handleXlsxUpload(file);
    } else {
        alert('不支持的文件格式！请上传Excel(.xlsx/.xls)或CSV(.csv)文件');
    }
}

// 处理CSV文件上传（支持多种编码和分隔符）
function handleCsvUpload(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            // 获取原始字节，支持多种编码
            const arrayBuffer = e.target.result;
            
            // 检测并移除BOM
            let csvText = decodeCsv(arrayBuffer);
            
            const parsedData = parseCsvToOutline(csvText, currentSubject);
            
            if (parsedData) {
                mergeOutlineData(parsedData);
                console.log('CSV导入后大纲数据:', JSON.stringify(outlineData[currentSubject], null, 2));
                updateUI();
                
                let totalLessons = 0;
                for (const level in parsedData.lessons) {
                    totalLessons += Object.keys(parsedData.lessons[level]).length;
                }
                
                // 保存数据到本地存储
                saveToStorage();
                
                alert(`CSV导入成功！共导入 ${totalLessons} 个讲次\n\n提示：导入后请检查图片匹配情况，可通过下拉框手动调整`);
            }
        } catch (error) {
            console.error('CSV解析失败:', error);
            alert('CSV文件解析失败，请检查文件格式！');
        }
    };
    reader.readAsArrayBuffer(file);
}

// 处理Excel文件上传
function handleXlsxUpload(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            
            const parsedData = parseExcelToOutline(workbook, currentSubject);
            
            if (parsedData) {
                mergeOutlineData(parsedData);
                console.log('Excel导入后大纲数据:', JSON.stringify(outlineData[currentSubject], null, 2));
                updateUI();
                
                let totalLessons = 0;
                for (const level in parsedData.lessons) {
                    totalLessons += Object.keys(parsedData.lessons[level]).length;
                }
                
                // 保存数据到本地存储
                saveToStorage();
                
                alert(`Excel导入成功！共导入 ${totalLessons} 个讲次\n\n提示：导入后请检查图片匹配情况，可通过下拉框手动调整`);
            }
        } catch (error) {
            console.error('Excel解析失败:', error);
            alert('Excel文件解析失败，请检查文件格式！');
        }
    };
    reader.readAsArrayBuffer(file);
}

// CSV编码解码函数（支持UTF-8和GBK）
function decodeCsv(arrayBuffer) {
    const bytes = new Uint8Array(arrayBuffer);
    
    // 检测BOM
    const hasBom = bytes.length >= 3 && bytes[0] === 0xEF && bytes[1] === 0xBB && bytes[2] === 0xBF;
    const start = hasBom ? 3 : 0;
    
    // 尝试UTF-8解码
    try {
        const decoder = new TextDecoder('utf-8', { fatal: true });
        const text = decoder.decode(bytes.subarray(start));
        return text;
    } catch (e) {
        // UTF-8解码失败，尝试GBK
        try {
            const decoder = new TextDecoder('gbk');
            const text = decoder.decode(bytes.subarray(start));
            return text;
        } catch (e2) {
            // 最后尝试ISO-8859-1
            const decoder = new TextDecoder('iso-8859-1');
            return decoder.decode(bytes.subarray(start));
        }
    }
}

// 解析CSV为大纲格式
function parseCsvToOutline(csvText, subject) {
    const result = {
        subject: subject === 'math' ? '数学' : '语文',
        levels: ['L1', 'L2', 'L3', 'L4'],
        lessons: {}
    };
    
    // 规范化换行符（CRLF -> LF）
    csvText = csvText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    
    // 解析CSV，过滤空行和无效行
    const lines = csvText.split('\n').filter(line => {
        const trimmed = line.trim();
        return trimmed && !trimmed.startsWith('#') && !trimmed.startsWith('//');
    });
    
    console.log('CSV总行数:', lines.length);
    
    if (lines.length < 2) {
        throw new Error('CSV文件格式不正确或没有数据');
    }
    
    // 最大行数限制（避免解析异常）
    const maxRows = 100;
    if (lines.length - 1 > maxRows) {
        throw new Error(`数据行数超过限制！最大支持${maxRows}行数据，当前文件有${lines.length - 1}行`);
    }
    
    // 解析表头（先尝试逗号分隔）
    let headers = parseCsvLine(lines[0]);
    let delimiter = ',';
    console.log('CSV表头(逗号分隔):', headers);
    
    // 如果表头列数太少，尝试分号分隔
    if (headers.length < 3) {
        headers = parseCsvLine(lines[0], ';');
        delimiter = ';';
        console.log('CSV表头(分号分隔):', headers);
    }
    
    // 查找关键列索引
    const levelIndex = headers.findIndex(h => h && (h.includes('级别') || h.includes('Level') || h.includes('等级')));
    const lessonIndex = headers.findIndex(h => h && (h.includes('讲次') || h.includes('课程') || h.includes('Lesson')));
    const titleIndex = headers.findIndex(h => h && (h.includes('标题') || h.includes('主题') || h.includes('Title')));
    const keyPointsIndex = headers.findIndex(h => h && (h.includes('重点') || h.includes('知识点') || h.includes('KeyPoints')));
    const summaryIndex = headers.findIndex(h => h && (h.includes('总结') || h.includes('内容') || h.includes('Summary')));
    const imageIndex = headers.findIndex(h => h && (h.includes('图片') || h.includes('Image')));
    
    console.log('CSV列索引 - 级别:', levelIndex, '讲次:', lessonIndex, '标题:', titleIndex, '重点:', keyPointsIndex, '总结:', summaryIndex, '图片:', imageIndex);
    
    // 解析每一行数据
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        const row = parseCsvLine(line, delimiter);
        
        if (!row || row.length === 0) continue;
        
        console.log(`CSV第${i}行数据:`, row);
        
        let level = levelIndex >= 0 ? (row[levelIndex] || 'L1') : 'L1';
        level = level.toString().toUpperCase();
        if (!level.startsWith('L')) {
            level = 'L' + level.replace(/[^0-9]/g, '');
        }
        if (!level.match(/^L[1-4]$/)) {
            level = 'L1';
        }
        
        let lesson = lessonIndex >= 0 ? (row[lessonIndex] || i.toString()) : i.toString();
        lesson = lesson.toString().replace(/[^0-9]/g, '') || i.toString();
        
        // 强制讲次编号在1-5范围内
        let lessonNum = parseInt(lesson);
        if (isNaN(lessonNum) || lessonNum < 1 || lessonNum > 5) {
            // 如果讲次无效，使用当前已有的讲次数量+1
            if (!result.lessons[level]) {
                result.lessons[level] = {};
            }
            lessonNum = Object.keys(result.lessons[level]).length + 1;
        }
        lesson = lessonNum.toString();
        
        const title = titleIndex >= 0 ? (row[titleIndex] || '') : '';
        
        // 验证：每个级别最多5个讲次
        if (!result.lessons[level]) {
            result.lessons[level] = {};
        }
        const currentCount = Object.keys(result.lessons[level]).length;
        if (currentCount >= 5) {
            console.log(`跳过行 ${i}: ${level}级别已达到最大5个讲次限制`);
            continue;
        }
        
        const keyPoints = keyPointsIndex >= 0 ? parseKeyPoints(row[keyPointsIndex]) : [];
        const summary = summaryIndex >= 0 ? (row[summaryIndex] || '') : '';
        const image = imageIndex >= 0 ? (row[imageIndex] || `${subject === 'math' ? '数学' : '语文'}-${level}-第${lesson}讲.png`) : `${subject === 'math' ? '数学' : '语文'}-${level}-第${lesson}讲.png`;
        
        let lessonKey = lesson.toString();
        let counter = 1;
        while (result.lessons[level][lessonKey]) {
            lessonKey = `${lesson.toString()}-${counter}`;
            counter++;
        }
        
        result.lessons[level][lessonKey] = {
            title: title || `第${lesson}讲`,
            keyPoints: keyPoints,
            summary: summary,
            image: image
        };
    }
    
    // 输出解析结果汇总
    console.log('=== CSV解析结果汇总 ===');
    console.log('各级别讲次数:', JSON.stringify(result.lessons, null, 2));
    const total = Object.keys(result.lessons).reduce((acc, level) => {
        const count = Object.keys(result.lessons[level]).length;
        console.log(`${level}: ${count}个讲次`);
        return acc + count;
    }, 0);
    console.log(`总计: ${total}个讲次`);
    
    return result;
}

// 解析CSV行（处理带引号的字段）
function parseCsvLine(line, delimiter = ',') {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
            if (inQuotes && line[i + 1] === '"') {
                current += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === delimiter && !inQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    
    result.push(current.trim());
    return result;
}

// 合并导入的大纲数据（完全覆盖）
function mergeOutlineData(newData) {
    if (!outlineData[currentSubject].lessons) {
        outlineData[currentSubject].lessons = {};
    }
    
    for (const level in newData.lessons) {
        if (!outlineData[currentSubject].lessons[level]) {
            outlineData[currentSubject].lessons[level] = {};
        }
        
        for (const lesson in newData.lessons[level]) {
            // 完全覆盖：使用新数据替换旧数据
            const importedLesson = newData.lessons[level][lesson];
            
            // 尝试智能匹配图片（包括新上传的图片）
            importedLesson.image = findMatchingImage(importedLesson, level, lesson);
            
            // 完全覆盖旧数据
            outlineData[currentSubject].lessons[level][lesson] = importedLesson;
        }
    }
}

// 智能匹配图片
function findMatchingImage(lessonData, level, lessonNum) {
    const subjectPrefix = currentSubject === 'math' ? '数学' : '语文';
    
    // 可能的图片文件名模式
    const possibleNames = [
        `${subjectPrefix}-${level}-第${lessonNum}讲.png`,
        `${subjectPrefix}-${level}-${lessonNum}.png`,
        `${subjectPrefix}-第${lessonNum}讲.png`,
        `${subjectPrefix}${level}${lessonNum}.png`,
        `${subjectPrefix}${lessonNum}.png`,
        `${subjectPrefix}-${level}.png`
    ];
    
    // 查找匹配的图片
    for (const name of possibleNames) {
        if (imagesList.includes(name)) {
            return name;
        }
    }
    
    // 如果有任何当前科目的图片，返回第一个
    const subjectImages = imagesList.filter(img => img.startsWith(subjectPrefix));
    if (subjectImages.length > 0) {
        // 尝试查找同级别优先的图片
        const levelImages = subjectImages.filter(img => img.includes(`-${level}-`));
        if (levelImages.length > 0) {
            return levelImages[0];
        }
        return subjectImages[0];
    }
    
    // 返回默认文件名
    return `${subjectPrefix}-${level}-第${lessonNum}讲.png`;
}

// 解析Excel为大纲格式
function parseExcelToOutline(workbook, subject) {
    const result = {
        subject: subject === 'math' ? '数学' : '语文',
        levels: ['L1', 'L2', 'L3', 'L4'],
        lessons: {}
    };
    
    // 获取第一个工作表
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // 转换为JSON数组
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    if (jsonData.length < 2) {
        throw new Error('Excel文件格式不正确');
    }
    
    // 解析表头
    const headers = jsonData[0];
    
    // 查找关键列索引
    const levelIndex = headers.findIndex(h => h && (h.includes('级别') || h.includes('Level') || h.includes('等级')));
    const lessonIndex = headers.findIndex(h => h && (h.includes('讲次') || h.includes('课程') || h.includes('Lesson')));
    const titleIndex = headers.findIndex(h => h && (h.includes('标题') || h.includes('主题') || h.includes('Title')));
    const keyPointsIndex = headers.findIndex(h => h && (h.includes('重点') || h.includes('知识点') || h.includes('KeyPoints')));
    const summaryIndex = headers.findIndex(h => h && (h.includes('总结') || h.includes('内容') || h.includes('Summary')));
    const imageIndex = headers.findIndex(h => h && (h.includes('图片') || h.includes('Image')));
    
    // 输出调试日志
    console.log('表头:', headers);
    console.log('列索引 - 级别:', levelIndex, '讲次:', lessonIndex, '标题:', titleIndex, '重点:', keyPointsIndex, '总结:', summaryIndex, '图片:', imageIndex);
    
    // 解析每一行数据
    for (let i = 1; i < jsonData.length; i++) {
        const row = jsonData[i];
        if (!row || row.length === 0) continue;
        
        // 输出每一行的原始数据用于调试
        console.log(`第${i}行原始数据:`, row);
        
        let level = levelIndex >= 0 ? (row[levelIndex] || 'L1') : 'L1';
        // 确保级别格式统一为 L1, L2, L3, L4
        level = level.toString().toUpperCase();
        if (!level.startsWith('L')) {
            level = 'L' + level.replace(/[^0-9]/g, '');
        }
        if (!level.match(/^L[1-4]$/)) {
            level = 'L1';
        }
        
        let lesson = lessonIndex >= 0 ? (row[lessonIndex] || i.toString()) : i.toString();
        // 确保讲次编号只包含数字
        lesson = lesson.toString().replace(/[^0-9]/g, '') || i.toString();
        const title = titleIndex >= 0 ? (row[titleIndex] || `第${lesson}讲`) : `第${lesson}讲`;
        const keyPoints = keyPointsIndex >= 0 ? parseKeyPoints(row[keyPointsIndex]) : [];
        const summary = summaryIndex >= 0 ? (row[summaryIndex] || '') : '';
        const image = imageIndex >= 0 ? (row[imageIndex] || `${subject === 'math' ? '数学' : '语文'}-${level}-第${lesson}讲.png`) : `${subject === 'math' ? '数学' : '语文'}-${level}-第${lesson}讲.png`;
        
        // 初始化级别数据
        if (!result.lessons[level]) {
            result.lessons[level] = {};
        }
        
        // 处理重复讲次编号的情况：添加唯一后缀
        let lessonKey = lesson.toString();
        let counter = 1;
        while (result.lessons[level][lessonKey]) {
            lessonKey = `${lesson.toString()}-${counter}`;
            counter++;
        }
        
        // 输出调试日志
        console.log(`解析第${i}行: 级别=${level}, 讲次=${lesson}, 标题=${title}, 存储键=${lessonKey}`);
        
        // 存储课程数据
        result.lessons[level][lessonKey] = {
            title: title,
            keyPoints: keyPoints,
            summary: summary,
            image: image
        };
    }
    
    return result;
}

// 解析知识点字符串
function parseKeyPoints(keyPointsStr) {
    if (!keyPointsStr) return [];
    
    let points = [];
    if (typeof keyPointsStr === 'string') {
        // 尝试多种分隔符
        if (keyPointsStr.includes(',')) {
            points = keyPointsStr.split(',').map(p => p.trim()).filter(p => p);
        } else if (keyPointsStr.includes(';')) {
            points = keyPointsStr.split(';').map(p => p.trim()).filter(p => p);
        } else if (keyPointsStr.includes('\n')) {
            points = keyPointsStr.split('\n').map(p => p.trim()).filter(p => p);
        } else if (keyPointsStr.includes('、')) {
            points = keyPointsStr.split('、').map(p => p.trim()).filter(p => p);
        } else {
            points = [keyPointsStr.trim()];
        }
    } else if (Array.isArray(keyPointsStr)) {
        points = keyPointsStr;
    }
    
    return points;
}

function renderVersions() {
    const list = document.getElementById('versions-list');
    const history = versionHistory?.history || [];
    if (history.length === 0) {
        list.innerHTML = '<p style="text-align: center; color: #666;">暂无版本记录</p>';
        return;
    }
    list.innerHTML = history.map(v => `
        <div class="version-card">
            <div class="version-header">
                <span class="version-tag">${v.version}</span>
                <span class="version-date">${v.date}</span>
            </div>
            <div class="version-info">
                <span class="subject-badge">${v.subject === 'both' ? '数学 + 语文' : (v.subject === 'math' ? '数学' : '语文')}</span>
                <p class="version-description">${v.description}</p>
            </div>
        </div>
    `).join('');
}

function login() {
    const password = document.getElementById('password-input').value;
    
    // 获取有效密码（优先使用配置中的密码，否则使用默认密码）
    let validPassword = 'admin123'; // 默认密码
    try {
        if (configData && configData.developerPassword) {
            validPassword = configData.developerPassword;
        }
    } catch (e) {
        console.log('获取配置密码失败，使用默认密码');
    }
    
    // 备用密码：88888888（可用于重置密码，不受配置影响）
    if (password === validPassword || password === '88888888') {
        document.getElementById('login-page').style.display = 'none';
        document.getElementById('developer-system').style.display = 'flex';
        document.getElementById('error-message').textContent = '';
    } else {
        document.getElementById('error-message').textContent = '密码错误，请重试';
    }
}

function checkEnter(event) {
    if (event.key === 'Enter') {
        login();
    }
}

function logout() {
    document.getElementById('login-page').style.display = 'flex';
    document.getElementById('developer-system').style.display = 'none';
    document.getElementById('password-input').value = '';
    document.getElementById('error-message').textContent = '';
}

function saveOutline() {
    const title = document.getElementById('lesson-title').value;
    const keyPoints = document.getElementById('key-points').value.split('\n').filter(kp => kp.trim());
    const summary = document.getElementById('lesson-summary').value;
    const image = document.getElementById('image-select').value;

    if (!outlineData[currentSubject]?.lessons?.[currentLevel]) {
        if (!outlineData[currentSubject]) {
            outlineData[currentSubject] = { lessons: {} };
        }
        if (!outlineData[currentSubject].lessons) {
            outlineData[currentSubject].lessons = {};
        }
        outlineData[currentSubject].lessons[currentLevel] = {};
    }

    outlineData[currentSubject].lessons[currentLevel][currentLesson] = {
        title,
        keyPoints,
        summary,
        image
    };

    saveOutlineToFile();
    alert('当前讲次已保存！');
}

async function saveOutlineToFile() {
    const fileName = currentSubject === 'math' ? 'math_outline.json' : 'chinese_outline.json';
    try {
        await fetch(fileName, {
            method: 'PUT',
            body: JSON.stringify(outlineData[currentSubject], null, 2),
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (e) {
        console.log('保存到文件失败（前端模拟）');
    }
}

function openPublishModal() {
    document.getElementById('publish-modal').style.display = 'flex';
}

function closePublishModal() {
    document.getElementById('publish-modal').style.display = 'none';
}

function publishChanges() {
    openPublishModal();
}

async function confirmPublish() {
    const description = document.getElementById('version-description').value;
    const updateMath = document.getElementById('update-math').checked;
    const updateChinese = document.getElementById('update-chinese').checked;

    const newVersion = incrementVersion(configData.currentVersion || 'v1.0.0');
    const now = new Date();
    const dateStr = now.toLocaleString('zh-CN');

    console.log('开始发布版本:', newVersion);

    try {
        // 发布数据到云开发数据库或后端
        if (cloudbaseApp) {
            try {
                console.log('正在发布到云开发数据库...');
                const db = cloudbaseApp.database();
                
                // 保存大纲数据
                if (updateMath || updateChinese) {
                    const outlineRes = await db.collection('outlines').get();
                    if (outlineRes.data.length > 0) {
                        await db.collection('outlines').doc(outlineRes.data[0]._id).update(outlineData);
                    } else {
                        await db.collection('outlines').add(outlineData);
                    }
                    console.log('大纲数据已发布到云开发数据库');
                }

                // 保存版本记录
                const newVersionItem = {
                    version: newVersion,
                    date: dateStr,
                    description: description || '未填写更新说明',
                    updateMath: updateMath,
                    updateChinese: updateChinese,
                    timestamp: new Date().toISOString()
                };
                
                const versionsRes = await db.collection('versions').get();
                if (versionsRes.data.length > 0) {
                    const existingVersions = versionsRes.data[0];
                    existingVersions.history = existingVersions.history || [];
                    existingVersions.history.unshift(newVersionItem);
                    await db.collection('versions').doc(versionsRes.data[0]._id).update(existingVersions);
                    versionHistory = existingVersions;
                } else {
                    const newVersions = { history: [newVersionItem] };
                    await db.collection('versions').add(newVersions);
                    versionHistory = newVersions;
                }
                console.log('版本记录已发布到云开发数据库');

                // 更新配置
                configData.currentVersion = newVersion;
                configData.lastPublishTime = dateStr;
                
                const configRes = await db.collection('config').get();
                if (configRes.data.length > 0) {
                    await db.collection('config').doc(configRes.data[0]._id).update(configData);
                } else {
                    await db.collection('config').add(configData);
                }
                console.log('配置已更新到云开发数据库');
            } catch (e) {
                console.error('发布到云开发数据库失败:', e.message);
            }
        } else {
            // 使用后端API（仅本地开发环境）
            if (API_BASE_URL) {
                if (updateMath || updateChinese) {
                    const response = await fetch(`${API_BASE_URL}/outline`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(outlineData)
                    });
                    
                    if (response.ok) {
                        console.log('大纲数据已发布到后端');
                    } else {
                        console.error('发布大纲数据失败');
                    }
                }

                const versionResponse = await fetch(`${API_BASE_URL}/version`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        version: newVersion,
                        description: description || '未填写更新说明',
                        updateMath: updateMath,
                        updateChinese: updateChinese
                    })
                });

                if (versionResponse.ok) {
                    const result = await versionResponse.json();
                    versionHistory = result.versionHistory;
                    console.log('版本记录已发布到后端');
                }

                configData.currentVersion = newVersion;
                configData.lastPublishTime = dateStr;
                
                const configResponse = await fetch(`${API_BASE_URL}/config`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(configData)
                });

                if (configResponse.ok) {
                    console.log('配置已更新到后端');
                }
            }
        }

        // 同步到本地缓存
        saveToStorage();

        document.getElementById('current-version').textContent = newVersion;
        renderVersions();
        closePublishModal();
        
        alert(`版本 ${newVersion} 已发布到服务器！\n老师端刷新页面即可获取最新数据。`);
    } catch (e) {
        console.error('发布失败:', e);
        alert('发布失败，请检查后端服务器是否启动！');
    }
}

function incrementVersion(version) {
    const parts = version.replace('v', '').split('.');
    parts[2] = String(parseInt(parts[2]) + 1);
    return 'v' + parts.join('.');
}

async function updateConfigFile() {
    try {
        // 更新配置到后端（仅本地开发环境）
        if (API_BASE_URL) {
            await fetch(`${API_BASE_URL}/config`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(configData)
            });
        }
    } catch (e) {
        console.log('保存配置失败（前端模拟）');
    }
}

async function saveVersionHistory() {
    try {
        await fetch('version_history.json', {
            method: 'PUT',
            body: JSON.stringify(versionHistory, null, 2),
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (e) {
        console.log('保存版本历史失败（前端模拟）');
    }
}

function saveSettings() {
    const password = document.getElementById('dev-password').value;
    const teacherName = document.getElementById('default-teacher-name').value;
    const teacherAvatar = document.getElementById('default-teacher-avatar').value;

    if (password) {
        configData.developerPassword = password;
    }
    if (teacherName) {
        configData.teacherName = teacherName;
    }
    if (teacherAvatar) {
        configData.teacherAvatar = teacherAvatar;
    }

    updateConfigFile();
    alert('设置已保存！');
}

async function handleAvatarUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (cloudbaseApp) {
        try {
            console.log('正在使用云开发存储上传头像...');
            const storage = cloudbaseApp.storage();
            
            const fileName = `avatar_${Date.now()}_${file.name}`;
            const result = await storage.uploadFile({
                cloudPath: fileName,
                filePath: file,
                onUploadProgress: (progress) => {
                    console.log(`上传进度: ${progress}`);
                }
            });
            
            const fileUrl = await storage.getFileURL({
                fileID: result.fileID
            });
            
            document.getElementById('default-teacher-avatar').value = fileName;
            document.getElementById('avatar-preview').src = fileUrl.fileList[0].tempFileURL;
            document.getElementById('avatar-preview').style.display = 'block';
            configData.teacherAvatar = fileName;
            alert('头像上传成功！');
            
        } catch (error) {
            console.error('云开发存储上传失败:', error);
            // 尝试备用方案：保存为base64
            try {
                console.log('尝试使用base64方式保存头像...');
                await saveAvatarAsBase64(file);
                alert('头像上传成功（备用方案）！');
            } catch (base64Error) {
                console.error('头像base64保存也失败:', base64Error);
                alert('头像上传失败：' + error.message + '\n请检查云开发配置或稍后重试');
            }
        }
    } else {
        // 本地开发环境
        const reader = new FileReader();
        reader.onload = function(e) {
            const fileName = `avatar_${Date.now()}_${file.name}`;
            document.getElementById('default-teacher-avatar').value = fileName;
            document.getElementById('avatar-preview').src = e.target.result;
            document.getElementById('avatar-preview').style.display = 'block';
            configData.teacherAvatar = fileName;
            alert('头像上传成功（本地预览）！');
        };
        reader.readAsDataURL(file);
    }
}

// 备用方案：将头像转为base64保存
async function saveAvatarAsBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const base64Data = e.target.result;
                const fileName = `avatar_${Date.now()}_${file.name}`;
                
                // 保存到配置数据
                document.getElementById('default-teacher-avatar').value = fileName;
                document.getElementById('avatar-preview').src = base64Data;
                document.getElementById('avatar-preview').style.display = 'block';
                configData.teacherAvatar = fileName;
                
                // 保存到本地存储
                localStorage.setItem('teacherAvatarData', JSON.stringify({ fileName, base64Data }));
                
                // 尝试保存到数据库
                if (cloudbaseApp) {
                    try {
                        const db = cloudbaseApp.database();
                        await db.collection('config').get().then(async (res) => {
                            if (res.data.length > 0) {
                                await db.collection('config').doc(res.data[0]._id).update({
                                    teacherAvatar: fileName,
                                    teacherAvatarBase64: base64Data
                                });
                            }
                        });
                    } catch (dbError) {
                        console.log('头像数据库保存失败，仅保存到本地:', dbError);
                    }
                }
                
                resolve();
            } catch (error) {
                reject(error);
            }
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function showSection(sectionId) {
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');
    
    document.querySelectorAll('.section-content').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(`section-${sectionId}`).style.display = 'block';
}

function bindEventListeners() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            showSection(btn.dataset.section);
        });
    });

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentSubject = this.dataset.subject;
            updateUI();
        });
    });

    document.querySelectorAll('.level-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.level-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentLevel = this.dataset.level;
            updateUI();
        });
    });

    const lessonTabs = document.querySelector('.lesson-tabs');
    if (lessonTabs) {
        lessonTabs.addEventListener('click', handleLessonButtonClick);
    }

    const imageSelect = document.getElementById('image-select');
    if (imageSelect) {
        imageSelect.addEventListener('change', updateImagePreview);
    }

    const excelUpload = document.getElementById('excel-upload');
    if (excelUpload) {
        excelUpload.addEventListener('change', handleExcelUpload);
    }

    const imagesUpload = document.getElementById('images-upload');
    if (imagesUpload) {
        imagesUpload.addEventListener('change', handleImagesUpload);
    }

    const imagesGridUpload = document.getElementById('images-grid-upload');
    if (imagesGridUpload) {
        imagesGridUpload.addEventListener('change', handleImagesUpload);
    }

    const teacherAvatarUpload = document.getElementById('teacher-avatar-upload');
    if (teacherAvatarUpload) {
        teacherAvatarUpload.addEventListener('change', handleAvatarUpload);
    }

    window.onclick = (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    };
}

document.addEventListener('DOMContentLoaded', function() {
    bindEventListeners();
    init();
});

window.addEventListener('load', function() {
    bindEventListeners();
    init();
});

// 触发图片上传（用于重点图片管理区域的上传按钮）
function triggerImagesUpload() {
    document.getElementById('images-grid-upload').click();
}

// 备用方案：将图片转为base64保存
async function saveImageAsBase64(file, fileName) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const base64Data = e.target.result;
                
                // 保存到本地存储（作为临时方案）
                const savedImages = localStorage.getItem('uploadedImages') || '{}';
                const imagesObj = JSON.parse(savedImages);
                imagesObj[fileName] = base64Data;
                localStorage.setItem('uploadedImages', JSON.stringify(imagesObj));
                
                // 尝试保存到数据库
                if (cloudbaseApp) {
                    try {
                        const db = cloudbaseApp.database();
                        const result = await db.collection('images').add({
                            fileName: fileName,
                            base64Data: base64Data,
                            uploadTime: new Date().toISOString()
                        });
                        console.log(`图片 ${fileName} 已保存到数据库，ID: ${result._id}`);
                    } catch (dbError) {
                        console.log(`图片 ${fileName} 数据库保存失败，仅保存到本地存储:`, dbError);
                    }
                }
                
                resolve(base64Data); // 返回base64 URL
            } catch (error) {
                reject(error);
            }
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}
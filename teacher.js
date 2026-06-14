let currentSubject = 'math';
let currentLevel = 'L1';
let currentMode = 'single';
let uploadedFiles = [];
let studentData = {};
let outlineData = {};
let commentsData = {};
let configData = {};
let allReportCards = [];
let teacherAvatarDataURL = '';
let originalAvatarImage = null;
window.useShortName = false; // 是否只取学员名称的后两个字

// 图片文件名解析相关全局变量
let availableImages = []; // 存储所有可用图片
let selectedImages = []; // 存储用户选择的图片
let imageSelectionMode = 'auto'; // 图片选择模式：auto或manual

// 图片文件名解析函数
function parseImageName(filename) {
    // 匹配格式：学科-级别-讲次.扩展名
    // 例如：数学-L1-第1讲.png、语文-L2-第三讲.jpg
    // 支持阿拉伯数字（第2讲）和中文数字（第二讲）
    
    // 中文数字转阿拉伯数字
    const chineseToNumber = {
        '一': 1, '二': 2, '三': 3, '四': 4, '五': 5,
        '六': 6, '七': 7, '八': 8, '九': 9, '十': 10
    };
    
    const parseChineseNumber = (str) => {
        if (str === '十') return 10;
        let result = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str[i];
            if (chineseToNumber[char] !== undefined) {
                if (char === '十') {
                    result = result === 0 ? 10 : result * 10;
                } else {
                    result = result * 10 + chineseToNumber[char];
                }
            }
        }
        return result;
    };
    
    // 尝试匹配阿拉伯数字格式：数学-L1-第1讲.png
    const arabicPattern = /^(数学|语文)-L(\d)-第(\d+)讲\.(png|jpg|jpeg|gif)$/i;
    const arabicMatch = filename.match(arabicPattern);
    if (arabicMatch) {
        return {
            subject: arabicMatch[1],
            level: `L${arabicMatch[2]}`,
            lecture: parseInt(arabicMatch[3]),
            extension: arabicMatch[4].toLowerCase()
        };
    }
    
    // 尝试匹配中文数字格式：数学-L1-第二讲.png
    const chinesePattern = /^(数学|语文)-L(\d)-第([一二三四五六七八九十]+)讲\.(png|jpg|jpeg|gif)$/i;
    const chineseMatch = filename.match(chinesePattern);
    if (chineseMatch) {
        return {
            subject: chineseMatch[1],
            level: `L${chineseMatch[2]}`,
            lecture: parseChineseNumber(chineseMatch[3]),
            extension: chineseMatch[4].toLowerCase()
        };
    }
    
    return null;
}

// 加载images文件夹中的所有可用图片
async function loadAvailableImages() {
    try {
        // 由于浏览器无法直接读取文件夹，我们使用已知图片名称的方式
        // 或者通过后端API获取
        availableImages = [];
        
        // 尝试从服务器获取图片列表
        try {
            const response = await fetch(`${API_BASE_URL}/images`);
            if (response.ok) {
                const images = await response.json();
                images.forEach(filename => {
                    const parsed = parseImageName(filename);
                    if (parsed) {
                        availableImages.push({
                            filename: filename,
                            src: `images/${filename}`,
                            subject: parsed.subject,
                            level: parsed.level,
                            lecture: parsed.lecture,
                            selected: false
                        });
                    }
                });
            }
        } catch (e) {
            console.log('后端API不可用，尝试扫描静态图片');
        }
        
        // 如果后端不可用，使用预定义的常见图片名称
        if (availableImages.length === 0) {
            const subjects = ['数学', '语文'];
            const levels = ['L1', 'L2', 'L3', 'L4'];
            
            // 定义每个讲次的扩展名映射
            const extensionMap = {
                '数学': {
                    'L1': ['png', 'png', 'png', 'png', 'png'],
                    'L2': ['png', 'png', 'png', 'png', 'png'],
                    'L3': ['png', 'png', 'png', 'png', 'png'], // 第3讲使用png占位
                    'L4': ['png', 'png', 'png', 'png', 'png']
                },
                '语文': {
                    'L1': ['png', 'jpg', 'png', 'jpg', 'jpg'],
                    'L2': ['jpg', 'jpg', 'jpg', 'jpg', 'jpg'],
                    'L3': ['png', 'png', 'png', 'png', 'png'],
                    'L4': ['png', 'png', 'png', 'jpg', 'jpg']
                }
            };
            
            subjects.forEach(subject => {
                levels.forEach(level => {
                    const extensions = extensionMap[subject][level] || ['png', 'png', 'png', 'png', 'png'];
                    for (let i = 1; i <= 5; i++) {
                        const ext = extensions[i - 1] || 'png';
                        const filename = `${subject}-${level}-第${i}讲.${ext}`;
                        availableImages.push({
                            filename: filename,
                            src: `images/${filename}`,
                            subject: subject,
                            level: level,
                            lecture: i,
                            selected: false
                        });
                    }
                });
            });
        }
        
        console.log('可用图片加载完成:', availableImages.length, '张');
        return availableImages;
    } catch (error) {
        console.error('加载可用图片失败:', error);
        return [];
    }
}

// 根据学科和级别过滤可用图片
function filterImagesBySubjectLevel(subject, level) {
    return availableImages.filter(img => {
        const subjectMatch = subject === 'math' ? img.subject === '数学' : img.subject === '语文';
        return subjectMatch && img.level === level;
    });
}

// 获取当前要显示的图片
function getSelectedImages() {
    if (imageSelectionMode === 'manual') {
        // 手动模式：返回用户选择的图片
        return availableImages.filter(img => img.selected);
    } else {
        // 自动模式：根据currentSubject和currentLevel自动过滤
        // 只返回用户选中的图片，如果没有选中任何图片则返回空数组
        const filtered = filterImagesBySubjectLevel(currentSubject, currentLevel);
        const selected = filtered.filter(img => img.selected);
        return selected;
    }
}

// 设置图片选择模式
function setImageSelectionMode(mode) {
    imageSelectionMode = mode;
    // 更新按钮状态
    document.querySelectorAll('.mode-selector .mode-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === mode);
    });
    // 更新容器样式
    const container = document.getElementById('image-selector-container');
    if (container) {
        container.classList.toggle('auto-mode', mode === 'auto');
    }
    // 重新渲染图片列表
    renderImageSelectorList();
    // 保存偏好
    saveImageSelectionPreference();
}

// 渲染图片选择器列表
function renderImageSelectorList() {
    const listContainer = document.getElementById('image-selector-list');
    const countDisplay = document.getElementById('selected-count');
    if (!listContainer) return;
    
    let images = [];
    // 无论是自动模式还是手动模式，都只显示当前学科和级别的图片
    images = filterImagesBySubjectLevel(currentSubject, currentLevel);
    
    if (images.length === 0) {
        listContainer.innerHTML = '<p style="text-align: center; color: #888; padding: 20px;">暂无可选图片</p>';
        if (countDisplay) {
            countDisplay.textContent = '已选择 0/0 张图片';
        }
        return;
    }
    
    listContainer.innerHTML = images.map((img, index) => `
        <div class="image-selector-item ${img.selected ? 'selected' : ''}" 
             onclick="toggleImageSelection('${img.filename}', ${index})">
            <input type="checkbox" ${img.selected ? 'checked' : ''} 
                   onclick="event.stopPropagation(); toggleImageSelection('${img.filename}', ${index})">
            <img src="${img.src}" alt="${img.filename}" class="image-preview" 
                 onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'40\\' height=\\'40\\'%3E%3Crect fill=\\'%23f0f0f0\\' width=\\'40\\' height=\\'40\\' rx=\\'4\\'/%3E%3Ctext x=\\'50%25\\' y=\\'50%25\\' text-anchor=\\'middle\\' dy=\\'.3em\\' fill=\\'%23999\\' font-size=\\'12\\'%3E${img.subject}${img.level}%3C/text%3E%3C/svg%3E'; this.style.background='#f0f0f0'">
            <div class="image-info">
                <div class="image-name">${img.filename}</div>
                <div class="image-meta">${img.subject} ${img.level} 第${img.lecture}讲</div>
            </div>
        </div>
    `).join('');
    
    // 更新计数
    const selectedCount = images.filter(img => img.selected).length;
    if (countDisplay) {
        countDisplay.textContent = `已选择 ${selectedCount}/${images.length} 张图片`;
    }
}

// 切换图片选中状态
function toggleImageSelection(filename, index) {
    const img = availableImages.find(i => i.filename === filename);
    if (img) {
        img.selected = !img.selected;
        renderImageSelectorList();
        saveImageSelectionPreference();
    }
}

// 全选所有图片（只针对当前学科和级别）
function selectAllImages() {
    const images = filterImagesBySubjectLevel(currentSubject, currentLevel);
    images.forEach(img => img.selected = true);
    renderImageSelectorList();
    saveImageSelectionPreference();
}

// 取消全选
function deselectAllImages() {
    const images = filterImagesBySubjectLevel(currentSubject, currentLevel);
    images.forEach(img => img.selected = false);
    renderImageSelectorList();
    saveImageSelectionPreference();
}

// 保存选择偏好到 localStorage
function saveImageSelectionPreference() {
    try {
        localStorage.setItem('imageSelectionMode', imageSelectionMode);
        localStorage.setItem('selectedImages', JSON.stringify(
            availableImages.filter(img => img.selected).map(img => img.filename)
        ));
    } catch (e) {
        console.warn('无法保存图片选择偏好:', e);
    }
}

// 从 localStorage 加载选择偏好
function loadImageSelectionPreference() {
    try {
        const savedImages = localStorage.getItem('selectedImages');
        if (savedImages) {
            const selectedFilenames = JSON.parse(savedImages);
            availableImages.forEach(img => {
                img.selected = selectedFilenames.includes(img.filename);
            });
        }
    } catch (e) {
        console.warn('无法加载图片选择偏好:', e);
    }
}

function getAvatarUrl(avatar) {
    if (!avatar) return '';
    if (avatar.startsWith('data:image/')) {
        return avatar;
    }
    if (avatar.startsWith('http://') || avatar.startsWith('https://')) {
        return avatar;
    }
    if (avatar.startsWith('images/')) {
        return avatar;
    }
    if (avatar.startsWith('avatar_')) {
        return `images/${avatar}`;
    }
    return `images/${avatar}`;
}

// 图片上传相关函数
let pendingImages = [];

function showImageUploadModal() {
    document.getElementById('image-upload-modal').style.display = 'block';
}

function closeImageUploadModal() {
    document.getElementById('image-upload-modal').style.display = 'none';
    pendingImages = [];
    document.getElementById('uploaded-images-preview').innerHTML = '';
    document.getElementById('image-file').value = '';
}

function handleImageFileUpload(event) {
    const files = Array.from(event.target.files);
    files.forEach(file => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imageData = {
                file: file,
                name: file.name,
                preview: e.target.result
            };
            pendingImages.push(imageData);
            renderPendingImages();
        };
        reader.readAsDataURL(file);
    });
}

function renderPendingImages() {
    const container = document.getElementById('uploaded-images-preview');
    if (pendingImages.length === 0) {
        container.innerHTML = '';
        return;
    }
    container.innerHTML = `
        <div class="preview-header">
            <span>待上传图片（${pendingImages.length}张）</span>
        </div>
        <div class="preview-grid">
            ${pendingImages.map((img, index) => `
                <div class="preview-item">
                    <img src="${img.preview}" alt="${img.name}" class="preview-image">
                    <span class="preview-name">${img.name}</span>
                    <button class="remove-preview-btn" onclick="removePendingImage(${index})">×</button>
                </div>
            `).join('')}
        </div>
    `;
}

function removePendingImage(index) {
    pendingImages.splice(index, 1);
    renderPendingImages();
}

async function saveUploadedImages() {
    if (pendingImages.length === 0) {
        alert('请先选择要上传的图片');
        return;
    }
    
    let successCount = 0;
    let failCount = 0;
    
    for (const imageData of pendingImages) {
        try {
            // 本地环境：直接保存到可用图片列表
            const parsed = parseImageName(imageData.name);
            if (parsed) {
                const existingIndex = availableImages.findIndex(
                    img => img.filename === imageData.name
                );
                
                const imageItem = {
                    filename: imageData.name,
                    src: imageData.preview,
                    subject: parsed.subject,
                    level: parsed.level,
                    lecture: parsed.lecture,
                    selected: false
                };
                
                if (existingIndex >= 0) {
                    availableImages[existingIndex] = imageItem;
                } else {
                    availableImages.push(imageItem);
                }
                successCount++;
            } else {
                console.warn(`图片命名不符合规则: ${imageData.name}`);
                failCount++;
            }
        } catch (e) {
            console.error('上传图片失败:', e);
            failCount++;
        }
    }
    
    renderImageSelectorList();
    alert(`上传完成！\n成功: ${successCount} 张\n失败: ${failCount} 张`);
    closeImageUploadModal();
}

let versionHistory = [
    { version: 'v5.0.0', date: '2026-06-13', description: '第五版更新 - 修复图片上传和预览问题' },
    { version: 'v4.0.0', date: '2026-06-10', description: '第四版更新 - 优化报告生成性能' },
    { version: 'v3.0.0', date: '2026-06-08', description: '第三版更新 - 增加总体评语功能' },
    { version: 'v2.0.0', date: '2026-06-07', description: '第二版更新 - 增加学科选择功能' },
    { version: 'v1.0.0', date: '2026-06-06', description: '初始版本 - 创建数学和语文课程大纲' }
];

async function loadVersionHistory() {
    console.log('开始加载版本历史...');
    const select = document.getElementById('version-select');
    if (select) {
        select.innerHTML = '<option value="">选择版本</option>';
        
        // 尝试从后端API获取最新版本历史
        if (API_BASE_URL) {
            try {
                const response = await fetch(`${API_BASE_URL}/version`);
                if (response.ok) {
                    const data = await response.json();
                    if (data.history && data.history.length > 0) {
                        versionHistory = data;
                        console.log('从后端获取到版本历史:', data.history.length, '个版本');
                    }
                }
            } catch (error) {
                console.warn('从后端获取版本历史失败，使用本地缓存:', error);
            }
        }
        
        // 如果没有从后端获取到数据，使用硬编码的默认版本
        const historyList = versionHistory.history || versionHistory;
        
        historyList.forEach(v => {
            const option = document.createElement('option');
            option.value = v.version;
            option.textContent = `${v.version} - ${v.date} - ${v.description || '无说明'}`;
            select.appendChild(option);
        });
    }
    
    console.log('版本历史加载完成，共', (versionHistory.history || versionHistory).length, '个版本');
}

async function selectVersion() {
    const select = document.getElementById('version-select');
    const version = select.value;
    
    if (!version) {
        document.getElementById('version-info').textContent = '当前版本: ' + (configData.currentVersion || 'v1.0.0');
        await loadData();
        return;
    }
    
    try {
        if (API_BASE_URL) {
            const response = await fetch(`${API_BASE_URL}/version/${version}/outline`);
            if (response.ok) {
                const data = await response.json();
                outlineData = data;
                document.getElementById('version-info').textContent = `已切换到版本: ${version}`;
                updateUI();
                alert(`已切换到版本 ${version}，请重新生成报告`);
            } else {
                console.warn(`版本 ${version} 服务器数据不存在，尝试加载本地数据`);
                await loadLocalOutlineData();
                document.getElementById('version-info').textContent = `已切换到版本: ${version}（本地数据）`;
                updateUI();
                alert(`已切换到版本 ${version}，使用本地缓存数据，请重新生成报告`);
            }
        } else {
            await loadLocalOutlineData();
            document.getElementById('version-info').textContent = `已切换到版本: ${version}（本地模式）`;
            updateUI();
            alert(`已切换到版本 ${version}，当前为本地模式，请重新生成报告`);
        }
    } catch (error) {
        console.error('获取版本大纲失败，使用本地数据:', error);
        await loadLocalOutlineData();
        document.getElementById('version-info').textContent = `已切换到版本: ${version}（本地数据）`;
        updateUI();
        alert(`已切换到版本 ${version}，使用本地缓存数据，请重新生成报告`);
    }
}

async function loadLocalOutlineData() {
    try {
        const [mathOutline, chineseOutline] = await Promise.all([
            fetch('math_outline.json').then(r => r.json()),
            fetch('chinese_outline.json').then(r => r.json())
        ]);
        outlineData = { math: mathOutline, chinese: chineseOutline };
        console.log('已加载本地大纲数据');
    } catch (jsonError) {
        console.error('本地JSON大纲加载失败:', jsonError);
        outlineData = {
            math: { subject: '数学', levels: ['L1', 'L2', 'L3', 'L4'], lessons: {} },
            chinese: { subject: '语文', levels: ['L1', 'L2', 'L3', 'L4'], lessons: {} }
        };
    }
}

function searchStudents() {
    const searchTerm = document.getElementById('student-search').value.toLowerCase().trim();
    const reportsContainer = document.getElementById('reports-container');
    const reportCards = reportsContainer.querySelectorAll('.report-image-card');
    
    if (!searchTerm) {
        // 显示所有卡片
        reportCards.forEach(card => {
            card.style.display = 'block';
        });
        return;
    }
    
    // 过滤卡片
    reportCards.forEach(card => {
        const studentName = card.querySelector('h3').textContent.toLowerCase();
        if (studentName.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
    
    // 检查是否有可见卡片
    const visibleCards = reportsContainer.querySelectorAll('.report-image-card[style="display: block;"]');
    if (visibleCards.length === 0) {
        reportsContainer.innerHTML += '<div class="empty-state"><span>🔍</span><p>未找到匹配的学员</p></div>';
    }
}

// 云开发配置
const cloudbaseApp = window.location.origin.includes('localhost') ? null : cloudbase.init({
    env: 'xueqing-system-d2g4d3p65a7bd1e18'
});

// 后端API地址（根据实际部署情况修改）
const API_BASE_URL = window.location.origin.includes('localhost') 
    ? 'http://localhost:3000/api' 
    : '/api';  // 如果部署在同一服务器，使用相对路径

async function init() {
    await loadData();
    updateUI();
    // 加载可用图片
    await loadAvailableImages();
    loadImageSelectionPreference();
    renderImageSelectorList();
}

function toggleShortName() {
    window.useShortName = document.getElementById('use-short-name').checked;
    console.log('学员名称设置:', window.useShortName ? '只取后两个字' : '使用完整名称');
    
    // 如果已经有报告卡片，重新生成
    if (allReportCards.length > 0) {
        renderReportCards();
    }
}

async function loadData() {
    try {
        console.log('✅ 开始加载数据...');
        
        let outline = null;
        let config = null;
        
        // 优先从后端API加载数据（本地模式）
        console.log('正在从后端API加载最新数据...');
        try {
            [outline, config] = await Promise.all([
                fetch(`${API_BASE_URL}/outline`).then(r => r.json()).catch(() => null),
                fetch(`${API_BASE_URL}/config`).then(r => r.json()).catch(() => null)
            ]);
            console.log('后端API加载成功');
        } catch (e) {
            console.log('后端API不可用:', e.message);
        }
        
        // 如果后端API不可用，再尝试从云开发数据库加载数据
        if (!outline || !config) {
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
                    console.log('云开发数据库加载成功');
                } catch (e) {
                    console.log('云开发数据库不可用:', e.message);
                }
            }
        }
        
        if (outline) {
            outlineData = outline;
            console.log('已从后端API加载大纲数据');
            console.log('数学L1数据:', outlineData.math?.lessons?.L1);
            console.log('语文L1数据:', outlineData.chinese?.lessons?.L1);
        } else {
            console.log('后端API不可用，尝试加载静态JSON文件...');
            
            // 后端不可用时，加载静态JSON文件
            try {
                const [mathOutline, chineseOutline] = await Promise.all([
                    fetch('math_outline.json').then(r => r.json()),
                    fetch('chinese_outline.json').then(r => r.json())
                ]);
                outlineData = { math: mathOutline, chinese: chineseOutline };
                console.log('JSON大纲数据加载成功');
            } catch (jsonError) {
                console.error('JSON大纲加载失败:', jsonError);
                outlineData = {
                    math: { subject: '数学', levels: ['L1', 'L2', 'L3', 'L4'], lessons: {} },
                    chinese: { subject: '语文', levels: ['L1', 'L2', 'L3', 'L4'], lessons: {} }
                };
                console.log('使用默认大纲数据');
            }
        }
        
        // 加载配置数据
        if (config) {
            configData = config;
        } else {
            // 后端不可用时，加载静态配置文件
            try {
                configData = await fetch('config.json').then(r => r.json());
            } catch (e) {
                configData = {
                    teacherName: '老师',
                    teacherAvatar: '',
                    currentVersion: 'v1.0.0'
                };
            }
        }
        console.log('配置数据加载成功:', configData);
        
        // 更新版本信息显示
        document.getElementById('version-info').textContent = '当前版本: ' + (configData.currentVersion || 'v1.0.0');
        
        // 加载版本历史
        await loadVersionHistory();
        
        // 加载评语数据
        const comments = await fetch('comments.json').then(r => r.json());
        commentsData = comments;
        console.log('评语数据加载成功:', Object.keys(commentsData));
        
        // 更新UI
        document.getElementById('teacher-name').textContent = configData.teacherName || '老师';
        document.getElementById('teacher-avatar').src = getAvatarUrl(configData.teacherAvatar);
        document.getElementById('teacher-name-input').value = configData.teacherName || '老师';
        document.getElementById('avatar-preview').src = getAvatarUrl(configData.teacherAvatar);
        
        // 如果没有footerText，设置默认值
        if (!configData.footerText) {
            configData.footerText = '学而思 · 让学习更有效';
        }
        
        console.log('✅ 所有数据加载完成！');
        console.log('最终大纲数据:', outlineData);
    } catch (e) {
        console.error('❌ 加载数据失败:', e);
        alert('数据加载失败，请刷新页面重试');
    }
}

function parseOutlineXlsx(workbook, subjectName) {
    const result = {
        subject: subjectName,
        levels: ['L1', 'L2', 'L3', 'L4'],
        lessons: {}
    };
    
    // 获取第一个工作表
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // 转换为JSON数组
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    console.log(`${subjectName}大纲原始数据:`, jsonData);
    
    // 解析数据结构（假设第一行是标题）
    if (jsonData.length > 1) {
        const headers = jsonData[0];
        console.log('表头:', headers);
        
        // 查找关键列
        const levelIndex = headers.findIndex(h => h && (h.includes('级别') || h.includes('Level') || h.includes('等级')));
        const lessonIndex = headers.findIndex(h => h && (h.includes('讲次') || h.includes('课程') || h.includes('Lesson')));
        const titleIndex = headers.findIndex(h => h && (h.includes('标题') || h.includes('主题') || h.includes('Title')));
        const keyPointsIndex = headers.findIndex(h => h && (h.includes('重点') || h.includes('知识点') || h.includes('KeyPoints')));
        const summaryIndex = headers.findIndex(h => h && (h.includes('总结') || h.includes('内容') || h.includes('Summary')));
        const imageIndex = headers.findIndex(h => h && (h.includes('图片') || h.includes('Image')));
        
        console.log('列索引:', { levelIndex, lessonIndex, titleIndex, keyPointsIndex, summaryIndex, imageIndex });
        
        // 解析每一行数据
        for (let i = 1; i < jsonData.length; i++) {
            const row = jsonData[i];
            if (!row || row.length === 0) continue;
            
            const level = levelIndex >= 0 ? (row[levelIndex] || 'L1') : 'L1';
            const lesson = lessonIndex >= 0 ? (row[lessonIndex] || i.toString()) : i.toString();
            const title = titleIndex >= 0 ? (row[titleIndex] || `第${lesson}讲`) : `第${lesson}讲`;
            const keyPoints = keyPointsIndex >= 0 ? parseKeyPoints(row[keyPointsIndex]) : [];
            const summary = summaryIndex >= 0 ? (row[summaryIndex] || '') : '';
            const image = imageIndex >= 0 ? (row[imageIndex] || `${subjectName}-${level}-第${lesson}讲.png`) : `${subjectName}-${level}-第${lesson}讲.png`;
            
            // 初始化级别数据
            if (!result.lessons[level]) {
                result.lessons[level] = {};
            }
            
            // 存储课程数据
            result.lessons[level][lesson.toString()] = {
                title: title,
                keyPoints: keyPoints,
                summary: summary,
                image: image
            };
            
            console.log(`解析课程数据: ${level}-${lesson}`, result.lessons[level][lesson.toString()]);
        }
    }
    
    return result;
}

function parseKeyPoints(keyPointsStr) {
    if (!keyPointsStr) return [];
    
    // 尝试多种分隔符
    let points = [];
    if (typeof keyPointsStr === 'string') {
        // 尝试逗号、分号、换行符等分隔
        if (keyPointsStr.includes(',')) {
            points = keyPointsStr.split(',').map(p => p.trim()).filter(p => p);
        } else if (keyPointsStr.includes(';')) {
            points = keyPointsStr.split(';').map(p => p.trim()).filter(p => p);
        } else if (keyPointsStr.includes('\n')) {
            points = keyPointsStr.split('\n').map(p => p.trim()).filter(p => p);
        } else if (keyPointsStr.includes('、')) {
            points = keyPointsStr.split('、').map(p => p.trim()).filter(p => p);
        } else {
            // 如果没有明显分隔符，将整个字符串作为一个知识点
            points = [keyPointsStr.trim()];
        }
    } else if (Array.isArray(keyPointsStr)) {
        points = keyPointsStr;
    }
    
    return points;
}

function updateUI() {
    document.querySelectorAll('.subject-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.subject === currentSubject);
    });
    document.querySelectorAll('.level-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.level === currentLevel);
    });
    
    // 评语模式按钮
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === currentMode);
    });
    
    // 如果已经生成了报告，重新渲染以更新内容
    if (Object.keys(studentData).length > 0) {
        renderReportCards();
    }
    
    // 重新渲染图片选择器
    if (imageSelectionMode === 'auto') {
        renderImageSelectorList();
    }
}

function handleFileUpload(event) {
    const files = Array.from(event.target.files);
    files.forEach(file => {
        if (!uploadedFiles.find(f => f.name === file.name)) {
            uploadedFiles.push(file);
        }
    });
    renderUploadedFiles();
    
    // 解析上传的CSV文件名，提取讲次信息并自动选择图片
    if (currentMode === 'overall') {
        const lectures = parseLecturesFromFilenames(uploadedFiles);
        autoSelectImagesByLectures(lectures);
    }
}

// 从文件名解析讲次信息
function parseLecturesFromFilenames(files) {
    const lectures = [];
    // 支持多种文件名格式：
    // 格式1：数学L1第1讲.csv、语文L2第三讲.csv
    // 格式2：L1第1讲.csv、L2第3讲.csv
    // 格式3：1讲.csv、第一讲.csv、第1讲.csv
    // 格式4：讲次1.csv、第1讲数据.csv
    const patterns = [
        /(数学|语文)?.*L?(\d+)[-_]?第?([一二三四五1-5])讲/i,  // 匹配：数学L1第1讲、L2第三讲
        /第?([一二三四五1-5])讲/i,                           // 匹配：第1讲、第一讲、1讲
        /讲次([1-5])/i,                                      // 匹配：讲次1、讲次2
        /(\d)讲/i                                            // 匹配：1讲、2讲（简单格式）
    ];
    
    // 中文数字转阿拉伯数字
    const chineseToNum = { '一': 1, '二': 2, '三': 3, '四': 4, '五': 5 };
    
    files.forEach(file => {
        for (const pattern of patterns) {
            const match = file.name.match(pattern);
            if (match) {
                let lecture = match[match.length - 1]; // 获取最后一个捕获组
                // 处理中文数字
                if (chineseToNum[lecture]) {
                    lecture = chineseToNum[lecture];
                } else {
                    lecture = parseInt(lecture);
                }
                
                if (!isNaN(lecture) && lecture >= 1 && lecture <= 5 && !lectures.includes(lecture)) {
                    lectures.push(lecture);
                }
                break; // 匹配到一个模式后跳出循环
            }
        }
    });
    
    return lectures.sort((a, b) => a - b);
}

// 根据讲次自动选择图片
function autoSelectImagesByLectures(lectures) {
    // 先取消所有图片的选中状态
    availableImages.forEach(img => img.selected = false);
    
    // 选中指定讲次的图片
    const subjectName = currentSubject === 'math' ? '数学' : '语文';
    availableImages.forEach(img => {
        if (img.subject === subjectName && img.level === currentLevel && lectures.includes(img.lecture)) {
            img.selected = true;
        }
    });
    
    renderImageSelectorList();
    saveImageSelectionPreference();
}

function renderUploadedFiles() {
    const container = document.getElementById('uploaded-files');
    if (uploadedFiles.length === 0) {
        container.innerHTML = '';
        return;
    }
    container.innerHTML = `
        <div class="file-list-header">
            <span>已上传文件（${uploadedFiles.length}个）</span>
            <div class="file-actions">
                <button class="sort-btn" onclick="sortFilesDescending()" title="按讲次降序排列">↓ 降序</button>
            </div>
        </div>
        ${uploadedFiles.map((file, index) => `
            <div class="uploaded-file">
                <div class="file-info">
                    <span class="file-index">${index + 1}</span>
                    <span class="file-name">${file.name}</span>
                </div>
                <div class="file-actions">
                    <button class="move-btn" onclick="moveFileUp(${index})" ${index === 0 ? 'disabled' : ''}>↑</button>
                    <button class="move-btn" onclick="moveFileDown(${index})" ${index === uploadedFiles.length - 1 ? 'disabled' : ''}>↓</button>
                    <span class="remove-btn" onclick="removeFile(${index})">×</span>
                </div>
            </div>
        `).join('')}
    `;
}

function removeFile(index) {
    uploadedFiles.splice(index, 1);
    renderUploadedFiles();
}

// 上移文件
function moveFileUp(index) {
    if (index > 0) {
        const temp = uploadedFiles[index];
        uploadedFiles[index] = uploadedFiles[index - 1];
        uploadedFiles[index - 1] = temp;
        renderUploadedFiles();
    }
}

// 下移文件
function moveFileDown(index) {
    if (index < uploadedFiles.length - 1) {
        const temp = uploadedFiles[index];
        uploadedFiles[index] = uploadedFiles[index + 1];
        uploadedFiles[index + 1] = temp;
        renderUploadedFiles();
    }
}

// 按讲次降序排列
function sortFilesDescending() {
    uploadedFiles.sort((a, b) => {
        const numA = extractLessonNumber(a.name);
        const numB = extractLessonNumber(b.name);
        
        // 尝试提取数字（包括中文数字）
        const matchA = numA.match(/\d+/);
        const matchB = numB.match(/\d+/);
        
        // 提取中文数字
        const chineseNumA = extractChineseNumber(numA);
        const chineseNumB = extractChineseNumber(numB);
        
        // 获取最终排序数值
        const valueA = matchA ? parseInt(matchA[0]) : (chineseNumA || 0);
        const valueB = matchB ? parseInt(matchB[0]) : (chineseNumB || 0);
        
        // 按降序排列
        return valueB - valueA;
    });
    renderUploadedFiles();
}

// 提取中文数字
function extractChineseNumber(str) {
    const chineseMap = {
        '一': 1, '二': 2, '三': 3, '四': 4, '五': 5,
        '六': 6, '七': 7, '八': 8, '九': 9, '十': 10,
        '壹': 1, '贰': 2, '叁': 3, '肆': 4, '伍': 5,
        '陆': 6, '柒': 7, '捌': 8, '玖': 9, '拾': 10
    };
    
    // 匹配 "第X讲" 格式
    const match = str.match(/第([一二三四五六七八九十壹贰叁肆伍陆柒捌玖拾]+)讲/);
    if (match) {
        const chineseNum = match[1];
        // 处理 "十几" 的情况
        if (chineseNum.length === 1) {
            return chineseMap[chineseNum] || 0;
        } else if (chineseNum.startsWith('十')) {
            // 十一、十二等
            const num = chineseMap[chineseNum[1]] || 0;
            return 10 + num;
        } else if (chineseNum.endsWith('十')) {
            // 一十、二十等
            const num = chineseMap[chineseNum[0]] || 0;
            return num * 10;
        }
        return chineseMap[chineseNum] || 0;
    }
    
    return 0;
}

async function generateReports() {
    console.log('✅ generateReports 函数被调用了！');
    console.log('上传的文件数量:', uploadedFiles.length);
    
    if (uploadedFiles.length === 0) {
        alert('请先上传CSV文件');
        return;
    }

    try {
        console.log('开始处理...');
        studentData = {};
        let allParsedData = [];
        let hasStudentPlaceholder = false;
        let allStudentNames = [];
        
        console.log('开始解析CSV文件...');
        
        // 先解析所有CSV文件
        for (const file of uploadedFiles) {
            console.log(`正在处理文件: ${file.name}`);
            const text = await readFileAsText(file);
            console.log('文件读取完成！');
            const lessonNum = extractLessonNumber(file.name);
            const parsedData = parseCSV(text);
            console.log(`解析文件: ${file.name}, 讲次: ${lessonNum}, 数据条数: ${parsedData.length}`);
            console.log('解析的第一条数据:', parsedData[0]);
            
            // 检查是否有学员名称包含"学员"
            parsedData.forEach(student => {
                if (student.name && student.name.includes('学员')) {
                    hasStudentPlaceholder = true;
                    allStudentNames.push(student.name);
                }
            });
            
            allParsedData.push({ lessonNum, data: parsedData });
        }
        
        console.log('CSV文件解析完成，共', allParsedData.length, '个讲次');
        
        // 检测重名学员（同一个表格中出现两个一模一样的学员姓名）
        const allStudents = allParsedData.flatMap(item => item.data);
        
        // 在每个讲次中检测重名
        const duplicateStudents = [];
        const duplicateStudentRecords = {}; // 存储重名学员的详细记录
        
        allParsedData.forEach(item => {
            const lessonNum = item.lessonNum;
            const lessonStudents = item.data;
            
            // 统计当前讲次中每个姓名出现的次数
            const nameCount = {};
            lessonStudents.forEach(student => {
                const name = student.name;
                nameCount[name] = (nameCount[name] || 0) + 1;
            });
            
            // 找出出现2次以上的姓名（排除"学员"占位符）
            Object.keys(nameCount).forEach(name => {
                if (nameCount[name] >= 2 && !name.includes('学员')) {
                    // 检查是否已经记录过这个重名
                    if (!duplicateStudentRecords[name]) {
                        duplicateStudentRecords[name] = {
                            name: name,
                            lessons: []
                        };
                        duplicateStudents.push(name);
                    }
                    // 添加当前讲次的信息
                    duplicateStudentRecords[name].lessons.push({
                        lesson: lessonNum,
                        count: nameCount[name],
                        records: lessonStudents.filter(s => s.name === name)
                    });
                }
            });
        });
        
        console.log('检测到', duplicateStudents.length, '个重名学员');
        
        // 如果发现重名，弹窗让用户给重名学员添加区分标识
        if (duplicateStudents.length > 0) {
            // 构建重名学员数据，用于弹窗显示
            window.duplicateStudentsData = Object.values(duplicateStudentRecords);
            
            // 显示重名处理对话框
            const renamedData = await showDuplicateStudentDialog();
            console.log('重名处理完成，返回数据:', renamedData);
            if (renamedData) {
                // 更新数据中的姓名：保留原始姓名用于显示，添加displayName用于文件名
                allParsedData = allParsedData.map(item => ({
                    lessonNum: item.lessonNum,
                    data: item.data.map(student => {
                        // 根据讲次和学员信息匹配重命名数据
                        const renamed = renamedData.find(r => 
                            r.lesson === item.lessonNum &&
                            r.originalName === student.name &&
                            r.objectiveAccuracy === student.objectiveAccuracy &&
                            r.interactionRate === student.interactionRate &&
                            r.totalMinutes === student.totalMinutes
                        );
                        if (renamed) {
                            // 原始姓名保持不变（用于显示），displayName用于文件名
                            return { 
                                ...student, 
                                originalName: student.name,
                                displayName: renamed.newName
                            };
                        }
                        return student;
                    })
                }));
            }
        }
        
        // 如果发现学员名称包含"学员"，弹窗提示用户
        if (hasStudentPlaceholder) {
            console.log('检测到学员占位符，显示对话框...');
            // 合并所有学员数据用于弹窗处理
            const allData = allParsedData.flatMap(item => item.data);
            window.currentStudentData = allData;
            
            // 弹出对话框并等待用户操作
            studentNameDialogResolved = false;
            showStudentNameDialog(allStudentNames, allData);
            
            // 等待用户操作完成
            await waitForStudentNameDialog();
            console.log('学员名称对话框处理完成');
            
            // 使用用户修改后的数据
            allParsedData = allParsedData.map(item => {
                const modifiedData = window.currentStudentData.filter(s => 
                    item.data.some(original => 
                        original.objectiveAccuracy === s.objectiveAccuracy &&
                        original.interactionRate === s.interactionRate &&
                        original.totalMinutes === s.totalMinutes
                    )
                );
                return { lessonNum: item.lessonNum, data: modifiedData };
            });
        }
        
        // 保存所有报告数据用于批量下载
        allParsedData.forEach(item => {
            studentData[item.lessonNum] = item.data;
        });
        
        console.log('准备渲染报告卡片...');
        allReportCards = [];
        renderReportCards();
        console.log('✅ 报告生成完成！');
        
    } catch (error) {
        console.error('❌ 生成报告时发生错误:', error);
        console.error('错误堆栈:', error.stack);
        alert('生成报告时发生错误，请查看控制台');
    }
}

let studentNameDialogResolved = true;

function readFileAsText(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        // 先以ArrayBuffer方式读取，这样可以尝试多种编码
        reader.onload = (e) => {
            const arrayBuffer = e.target.result;
            
            console.log('=== 文件读取结果 ===');
            console.log('文件大小:', arrayBuffer.byteLength, '字节');
            
            // 先尝试UTF-8解码
            let text = new TextDecoder('UTF-8').decode(arrayBuffer);
            
            console.log('UTF-8解码后前500字符:', text.substring(0, 500));
            
            // 检查是否有乱码（常见的GBK编码特征）
            const hasGarbage = text.includes('�') || text.includes('锟斤拷') || text.includes('姹夊瓧');
            
            if (hasGarbage) {
                console.warn('警告：UTF-8解码出现乱码，尝试GBK解码...');
                // 使用GBK解码
                try {
                    const decoder = new TextDecoder('GBK');
                    text = decoder.decode(arrayBuffer);
                    console.log('GBK解码成功！');
                    console.log('GBK解码后前500字符:', text.substring(0, 500));
                } catch (e) {
                    console.error('GBK解码失败:', e);
                }
            }
            
            // 去除BOM字符
            if (text.charCodeAt(0) === 0xFEFF) {
                text = text.slice(1);
                console.log('已去除BOM字符');
            }
            
            console.log('最终文本长度:', text.length);
            resolve(text);
        };
        
        reader.onerror = () => reject(new Error('文件读取失败'));
        
        console.log('开始读取文件（ArrayBuffer）...');
        reader.readAsArrayBuffer(file);
    });
}

// CSV解析器 - 支持带引号的字段
function parseCSV(text) {
    console.log('=== CSV文件解析开始 ===');
    console.log('文本长度:', text.length);
    
    // 统一换行符
    text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    
    // 解析CSV（支持带引号的字段）
    const lines = parseCSVLines(text);
    console.log('总行数:', lines.length);
    
    if (lines.length > 0) {
        console.log('第一行（表头）:', lines[0]);
    }
    if (lines.length > 1) {
        console.log('第二行（数据）:', lines[1]);
    }
    
    if (lines.length < 2) {
        console.warn('⚠️ CSV文件只有表头或为空');
        return [];
    }
    
    // 解析表头
    const headers = lines[0].map(h => {
        let clean = h.trim();
        // 去除BOM字符
        if (clean.charCodeAt(0) === 0xFEFF) {
            clean = clean.slice(1);
        }
        return clean;
    });
    console.log('解析的表头:', headers);
    
    // 宽松匹配列名
    const nameIndex = headers.findIndex(h => 
        h.includes('姓名') || h.includes('名字') || h.includes('名称') || 
        h.includes('学生') || h.includes('学员')
    );
    const accuracyIndex = headers.findIndex(h => 
        h.includes('正确率') || h.includes('正确') || 
        h.includes('客观题') || h.includes('答题') || h.includes('得分')
    );
    const replayIndex = headers.findIndex(h => h.includes('回放') || h.includes('回看') || h.includes('复习'));
    const participationIndex = headers.findIndex(h => 
        h.includes('参与率') || h.includes('互动率') || 
        h.includes('互动参与') || h.includes('课堂参与')
    );
    const attendanceIndex = headers.findIndex(h => 
        h.includes('出勤') || h.includes('时长') || 
        h.includes('直播') || h.includes('听课')
    );
    
    console.log('列索引：姓名=', nameIndex, ', 正确率=', accuracyIndex, ', 回放=', replayIndex, ', 参与率=', participationIndex, ', 出勤=', attendanceIndex);
    
    // 如果找不到正确率列，尝试找包含%的列
    let finalAccuracyIndex = accuracyIndex;
    if (accuracyIndex === -1) {
        finalAccuracyIndex = headers.findIndex(h => h.includes('%') && !h.includes('参与'));
        console.log('尝试通过%符号找到正确率列:', finalAccuracyIndex);
    }
    
    // 如果找不到参与率列，尝试找另一个包含%的列
    let finalParticipationIndex = participationIndex;
    if (participationIndex === -1 && finalAccuracyIndex !== -1) {
        finalParticipationIndex = headers.findIndex((h, i) => h.includes('%') && i !== finalAccuracyIndex);
        console.log('尝试通过%符号找到参与率列:', finalParticipationIndex);
    }
    
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i];
        console.log(`处理第${i}行:`, values);
        
        // 获取学员姓名（优先使用姓名列，否则使用第一列）
        let studentName = '';
        if (nameIndex !== -1 && nameIndex < values.length) {
            studentName = (values[nameIndex] || '').trim();
        } else if (values.length > 0) {
            studentName = values[0].trim();
        }
        
        // 如果找不到姓名，跳过
        if (!studentName || studentName === 'undefined' || studentName === 'null') {
            console.log(`第${i}行无有效姓名，跳过`);
            continue;
        }
        
        // 解析时长（尝试多个列）
        let totalMinutes = 0;
        
        // 尝试出勤列
        if (attendanceIndex !== -1 && attendanceIndex < values.length) {
            const attendanceStr = values[attendanceIndex] || '';
            totalMinutes += parseDuration(attendanceStr);
        }
        // 尝试回放列
        if (replayIndex !== -1 && replayIndex < values.length) {
            const replayStr = values[replayIndex] || '';
            totalMinutes += parseDuration(replayStr);
        }
        
        // 如果还没找到时长，尝试在所有列中查找
        if (totalMinutes === 0) {
            for (const val of values) {
                totalMinutes += parseDuration(val);
            }
        }
        
        // 解析正确率
        let accuracy = 0;
        if (finalAccuracyIndex !== -1 && finalAccuracyIndex < values.length) {
            const accuracyStr = values[finalAccuracyIndex] || '';
            const match = accuracyStr.match(/(\d+(?:\.\d+)?)/);
            if (match) accuracy = parseFloat(match[1]);
        }
        
        // 如果找不到正确率，尝试其他列
        if (accuracy === 0) {
            for (const val of values) {
                const match = val.match(/(\d+(?:\.\d+)?)%/);
                if (match) {
                    accuracy = parseFloat(match[1]);
                    break;
                }
            }
        }
        
        // 解析参与率
        let participation = 0;
        if (finalParticipationIndex !== -1 && finalParticipationIndex < values.length) {
            const participationStr = values[finalParticipationIndex] || '';
            const match = participationStr.match(/(\d+(?:\.\d+)?)/);
            if (match) participation = parseFloat(match[1]);
        }
        
        // 如果找不到参与率，尝试找另一个百分比
        if (participation === 0 && accuracy > 0) {
            let foundSecondPercent = false;
            for (const val of values) {
                const match = val.match(/(\d+(?:\.\d+)?)%/);
                if (match) {
                    const num = parseFloat(match[1]);
                    if (!foundSecondPercent && num !== accuracy) {
                        participation = num;
                        foundSecondPercent = true;
                    }
                }
            }
        }
        
        console.log(`  解析结果: 姓名=${studentName}, 正确率=${accuracy}%, 参与率=${participation}%, 时长=${totalMinutes}分钟`);
        
        const record = {
            name: studentName,
            objectiveAccuracy: accuracy,
            replayDuration: '--',
            interactionRate: participation,
            totalMinutes: totalMinutes,
            totalTime: totalMinutes > 0 ? `${totalMinutes}分钟` : '--'
        };
        
        data.push(record);
    }
    
    console.log('=== CSV解析完成，共', data.length, '条数据 ===');
    console.log('前3条数据:', data.slice(0, 3));
    return data;
}

// 解析CSV行（支持带引号的字段）
function parseCSVLines(text) {
    const lines = [];
    let currentLine = [];
    let currentField = '';
    let inQuotes = false;
    
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        
        if (char === '"') {
            // 检查是否是转义的引号 ("")
            if (text[i + 1] === '"') {
                currentField += '"';
                i++; // 跳过下一个引号
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            // 字段分隔符
            currentLine.push(currentField);
            currentField = '';
        } else if ((char === '\n') && !inQuotes) {
            // 行结束
            currentLine.push(currentField);
            if (currentLine.some(f => f.trim())) { // 跳过空行
                lines.push(currentLine);
            }
            currentLine = [];
            currentField = '';
        } else {
            currentField += char;
        }
    }
    
    // 添加最后一行
    if (currentField || currentLine.length > 0) {
        currentLine.push(currentField);
        if (currentLine.some(f => f.trim())) {
            lines.push(currentLine);
        }
    }
    
    return lines;
}

// 解析时长字符串
function parseDuration(str) {
    if (!str) return 0;
    
    // 匹配 "33分钟0秒" 格式
    const minMatch = str.match(/(\d+)\s*分钟/);
    const secMatch = str.match(/(\d+)\s*秒/);
    
    let minutes = 0;
    if (minMatch) minutes += parseFloat(minMatch[1]);
    if (secMatch) minutes += parseFloat(secMatch[1]) / 60;
    
    return Math.round(minutes);
}

function showDuplicateStudentDialog() {
    return new Promise((resolve) => {
        const duplicates = window.duplicateStudentsData;
        
        // 构建所有需要重命名的记录列表
        const allRenameRecords = [];
        duplicates.forEach(dup => {
            dup.lessons.forEach(lessonInfo => {
                lessonInfo.records.forEach((record, recordIndex) => {
                    allRenameRecords.push({
                        originalName: dup.name,
                        lesson: lessonInfo.lesson,
                        record: record,
                        index: allRenameRecords.length
                    });
                });
            });
        });
        
        // 创建弹窗
        const dialog = document.createElement('div');
        dialog.className = 'student-name-dialog duplicate-dialog';
        dialog.innerHTML = `
            <div class="dialog-content">
                <h3>⚠️ 检测到重名学员</h3>
                <p style="margin-bottom: 10px;">在同一个表格中出现两个一模一样的学员姓名，请为这些学员添加区分标识：</p>
                <p style="font-size: 12px; color: #666; margin-bottom: 15px;">提示：系统会自动在姓名后添加后缀（如 _A, _B），您也可以自定义名称</p>
                <div class="duplicate-list" style="max-height: 400px; overflow-y: auto;">
                    ${duplicates.map((dup, dupIndex) => `
                        <div class="duplicate-item" style="margin-bottom: 20px; padding: 15px; background: #f5f5f5; border-radius: 8px;">
                            <h4 style="margin-bottom: 10px;">👨‍🎓 ${dup.name}</h4>
                            ${dup.lessons.map(lessonInfo => `
                                <div style="margin-left: 10px; margin-top: 10px;">
                                    <span style="font-weight: bold; color: #666;">📋 ${lessonInfo.lesson}（出现 ${lessonInfo.count} 次）</span>
                                    ${lessonInfo.records.map((record, recordIndex) => {
                                        const globalIndex = allRenameRecords.findIndex(r => 
                                            r.originalName === dup.name && 
                                            r.lesson === lessonInfo.lesson && 
                                            r.record.objectiveAccuracy === record.objectiveAccuracy &&
                                            r.record.interactionRate === record.interactionRate
                                        );
                                        return `
                                            <div class="rename-row" style="display: flex; align-items: center; gap: 10px; margin: 8px 0; padding: 8px; background: white; border-radius: 4px;">
                                                <span class="record-data" style="flex: 1; font-size: 13px;">正确率：${record.objectiveAccuracy || 0}% | 参与率：${record.interactionRate || 0}% | 时长：${record.totalMinutes || 0}分钟</span>
                                                <input type="text" 
                                                    class="rename-input"
                                                    data-original="${dup.name}"
                                                    data-lesson="${lessonInfo.lesson}"
                                                    data-global-index="${globalIndex}"
                                                    value="${dup.name}_${String.fromCharCode(65 + recordIndex)}"
                                                    placeholder="输入新名称"
                                                    style="padding: 5px 10px; border: 1px solid #ddd; border-radius: 4px; width: 120px;">
                                            </div>
                                        `;
                                    }).join('')}
                                </div>
                            `).join('')}
                        </div>
                    `).join('')}
                </div>
                <div class="dialog-actions">
                    <button class="dialog-btn secondary" onclick="cancelDuplicateDialog()">取消</button>
                    <button class="dialog-btn primary" onclick="confirmDuplicateRename()">确定</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(dialog);
        
        // 取消按钮
        window.cancelDuplicateDialog = function() {
            document.body.removeChild(dialog);
            resolve(null);
        };
        
        // 确认按钮
        window.confirmDuplicateRename = function() {
            const renamedData = [];
            const inputs = dialog.querySelectorAll('.rename-input');
            
            inputs.forEach(input => {
                const originalName = input.dataset.original;
                const newName = input.value.trim();
                const lesson = input.dataset.lesson;
                
                if (newName) {
                    // 找到对应的记录
                    const dup = duplicates.find(d => d.name === originalName);
                    if (dup) {
                        const lessonInfo = dup.lessons.find(l => l.lesson === lesson);
                        if (lessonInfo) {
                            // 找到对应的原始记录
                            lessonInfo.records.forEach(record => {
                                renamedData.push({
                                    originalName: originalName,
                                    newName: newName,
                                    lesson: lesson,
                                    objectiveAccuracy: record.objectiveAccuracy,
                                    interactionRate: record.interactionRate,
                                    totalMinutes: record.totalMinutes
                                });
                            });
                        }
                    }
                }
            });
            
            document.body.removeChild(dialog);
            resolve(renamedData);
        };
    });
}

function waitForStudentNameDialog() {
    return new Promise((resolve) => {
        if (studentNameDialogResolved) {
            resolve();
            return;
        }
        
        const checkInterval = setInterval(() => {
            if (studentNameDialogResolved) {
                clearInterval(checkInterval);
                resolve();
            }
        }, 100);
    });
}

function extractLessonNumber(fileName) {
    const baseName = fileName.replace(/\.[^/.]+$/, '');
    
    // 尝试提取数字（包括中文数字）
    const numMatch = baseName.match(/(\d+)/);
    if (numMatch) {
        return numMatch[1];
    }
    
    // 尝试提取中文数字
    const chineseNum = extractChineseNumber(baseName);
    if (chineseNum > 0) {
        return chineseNum.toString();
    }
    
    return baseName;
}

function showStudentNameDialog(studentNames, data) {
    // 设置状态为未解决，等待用户操作
    studentNameDialogResolved = false;
    
    const dialog = document.createElement('div');
    dialog.className = 'student-name-dialog';
    dialog.innerHTML = `
        <div class="dialog-content">
            <h3>学员名称提示</h3>
            <p>发现以下学员名称包含"学员"：</p>
            <div class="student-names-list">
                ${studentNames.map(name => `<span class="student-name-item">${name}</span>`).join('')}
            </div>
            <p>是否统一使用"学而思学员"作为学员名称？</p>
            <div class="dialog-buttons">
                <button class="dialog-btn use-default" onclick="useDefaultStudentName()">使用"学而思学员"</button>
                <button class="dialog-btn keep-original" onclick="keepOriginalStudentName()">保持原名称</button>
                <button class="dialog-btn custom-name" onclick="showCustomNameInput()">自定义名称</button>
            </div>
            <div class="custom-name-input" style="display: none;">
                <input type="text" id="custom-student-name" placeholder="请输入学员名称">
                <button class="dialog-btn apply-custom" onclick="applyCustomStudentName()">应用</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(dialog);
    
    // 存储data引用，以便后续修改
    window.currentStudentData = data;
    window.studentNameDialog = dialog;
}

function useDefaultStudentName() {
    window.currentStudentData.forEach(student => {
        if (student.name.includes('学员')) {
            student.name = '学而思学员';
        }
    });
    document.body.removeChild(window.studentNameDialog);
    studentNameDialogResolved = true;
    alert('已统一使用"学而思学员"作为学员名称');
}

function keepOriginalStudentName() {
    document.body.removeChild(window.studentNameDialog);
    studentNameDialogResolved = true;
}

function showCustomNameInput() {
    const customInput = window.studentNameDialog.querySelector('.custom-name-input');
    customInput.style.display = 'flex';
}

function applyCustomStudentName() {
    const customName = document.getElementById('custom-student-name').value.trim();
    if (!customName) {
        alert('请输入学员名称');
        return;
    }
    
    window.currentStudentData.forEach(student => {
        if (student.name.includes('学员')) {
            student.name = customName;
        }
    });
    
    document.body.removeChild(window.studentNameDialog);
    studentNameDialogResolved = true;
    alert(`已统一使用"${customName}"作为学员名称`);
}

function formatTime(minutes) {
    if (minutes >= 60) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}小时${mins}分钟`;
    }
    return `${minutes}分钟`;
}

function renderReportCards() {
    console.log('✅ renderReportCards 被调用！');
    console.log('当前模式:', currentMode);
    console.log('学生数据:', studentData);
    console.log('大纲数据:', outlineData[currentSubject]?.lessons?.[currentLevel]);
    
    const container = document.getElementById('reports-container');
    allReportCards = [];
    
    const cards = [];
    if (currentMode === 'single') {
        // 单讲评语
        Object.entries(studentData).forEach(([lesson, students]) => {
            console.log('处理讲次:', lesson, '学生数量:', students.length);
            
            students.forEach(student => {
                console.log('学生:', student);
                
                // 尝试从文件名中提取讲次数字
                let lessonNum = lesson;
                const match = lesson.match(/\d+/);
                if (match) {
                    lessonNum = match[0];
                }
                
                // 获取课程数据，如果找不到就创建默认数据
                let lessonData = null;
                
                // 尝试多种方式获取课程数据
                if (outlineData[currentSubject] && outlineData[currentSubject].lessons) {
                    const lessons = outlineData[currentSubject].lessons;
                    
                    // 尝试通过currentLevel获取
                    if (lessons[currentLevel] && lessons[currentLevel][lessonNum]) {
                        lessonData = lessons[currentLevel][lessonNum];
                    }
                    // 如果找不到，尝试遍历所有级别
                    if (!lessonData) {
                        for (const level of ['L1', 'L2', 'L3', 'L4']) {
                            if (lessons[level] && lessons[level][lessonNum]) {
                                lessonData = lessons[level][lessonNum];
                                break;
                            }
                        }
                    }
                }
                
                // 如果还是找不到，创建默认的课程数据
                if (!lessonData) {
                    console.warn(`未找到课程数据: ${currentSubject}-${currentLevel}-${lessonNum}`);
                    const subjectName = currentSubject === 'math' ? '数学' : '语文';
                    lessonData = {
                        title: `第${lessonNum}讲`,
                        keyPoints: [],
                        summary: '',
                        image: `${subjectName}-${currentLevel}-第${lessonNum}讲.png`
                    };
                }
                
                console.log('课程数据:', lessonData);
                
                const comment = generateComment(student, lessonData, lesson);
                // 使用displayName（如果存在）作为文件名，否则使用name
                const displayName = student.displayName || student.name;
                const cardData = { student, lesson, lessonData, comment, displayName };
                allReportCards.push(cardData);
                cards.push(createReportCard(cardData));
            });
        });
    } else {
        // 总体评语
        const studentMap = {};
        Object.entries(studentData).forEach(([lesson, students]) => {
            students.forEach(student => {
                // 使用displayName（如果存在）作为文件名，否则使用name
                const displayName = student.displayName || student.name;
                const key = displayName; // 用displayName作为map的key
                
                if (!studentMap[key]) {
                    studentMap[key] = { 
                        name: student.name, // 原始姓名用于显示
                        displayName: displayName, // 区分后姓名用于文件名
                        records: [] 
                    };
                }
                studentMap[key].records.push({ lesson, ...student });
            });
        });

        Object.values(studentMap).forEach(student => {
            const avgAccuracy = student.records.reduce((sum, r) => sum + r.objectiveAccuracy, 0) / student.records.length;
            const avgTotalTime = student.records.reduce((sum, r) => sum + r.totalMinutes, 0) / student.records.length;
            const avgParticipation = student.records.reduce((sum, r) => sum + r.interactionRate, 0) / student.records.length;
            
            // 获取唯一的讲次数量（最多5讲）
            const uniqueLessons = [...new Set(student.records.map(r => r.lesson))];
            const completedLessons = Math.min(uniqueLessons.length, 5);
            const keyPointsSummary = generateKeyPointsSummary(student.records);
            const comment = generateOverallComment(student.name, avgAccuracy, avgTotalTime, avgParticipation, completedLessons, keyPointsSummary);
            
            const cardData = { 
                student, 
                displayName: student.displayName,
                avgAccuracy, 
                avgTotalTime, 
                avgParticipation, 
                completedLessons, 
                keyPointsSummary, 
                comment, 
                isOverall: true 
            };
            allReportCards.push(cardData);
            cards.push(createOverallReportCard(cardData));
        });
    }
    container.innerHTML = cards.length > 0 ? cards.join('') : createEmptyState();
}

function createEmptyState() {
    return `
        <div class="empty-state">
            <span>📝</span>
            <p>请上传CSV文件并点击生成报告</p>
        </div>
    `;
}

async function downloadSingleReport(studentName, lesson) {
    const card = document.getElementById(`report-${studentName}-${lesson}`);
    if (!card) return;
    
    try {
        // 隐藏下载按钮
        const downloadBtn = card.querySelector('.download-btn-no-print');
        if (downloadBtn) {
            downloadBtn.style.display = 'none';
        }
        
        // 等待所有图片加载完成
        await new Promise((resolve) => {
            const images = card.querySelectorAll('img');
            if (images.length === 0) {
                resolve();
                return;
            }
            let loadedCount = 0;
            images.forEach(img => {
                if (img.complete) {
                    loadedCount++;
                } else {
                    img.onload = () => {
                        loadedCount++;
                        if (loadedCount === images.length) {
                            // 等待一小段时间确保渲染完成
                            setTimeout(resolve, 100);
                        }
                    };
                    img.onerror = () => {
                        loadedCount++;
                        if (loadedCount === images.length) {
                            setTimeout(resolve, 100);
                        }
                    };
                }
            });
            if (loadedCount === images.length) {
                setTimeout(resolve, 100);
            }
        });
        
        // 获取卡片实际尺寸
        const rect = card.getBoundingClientRect();
        
        // 使用html2canvas截图，提高清晰度
        const canvas = await html2canvas(card, {
            scale: 3,
            useCORS: true,
            backgroundColor: '#ffffff',
            width: rect.width,
            height: rect.height,
            imageTimeout: 10000,
            logging: false,
            letterRendering: true,
            useForeignObjectRendering: false
        });
        
        // 恢复下载按钮显示
        if (downloadBtn) {
            downloadBtn.style.display = 'block';
        }
        
        const link = document.createElement('a');
        link.download = `${studentName}_${lesson}_学情报告.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    } catch (e) {
        console.error('下载失败:', e);
        alert('下载失败，请重试');
    }
}

async function downloadOverallReport(studentName) {
    const card = document.getElementById(`report-${studentName}-overall`);
    if (!card) return;
    
    try {
        // 隐藏下载按钮
        const downloadBtn = card.querySelector('.download-btn-no-print');
        if (downloadBtn) {
            downloadBtn.style.display = 'none';
        }
        
        // 等待所有图片加载完成
        await new Promise((resolve) => {
            const images = card.querySelectorAll('img');
            if (images.length === 0) {
                resolve();
                return;
            }
            let loadedCount = 0;
            images.forEach(img => {
                if (img.complete) {
                    loadedCount++;
                } else {
                    img.onload = () => {
                        loadedCount++;
                        if (loadedCount === images.length) {
                            setTimeout(resolve, 100);
                        }
                    };
                    img.onerror = () => {
                        loadedCount++;
                        if (loadedCount === images.length) {
                            setTimeout(resolve, 100);
                        }
                    };
                }
            });
            if (loadedCount === images.length) {
                setTimeout(resolve, 100);
            }
        });
        
        // 获取卡片实际尺寸
        const rect = card.getBoundingClientRect();
        
        // 使用html2canvas截图，提高清晰度
        const canvas = await html2canvas(card, {
            scale: 3,
            useCORS: true,
            backgroundColor: '#ffffff',
            width: rect.width,
            height: rect.height,
            imageTimeout: 10000,
            logging: false,
            letterRendering: true,
            useForeignObjectRendering: false
        });
        
        // 恢复下载按钮显示
        if (downloadBtn) {
            downloadBtn.style.display = 'block';
        }
        
        const link = document.createElement('a');
        link.download = `${studentName}_综合学情报告.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    } catch (e) {
        console.error('下载失败:', e);
        alert('下载失败，请重试');
    }
}

async function downloadAllReports() {
    if (allReportCards.length === 0) {
        alert('请先生成报告');
        return;
    }
    
    const downloadBtn = document.querySelector('.download-all-btn');
    downloadBtn.textContent = '⏳ 正在下载...';
    downloadBtn.disabled = true;
    
    try {
        const zip = new JSZip();
        
        for (let i = 0; i < allReportCards.length; i++) {
            const cardData = allReportCards[i];
            let cardId;
            
            if (cardData.isOverall) {
                cardId = `report-${cardData.student.name}-overall`;
            } else {
                cardId = `report-${cardData.student.name}-${cardData.lesson}`;
            }
            
            const card = document.getElementById(cardId);
            if (!card) continue;
            
            // 隐藏下载按钮
            const downloadBtnCard = card.querySelector('.download-btn-no-print');
            if (downloadBtnCard) {
                downloadBtnCard.style.display = 'none';
            }
            
            // 等待所有图片加载完成
            await new Promise((resolve) => {
                const images = card.querySelectorAll('img');
                if (images.length === 0) {
                    resolve();
                    return;
                }
                let loadedCount = 0;
                images.forEach(img => {
                    if (img.complete) {
                        loadedCount++;
                    } else {
                        img.onload = () => {
                            loadedCount++;
                            if (loadedCount === images.length) {
                                setTimeout(resolve, 100);
                            }
                        };
                        img.onerror = () => {
                            loadedCount++;
                            if (loadedCount === images.length) {
                                setTimeout(resolve, 100);
                            }
                        };
                    }
                });
                if (loadedCount === images.length) {
                    setTimeout(resolve, 100);
                }
            });
            
            // 使用html2canvas截图，设置正确的宽高比
            const canvas = await html2canvas(card, {
                scale: 3,
                useCORS: true,
                backgroundColor: '#ffffff',
                imageTimeout: 10000,
                logging: false,
                letterRendering: true,
                useForeignObjectRendering: false
            });
            
            // 恢复下载按钮显示
            if (downloadBtnCard) {
                downloadBtnCard.style.display = 'block';
            }
            
            // 转换为blob并添加到zip
            const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
            const fileName = cardData.isOverall 
                ? `${cardData.displayName}_总体报告.png`
                : `${cardData.displayName}_${cardData.lesson}_学情报告.png`;
            zip.file(fileName, blob);
            
            // 延迟一下，避免处理过快
            await new Promise(resolve => setTimeout(resolve, 300));
        }
        
        // 生成zip并下载
        const content = await zip.generateAsync({ type: 'blob' });
        saveAs(content, `学员学情报告_${new Date().toLocaleDateString('zh-CN').replace(/\//g, '-')}.zip`);
        
        downloadBtn.textContent = '📥 一键下载所有报告';
        downloadBtn.disabled = false;
        alert('所有报告已打包完成！');
    } catch (e) {
        console.error('打包下载失败:', e);
        downloadBtn.textContent = '📥 一键下载所有报告';
        downloadBtn.disabled = false;
        alert('下载失败，请重试');
    }
}

function generateKeyPointsSummary(records) {
    const keyPoints = new Set();
    
 records.forEach(record => {
        // 尝试从文件名中提取讲次数字
        let lessonNum = record.lesson;
        const match = record.lesson.match(/\d+/);
        if (match) {
            lessonNum = match[0];
        }
        
        // 获取课程数据，如果找不到就跳过
        let lessonData = null;
        
        // 尝试多种方式获取课程数据
        if (outlineData[currentSubject] && outlineData[currentSubject].lessons) {
            const lessons = outlineData[currentSubject].lessons;
            
            // 尝试通过currentLevel获取
            if (lessons[currentLevel] && lessons[currentLevel][lessonNum]) {
                lessonData = lessons[currentLevel][lessonNum];
            }
            
            // 如果找不到，尝试遍历所有级别
            if (!lessonData) {
                for (const level of ['L1', 'L2', 'L3', 'L4']) {
                    if (lessons[level] && lessons[level][lessonNum]) {
                        lessonData = lessons[level][lessonNum];
                        break;
                    }
                }
            }
            
            // 如果找不到，尝试通过讲次编号获取（1, 2, 3, 4, 5）
            if (!lessonData) {
                for (let i = 1; i <= 5; i++) {
                    if (lessons[currentLevel] && lessons[currentLevel][i.toString()]) {
                        lessonData = lessons[currentLevel][i.toString()];
                        break;
                    }
                }
            }
        }
        
        if (!lessonData) {
            console.warn(`未找到课程数据: ${currentSubject}-${currentLevel}-${lessonNum}`);
            return;
        }
        
        if (lessonData?.keyPoints) {
            lessonData.keyPoints.slice(0, 2).forEach(kp => keyPoints.add(kp));
        }
    });
    return Array.from(keyPoints).slice(0, 3).join('、');
}

function generateComment(student, lessonData, lesson) {
    console.log('生成评语 - 课程数据:', lessonData);
    console.log('生成评语 - 讲次:', lesson);
    
    const accuracy = student.objectiveAccuracy;
    let category;
    if (accuracy >= 90) category = 'excellent';
    else if (accuracy >= 70) category = 'good';
    else if (accuracy >= 50) category = 'medium';
    else category = 'poor';

    const templates = commentsData[category];
    const template = templates[Math.floor(Math.random() * templates.length)];
    
    // 获取课程信息
    const courseTitle = lessonData?.title || `第${lesson}讲`;
    const keyPoints = lessonData?.keyPoints?.slice(0, 2).join('、') || '本讲内容';
    const summary = lessonData?.summary || '';
    
    console.log('课程标题:', courseTitle);
    console.log('知识点:', keyPoints);
    console.log('课程总结:', summary);
    
    // 处理学员名称
    let displayName = student.name;
    
    // 如果学员姓名是"学员"或包含"学而思学员"，直接用"宝贝"称呼
    if (displayName === '学员' || displayName.includes('学而思学员')) {
        displayName = '';
    } else if (window.useShortName && displayName.length > 2) {
        // 如果用户选择只取后两个字
        displayName = displayName.slice(-2);
    }

    // 生成评语并处理Markdown粗体语法
    let comment = template
        .replace('{name}', displayName)
        .replace('{courseTitle}', courseTitle)
        .replace('{keyPoints}', keyPoints);
    
    // 处理Markdown粗体语法（**文字** → <strong>文字</strong>）
    comment = comment.replace(/\*\*(.*?)\*\*/g, '<strong class="highlight-text">$1</strong>');
    
    // 处理换行符为<br>标签
    comment = comment.replace(/\n/g, '<br>');

    console.log('生成的评语:', comment);

    return comment;
}

function generateOverallComment(name, avgAccuracy, avgTotalTime, avgParticipation, completedLessons, keyPointsSummary) {
    let category;
    if (avgAccuracy >= 90) category = 'excellent';
    else if (avgAccuracy >= 70) category = 'good';
    else if (avgAccuracy >= 50) category = 'medium';
    else category = 'poor';

    const templates = commentsData.overall[category];
    const template = templates[Math.floor(Math.random() * templates.length)];
    
    // 处理学员名称
    let displayName = name;
    
    // 如果学员姓名是"学员"或包含"学而思学员"，直接用"宝贝"称呼
    if (displayName === '学员' || displayName.includes('学而思学员')) {
        displayName = '';
    } else if (window.useShortName && displayName.length > 2) {
        // 如果用户选择只取后两个字
        displayName = displayName.slice(-2);
    }
    
    // 确保keyPointsSummary有内容，不要显示"暂无学习内容汇总"
    let keyPointsText = keyPointsSummary;
    if (!keyPointsSummary || keyPointsSummary.trim() === '') {
        // 从大纲中提取本年级的知识点
        const subjectLessons = outlineData[currentSubject].lessons[currentLevel];
        if (subjectLessons) {
            const allKeyPoints = [];
            for (let i = 1; i <= 5; i++) {
                const lessonData = subjectLessons[i.toString()];
                if (lessonData && lessonData.keyPoints) {
                    allKeyPoints.push(...lessonData.keyPoints);
                }
            }
            if (allKeyPoints.length > 0) {
                // 取前3个知识点
                keyPointsText = allKeyPoints.slice(0, 3).join('、');
            }
        }
    }
    
    const keyPointsTextFinal = keyPointsText ? `本阶段学习了${keyPointsText}等内容。` : '';
    
    // 生成评语并处理Markdown粗体语法
    let comment = template
        .replace('{name}', displayName)
        .replace('{completedLessons}', completedLessons)
        .replace('{keyPointsSummary}', keyPointsTextFinal);
    
    // 处理Markdown粗体语法（**文字** → <strong>文字</strong>）
    comment = comment.replace(/\*\*(.*?)\*\*/g, '<strong class="highlight-text">$1</strong>');
    
    // 处理换行符为<br>标签
    comment = comment.replace(/\n/g, '<br>');
    
    return comment;
}

function createReportCard(cardData) {
    const { student, lesson, lessonData, comment, displayName } = cardData;
    
    // 构建课程图片HTML
    let courseImageHtml = '';
    if (lessonData?.image) {
        // 对中文文件名进行URL编码
        const encodedImage = encodeURIComponent(lessonData.image);
        courseImageHtml = `<img src="images/${encodedImage}" alt="课程重点" class="course-image" onerror="this.style.display='none'">`;
    }
    
    return `
        <div class="report-image-card" id="report-${student.name}-${lesson}">
            <div class="report-header-section">
                <div class="report-student-info">
                    <div class="report-avatar">👨‍🎓</div>
                    <div>
                        <h3>${student.name}</h3>
                        <p class="report-title" contenteditable="true">${outlineData[currentSubject].subject} ${currentLevel} - ${lesson}</p>
                    </div>
                </div>
                <div class="report-teacher-info">
                    <img src="${document.getElementById('teacher-avatar').src}" alt="老师头像" class="teacher-avatar-small">
                    <span>${configData.teacherName}</span>
                </div>
            </div>
            
            <div class="report-stats">
                <div class="stat-item">
                    <div class="stat-value">${student.objectiveAccuracy}%</div>
                    <div class="stat-label">互动题正确率</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${student.interactionRate}%</div>
                    <div class="stat-label">互动题参与率</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${student.totalTime}</div>
                    <div class="stat-label">听课时长</div>
                </div>
            </div>
            
            <div class="report-comment-section">
                <h4 class="comment-title" data-teacher-name="${configData.teacherName}">📝 ${configData.teacherName.replace(/老师$/, '')}老师评语</h4>
                <div class="comment-editable" contenteditable="true" id="comment-${student.name}-${lesson}">${comment}</div>
            </div>
            
            <div class="report-course-section">
                <h4>📚 课程重点</h4>
                ${courseImageHtml}
                <div class="key-points">
                    ${lessonData?.keyPoints?.length ? lessonData.keyPoints.map(kp => `<span class="key-point">${kp}</span>`).join('') : '<p style="color: #888; font-size: 14px;">暂无课程重点信息</p>'}
                </div>
            </div>
            
            <div class="report-footer">
                <span class="footer-brand editable-footer" contenteditable="true" data-student="${student.name}" data-lesson="${lesson}" onblur="updateAllFooterText(this)">${configData.footerText}</span>
                <span>${formatDate(new Date())}</span>
            </div>
            
            <button class="download-btn-no-print" onclick="downloadSingleReport('${displayName}', '${lesson}')">📥 下载</button>
        </div>
    `;
}

function createOverallReportCard(cardData) {
    const { student, displayName, avgAccuracy, avgTotalTime, avgParticipation, completedLessons, keyPointsSummary, comment } = cardData;
    
    // 获取用户选择的图片
    let courseImagesHtml = '';
    const lessons = outlineData[currentSubject]?.lessons?.[currentLevel];
    const selectedImages = getSelectedImages(); // 使用新的图片选择函数
    
    if (selectedImages.length > 0) {
        // 使用用户选择的图片，按讲次排序
        const sortedImages = [...selectedImages].sort((a, b) => a.lecture - b.lecture);
        const images = sortedImages.map(img => {
            let title = img.filename;
            if (lessons && lessons[img.lecture.toString()]) {
                title = lessons[img.lecture.toString()].title || title;
            }
            return {
                src: img.src,
                alt: title,
                lesson: img.lecture
            };
        });
        
        if (images.length > 0) {
            courseImagesHtml = `
                <div class="course-images-grid">
                    ${images.map(img => `
                        <div class="course-image-item">
                            <img src="${img.src}" alt="${img.alt}" class="course-image-small" onerror="this.style.display='none'">
                            <p class="course-image-label">第${img.lesson}讲</p>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    }
    
    // 构建学习内容汇总文字 - 不要显示"暂无学习内容汇总"
    let contentSummaryText = '';
    if (keyPointsSummary && keyPointsSummary.trim() !== '') {
        contentSummaryText = `<p>本阶段学习了${keyPointsSummary}等内容。</p>`;
    } else {
        // 从大纲中提取知识点
        const subjectLessons = outlineData[currentSubject].lessons[currentLevel];
        if (subjectLessons) {
            const allKeyPoints = [];
            for (let i = 1; i <= 5; i++) {
                const lessonData = subjectLessons[i.toString()];
                if (lessonData && lessonData.keyPoints) {
                    allKeyPoints.push(...lessonData.keyPoints);
                }
            }
            if (allKeyPoints.length > 0) {
                const keyPointsText = allKeyPoints.slice(0, 3).join('、');
                contentSummaryText = `<p>本阶段学习了${keyPointsText}等内容。</p>`;
            }
        }
    }
    
    return `
        <div class="report-image-card" id="report-${student.name}-overall">
            <div class="report-header-section">
                <div class="report-student-info">
                    <div class="report-avatar">👨‍🎓</div>
                    <div>
                        <h3>${student.name}</h3>
                        <p class="report-title" contenteditable="true">${outlineData[currentSubject].subject} ${currentLevel} - 综合学习报告</p>
                    </div>
                </div>
                <div class="report-teacher-info">
                    <img src="${document.getElementById('teacher-avatar').src}" alt="老师头像" class="teacher-avatar-small">
                    <span>${configData.teacherName}</span>
                </div>
            </div>
            
            <div class="report-stats overall-stats">
                <div class="stat-item">
                    <div class="stat-value">${avgAccuracy.toFixed(1)}%</div>
                    <div class="stat-label">平均正确率</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${avgParticipation.toFixed(1)}%</div>
                    <div class="stat-label">平均参与率</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${Math.round(avgTotalTime)}分钟</div>
                    <div class="stat-label">平均时长</div>
                </div>
            </div>
            
            <div class="report-comment-section">
                <h4 class="comment-title" data-teacher-name="${configData.teacherName}">📝 ${configData.teacherName.replace(/老师$/, '')}老师评语</h4>
                <div class="comment-editable" contenteditable="true" id="comment-${student.name}-overall">${comment}</div>
            </div>
            
            <div class="report-course-section">
                <h4>📚 学习内容汇总</h4>
                ${contentSummaryText}
                ${courseImagesHtml}
            </div>
            
            <div class="report-footer">
                <span class="footer-brand editable-footer" contenteditable="true" data-student="${student.name}" data-lesson="overall" onblur="updateAllFooterText(this)">${configData.footerText}</span>
                <span>${formatDate(new Date())}</span>
            </div>
            
            <button class="download-btn-no-print" onclick="downloadOverallReport('${displayName}')">📥 下载</button>
        </div>
    `;
}

function editTeacherInfo() {
    document.getElementById('teacher-modal').style.display = 'flex';
}

// 格式化日期为【2026/6/7】格式
function formatDate(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}/${month}/${day}`;
}

// 一键应用标题到所有报告
function applyTitleToAll() {
    const titleInput = document.getElementById('report-title-input');
    const newTitle = titleInput.value.trim();
    
    if (!newTitle) {
        alert('请输入报告标题');
        return;
    }
    
    // 更新所有报告卡片的标题
    document.querySelectorAll('.report-title').forEach(titleEl => {
        titleEl.textContent = newTitle;
    });
    
    alert('标题已应用到所有报告！');
}

// 更新所有报告的底部文字
function updateAllFooterText(element) {
    const newText = element.textContent.trim();
    if (!newText) return;
    
    // 更新所有报告的底部文字
    document.querySelectorAll('.editable-footer').forEach(span => {
        span.textContent = newText;
    });
    
    // 更新configData
    configData.footerText = newText;
}

function closeModal() {
    document.getElementById('teacher-modal').style.display = 'none';
}

function handleAvatarUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        originalAvatarImage = e.target.result;
        teacherAvatarDataURL = e.target.result;
        document.getElementById('avatar-preview').src = teacherAvatarDataURL;
        
        // 显示剪裁控件
        document.getElementById('avatar-crop-controls').style.display = 'block';
        document.getElementById('crop-preview-image').src = originalAvatarImage;
        
        // 重置剪裁参数
        document.getElementById('crop-scale').value = 1;
        document.getElementById('crop-offset-x').value = 50;
        document.getElementById('crop-offset-y').value = 50;
        
        updateCropPreview();
    };
    reader.readAsDataURL(file);
}

function updateCropPreview() {
    if (!originalAvatarImage) return;
    
    const scale = parseFloat(document.getElementById('crop-scale').value);
    const offsetX = parseInt(document.getElementById('crop-offset-x').value);
    const offsetY = parseInt(document.getElementById('crop-offset-y').value);
    
    const cropImage = document.getElementById('crop-preview-image');
    cropImage.style.transform = `scale(${scale})`;
    cropImage.style.objectPosition = `${offsetX}% ${offsetY}%`;
}

function applyCrop() {
    if (!originalAvatarImage) return;
    
    const scale = parseFloat(document.getElementById('crop-scale').value);
    const offsetX = parseInt(document.getElementById('crop-offset-x').value);
    const offsetY = parseInt(document.getElementById('crop-offset-y').value);
    
    // 创建canvas进行剪裁
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 200;
    canvas.height = 200;
    
    const img = new Image();
    img.onload = function() {
        // 计算剪裁区域
        const cropSize = Math.min(img.width, img.height) / scale;
        const centerX = img.width * (offsetX / 100);
        const centerY = img.height * (offsetY / 100);
        
        const startX = Math.max(0, centerX - cropSize / 2);
        const startY = Math.max(0, centerY - cropSize / 2);
        
        ctx.drawImage(img, startX, startY, cropSize, cropSize, 0, 0, 200, 200);
        
        teacherAvatarDataURL = canvas.toDataURL('image/png');
        document.getElementById('avatar-preview').src = teacherAvatarDataURL;
        
        // 隐藏剪裁控件
        document.getElementById('avatar-crop-controls').style.display = 'none';
        
        alert('剪裁已应用！');
    };
    img.src = originalAvatarImage;
}

function saveTeacherInfo() {
    const name = document.getElementById('teacher-name-input').value;
    const avatar = teacherAvatarDataURL || document.getElementById('avatar-preview').src;
    const oldName = configData.teacherName;

    // 更新页面顶部的老师信息
    document.getElementById('teacher-name').textContent = name;
    document.getElementById('teacher-avatar').src = avatar;
    
    // 更新 configData
    configData.teacherName = name;
    configData.teacherAvatar = avatar;
    
    // 更新所有报告卡片中的老师信息
    document.querySelectorAll('.report-teacher-info span').forEach(el => {
        el.textContent = name;
    });
    document.querySelectorAll('.teacher-avatar-small').forEach(el => {
        el.src = avatar;
    });
    
    // 更新评语标题中的老师姓名
    document.querySelectorAll('.comment-title').forEach(el => {
        const oldTeacherName = el.dataset.teacherName;
        if (oldTeacherName) {
            // 移除原姓名末尾的"老师"后缀（如果有的话），然后替换
            const oldNameWithoutSuffix = oldTeacherName.replace(/老师$/, '');
            const newNameWithoutSuffix = name.replace(/老师$/, '');
            el.textContent = el.textContent.replace(oldNameWithoutSuffix + '老师评语', newNameWithoutSuffix + '老师评语');
            el.dataset.teacherName = name;
        }
    });
    
    // 更新评语中的老师署名（如果评语中有老师署名的话）
    document.querySelectorAll('.comment-editable').forEach(el => {
        if (oldName && el.textContent.includes(oldName)) {
            el.textContent = el.textContent.replace(new RegExp(oldName, 'g'), name);
        }
    });
    
    fetch('config.json', {
        method: 'PUT',
        body: JSON.stringify({ ...configData, teacherName: name, teacherAvatar: avatar }, null, 2)
    }).catch(() => {
        alert('配置保存成功（前端）');
    });

    closeModal();
}

document.querySelectorAll('.subject-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        currentSubject = btn.dataset.subject;
        updateUI();
    });
});

document.querySelectorAll('.level-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        currentLevel = btn.dataset.level;
        updateUI();
    });
});

document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        currentMode = btn.dataset.mode;
        updateUI();
    });
});

document.getElementById('upload-box').addEventListener('dragover', (e) => {
    e.preventDefault();
    document.getElementById('upload-box').classList.add('dragover');
});

document.getElementById('upload-box').addEventListener('dragleave', () => {
    document.getElementById('upload-box').classList.remove('dragover');
});

document.getElementById('upload-box').addEventListener('drop', (e) => {
    e.preventDefault();
    document.getElementById('upload-box').classList.remove('dragover');
    const files = Array.from(e.dataTransfer.files);
    files.forEach(file => {
        if (!uploadedFiles.find(f => f.name === file.name)) {
            uploadedFiles.push(file);
        }
    });
    renderUploadedFiles();
});

window.addEventListener('load', init);
window.onclick = (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
};
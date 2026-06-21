let currentSubject = 'math';
let currentLevel = 'L1';
let currentLesson = '1';
let outlineData = null;
let configData = null;
let versionHistory = null;
let imagesList = [];
let imageUrlMap = {};
let levelConfig = {
    levels: ['L1', 'L2', 'L3', 'L4'],
    levelNames: {},
    levelHidden: {}
};

// 初始化所有数据结构（确保页面加载时就有正确的数据）
function initializeData() {
    console.log('初始化数据结构...');
    
    if (!outlineData) {
        outlineData = {
            math: {
                lessons: {
                    L1: {
                        "1": { title: "第1讲：神秘图形的密码", keyPoints: ["图案规律", "数量规律", "交替规律"], summary: "本讲聚焦小学低年级核心图形规律，培养孩子有序观察与逻辑推理思维，核心掌握三大解题方法：周期规律、数量规律、交替规律。", image: "数学-L1-第1讲.png" },
                        "2": { title: "第2讲：美少女的代换术", keyPoints: ["多换一", "一换多"], summary: "本讲聚焦等量代换入门，培养孩子对应思维与分组计数能力，核心掌握两大解题方法：多换一和一换多。", image: "数学-L1-第2讲.png" },
                        "3": { title: "第3讲：这支队伍有多长", keyPoints: ["基数和序数", "求总人数", "求部分人数"], summary: "本讲学习基数序数与排队问题，培养孩子有序计数与实际应用能力，核心知识点：基数与序数、排队求总人数、排队求部分人数。", image: "数学-L1-第3讲.png" },
                        "4": { title: "第4讲：图形到底有多少", keyPoints: ["立体图形", "平面图形", "图形计数", "图形规律"], summary: "本讲是平面与立体图形综合课，建立孩子空间感知与有序计数能力，核心内容：图形认知、图形特性、图形计数。", image: "数学-L1-第4讲.png" },
                        "5": { title: "第5讲：唇枪舌剑话矛盾", keyPoints: ["简单语言推理", "矛盾语言推理"], summary: "本讲学习简单语言推理，培养孩子逻辑思维与信息分析能力，核心掌握两大推理方法：连线法和矛盾法。", image: "数学-L1-第5讲.png" }
                    },
                    L2: {
                        "1": { title: "第1讲：图形有几个", keyPoints: ["数线段", "数三角形", "数正方形"], summary: "本讲学习有序计数核心方法，培养孩子不重不漏的有序思考能力，核心掌握：数线段、数三角形、数正方形。", image: "数学-L2-第1讲.png" },
                        "2": { title: "第2讲：从终点出发", keyPoints: ["一半问题求原来", "一半问题求部分"], summary: "本讲聚焦一半问题，通过画图法建立孩子数形结合思维，解决逆向思考难题，核心掌握：一半问题求原来、一半问题求部分。", image: "数学-L2-第2讲.png" },
                        "3": { title: "第3讲：阿拉伯的数", keyPoints: ["明确大小的枚举", "数位差的枚举"], summary: "本讲学习有序枚举法，培养孩子严谨的逻辑思维和分类讨论能力，核心掌握：明确大小的枚举、数位差的枚举。", image: "数学-L2-第3讲.png" },
                        "4": { title: "第4讲：镜中对称", keyPoints: ["镜中对称初步", "镜中对称进阶", "镜中对称应用"], summary: "本讲学习镜面对称知识，建立孩子空间想象能力和对称思维，核心内容：镜中对称初步、镜中对称进阶、镜中对称应用。", image: "数学-L2-第4讲.png" },
                        "5": { title: "第5讲：鸡兔傍地走", keyPoints: ["图解鸡兔同笼", "鸡兔同笼变形"], summary: "本讲学习经典鸡兔同笼问题，通过画图法将抽象问题具象化，培养孩子转化思维，核心掌握：图解鸡兔同笼、鸡兔同笼变形。", image: "数学-L2-第5讲.png" }
                    },
                    L3: {
                        "1": { title: "第1讲：我在戈壁滩植树", keyPoints: ["两端植树问题", "一端植树问题", "两端不植树问题"], summary: "本讲系统学习植树问题三大核心模型，培养孩子建模思维与实际应用能力，核心掌握：两端植树、一端植树、两端不植树。", image: "数学-L3-第1讲.png" },
                        "2": { title: "第2讲：一锤定音与三局两胜", keyPoints: ["一半问题求原来", "一半问题求部分"], summary: "本讲深化一半问题解题方法，通过画图法强化数形结合与逆向思考能力，核心掌握：一半问题求原来、一半问题求部分。", image: "数学-L3-第2讲.png" },
                        "3": { title: "第3讲：一眼分辨真与假", keyPoints: ["矛盾分析法", "矛盾法进阶"], summary: "本讲学习矛盾分析法，提升孩子逻辑推理与信息甄别能力，核心掌握：基础矛盾法、矛盾法进阶。", image: "数学-L3-第3讲.png" },
                        "4": { title: "第4讲：古埃及的密码阵", keyPoints: ["辐射型数阵图特点", "解题方法"], summary: "本讲专攻辐射型数阵图，培养孩子数感与整体运算思维，核心掌握：辐射型数阵图特点、两大解题方法。", image: "数学-L3-第4讲.png" },
                        "5": { title: "第5讲：鸡和兔的新商机", keyPoints: ["图解鸡兔同笼", "鸡兔同笼变形"], summary: "本讲巩固图解鸡兔同笼方法，培养孩子转化思维与具象化解题能力，核心掌握：标准图解法、变形题解法。", image: "数学-L3-第5讲.png" }
                    },
                    L4: {
                        "1": { title: "第1讲：数形结合百般好", keyPoints: ["奇数数串", "偶数数串"], summary: "本讲学习连续奇偶数串求和，通过数形结合建立直观理解，提升速算能力，核心掌握：奇数数串、偶数数串。", image: "数学-L4-第1讲.png" },
                        "2": { title: "第2讲：图形世界的\"人口普查\"", keyPoints: ["打枪法", "数多层三角形", "数多层长方形"], summary: "本讲深化有序计数方法，解决复杂图形计数问题，培养不重不漏的思考习惯，核心掌握：基础打枪法、多层图形计数。", image: "数学-L4-第2讲.png" },
                        "3": { title: "第3讲：算数的\"快捷通道\"", keyPoints: ["带符号搬家", "添去括号", "乘法分配律"], summary: "本讲系统学习四则运算巧算核心技巧，提升计算速度与准确率，核心掌握：带符号搬家、添去括号法则、乘法分配律。", image: "数学-L4-第3讲.png" },
                        "4": { title: "第4讲：有序思考排得快", keyPoints: ["支付问题", "撕邮票问题"], summary: "本讲学习枚举法在实际问题中的应用，培养有序分类与严谨推理能力，核心掌握：支付问题、撕邮票问题。", image: "数学-L4-第4讲.png" },
                        "5": { title: "第5讲：几何三剑客", keyPoints: ["三角形内角和", "多边形内角和"], summary: "本讲学习三角形与多边形内角和，建立几何图形的量化认知，培养空间思维，核心掌握：三角形内角和、多边形内角和。", image: "数学-L4-第5讲.png" }
                    }
                }
            },
            chinese: {
                lessons: {
                    L1: {
                        "1": { title: "第1讲：笨狼成长奇遇", keyPoints: ["“故事称号法”介绍人物", "“懂得乐于助人心肠好，防人之心不可少”的道理。", "立体的人物"], summary: "本讲带孩子走进笨狼的趣味故事，培养人物分析与写作表达能力，解决介绍人物千篇一律、抓不住核心特点的痛点，核心掌握 “故事称号法”，用精准称号概括人物，结合具体事例支撑，让人物形象更鲜明。本讲完成阅读量 4550 字，积累 \"口\" 字旁相关字词。", image: "语文-L1-第1讲.png" },
                        "2": { title: "第2讲：笨狼学习之旅", keyPoints: ["三画法写景色类看图写话", "部首识字", "深刻的主旨"], summary: "本讲了解笨狼学画画、学游泳的故事，明白人不可貌相，海水不可斗量的道理。核心掌握三画法写景色类看图写话。", image: "语文-L1-第2讲.jpg" },
                        "3": { title: "第3讲：笨狼生活风波", keyPoints: ["找盖饭法写犯错类看图写话", "部首识字", "高级的手法"], summary: "本讲阅读笨狼使用门铃和电话，偷走聪明兔书本的故事，明白错误是成长路上特别的脚印。核心掌握找盖饭法写犯错类看图写话。", image: "语文-L1-第3讲.png" },
                        "4": { title: "第4讲：《没头脑和不高兴》", keyPoints: ["人事理法讲故事", "字族识字", "立体的人物"], summary: "本讲了解没头脑设计三百层大楼却不安装电梯、不高兴成为演员却不配合表演的故事，学会积千累万，不如养个好习惯的道理。核心掌握人事理法讲故事。", image: "语文-L1-第4讲.jpg" },
                        "5": { title: "第5讲：《没头脑和不高兴》", keyPoints: ["小手小脚法写活动类看图写话", "字族识字", "高级的手法"], summary: "本讲阅读小喇叭闹闹的故事，明白要尊重他人，讲文明懂礼貌的道理。核心掌握小手小脚法写活动类看图写话。", image: "语文-L1-第5讲.jpg" }
                    },
                    L2: {
                        "1": { title: "第1讲：认识迷你特工鼠小弟", keyPoints: ["有点事法介绍人物", "立体的人物", "迁移运用"], summary: "本讲了解斯图尔特虽然长相独特，但他依旧热爱生活，努力帮助他人的情节。明白每个人都是独特的。核心掌握有点事法介绍人物。", image: "语文-L2-第1讲.jpg" },
                        "2": { title: "第2讲：鼠猫惊魂吊环对决", keyPoints: ["大拆小法写活动类看图写话", "深刻的主旨", "迁移运用"], summary: "本讲了解斯图尔特被困卷帘，家人努力寻找他的情节，感受亲情的力量。核心掌握大拆小法写活动类看图写话。", image: "语文-L2-第2讲.jpg" },
                        "3": { title: "第3讲：双向奔赴的友情", keyPoints: ["童话法写想象类看图写话", "高级的手法", "迁移运用"], summary: "本讲了解斯图尔特与小鸟玛加洛之间互相帮助的故事，了解到真正的友情是双向的付出与守护。核心掌握童话法写想象类看图写话。", image: "语文-L2-第3讲.jpg" },
                        "4": { title: "第4讲：《洋葱头历险记》", keyPoints: ["问决心法写解决问题类看图写话", "立体的人物", "迁移运用"], summary: "本讲了解洋葱头帮助南瓜老大爷守护小房子的故事，思考强与弱的含义，懂得不能恃强凌弱的道理。核心掌握问决心法写解决问题类看图写话。", image: "语文-L2-第4讲.jpg" },
                        "5": { title: "第5讲：《洋葱头历险记》", keyPoints: ["举例法表达观点", "高级的手法", "迁移运用"], summary: "本讲了解洋葱头等好人齐心协力建立全新的蔬菜水果王国的故事，明白团结就是力量。核心掌握举例法表达观点。", image: "语文-L2-第5讲.jpg" }
                    },
                    L3: {
                        "1": { title: "第1讲：寻找奥兹大作战", keyPoints: ["泰式礼仪法表看法评价", "深刻的主旨", "迁移运用"], summary: "本讲认识新伙伴狮子，了解狮子的心愿，解决一路上遇到的危险并最终到达绿宝石城，面见奥兹。核心掌握泰式礼仪法表看法评价。", image: "语文-L3-第1讲.png" },
                        "2": { title: "第2讲：邪恶女巫使阴谋", keyPoints: ["法国点心法赏析修辞", "高级的手法", "迁移运用"], summary: "本讲与多萝西一行人智斗坏女巫，揭穿奥兹的真实面目，懂得不要迷信权威，要靠自己寻求真相的道理。核心掌握法国点心法赏析修辞。", image: "语文-L3-第2讲.png" },
                        "3": { title: "第3讲：实现心愿大冒险", keyPoints: ["困难折线法写想象文", "迁移运用"], summary: "本讲和多萝西一起实现回家的梦想，实现三位伙伴的心愿，了解成长就是从依赖他人到相信自己的过程。核心掌握困难折线法写想象文。", image: "语文-L3-第3讲.png" },
                        "4": { title: "第4讲：治世之能臣，乱世之奸雄——曹操", keyPoints: ["环形图法概述故事", "立体的人物", "辩证看待"], summary: "本讲学习《三国演义》的作者及文学常识，了解曹操奸诈狡猾且勇猛善战的立体形象，学会辩证地看待一个人。核心掌握环形图法概述故事。", image: "语文-L3-第4讲.png" },
                        "5": { title: "第5讲：英雄莫问出处，匡扶汉室之路——刘备", keyPoints: ["双气泡图绘制", "人物分析", "对比异同"], summary: "本讲了解刘备弘毅宽厚、知人善任的品质，学习人物分析的方法并进行双气泡图绘制，对比两位人物的异同。核心掌握双气泡图绘制。", image: "语文-L3-第5讲.png" }
                    },
                    L4: {
                        "1": { title: "第1讲：叛逆富少离家出走", keyPoints: ["法国点心法赏析修辞", "立体的人物", "迁移运用"], summary: "本讲掌握《鲁滨逊漂流记》的作品作者信息，梳理鲁滨逊四次冒险经历，感受其坚强不屈，百折不挠的精神。核心掌握法国点心法赏析修辞。", image: "语文-L4-第1讲.png" },
                        "2": { title: "第2讲：落魄商人荒岛求生", keyPoints: ["法式店铺法鉴赏人物描写", "深刻的主旨", "迁移运用"], summary: "本讲了解鲁滨逊如何凭借智慧与行动在荒岛上生存，并成功建立属于自己的生活基地。核心掌握法式店铺法鉴赏人物描写。", image: "语文-L4-第2讲.png" },
                        "3": { title: "第3讲：异乡浪人重归文明", keyPoints: ["困难制造法写成长类作文", "高级的手法", "迁移运用"], summary: "本讲了解鲁滨逊离开荒岛的过程，以及重返家乡后的生活变化，理清全书故事内容。核心掌握困难制造法写成长类作文。", image: "语文-L4-第3讲.png" },
                        "4": { title: "第4讲：粗中有细，花和尚鲁智深", keyPoints: ["感觉放大器创作方法", "多角度赏析", "人物形象"], summary: "本讲了解《水浒传》的作品及作者信息，了解鲁智深的基本信息，探究鲁智深拳打镇关西的故事情节及前因后果。核心掌握感觉放大器创作方法。", image: "语文-L4-第4讲.jpg" },
                        "5": { title: "第5讲：忍辱负重，豹子头林冲", keyPoints: ["环境描写的作用", "人物分析", "情节探索"], summary: "本讲了解林冲的基本信息，探索林冲误入白虎堂、发配沧州以及风雪山神庙的过程。核心掌握环境描写的作用。", image: "语文-L4-第5讲.jpg" }
                    }
                }
            }
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

// 云开发配置（已禁用，使用 Railway 后端）
let cloudbaseApp = null;
console.log('使用 Railway 后端模式，云开发已禁用');

// 后端API地址（使用 Railway 后端）
const API_BASE_URL = window.location.origin.includes('localhost') 
    ? 'http://localhost:3000/api' 
    : '/api';

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
            // 安全合并数据，保留默认结构，只合并有实际内容的数据
            if (parsed.math && parsed.math.lessons) {
                for (const level of Object.keys(parsed.math.lessons)) {
                    if (parsed.math.lessons[level]) {
                        for (const lesson of Object.keys(parsed.math.lessons[level])) {
                            const savedLesson = parsed.math.lessons[level][lesson];
                            // 只有当保存的数据有实际内容时才覆盖
                            if (savedLesson && (savedLesson.title || savedLesson.keyPoints?.length || savedLesson.summary || savedLesson.image)) {
                                if (!outlineData.math.lessons[level]) {
                                    outlineData.math.lessons[level] = {};
                                }
                                outlineData.math.lessons[level][lesson] = {
                                    ...outlineData.math.lessons[level][lesson],
                                    ...savedLesson
                                };
                            }
                        }
                    }
                }
            }
            if (parsed.chinese && parsed.chinese.lessons) {
                for (const level of Object.keys(parsed.chinese.lessons)) {
                    if (parsed.chinese.lessons[level]) {
                        for (const lesson of Object.keys(parsed.chinese.lessons[level])) {
                            const savedLesson = parsed.chinese.lessons[level][lesson];
                            // 只有当保存的数据有实际内容时才覆盖
                            if (savedLesson && (savedLesson.title || savedLesson.keyPoints?.length || savedLesson.summary || savedLesson.image)) {
                                if (!outlineData.chinese.lessons[level]) {
                                    outlineData.chinese.lessons[level] = {};
                                }
                                outlineData.chinese.lessons[level][lesson] = {
                                    ...outlineData.chinese.lessons[level][lesson],
                                    ...savedLesson
                                };
                            }
                        }
                    }
                }
            }
            // 合并 levels 字段
            if (parsed.math?.levels) {
                outlineData.math.levels = parsed.math.levels;
            }
            if (parsed.chinese?.levels) {
                outlineData.chinese.levels = parsed.chinese.levels;
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

// 学科配置相关函数
function renderSubjectList() {
    const container = document.getElementById('subject-list');
    if (!container) return;
    
    const subjects = ['math', 'chinese'];
    
    container.innerHTML = subjects.map(subjectKey => {
        const subjectData = outlineData[subjectKey];
        const name = subjectData?.name || (subjectKey === 'math' ? '数学' : '语文');
        const hidden = subjectData?.hidden || false;
        
        return `
            <div class="subject-item ${hidden ? 'hidden' : ''}" data-subject="${subjectKey}">
                <div class="subject-icon ${subjectKey}">${subjectKey === 'math' ? '数' : '语'}</div>
                <div class="subject-info">
                    <input type="text" class="subject-name-input" 
                           value="${name}" 
                           onchange="updateSubjectName('${subjectKey}', this.value)"
                           placeholder="输入学科名称">
                </div>
                <div class="subject-toggle">
                    <span class="subject-toggle-label">${hidden ? '已隐藏' : '显示中'}</span>
                    <div class="toggle-switch ${!hidden ? 'active' : ''}" 
                         onclick="toggleSubjectVisibility('${subjectKey}')">
                    </div>
                </div>
                ${hidden ? '<span class="hidden-badge">已隐藏</span>' : ''}
            </div>
        `;
    }).join('');
}

function updateSubjectName(subjectKey, newName) {
    if (!outlineData[subjectKey]) {
        outlineData[subjectKey] = { lessons: {} };
    }
    outlineData[subjectKey].name = newName;
    console.log(`学科 ${subjectKey} 名称已更新为: ${newName}`);
}

function toggleSubjectVisibility(subjectKey) {
    if (!outlineData[subjectKey]) {
        outlineData[subjectKey] = { lessons: {} };
    }
    outlineData[subjectKey].hidden = !outlineData[subjectKey].hidden;
    renderSubjectList();
}

function saveSubjectConfig() {
    // 保存到服务器
    if (API_BASE_URL) {
        fetch(`${API_BASE_URL}/outline`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(outlineData)
        }).then(response => {
            if (response.ok) {
                console.log('学科配置已保存到服务器');
            }
        }).catch(e => {
            console.error('保存学科配置失败:', e);
        });
    }
    
    // 保存到本地缓存
    localStorage.setItem('outlineData', JSON.stringify(outlineData));
    alert('学科配置已保存！\n老师端刷新页面后将同步更新。');
}

// 年级配置相关函数
async function loadLevelConfig() {
    try {
        // 优先从API加载
        if (API_BASE_URL) {
            const response = await fetch(`${API_BASE_URL}/levels`);
            if (response.ok) {
                const data = await response.json();
                levelConfig.levels = data.levels || ['L1', 'L2', 'L3', 'L4'];
                levelConfig.levelNames = data.levelNames || {};
                console.log('从API加载年级配置成功:', levelConfig);
                return;
            }
        }
        
        // 从configData中获取
        if (configData && configData.levels) {
            levelConfig.levels = configData.levels;
            levelConfig.levelNames = configData.levelNames || {};
        } else {
            // 使用默认值
            levelConfig.levels = ['L1', 'L2', 'L3', 'L4'];
            levelConfig.levelNames = {};
        }
        console.log('年级配置:', levelConfig);
    } catch (e) {
        console.error('加载年级配置失败:', e);
        levelConfig.levels = ['L1', 'L2', 'L3', 'L4'];
        levelConfig.levelNames = {};
    }
}

function renderLevelList() {
    const container = document.getElementById('level-list');
    if (!container) return;
    
    if (levelConfig.levels.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #888;">暂无年级配置</p>';
        return;
    }
    
    container.innerHTML = levelConfig.levels.map((level, index) => {
        const displayName = levelConfig.levelNames[level] || level;
        const isHidden = levelConfig.levelHidden?.[level] || false;
        // 检查该年级在哪些学科中，如果 levels 字段不存在，默认不在该学科中
        const mathLevels = outlineData.math?.levels;
        const chineseLevels = outlineData.chinese?.levels;
        const inMath = mathLevels ? mathLevels.includes(level) : false;
        const inChinese = chineseLevels ? chineseLevels.includes(level) : false;
        const subjectTags = [];
        if (inMath) subjectTags.push('<span class="subject-tag math-tag">数学</span>');
        if (inChinese) subjectTags.push('<span class="subject-tag chinese-tag">语文</span>');
        
        const canMoveUp = index > 0;
        const canMoveDown = index < levelConfig.levels.length - 1;
        
        return `
            <div class="level-item ${isHidden ? 'hidden-level' : ''}" data-level="${level}">
                <div class="level-info">
                    <input type="text" class="level-name-input" 
                           value="${displayName}" 
                           onchange="updateLevelName('${level}', this.value)"
                           placeholder="输入年级显示名称">
                    <div class="level-subjects">
                        ${subjectTags.join('')}
                    </div>
                </div>
                <div class="level-actions">
                    <div class="level-toggle">
                        <span class="toggle-label">${isHidden ? '已隐藏' : '显示中'}</span>
                        <div class="toggle-switch ${!isHidden ? 'active' : ''}" 
                             onclick="toggleLevelVisibility('${level}')">
                        </div>
                    </div>
                    <div class="reorder-buttons">
                        <button class="reorder-btn up-btn" ${!canMoveUp ? 'disabled' : ''} 
                                onclick="moveLevelUp('${level}')" title="上移">
                            ↑
                        </button>
                        <button class="reorder-btn down-btn" ${!canMoveDown ? 'disabled' : ''} 
                                onclick="moveLevelDown('${level}')" title="下移">
                            ↓
                        </button>
                    </div>
                    <button class="delete-level-btn" onclick="deleteLevel('${level}')">删除</button>
                </div>
            </div>
        `;
    }).join('');
}

function toggleLevelVisibility(level) {
    if (!levelConfig.levelHidden) {
        levelConfig.levelHidden = {};
    }
    levelConfig.levelHidden[level] = !levelConfig.levelHidden[level];
    console.log(`年级 ${level} 隐藏状态: ${levelConfig.levelHidden[level]}`);
    renderLevelList();
}

function moveLevelUp(level) {
    const index = levelConfig.levels.indexOf(level);
    if (index > 0) {
        // 交换位置
        const temp = levelConfig.levels[index];
        levelConfig.levels[index] = levelConfig.levels[index - 1];
        levelConfig.levels[index - 1] = temp;
        
        // 同步更新各学科的 levels
        if (outlineData.math?.levels) {
            const mathIndex = outlineData.math.levels.indexOf(level);
            if (mathIndex > 0) {
                const temp = outlineData.math.levels[mathIndex];
                outlineData.math.levels[mathIndex] = outlineData.math.levels[mathIndex - 1];
                outlineData.math.levels[mathIndex - 1] = temp;
            }
        }
        if (outlineData.chinese?.levels) {
            const chineseIndex = outlineData.chinese.levels.indexOf(level);
            if (chineseIndex > 0) {
                const temp = outlineData.chinese.levels[chineseIndex];
                outlineData.chinese.levels[chineseIndex] = outlineData.chinese.levels[chineseIndex - 1];
                outlineData.chinese.levels[chineseIndex - 1] = temp;
            }
        }
        
        renderLevelList();
    }
}

function moveLevelDown(level) {
    const index = levelConfig.levels.indexOf(level);
    if (index < levelConfig.levels.length - 1) {
        // 交换位置
        const temp = levelConfig.levels[index];
        levelConfig.levels[index] = levelConfig.levels[index + 1];
        levelConfig.levels[index + 1] = temp;
        
        // 同步更新各学科的 levels
        if (outlineData.math?.levels) {
            const mathIndex = outlineData.math.levels.indexOf(level);
            if (mathIndex < outlineData.math.levels.length - 1) {
                const temp = outlineData.math.levels[mathIndex];
                outlineData.math.levels[mathIndex] = outlineData.math.levels[mathIndex + 1];
                outlineData.math.levels[mathIndex + 1] = temp;
            }
        }
        if (outlineData.chinese?.levels) {
            const chineseIndex = outlineData.chinese.levels.indexOf(level);
            if (chineseIndex < outlineData.chinese.levels.length - 1) {
                const temp = outlineData.chinese.levels[chineseIndex];
                outlineData.chinese.levels[chineseIndex] = outlineData.chinese.levels[chineseIndex + 1];
                outlineData.chinese.levels[chineseIndex + 1] = temp;
            }
        }
        
        renderLevelList();
    }
}

function updateLevelName(level, newName) {
    levelConfig.levelNames[level] = newName;
    console.log(`年级 ${level} 名称已更新为: ${newName}`);
}

function deleteLevel(level) {
    if (levelConfig.levels.length <= 1) {
        alert('至少需要保留一个年级！');
        return;
    }
    
    if (confirm(`确定要删除年级 ${level} 吗？\n注意：这不会删除该年级的大纲数据，只是从列表中移除。`)) {
        levelConfig.levels = levelConfig.levels.filter(l => l !== level);
        delete levelConfig.levelNames[level];
        
        // 从各学科的 levels 中也移除
        if (outlineData.math?.levels) {
            outlineData.math.levels = outlineData.math.levels.filter(l => l !== level);
        }
        if (outlineData.chinese?.levels) {
            outlineData.chinese.levels = outlineData.chinese.levels.filter(l => l !== level);
        }
        
        renderLevelList();
    }
}

function addNewLevel() {
    const levelNameInput = document.getElementById('new-level-name');
    const addToMath = document.getElementById('add-level-math')?.checked ?? true;
    const addToChinese = document.getElementById('add-level-chinese')?.checked ?? true;
    
    const levelName = levelNameInput.value.trim();
    
    if (!levelName) {
        alert('请输入年级显示名称');
        return;
    }
    
    // 自动生成年级代号
    let maxNum = -1;
    levelConfig.levels.forEach(level => {
        const match = level.match(/^L(\d+)$/);
        if (match) {
            const num = parseInt(match[1]);
            if (num > maxNum) maxNum = num;
        }
    });
    const levelId = `L${maxNum + 1}`;
    
    // 添加到全局年级列表
    levelConfig.levels.push(levelId);
    levelConfig.levelNames[levelId] = levelName;
    
    // 添加到对应学科的 levels 中
    const subjects = [];
    if (addToMath) {
        if (!outlineData.math) outlineData.math = { lessons: {} };
        if (!outlineData.math.levels) outlineData.math.levels = [...levelConfig.levels];
        if (!outlineData.math.levels.includes(levelId)) outlineData.math.levels.push(levelId);
        subjects.push('数学');
    }
    if (addToChinese) {
        if (!outlineData.chinese) outlineData.chinese = { lessons: {} };
        if (!outlineData.chinese.levels) outlineData.chinese.levels = [...levelConfig.levels];
        if (!outlineData.chinese.levels.includes(levelId)) outlineData.chinese.levels.push(levelId);
        subjects.push('语文');
    }
    
    // 清空输入框
    levelIdInput.value = '';
    levelNameInput.value = '';
    
    renderLevelList();
    alert(`年级 ${levelId} 已添加到：${subjects.join('、')}`);
}

async function saveLevelConfig() {
    try {
        // 同时更新configData
        configData.levels = levelConfig.levels;
        configData.levelNames = levelConfig.levelNames;
        configData.levelHidden = levelConfig.levelHidden || {};
        
        // 保存全局年级配置到API
        if (API_BASE_URL) {
            const response = await fetch(`${API_BASE_URL}/levels`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(levelConfig)
            });
            
            if (response.ok) {
                console.log('年级配置已保存到服务器');
            }
            
            // 同时保存 outlineData（包含每个学科的 levels）
            const outlineResponse = await fetch(`${API_BASE_URL}/outline`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(outlineData)
            });
            
            if (outlineResponse.ok) {
                console.log('大纲数据（含学科年级配置）已保存到服务器');
            }
        }
        
        // 保存到本地缓存
        localStorage.setItem('levelConfig', JSON.stringify(levelConfig));
        localStorage.setItem('configData', JSON.stringify(configData));
        localStorage.setItem('outlineData', JSON.stringify(outlineData));
        
        alert('年级配置已保存！\n发布后老师端将同步更新。');
    } catch (e) {
        console.error('保存年级配置失败:', e);
        alert('保存失败：' + e.message);
    }
}

function getLevelDisplayName(level) {
    return levelConfig.levelNames[level] || level;
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
        
        // 加载年级配置
        await loadLevelConfig();
        
        // 如果数据加载成功，合并到默认数据（默认数据优先，只有有实际内容的数据才覆盖）
        if (outline && outline.math && outline.chinese) {
            // 合理合并数据，默认数据（第五版）优先
            // 只有当加载的数据有实际内容时才覆盖默认数据
            const mergedData = JSON.parse(JSON.stringify(outlineData)); // 从默认数据开始
            
            // 合并数学数据 - 遍历所有实际存在的级别
            if (outline.math?.lessons) {
                for (const level of Object.keys(outline.math.lessons)) {
                    if (outline.math.lessons[level]) {
                        for (const lesson of Object.keys(outline.math.lessons[level])) {
                            const savedLesson = outline.math.lessons[level][lesson];
                            // 只有当保存的数据有实际内容时才覆盖
                            if (savedLesson && (savedLesson.title || savedLesson.keyPoints?.length || savedLesson.summary || savedLesson.image)) {
                                if (!mergedData.math.lessons[level]) {
                                    mergedData.math.lessons[level] = {};
                                }
                                mergedData.math.lessons[level][lesson] = {
                                    ...mergedData.math.lessons[level][lesson],
                                    ...savedLesson
                                };
                            }
                        }
                    }
                }
            }
            
            // 合并语文数据 - 遍历所有实际存在的级别
            if (outline.chinese?.lessons) {
                for (const level of Object.keys(outline.chinese.lessons)) {
                    if (outline.chinese.lessons[level]) {
                        for (const lesson of Object.keys(outline.chinese.lessons[level])) {
                            const savedLesson = outline.chinese.lessons[level][lesson];
                            // 只有当保存的数据有实际内容时才覆盖
                            if (savedLesson && (savedLesson.title || savedLesson.keyPoints?.length || savedLesson.summary || savedLesson.image)) {
                                if (!mergedData.chinese.lessons[level]) {
                                    mergedData.chinese.lessons[level] = {};
                                }
                                mergedData.chinese.lessons[level][lesson] = {
                                    ...mergedData.chinese.lessons[level][lesson],
                                    ...savedLesson
                                };
                            }
                        }
                    }
                }
            }
            
            // 合并 levels 字段（保留每个学科自己定义的年级列表）
            if (outline.math?.levels) {
                mergedData.math.levels = outline.math.levels;
            }
            if (outline.chinese?.levels) {
                mergedData.chinese.levels = outline.chinese.levels;
            }
            
            outlineData = mergedData;
            console.log('已从后端/数据库加载并合并大纲数据');
            saveToStorage();  // 同步到本地缓存
        } else {
            console.log('后端API/数据库不可用，使用默认数据（第五版）');
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
        '语文-L0-第1讲.png', '语文-L0-第2讲.png', '语文-L0-第3讲.png', '语文-L0-第4讲.png', '语文-L0-第5讲.png',
        '语文-L1-第1讲.png', '语文-L1-第2讲.jpg', '语文-L1-第3讲.png', '语文-L1-第4讲.jpg', '语文-L1-第5讲.jpg',
        '语文-L2-第1讲.jpg', '语文-L2-第2讲.jpg', '语文-L2-第3讲.jpg', '语文-L2-第4讲.jpg', '语文-L2-第5讲.jpg',
        '语文-L3-第1讲.png', '语文-L3-第2讲.png', '语文-L3-第3讲.png', '语文-L3-第4讲.png', '语文-L3-第5讲.png',
        '语文-L4-第1讲.png', '语文-L4-第2讲.png', '语文-L4-第3讲.png', '语文-L4-第4讲.jpg', '语文-L4-第5讲.jpg'
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
    
    // 尝试从API获取图片列表
    try {
        const response = await fetch(`${API_BASE_URL}/images`);
        if (response.ok) {
            const apiImages = await response.json();
            imagesList = [...new Set([...predefinedImages, ...apiImages])];
            console.log('从API加载图片列表成功');
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
    ensureDataStructure();
    renderLevelButtons('outline-level-selector', 'images-level-selector');
    renderLessonButtons();
    populateImageSelect();
    renderLessonData();
    renderImagesGrid();
}

// 渲染年级按钮
function renderLevelButtons(outlineSelectorId, imagesSelectorId) {
    const outlineSelector = document.getElementById(outlineSelectorId);
    const imagesSelector = document.getElementById(imagesSelectorId);
    
    // 优先使用当前学科的 levels，如果没有就用全局的
    let levels = levelConfig.levels || ['L1', 'L2', 'L3', 'L4'];
    if (outlineData[currentSubject] && outlineData[currentSubject].levels && outlineData[currentSubject].levels.length > 0) {
        levels = outlineData[currentSubject].levels;
    }
    
    // 生成按钮HTML
    const buttonsHtml = levels.map(level => {
        const displayName = levelConfig.levelNames[level] || level;
        const isActive = level === currentLevel;
        return `<button class="level-btn ${isActive ? 'active' : ''}" data-level="${level}">${displayName}</button>`;
    }).join('');
    
    if (outlineSelector) {
        outlineSelector.innerHTML = buttonsHtml;
        
        // 重新绑定点击事件
        outlineSelector.querySelectorAll('.level-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                closeImagePreview();
                closePublishModal();
                outlineSelector.querySelectorAll('.level-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                currentLevel = this.dataset.level;
                updateUI();
            });
        });
    }
    
    if (imagesSelector) {
        imagesSelector.innerHTML = buttonsHtml;
        
        // 重新绑定点击事件
        imagesSelector.querySelectorAll('.level-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                closeImagePreview();
                closePublishModal();
                imagesSelector.querySelectorAll('.level-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                currentLevel = this.dataset.level;
                renderImagesGrid();
            });
        });
    }
}

// 确保数据结构始终正确
function ensureDataStructure() {
    const globalLevels = levelConfig.levels || ['L1', 'L2', 'L3', 'L4'];
    
    // 确保 outlineData 存在
    if (!outlineData) {
        outlineData = {};
    }
    
    // 初始化年级的 lessons 对象
    const initLessonsObj = (levels) => {
        const obj = {};
        levels.forEach(level => {
            obj[level] = {};
        });
        return obj;
    };
    
    // 确保 math 存在，并保留 name、hidden、levels 字段
    if (!outlineData.math) {
        outlineData.math = { 
            name: '数学', 
            hidden: false, 
            levels: ['L1', 'L2', 'L3', 'L4'], 
            lessons: initLessonsObj(['L1', 'L2', 'L3', 'L4']) 
        };
    } else {
        if (!outlineData.math.name) outlineData.math.name = '数学';
        if (outlineData.math.hidden === undefined) outlineData.math.hidden = false;
        if (!outlineData.math.levels) outlineData.math.levels = ['L1', 'L2', 'L3', 'L4'];
    }
    
    // 确保 chinese 存在，并保留 name、hidden、levels 字段
    if (!outlineData.chinese) {
        outlineData.chinese = { 
            name: '语文', 
            hidden: false, 
            levels: ['L1', 'L2', 'L3', 'L4'], 
            lessons: initLessonsObj(['L1', 'L2', 'L3', 'L4']) 
        };
    } else {
        if (!outlineData.chinese.name) outlineData.chinese.name = '语文';
        if (outlineData.chinese.hidden === undefined) outlineData.chinese.hidden = false;
        if (!outlineData.chinese.levels) outlineData.chinese.levels = ['L1', 'L2', 'L3', 'L4'];
    }
    
    // 获取每个学科自己的 levels
    const mathLevels = outlineData.math.levels;
    const chineseLevels = outlineData.chinese.levels;
    
    // 确保 lessons 存在（使用学科自己的 levels）
    if (!outlineData.math.lessons) {
        outlineData.math.lessons = initLessonsObj(mathLevels);
    }
    if (!outlineData.chinese.lessons) {
        outlineData.chinese.lessons = initLessonsObj(chineseLevels);
    }
    
    // 确保每个级别存在（只为学科自己 levels 中的年级创建）
    for (const level of mathLevels) {
        if (!outlineData.math.lessons[level]) {
            outlineData.math.lessons[level] = {};
        }
    }
    for (const level of chineseLevels) {
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
    cleanExcessLessons();
    
    const lessonTabs = document.querySelector('.lesson-tabs');
    const lessons = outlineData[currentSubject]?.lessons[currentLevel] || {};
    
    // 始终显示5个讲次按钮（第1讲~第5讲）
    const allLessons = ['1', '2', '3', '4', '5'];
    
    // 确定当前活动的讲次
    let activeKey = currentLesson;
    if (activeKey && !allLessons.includes(activeKey)) {
        activeKey = '1';
        currentLesson = '1';
    }
    
    // 生成所有5个讲次按钮
    lessonTabs.innerHTML = allLessons.map((key) => `
        <button class="lesson-btn ${key === activeKey ? 'active' : ''}" data-lesson="${key}">第${key}讲</button>
    `).join('');
}

// 讲次按钮点击处理（事件委托）
function handleLessonButtonClick(e) {
    const btn = e.target;
    if (!btn.classList.contains('lesson-btn')) return;
    
    // 关闭可能打开的模态框
    closeImagePreview();
    closePublishModal();
    
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
    
    grid.innerHTML = filteredImages.map(img => `
        <div class="image-card" onclick="previewImage('${img}')" ondblclick="selectImage('${img}')">
            <img src="${getImageUrl(img)}" alt="${img}">
            <div class="image-info">
                <p>${img}</p>
            </div>
            <button class="delete-image-btn" onclick="event.stopPropagation(); deleteImage('${img}')" title="删除图片">
                ✕
            </button>
        </div>
    `).join('');
}

function selectImage(img) {
    document.getElementById('image-select').value = img;
    updateImagePreview();
}

function deleteImage(filename) {
    if (!confirm(`确定要删除图片 "${filename}" 吗？此操作无法撤销。`)) {
        return;
    }
    
    fetch(`${API_BASE_URL}/image/${encodeURIComponent(filename)}`, {
        method: 'DELETE'
    }).then(response => response.json()).then(data => {
        if (data.success) {
            imagesList = imagesList.filter(img => img !== filename);
            delete imageUrlMap[filename];
            saveToStorage();
            renderImagesGrid();
            populateImageSelect();
            alert('图片删除成功！');
        } else {
            alert('删除失败：' + data.message);
        }
    }).catch(error => {
        console.error('删除图片失败:', error);
        alert('删除失败，请重试');
    });
}

// 获取图片URL（优先从映射表获取，否则使用API路径）
function getImageUrl(imgName) {
    if (imageUrlMap[imgName]) {
        return imageUrlMap[imgName];
    }
    // 对中文文件名进行URL编码
    const encodedName = encodeURIComponent(imgName);
    return `${API_BASE_URL}/image/${encodedName}`;
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
        
        // 上传图片到后端API（优先使用）
        let uploadSuccess = false;
        let errorMsg = '';
        
        // 优先使用后端API上传
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
                        // 如果没有返回URL，使用API路径
                        imageUrlMap[fileName] = `${API_BASE_URL}/image/${encodeURIComponent(fileName)}`;
                    }
                    uploadSuccess = true;
                    console.log(`图片 ${fileName} 上传到后端成功`);
                } else {
                    console.error(`图片 ${fileName} 后端上传失败，尝试其他方案`);
                }
            } catch (e) {
                errorMsg = e.message || '后端上传失败';
                console.error(`图片 ${fileName} 后端上传失败:`, e);
            }
        }
        
        // 如果后端上传失败，尝试云存储（仅在云开发环境可用时）
        if (!uploadSuccess && cloudbaseApp && typeof cloudbaseApp.storage === 'function') {
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
                errorMsg = '';
            } catch (e) {
                errorMsg = e.message || '云存储上传失败';
                console.error(`图片 ${fileName} 云存储上传失败:`, e);
            }
        }
        
        // 如果以上都失败，尝试base64方案
        if (!uploadSuccess) {
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
        
        // 纯本地环境，使用API路径
        if (!uploadSuccess) {
            console.log(`本地环境：图片 ${fileName} 使用API路径`);
            imageUrlMap[fileName] = `${API_BASE_URL}/image/${encodeURIComponent(fileName)}`;
            uploadSuccess = true;
        }
        
        if (uploadSuccess) {
            uploadSuccessCount++;
            // 将新上传的图片添加到全局图片列表（无论是否识别成功都保留）
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
                    results.push({ fileName, success: false, message: '未找到匹配的讲次，但图片已保存到选择列表' });
                }
            } else {
                unmatchedCount++;
                results.push({ fileName, success: false, message: '无法识别文件名格式，但图片已保存到选择列表' });
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
    // 移除扩展名（支持更多格式）
    const nameWithoutExt = fileName.replace(/\.(png|jpg|jpeg|gif|webp|bmp)$/i, '');
    
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
    
    // 获取当前版本
    const currentVersion = configData?.currentVersion || '';
    
    list.innerHTML = history.map(v => {
        const isCurrent = v.version === currentVersion;
        const canDelete = history.length > 1 && !isCurrent;
        return `
            <div class="version-card">
                <div class="version-header">
                    <span class="version-tag">${v.version}</span>
                    ${isCurrent ? '<span class="current-badge">当前版本</span>' : ''}
                    <span class="version-date">${v.date}</span>
                </div>
                <div class="version-info">
                    <span class="subject-badge">${v.subject === 'both' ? '数学 + 语文' : (v.subject === 'math' ? '数学' : '语文')}</span>
                    <p class="version-description">${v.description}</p>
                </div>
                ${canDelete ? `
                    <div class="version-actions">
                        <button class="delete-version-btn" onclick="deleteVersion('${v.version}')">删除版本</button>
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');
}

async function deleteVersion(version) {
    if (!confirm(`确定要删除版本 ${version} 吗？此操作不可撤销。`)) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/version/${version}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            const result = await response.json();
            versionHistory = result.versionHistory;
            renderVersions();
            alert(`版本 ${version} 已成功删除`);
        } else {
            const error = await response.json();
            alert(error.error || '删除失败');
        }
    } catch (e) {
        console.error('删除版本失败:', e);
        alert('删除版本失败：' + e.message);
    }
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

    // 确保学科数据结构完整，保留 name、hidden、levels 字段
    if (!outlineData[currentSubject]) {
        outlineData[currentSubject] = { 
            name: currentSubject === 'math' ? '数学' : '语文',
            hidden: false,
            levels: [...levelConfig.levels],
            lessons: {} 
        };
    } else {
        if (!outlineData[currentSubject].name) outlineData[currentSubject].name = currentSubject === 'math' ? '数学' : '语文';
        if (outlineData[currentSubject].hidden === undefined) outlineData[currentSubject].hidden = false;
        if (!outlineData[currentSubject].levels) outlineData[currentSubject].levels = [...levelConfig.levels];
    }
    
    if (!outlineData[currentSubject].lessons) {
        outlineData[currentSubject].lessons = {};
    }
    if (!outlineData[currentSubject].lessons[currentLevel]) {
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
                configData.levels = levelConfig.levels;
                configData.levelNames = levelConfig.levelNames;
                
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
            // 使用后端API（本地开发环境）
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
                configData.levels = levelConfig.levels;
                configData.levelNames = levelConfig.levelNames;
                
                const configResponse = await fetch(`${API_BASE_URL}/config`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(configData)
                });

                if (configResponse.ok) {
                    console.log('配置已更新到后端');
                }
            } else {
                // 纯本地环境，保存到本地文件
                console.log('纯本地环境，尝试保存到服务器文件...');
                try {
                    // 尝试使用相对路径保存
                    if (updateMath || updateChinese) {
                        await fetch('/api/outline', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(outlineData)
                        });
                        console.log('大纲数据已保存到服务器');
                    }
                    
                    configData.currentVersion = newVersion;
                    configData.lastPublishTime = dateStr;
                    configData.levels = levelConfig.levels;
                    configData.levelNames = levelConfig.levelNames;
                    
                    await fetch('/api/config', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(configData)
                    });
                    console.log('配置已更新到服务器');
                } catch (e) {
                    console.log('保存到服务器失败，仅保存到本地存储');
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
    
    if (sectionId === 'levels') {
        renderLevelList();
    } else if (sectionId === 'subjects') {
        renderSubjectList();
    }
}

// 初始化标志，防止重复绑定
let isInitialized = false;

function bindEventListeners() {
    // 防止重复绑定
    if (isInitialized) {
        console.log('事件已绑定，跳过重复绑定');
        return;
    }
    isInitialized = true;
    
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            closeImagePreview();
            closePublishModal();
            showSection(btn.dataset.section);
        });
    });

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            closeImagePreview();
            closePublishModal();
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentSubject = this.dataset.subject;
            updateUI();
        });
    });

    // 年级按钮事件已在 renderLevelButtons 中动态绑定

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
    
    console.log('事件绑定完成');
}

// 只在DOMContentLoaded时初始化一次
document.addEventListener('DOMContentLoaded', function() {
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
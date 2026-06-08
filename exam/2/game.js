const SUBJECT_NAMES = ["语文", "数学", "英语", "外语"];
const CHINESE = 0, MATH = 1, ENGLISH = 2, FOREIGN = 3;
const SUBJECT_COUNT = 3;

const CLASS_TYPE = {
    SCIENCE: 'science',   // 理科班：只学数学
    ARTS: 'arts',         // 文科班：学语文、英语
    COMPREHENSIVE: 'comprehensive', // 综合班：学语数英
    BELT: 'belt'          // 一带一路班：学语数英+外语
};

// 挑战模式定义
const CHALLENGES = {
    'sensitive': {
        id: 'sensitive',
        name: '敏感',
        description: '所有生心理减益效果加倍'
    },
    'qualified': {
        id: 'qualified',
        name: '合格',
        description: '<60分即进入补差班'
    },
    'physical_defect': {
        id: 'physical_defect',
        name: '生理缺陷',
        description: '生理状态无法高于15'
    },
    'addiction': {
        id: 'addiction',
        name: '上瘾',
        description: '玩游戏后只能睡觉或继续玩'
    },
    'strict_teacher': {
        id: 'strict_teacher',
        name: '严师',
        description: '不做作业一定会联系家长'
    },
    'accident': {
        id: 'accident',
        name: '意外',
        description: '每周开始时会发生一些小意外'
    },
    'rebellion': {
        id: 'rebellion',
        name: '叛逆',
        description: '禁止做作业'
    },
    'focus': {
        id: 'focus',
        name: '专注',
        description: '禁止玩耍'
    }
};

// 成就定义
const ACHIEVEMENTS = {
    'perfect': {
        id: 'perfect',
        name: '完美',
        description: '期末总评有一科满分',
        type: 'perfect'  // 特殊类型：单科满分
    },
    'excellent': {
        id: 'excellent',
        name: '优秀',
        description: '期末总评得分率>=90%',
        threshold: 90
    },
    'good': {
        id: 'good',
        name: '良好',
        description: '期末总评得分率>=80%',
        threshold: 80
    },
    'pass': {
        id: 'pass',
        name: '合格',
        description: '期末总评得分率>=60%',
        threshold: 60
    },
    'last_breath': {
        id: 'last_breath',
        name: '功亏一篑',
        description: '在第16周猝死或自杀',
        type: 'last_breath'  // 特殊类型：第16周死亡
    },
    'show_off': {
        id: 'show_off',
        name: '作秀',
        description: '上次考试所有科目均合格时自杀',
        type: 'show_off'  // 特殊类型：合格后自杀
    },
    'sensitive_challenger': {
        id: 'sensitive_challenger',
        name: '敏感挑战者',
        description: '敏感挑战下，期末拿到至少60%分数',
        threshold: 60,
        requiresChallenge: 'sensitive'
    },
    'qualified_challenger': {
        id: 'qualified_challenger',
        name: '合格挑战者',
        description: '合格挑战下，期末拿到至少60%分数',
        threshold: 60,
        requiresChallenge: 'qualified'
    },
    'survivor': {
        id: 'survivor',
        name: '幸存者',
        description: '生理缺陷挑战中，存活到期末总评公布',
        type: 'survivor',
        requiresChallenge: 'physical_defect'
    },
    'beyond_zhang': {
        id: 'beyond_zhang',
        name: '超越张雪峰',
        description: '生理缺陷挑战中，期末总评得分率>=60%',
        threshold: 60,
        requiresChallenge: 'physical_defect'
    },
    'withdrawal': {
        id: 'withdrawal',
        name: '戒断',
        description: '上瘾挑战中，期末总评得分率>=60%',
        threshold: 60,
        requiresChallenge: 'addiction'
    },
    'diligent': {
        id: 'diligent',
        name: '勤奋',
        description: '严师挑战中，期末总评得分率>=60%',
        threshold: 60,
        requiresChallenge: 'strict_teacher'
    },
    'accident_survivor': {
        id: 'accident_survivor',
        name: '意外幸存者',
        description: '意外挑战中，期末总评得分率>=60%',
        threshold: 60,
        requiresChallenge: 'accident'
    },
    'lucky_dog': {
        id: 'lucky_dog',
        name: '狗运',
        description: '启用至少5个挑战，并存活到第3周',
        type: 'challenge_count_survivor',
        minChallenges: 5,
        survivalWeek: 3
    },
    'miracle': {
        id: 'miracle',
        name: '神迹',
        description: '启用至少4个挑战，并存活到期末总评公布',
        type: 'challenge_count_survivor',
        minChallenges: 4,
        survivalWeek: 16  // 期末
    },
    'asleep': {
        id: 'asleep',
        name: '睡着了',
        description: '某次正式考试获得0分',
        type: 'exam_zero'  // 特殊类型：正式考试得0分
    },
    'rapid_progress': {
        id: 'rapid_progress',
        name: '进步神速',
        description: '一次正式考试较上一次进步至少60分',
        type: 'exam_improvement',
        minImprovement: 60  // 至少进步60分
    },
    'study_failure_streak': {
        id: 'study_failure_streak',
        name: '我可太想进步了',
        description: '连续12次学习失败',
        type: 'streak',
        actionType: 'study',
        failureCount: 12
    },
    'homework_failure_streak': {
        id: 'homework_failure_streak',
        name: '我可太想努力了',
        description: '连续12次作业失败',
        type: 'streak',
        actionType: 'homework',
        failureCount: 12
    },
    'lucky_unlucky': {
        id: 'lucky_unlucky',
        name: '幸与不幸',
        description: '所有学科申诉后均增加2分',
        type: 'appeal_all_plus_two'  // 特殊类型：所有学科申诉后均增加2分
    },
    'capital': {
        id: 'capital',
        name: '资本',
        description: '叛逆挑战下，期末总评至少获得40%的分数',
        type: 'challenge_end',
        requiresChallenge: 'rebellion',
        minFinalScorePercent: 40
    },
    'focus': {
        id: 'focus',
        name: '专注',
        description: '专注挑战下，活到期末总评公布',
        type: 'challenge_end',
        requiresChallenge: 'focus'
    }
};

// 称号系统定义（参考Codeforces等级）
const TITLES = [
    { name: 'Newbie', color: '#808080', minPercent: 0 }, // 深灰色，提高对比度
    { name: 'Pupil', color: '#00ff00', minPercent: 6 }, // 亮绿色
    { name: 'Specialist', color: '#00ffff', minPercent: 12 }, // 亮青色
    { name: 'Expert', color: '#0080ff', minPercent: 18 }, // 亮蓝色
    { name: 'Candidate Master', color: '#8000ff', minPercent:  25}, // 亮紫色
    { name: 'Master', color: '#ff8000', minPercent: 32 }, // 橙色
    { name: 'International Master', color: '#ff6000', minPercent: 40 }, // 深橙色
    { name: 'Grandmaster', color: '#ff0000', minPercent: 50 }, // 红色
    { name: 'International Grandmaster', color: '#cc0000', minPercent: 65 }, // 深红色
    { name: 'Legendary Grandmaster', color: 'legendary', minPercent: 85 }, // 第一个词红第二个词白
    { name: 'Top', color: 'top', minPercent: 100 } // 全部完成，特殊标识
];

// 根据进度百分比获取称号
function getTitleByProgress(percent, isComplete) {
    // 如果全部完成，返回Top
    if (isComplete) {
        return TITLES[TITLES.length - 1]; // Top
    }
    
    // 从高到低查找符合条件的称号
    for (let i = TITLES.length - 2; i >= 0; i--) {
        if (percent >= TITLES[i].minPercent) {
            return TITLES[i];
        }
    }
    
    return TITLES[0]; // 默认返回Newbie
}

// 渲染称号HTML
function renderTitleHTML(title) {
    if (title.color === 'legendary') {
        // Legendary Grandmaster: 第一个词红第二个词白（提高对比度）
        const parts = title.name.split(' ');
        if (parts.length >= 2) {
            return `<span style="color: #ff0000; font-weight: bold; text-shadow: 0 0 5px #ff0000;">${parts[0]}</span> <span style="color: #ffffff; font-weight: bold; text-shadow: 0 0 5px #ffffff;">${parts.slice(1).join(' ')}</span>`;
        }
        return `<span style="color: #ff0000; font-weight: bold;">${title.name}</span>`;
    } else if (title.color === 'top') {
        // Top: 特殊标识，金色加粗带发光
        return `<span style="color: #ffd700; font-weight: bold; text-shadow: 0 0 15px #ffd700; font-size: 1.2em;">⭐ ${title.name} ⭐</span>`;
    } else {
        return `<span style="color: ${title.color}; font-weight: bold; text-shadow: 0 0 5px ${title.color};">${title.name}</span>`;
    }
}

// 班级类型名称
const CLASS_NAMES = {
    'science': '理科班',
    'arts': '文科班',
    'comprehensive': '综合班',
    'belt': '一带一路班'
};

// 难度名称
const DIFFICULTY_NAMES = {
    'fantasy': '幻想',
    'easy': '简单',
    'fairly_easy': '较易',
    'medium': '中等',
    'hard': '困难',
    'hell': '地狱',
    'destruction': '毁灭'
};

let currentChallenges = [];

let gameState = null;
let remainingTime = 16;
let messages = [];
let examRevealData = { results: [], revealIndex: 0, totalScore: 0, mentalChange: 0 };
let scoldingData = { subjects: [], showRemedial: false, scoldingType: 'exam' };
let SCOLDING_TEXTS = {
    "homework": {
        "0": [
            "有些人真的是一点也不想学语文。",
            "对于作业还没交的，我不要啦！"
        ],
        "1": [
            "你最近怎么回事啊作业都不交。",
            "提醒一下，图中的同学们今天的数学作业尚未提交(数据更新至今晚21:30)，请图中的同学们记得今晚补上。"
        ],
        "2": [
            "我发现有些同学最近有些松懈啊。",
            "作业都不交整天都在干什么。"
        ],
        "3": [
            "外语作业都不交，你怎么学好外语？",
            "有些同学对外语学习一点也不重视。"
        ]
    },
    "exam": {
        "0": [
            "你是一点语文都不学吗！",
            "有些同学就是在假努力，装作一副很勤奋的样子。"
        ],
        "1": [
            "来来来，过来。￥……&*#（@*",
            "数学考试这个成绩你对得起谁？"
        ],
        "2": [
            "你怎么没有进步啊！",
            "这次没有考好不用担心啊，你已经发挥出了你的水平啊！"
        ],
        "3": [
            "外语成绩这么差，你以后怎么和外国人交流？",
            "外语考试这个分数，你真的用心学了吗？"
        ]
    }
};
let DIFFICULTY_CONFIG = {
    fantasy: { name: "幻想", totalLevel: 95, totalState: 100, weeklyTime: 30 },
    easy: { name: "简单", totalLevel: 90, totalState: 95, weeklyTime: 26 },
    normal: { name: "较易", totalLevel: 85, totalState: 90, weeklyTime: 22 },
    medium: { name: "中等", totalLevel: 80, totalState: 85, weeklyTime: 18 },
    hard: { name: "困难", totalLevel: 75, totalState: 75, weeklyTime: 16 },
    hell: { name: "地狱", totalLevel: 60, totalState: 65, weeklyTime: 15 },
    destruction: { name: "毁灭", totalLevel: 50, totalState: 60, weeklyTime: 14 }
};
let currentDifficulty = 'medium';
let currentClassType = CLASS_TYPE.COMPREHENSIVE;
let configLoaded = false;

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDouble(min, max) {
    return Math.random() * (max - min) + min;
}

// 获取挑战效果倍数
function getChallengeMultiplier() {
    if (gameState && gameState.challenges && gameState.challenges.includes('sensitive')) {
        return 2; // 敏感挑战：减益效果加倍
    }
    return 1;
}

// 获取班级类型的学科索引列表
function getClassSubjects() {
    switch (currentClassType) {
        case CLASS_TYPE.SCIENCE: return [MATH];
        case CLASS_TYPE.ARTS: return [CHINESE, ENGLISH];
        case CLASS_TYPE.COMPREHENSIVE: return [CHINESE, MATH, ENGLISH];
        case CLASS_TYPE.BELT: return [CHINESE, MATH, ENGLISH, FOREIGN];
    }
    return [CHINESE, MATH, ENGLISH];
}

// 获取班级类型的学科数量
function getClassSubjectCount() {
    return getClassSubjects().length;
}

// 获取生理状态上限
function getPhysicalCap() {
    if (gameState.challenges.includes('physical_defect')) {
        return 15;
    }
    return 50;
}

// 获取心理状态上限
function getMentalCap() {
    return 50;
}

function initGame() {
    const diff = DIFFICULTY_CONFIG[currentDifficulty];
    const subjects = getClassSubjects();
    const subjectCount = subjects.length;
    
    gameState = {
        student: {
            chinese_level: 0,
            math_level: 0,
            english_level: 0,
            foreign_level: 0,
            physical_state: 0,
            mental_state: 0
        },
        current_week: 1,
        total_weeks: 16,
        weekly_time: diff.weeklyTime,
        time_reduction: 0,
        game_over: false,
        game_result: "",
        homework_completed: [[], [], [], []],
        usual_weight: [],
        exam_scores: [[], [], [], []],
        weekly_difficulty: [],
        placement_exam_taken: false,
        difficulty: currentDifficulty,
        classType: currentClassType,
        remedial_weeks: [],
        remedial_info: {},
        simulated_exam_done: false,
        challenges: [...currentChallenges],
        is_addicted: false,  // 上瘾状态标记
        study_failure_streak: 0,  // 连续学习失败次数
        homework_failure_streak: 0,  // 连续作业失败次数
        session_achievements: []  // 当前游戏会话中解锁的成就
    };

    // 根据班级类型计算各学科初始水平
    // 总分 = 平均分 × 学科总数
    const totalLevel = diff.totalLevel * subjectCount;
    
    let levels = [];
    for (let i = 0; i < subjectCount; i++) {
        let level = Math.min(100, Math.max(0, randomInt(0, Math.floor(totalLevel / subjectCount))));
        levels.push(level);
    }
    
    // 确保总分接近设定值，微调最后一项
    let sum = levels.reduce((a, b) => a + b, 0);
    if (sum !== totalLevel && levels.length > 0) {
        levels[levels.length - 1] = Math.min(100, Math.max(0, levels[levels.length - 1] + (totalLevel - sum)));
    }
    
    // 随机调换各个学科的分数
    for (let i = levels.length - 1; i > 0; i--) {
        const j = randomInt(0, i);
        [levels[i], levels[j]] = [levels[j], levels[i]];
    }
    
    // 分配到各学科
    subjects.forEach((subj, idx) => {
        switch (subj) {
            case CHINESE: gameState.student.chinese_level = levels[idx]; break;
            case MATH: gameState.student.math_level = levels[idx]; break;
            case ENGLISH: gameState.student.english_level = levels[idx]; break;
            case FOREIGN: gameState.student.foreign_level = levels[idx]; break;
        }
    });

    let total_state = diff.totalState;
    // 确保生心理状态均 >= 15
    const minState = 15;
    const maxRandom = total_state - minState * 2; // 允许随机分配的最大值
    gameState.student.physical_state = Math.min(getPhysicalCap(), minState + randomInt(0, Math.max(0, maxRandom)));
    gameState.student.mental_state = Math.min(getMentalCap(), Math.max(minState, total_state - gameState.student.physical_state));

    for (let i = 0; i < 4; i++) {
        gameState.homework_completed[i] = new Array(gameState.total_weeks).fill(false);
        gameState.usual_weight[i] = randomDouble(0.3, 0.7);
        gameState.exam_scores[i] = [];
    }

    resetWeeklyDifficulty();
    remainingTime = gameState.weekly_time;
    messages = [];
    addMessage("新学期开始了！合理安排时间，平衡学业和身心健康吧！", "info");
}

function resetWeeklyDifficulty() {
    // 生成本周作业难度：3^rand(-1,1)
    const generateDifficulty = () => {
        const exponent = randomDouble(-1, 1);
        return Math.pow(3, exponent);
    };
    gameState.weekly_difficulty = [generateDifficulty(), generateDifficulty(), generateDifficulty(), generateDifficulty()];
}

function getDifficultyText(value) {
    if (value < 0.7) return '简单';
    if (value <= 1.45) return '中等';
    return '困难';
}

function getStatus() {
    return gameState.student.physical_state + gameState.student.mental_state;
}

function getLevel(subject) {
    switch(subject) {
        case CHINESE: return gameState.student.chinese_level;
        case MATH: return gameState.student.math_level;
        case ENGLISH: return gameState.student.english_level;
        case FOREIGN: return gameState.student.foreign_level;
        default: return 0;
    }
}

function setLevel(subject, level) {
    switch(subject) {
        case CHINESE: gameState.student.chinese_level = level; break;
        case MATH: gameState.student.math_level = level; break;
        case ENGLISH: gameState.student.english_level = level; break;
        case FOREIGN: gameState.student.foreign_level = level; break;
    }
}

function addMessage(msg, type = "success") {
    messages.unshift({ text: msg, type: type, time: new Date().toLocaleTimeString() });
    if (messages.length > 20) {
        messages.pop();
    }
    updateMessages();
}

function updateMessages() {
    const container = document.getElementById('message-list');
    container.innerHTML = '';
    messages.forEach(msg => {
        const item = document.createElement('div');
        item.className = `message-item ${msg.type}`;
        item.innerHTML = `<div style="font-size: 0.75rem; color: #999; margin-bottom: 5px;">${msg.time}</div>${msg.text}`;
        container.appendChild(item);
    });
}

function doHomework(subject) {
    if (remainingTime <= 0) {
        addMessage("时间不足！", "error");
        return;
    }

    // 检查是否处于上瘾状态
    if (gameState.challenges.includes('addiction') && gameState.is_addicted) {
        addMessage("上瘾状态下无法做作业！", "error");
        return;
    }

    // 叛逆挑战：禁止做作业
    if (gameState.challenges.includes('rebellion')) {
        addMessage("叛逆状态下无法做作业！", "error");
        return;
    }

    if (gameState.homework_completed[subject][gameState.current_week - 1]) {
        addMessage(`${SUBJECT_NAMES[subject]}作业本周已完成！`, "warning");
        return;
    }

    const status = getStatus();
    const level = getLevel(subject);
    const difficulty = gameState.weekly_difficulty[subject];

    // 成功率 = (学科水平/100)^难度 * sqrt(状态/100)
    const probability = Math.pow(level / 100, difficulty) * Math.sqrt(status / 100);
    
    remainingTime--;
    
    if (Math.random() < probability) {
        gameState.homework_completed[subject][gameState.current_week - 1] = true;
        addMessage(`${SUBJECT_NAMES[subject]}作业完成！(耗时: 1)`, "success");
        // 重置连续失败计数
        gameState.homework_failure_streak = 0;
    } else {
        addMessage(`${SUBJECT_NAMES[subject]}作业失败！(耗时: 1)`, "warning");
        // 增加连续失败计数
        gameState.homework_failure_streak++;
        // 检查是否解锁连续作业失败成就
        checkStreakAchievement('homework', gameState.homework_failure_streak);
    }
    
    updateUI();
    autoSave();
}

function study(subject) {
    if (remainingTime <= 0) {
        addMessage("时间不足！", "error");
        return;
    }

    // 检查是否处于上瘾状态
    if (gameState.challenges.includes('addiction') && gameState.is_addicted) {
        addMessage("上瘾状态下无法学习！", "error");
        return;
    }

    const status = getStatus();
    const level = getLevel(subject);
    
    // 学习成功率 = ((状态/100)^0.75) * (0.99^(学科水平))
    const probability = Math.pow(status / 100, 0.75) * Math.pow(0.99, level);
    
    remainingTime--;
    
    if (Math.random() < probability) {
        const increase = randomInt(1, 5);
        const newLevel = Math.min(100, getLevel(subject) + increase);
        setLevel(subject, newLevel);
        const successMsg = [
            `你感觉你${SUBJECT_NAMES[subject]}水平又精进了！`,
            `你似乎学到了${SUBJECT_NAMES[subject]}中你不会的知识。`
        ];
        addMessage(successMsg[randomInt(0, 1)], "success");
        // 重置连续失败计数
        gameState.study_failure_streak = 0;
    } else {
        const failMsg = [
            `这些${SUBJECT_NAMES[subject]}知识也太简单了，你本来就会。`,
            `你似乎并没有理解这些${SUBJECT_NAMES[subject]}相关知识。`
        ];
        addMessage(failMsg[randomInt(0, 1)], "warning");
        // 增加连续失败计数
        gameState.study_failure_streak++;
        // 检查是否解锁连续学习失败成就
        checkStreakAchievement('study', gameState.study_failure_streak);
    }
    
    updateUI();
    autoSave();
}

function checkStreakAchievement(actionType, streak) {
    // 检查连续失败成就
    const achievements = loadAchievements();
    
    for (let [achKey, ach] of Object.entries(ACHIEVEMENTS)) {
        if (ach.type === 'streak' && ach.actionType === actionType && streak >= ach.failureCount) {
            // 初始化成就数据结构
            if (!achievements[achKey]) achievements[achKey] = {};
            
            // 获取当前班级和难度的索引
            const currentClassIdx = CLASS_ORDER.indexOf(gameState.classType);
            const currentDiffIdx = DIFFICULTY_ORDER.indexOf(gameState.difficulty);
            
            // 检查是否已经解锁当前班级/难度
            const isUnlocked = achievements[achKey][gameState.classType] && 
                              achievements[achKey][gameState.classType][gameState.difficulty];
            
            // 检查是否已解锁任意班级/难度（用于判断是否升级）
            const isAnyUnlocked = Object.keys(CLASS_NAMES).some(c => 
                Object.keys(DIFFICULTY_NAMES).some(d => 
                    achievements[achKey]?.[c]?.[d] === true
                )
            );
            
            if (!isUnlocked) {
                // 解锁当前成就
                if (!achievements[achKey][gameState.classType]) achievements[achKey][gameState.classType] = {};
                achievements[achKey][gameState.classType][gameState.difficulty] = true;
                
                // 根据是否已有任意子成就决定显示消息
                if (isAnyUnlocked) {
                    // 已有其他班级/难度的成就，显示升级
                    addMessage(`⬆️ 成就升级：${ach.name}`, "success");
                } else {
                    // 完全新解锁
                    addMessage(`🏅 解锁成就：${ach.name}`, "success");
                }
                
                // 记录到当前会话成就数组（避免重复）
                if (!gameState.session_achievements.includes(ach.name)) {
                    gameState.session_achievements.push(ach.name);
                }
            } else {
                // 已解锁当前班级/难度，显示再次获得
                addMessage(`🔄 再次获得：${ach.name}`, "info");
            }
            
            // 偏序解锁：解锁更简单的班级和难度
            // 解锁更简单的班级（科目更少）
            for (let i = currentClassIdx - 1; i >= 0; i--) {
                const easierClass = CLASS_ORDER[i];
                if (!achievements[achKey][easierClass]) achievements[achKey][easierClass] = {};
                if (achievements[achKey][easierClass][gameState.difficulty] !== true) {
                    achievements[achKey][easierClass][gameState.difficulty] = true;
                }
            }
            
            // 解锁更简单的难度
            for (let i = currentDiffIdx + 1; i < DIFFICULTY_ORDER.length; i++) {
                const easierDiff = DIFFICULTY_ORDER[i];
                if (!achievements[achKey][gameState.classType]) achievements[achKey][gameState.classType] = {};
                if (achievements[achKey][gameState.classType][easierDiff] !== true) {
                    achievements[achKey][gameState.classType][easierDiff] = true;
                }
            }
            
            // 同时解锁更简单的班级和难度
            for (let c = currentClassIdx - 1; c >= 0; c--) {
                for (let d = currentDiffIdx + 1; d < DIFFICULTY_ORDER.length; d++) {
                    const easierClass = CLASS_ORDER[c];
                    const easierDiff = DIFFICULTY_ORDER[d];
                    if (!achievements[achKey][easierClass]) achievements[achKey][easierClass] = {};
                    if (achievements[achKey][easierClass][easierDiff] !== true) {
                        achievements[achKey][easierClass][easierDiff] = true;
                    }
                }
            }
            
            // 保存成就
            saveAchievements(achievements);
        }
    }
}

function play() {
    if (remainingTime <= 0) {
        addMessage("时间不足！", "error");
        return;
    }

    // 专注挑战：禁止玩耍
    if (gameState.challenges.includes('focus')) {
        addMessage("专注状态下无法玩耍！", "error");
        return;
    }

    remainingTime--;
    const increase = randomInt(0, 4) * 2 - 1;
    gameState.student.mental_state = Math.min(50, Math.max(0, gameState.student.mental_state + increase));
    
    // 上瘾挑战：玩游戏后标记为上瘾状态
    if (gameState.challenges.includes('addiction')) {
        gameState.is_addicted = true;
        addMessage(`玩耍快乐！心理状态+${increase}（已上瘾，只能睡觉或继续玩）`, "success");
        // 立即更新按钮状态，不等待updateUI
        updateHomeworkButtons();
    } else {
        if (increase >= 0) {
            addMessage(`玩耍快乐！心理状态+${increase}`, "success");
        } else {
            addMessage(`玩耍消耗！心理状态${increase}`, "warning");
        }
    }
    
    updateUI();
    autoSave();
}

// 意外事件处理函数
function generateAccident() {
    const accidentTypes = [
        {
            id: 1,
            title: '军训通知',
            description: '你去参加军训了。',
            execute: function() {
                const value = randomInt(1, 10);
                gameState.student.physical_state = Math.max(0, gameState.student.physical_state - value);
                return { result: `生理-${value}`, showValue: true };
            }
        },
        {
            id: 2,
            title: '情感打击',
            description: '你发现你的男朋友是女同！',
            execute: function() {
                const value = randomInt(1, 10);
                gameState.student.mental_state = Math.max(0, gameState.student.mental_state - value);
                return { result: `心理-${value}`, showValue: true };
            }
        },
        {
            id: 3,
            title: '挂科通知',
            description: function() {
                const subjects = ['物理', '化学', '生物', '政治', '历史', '地理', '信息', '艺术', '体育'];
                const subject = subjects[randomInt(0, subjects.length - 1)];
                return `你的${subject}挂科了！`;
            },
            execute: function() {
                const value = randomInt(1, 5);
                gameState.student.mental_state = Math.max(0, gameState.student.mental_state - value);
                return { result: `心理-${value}`, showValue: true };
            }
        },
        {
            id: 4,
            title: '诈骗陷阱',
            description: '你被你的同学诈骗了！',
            execute: function() {
                const value = randomInt(1, 4);
                const subjects = Object.keys(gameState.subjects);
                if (subjects.length > 0) {
                    const randomSubject = subjects[randomInt(0, subjects.length - 1)];
                    gameState.subjects[randomSubject] = Math.max(0, gameState.subjects[randomSubject] - value);
                }
                return { result: '随机学科水平下降', showValue: false };
            }
        },
        {
            id: 5,
            title: '意外收获',
            description: '你捡到了一枚硬币。',
            execute: function() {
                const value = randomInt(1, 3);
                gameState.student.mental_state = Math.min(50, gameState.student.mental_state + value);
                return { result: `心理+${value}`, showValue: true };
            }
        },
        {
            id: 6,
            title: '牌局风云',
            description: '你的朋友邀请你去打牌。',
            execute: function() {
                const value = randomInt(-2, 2);
                gameState.student.mental_state = Math.min(50, Math.max(0, gameState.student.mental_state + value));
                const resultStr = value >= 0 ? `赢了！心理+${value}` : `输了！心理${value}`;
                return { result: resultStr, showValue: true };
            }
        },
        {
            id: 7,
            title: '被抓现行',
            description: '你打牌被发现了！',
            execute: function() {
                const value = randomInt(1, 5);
                gameState.student.physical_state = Math.max(0, gameState.student.physical_state - value);
                return { result: `生理-${value}`, showValue: true };
            }
        },
        {
            id: 8,
            title: '修仙奇遇',
            description: '你捡到了一本修仙指南。',
            execute: function() {
                const value = randomInt(-1, 6);
                gameState.student.physical_state = Math.min(100, Math.max(0, gameState.student.physical_state + value));
                return { result: value >= 0 ? `生理+${value}` : `生理${value}`, showValue: true };
            }
        },
        {
            id: 9,
            title: '顿悟时刻',
            description: '你顿悟了！',
            execute: function() {
                const value = randomInt(1, 3);
                const subjects = Object.keys(gameState.subjects);
                if (subjects.length > 0) {
                    const randomSubject = subjects[randomInt(0, subjects.length - 1)];
                    gameState.subjects[randomSubject] = Math.min(100, gameState.subjects[randomSubject] + value);
                }
                return { result: '随机学科水平上升', showValue: false };
            }
        },
        {
            id: 10,
            title: '社团活动',
            description: '你被拉去参加社团活动了！',
            execute: function() {
                remainingTime = Math.max(0, remainingTime - 1);
                return { result: '时间-1', showValue: true };
            }
        }
    ];
    
    const accident = accidentTypes[randomInt(0, accidentTypes.length - 1)];
    const result = accident.execute();
    
    // 牌局风云特殊处理：将结果合并到描述中
    let description = typeof accident.description === 'function' ? accident.description() : accident.description;
    if (accident.id === 6) { // 牌局风云
        description += result.result;
    }
    
    return {
        title: '发生意外',
        description: description,
        result: result.result,
        showValue: result.showValue,
        isPositive: result.result.includes('+')
    };
}

function sleep(sleepTime) {
    const multiplier = getChallengeMultiplier();
    if (sleepTime <= 0) {
        gameState.student.physical_state = Math.max(0, gameState.student.physical_state - 20 * multiplier);
        addMessage(`未睡觉！生理状态-${20 * multiplier}`, "error");
    } else if (sleepTime <= 7) {
        const reduce = Math.floor(randomInt(7, 10) / sleepTime * multiplier);
        gameState.student.physical_state = Math.max(0, gameState.student.physical_state - reduce);
        addMessage(`睡眠时间不足，生理状态-${reduce}`, "warning");
    } else {
        const increase = sleepTime - 7;
        gameState.student.physical_state = Math.min(getPhysicalCap(), gameState.student.physical_state + increase);
        addMessage(`充足睡眠！生理状态+${increase}`, "success");
    }
    
    // 上瘾挑战：睡觉后清除上瘾状态
    if (gameState.challenges.includes('addiction')) {
        gameState.is_addicted = false;
        addMessage('一觉醒来，你终于戒掉了游戏瘾！', "success");
        updateHomeworkButtons();
    }
}

// 显示意外事件弹窗
function showAccidentModal(accident) {
    // 创建弹窗overlay
    const modal = document.createElement('div');
    modal.className = 'scolding-modal show';  // 使用现有的弹窗样式
    
    // 创建内容容器
    const modalContent = document.createElement('div');
    modalContent.className = 'scolding-content';
    
    // 创建标题
    const title = document.createElement('h2');
    title.innerHTML = '⚠️ ' + accident.title;
    title.style.color = '#e74c3c';
    
    // 创建描述
    const description = document.createElement('div');
    description.className = 'scolding-text';
    description.textContent = accident.description;
    description.style.borderLeftColor = '#f39c12';
    
    // 创建结果区域
    const resultDiv = document.createElement('div');
    resultDiv.style.padding = '15px';
    resultDiv.style.background = accident.result.includes('+') ? '#e8f5e9' : '#fff8e1';
    resultDiv.style.borderRadius = '8px';
    resultDiv.style.marginBottom = '20px';
    
    const resultTitle = document.createElement('div');
    resultTitle.style.fontWeight = 'bold';
    resultTitle.style.marginBottom = '5px';
    resultTitle.textContent = '结果：';
    
    const resultText = document.createElement('div');
    resultText.textContent = accident.showValue ? accident.result : accident.result + '（具体数值未显示）';
    resultText.style.color = accident.result.includes('+') ? '#27ae60' : '#e74c3c';
    
    resultDiv.appendChild(resultTitle);
    resultDiv.appendChild(resultText);
    
    // 创建关闭按钮
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '知道了';
    closeBtn.className = 'restart-btn';
    closeBtn.addEventListener('click', function() {
        modal.remove();
        autoSave();
    });
    
    // 组装弹窗
    modalContent.appendChild(title);
    modalContent.appendChild(description);
    modalContent.appendChild(resultDiv);
    modalContent.appendChild(closeBtn);
    modal.appendChild(modalContent);
    
    // 添加到页面
    document.body.appendChild(modal);
}

function weeklyDecay() {
    const multiplier = getChallengeMultiplier();
    const decay = {
        chinese: randomInt(0, 2),
        math: randomInt(0, 2),
        english: randomInt(0, 2),
        physical: randomInt(0, 2 * multiplier),
        mental: randomInt(0, 2 * multiplier)
    };

    gameState.student.chinese_level = Math.max(0, gameState.student.chinese_level - decay.chinese);
    gameState.student.math_level = Math.max(0, gameState.student.math_level - decay.math);
    gameState.student.english_level = Math.max(0, gameState.student.english_level - decay.english);
    gameState.student.physical_state = Math.max(0, gameState.student.physical_state - decay.physical);
    gameState.student.mental_state = Math.max(0, gameState.student.mental_state - decay.mental);

    addMessage(`每周衰减：生理-${decay.physical} 心理-${decay.mental}`, "info");
}

function applyPhysicalDefectLimit() {
    if (gameState.challenges && gameState.challenges.includes('physical_defect')) {
        if (gameState.student.physical_state > 15) {
            gameState.student.physical_state = 15;
            addMessage(`【生理缺陷】生理状态被限制在15`, "warning");
        }
    }
}

function checkGameOver() {
    if (gameState.student.physical_state <= 5) {
        gameState.game_over = true;
        gameState.game_result = "猝死结局：你的生理状态过低，游戏结束。";
        showGameOver("💀", gameState.game_result, 'death');
        return true;
    }
    if (gameState.student.mental_state <= 5) {
        gameState.game_over = true;
        gameState.game_result = "自杀结局：你的心理状态过低，游戏结束。";
        showGameOver("😢", gameState.game_result, 'suicide');
        return true;
    }
    return false;
}

function showGameOver(title, message, reason = null) {
    // 检测成就
    const achievementResult = checkAchievements(reason);
    
    document.getElementById('gameover-title').textContent = title;
    document.getElementById('gameover-message').textContent = message;
    
    // 显示班级、难度和挑战
    const classNames = {
        [CLASS_TYPE.SCIENCE]: '理科班',
        [CLASS_TYPE.ARTS]: '文科班',
        [CLASS_TYPE.COMPREHENSIVE]: '综合班',
        [CLASS_TYPE.BELT]: '一带一路班'
    };
    const className = classNames[gameState.classType] || '综合班';
    const difficultyName = DIFFICULTY_CONFIG[gameState.difficulty]?.name || '中等';
    let challengeInfo = '';
    if (gameState.challenges && gameState.challenges.length > 0) {
        const challengeNames = gameState.challenges.map(c => CHALLENGES[c]?.name).join(' ');
        challengeInfo = ` | 挑战: ${challengeNames}`;
    }
    document.getElementById('gameover-info').textContent = `${className} | ${difficultyName}${challengeInfo}`;
    
    // 显示新解锁的成就和已获得的成就
    const achievementsDiv = document.getElementById('gameover-achievements');
    const { brandNew, upgraded, existing } = achievementResult;
    
    let achievementsHtml = '';
    
    if (brandNew.length > 0) {
        const newItems = brandNew.map(ach => 
            `<div style="padding: 8px 12px; background: #ffd700; color: #333; border-radius: 6px; font-weight: bold;">🏆 ${ach}</div>`
        ).join('');
        achievementsHtml += `<div style="margin-bottom: 10px;"><div style="color: #ffd700; font-size: 0.95rem; font-weight: bold; margin-bottom: 6px;">✨ 新成就</div><div style="display: flex; flex-direction: column; gap: 4px;">${newItems}</div></div>`;
    }
    
    if (upgraded.length > 0) {
        const upItems = upgraded.map(ach => 
            `<div style="padding: 8px 12px; background: #ff9500; color: #fff; border-radius: 6px; font-weight: bold;">⬆️ ${ach}</div>`
        ).join('');
        achievementsHtml += `<div style="margin-bottom: 10px;"><div style="color: #ff9500; font-size: 0.95rem; font-weight: bold; margin-bottom: 6px;">⬆️ 升级</div><div style="display: flex; flex-direction: column; gap: 4px;">${upItems}</div></div>`;
    }
    
    if (existing.length > 0) {
        const exItems = existing.map(ach => 
            `<div style="padding: 8px 12px; background: #aaa; color: #fff; border-radius: 6px;">🏆 ${ach}</div>`
        ).join('');
        achievementsHtml += `<div><div style="color: #aaa; font-size: 0.95rem; font-weight: bold; margin-bottom: 6px;">已获得</div><div style="display: flex; flex-direction: column; gap: 4px;">${exItems}</div></div>`;
    }
    
    achievementsDiv.innerHTML = achievementsHtml;
    
    document.getElementById('gameover-modal').classList.add('show');
}

function takeExam() {
    let totalScore = 0;
    const results = [];
    const lowScoreSubjects = [];

    // 清空之前的补差班周数
    gameState.remedial_weeks = [];

    for (let subj of getClassSubjects()) {
        const level = getLevel(subj);
        const status = getStatus();
        const baseScore = Math.floor((level * status) / 100);
        const fluctuation = randomInt(-5, 5);
        const finalScore = Math.max(0, Math.min(100, baseScore + fluctuation));

        // 计算分数变化量
        const prevScore = gameState.exam_scores[subj].length > 0 ? gameState.exam_scores[subj][gameState.exam_scores[subj].length - 1] : 50;
        const scoreChange = finalScore - prevScore;

        gameState.exam_scores[subj].push(finalScore);
        totalScore += finalScore;

        // 考试成绩判断是否需要参加补差班
        // 合格挑战：<60分即进入补差班；否则：<=40分
        const remedialThreshold = gameState.challenges.includes('qualified') ? 60 : 40;
        if (finalScore < remedialThreshold) {
            lowScoreSubjects.push(SUBJECT_NAMES[subj]);
        }

        // 计算心态变化：分数变化量/rand(4,12)，向下取整
        const mentalChangeForSubject = scoreChange !== 0 ? Math.floor(scoreChange / randomInt(4, 12)) : 0;

        // 计算名次变化：与全班模拟排名比较（简化为与上一次成绩比较）
        let rankChange = 0; // -1下降, 0不变, 1上升
        if (gameState.exam_scores[subj].length > 1) {
            const prevPrevScore = gameState.exam_scores[subj][gameState.exam_scores[subj].length - 2];
            if (finalScore > prevPrevScore) rankChange = 1;
            else if (finalScore < prevPrevScore) rankChange = -1;
        }

        results.push({ 
            subject: SUBJECT_NAMES[subj], 
            score: finalScore, 
            needClass: finalScore < remedialThreshold, 
            revealed: false,
            scoreChange: scoreChange,
            mentalChange: mentalChangeForSubject,
            rankChange: rankChange,
            appealed: false,
            appealChange: 0,
            subjectIndex: subj
        });
    }

    // 为每门低分数学科，添加接下来4周的补差班标记
    // 使用对象存储：{ week: count }，count表示该周需要补差班的学科数量
    gameState.remedial_info = gameState.remedial_info || {};
    
    for (let w = 1; w <= 4; w++) {
        const targetWeek = gameState.current_week + w;
        if (targetWeek <= gameState.total_weeks) {
            // 每门低分数学科都增加该周的补差班数量
            if (!gameState.remedial_info[targetWeek]) {
                gameState.remedial_info[targetWeek] = 0;
            }
            gameState.remedial_info[targetWeek] += lowScoreSubjects.length;
        }
    }

    // 根据进步分数增加心理状态
    let totalMentalChange = 0;
    results.forEach(r => {
        totalMentalChange += r.mentalChange;
    });
    gameState.student.mental_state = Math.max(0, Math.min(50, gameState.student.mental_state + totalMentalChange));

    examRevealData = {
        results: results,
        totalScore: totalScore,
        mentalChange: totalMentalChange,
        isPlacement: false,
        lowScoreSubjects: lowScoreSubjects
    };

    // 先显示成绩揭晓
    showExamReveal();
}

function showScoldingPage(subjects, scoldingType = 'exam') {
    let scoldingHtml = '';
    
    // 每个科目单独计算心态影响
    const multiplier = getChallengeMultiplier();
    const subjectMentalReductions = {};
    let totalMentalReduction = 0;
    
    if (scoldingType === 'homework') {
        // 作业训导：每个科目心理减少rand(0,3)，独立计算（教师训导不影响生理）
        subjects.forEach(subject => {
            const mentalReduction = randomInt(0, 3 * multiplier);
            subjectMentalReductions[subject] = mentalReduction;
            totalMentalReduction += mentalReduction;
            gameState.student.mental_state = Math.max(0, gameState.student.mental_state - mentalReduction);
        });
        weeklyStateChanges.mental = -totalMentalReduction;
        
        // 严师挑战：不做作业一定会联系家长
        if (gameState.challenges.includes('strict_teacher')) {
            scoldingData.contactParent = true;
        } else {
            // 计算联系家长概率：每科没做作业增加rand(3,11)%
            let contactProbability = 0;
            subjects.forEach(() => {
                contactProbability += randomInt(3, 11) / 100;
            });
            
            // 保存联系家长概率和是否触发
            scoldingData.contactParent = Math.random() < contactProbability;
        }
    } else {
        // 考试训导：每个科目心理减少rand(0,3)，独立计算（教师训导不影响生理）
        subjects.forEach(subject => {
            const mentalReduction = randomInt(0, 3 * multiplier);
            subjectMentalReductions[subject] = mentalReduction;
            totalMentalReduction += mentalReduction;
            gameState.student.mental_state = Math.max(0, gameState.student.mental_state - mentalReduction);
        });
        weeklyStateChanges.mental = -totalMentalReduction;
    }
    
    subjects.forEach((subject, index) => {
        const subjectIndex = SUBJECT_NAMES.indexOf(subject);
        const texts = SCOLDING_TEXTS[scoldingType][subjectIndex];
        const randomText = texts[randomInt(0, texts.length - 1)];
        
        scoldingHtml += `
            <div style="margin-bottom: ${index < subjects.length - 1 ? '20px' : '0'};">
                <strong style="color: #e74c3c;">【${subject}老师】</strong>
                <div class="scolding-text" style="margin-top: 10px;">"${randomText}"</div>
            </div>
        `;
    });
    
    scoldingData = {
        subjects: subjects,
        showRemedial: scoldingType === 'exam',
        scoldingType: scoldingType,
        scoldingTexts: subjects.map(subject => {
            const subjectIndex = SUBJECT_NAMES.indexOf(subject);
            const texts = SCOLDING_TEXTS[scoldingType][subjectIndex];
            return texts[randomInt(0, texts.length - 1)];
        }),
        currentIndex: 0,
        stateChanges: { ...weeklyStateChanges }, // 保存状态变化
        subjectMentalReductions: subjectMentalReductions, // 保存每个科目的心态影响
        contactParent: scoldingData.contactParent || false // 保存联系家长标记
    };
    
    showNextTeacherScolding();
}

function showNextTeacherScolding() {
    const currentIndex = scoldingData.currentIndex || 0;
    const subject = scoldingData.subjects[currentIndex];
    const text = scoldingData.scoldingTexts[currentIndex];
    const isLast = currentIndex >= scoldingData.subjects.length - 1;
    
    // 显示当前科目的心态影响
    let stateChangeHtml = '';
    if (scoldingData.subjectMentalReductions && scoldingData.subjectMentalReductions[subject] !== undefined) {
        const subjectMentalReduction = scoldingData.subjectMentalReductions[subject];
        stateChangeHtml += `<div style="color: #e74c3c; font-size: 1rem;">心理-${subjectMentalReduction}</div>`;
    }
    
    // 如果有生理变化（联系家长），也显示出来
    if (scoldingData.stateChanges && scoldingData.stateChanges.physical !== 0) {
        const physicalChange = scoldingData.stateChanges.physical;
        const physicalSign = physicalChange < 0 ? '' : '+';
        stateChangeHtml += `<div style="color: #e74c3c; font-size: 1rem;">生理${physicalSign}${physicalChange}</div>`;
    }
    
    document.getElementById('scolding-title').textContent = '📋 教师训导';
    
    let html = `
        <div style="text-align: center; margin-bottom: 15px; color: #888; font-size: 0.9rem;">
            ${currentIndex + 1} / ${scoldingData.subjects.length}
        </div>
        <div>
            <strong style="color: #e74c3c; font-size: 1.1rem;">【${subject}老师】</strong>
            <div class="scolding-text" style="margin-top: 15px; font-size: 1rem; line-height: 1.6;">"${text}"</div>
        </div>
        ${stateChangeHtml ? `<div style="margin-top: 15px; text-align: center;">${stateChangeHtml}</div>` : ''}
    `;
    
    document.getElementById('scolding-content').innerHTML = html;
    document.getElementById('scolding-btn').textContent = isLast ? '继续' : '下一位老师';
    document.getElementById('scolding-modal').classList.add('show');
}

function showRemedialClassInfo() {
    // 补差班公布：只显示信息，不扣状态（扣状态由教师训导和家长训导处理）
    let html = '<p style="color: #666; margin-bottom: 20px;">根据本次考试成绩，以下科目需要参加补差班：</p>';
    
    scoldingData.subjects.forEach(subject => {
        html += `
            <div class="remedial-item">
                <span>📚 ${subject}</span><br>
                <span style="font-weight: normal; color: #666;">每周将占用1单位时间</span>
            </div>
        `;
    });
    
    // 有补差班时标记需要家长训导
    if (scoldingData.subjects.length > 0) {
        scoldingData.contactParent = true;
        html += `<p style="margin-top: 15px; color: #e74c3c; font-size: 0.9rem;">📞 已联系家长！</p>`;
    }
    
    html += '<p style="margin-top: 10px; color: #666; font-size: 0.9rem;">（补差班时间将在下周开始计算）</p>';
    
    document.getElementById('remedial-content').innerHTML = html;
    document.getElementById('remedial-modal').classList.add('show');
}

function closeRemedialModal() {
    document.getElementById('remedial-modal').classList.remove('show');
    
    // 如果需要家长训导（有补差班）
    if (scoldingData.contactParent) {
        showParentScolding();
    } else {
        scoldingData = { subjects: [], showRemedial: false };
        weeklyDecay();
        if (checkGameOver()) return;
        completeWeek();
    }
}

function showParentScolding() {
    // 家长训导：生理减少rand(1,7)
    const multiplier = getChallengeMultiplier();
    const physicalReduction = randomInt(1, 7 * multiplier);
    gameState.student.physical_state = Math.max(0, gameState.student.physical_state - physicalReduction);
    weeklyStateChanges.physical = -physicalReduction;
    
    addMessage(`👨‍👩‍👧 家长训导：生理-${physicalReduction}`, "warning");
    
    const parentTexts = [
        "你最近的表现让我们很失望，希望你能更加努力！",
        "学习不是为了别人，是为了你自己的未来！",
        "我们对你寄予厚望，不要让我们失望！",
        "好好反思一下，为什么成绩这么差？",
        "再这样下去，以后怎么办？"
    ];
    
    const randomText = parentTexts[randomInt(0, parentTexts.length - 1)];
    
    let html = `
        <div>
            <strong style="color: #e74c3c; font-size: 1.1rem;">【家长】</strong>
            <div class="scolding-text" style="margin-top: 15px; font-size: 1rem; line-height: 1.6;">"${randomText}"</div>
        </div>
        <div style="margin-top: 15px; text-align: center;">
            <div style="color: #e74c3c; font-size: 1rem;">生理-${physicalReduction}</div>
        </div>
    `;
    
    document.getElementById('scolding-title').textContent = '👨‍👩‍👧 家长训导';
    document.getElementById('scolding-content').innerHTML = html;
    document.getElementById('scolding-btn').textContent = '继续';
    document.getElementById('scolding-btn').onclick = closeParentScolding;
    document.getElementById('scolding-modal').classList.add('show');
}

function closeParentScolding() {
    document.getElementById('scolding-modal').classList.remove('show');
    // 恢复按钮点击事件为 continueAfterScolding
    document.getElementById('scolding-btn').onclick = continueAfterScolding;
    scoldingData = { subjects: [], showRemedial: false, contactParent: false };
    weeklyDecay();
    if (checkGameOver()) return;
    completeWeek();
}

function showExamReveal() {
    let html = '';
    const revealedCount = examRevealData.results.filter(r => r.revealed).length;
    
    examRevealData.results.forEach((r, index) => {
        const cls = r.revealed ? (r.needClass ? 'low-score' : '') : 'unrevealed';
        
        // 根据名次变化设置分数颜色
        let scoreColor = '#333';
        if (r.revealed && r.rankChange !== 0) {
            scoreColor = r.rankChange > 0 ? '#27ae60' : '#e74c3c';
        }
        
        let scoreDisplay = r.revealed ? r.score + '分' : '点击揭晓';
        let changeDisplay = '';
        let appealBtn = '';
        
        if (r.revealed) {
            // 显示分数变化
            if (r.scoreChange !== 0) {
                const changeText = r.scoreChange > 0 ? `(+${r.scoreChange})` : `(${r.scoreChange})`;
                scoreDisplay = `${r.score}分 ${changeText}`;
            }
            
            // 显示心态变化
            if (r.mentalChange !== 0) {
                const mentalText = r.mentalChange > 0 ? `心态+${r.mentalChange}` : `心态${r.mentalChange}`;
                const mentalColor = r.mentalChange > 0 ? '#27ae60' : '#e74c3c';
                changeDisplay = `<div style="font-size: 0.85rem; color: ${mentalColor}; text-align: right;">${mentalText}</div>`;
            }
            
            // 申诉按钮：只有揭露后才能申诉，且只能申诉一次
            if (r.appealed) {
                // 已申诉，显示申诉结果
                if (r.appealChange !== 0) {
                    const appealText = r.appealChange > 0 ? `申诉+${r.appealChange}` : `申诉${r.appealChange}`;
                    appealBtn = `<button class="appeal-btn appealed" disabled style="font-size: 0.8rem; padding: 2px 8px; background: #ccc; border: none; border-radius: 4px; cursor: not-allowed;">${appealText}</button>`;
                } else {
                    appealBtn = `<button class="appeal-btn appealed" disabled style="font-size: 0.8rem; padding: 2px 8px; background: #ccc; border: none; border-radius: 4px; cursor: not-allowed;">申诉无效</button>`;
                }
            } else {
                // 未申诉，显示申诉按钮
                appealBtn = `<button class="appeal-btn" onclick="appealSubjectScore(${index})" style="font-size: 0.8rem; padding: 2px 8px; background: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer;">申诉</button>`;
            }
        }
        
        html += `
            <div class="exam-result-item ${cls}" onclick="revealSubjectScore(${index})" style="cursor: pointer; display: flex; flex-direction: column; align-items: center;">
                <span class="subject">${r.subject}</span>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span class="score" style="text-align: center; color: ${scoreColor}; font-weight: bold;">${scoreDisplay}</span>
                    ${appealBtn}
                </div>
                ${changeDisplay}
            </div>
        `;
    });

    if (revealedCount >= getClassSubjectCount()) {
        html += `
            <div class="exam-total">
                <div class="label">总成绩</div>
                <div class="value">${examRevealData.totalScore}分</div>
                <div style="font-size: 0.9rem; color: #666; margin-top: 5px;">
                    心理状态${examRevealData.mentalChange >= 0 ? '增加' : '减少'}${Math.abs(examRevealData.mentalChange)}点
                </div>
            </div>
        `;
    }

    document.getElementById('exam-results').innerHTML = html;
    document.getElementById('exam-modal').classList.add('show');
    
    const continueBtn = document.getElementById('continue-btn');
    if (continueBtn) {
        continueBtn.style.display = revealedCount >= getClassSubjectCount() ? 'block' : 'none';
        continueBtn.textContent = revealedCount >= getClassSubjectCount() ? '继续游戏' : '继续';
    }
}

function revealSubjectScore(index) {
    if (examRevealData.results[index] && !examRevealData.results[index].revealed) {
        examRevealData.results[index].revealed = true;
        if (examRevealData.isPlacement) {
            showPlacementExamReveal();
        } else if (examRevealData.isSimulated) {
            showSimulatedExamReveal();
        } else {
            showExamReveal();
        }
    }
}

function appealSubjectScore(index) {
    // 阻止事件冒泡，避免触发 revealSubjectScore
    event.stopPropagation();
    
    if (!examRevealData.results[index] || !examRevealData.results[index].revealed) {
        return; // 未揭露的科目不能申诉
    }
    
    if (examRevealData.results[index].appealed) {
        return; // 已经申诉过
    }
    
    // 标记为已申诉
    examRevealData.results[index].appealed = true;
    
    // 生成申诉分数变化，考虑边界问题
    // 申诉范围应该是 rand(-2, 2)，但不能超出 0-100 范围
    const oldScore = examRevealData.results[index].score;
    const minChange = Math.max(-2, -oldScore);  // 不能低于 0 分
    const maxChange = Math.min(2, 100 - oldScore);  // 不能高于 100 分
    const appealChange = randomInt(minChange, maxChange);
    examRevealData.results[index].appealChange = appealChange;
    
    // 更新分数
    const newScore = oldScore + appealChange;
    examRevealData.results[index].score = newScore;
    
    // 更新总分（使用实际分数变化）
    examRevealData.totalScore += appealChange;
    
    // 更新 gameState.exam_scores（如果不是摸底考或模拟考）
    if (!examRevealData.isPlacement && !examRevealData.isSimulated) {
        const subj = examRevealData.results[index].subjectIndex;
        if (subj !== undefined && gameState.exam_scores[subj] && gameState.exam_scores[subj].length > 0) {
            // 更新最后一次考试成绩
            gameState.exam_scores[subj][gameState.exam_scores[subj].length - 1] = newScore;
        }
        
        // 重新计算心理变化
        // 申诉分数变化也会影响心理状态，但影响较小：分数变化/rand(6, 15)
        const appealMentalChange = appealChange !== 0 ? Math.floor(appealChange / randomInt(6, 15)) : 0;
        examRevealData.mentalChange += appealMentalChange;
        gameState.student.mental_state = Math.max(0, Math.min(50, gameState.student.mental_state + appealMentalChange));
        
        // 更新 scoreChange（相对于上一次考试的变化）
        if (gameState.exam_scores[subj] && gameState.exam_scores[subj].length > 1) {
            const prevScore = gameState.exam_scores[subj][gameState.exam_scores[subj].length - 2];
            examRevealData.results[index].scoreChange = newScore - prevScore;
        }
        
        // 检查是否需要补差班（申诉后可能改变）
        const remedialThreshold = gameState.challenges.includes('qualified') ? 60 : 40;
        examRevealData.results[index].needClass = newScore < remedialThreshold;
    }
    
    // 显示消息
    if (appealChange > 0) {
        addMessage(`申诉成功：${examRevealData.results[index].subject} +${appealChange}分`, "success");
    } else if (appealChange < 0) {
        addMessage(`申诉失败：${examRevealData.results[index].subject} ${appealChange}分`, "warning");
    } else {
        addMessage(`申诉无效：${examRevealData.results[index].subject} 分数无变化`, "info");
    }
    
    // 检查"幸与不幸"成就：所有学科申诉后均增加2分
    if (!examRevealData.isPlacement && !examRevealData.isSimulated) {
        checkAppealAchievement();
    }
    
    // 更新显示
    if (examRevealData.isPlacement) {
        showPlacementExamReveal();
    } else if (examRevealData.isSimulated) {
        showSimulatedExamReveal();
    } else {
        showExamReveal();
    }
}

function checkAppealAchievement() {
    // 检查"幸与不幸"成就：所有学科申诉后均增加2分
    if (!examRevealData.results || examRevealData.results.length === 0) return;
    
    const totalSubjects = examRevealData.results.length;
    const appealedCount = examRevealData.results.filter(r => r.appealed).length;
    
    // 检查是否所有学科都已申诉
    if (appealedCount < totalSubjects) {
        console.log(`[幸与不幸] 申诉进度: ${appealedCount}/${totalSubjects}`);
        return;
    }
    
    // 检查是否所有学科申诉后均增加2分
    const appealChanges = examRevealData.results.map(r => r.appealChange);
    const allPlusTwo = examRevealData.results.every(r => r.appealChange === 2);
    
    console.log(`[幸与不幸] 所有学科已申诉，申诉变化: ${appealChanges.join(', ')}`);
    
    if (!allPlusTwo) {
        console.log(`[幸与不幸] 不是所有学科都+2，不触发成就`);
        return;
    }
    
    console.log(`[幸与不幸] 成就触发！所有学科申诉后均增加2分`);
    
    // 解锁成就
    const achievements = loadAchievements();
    const achKey = 'lucky_unlucky';
    const ach = ACHIEVEMENTS[achKey];
    
    if (!achievements[achKey]) {
        achievements[achKey] = {};
    }
    
    // 检查是否已解锁当前班级/难度
    const isUnlocked = achievements[achKey][gameState.classType] && 
                      achievements[achKey][gameState.classType][gameState.difficulty];
    
    if (!isUnlocked) {
        // 解锁当前班级/难度
        if (!achievements[achKey][gameState.classType]) {
            achievements[achKey][gameState.classType] = {};
        }
        achievements[achKey][gameState.classType][gameState.difficulty] = true;
        saveAchievements(achievements);
        
        // 显示消息
        addMessage(`🏅 解锁成就：${ach.name}`, "success");
        
        // 记录到当前会话成就
        if (!gameState.session_achievements.includes(ach.name)) {
            gameState.session_achievements.push(ach.name);
        }
        
        // 偏序解锁
        const currentClassIdx = CLASS_ORDER.indexOf(gameState.classType);
        const currentDiffIdx = DIFFICULTY_ORDER.indexOf(gameState.difficulty);
        
        // 解锁更简单的班级
        for (let i = currentClassIdx - 1; i >= 0; i--) {
            const easierClass = CLASS_ORDER[i];
            if (!achievements[achKey][easierClass]) achievements[achKey][easierClass] = {};
            if (achievements[achKey][easierClass][gameState.difficulty] !== true) {
                achievements[achKey][easierClass][gameState.difficulty] = true;
            }
        }
        
        // 解锁更简单的难度
        for (let i = currentDiffIdx + 1; i < DIFFICULTY_ORDER.length; i++) {
            const easierDiff = DIFFICULTY_ORDER[i];
            if (!achievements[achKey][gameState.classType]) achievements[achKey][gameState.classType] = {};
            if (achievements[achKey][gameState.classType][easierDiff] !== true) {
                achievements[achKey][gameState.classType][easierDiff] = true;
            }
        }
        
        saveAchievements(achievements);
    } else {
        // 已解锁，显示再次获得
        addMessage(`🔄 再次获得：${ach.name}`, "info");
    }
}

function closeExamModal() {
    document.getElementById('exam-modal').classList.remove('show');
    
    if (examRevealData.isPlacement) {
        // 摸底考完成后直接进入游戏
        examRevealData = { results: [], revealIndex: 0, totalScore: 0, mentalChange: 0 };
        updateUI();
        
        // 意外挑战：第一周开始时（摸底考后）随机发生意外事件
        if (gameState.challenges.includes('accident')) {
            const accident = generateAccident();
            showAccidentModal(accident);
            addMessage(`[意外] ${accident.description}`, accident.isPositive ? "success" : "warning");
        }
    } else if (examRevealData.isSimulated) {
        // 模拟考完成后直接更新UI，不影响其他流程
        examRevealData = { results: [], revealIndex: 0, totalScore: 0, mentalChange: 0 };
        updateUI();
    } else {
        // 正式考试：先检查是否有低分科目需要训导
        const lowScoreSubjects = examRevealData.lowScoreSubjects || [];
        examRevealData = { results: [], revealIndex: 0, totalScore: 0, mentalChange: 0 };
        
        // 检查考试相关成就
        checkExamAchievements();
        
        if (lowScoreSubjects.length > 0) {
            showScoldingPage(lowScoreSubjects, 'exam');
        } else {
            weeklyDecay();
            if (checkGameOver()) return;
            completeWeek();
        }
    }
}

function checkExamAchievements() {
    // 检查考试相关成就并在消息界面显示
    const achievements = loadAchievements();
    
    // 获取当前班级和难度的索引
    const currentClassIdx = CLASS_ORDER.indexOf(gameState.classType);
    const currentDiffIdx = DIFFICULTY_ORDER.indexOf(gameState.difficulty);
    
    // 偏序解锁辅助函数
    const unlockPartialAchievements = (achKey, ach) => {
        // 解锁更简单的班级（科目更少）
        for (let i = currentClassIdx - 1; i >= 0; i--) {
            const easierClass = CLASS_ORDER[i];
            if (!achievements[achKey][easierClass]) achievements[achKey][easierClass] = {};
            if (achievements[achKey][easierClass][gameState.difficulty] !== true) {
                achievements[achKey][easierClass][gameState.difficulty] = true;
            }
        }
        
        // 解锁更简单的难度
        for (let i = currentDiffIdx + 1; i < DIFFICULTY_ORDER.length; i++) {
            const easierDiff = DIFFICULTY_ORDER[i];
            if (!achievements[achKey][gameState.classType]) achievements[achKey][gameState.classType] = {};
            if (achievements[achKey][gameState.classType][easierDiff] !== true) {
                achievements[achKey][gameState.classType][easierDiff] = true;
            }
        }
        
        // 同时解锁更简单的班级和难度
        for (let c = currentClassIdx - 1; c >= 0; c--) {
            for (let d = currentDiffIdx + 1; d < DIFFICULTY_ORDER.length; d++) {
                const easierClass = CLASS_ORDER[c];
                const easierDiff = DIFFICULTY_ORDER[d];
                if (!achievements[achKey][easierClass]) achievements[achKey][easierClass] = {};
                if (achievements[achKey][easierClass][easierDiff] !== true) {
                    achievements[achKey][easierClass][easierDiff] = true;
                }
            }
        }
    };
    
    for (let [achKey, ach] of Object.entries(ACHIEVEMENTS)) {
        if (!achievements[achKey]) achievements[achKey] = {};
        
        if (ach.type === 'exam_zero') {
            // 睡着了：检查是否有0分
            let hasZeroScore = false;
            for (let subj = 0; subj < gameState.exam_scores.length; subj++) {
                const scores = gameState.exam_scores[subj];
                if (scores.length > 0 && scores[scores.length - 1] === 0) {
                    hasZeroScore = true;
                    break;
                }
            }
            
            if (hasZeroScore) {
                // 检查是否已解锁任意班级/难度（用于判断是否升级）
                const isAnyUnlocked = Object.keys(CLASS_NAMES).some(c => 
                    Object.keys(DIFFICULTY_NAMES).some(d => 
                        achievements[achKey]?.[c]?.[d] === true
                    )
                );
                
                const isUnlocked = achievements[achKey][gameState.classType] && 
                                  achievements[achKey][gameState.classType][gameState.difficulty];
                
                if (!isUnlocked) {
                    if (!achievements[achKey][gameState.classType]) achievements[achKey][gameState.classType] = {};
                    achievements[achKey][gameState.classType][gameState.difficulty] = true;
                    
                    // 根据是否已有任意子成就决定显示消息
                    if (isAnyUnlocked) {
                        addMessage(`⬆️ 成就升级：${ach.name}`, "success");
                    } else {
                        addMessage(`🏅 解锁成就：${ach.name}`, "success");
                    }
                    
                    // 记录到当前会话成就数组（避免重复）
                    if (!gameState.session_achievements.includes(ach.name)) {
                        gameState.session_achievements.push(ach.name);
                    }
                } else {
                    // 已解锁当前班级/难度，显示再次获得
                    addMessage(`🔄 再次获得：${ach.name}`, "info");
                }
                
                // 始终运行偏序解锁逻辑
                unlockPartialAchievements(achKey, ach);
                saveAchievements(achievements);
            }
        } else if (ach.type === 'exam_improvement') {
            // 进步神速：检查是否进步至少60分
            const minImprovement = ach.minImprovement || 60;
            
            // 计算每次考试的总分
            let maxExamCount = 0;
            for (let subj = 0; subj < gameState.exam_scores.length; subj++) {
                maxExamCount = Math.max(maxExamCount, gameState.exam_scores[subj].length);
            }
            
            const totalScores = [];
            for (let examIdx = 0; examIdx < maxExamCount; examIdx++) {
                let total = 0;
                for (let subj = 0; subj < gameState.exam_scores.length; subj++) {
                    if (gameState.exam_scores[subj][examIdx] !== undefined) {
                        total += gameState.exam_scores[subj][examIdx];
                    }
                }
                totalScores.push(total);
            }
            
            // 检查最近一次考试是否进步
            if (totalScores.length >= 2) {
                const improvement = totalScores[totalScores.length - 1] - totalScores[totalScores.length - 2];
                if (improvement >= minImprovement) {
                    // 检查是否已解锁任意班级/难度（用于判断是否升级）
                    const isAnyUnlocked = Object.keys(CLASS_NAMES).some(c => 
                        Object.keys(DIFFICULTY_NAMES).some(d => 
                            achievements[achKey]?.[c]?.[d] === true
                        )
                    );
                    
                    const isUnlocked = achievements[achKey][gameState.classType] && 
                                      achievements[achKey][gameState.classType][gameState.difficulty];
                    
                    if (!isUnlocked) {
                        if (!achievements[achKey][gameState.classType]) achievements[achKey][gameState.classType] = {};
                        achievements[achKey][gameState.classType][gameState.difficulty] = true;
                        
                        // 根据是否已有任意子成就决定显示消息
                        if (isAnyUnlocked) {
                            addMessage(`⬆️ 成就升级：${ach.name}`, "success");
                        } else {
                            addMessage(`🏅 解锁成就：${ach.name}`, "success");
                        }
                        
                        // 记录到当前会话成就数组（避免重复）
                        if (!gameState.session_achievements.includes(ach.name)) {
                            gameState.session_achievements.push(ach.name);
                        }
                    } else {
                        // 已解锁当前班级/难度，显示再次获得
                        addMessage(`🔄 再次获得：${ach.name}`, "info");
                    }
                    
                    // 始终运行偏序解锁逻辑
                    unlockPartialAchievements(achKey, ach);
                    saveAchievements(achievements);
                }
            }
        }
    }
}

function calculateUsualScore(subject) {
    const completed = gameState.homework_completed[subject].filter(Boolean).length;
    return Math.floor((completed * 100) / gameState.total_weeks);
}

function calculateExamScore(subject) {
    if (gameState.exam_scores[subject].length === 0) return 0;
    const sum = gameState.exam_scores[subject].reduce((a, b) => a + b, 0);
    return Math.floor(sum / gameState.exam_scores[subject].length);
}

function calculateFinalScore(subject) {
    const usual = calculateUsualScore(subject);
    const exam = calculateExamScore(subject);
    return Math.floor(usual * gameState.usual_weight[subject] + exam * (1 - gameState.usual_weight[subject]));
}

function showFinalResults() {
    // 检测成就
    const achievementResult = checkAchievements('final');
    
    const subjects = getClassSubjects();
    const maxScore = 100 * subjects.length;
    
    let html = `
        <h2 style="font-size: 2rem; margin-bottom: 30px;">🎉 学期结束</h2>
        <div style="width: 100%; max-width: none; overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; min-width: 800px;">
                <thead>
                    <tr style="background: #667eea; color: white;">
                        <th style="border: 2px solid #667eea; padding: 15px 30px; text-align: center; font-size: 1.3rem; min-width: 150px;">项目</th>
    `;
    
    for (let subj of subjects) {
        html += `<th style="border: 2px solid #667eea; padding: 15px 30px; text-align: center; font-size: 1.3rem; min-width: 140px;">${SUBJECT_NAMES[subj]}</th>`;
    }
    
    html += `
                    </tr>
                </thead>
                <tbody>
    `;

    // 获取正式考试成绩（排除摸底考）
    const getExamScores = (subject) => {
        const allScores = gameState.exam_scores[subject];
        if (gameState.placement_exam_taken && allScores.length > 0) {
            return allScores.slice(1);
        }
        return allScores;
    };

    // 四次考试成绩合并到一行
    html += `
        <tr style="background: #f9f9f9;">
            <td style="border: 2px solid #ddd; padding: 15px 20px; text-align: center; font-weight: bold; font-size: 1.1rem;">四次考试</td>
    `;
    for (let subj of getClassSubjects()) {
        const scores = getExamScores(subj);
        html += `<td style="border: 2px solid #ddd; padding: 15px 20px; text-align: center; font-size: 1.1rem;">${scores.join(', ')}</td>`;
    }
    html += '</tr>';

    // 作业完成情况
    html += `
        <tr style="background: #fff;">
            <td style="border: 2px solid #ddd; padding: 15px 20px; text-align: center; font-weight: bold; font-size: 1.1rem;">作业完成</td>
    `;
    for (let subj of getClassSubjects()) {
        const completed = gameState.homework_completed[subj].filter(Boolean).length;
        html += `<td style="border: 2px solid #ddd; padding: 15px 20px; text-align: center; font-size: 1.1rem;">${completed}/16</td>`;
    }
    html += '</tr>';

    // 考试成绩
    html += `
        <tr style="background: #f9f9f9;">
            <td style="border: 2px solid #ddd; padding: 15px 20px; text-align: center; font-weight: bold; font-size: 1.1rem;">考试成绩</td>
    `;
    for (let subj of getClassSubjects()) {
        const scores = getExamScores(subj);
        const avg = scores.length > 0 ? Math.floor(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
        html += `<td style="border: 2px solid #ddd; padding: 15px 20px; text-align: center; font-size: 1.1rem;">${avg}</td>`;
    }
    html += '</tr>';

    // 考试占比
    html += `
        <tr style="background: #e8f4fd;">
            <td style="border: 2px solid #ddd; padding: 15px 20px; text-align: center; font-weight: bold; font-size: 1.1rem;">考试占比</td>
    `;
    for (let subj of getClassSubjects()) {
        const examWeight = Math.round((1 - gameState.usual_weight[subj]) * 100);
        html += `<td style="border: 2px solid #ddd; padding: 15px 20px; text-align: center; font-size: 1.1rem; color: #667eea;">${examWeight}%</td>`;
    }
    html += '</tr>';

    // 平时成绩
    html += `
        <tr style="background: #fff;">
            <td style="border: 2px solid #ddd; padding: 15px 20px; text-align: center; font-weight: bold; font-size: 1.1rem;">平时成绩</td>
    `;
    for (let subj of getClassSubjects()) {
        const completed = gameState.homework_completed[subj].filter(Boolean).length;
        const usualScore = Math.round(100 * completed / 16);
        html += `<td style="border: 2px solid #ddd; padding: 15px 20px; text-align: center; font-size: 1.1rem;">${usualScore}</td>`;
    }
    html += '</tr>';

    // 平时占比
    html += `
        <tr style="background: #e8f4fd;">
            <td style="border: 2px solid #ddd; padding: 15px 20px; text-align: center; font-weight: bold; font-size: 1.1rem;">平时占比</td>
    `;
    for (let subj of getClassSubjects()) {
        const usualWeight = Math.round(gameState.usual_weight[subj] * 100);
        html += `<td style="border: 2px solid #ddd; padding: 15px 20px; text-align: center; font-size: 1.1rem; color: #667eea;">${usualWeight}%</td>`;
    }
    html += '</tr>';

    // 总成绩
    let totalScore = 0;
    for (let subj of getClassSubjects()) {
        const completed = gameState.homework_completed[subj].filter(Boolean).length;
        const usualScore = Math.round(100 * completed / 16);
        const scores = getExamScores(subj);
        const examScore = scores.length > 0 ? Math.floor(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
        const weight = gameState.usual_weight[subj];
        const finalScore = Math.floor(usualScore * weight + examScore * (1 - weight));
        totalScore += finalScore;
    }
    
    // 显示成就达成
    const { brandNew, upgraded, existing } = achievementResult;
    let achievementsHtml = '';
    
    if (brandNew.length > 0 || upgraded.length > 0 || existing.length > 0) {
        let itemsHtml = '';
        
        if (brandNew.length > 0) {
            const newItems = brandNew.map(ach => 
                `<div style="padding: 8px 12px; background: #ffd700; color: #333; border-radius: 6px; font-weight: bold;">🏆 ${ach}</div>`
            ).join('');
            itemsHtml += `<div style="margin-bottom: 10px;"><div style="color: #ffd700; font-size: 0.95rem; font-weight: bold; margin-bottom: 6px;">✨ 新成就</div><div style="display: flex; flex-direction: column; gap: 4px;">${newItems}</div></div>`;
        }
        
        if (upgraded.length > 0) {
            const upItems = upgraded.map(ach => 
                `<div style="padding: 8px 12px; background: #ff9500; color: #fff; border-radius: 6px; font-weight: bold;">⬆️ ${ach}</div>`
            ).join('');
            itemsHtml += `<div style="margin-bottom: 10px;"><div style="color: #ff9500; font-size: 0.95rem; font-weight: bold; margin-bottom: 6px;">⬆️ 升级</div><div style="display: flex; flex-direction: column; gap: 4px;">${upItems}</div></div>`;
        }
        
        if (existing.length > 0) {
            const exItems = existing.map(ach => 
                `<div style="padding: 8px 12px; background: #aaa; color: #fff; border-radius: 6px;">🏆 ${ach}</div>`
            ).join('');
            itemsHtml += `<div><div style="color: #aaa; font-size: 0.95rem; font-weight: bold; margin-bottom: 6px;">已获得</div><div style="display: flex; flex-direction: column; gap: 4px;">${exItems}</div></div>`;
        }
        
        achievementsHtml = `<div style="margin-top: 20px;">${itemsHtml}</div>`;
    }
    
    html += `
                </tbody>
            </table>
        </div>
        <div style="text-align: center; margin-top: 30px; padding: 25px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 20px;">
            <div style="font-size: 2.5rem; font-weight: bold; color: white;">得分: ${totalScore}/${maxScore}</div>
        </div>
        ${achievementsHtml}
        <button class="restart-btn" style="margin-top: 30px; padding: 15px 40px; font-size: 1.3rem;" onclick="restartGame()">再玩一次</button>
    `;

    document.getElementById('final-result').innerHTML = html;
    document.getElementById('final-modal').classList.add('show');
}

function getComment(total) {
    if (total >= 960) return '🎉 恭喜！你是学霸！';
    if (total >= 720) return '👍 表现不错，继续努力！';
    if (total >= 480) return '💪 还需加油！';
    return '😢 需要更加努力学习！';
}

let weekEndData = { checkHomework: false, showExam: false, nextAction: null };
let weeklyStateChanges = { physical: 0, mental: 0 };

function endWeek() {
    // 重置每周状态变化跟踪
    weeklyStateChanges = { physical: 0, mental: 0 };
    
    // 保存训导前的状态值
    const stateBeforeScolding = {
        physical: gameState.student.physical_state,
        mental: gameState.student.mental_state
    };
    
    sleep(remainingTime);
    applyPhysicalDefectLimit();

    const incompleteHomework = [];
    for (let subj of getClassSubjects()) {
        if (!gameState.homework_completed[subj][gameState.current_week - 1]) {
            incompleteHomework.push(SUBJECT_NAMES[subj]);
        }
    }

    if (incompleteHomework.length > 0) {
        weekEndData = {
            checkHomework: false,
            showExam: gameState.current_week % 4 === 0,
            nextAction: 'afterHomeworkScolding',
            stateBeforeScolding: stateBeforeScolding
        };
        showScoldingPage(incompleteHomework, 'homework');
        return;
    }

    if (gameState.current_week % 4 === 0) {
        weekEndData = {
            checkHomework: false,
            showExam: true,
            nextAction: 'afterExam',
            stateBeforeScolding: stateBeforeScolding
        };
        takeExam();
        if (checkGameOver()) return;
    } else {
        weeklyDecay();
        if (checkGameOver()) return;
        completeWeek();
    }
}

function completeWeek() {
    gameState.current_week++;

    if (gameState.current_week > gameState.total_weeks) {
        showFinalResults();
    } else {
        resetWeeklyDifficulty();
        // 重置本周模拟考标志
        gameState.simulated_exam_done = false;
        // 清除上瘾状态（睡觉后上瘾状态清除）
        gameState.is_addicted = false;
        // 重新启用模拟考按钮
        const examBtn = document.getElementById('btn-simulated-exam');
        if (examBtn) {
            examBtn.disabled = false;
            examBtn.style.opacity = '1';
            examBtn.style.cursor = 'pointer';
        }
        // 检查当前周是否有补差班及学科数量
        const remedialCount = gameState.remedial_info && gameState.remedial_info[gameState.current_week] ? 
                              gameState.remedial_info[gameState.current_week] : 0;
        gameState.time_reduction = remedialCount;
        remainingTime = gameState.weekly_time - gameState.time_reduction;
        
        if (remedialCount > 0) {
            addMessage(`第${gameState.current_week}周开始！需要参加${remedialCount}门学科的补差班，本周时间-${remedialCount}`, "warning");
        } else {
            addMessage(`第${gameState.current_week}周开始！`, "info");
        }
        
        // 每周开始时自动保存
        autoSave();
        
        // 先更新UI，确保周数正确显示
        updateUI();
        
        // 意外挑战：每周开始时随机发生意外事件（在UI更新后显示弹窗）
        console.log('Checking accident challenge...');
        console.log('Current challenges:', gameState.challenges);
        
        if (gameState.challenges && gameState.challenges.includes('accident')) {
            console.log('Accident challenge active, showing modal...');
            const accident = generateAccident();
            console.log('Generated accident:', accident);
            showAccidentModal(accident);
            addMessage(`[意外] ${accident.description}`, accident.isPositive ? "success" : "warning");
        } else {
            console.log('Accident challenge not active');
        }
    }
}

function continueAfterScolding() {
    document.getElementById('scolding-modal').classList.remove('show');
    
    scoldingData.currentIndex = (scoldingData.currentIndex || 0) + 1;
    
    if (scoldingData.currentIndex < scoldingData.subjects.length) {
        // 还有下一位老师
        showNextTeacherScolding();
    } else {
        // 所有老师训导完成
        scoldingData.currentIndex = 0;
        
        if (scoldingData.scoldingType === 'homework') {
            // 作业训导完成后：如果需要家长训导，显示家长训导；否则继续流程
            if (scoldingData.contactParent) {
                showParentScolding();
            } else if (weekEndData.nextAction === 'afterHomeworkScolding') {
                if (weekEndData.showExam) {
                    takeExam();
                } else {
                    weeklyDecay();
                    if (checkGameOver()) return;
                    completeWeek();
                }
            }
        } else if (scoldingData.scoldingType === 'exam') {
            // exam训导完成后显示补差班信息
            if (scoldingData.showRemedial && scoldingData.subjects.length > 0) {
                showRemedialClassInfo();
            } else {
                weeklyDecay();
                if (checkGameOver()) return;
                completeWeek();
            }
        }
    }
}

function filterActions(type) {
    // 更新筛选按钮状态
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent === '全部' && type === 'all') {
            btn.classList.add('active');
        } else if (btn.textContent === '作业' && type === 'homework') {
            btn.classList.add('active');
        } else if (btn.textContent === '学习' && type === 'study') {
            btn.classList.add('active');
        } else if (btn.textContent === '玩耍' && type === 'play') {
            btn.classList.add('active');
        }
    });
    
    // 检查是否处于上瘾状态
    const isAddicted = gameState && gameState.challenges?.includes('addiction') && gameState.is_addicted;
    
    // 筛选行动按钮
    document.querySelectorAll('.action-btn[data-type]').forEach(btn => {
        // 如果按钮被班级类型隐藏（内联样式 display:none），跳过处理
        const isClassHidden = btn.dataset.classHidden === 'true';
        
        if (isClassHidden) {
            btn.style.display = 'none';
            return;
        }
        
        const shouldShow = type === 'all' || btn.dataset.type === type;
        
        if (shouldShow) {
            btn.style.display = 'block';
            
            // 上瘾状态下，作业和学习按钮禁用并添加🚫标记（不变灰）
            if (isAddicted && (btn.dataset.type === 'homework' || btn.dataset.type === 'study')) {
                btn.disabled = true;
                btn.style.opacity = '1';  // 不变灰
                btn.style.cursor = 'not-allowed';
            }
        } else {
            btn.style.display = 'none';
        }
    });
}

function updateUI() {
    document.getElementById('current-week').textContent = gameState.current_week;
    document.getElementById('remaining-time').textContent = remainingTime;
    document.getElementById('week-progress').style.width = `${(gameState.current_week / gameState.total_weeks) * 100}%`;
    
    // 更新班级和难度显示
    const classNames = {
        [CLASS_TYPE.SCIENCE]: '理科班',
        [CLASS_TYPE.ARTS]: '文科班',
        [CLASS_TYPE.COMPREHENSIVE]: '综合班',
        [CLASS_TYPE.BELT]: '一带一路班'
    };
    document.getElementById('class-display').textContent = classNames[gameState.classType] || '综合班';
    document.getElementById('difficulty-display').textContent = DIFFICULTY_CONFIG[gameState.difficulty]?.name || '中等';
    
    // 更新挑战模式显示
    const challengeDisplay = document.getElementById('challenge-display');
    if (challengeDisplay) {
        if (gameState.challenges && gameState.challenges.length > 0) {
            const challengeNames = gameState.challenges.map(c => CHALLENGES[c]?.name).join(' ');
            challengeDisplay.textContent = challengeNames;
        } else {
            challengeDisplay.textContent = '无';
        }
    }

    document.getElementById('time-reduction').textContent = gameState.time_reduction;
    document.getElementById('time-reduction-badge').style.display = gameState.time_reduction > 0 ? 'inline' : 'none';

    const recentExam = getRecentExamScores();
    const subjects = getClassSubjects();
    
    // 根据班级类型显示/隐藏各科目考试成绩
    const chineseExamContainer = document.querySelector('.level-item.chinese');
    const mathExamContainer = document.querySelector('.level-item.math');
    const englishExamContainer = document.querySelector('.level-item.english');
    const foreignExamContainer = document.getElementById('foreign-exam-container');
    
    if (chineseExamContainer) {
        chineseExamContainer.style.display = subjects.includes(CHINESE) ? 'flex' : 'none';
        document.getElementById('chinese-exam').textContent = recentExam[CHINESE] !== null ? recentExam[CHINESE] + '分' : '--';
    }
    if (mathExamContainer) {
        mathExamContainer.style.display = subjects.includes(MATH) ? 'flex' : 'none';
        document.getElementById('math-exam').textContent = recentExam[MATH] !== null ? recentExam[MATH] + '分' : '--';
    }
    if (englishExamContainer) {
        englishExamContainer.style.display = subjects.includes(ENGLISH) ? 'flex' : 'none';
        document.getElementById('english-exam').textContent = recentExam[ENGLISH] !== null ? recentExam[ENGLISH] + '分' : '--';
    }
    if (foreignExamContainer) {
        foreignExamContainer.style.display = subjects.includes(FOREIGN) ? 'flex' : 'none';
        document.getElementById('foreign-exam').textContent = recentExam[FOREIGN] !== null ? recentExam[FOREIGN] + '分' : '--';
    }
    
    // 根据班级类型调整平均成绩计算
    let totalLevelSum = 0;
    let scoreSum = 0;
    for (let subj of subjects) {
        if (recentExam[subj] !== null) {
            scoreSum += recentExam[subj];
            totalLevelSum++;
        }
    }
    document.getElementById('total-exam').textContent = totalLevelSum > 0 ? Math.round(scoreSum / totalLevelSum * subjects.length) + '分' : '--';

    document.getElementById('physical-state').textContent = gameState.student.physical_state;
    document.getElementById('mental-state').textContent = gameState.student.mental_state;
    document.getElementById('total-status').textContent = getStatus();

    document.getElementById('physical-bar').style.width = `${(gameState.student.physical_state / 50) * 100}%`;
    document.getElementById('mental-bar').style.width = `${(gameState.student.mental_state / 50) * 100}%`;

    document.getElementById('physical-warning').classList.toggle('show', gameState.student.physical_state <= 10);
    document.getElementById('mental-warning').classList.toggle('show', gameState.student.mental_state <= 10);

    const chineseDiffEl = document.getElementById('chinese-difficulty');
    if (chineseDiffEl) {
        chineseDiffEl.textContent = getDifficultyText(gameState.weekly_difficulty[CHINESE]);
    }
    const mathDiffEl = document.getElementById('math-difficulty');
    if (mathDiffEl) {
        mathDiffEl.textContent = getDifficultyText(gameState.weekly_difficulty[MATH]);
    }
    const englishDiffEl = document.getElementById('english-difficulty');
    if (englishDiffEl) {
        englishDiffEl.textContent = getDifficultyText(gameState.weekly_difficulty[ENGLISH]);
    }

    // 根据班级类型显示/隐藏外语难度
    const foreignDiffEl = document.getElementById('foreign-difficulty');
    if (foreignDiffEl) {
        foreignDiffEl.style.display = subjects.includes(FOREIGN) ? 'inline' : 'none';
        foreignDiffEl.textContent = getDifficultyText(gameState.weekly_difficulty[FOREIGN]);
    }

    const chineseDone = gameState.homework_completed[CHINESE].filter(Boolean).length;
    const mathDone = gameState.homework_completed[MATH].filter(Boolean).length;
    const englishDone = gameState.homework_completed[ENGLISH].filter(Boolean).length;
    const totalHomework = gameState.current_week;

    // 根据班级类型显示/隐藏各科作业
    const chineseHwItem = document.getElementById('chinese-homework-item');
    const mathHwItem = document.getElementById('math-homework-item');
    const englishHwItem = document.getElementById('english-homework-item');
    const foreignHwItem = document.getElementById('foreign-homework-item');

    if (chineseHwItem) chineseHwItem.style.display = subjects.includes(CHINESE) ? 'block' : 'none';
    if (mathHwItem) mathHwItem.style.display = subjects.includes(MATH) ? 'block' : 'none';
    if (englishHwItem) englishHwItem.style.display = subjects.includes(ENGLISH) ? 'block' : 'none';
    if (foreignHwItem) foreignHwItem.style.display = subjects.includes(FOREIGN) ? 'block' : 'none';

    document.getElementById('chinese-homework').textContent = `${chineseDone}/${totalHomework}`;
    document.getElementById('math-homework').textContent = `${mathDone}/${totalHomework}`;
    document.getElementById('english-homework').textContent = `${englishDone}/${totalHomework}`;

    // 根据班级类型显示/隐藏外语作业
    if (foreignHwItem) {
        const foreignDone = gameState.homework_completed[FOREIGN].filter(Boolean).length;
        document.getElementById('foreign-homework').textContent = `${foreignDone}/${totalHomework}`;
    }

    updateHomeworkButtons();

    updateExamCountdown();
}

function getRecentExamScores() {
    const scores = [null, null, null, null];
    for (let subj of getClassSubjects()) {
        if (gameState.exam_scores[subj].length > 0) {
            scores[subj] = gameState.exam_scores[subj][gameState.exam_scores[subj].length - 1];
        }
    }
    return scores;
}

function updateHomeworkButtons() {
    const subjects = getClassSubjects();
    
    // 检查是否处于上瘾状态
    const isAddicted = gameState.challenges.includes('addiction') && gameState.is_addicted;
    
    // 获取当前周索引（数组从0开始）
    const weekIndex = gameState.current_week - 1;
    
    const chineseBtn = document.getElementById('btn-homework-chinese');
    const mathBtn = document.getElementById('btn-homework-math');
    const englishBtn = document.getElementById('btn-homework-english');
    const foreignBtn = document.getElementById('btn-homework-foreign');
    
    // 学习按钮
    const studyChineseBtn = document.querySelector('button[onclick="study(0)"]');
    const studyMathBtn = document.querySelector('button[onclick="study(1)"]');
    const studyEnglishBtn = document.querySelector('button[onclick="study(2)"]');
    const studyForeignBtn = document.getElementById('btn-study-foreign');

    // 获取难度文字
    const chineseDiff = gameState.weekly_difficulty[CHINESE] ? getDifficultyText(gameState.weekly_difficulty[CHINESE]) : '';
    const mathDiff = gameState.weekly_difficulty[MATH] ? getDifficultyText(gameState.weekly_difficulty[MATH]) : '';
    const englishDiff = gameState.weekly_difficulty[ENGLISH] ? getDifficultyText(gameState.weekly_difficulty[ENGLISH]) : '';
    const foreignDiff = gameState.weekly_difficulty[FOREIGN] ? getDifficultyText(gameState.weekly_difficulty[FOREIGN]) : '';
    
    // 根据班级类型显示/隐藏作业按钮（上瘾状态下仍然显示，但禁用）
    if (chineseBtn) {
        const isHidden = !subjects.includes(CHINESE);
        chineseBtn.dataset.classHidden = isHidden;
        chineseBtn.style.display = isHidden ? 'none' : 'block';
        const isCompleted = gameState.homework_completed[CHINESE][weekIndex];
        
        // 上瘾状态下：已完成作业=灰色+🚫，未完成=正常色+🚫
        if (isAddicted) {
            chineseBtn.disabled = true;
            chineseBtn.style.cursor = 'not-allowed';
            if (isCompleted) {
                // 已完成：保持灰色 + 🚫
                chineseBtn.style.opacity = '0.5';
                chineseBtn.innerHTML = `🚫 语文作业 <span style="font-size:0.8em;opacity:0.7;">${chineseDiff}</span>`;
            } else {
                // 未完成：正常颜色 + 🚫
                chineseBtn.style.opacity = '1';
                chineseBtn.innerHTML = `🚫 语文作业 <span style="font-size:0.8em;opacity:0.7;">${chineseDiff}</span>`;
            }
        } else {
            chineseBtn.disabled = isCompleted;
            chineseBtn.style.opacity = isCompleted ? '0.5' : '1';
            chineseBtn.style.cursor = isCompleted ? 'not-allowed' : 'pointer';
            chineseBtn.innerHTML = `📝 语文作业 <span style="font-size:0.8em;opacity:0.7;">${chineseDiff}</span>`;
        }
    }
    if (mathBtn) {
        const isHidden = !subjects.includes(MATH);
        mathBtn.dataset.classHidden = isHidden;
        mathBtn.style.display = isHidden ? 'none' : 'block';
        const isCompleted = gameState.homework_completed[MATH][weekIndex];
        
        if (isAddicted) {
            mathBtn.disabled = true;
            mathBtn.style.cursor = 'not-allowed';
            if (isCompleted) {
                mathBtn.style.opacity = '0.5';
                mathBtn.innerHTML = `🚫 数学作业 <span style="font-size:0.8em;opacity:0.7;">${mathDiff}</span>`;
            } else {
                mathBtn.style.opacity = '1';
                mathBtn.innerHTML = `🚫 数学作业 <span style="font-size:0.8em;opacity:0.7;">${mathDiff}</span>`;
            }
        } else {
            mathBtn.disabled = isCompleted;
            mathBtn.style.opacity = isCompleted ? '0.5' : '1';
            mathBtn.style.cursor = isCompleted ? 'not-allowed' : 'pointer';
            mathBtn.innerHTML = `📝 数学作业 <span style="font-size:0.8em;opacity:0.7;">${mathDiff}</span>`;
        }
    }
    if (englishBtn) {
        const isHidden = !subjects.includes(ENGLISH);
        englishBtn.dataset.classHidden = isHidden;
        englishBtn.style.display = isHidden ? 'none' : 'block';
        const isCompleted = gameState.homework_completed[ENGLISH][weekIndex];
        
        if (isAddicted) {
            englishBtn.disabled = true;
            englishBtn.style.cursor = 'not-allowed';
            if (isCompleted) {
                englishBtn.style.opacity = '0.5';
                englishBtn.innerHTML = `🚫 英语作业 <span style="font-size:0.8em;opacity:0.7;">${englishDiff}</span>`;
            } else {
                englishBtn.style.opacity = '1';
                englishBtn.innerHTML = `🚫 英语作业 <span style="font-size:0.8em;opacity:0.7;">${englishDiff}</span>`;
            }
        } else {
            englishBtn.disabled = isCompleted;
            englishBtn.style.opacity = isCompleted ? '0.5' : '1';
            englishBtn.style.cursor = isCompleted ? 'not-allowed' : 'pointer';
            englishBtn.innerHTML = `📝 英语作业 <span style="font-size:0.8em;opacity:0.7;">${englishDiff}</span>`;
        }
    }
    if (foreignBtn) {
        const isHidden = !subjects.includes(FOREIGN);
        foreignBtn.dataset.classHidden = isHidden;
        foreignBtn.style.display = isHidden ? 'none' : 'block';
        const isCompleted = gameState.homework_completed[FOREIGN][weekIndex];
        
        if (isAddicted) {
            foreignBtn.disabled = true;
            foreignBtn.style.cursor = 'not-allowed';
            if (isCompleted) {
                foreignBtn.style.opacity = '0.5';
                foreignBtn.innerHTML = `🚫 外语作业 <span style="font-size:0.8em;opacity:0.7;">${foreignDiff}</span>`;
            } else {
                foreignBtn.style.opacity = '1';
                foreignBtn.innerHTML = `🚫 外语作业 <span style="font-size:0.8em;opacity:0.7;">${foreignDiff}</span>`;
            }
        } else {
            foreignBtn.disabled = isCompleted;
            foreignBtn.style.opacity = isCompleted ? '0.5' : '1';
            foreignBtn.style.cursor = isCompleted ? 'not-allowed' : 'pointer';
            foreignBtn.innerHTML = `📝 外语作业 <span style="font-size:0.8em;opacity:0.7;">${foreignDiff}</span>`;
        }
    }

    // 根据班级类型显示/隐藏学习按钮（上瘾状态下仍然显示，但禁用）
    if (studyChineseBtn) {
        const isHidden = !subjects.includes(CHINESE);
        studyChineseBtn.dataset.classHidden = isHidden;
        studyChineseBtn.style.display = isHidden ? 'none' : 'block';
        if (isAddicted) {
            studyChineseBtn.disabled = true;
            studyChineseBtn.style.opacity = '1';  // 不变灰
            studyChineseBtn.style.cursor = 'not-allowed';
            studyChineseBtn.innerHTML = '🚫 语文学习';
        } else {
            studyChineseBtn.disabled = false;
            studyChineseBtn.style.opacity = '1';
            studyChineseBtn.style.cursor = 'pointer';
            studyChineseBtn.innerHTML = '📚 语文学习';
        }
    }
    if (studyMathBtn) {
        const isHidden = !subjects.includes(MATH);
        studyMathBtn.dataset.classHidden = isHidden;
        studyMathBtn.style.display = isHidden ? 'none' : 'block';
        if (isAddicted) {
            studyMathBtn.disabled = true;
            studyMathBtn.style.opacity = '1';  // 不变灰
            studyMathBtn.style.cursor = 'not-allowed';
            studyMathBtn.innerHTML = '🚫 数学学习';
        } else {
            studyMathBtn.disabled = false;
            studyMathBtn.style.opacity = '1';
            studyMathBtn.style.cursor = 'pointer';
            studyMathBtn.innerHTML = '📚 数学学习';
        }
    }
    if (studyEnglishBtn) {
        const isHidden = !subjects.includes(ENGLISH);
        studyEnglishBtn.dataset.classHidden = isHidden;
        studyEnglishBtn.style.display = isHidden ? 'none' : 'block';
        if (isAddicted) {
            studyEnglishBtn.disabled = true;
            studyEnglishBtn.style.opacity = '1';  // 不变灰
            studyEnglishBtn.style.cursor = 'not-allowed';
            studyEnglishBtn.innerHTML = '🚫 英语学习';
        } else {
            studyEnglishBtn.disabled = false;
            studyEnglishBtn.style.opacity = '1';
            studyEnglishBtn.style.cursor = 'pointer';
            studyEnglishBtn.innerHTML = '📚 英语学习';
        }
    }
    if (studyForeignBtn) {
        const isHidden = !subjects.includes(FOREIGN);
        studyForeignBtn.dataset.classHidden = isHidden;
        studyForeignBtn.style.display = isHidden ? 'none' : 'block';
        if (isAddicted) {
            studyForeignBtn.disabled = true;
            studyForeignBtn.style.opacity = '1';  // 不变灰
            studyForeignBtn.style.cursor = 'not-allowed';
            studyForeignBtn.innerHTML = '🚫 外语学习';
        } else {
            studyForeignBtn.disabled = false;
            studyForeignBtn.style.opacity = '1';
            studyForeignBtn.style.cursor = 'pointer';
            studyForeignBtn.innerHTML = '📚 外语学习';
        }
    }
    
    // 禁用模拟考按钮（上瘾状态下）
    const examBtn = document.getElementById('btn-simulated-exam');
    if (examBtn) {
        const isExamDone = gameState.simulated_exam_done;
        
        if (isAddicted) {
            examBtn.disabled = true;
            examBtn.style.cursor = 'not-allowed';
            if (isExamDone) {
                // 已完成：保持灰色 + 🚫
                examBtn.style.opacity = '0.5';
            } else {
                // 未完成：正常颜色 + 🚫
                examBtn.style.opacity = '1';
            }
            examBtn.innerHTML = '🚫 模拟考';
        } else {
            examBtn.disabled = isExamDone;
            examBtn.style.opacity = isExamDone ? '0.5' : '1';
            examBtn.style.cursor = isExamDone ? 'not-allowed' : 'pointer';
            examBtn.innerHTML = '📝 模拟考';
        }
    }
}

function updateExamCountdown() {
    const nextExamWeek = Math.ceil(gameState.current_week / 4) * 4;
    const countdown = nextExamWeek - gameState.current_week;
    document.getElementById('exam-countdown').textContent = countdown;
}

function restartGame() {
    document.getElementById('gameover-modal').classList.remove('show');
    document.getElementById('final-modal').classList.remove('show');
    document.getElementById('exam-modal').classList.remove('show');
    document.getElementById('scolding-modal').classList.remove('show');
    document.getElementById('remedial-modal').classList.remove('show');
    document.getElementById('load-modal').classList.remove('show');
    
    // 重新初始化游戏状态
    initGame();
    showDifficultySelection();
    showClassSelection();
    
    document.querySelector('.start-screen').style.display = 'block';
    document.getElementById('intro-screen').classList.remove('show');
    document.getElementById('achievements-screen').classList.remove('show');
    document.getElementById('achievement-detail-screen').classList.remove('show');
    document.querySelector('.game-screen').classList.remove('show');
}

function openChangelog() {
    document.getElementById('changelog-modal').classList.add('show');
}

function closeChangelog() {
    document.getElementById('changelog-modal').classList.remove('show');
}

// 成就系统
function getAchievements() {
    let achievements = {};
    for (const key of Object.keys(ACHIEVEMENTS)) {
        achievements[key] = {};
        for (const classType of Object.keys(CLASS_NAMES)) {
            achievements[key][classType] = {};
            for (const diffKey of Object.keys(DIFFICULTY_NAMES)) {
                achievements[key][classType][diffKey] = false;
            }
        }
    }
    return achievements;
}

function saveAchievements(achievements) {
    localStorage.setItem('achievements', JSON.stringify(achievements));
}

function loadAchievements() {
    const data = localStorage.getItem('achievements');
    
    // 如果没有数据，返回默认结构
    if (!data) {
        return getAchievements();
    }
    
    try {
        const savedAchievements = JSON.parse(data);
        
        // 确保每个成就类型都有正确的结构
        const result = getAchievements(); // 从默认结构开始
        
        for (const achKey of Object.keys(ACHIEVEMENTS)) {
            if (savedAchievements[achKey]) {
                for (const classType of Object.keys(CLASS_NAMES)) {
                    if (savedAchievements[achKey][classType]) {
                        for (const diffKey of Object.keys(DIFFICULTY_NAMES)) {
                            // 只保留已解锁的成就，其他保持默认false
                            if (savedAchievements[achKey][classType][diffKey] === true) {
                                result[achKey][classType][diffKey] = true;
                            }
                        }
                    }
                }
            }
        }
        
        return result;
    } catch (e) {
        console.error('Error loading achievements:', e);
        return getAchievements();
    }
}

// 班级优先级（科目数量从少到多）
const CLASS_ORDER = ['science', 'arts', 'comprehensive', 'belt'];

// 难度优先级（从难到易）
const DIFFICULTY_ORDER = ['destruction', 'hell', 'hard', 'medium', 'fairly_easy', 'easy', 'fantasy'];

function checkAchievements(gameOverReason = null) {
    console.log('=== checkAchievements START ===');
    const achievements = loadAchievements();
    const subjects = getClassSubjects();
    const totalSubjects = subjects.length;
    
    // 计算综合分数（所有学科总分）和各科最终分数
    let totalScore = 0;
    const finalScores = {};
    
    subjects.forEach(subj => {
        const completed = gameState.homework_completed[subj].filter(Boolean).length;
        const usualScore = Math.round(100 * completed / 16);
        const scores = gameState.exam_scores[subj];
        const examScore = scores.length > 0 ? Math.floor(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
        const weight = gameState.usual_weight[subj] || 0.5;
        const finalScore = Math.floor(usualScore * weight + examScore * (1 - weight));
        finalScores[subj] = finalScore;
        totalScore += finalScore;
    });
    
    const maxScore = 100 * totalSubjects;
    const scoreRate = (totalScore / maxScore) * 100;
    console.log(`scoreRate: ${scoreRate}%, maxScore: ${maxScore}, totalScore: ${totalScore}`);
    
    const currentClassIdx = CLASS_ORDER.indexOf(gameState.classType);
    const currentDiffIdx = DIFFICULTY_ORDER.indexOf(gameState.difficulty);
    const newUnlocked = [];
    const alreadyUnlocked = [];
    
    // 检测每个成就
    for (const [achKey, ach] of Object.entries(ACHIEVEMENTS)) {
        // 辅助函数：检查成就是否已解锁
        const isUnlocked = () => achievements[achKey][gameState.classType][gameState.difficulty] === true;
        
        // 辅助函数：执行偏序解锁
        const unlockPartialAchievements = () => {
            // 解锁更简单的班级（科目更少）
            for (let i = currentClassIdx - 1; i >= 0; i--) {
                const easierClass = CLASS_ORDER[i];
                if (!achievements[achKey][easierClass]) achievements[achKey][easierClass] = {};
                if (achievements[achKey][easierClass][gameState.difficulty] !== true) {
                    achievements[achKey][easierClass][gameState.difficulty] = true;
                    newUnlocked.push(ach.name + ' [' + easierClass + '/' + gameState.difficulty + ']');
                }
            }
            
            // 解锁更简单的难度
            for (let i = currentDiffIdx + 1; i < DIFFICULTY_ORDER.length; i++) {
                const easierDiff = DIFFICULTY_ORDER[i];
                if (!achievements[achKey][gameState.classType]) achievements[achKey][gameState.classType] = {};
                if (achievements[achKey][gameState.classType][easierDiff] !== true) {
                    achievements[achKey][gameState.classType][easierDiff] = true;
                    newUnlocked.push(ach.name + ' [' + gameState.classType + '/' + easierDiff + ']');
                }
            }
            
            // 同时解锁更简单的班级和难度
            for (let c = currentClassIdx - 1; c >= 0; c--) {
                for (let d = currentDiffIdx + 1; d < DIFFICULTY_ORDER.length; d++) {
                    const easierClass = CLASS_ORDER[c];
                    const easierDiff = DIFFICULTY_ORDER[d];
                    if (!achievements[achKey][easierClass]) achievements[achKey][easierClass] = {};
                    if (achievements[achKey][easierClass][easierDiff] !== true) {
                        achievements[achKey][easierClass][easierDiff] = true;
                        newUnlocked.push(ach.name + ' [' + easierClass + '/' + easierDiff + ']');
                    }
                }
            }
        };
        
        // streak 类型成就：连续失败成就
        // 这类成就在游戏过程中通过 checkStreakAchievement 检查
        // 在结算时只处理偏序解锁的子成就，且只显示本局达成过的成就
        if (ach.type === 'streak') {
            // 检查是否在本局达成过（在 session_achievements 中）
            const achievedThisSession = gameState.session_achievements && 
                                        gameState.session_achievements.includes(ach.name);
            
            if (achievedThisSession) {
                // 本局达成过成就
                // 检查是否已解锁当前班级/难度
                const isUnlocked = achievements[achKey][gameState.classType] && 
                                  achievements[achKey][gameState.classType][gameState.difficulty];
                
                if (!isUnlocked) {
                    // 当前班级/难度未解锁，显示升级
                    addMessage(`⬆️ 成就升级：${ach.name}`, "success");
                    newUnlocked.push(ach.name + ' [' + gameState.classType + '/' + gameState.difficulty + ']');
                } else {
                    // 当前班级/难度已解锁，显示再次获得
                    addMessage(`🔄 再次获得：${ach.name}`, "info");
                    alreadyUnlocked.push(ach.name);
                }
                
                // 执行偏序解锁
                unlockPartialAchievements();
            }
            continue;
        }
        
        // 特殊成就类型检查
        if (ach.type === 'last_breath') {
            // 功亏一篑：第16周死亡
            if (gameOverReason === 'death' && gameState.current_week >= 16) {
                if (!isUnlocked()) {
                    achievements[achKey][gameState.classType][gameState.difficulty] = true;
                    addMessage(`🏅 解锁成就：${ach.name}`, "success");
                    newUnlocked.push(ach.name + ' [' + gameState.classType + '/' + gameState.difficulty + ']');
                    unlockPartialAchievements();
                } else {
                    addMessage(`🔄 再次获得：${ach.name}`, "info");
                    alreadyUnlocked.push(ach.name);
                    unlockPartialAchievements();
                }
            }
            continue;
        }
        
        if (ach.type === 'show_off') {
            // 作秀：上次考试所有科目均合格时自杀
            if (gameOverReason === 'suicide') {
                let allPassed = true;
                for (let subj of subjects) {
                    if (finalScores[subj] < 60) {
                        allPassed = false;
                        break;
                    }
                }
                if (allPassed) {
                    if (!isUnlocked()) {
                        achievements[achKey][gameState.classType][gameState.difficulty] = true;
                        addMessage(`🏅 解锁成就：${ach.name}`, "success");
                        newUnlocked.push(ach.name + ' [' + gameState.classType + '/' + gameState.difficulty + ']');
                        unlockPartialAchievements();
                    } else {
                        addMessage(`🔄 再次获得：${ach.name}`, "info");
                        alreadyUnlocked.push(ach.name);
                        unlockPartialAchievements();
                    }
                }
            }
            continue;
        }
        
        if (ach.type === 'challenge_count_survivor') {
            // 挑战数量幸存者：启用足够多的挑战并存活到指定周数
            // 狗运：至少5个挑战，存活到第3周
            // 神迹：至少4个挑战，存活到期末
            const challengeCount = gameState.challenges ? gameState.challenges.length : 0;
            const survivalWeek = ach.survivalWeek || 16;
            const minChallenges = ach.minChallenges || 0;
            
            // 检查是否存活到指定周数
            const survivedToWeek = gameOverReason === 'final' || gameState.current_week >= survivalWeek;
            
            if (challengeCount >= minChallenges && survivedToWeek) {
                if (!isUnlocked()) {
                    achievements[achKey][gameState.classType][gameState.difficulty] = true;
                    addMessage(`🏅 解锁成就：${ach.name}`, "success");
                    newUnlocked.push(ach.name + ' [' + gameState.classType + '/' + gameState.difficulty + ']');
                    unlockPartialAchievements();
                } else {
                    addMessage(`🔄 再次获得：${ach.name}`, "info");
                    alreadyUnlocked.push(ach.name);
                    unlockPartialAchievements();
                }
            }
            continue;
        }
        
        if (ach.type === 'exam_zero') {
            // 睡着了：某次正式考试获得0分
            // 检查所有考试成绩中是否有0分
            if (gameState.exam_scores) {
                for (let subj = 0; subj < gameState.exam_scores.length; subj++) {
                    for (let score of gameState.exam_scores[subj]) {
                        if (score === 0) {
                            if (!isUnlocked()) {
                                achievements[achKey][gameState.classType][gameState.difficulty] = true;
                                addMessage(`🏅 解锁成就：${ach.name}`, "success");
                                newUnlocked.push(ach.name + ' [' + gameState.classType + '/' + gameState.difficulty + ']');
                                unlockPartialAchievements();
                            } else {
                                addMessage(`🔄 再次获得：${ach.name}`, "info");
                                alreadyUnlocked.push(ach.name);
                                unlockPartialAchievements();
                            }
                            break;
                        }
                    }
                }
            }
            continue;
        }
        
        if (ach.type === 'exam_improvement') {
            // 进步神速：一次正式考试较上一次进步至少60分
            const minImprovement = ach.minImprovement || 60;
            if (gameState.exam_scores) {
                // 找出最大的考试次数
                let maxExamCount = 0;
                for (let subj = 0; subj < gameState.exam_scores.length; subj++) {
                    maxExamCount = Math.max(maxExamCount, gameState.exam_scores[subj].length);
                }
                
                // 计算每次考试的总分并检查进步
                const totalScores = [];
                for (let examIdx = 0; examIdx < maxExamCount; examIdx++) {
                    let total = 0;
                    for (let subj = 0; subj < gameState.exam_scores.length; subj++) {
                        if (gameState.exam_scores[subj][examIdx] !== undefined) {
                            total += gameState.exam_scores[subj][examIdx];
                        }
                    }
                    totalScores.push(total);
                }
                
                // 检查是否有连续两次考试进步至少60分
                for (let i = 1; i < totalScores.length; i++) {
                    const improvement = totalScores[i] - totalScores[i - 1];
                    if (improvement >= minImprovement) {
                        if (!isUnlocked()) {
                            achievements[achKey][gameState.classType][gameState.difficulty] = true;
                            addMessage(`🏅 解锁成就：${ach.name}`, "success");
                            newUnlocked.push(ach.name + ' [' + gameState.classType + '/' + gameState.difficulty + ']');
                            unlockPartialAchievements();
                        } else {
                            addMessage(`🔄 再次获得：${ach.name}`, "info");
                            alreadyUnlocked.push(ach.name);
                            unlockPartialAchievements();
                        }
                        break;
                    }
                }
            }
            continue;
        }
        
        if (ach.type === 'perfect') {
            // 完美：期末总评有一科满分
            for (let subj of subjects) {
                if (finalScores[subj] >= 100) {
                    // 解锁当前班级和难度
                    if (!isUnlocked()) {
                        achievements[achKey][gameState.classType][gameState.difficulty] = true;
                        addMessage(`🏅 解锁成就：${ach.name}`, "success");
                        newUnlocked.push(ach.name + ' [' + gameState.classType + '/' + gameState.difficulty + ']');
                        unlockPartialAchievements();
                    } else {
                        addMessage(`🔄 再次获得：${ach.name}`, "info");
                        alreadyUnlocked.push(ach.name);
                        unlockPartialAchievements();
                    }
                    break;
                }
            }
            continue;
        }
        
        if (ach.type === 'survivor') {
            // 幸存者：生理缺陷挑战中，存活到期末总评公布
            if (gameOverReason === 'final' && gameState.challenges && gameState.challenges.includes('physical_defect')) {
                if (!isUnlocked()) {
                    achievements[achKey][gameState.classType][gameState.difficulty] = true;
                    addMessage(`🏅 解锁成就：${ach.name}`, "success");
                    newUnlocked.push(ach.name + ' [' + gameState.classType + '/' + gameState.difficulty + ']');
                    unlockPartialAchievements();
                } else {
                    addMessage(`🔄 再次获得：${ach.name}`, "info");
                    alreadyUnlocked.push(ach.name);
                    unlockPartialAchievements();
                }
            }
            continue;
        }
        
        if (ach.type === 'appeal_all_plus_two') {
            // 幸与不幸：所有学科申诉后均增加2分
            // 这个成就在游戏过程中通过 checkAppealAchievement 检查
            // 在结算时只处理偏序解锁的子成就，且只显示本局达成过的成就
            const achievedThisSession = gameState.session_achievements && 
                                        gameState.session_achievements.includes(ach.name);
            
            if (achievedThisSession) {
                // 本局达成过成就
                // 检查是否已解锁当前班级/难度
                const isUnlocked = achievements[achKey][gameState.classType] && 
                                  achievements[achKey][gameState.classType][gameState.difficulty];
                
                if (!isUnlocked) {
                    // 当前班级/难度未解锁，显示升级
                    addMessage(`⬆️ 成就升级：${ach.name}`, "success");
                    newUnlocked.push(ach.name + ' [' + gameState.classType + '/' + gameState.difficulty + ']');
                } else {
                    // 当前班级/难度已解锁，显示再次获得
                    addMessage(`🔄 再次获得：${ach.name}`, "info");
                    alreadyUnlocked.push(ach.name);
                }
                
                // 执行偏序解锁
                unlockPartialAchievements();
            }
            continue;
        }
        
        if (ach.type === 'challenge_end') {
            // 挑战模式达成成就：在特定挑战下完成期末
            // 需要满足条件：活到期末，并且满足特定要求
            
            // 检查是否活到期末
            if (gameOverReason !== 'final') {
                continue;
            }
            
            // 检查是否启用了所需挑战
            if (!gameState.challenges || !gameState.challenges.includes(ach.requiresChallenge)) {
                continue;
            }
            
            // 检查是否满足分数要求（如果有）
            const hasScoreRequirement = ach.minFinalScorePercent !== undefined;
            const meetsScoreRequirement = !hasScoreRequirement || scoreRate >= ach.minFinalScorePercent;
            
            if (meetsScoreRequirement) {
                if (!isUnlocked()) {
                    achievements[achKey][gameState.classType][gameState.difficulty] = true;
                    addMessage(`🏅 解锁成就：${ach.name}`, "success");
                    newUnlocked.push(ach.name + ' [' + gameState.classType + '/' + gameState.difficulty + ']');
                    unlockPartialAchievements();
                } else {
                    addMessage(`🔄 再次获得：${ach.name}`, "info");
                    alreadyUnlocked.push(ach.name);
                    unlockPartialAchievements();
                }
            }
            continue;
        }
        
        // 常规成就：检查挑战要求
        if (ach.requiresChallenge) {
            if (!gameState.challenges || !gameState.challenges.includes(ach.requiresChallenge)) {
                continue;
            }
        }
        
        // 检查分数是否达标
        if (scoreRate >= ach.threshold) {
            console.log(`Achievement ${ach.name} triggered - classIdx: ${currentClassIdx}, diffIdx: ${currentDiffIdx}`);
            // 解锁当前班级和难度的成就
            if (!isUnlocked()) {
                achievements[achKey][gameState.classType][gameState.difficulty] = true;
                addMessage(`🏅 解锁成就：${ach.name}`, "success");
                newUnlocked.push(ach.name + ' [' + gameState.classType + '/' + gameState.difficulty + ']');
            } else {
                console.log(`Achievement ${ach.name} already unlocked for ${gameState.classType}/${gameState.difficulty}`);
                addMessage(`🔄 再次获得：${ach.name}`, "info");
                alreadyUnlocked.push(ach.name);
            }
            // 执行偏序解锁
            unlockPartialAchievements();
        }
    }
    
    saveAchievements(achievements);
    console.log('=== checkAchievements END ===');
    console.log('Result:', { newUnlocked: [...new Set(newUnlocked)], alreadyUnlocked: [...new Set(alreadyUnlocked)] });
    
    // 提取成就名称（去掉子成就后缀）
    const getAchName = (item) => item.split(' [')[0];
    
    // 统计每个成就的新解锁子成就数量
    const newCountByAch = {};
    const existingCountByAch = {};
    
    [...new Set(newUnlocked)].forEach(item => {
        const name = getAchName(item);
        newCountByAch[name] = (newCountByAch[name] || 0) + 1;
    });
    
    [...new Set(alreadyUnlocked)].forEach(item => {
        const name = getAchName(item);
        existingCountByAch[name] = (existingCountByAch[name] || 0) + 1;
    });
    
    // 区分三种情况
    const brandNewAchievements = []; // 完全新解锁
    const upgradedAchievements = []; // 升级成就（有新子成就）
    const existingAchievements = []; // 已获得（无新子成就）
    
    // 检查每个成就的解锁状态
    const allAchNames = new Set([...Object.keys(newCountByAch), ...Object.keys(existingCountByAch)]);
    
    // 获取 session_achievements 中已有的成就名称集合
    const sessionAchNames = new Set(gameState.session_achievements || []);
    
    for (const achName of allAchNames) {
        const newCount = newCountByAch[achName] || 0;
        const existingCount = existingCountByAch[achName] || 0;
        
        if (newCount > 0) {
            // 有新解锁的子成就
            const achKey = Object.keys(ACHIEVEMENTS).find(k => ACHIEVEMENTS[k].name === achName);
            
            // 计算本次解锁前的子成就数量
            let beforeCount = 0;
            for (const c of Object.keys(CLASS_NAMES)) {
                for (const d of Object.keys(DIFFICULTY_NAMES)) {
                    if (achievements[achKey]?.[c]?.[d] === true) {
                        beforeCount++;
                    }
                }
            }
            // 减去本次解锁的数量，得到之前的数量
            const countBeforeThisTime = beforeCount - newCount;
            
            // 如果本次解锁前没有子成就，则是新成就；否则是升级
            if (countBeforeThisTime <= 0) {
                brandNewAchievements.push(achName);
            } else {
                upgradedAchievements.push(achName);
            }
        } else if (existingCount > 0) {
            // 成就已被检测到（当前班级/难度的成就已解锁，但没有新的子成就）
            // 如果这个成就在 session_achievements 中（游戏过程中已获得），显示为"已获得"
            // 否则也显示为"已获得"
            existingAchievements.push(achName);
        }
    }
    
    return {
        brandNew: brandNewAchievements,
        upgraded: upgradedAchievements,
        existing: existingAchievements
    };
}

function getAchievementProgress(achievements, achKey) {
    let completed = 0;
    const total = Object.keys(CLASS_NAMES).length * Object.keys(DIFFICULTY_NAMES).length;
    
    for (const classType of Object.keys(CLASS_NAMES)) {
        for (const diffKey of Object.keys(DIFFICULTY_NAMES)) {
            if (achievements[achKey][classType][diffKey]) {
                completed++;
            }
        }
    }
    
    return { completed, total };
}

function showAchievementsScreen() {
    const achievements = loadAchievements();
    const container = document.getElementById('achievements-list');
    
    // 计算所有成就的总进度
    let totalCompleted = 0;
    let totalCount = 0;
    for (const achKey of Object.keys(ACHIEVEMENTS)) {
        const progress = getAchievementProgress(achievements, achKey);
        totalCompleted += progress.completed;
        totalCount += progress.total;
    }
    const totalPercentage = totalCount > 0 ? (totalCompleted / totalCount) * 100 : 0;
    const isComplete = totalCompleted === totalCount;
    
    // 获取当前称号
    const currentTitle = getTitleByProgress(totalPercentage, isComplete);
    const titleHTML = renderTitleHTML(currentTitle);
    
    let html = `
        <div style="margin-bottom: 25px; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 15px; position: relative;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
                <div>
                    <div style="color: white; font-size: 1.1rem; font-weight: bold;">🏆 成就总进度</div>
                    <span style="color: white; font-size: 2rem; font-weight: bold;">${totalCompleted}/${totalCount}</span>
                </div>
                <div style="text-align: right; cursor: pointer;" onclick="showTitleProgressModal(${totalPercentage}, ${isComplete})">
                    <div style="font-size: 1.1rem; margin-bottom: 5px;">${titleHTML}</div>
                    <span style="color: #ffd700; font-size: 1.5rem; font-weight: bold;">${totalPercentage.toFixed(1)}%</span>
                    <div style="color: rgba(255,255,255,0.7); font-size: 0.8rem; margin-top: 3px;">点击查看段位进度</div>
                </div>
            </div>
            <div style="background: rgba(255,255,255,0.3); border-radius: 8px; height: 16px;">
                <div style="background: #ffd700; height: 100%; border-radius: 8px; width: ${Math.max(totalPercentage, 2)}%;"></div>
            </div>
        </div>
    `;
    
    for (const [achKey, ach] of Object.entries(ACHIEVEMENTS)) {
        const progress = getAchievementProgress(achievements, achKey);
        const percentage = (progress.completed / progress.total) * 100;
        
        html += `
            <div class="intro-section" onclick="showAchievementDetail('${achKey}')" style="cursor: pointer;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <h3 style="margin: 0 0 5px 0;">${ach.name}</h3>
                        <p style="margin: 0; font-size: 0.9rem; color: #666;">${ach.description}</p>
                    </div>
                    <div style="text-align: right;">
                        <span style="font-size: 1.2rem; font-weight: bold; color: #667eea;">${progress.completed}/${progress.total}</span>
                    </div>
                </div>
                <div style="margin-top: 10px; background: #f0f0f0; border: 1px solid #ddd; border-radius: 5px; height: 12px;">
                    <div style="background: linear-gradient(90deg, #667eea, #764ba2); height: 100%; border-radius: 4px; width: ${Math.max(percentage, 2)}%;"></div>
                </div>
            </div>
        `;
    }
    
    container.innerHTML = html;
    
    // 隐藏其他界面，显示成就页面
    document.querySelector('.start-screen').style.display = 'none';
    document.getElementById('achievements-screen').classList.add('show');
    document.getElementById('achievement-detail-screen').classList.remove('show');
}

function showAchievementDetail(achKey) {
    const achievements = loadAchievements();
    const ach = ACHIEVEMENTS[achKey];
    
    document.getElementById('achievement-detail-title').textContent = `🏆 ${ach.name}`;
    
    const container = document.getElementById('achievement-detail-content');
    
    // 构建表格
    let tableHtml = `
        <div class="intro-section">
            <p style="opacity: 0.8;">${ach.description}</p>
            <table class="achievement-table">
                <thead>
                    <tr>
                        <th>班级/难度</th>
    `;
    
    // 添加难度列头
    for (const diffName of Object.values(DIFFICULTY_NAMES)) {
        tableHtml += `<th>${diffName}</th>`;
    }
    tableHtml += '</tr></thead><tbody>';
    
    // 添加每行
    for (const [classKey, className] of Object.entries(CLASS_NAMES)) {
        tableHtml += `<tr><td>${className}</td>`;
        for (const diffKey of Object.keys(DIFFICULTY_NAMES)) {
            const completed = achievements[achKey][classKey][diffKey];
            tableHtml += `<td class="${completed ? 'completed' : 'incomplete'}">${completed ? '✓' : '✗'}</td>`;
        }
        tableHtml += '</tr>';
    }
    
    tableHtml += '</tbody></table></div>';
    container.innerHTML = tableHtml;
    
    // 隐藏其他界面，显示详情页面
    document.querySelector('.start-screen').style.display = 'none';
    document.getElementById('achievements-screen').classList.remove('show');
    document.getElementById('achievement-detail-screen').classList.add('show');
}

function hideAchievementsScreen() {
    document.getElementById('achievements-screen').classList.remove('show');
    document.getElementById('achievement-detail-screen').classList.remove('show');
    document.querySelector('.start-screen').style.display = 'block';
}

function backToAchievements() {
    document.getElementById('achievement-detail-screen').classList.remove('show');
    document.getElementById('achievements-screen').classList.add('show');
}

function renderChangelog() {
    const changelog = [
        {
            date: '2026-06-08',
            version: '3.3.0',
            changes: [
                '新增挑战：叛逆（禁止做作业）、专注（禁止玩耍）',
                '新增成就：资本（叛逆挑战下期末总评≥40%）、专注（专注挑战下活到期末）',
                '新增成就：幸与不幸（所有学科申诉后均增加2分）',
                '段位进度弹窗支持滚动',
                '修复申诉分数边界问题（避免<0或>100）',
                '增加游戏存档导出/导入功能（Base64加密保存到.exam文件）'
            ]
        },
        {
            date: '2026-06-06',
            version: '3.2.0',
            changes: [
                '修复偏序解锁bug：同一成就重复获得时正确解锁所有更简单的子成就',
                '结算页面成就显示分类：新成就（完全解锁）、升级（有新子成就）、已获得',
                '游戏规则添加成就偏序解锁机制说明'
            ]
        },
        {
            date: '2026-06-05',
            version: '3.1.0',
            changes: [
                '新增挑战：生理缺陷（生理状态无法高于15）',
                '新增成就：幸存者（生理缺陷挑战中存活到期末）',
                '新增成就：超越张雪峰（生理缺陷挑战中得分率≥60%）',
                '成就系统支持10个成就'
            ]
        },
        {
            date: '2026-06-05',
            version: '3.0.0',
            changes: [
                '新增成就系统：完美、优秀、良好、合格、功亏一篑、作秀、敏感挑战者、合格挑战者',
                '新增挑战模式：敏感（生心理减益加倍）、合格（补差班阈值60分）',
                '成就支持偏序解锁（获得高难度成就自动解锁低难度对应成就）',
                '新增成就页面，显示所有成就进度和总进度条',
                '结算页面显示新解锁和已获得成就',
                '游戏规则增加挑战模式和成就系统说明'
            ]
        },
        {
            date: '2026-06-04',
            version: '2.1.0',
            changes: [
                '修复作业、学习、玩耍筛选功能',
                '修复补差班数量计算（每次考试后清空并重新计算）',
                '修复作业总数计算（每周开始时+1）',
                '修复外语作业显示（学科名称和完成情况分行显示）',
                '美化分数分配比例介绍UI（高亮显示占比更高的比例）'
            ]
        },
        {
            date: '2026-06-04',
            version: '2.0.0',
            changes: [
                '新增班级类型选择：理科班（只学数学）、文科班（学语文英语）、综合班（学语数英）、一带一路班（学语数英+外语）',
                '添加外语科目机制',
                '根据班级类型动态显示/隐藏科目按钮',
                '学科分数生成后随机调换',
                '优化难度和班级选择UI样式'
            ]
        },
        {
            date: '2026-06-06',
            version: '1.15.0',
            changes: [
                '新增挑战：上瘾（玩完游戏后只能睡觉或继续玩）',
                '新增挑战：严师（不做作业一定会联系家长）',
                '新增挑战：意外（每周开始时随机发生意外事件）',
                '新增10种意外事件：军训、情感打击、挂科、诈骗、意外收获、牌局风云、被抓、修仙、顿悟、社团活动',
                '新增成就：戒断、勤奋、意外幸存者、狗运、神迹',
                '作业按钮显示当前难度',
                '称号系统：根据成就进度分配11个等级称号'
            ]
        },
        {
            date: '2026-06-04',
            version: '1.14.0',
            changes: [
                '新增地狱、毁灭难度',
                '调整各难度参数：幻想95/100/30，简单90/95/26，较易85/90/22，中等80/85/18，困难75/75/16，地狱60/65/15，毁灭50/60/14',
                '开局生心理状态均>=15'
            ]
        },
        {
            date: '2026-06-04',
            version: '1.13.0',
            changes: [
                '玩游戏心态加成改为rand(-1,5)，可能减少心态'
            ]
        },
        {
            date: '2026-06-04',
            version: '1.12.0',
            changes: [
                '每个科目作业训导、考试训导心态影响独立计算',
                '作业训导：每科心理-rand(0,2)',
                '考试训导：每科心理-rand(1,4)'
            ]
        },
        {
            date: '2026-06-04',
            version: '1.11.0',
            changes: [
                '每周衰减消息中不再显示学科衰减',
                '作业训导和补差班的状态变化显示在训导/补差班页面中'
            ]
        },
        {
            date: '2026-06-04',
            version: '1.10.0',
            changes: [
                '考试成绩颜色由名次变化决定：进步绿色，退步红色',
                '作业训导使心理减少rand(0,2)，有4%概率联系家长生理-rand(1,3)'
            ]
        },
        {
            date: '2026-06-04',
            version: '1.9.0',
            changes: [
                '修改睡觉机制：未睡觉生理-20，睡眠<=7减少floor(rand(7,10)/时间)，>7增加(时间-7)',
                '每周衰减改为0~2（原1~3）',
                '考试成绩低于阈值则接下来4周每周时间-1，清空之前的补差班记录（阈值：默认40，合格挑战60）',
                '每科显示分数变化量，心态变化=分数变化量/rand(5,15)',
                '进入补差班页面时：每科心态-rand(1,5)，有补差班则联系家长生理-rand(1,10)'
            ]
        },
        {
            date: '2026-06-04',
            version: '1.8.1',
            changes: [
                '将"本周作业容易度"改回"难度"',
                '删除作业难度下方的提示信息',
                '优化结算页面布局，四次考试成绩合并到一行'
            ]
        },
        {
            date: '2026-06-04',
            version: '1.8.0',
            changes: [
                '修复作业训导只显示第一位老师的问题（删除重复函数）',
                '结局页面只显示最终得分，移除评语',
                '修改睡觉机制：睡觉时间>8时，生理状态直接增加(睡觉时间-8)',
                '添加更新日志功能'
            ]
        },
        {
            date: '2026-06-04',
            version: '1.7.0',
            changes: [
                '修复难度选择不生效的问题（开始游戏时重新初始化）',
                '修复周切换问题（考试周流程：作业训导→成绩揭晓→考试训导→补差班→完成周）',
                '教师训导显示进度指示器',
                '添加调试日志追踪问题'
            ]
        },
        {
            date: '2026-06-04',
            version: '1.6.0',
            changes: [
                '修复CORS问题，将JSON配置直接嵌入代码',
                '删除本周目标功能',
                '添加难度选择功能（5个难度等级）',
                '最终成绩乘以难度倍率',
                '教师训导内容依次显示'
            ]
        },
        {
            date: '2026-06-03',
            version: '1.5.0',
            changes: [
                '修复摸底考成绩揭晓无法退出的问题',
                '将训导内容移到单独JSON文件',
                '实现存档和读档功能（3个存档槽）'
            ]
        }
    ];

    let html = '';
    changelog.forEach(item => {
        html += `
            <div class="rule-section">
                <h3>${item.date} - ${item.version}</h3>
                <ul>
                    ${item.changes.map(change => `<li>${change}</li>`).join('')}
                </ul>
            </div>
        `;
    });

    document.getElementById('changelog-content').innerHTML = html;
}

function showGameStartOptions() {
    document.getElementById('start-options-modal').classList.add('show');
}

function closeStartOptions() {
    document.getElementById('start-options-modal').classList.remove('show');
}

function startNewGame() {
    closeStartOptions();
    // 根据当前选择的难度重新初始化
    initGame();
    
    document.querySelector('.start-screen').style.display = 'none';
    document.getElementById('intro-screen').classList.add('show');
    
    // 隐藏成就相关页面
    document.getElementById('achievements-screen').classList.remove('show');
    document.getElementById('achievement-detail-screen').classList.remove('show');
    
    updateIntroInfo();
    
    // 新游戏默认保存到存档槽0
    autoSave();
}

function startGame() {
    // 保留原有函数用于兼容性
    startNewGame();
}

function continueGame() {
    closeStartOptions();
    // 显示存档选择界面，继续游戏时可以读取自动保存
    showLoadModal(true);
}

function updateIntroInfo() {
    document.getElementById('intro-weekly-time').textContent = gameState.weekly_time;
    const subjects = getClassSubjects();
    
    // 所有科目容器
    const subjectContainers = [
        document.querySelector('.score-item:nth-child(1)'),
        document.querySelector('.score-item:nth-child(2)'),
        document.querySelector('.score-item:nth-child(3)'),
        document.getElementById('intro-subject-3-container')
    ];
    
    // 显示/隐藏各科目容器并更新信息
    for (let subj = 0; subj < 4; subj++) {
        if (subjectContainers[subj]) {
            const isVisible = subjects.includes(subj);
            subjectContainers[subj].style.display = isVisible ? 'flex' : 'none';
            
            if (isVisible) {
                const usualWeight = Math.round(gameState.usual_weight[subj] * 100);
                const examWeight = Math.round((1 - gameState.usual_weight[subj]) * 100);
                document.getElementById(`intro-usual-weight-${subj}`).textContent = `${usualWeight}%`;
                document.getElementById(`intro-exam-weight-${subj}`).textContent = `${examWeight}%`;
                document.getElementById(`intro-subject-${subj}`).textContent = SUBJECT_NAMES[subj];
                
                // 高亮显示占比更高的比例
                const usualBar = document.getElementById(`intro-usual-bar-${subj}`);
                const examBar = document.getElementById(`intro-exam-bar-${subj}`);
                
                if (usualBar) usualBar.classList.remove('highlight');
                if (examBar) examBar.classList.remove('highlight');
                
                if (usualWeight > examWeight) {
                    if (usualBar) usualBar.classList.add('highlight');
                } else if (examWeight > usualWeight) {
                    if (examBar) examBar.classList.add('highlight');
                }
            }
        }
    }
}

function continueToGame() {
    document.getElementById('intro-screen').classList.remove('show');
    document.getElementById('achievements-screen').classList.remove('show');
    document.getElementById('achievement-detail-screen').classList.remove('show');
    document.querySelector('.game-screen').classList.add('show');
    
    if (!gameState.placement_exam_taken) {
        gameState.placement_exam_taken = true;
        takePlacementExam();
    }
    
    updateUI();
}

function takePlacementExam() {
    const results = [];
    
    for (let subj of getClassSubjects()) {
        const level = getLevel(subj);
        const status = getStatus();
        const baseScore = Math.floor((level * status) / 100);
        const fluctuation = randomInt(-10, 10);
        const finalScore = Math.max(0, Math.min(100, baseScore + fluctuation));
        
        gameState.exam_scores[subj].push(finalScore);
        results.push({ subject: SUBJECT_NAMES[subj], score: finalScore, needClass: false, revealed: false, appealed: false, appealChange: 0, subjectIndex: subj });
    }
    
    examRevealData = {
        results: results,
        totalScore: results.reduce((a, b) => a + b.score, 0),
        mentalChange: 0,
        isPlacement: true
    };
    
    addMessage("欢迎参加开学摸底考！成绩不计入正式成绩。", "info");
    showPlacementExamReveal();
}

function showPlacementExamReveal() {
    let html = '<p style="text-align: center; color: #666; margin-bottom: 20px;">欢迎参加开学摸底考！</p>';
    const revealedCount = examRevealData.results.filter(r => r.revealed).length;
    
    examRevealData.results.forEach((r, index) => {
        const cls = r.revealed ? '' : 'unrevealed';
        
        html += `
            <div class="exam-result-item ${cls}" onclick="revealSubjectScore(${index})" style="cursor: pointer;">
                <span class="subject">${r.subject}</span>
                <span class="score">${r.revealed ? r.score + '分' : '点击揭晓'}</span>
            </div>
        `;
    });

    if (revealedCount >= getClassSubjectCount()) {
        html += `
            <div class="exam-total">
                <div class="label">摸底考总成绩</div>
                <div class="value">${examRevealData.totalScore}分</div>
                <div style="font-size: 0.9rem; color: #666; margin-top: 5px;">（不计入正式成绩）</div>
            </div>
        `;
    }

    document.getElementById('exam-results').innerHTML = html;
    document.getElementById('exam-modal').classList.add('show');
    
    const continueBtn = document.getElementById('continue-btn');
    if (continueBtn) {
        continueBtn.style.display = revealedCount >= getClassSubjectCount() ? 'block' : 'none';
        continueBtn.textContent = revealedCount >= getClassSubjectCount() ? '开始新学期' : '继续';
    }
}

function simulatedExam() {
    if (gameState.time < 2) {
        addMessage("时间不足！", "warning");
        return;
    }
    
    // 检查是否处于上瘾状态
    if (gameState.challenges.includes('addiction') && gameState.is_addicted) {
        addMessage("上瘾状态下无法进行模拟考！", "error");
        return;
    }
    
    // 检查本周是否已进行过模拟考
    if (gameState.simulated_exam_done) {
        addMessage("本周已经进行过模拟考了！", "warning");
        return;
    }
    
    gameState.time -= 2;
    gameState.simulated_exam_done = true;
    
    const subjectIndices = getClassSubjects();
    const results = [];
    let totalScore = 0;
    
    const status = getStatus();
    subjectIndices.forEach((subjectIndex) => {
        const level = [gameState.student.chinese_level, gameState.student.math_level, 
                      gameState.student.english_level, gameState.student.foreign_level][subjectIndex];
        const baseScore = Math.floor((level * status) / 100);
        const fluctuation = randomInt(-10, 10);
        const score = Math.max(0, Math.min(100, baseScore + fluctuation));
        totalScore += score;
        results.push({ subject: SUBJECT_NAMES[subjectIndex], score, revealed: true, scoreChange: 0, mentalChange: 0, rankChange: 0, needClass: false, appealed: false, appealChange: 0, subjectIndex: subjectIndex });
    });
    
    // 模拟考造成生理、心理各减 rand(0,1)
    const multiplier = getChallengeMultiplier();
    const physicalReduction = randomInt(0, 1 * multiplier);
    const mentalReduction = randomInt(0, 1 * multiplier);
    gameState.student.physical_state = Math.max(0, gameState.student.physical_state - physicalReduction);
    gameState.student.mental_state = Math.max(0, gameState.student.mental_state - mentalReduction);
    
    examRevealData = {
        results: results,
        totalScore: totalScore,
        isPlacement: false,
        isSimulated: true,
        mentalChange: mentalReduction,
        physicalChange: physicalReduction
    };
    
    addMessage("📝 进行了一场模拟考！", "info");
    // 禁用模拟考按钮
    const examBtn = document.getElementById('btn-simulated-exam');
    if (examBtn) {
        examBtn.disabled = true;
        examBtn.style.opacity = '0.5';
        examBtn.style.cursor = 'not-allowed';
    }
    
    updateUI();
    autoSave();
    showSimulatedExamReveal();
}

function showSimulatedExamReveal() {
    let html = '<p style="text-align: center; color: #666; margin-bottom: 20px;">模拟考结果（不计入正式成绩）</p>';
    
    // 直接显示所有成绩
    examRevealData.results.forEach((r) => {
        html += `
            <div class="exam-result-item">
                <span class="subject">${r.subject}</span>
                <span class="score">${r.score}分</span>
            </div>
        `;
    });

    // 显示总成绩和生心理变化
    html += `
        <div class="exam-total">
            <div class="label">模拟考总成绩</div>
            <div class="value">${examRevealData.totalScore}分</div>
            <div style="font-size: 0.9rem; color: #666; margin-top: 5px;">（不计入正式成绩）</div>
        </div>
    `;
    
    // 显示生心理变化
    let stateChanges = '';
    if (examRevealData.physicalChange > 0) {
        stateChanges += `<div style="color: #e74c3c; font-size: 0.9rem;">生理-${examRevealData.physicalChange}</div>`;
    }
    if (examRevealData.mentalChange > 0) {
        stateChanges += `<div style="color: #e74c3c; font-size: 0.9rem;">心理-${examRevealData.mentalChange}</div>`;
    }
    if (stateChanges) {
        html += `<div style="margin-top: 10px; text-align: center;">${stateChanges}</div>`;
    }
    
    // 找出成绩最差的学科并增加水平
    const worstResult = examRevealData.results.reduce((min, r) => r.score < min.score ? r : min);
    const worstSubjectIndex = SUBJECT_NAMES.indexOf(worstResult.subject);
    const improvement = randomInt(0, 3);
    
    if (improvement > 0) {
        switch (worstSubjectIndex) {
            case CHINESE: gameState.student.chinese_level += improvement; break;
            case MATH: gameState.student.math_level += improvement; break;
            case ENGLISH: gameState.student.english_level += improvement; break;
            case FOREIGN: gameState.student.foreign_level += improvement; break;
        }
        html += `
            <div style="margin-top: 15px; padding: 10px; background: #e8f5e9; border-radius: 8px; text-align: center;">
                <div style="color: #2ecc71; font-size: 1rem;">
                    📈 你通过复盘，${worstResult.subject}学科水平增加了！
                </div>
            </div>
        `;
        addMessage(`📈 ${worstResult.subject}学科水平增加（模拟考复盘）`, "success");
    }

    document.getElementById('exam-results').innerHTML = html;
    document.getElementById('exam-modal').classList.add('show');
    
    const continueBtn = document.getElementById('continue-btn');
    if (continueBtn) {
        continueBtn.style.display = 'block';
        continueBtn.textContent = '继续';
    }
}

function openRules() {
    document.getElementById('rules-modal').classList.add('show');
}

function closeRules() {
    document.getElementById('rules-modal').classList.remove('show');
}

function loadScoldingTexts() {
    // 使用内嵌数据，不再从文件加载
}

function loadDifficultyConfig() {
    // 使用内嵌数据，不再从文件加载
    configLoaded = true;
    showDifficultySelection();
    showClassSelection();
}

const SAVE_KEY_PREFIX = 'game_save_';
const MAX_SAVE_SLOTS = 4;

function saveGame(slotIndex = null, silent = false) {
    if (slotIndex === null) {
        // 显示存档槽选择界面
        showSaveModal();
        return;
    }
    
    const saveData = {
        timestamp: Date.now(),
        // 基本信息
        week: gameState.current_week,
        totalWeeks: gameState.total_weeks,
        gameOver: gameState.game_over,
        gameResult: gameState.game_result,
        // 学科水平
        levels: {
            chinese: gameState.student.chinese_level,
            math: gameState.student.math_level,
            english: gameState.student.english_level,
            foreign: gameState.student.foreign_level
        },
        // 生心理状态
        states: {
            physical: gameState.student.physical_state,
            mental: gameState.student.mental_state
        },
        // 作业完成情况
        homework: gameState.homework_completed.map(h => h.slice()),
        // 考试分数
        examScores: gameState.exam_scores.map(e => e.slice()),
        // 平时成绩权重
        usualWeight: [...gameState.usual_weight],
        // 每周难度
        weeklyDifficulty: [...gameState.weekly_difficulty],
        // 时间相关
        timeReduction: gameState.time_reduction,
        remainingTime: remainingTime,
        // 摸底考
        placementExamTaken: gameState.placement_exam_taken,
        // 补差班
        remedialWeeks: [...gameState.remedial_weeks],
        remedialInfo: {...gameState.remedial_info},
        // 配置
        classType: gameState.classType,
        difficulty: gameState.difficulty,
        // 模拟考
        simulatedExamDone: gameState.simulated_exam_done,
        // 挑战模式
        challenges: gameState.challenges ? [...gameState.challenges] : [],
        // 上瘾状态
        isAddicted: gameState.is_addicted || false,
        // 连续失败计数
        studyFailureStreak: gameState.study_failure_streak || 0,
        homeworkFailureStreak: gameState.homework_failure_streak || 0,
        // 当前游戏会话解锁的成就
        sessionAchievements: [...(gameState.session_achievements || [])]
    };
    
    localStorage.setItem(SAVE_KEY_PREFIX + slotIndex, JSON.stringify(saveData));
    
    // 自动保存时不显示提示
    if (!silent) {
        addMessage('游戏已保存！', 'success');
    }
}

function autoSave() {
    // 自动保存到存档槽0，静默模式
    saveGame(0, true);
}

function getAllSaves() {
    const saves = [];
    for (let i = 0; i < MAX_SAVE_SLOTS; i++) {
        const data = localStorage.getItem(SAVE_KEY_PREFIX + i);
        if (data) {
            saves.push(JSON.parse(data));
        }
    }
    return saves;
}

function showSaveModal() {
    const slotsContainer = document.getElementById('save-slots');
    let html = '';
    
    for (let i = 0; i < MAX_SAVE_SLOTS; i++) {
        if (i === 0) {
            // 槽0为自动保存，不可手动操作
            const data = localStorage.getItem(SAVE_KEY_PREFIX + 0);
            if (data) {
                const save = JSON.parse(data);
                const date = new Date(save.timestamp);
                const dateStr = `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
                const totalLevel = (save.levels.chinese || 0) + (save.levels.math || 0) + (save.levels.english || 0) + (save.levels.foreign || 0);
                const totalState = (save.states.physical || 0) + (save.states.mental || 0);
                html += `
                    <div class="save-slot auto-save">
                        <div class="save-slot-info">
                            <span class="save-slot-week">📌 自动保存</span>
                            <span class="save-slot-date">第${save.week}周 - ${dateStr}</span>
                        </div>
                        <div class="save-slot-details">
                            学科: ${totalLevel} | 状态: ${totalState}
                        </div>
                        <div class="save-slot-details">
                            挑战: ${save.challenges && save.challenges.length > 0 ? save.challenges.map(c => CHALLENGES[c]?.name).join(' ') : '无'}
                        </div>
                        <div class="save-slot-action" style="color: #999;">系统自动保存，无法手动操作</div>
                    </div>
                `;
            } else {
                html += `
                    <div class="save-slot auto-save">
                        <div class="save-slot-info">
                            <span class="save-slot-week">📌 自动保存</span>
                            <span class="save-slot-date">暂无自动存档</span>
                        </div>
                        <div class="save-slot-action" style="color: #999;">系统自动保存，无法手动操作</div>
                    </div>
                `;
            }
            continue;
        }
        
        const data = localStorage.getItem(SAVE_KEY_PREFIX + i);
        if (data) {
            const save = JSON.parse(data);
            const date = new Date(save.timestamp);
            const dateStr = `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
            const totalLevel = (save.levels.chinese || 0) + (save.levels.math || 0) + (save.levels.english || 0) + (save.levels.foreign || 0);
            const totalState = (save.states.physical || 0) + (save.states.mental || 0);
            
            html += `
                <div class="save-slot" onclick="confirmSave(${i})">
                    <div class="save-slot-info">
                        <span class="save-slot-week">存档槽 ${i}</span>
                        <span class="save-slot-date">第${save.week}周 - ${dateStr}</span>
                    </div>
                    <div class="save-slot-details">
                        学科: ${totalLevel} | 状态: ${totalState}
                    </div>
                    <div class="save-slot-details">
                        挑战: ${save.challenges && save.challenges.length > 0 ? save.challenges.map(c => CHALLENGES[c]?.name).join(' ') : '无'}
                    </div>
                    <div class="save-slot-action">点击保存（将覆盖）</div>
                </div>
            `;
        } else {
            html += `
                <div class="save-slot empty" onclick="saveGame(${i})">
                    <div class="save-slot-info">
                        <span class="save-slot-week">存档槽 ${i}</span>
                        <span class="save-slot-date">空存档槽</span>
                    </div>
                    <div class="save-slot-action">点击保存</div>
                </div>
            `;
        }
    }
    
    slotsContainer.innerHTML = html;
    document.getElementById('load-modal').classList.add('show');
}

function confirmSave(slotIndex) {
    if (confirm('确定要覆盖这个存档吗？')) {
        saveGame(slotIndex);
        closeLoadModal();
    }
}

function showLoadModal(forContinue = false) {
    const slotsContainer = document.getElementById('save-slots');
    let html = '';
    
    for (let i = 0; i < MAX_SAVE_SLOTS; i++) {
        if (i === 0) {
            // 槽0为自动保存
            const data = localStorage.getItem(SAVE_KEY_PREFIX + 0);
            if (data) {
                const save = JSON.parse(data);
                const date = new Date(save.timestamp);
                const dateStr = `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
                if (forContinue) {
                    const totalLevel = (save.levels.chinese || 0) + (save.levels.math || 0) + (save.levels.english || 0) + (save.levels.foreign || 0);
                    const totalState = (save.states.physical || 0) + (save.states.mental || 0);
                    html += `
                        <div class="save-slot" onclick="loadGame(0)" style="border-left: 3px solid #ff9800;">
                            <div class="save-slot-info">
                                <span class="save-slot-week">📌 自动保存（上次游戏）</span>
                                <span class="save-slot-date">第${save.week}周 - ${dateStr}</span>
                            </div>
                            <div class="save-slot-details">
                                学科: ${totalLevel} | 状态: ${totalState}
                            </div>
                            <div class="save-slot-action">点击读取上次游戏</div>
                        </div>
                    `;
                } else {
                    const totalLevel = (save.levels.chinese || 0) + (save.levels.math || 0) + (save.levels.english || 0) + (save.levels.foreign || 0);
                    const totalState = (save.states.physical || 0) + (save.states.mental || 0);
                    html += `
                        <div class="save-slot auto-save">
                            <div class="save-slot-info">
                                <span class="save-slot-week">📌 自动保存</span>
                                <span class="save-slot-date">第${save.week}周 - ${dateStr}</span>
                            </div>
                            <div class="save-slot-details">
                                学科: ${totalLevel} | 状态: ${totalState}
                            </div>
                            <div class="save-slot-action" style="color: #999;">系统自动保存，无法手动读取</div>
                        </div>
                    `;
                }
            } else {
                html += `
                    <div class="save-slot auto-save">
                        <div class="save-slot-info">
                            <span class="save-slot-week">📌 自动保存</span>
                            <span class="save-slot-date">暂无自动存档</span>
                        </div>
                        <div class="save-slot-action" style="color: #999;">暂无存档</div>
                    </div>
                `;
            }
            continue;
        }
        
        const data = localStorage.getItem(SAVE_KEY_PREFIX + i);
        if (data) {
            const save = JSON.parse(data);
            const date = new Date(save.timestamp);
            const dateStr = `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
            const totalLevel = (save.levels.chinese || 0) + (save.levels.math || 0) + (save.levels.english || 0) + (save.levels.foreign || 0);
            const totalState = (save.states.physical || 0) + (save.states.mental || 0);
            
            html += `
                <div class="save-slot" onclick="loadGame(${i})">
                    <div class="save-slot-info">
                        <span class="save-slot-week">存档槽 ${i}</span>
                        <span class="save-slot-date">第${save.week}周 - ${dateStr}</span>
                    </div>
                    <div class="save-slot-details">
                        学科: ${totalLevel} | 状态: ${totalState}
                    </div>
                    <div class="save-slot-action">点击读取</div>
                </div>
            `;
        } else {
            html += `
                <div class="save-slot empty">
                    <div class="save-slot-info">
                        <span class="save-slot-week">存档槽 ${i}</span>
                        <span class="save-slot-date">空存档槽</span>
                    </div>
                </div>
            `;
        }
    }
    
    slotsContainer.innerHTML = html;
    document.getElementById('load-modal').classList.add('show');
}

function closeLoadModal() {
    document.getElementById('load-modal').classList.remove('show');
}

function showTitleProgressModal(percent, isComplete) {
    const content = document.getElementById('title-progress-content');
    
    // 获取当前段位
    const currentTitle = getTitleByProgress(percent, isComplete);
    const currentIdx = TITLES.findIndex(t => t.name === currentTitle.name);
    
    // 构建段位进度条/时间轴
    let html = '';
    
    // 当前进度显示
    html += `
        <div style="text-align: center; margin-bottom: 20px; padding: 15px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px;">
            <div style="color: white; font-size: 1rem;">当前进度</div>
            <div style="color: #ffd700; font-size: 2rem; font-weight: bold;">${percent.toFixed(1)}%</div>
            <div style="margin-top: 10px;">${renderTitleHTML(currentTitle)}</div>
        </div>
    `;
    
    // 段位时间轴
    html += `<div style="position: relative; padding: 10px 0;">`;
    
    // 进度条背景
    html += `
        <div style="background: linear-gradient(to right, #808080, #00ff00, #00ffff, #0080ff, #8000ff, #ff8000, #ff6000, #ff0000, #cc0000, #ff0000, #ffd700); 
                    height: 8px; border-radius: 4px; margin: 20px 0; position: relative;">
            <div style="position: absolute; left: ${Math.min(percent, 100)}%; top: -6px; width: 20px; height: 20px; 
                        background: #fff; border: 3px solid #667eea; border-radius: 50%; transform: translateX(-50%);"></div>
        </div>
    `;
    
    // 各段位详情
    html += `<div style="display: flex; flex-direction: column; gap: 8px;">`;
    
    TITLES.forEach((title, idx) => {
        const isCurrent = idx === currentIdx;
        const isAchieved = percent >= title.minPercent || (isComplete && title.minPercent === 100);
        const isNext = idx === currentIdx + 1 && !isComplete;
        
        // 段位颜色处理
        let titleColorStyle = '';
        if (title.color === 'legendary') {
            titleColorStyle = 'color: #ff0000;';
        } else if (title.color === 'top') {
            titleColorStyle = 'color: #ffd700;';
        } else {
            titleColorStyle = `color: ${title.color};`;
        }
        
        // 段位项样式
        let itemStyle = 'padding: 10px 15px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center;';
        if (isCurrent) {
            itemStyle += ' background: rgba(102, 126, 234, 0.2); border: 2px solid #667eea;';
        } else if (isAchieved) {
            itemStyle += ' background: rgba(39, 174, 96, 0.1);';
        } else {
            itemStyle += ' background: rgba(255, 255, 255, 0.5); opacity: 0.7;';
        }
        
        html += `
            <div style="${itemStyle}">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="font-size: 1.2rem; ${titleColorStyle}; font-weight: bold;">${title.name}</span>
                    ${isCurrent ? '<span style="background: #667eea; color: white; padding: 2px 8px; border-radius: 4px; font-size: 0.8rem;">当前</span>' : ''}
                    ${isAchieved && !isCurrent ? '<span style="color: #27ae60;">✓</span>' : ''}
                </div>
                <div style="text-align: right;">
                    <span style="font-size: 0.9rem; color: #666;">${title.minPercent}%</span>
                    ${isNext ? `<span style="font-size: 0.8rem; color: #e74c3c; margin-left: 5px;">还需 ${(title.minPercent - percent).toFixed(1)}%</span>` : ''}
                </div>
            </div>
        `;
    });
    
    html += `</div>`;
    html += `</div>`;
    
    content.innerHTML = html;
    document.getElementById('title-progress-modal').classList.add('show');
}

function closeTitleProgressModal() {
    document.getElementById('title-progress-modal').classList.remove('show');
}

// ==================== 文件保存/读取功能 ====================

// Base64 编码函数
function encodeBase64(str) {
    // 使用 UTF-8 编码处理中文
    const utf8Str = unescape(encodeURIComponent(str));
    return btoa(utf8Str);
}

// Base64 解码函数
function decodeBase64(str) {
    try {
        const utf8Str = atob(str);
        return decodeURIComponent(escape(utf8Str));
    } catch (e) {
        console.error('Base64解码失败:', e);
        return null;
    }
}

// 导出游戏到文件
function exportGameToFile() {
    // 收集所有 localStorage 数据
    const allData = {};
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        // 保存游戏相关的数据
        // 存档: game_save_*
        // 成就: achievements
        if (key.startsWith('game_save_') || key === 'achievements') {
            allData[key] = localStorage.getItem(key);
        }
    }
    
    // 检查是否有数据
    if (Object.keys(allData).length === 0) {
        alert('没有可保存的游戏数据！\n请先在游戏中保存存档。');
        return;
    }
    
    // 转换为 JSON 并 Base64 加密
    const jsonStr = JSON.stringify(allData);
    const encryptedData = encodeBase64(jsonStr);
    
    // 生成文件名：日期时间.exam
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const fileName = `${year}${month}${day}_${hours}${minutes}.exam`;
    
    // 创建 Blob 并下载
    const blob = new Blob([encryptedData], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert(`游戏已保存到文件：${fileName}\n包含 ${Object.keys(allData).length} 个数据项`);
}

// 导入游戏文件（触发文件选择）
function importGameFromFile() {
    document.getElementById('import-file-input').click();
}

// 处理文件导入
function handleFileImport(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // 检查文件扩展名
    if (!file.name.endsWith('.exam')) {
        alert('请选择 .exam 文件！');
        event.target.value = ''; // 清空文件选择
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            // Base64 解密
            const encryptedData = e.target.result;
            const decryptedData = decodeBase64(encryptedData);
            
            if (!decryptedData) {
                alert('文件解密失败，可能文件已损坏！');
                event.target.value = '';
                return;
            }
            
            // 解析 JSON
            const allData = JSON.parse(decryptedData);
            
            // 写入 localStorage
            for (const [key, value] of Object.entries(allData)) {
                localStorage.setItem(key, value);
            }
            
            alert(`游戏数据已从文件 ${file.name} 读取成功！\n请点击"继续游戏"开始。`);
            
            // 清空文件选择
            event.target.value = '';
            
        } catch (error) {
            console.error('导入失败:', error);
            alert('文件读取失败，可能文件格式不正确！');
            event.target.value = '';
        }
    };
    
    reader.onerror = function() {
        alert('文件读取失败！');
        event.target.value = '';
    };
    
    reader.readAsText(file);
}

function loadGame(slotIndex) {
    const data = localStorage.getItem(SAVE_KEY_PREFIX + slotIndex);
    if (!data) {
        alert('存档不存在！');
        return;
    }
    
    const save = JSON.parse(data);
    
    document.getElementById('load-modal').classList.remove('show');
    
    // 加载班级类型和难度
    if (save.classType) {
        currentClassType = save.classType;
        gameState.classType = save.classType;
    }
    if (save.difficulty) {
        currentDifficulty = save.difficulty;
        gameState.difficulty = save.difficulty;
        gameState.weekly_time = DIFFICULTY_CONFIG[currentDifficulty].weeklyTime;
    }
    
    // 加载学科水平
    gameState.student.chinese_level = save.levels.chinese;
    gameState.student.math_level = save.levels.math;
    gameState.student.english_level = save.levels.english;
    gameState.student.foreign_level = save.levels.foreign || 0;
    
    // 加载生心理状态
    gameState.student.physical_state = save.states.physical;
    gameState.student.mental_state = save.states.mental;
    
    // 加载基本信息
    gameState.current_week = save.week;
    gameState.total_weeks = save.totalWeeks || 16;
    gameState.game_over = save.gameOver || false;
    gameState.game_result = save.gameResult || "";
    
    // 加载作业完成情况
    gameState.homework_completed = save.homework;
    
    // 加载考试分数
    gameState.exam_scores = save.examScores;
    
    // 加载平时成绩权重
    gameState.usual_weight = save.usualWeight;
    
    // 加载每周难度
    gameState.weekly_difficulty = save.weeklyDifficulty || [];
    
    // 加载时间相关
    gameState.time_reduction = save.timeReduction;
    gameState.placement_exam_taken = save.placementExamTaken;
    
    // 加载补差班
    gameState.remedial_weeks = save.remedialWeeks || [];
    gameState.remedial_info = save.remedialInfo || {};
    
    // 加载模拟考状态
    gameState.simulated_exam_done = save.simulatedExamDone || false;
    
    // 加载挑战模式
    gameState.challenges = save.challenges || [];
    currentChallenges = gameState.challenges;
    
    // 加载上瘾状态
    gameState.is_addicted = save.isAddicted || false;
    
    // 加载连续失败计数
    gameState.study_failure_streak = save.studyFailureStreak || 0;
    gameState.homework_failure_streak = save.homeworkFailureStreak || 0;
    
    // 加载当前游戏会话解锁的成就
    gameState.session_achievements = save.sessionAchievements || [];
    
    remainingTime = save.remainingTime !== undefined ? save.remainingTime : (gameState.weekly_time - gameState.time_reduction);
    messages = [];
    
    addMessage(`已加载第${save.week}周的存档！`, 'info');
    updateUI();
    
    document.querySelector('.start-screen').style.display = 'none';
    document.getElementById('intro-screen').classList.remove('show');
    document.getElementById('achievements-screen').classList.remove('show');
    document.getElementById('achievement-detail-screen').classList.remove('show');
    document.querySelector('.game-screen').classList.add('show');
    
    // 读档后覆盖存档槽0
    autoSave();
}

function closeLoadModal() {
    document.getElementById('load-modal').classList.remove('show');
}

window.onload = function() {
    loadScoldingTexts();
    loadDifficultyConfig();
    initGame();
}

function showDifficultySelection() {
    renderChangelog();
    const container = document.getElementById('difficulty-options');
    if (!container) return;
    
    let html = '';
    for (const [key, diff] of Object.entries(DIFFICULTY_CONFIG)) {
        const selected = key === currentDifficulty ? 'active' : '';
        html += `
            <button class="difficulty-btn ${selected}" data-diff="${key}" onclick="selectDifficulty('${key}')">
                <span class="name">${diff.name}</span>
                <span class="desc">学科${diff.totalLevel} 身心${diff.totalState} 时间${diff.weeklyTime}</span>
            </button>
        `;
    }
    container.innerHTML = html;
    
    // 显示挑战模式选择
    const challengeContainer = document.getElementById('challenge-options');
    if (challengeContainer) {
        let challengeHtml = '<h3>挑战</h3><div class="difficulty-grid">';
        for (const [key, challenge] of Object.entries(CHALLENGES)) {
            const isActive = currentChallenges.includes(key);
            challengeHtml += `
                <button class="difficulty-btn ${isActive ? 'active' : ''}" onclick="toggleChallenge('${key}')">
                    <span class="name">${challenge.name}</span>
                    <span class="desc">${challenge.description}</span>
                </button>
            `;
        }
        challengeHtml += '</div>';
        challengeContainer.innerHTML = challengeHtml;
    }
}

function selectDifficulty(diffKey) {
    currentDifficulty = diffKey;
    showDifficultySelection();
    document.getElementById('selected-difficulty').textContent = DIFFICULTY_CONFIG[diffKey].name;
}

function toggleChallenge(challengeKey) {
    const index = currentChallenges.indexOf(challengeKey);
    if (index === -1) {
        currentChallenges.push(challengeKey);
    } else {
        currentChallenges.splice(index, 1);
    }
    showDifficultySelection();
}

function selectClass(classKey) {
    currentClassType = classKey;
    showClassSelection();
    const classNames = {
        'science': '理科班',
        'arts': '文科班',
        'comprehensive': '综合班',
        'belt': '一带一路班'
    };
    document.getElementById('selected-class').textContent = classNames[classKey];
}

function showClassSelection() {
    const container = document.getElementById('class-options');
    if (!container) return;
    
    let html = '';
    const classes = [
        { key: 'science', name: '理科班', desc: '只需学习数学' },
        { key: 'arts', name: '文科班', desc: '学习语文、英语' },
        { key: 'comprehensive', name: '综合班', desc: '学习语数英' },
        { key: 'belt', name: '一带一路班', desc: '学习语数英+外语' }
    ];
    
    for (const cls of classes) {
        const selected = cls.key === currentClassType ? 'active' : '';
        html += `
            <button class="difficulty-btn ${selected}" data-class="${cls.key}" onclick="selectClass('${cls.key}')">
                <span class="name">${cls.name}</span>
                <span class="desc">${cls.desc}</span>
            </button>
        `;
    }
    container.innerHTML = html;
}
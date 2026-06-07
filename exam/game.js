const SUBJECT_NAMES = ["语文", "数学", "英语", "外语"];
const CHINESE = 0, MATH = 1, ENGLISH = 2, FOREIGN = 3;
const SUBJECT_COUNT = 3;

const CLASS_TYPE = {
    SCIENCE: 'science',   // 理科班：只学数学
    ARTS: 'arts',         // 文科班：学语文、英语
    COMPREHENSIVE: 'comprehensive', // 综合班：学语数英
    BELT: 'belt'          // 一带一路班：学语数英+外语
};

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
        simulated_exam_done: false
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
    gameState.student.physical_state = Math.min(50, minState + randomInt(0, Math.max(0, maxRandom)));
    gameState.student.mental_state = Math.min(50, Math.max(minState, total_state - gameState.student.physical_state));

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
    gameState.weekly_difficulty = [randomDouble(0.3, 0.9), randomDouble(0.3, 0.9), randomDouble(0.3, 0.9), randomDouble(0.3, 0.9)];
}

function getDifficultyText(value) {
    if (value < 0.5) return '困难';
    if (value < 0.7) return '中等';
    return '容易';
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

    if (gameState.homework_completed[subject][gameState.current_week - 1]) {
        addMessage(`${SUBJECT_NAMES[subject]}作业本周已完成！`, "warning");
        return;
    }

    const status = getStatus();
    const level = getLevel(subject);
    const difficulty = gameState.weekly_difficulty[subject];

    const probability = (status / 100.0) * (Math.sqrt(level) / 10.0) * difficulty;
    
    remainingTime--;
    
    if (Math.random() < probability) {
        gameState.homework_completed[subject][gameState.current_week - 1] = true;
        addMessage(`${SUBJECT_NAMES[subject]}作业完成！(耗时: 1)`, "success");
    } else {
        addMessage(`${SUBJECT_NAMES[subject]}作业失败！(耗时: 1)`, "warning");
    }
    
    updateUI();
    autoSave();
}

function study(subject) {
    if (remainingTime <= 0) {
        addMessage("时间不足！", "error");
        return;
    }

    const status = getStatus();
    const probability = status / 180.0;
    
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
    } else {
        const failMsg = [
            `这些${SUBJECT_NAMES[subject]}知识也太简单了，你本来就会。`,
            `你似乎并没有理解这些${SUBJECT_NAMES[subject]}相关知识。`
        ];
        addMessage(failMsg[randomInt(0, 1)], "warning");
    }
    
    updateUI();
    autoSave();
}

function play() {
    if (remainingTime <= 0) {
        addMessage("时间不足！", "error");
        return;
    }

    remainingTime--;
    const increase = randomInt(0, 4) * 2 - 1;
    gameState.student.mental_state = Math.min(50, Math.max(0, gameState.student.mental_state + increase));
    if (increase >= 0) {
        addMessage(`玩耍快乐！心理状态+${increase}`, "success");
    } else {
        addMessage(`玩耍消耗！心理状态${increase}`, "warning");
    }
    updateUI();
    autoSave();
}

function sleep(sleepTime) {
    if (sleepTime <= 0) {
        gameState.student.physical_state = Math.max(0, gameState.student.physical_state - 20);
        addMessage("未睡觉！生理状态-20", "error");
    } else if (sleepTime <= 7) {
        const reduce = Math.floor(randomInt(7, 10) / sleepTime);
        gameState.student.physical_state = Math.max(0, gameState.student.physical_state - reduce);
        addMessage(`睡眠时间不足，生理状态-${reduce}`, "warning");
    } else {
        const increase = sleepTime - 7;
        gameState.student.physical_state = Math.min(50, gameState.student.physical_state + increase);
        addMessage(`充足睡眠！生理状态+${increase}`, "success");
    }
}

function weeklyDecay() {
    const decay = {
        chinese: randomInt(0, 2),
        math: randomInt(0, 2),
        english: randomInt(0, 2),
        physical: randomInt(0, 2),
        mental: randomInt(0, 2)
    };

    gameState.student.chinese_level = Math.max(0, gameState.student.chinese_level - decay.chinese);
    gameState.student.math_level = Math.max(0, gameState.student.math_level - decay.math);
    gameState.student.english_level = Math.max(0, gameState.student.english_level - decay.english);
    gameState.student.physical_state = Math.max(0, gameState.student.physical_state - decay.physical);
    gameState.student.mental_state = Math.max(0, gameState.student.mental_state - decay.mental);

    addMessage(`每周衰减：生理-${decay.physical} 心理-${decay.mental}`, "info");
}

function checkGameOver() {
    if (gameState.student.physical_state <= 5) {
        gameState.game_over = true;
        gameState.game_result = "猝死结局：你的生理状态过低，游戏结束。";
        showGameOver("💀", gameState.game_result);
        return true;
    }
    if (gameState.student.mental_state <= 5) {
        gameState.game_over = true;
        gameState.game_result = "自杀结局：你的心理状态过低，游戏结束。";
        showGameOver("😢", gameState.game_result);
        return true;
    }
    return false;
}

function showGameOver(title, message) {
    document.getElementById('gameover-title').textContent = title;
    document.getElementById('gameover-message').textContent = message;
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

        // 考试成绩<=40，需要参加补差班
        if (finalScore <= 40) {
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
            needClass: finalScore <= 40, 
            revealed: false,
            scoreChange: scoreChange,
            mentalChange: mentalChangeForSubject,
            rankChange: rankChange
        });
    }

    // 为每门<=40分的学科，添加接下来4周的补差班标记
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
    const subjectMentalReductions = {};
    let totalMentalReduction = 0;
    
    if (scoldingType === 'homework') {
        // 作业训导：每个科目心理减少rand(0,3)，独立计算（教师训导不影响生理）
        subjects.forEach(subject => {
            const mentalReduction = randomInt(0, 3);
            subjectMentalReductions[subject] = mentalReduction;
            totalMentalReduction += mentalReduction;
            gameState.student.mental_state = Math.max(0, gameState.student.mental_state - mentalReduction);
        });
        weeklyStateChanges.mental = -totalMentalReduction;
        
        // 计算联系家长概率：每科没做作业增加rand(3,11)%
        let contactProbability = 0;
        subjects.forEach(() => {
            contactProbability += randomInt(3, 11) / 100;
        });
        
        // 保存联系家长概率和是否触发
        scoldingData.contactParent = Math.random() < contactProbability;
    } else {
        // 考试训导：每个科目心理减少rand(0,3)，独立计算（教师训导不影响生理）
        subjects.forEach(subject => {
            const mentalReduction = randomInt(0, 3);
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
    const physicalReduction = randomInt(1, 7);
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
        
        if (r.revealed && r.scoreChange !== 0) {
            const changeText = r.scoreChange > 0 ? `(+${r.scoreChange})` : `(${r.scoreChange})`;
            scoreDisplay = `${r.score}分 ${changeText}`;
            
            if (r.mentalChange !== 0) {
                const mentalText = r.mentalChange > 0 ? `心态+${r.mentalChange}` : `心态${r.mentalChange}`;
                const mentalColor = r.mentalChange > 0 ? '#27ae60' : '#e74c3c';
                changeDisplay = `<div style="font-size: 0.85rem; color: ${mentalColor}; text-align: right;">${mentalText}</div>`;
            }
        }
        
        html += `
            <div class="exam-result-item ${cls}" onclick="revealSubjectScore(${index})" style="cursor: pointer; display: flex; flex-direction: column; align-items: center;">
                <span class="subject">${r.subject}</span>
                <span class="score" style="text-align: center; color: ${scoreColor}; font-weight: bold;">${scoreDisplay}</span>
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

function closeExamModal() {
    document.getElementById('exam-modal').classList.remove('show');
    
    if (examRevealData.isPlacement) {
        // 摸底考完成后直接进入游戏
        examRevealData = { results: [], revealIndex: 0, totalScore: 0, mentalChange: 0 };
        updateUI();
    } else if (examRevealData.isSimulated) {
        // 模拟考完成后直接更新UI，不影响其他流程
        examRevealData = { results: [], revealIndex: 0, totalScore: 0, mentalChange: 0 };
        updateUI();
    } else {
        // 正式考试：先检查是否有低分科目需要训导
        const lowScoreSubjects = examRevealData.lowScoreSubjects || [];
        examRevealData = { results: [], revealIndex: 0, totalScore: 0, mentalChange: 0 };
        
        if (lowScoreSubjects.length > 0) {
            showScoldingPage(lowScoreSubjects, 'exam');
        } else {
            weeklyDecay();
            if (checkGameOver()) return;
            completeWeek();
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
    html += `
        <tr style="background: #667eea; color: white;">
            <td style="border: 2px solid #667eea; padding: 20px; text-align: center; font-weight: bold; font-size: 1.4rem;">总成绩</td>
    `;
    let totalScore = 0;
    for (let subj of getClassSubjects()) {
        const completed = gameState.homework_completed[subj].filter(Boolean).length;
        const usualScore = Math.round(100 * completed / 16);
        const scores = getExamScores(subj);
        const examScore = scores.length > 0 ? Math.floor(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
        const weight = gameState.usual_weight[subj];
        const finalScore = Math.floor(usualScore * weight + examScore * (1 - weight));
        totalScore += finalScore;
        html += `<td style="border: 2px solid #667eea; padding: 20px; text-align: center; font-weight: bold; font-size: 1.4rem;">${finalScore}</td>`;
    }
    html += '</tr>';

    html += `
                </tbody>
            </table>
        </div>
        <div style="text-align: center; margin-top: 30px; padding: 25px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 20px;">
            <div style="font-size: 2.5rem; font-weight: bold; color: white;">得分: ${totalScore}/${maxScore}</div>
        </div>
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
    }

    updateUI();
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

    document.getElementById('chinese-difficulty').textContent = getDifficultyText(gameState.weekly_difficulty[CHINESE]);
    document.getElementById('math-difficulty').textContent = getDifficultyText(gameState.weekly_difficulty[MATH]);
    document.getElementById('english-difficulty').textContent = getDifficultyText(gameState.weekly_difficulty[ENGLISH]);

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

    document.getElementById('chinese-homework').textContent = `${chineseDone}/${totalHomework}`;
    document.getElementById('math-homework').textContent = `${mathDone}/${totalHomework}`;
    document.getElementById('english-homework').textContent = `${englishDone}/${totalHomework}`;

    // 根据班级类型显示/隐藏外语作业
    const foreignHwContainer = document.getElementById('foreign-homework-container');
    if (foreignHwContainer) {
        foreignHwContainer.style.display = subjects.includes(FOREIGN) ? 'flex' : 'none';
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
    
    const chineseBtn = document.getElementById('btn-homework-chinese');
    const mathBtn = document.getElementById('btn-homework-math');
    const englishBtn = document.getElementById('btn-homework-english');
    const foreignBtn = document.getElementById('btn-homework-foreign');
    
    // 学习按钮
    const studyChineseBtn = document.querySelector('button[onclick="study(0)"]');
    const studyMathBtn = document.querySelector('button[onclick="study(1)"]');
    const studyEnglishBtn = document.querySelector('button[onclick="study(2)"]');
    const studyForeignBtn = document.getElementById('btn-study-foreign');

    // 根据班级类型显示/隐藏作业按钮
    if (chineseBtn) {
        const isHidden = !subjects.includes(CHINESE);
        chineseBtn.dataset.classHidden = isHidden;
        chineseBtn.style.display = isHidden ? 'none' : 'block';
    }
    if (mathBtn) {
        const isHidden = !subjects.includes(MATH);
        mathBtn.dataset.classHidden = isHidden;
        mathBtn.style.display = isHidden ? 'none' : 'block';
    }
    if (englishBtn) {
        const isHidden = !subjects.includes(ENGLISH);
        englishBtn.dataset.classHidden = isHidden;
        englishBtn.style.display = isHidden ? 'none' : 'block';
    }
    if (foreignBtn) {
        const isHidden = !subjects.includes(FOREIGN);
        foreignBtn.dataset.classHidden = isHidden;
        foreignBtn.style.display = isHidden ? 'none' : 'block';
    }

    // 根据班级类型显示/隐藏学习按钮
    if (studyChineseBtn) {
        const isHidden = !subjects.includes(CHINESE);
        studyChineseBtn.dataset.classHidden = isHidden;
        studyChineseBtn.style.display = isHidden ? 'none' : 'block';
    }
    if (studyMathBtn) {
        const isHidden = !subjects.includes(MATH);
        studyMathBtn.dataset.classHidden = isHidden;
        studyMathBtn.style.display = isHidden ? 'none' : 'block';
    }
    if (studyEnglishBtn) {
        const isHidden = !subjects.includes(ENGLISH);
        studyEnglishBtn.dataset.classHidden = isHidden;
        studyEnglishBtn.style.display = isHidden ? 'none' : 'block';
    }
    if (studyForeignBtn) {
        const isHidden = !subjects.includes(FOREIGN);
        studyForeignBtn.dataset.classHidden = isHidden;
        studyForeignBtn.style.display = isHidden ? 'none' : 'block';
    }

    if (chineseBtn && subjects.includes(CHINESE)) {
        chineseBtn.disabled = gameState.homework_completed[CHINESE][gameState.current_week - 1];
    }
    if (mathBtn && subjects.includes(MATH)) {
        mathBtn.disabled = gameState.homework_completed[MATH][gameState.current_week - 1];
    }
    if (englishBtn && subjects.includes(ENGLISH)) {
        englishBtn.disabled = gameState.homework_completed[ENGLISH][gameState.current_week - 1];
    }
    if (foreignBtn && subjects.includes(FOREIGN)) {
        foreignBtn.disabled = gameState.homework_completed[FOREIGN][gameState.current_week - 1];
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
    document.querySelector('.intro-screen').classList.remove('show');
    document.querySelector('.game-screen').classList.remove('show');
}

function openChangelog() {
    document.getElementById('changelog-modal').classList.add('show');
}

function closeChangelog() {
    document.getElementById('changelog-modal').classList.remove('show');
}

function renderChangelog() {
    const changelog = [
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
                '考试成绩<=40则接下来4周每周时间-1，清空之前的补差班记录',
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
    document.querySelector('.intro-screen').classList.add('show');
    
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
    document.querySelector('.intro-screen').classList.remove('show');
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
        results.push({ subject: SUBJECT_NAMES[subj], score: finalScore, needClass: false, revealed: false });
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
        results.push({ subject: SUBJECT_NAMES[subjectIndex], score, revealed: true, scoreChange: 0, mentalChange: 0, rankChange: 0, needClass: false });
    });
    
    // 模拟考造成生理、心理各减 rand(0,1)
    const physicalReduction = randomInt(0, 1);
    const mentalReduction = randomInt(0, 1);
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
        simulatedExamDone: gameState.simulated_exam_done
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
    
    remainingTime = save.remainingTime !== undefined ? save.remainingTime : (gameState.weekly_time - gameState.time_reduction);
    messages = [];
    
    addMessage(`已加载第${save.week}周的存档！`, 'info');
    updateUI();
    
    document.querySelector('.start-screen').style.display = 'none';
    document.querySelector('.intro-screen').classList.remove('show');
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
}

function selectDifficulty(diffKey) {
    currentDifficulty = diffKey;
    showDifficultySelection();
    document.getElementById('selected-difficulty').textContent = DIFFICULTY_CONFIG[diffKey].name;
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
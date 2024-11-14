class SurgeryGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.currentLevel = 1;
        this.score = 0;
        this.time = 60;
        this.aiEnabled = true;
        this.gameState = 'menu'; // menu, playing, paused, results
        
        this.setupCanvas();
        this.setupEventListeners();
        this.loadLevel(this.currentLevel);
    }

    loadLevel(levelNum) {
        const level = LEVELS[levelNum];
        this.currentChallenge = level.challenges[0];
        this.timeLimit = level.timeLimit;
        this.time = level.timeLimit;
        
        document.getElementById('currentChallenge').textContent = 
            `${this.currentChallenge.name}: ${this.currentChallenge.description}`;
            
        this.setupLevelSpecificElements(level);
    }

    setupLevelSpecificElements(level) {
        // 设置AI功能
        if (level.aiFeatures.pathPlanning) {
            this.enablePathPlanning();
        }
        if (level.aiFeatures.riskAnalysis) {
            this.enableRiskAnalysis();
        }
        // 设置关卡特定的目标和障碍物
        this.setupTargets(level);
        this.setupObstacles(level);
    }

    setupTargets(level) {
        this.targets = [];
        switch(level.name) {
            case "系统自检":
                this.addCalibrationTargets();
                break;
            case "手术规划":
                this.addSurgicalTargets();
                break;
            case "精确操作":
                this.addPrecisionTargets();
                break;
            case "人机协作":
                this.addCooperativeTargets();
                break;
        }
    }

    addCalibrationTargets() {
        // 添加校准点
        for (let i = 0; i < 5; i++) {
            this.targets.push({
                x: 100 + i * 150,
                y: 200,
                size: 15,
                type: 'calibration',
                completed: false
            });
        }
    }

    addSurgicalTargets() {
        // 添加手术目标
        this.targets.push({
            x: Math.random() * (this.canvas.width - 100) + 50,
            y: Math.random() * (this.canvas.height - 100) + 50,
            size: 30,
            type: 'tumor',
            completed: false
        });
    }

    update() {
        if (this.gameState !== 'playing') return;

        this.updateInstrumentPosition();
        this.checkCollisions();
        this.updateAIAssistance();
        this.updateStats();

        // 检查关卡完成条件
        if (this.checkLevelComplete()) {
            this.showResults();
        }
    }

    updateAIAssistance() {
        if (!this.aiEnabled) return;

        // 计算最近目标
        const nearestTarget = this.findNearestTarget();
        if (nearestTarget) {
            // 提供AI辅助指导
            this.showAIGuidance(nearestTarget);
            // 计算风险
            this.calculateRisk(nearestTarget);
        }
    }

    findNearestTarget() {
        let nearest = null;
        let minDist = Infinity;
        
        this.targets.forEach(target => {
            if (target.completed) return;
            
            const dist = this.calculateDistance(
                this.instrument.x, this.instrument.y,
                target.x, target.y
            );
            
            if (dist < minDist) {
                minDist = dist;
                nearest = target;
            }
        });
        
        return nearest;
    }

    showAIGuidance(target) {
        // 绘制AI辅助线
        this.ctx.beginPath();
        this.ctx.strokeStyle = 'rgba(0, 255, 0, 0.3)';
        this.ctx.moveTo(this.instrument.x, this.instrument.y);
        this.ctx.lineTo(target.x, target.y);
        this.ctx.stroke();

        // 显示AI建议
        const distance = this.calculateDistance(
            this.instrument.x, this.instrument.y,
            target.x, target.y
        );
        
        if (distance < 100) {
            this.showAIMessage("接近目标，请谨慎操作");
        }
    }

    calculateRisk(target) {
        // 计算风险因素
        const distance = this.calculateDistance(
            this.instrument.x, this.instrument.y,
            target.x, target.y
        );
        
        const speed = Math.sqrt(
            Math.pow(this.instrument.vx, 2) + 
            Math.pow(this.instrument.vy, 2)
        );
        
        const risk = (distance < 50 ? 0.5 : 0.2) + (speed * 0.1);
        
        // 更新风险显示
        document.getElementById('riskBar').style.width = `${risk * 100}%`;
    }

    showResults() {
        this.gameState = 'results';
        const resultsScreen = document.getElementById('results');
        resultsScreen.classList.remove('hidden');
        
        // 显示详细结果
        const scoreSummary = resultsScreen.querySelector('.score-summary');
        scoreSummary.innerHTML = `
            <h3>手术评分</h3>
            <p>总分: ${this.score}</p>
            <p>准确度: ${this.calculateAccuracy()}%</p>
            <p>用时: ${this.timeLimit - this.time}秒</p>
        `;
        
        // AI分析报告
        const aiAnalysis = resultsScreen.querySelector('.ai-analysis');
        aiAnalysis.innerHTML = `
            <h3>AI分析报告</h3>
            <p>操作稳定性: ${this.calculateStability()}%</p>
            <p>风险控制: ${this.calculateRiskControl()}%</p>
            <p>AI辅助效果: ${this.calculateAIEffectiveness()}%</p>
        `;
    }

    // ... (其他必要的游戏功能方法)
}

// 初始化游戏
window.addEventListener('load', () => {
    const game = new SurgeryGame();
}); 
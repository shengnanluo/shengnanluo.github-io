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

        // 添加AI分析系统
        this.aiSystem = {
            pathPlanning: {
                enabled: true,
                accuracy: 0.95,
                latency: 20 // ms
            },
            imageRecognition: {
                enabled: true,
                accuracy: 0.98,
                processingTime: 50 // ms
            },
            riskAssessment: {
                enabled: true,
                threshold: 0.3
            }
        };

        // 添加手术场景元素
        this.surgicalElements = {
            criticalAreas: [], // 重要器官区域
            targetAreas: [],   // 手术目标区域
            obstacles: []      // 手术障碍物
        };
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

    // 添加AI路径规划可视化
    visualizeAIPath(start, target) {
        if (!this.aiSystem.pathPlanning.enabled) return;

        const path = this.calculateSafePath(start, target);
        
        this.ctx.beginPath();
        this.ctx.strokeStyle = 'rgba(0, 255, 0, 0.3)';
        this.ctx.setLineDash([5, 5]);
        
        path.forEach((point, index) => {
            if (index === 0) {
                this.ctx.moveTo(point.x, point.y);
            } else {
                this.ctx.lineTo(point.x, point.y);
            }
        });
        
        this.ctx.stroke();
        this.ctx.setLineDash([]);
    }

    // AI风险评估
    assessRisk(position) {
        if (!this.aiSystem.riskAssessment.enabled) return 0;

        let risk = 0;
        
        // 检查与关键区域的距离
        this.surgicalElements.criticalAreas.forEach(area => {
            const distance = this.calculateDistance(position, area.position);
            if (distance < area.safeDistance) {
                risk += (area.safeDistance - distance) / area.safeDistance;
            }
        });

        return Math.min(1, risk);
    }

    // 添加手术挑战
    addSurgicalChallenge(level) {
        switch(level) {
            case 1: // 系统自检
                this.addCalibrationChallenge();
                break;
            case 2: // 手术规划
                this.addPathPlanningChallenge();
                break;
            case 3: // 精确操作
                this.addPrecisionChallenge();
                break;
            case 4: // 人机协作
                this.addCooperationChallenge();
                break;
        }
    }

    // 添加AI辅助消息
    showAIAssistance(message, type = 'info') {
        const aiMessage = document.createElement('div');
        aiMessage.className = `ai-message ${type}`;
        aiMessage.textContent = message;
        
        const feedback = document.getElementById('ai-feedback');
        feedback.appendChild(aiMessage);
        
        setTimeout(() => {
            aiMessage.remove();
        }, 3000);
    }

    // 更新AI系统状态
    updateAISystem() {
        // 更新AI性能指标
        const accuracy = this.calculateAIAccuracy();
        const latency = this.measureAILatency();
        const stability = this.assessAIStability();

        // 更新显示
        document.getElementById('accuracyBar').style.width = `${accuracy * 100}%`;
        document.getElementById('stabilityBar').style.width = `${stability * 100}%`;
        
        // 显示AI系统状态
        this.showAISystemStatus({
            accuracy,
            latency,
            stability
        });
    }

    // 模拟AI系统延迟
    simulateAILatency() {
        return new Promise(resolve => {
            const baseLatency = 20; // 基础延迟
            const variability = 10; // 延迟变化范围
            const latency = baseLatency + Math.random() * variability;
            
            setTimeout(resolve, latency);
        });
    }

    // 展示AI面临的挑战
    demonstrateAIChallenges() {
        const challenges = [
            {
                name: "数据质量",
                description: "处理不完整或噪声数据",
                simulation: () => this.simulateDataQualityIssues()
            },
            {
                name: "实时性要求",
                description: "在限定时间内完成决策",
                simulation: () => this.simulateTimeConstraints()
            },
            {
                name: "安全边界",
                description: "确保操作安全性",
                simulation: () => this.simulateSafetyConstraints()
            }
        ];

        challenges.forEach(challenge => {
            this.showChallenge(challenge);
        });
    }

    // 记录和分析AI性能
    analyzeAIPerformance() {
        const performance = {
            successRate: this.calculateSuccessRate(),
            averageAccuracy: this.calculateAverageAccuracy(),
            responseTime: this.calculateAverageResponseTime(),
            safetyScore: this.calculateSafetyScore()
        };

        return performance;
    }

    // ... (其他必要的游戏功能方法)
}

// 初始化游戏
window.addEventListener('load', () => {
    const game = new SurgeryGame();
}); 
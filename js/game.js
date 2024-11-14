class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.score = 0;
        this.currentLevel = 0;
        this.levels = [
            {
                id: 1,
                name: "医学图像识别",
                description: "使用AI视觉系统识别病变区域",
                type: "vision"
            },
            {
                id: 2,
                name: "手术路径规划",
                description: "利用AI规划最优手术路径",
                type: "pathPlanning"
            },
            {
                id: 3, 
                name: "风险评估",
                description: "AI辅助评估手术风险",
                type: "riskAssessment"
            }
        ];
        
        this.init();
    }

    init() {
        // 设置画布尺寸
        this.canvas.width = 800;
        this.canvas.height = 600;
        
        // 绑定按钮事件
        document.getElementById('startBtn').addEventListener('click', () => this.startGame());
        document.getElementById('nextBtn').addEventListener('click', () => this.nextLevel());
        
        // 显示开始界面
        this.showWelcomeScreen();
    }

    startGame() {
        this.score = 0;
        this.currentLevel = 0;
        this.updateScore();
        this.loadLevel(0);
    }

    loadLevel(levelIndex) {
        const level = this.levels[levelIndex];
        document.getElementById('level-info').innerHTML = `
            <h2>第${level.id}关: ${level.name}</h2>
            <p>${level.description}</p>
        `;

        // 根据关卡类型初始化相应模块
        switch(level.type) {
            case 'vision':
                this.currentModule = new MedicalVision(this);
                break;
            case 'pathPlanning':
                this.currentModule = new PathPlanning(this);
                break;
            case 'riskAssessment':
                this.currentModule = new RiskAssessment(this);
                break;
        }

        this.gameLoop();
    }

    gameLoop() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        if(this.currentModule) {
            this.currentModule.update();
            this.currentModule.draw();
        }

        requestAnimationFrame(() => this.gameLoop());
    }

    nextLevel() {
        if(this.currentLevel < this.levels.length - 1) {
            this.currentLevel++;
            this.loadLevel(this.currentLevel);
        } else {
            this.showGameComplete();
        }
    }

    updateScore(points = 0) {
        this.score += points;
        document.querySelector('#score span').textContent = this.score;
    }

    showWelcomeScreen() {
        this.ctx.fillStyle = '#2d3748';
        this.ctx.font = '30px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('欢迎来到AI医疗机器人模拟器', this.canvas.width/2, this.canvas.height/2);
        this.ctx.font = '20px Arial';
        this.ctx.fillText('点击"开始游戏"按钮开始体验', this.canvas.width/2, this.canvas.height/2 + 40);
    }
}

// 初始化游戏
window.onload = () => {
    new Game();
}; 
class SurgeryGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.score = 0;
        this.time = 60;
        this.aiEnabled = true;
        this.targets = [];
        this.instrument = {
            x: 400,
            y: 200,
            size: 20
        };
        
        this.setupCanvas();
        this.setupEventListeners();
    }

    setupCanvas() {
        this.canvas.width = 800;
        this.canvas.height = 400;
    }

    setupEventListeners() {
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            if (this.aiEnabled) {
                // AI辅助，平滑移动
                this.instrument.x += (x - this.instrument.x) * 0.1;
                this.instrument.y += (y - this.instrument.y) * 0.1;
            } else {
                // 直接控制
                this.instrument.x = x;
                this.instrument.y = y;
            }
        });

        document.getElementById('startGame').addEventListener('click', () => {
            this.startGame();
        });

        document.getElementById('toggleAI').addEventListener('click', () => {
            this.aiEnabled = !this.aiEnabled;
            document.getElementById('ai-status').textContent = 
                this.aiEnabled ? '开启' : '关闭';
        });
    }

    startGame() {
        this.score = 0;
        this.time = 60;
        this.targets = [];
        this.generateTarget();
        
        this.gameLoop = setInterval(() => {
            this.update();
            this.draw();
        }, 1000 / 60);

        this.timer = setInterval(() => {
            this.time--;
            document.getElementById('timer').textContent = this.time;
            
            if (this.time <= 0) {
                this.endGame();
            }
        }, 1000);
    }

    generateTarget() {
        const target = {
            x: Math.random() * (this.canvas.width - 40) + 20,
            y: Math.random() * (this.canvas.height - 40) + 20,
            size: Math.random() * 20 + 10,
            type: Math.random() > 0.5 ? 'tumor' : 'vessel'
        };
        this.targets.push(target);
    }

    update() {
        // 检查手术器械是否接触目标
        this.targets.forEach((target, index) => {
            const dx = this.instrument.x - target.x;
            const dy = this.instrument.y - target.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < target.size + this.instrument.size) {
                if (target.type === 'tumor') {
                    this.score += 10;
                    this.targets.splice(index, 1);
                    this.generateTarget();
                } else {
                    // 碰到血管扣分
                    this.score -= 20;
                }
            }
        });

        // 更新分数显示
        document.getElementById('score').textContent = this.score;
        
        // 更新准确度和风险条
        const accuracy = this.calculateAccuracy();
        const risk = this.calculateRisk();
        
        document.getElementById('accuracyBar').style.width = `${accuracy}%`;
        document.getElementById('riskBar').style.width = `${risk}%`;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制目标
        this.targets.forEach(target => {
            this.ctx.beginPath();
            this.ctx.arc(target.x, target.y, target.size, 0, Math.PI * 2);
            this.ctx.fillStyle = target.type === 'tumor' ? '#ff0000' : '#0000ff';
            this.ctx.fill();
        });
        
        // 绘制手术器械
        this.ctx.beginPath();
        this.ctx.arc(this.instrument.x, this.instrument.y, 
                    this.instrument.size, 0, Math.PI * 2);
        this.ctx.fillStyle = this.aiEnabled ? '#00ff00' : '#ffffff';
        this.ctx.fill();
        
        // AI辅助视觉效果
        if (this.aiEnabled) {
            this.drawAIAssist();
        }
    }

    drawAIAssist() {
        this.targets.forEach(target => {
            if (target.type === 'tumor') {
                this.ctx.beginPath();
                this.ctx.strokeStyle = 'rgba(0, 255, 0, 0.2)';
                this.ctx.lineWidth = 2;
                this.ctx.moveTo(this.instrument.x, this.instrument.y);
                this.ctx.lineTo(target.x, target.y);
                this.ctx.stroke();
            }
        });
    }

    calculateAccuracy() {
        return Math.min(100, Math.max(0, this.score / 2 + 50));
    }

    calculateRisk() {
        return Math.min(100, Math.max(0, 50 - this.score / 2));
    }

    endGame() {
        clearInterval(this.gameLoop);
        clearInterval(this.timer);
        alert(`游戏结束！\n最终分数：${this.score}\n准确度：${this.calculateAccuracy()}%`);
    }
}

// 初始化游戏
window.addEventListener('load', () => {
    const game = new SurgeryGame();
}); 
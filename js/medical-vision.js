class MedicalVision {
    constructor(game) {
        this.game = game;
        this.ctx = game.ctx;
        this.canvas = game.canvas;
        
        this.targets = [];
        this.cursor = {
            x: 0,
            y: 0,
            radius: 30
        };
        
        this.initializeTargets();
        this.bindEvents();
    }

    initializeTargets() {
        // 创建需要识别的目标
        for(let i = 0; i < 5; i++) {
            this.targets.push({
                x: Math.random() * (this.canvas.width - 100) + 50,
                y: Math.random() * (this.canvas.height - 100) + 50,
                radius: 20,
                identified: false,
                type: Math.random() > 0.5 ? 'tumor' : 'normal'
            });
        }
    }

    bindEvents() {
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.cursor.x = e.clientX - rect.left;
            this.cursor.y = e.clientY - rect.top;
        });

        this.canvas.addEventListener('click', () => {
            this.checkIdentification();
        });
    }

    update() {
        // 检查是否完成所有目标识别
        const allIdentified = this.targets.every(target => target.identified);
        if(allIdentified) {
            document.getElementById('nextBtn').disabled = false;
        }
    }

    draw() {
        // 绘制扫描区域
        this.ctx.beginPath();
        this.ctx.arc(this.cursor.x, this.cursor.y, this.cursor.radius, 0, Math.PI * 2);
        this.ctx.strokeStyle = '#4299e1';
        this.ctx.stroke();
        
        // 绘制目标
        this.targets.forEach(target => {
            this.ctx.beginPath();
            this.ctx.arc(target.x, target.y, target.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = target.identified ? 
                (target.type === 'tumor' ? '#fc8181' : '#68d391') : 
                '#cbd5e0';
            this.ctx.fill();
        });
    }

    checkIdentification() {
        this.targets.forEach(target => {
            const dx = target.x - this.cursor.x;
            const dy = target.y - this.cursor.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if(distance < this.cursor.radius && !target.identified) {
                target.identified = true;
                if(target.type === 'tumor') {
                    this.game.updateScore(100);
                }
            }
        });
    }
} 
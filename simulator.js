class SurgicalRobotSimulator {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();
        
        this.init();
        this.createRobot();
        this.setupControls();
        this.animate();
    }

    init() {
        const container = document.getElementById('scene-container');
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(this.renderer.domElement);

        this.camera.position.z = 5;
        
        // 添加环境光源
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);
        
        // 添加定向光源
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(0, 1, 0);
        this.scene.add(directionalLight);
    }

    createRobot() {
        // 创建机器人基座
        const baseGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.2, 32);
        const baseMaterial = new THREE.MeshPhongMaterial({ color: 0x666666 });
        this.base = new THREE.Mesh(baseGeometry, baseMaterial);
        this.scene.add(this.base);

        // 创建机械臂
        const armGeometry = new THREE.BoxGeometry(0.2, 1, 0.2);
        const armMaterial = new THREE.MeshPhongMaterial({ color: 0x4444ff });
        this.arm = new THREE.Mesh(armGeometry, armMaterial);
        this.arm.position.y = 0.6;
        this.base.add(this.arm);

        // 创建夹持器
        const gripperGeometry = new THREE.BoxGeometry(0.4, 0.1, 0.1);
        const gripperMaterial = new THREE.MeshPhongMaterial({ color: 0x44ff44 });
        this.gripper = new THREE.Mesh(gripperGeometry, gripperMaterial);
        this.gripper.position.y = 0.5;
        this.arm.add(this.gripper);
    }

    setupControls() {
        document.getElementById('arm-up').addEventListener('click', () => this.moveArm('up'));
        document.getElementById('arm-down').addEventListener('click', () => this.moveArm('down'));
        document.getElementById('rotate-left').addEventListener('click', () => this.rotateBase('left'));
        document.getElementById('rotate-right').addEventListener('click', () => this.rotateBase('right'));
        document.getElementById('grip-open').addEventListener('click', () => this.operateGripper('open'));
        document.getElementById('grip-close').addEventListener('click', () => this.operateGripper('close'));
    }

    moveArm(direction) {
        const delta = direction === 'up' ? 0.1 : -0.1;
        this.arm.position.y += delta;
    }

    rotateBase(direction) {
        const delta = direction === 'left' ? 0.1 : -0.1;
        this.base.rotation.y += delta;
    }

    operateGripper(action) {
        const scale = action === 'open' ? 1.5 : 1;
        this.gripper.scale.x = scale;
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.renderer.render(this.scene, this.camera);
    }
}

// 初始化模拟器
window.addEventListener('DOMContentLoaded', () => {
    const simulator = new SurgicalRobotSimulator();
}); 
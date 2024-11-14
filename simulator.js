class SurgicalRobotSimulator {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();
        
        // 初始化物理世界
        this.initPhysics();
        
        // 加载更复杂的机器人模型
        this.loadRobotModel();
        
        // 初始化手术工具
        this.surgicalTools = [];
        
        this.init();
        this.setupControls();
        this.animate();
        
        this.initAIFeatures();
        this.initAnalytics();
    }

    async initPhysics() {
        // 初始化 Ammo.js 物理引擎
        this.physicsWorld = new Ammo.btDiscreteDynamicsWorld(
            new Ammo.btCollisionDispatcher(new Ammo.btDefaultCollisionConfiguration()),
            new Ammo.btDbvtBroadphase(),
            new Ammo.btSequentialImpulseConstraintSolver(),
            new Ammo.btDefaultCollisionConfiguration()
        );
        
        this.physicsWorld.setGravity(new Ammo.btVector3(0, -9.8, 0));
        this.rigidBodies = [];
    }

    async loadRobotModel() {
        const loader = new THREE.GLTFLoader();
        try {
            const gltf = await loader.loadAsync('models/surgical_robot.gltf');
            this.robotModel = gltf.scene;
            this.scene.add(this.robotModel);
            
            // 为模型添加物理属性
            this.addPhysicsToModel(this.robotModel);
        } catch (error) {
            console.error('加载机器人模型失败:', error);
            // 失败时使用基础模型
            this.createBasicRobot();
        }
    }

    addPhysicsToModel(model) {
        model.traverse((child) => {
            if (child.isMesh) {
                const shape = this.createCollisionShape(child.geometry);
                const rigidBody = this.createRigidBody(child, shape, 1.0);
                this.rigidBodies.push({ mesh: child, body: rigidBody });
            }
        });
    }

    createCollisionShape(geometry) {
        // 创建碰撞形状
        geometry.computeBoundingBox();
        const dimensions = new THREE.Vector3();
        geometry.boundingBox.getSize(dimensions);
        
        return new Ammo.btBoxShape(
            new Ammo.btVector3(dimensions.x * 0.5, dimensions.y * 0.5, dimensions.z * 0.5)
        );
    }

    createRigidBody(mesh, shape, mass) {
        const transform = new Ammo.btTransform();
        transform.setIdentity();
        transform.setOrigin(new Ammo.btVector3(mesh.position.x, mesh.position.y, mesh.position.z));
        
        const motionState = new Ammo.btDefaultMotionState(transform);
        const localInertia = new Ammo.btVector3(0, 0, 0);
        shape.calculateLocalInertia(mass, localInertia);
        
        const rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, shape, localInertia);
        const body = new Ammo.btRigidBody(rbInfo);
        
        this.physicsWorld.addRigidBody(body);
        return body;
    }

    addSurgicalTool(toolType) {
        const loader = new THREE.GLTFLoader();
        loader.load(`models/${toolType}.gltf`, (gltf) => {
            const tool = gltf.scene;
            tool.position.set(0, 1, 0);
            this.scene.add(tool);
            
            // 添加物理属性
            this.addPhysicsToModel(tool);
            this.surgicalTools.push(tool);
        });
    }

    loadSurgicalScene() {
        const loader = new THREE.GLTFLoader();
        loader.load('models/operating_room.gltf', (gltf) => {
            const operatingRoom = gltf.scene;
            this.scene.add(operatingRoom);
            
            // 添加手术台物理属性
            this.addPhysicsToModel(operatingRoom);
        });
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
        document.getElementById('load-scene').addEventListener('click', () => this.loadSurgicalScene());
        document.getElementById('add-tool').addEventListener('click', () => this.addSurgicalTool('scalpel'));
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

    updatePhysics() {
        this.physicsWorld.stepSimulation(1 / 60, 10);
        
        // 更新物理对象的位置和旋转
        for (let i = 0; i < this.rigidBodies.length; i++) {
            const objThree = this.rigidBodies[i].mesh;
            const objAmmo = this.rigidBodies[i].body;
            const ms = objAmmo.getMotionState();
            
            if (ms) {
                const transform = new Ammo.btTransform();
                ms.getWorldTransform(transform);
                const pos = transform.getOrigin();
                const quat = transform.getRotation();
                
                objThree.position.set(pos.x(), pos.y(), pos.z());
                objThree.quaternion.set(quat.x(), quat.y(), quat.z(), quat.w());
            }
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        // 更新物理模拟
        this.updatePhysics();
        
        // 渲染场景
        this.renderer.render(this.scene, this.camera);
    }

    initAIFeatures() {
        // AI路径规划
        document.getElementById('ai-path-planning').addEventListener('click', () => {
            this.demonstrateAIPathPlanning();
        });

        // AI风险评估
        document.getElementById('ai-risk-analysis').addEventListener('click', () => {
            this.performRiskAnalysis();
        });

        // 手势控制
        document.getElementById('ai-gesture-control').addEventListener('click', () => {
            this.enableGestureControl();
        });

        // 语音控制
        document.getElementById('ai-voice-control').addEventListener('click', () => {
            this.enableVoiceControl();
        });
    }

    demonstrateAIPathPlanning() {
        // 显示AI路径规划的可视化效果
        const path = this.calculateOptimalPath();
        this.visualizePath(path);
        this.updateAnalytics('accuracy', 0.85);
    }

    calculateOptimalPath() {
        // 模拟AI路径规划算法
        return [
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(1, 1, 1),
            new THREE.Vector3(2, 0, 2)
        ];
    }

    visualizePath(path) {
        const material = new THREE.LineBasicMaterial({ color: 0x00ff00 });
        const geometry = new THREE.BufferGeometry().setFromPoints(path);
        const line = new THREE.Line(geometry, material);
        this.scene.add(line);
        
        // 添加动画效果
        this.animatePathVisualization(line);
    }

    performRiskAnalysis() {
        // 模拟风险分析过程
        const risks = this.analyzeRisks();
        this.visualizeRisks(risks);
        this.updateAnalytics('risk', risks.overallRisk);
    }

    analyzeRisks() {
        return {
            collisionRisk: Math.random(),
            precisionRisk: Math.random(),
            overallRisk: Math.random()
        };
    }

    updateAnalytics(metric, value) {
        const meter = document.getElementById(`${metric}-meter`);
        meter.style.setProperty('--value', `${value * 100}%`);
    }

    // 添加挑战演示功能
    demonstrateChallenge(challengeType) {
        switch(challengeType) {
            case 'latency':
                this.simulateLatency();
                break;
            case 'accuracy':
                this.simulateAccuracyIssues();
                break;
            case 'safety':
                this.simulateSafetyConstraints();
                break;
            case 'cost':
                this.showCostAnalysis();
                break;
        }
    }
}

// 初始化模拟器
window.addEventListener('DOMContentLoaded', () => {
    const simulator = new SurgicalRobotSimulator();
}); 
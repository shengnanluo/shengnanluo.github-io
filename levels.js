const LEVELS = {
    1: {
        name: "系统自检",
        description: "完成机器人系统自检，确保所有组件正常运行",
        challenges: [
            {
                type: "diagnostic",
                name: "传感器校准",
                description: "校准机器人的位置传感器",
                difficulty: 1
            },
            {
                type: "calibration",
                name: "运动系统测试",
                description: "测试机器人各关节的运动精度",
                difficulty: 2
            }
        ],
        aiFeatures: {
            pathPlanning: false,
            riskAnalysis: true,
            realTimeAssist: false
        },
        timeLimit: 60,
        passingScore: 70
    },
    2: {
        name: "手术规划",
        description: "利用AI分析医学影像，规划最优手术路径",
        challenges: [
            {
                type: "imaging",
                name: "图像识别",
                description: "识别手术目标区域",
                difficulty: 2
            },
            {
                type: "planning",
                name: "路径规划",
                description: "规划最安全的手术路径",
                difficulty: 3
            }
        ],
        aiFeatures: {
            pathPlanning: true,
            riskAnalysis: true,
            realTimeAssist: true
        },
        timeLimit: 90,
        passingScore: 80
    },
    3: {
        name: "精确操作",
        description: "执行精细的手术操作，避开重要器官",
        challenges: [
            {
                type: "precision",
                name: "精确切除",
                description: "精确切除目标组织",
                difficulty: 3
            },
            {
                type: "avoidance",
                name: "避障控制",
                description: "避开关键血管和神经",
                difficulty: 4
            }
        ],
        aiFeatures: {
            pathPlanning: true,
            riskAnalysis: true,
            realTimeAssist: true
        },
        timeLimit: 120,
        passingScore: 85
    },
    4: {
        name: "人机协作",
        description: "与人类医生配合完成复杂手术",
        challenges: [
            {
                type: "cooperation",
                name: "协同操作",
                description: "配合医生完成手术步骤",
                difficulty: 4
            },
            {
                type: "emergency",
                name: "应急处理",
                description: "处理突发情况",
                difficulty: 5
            }
        ],
        aiFeatures: {
            pathPlanning: true,
            riskAnalysis: true,
            realTimeAssist: true,
            emergencyResponse: true
        },
        timeLimit: 180,
        passingScore: 90
    }
};

export default LEVELS; 
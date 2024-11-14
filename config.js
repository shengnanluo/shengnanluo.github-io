const CONFIG = {
    models: {
        robot: 'models/surgical_robot.gltf',
        operatingRoom: 'models/operating_room.gltf',
        tools: {
            scalpel: 'models/scalpel.gltf',
            forceps: 'models/forceps.gltf',
            needle: 'models/needle.gltf'
        }
    },
    physics: {
        gravity: -9.8,
        defaultMass: 1.0,
        simulationRate: 1 / 60
    }
};

export default CONFIG; 
export type FurnitureParticleSystemData = {
    size: number;
    canvasId: number;
    offsetY: number;
    blend: number;

    emitters: {
        id: number;
        spriteId: number;
        fuseTime: number;
        name: string;
        maxNumberParticles: number;
        particlesPerFrame: number;
        burstPulse: number;

        simulation: {
            force: number;
            direction: number;
            energy: number;
            shape: string;
            gravity: number;
            airFriction: number;
        };

        particles: {
            isEmitter: boolean;
            lifetime: number;
            fade: boolean;

            frames: {
                name: string;
            }[];
        }[];
    }[];
}

export type FurnitureLogic = {
    type: string;

    model: {
        dimensions: {
            x: number;
            y: number;
            z: number;
        };

        directions: {
            id: number;
        }[];
    };

    particleSystems: FurnitureParticleSystemData[];
};

import { XMLParser } from "fast-xml-parser";
import { readFileSync } from "node:fs";
import type { FurnitureLogic } from "../../../../../packages/game/src/Client/Interfaces/Furniture/FurnitureLogic.ts"
import { getValueAsArray } from "../../helpers.ts";

export default class ManifestLogicExtraction {
    private readonly filePath: string;

    constructor(filePath: string) {
        this.filePath = filePath;
    }

    public async execute() {
        const parser = new XMLParser({ ignoreAttributes: false });
        const document = parser.parse(readFileSync(this.filePath, { encoding: "utf-8" }), true);

        return {
            type: document["objectData"]["@_type"],
            model: {
                dimensions: {
                    x: parseFloat(document["objectData"]["model"]["dimensions"]["@_x"]),
                    y: parseFloat(document["objectData"]["model"]["dimensions"]["@_y"]),
                    z: parseFloat(document["objectData"]["model"]["dimensions"]["@_z"])
                },
                directions: getValueAsArray(document["objectData"]["model"]["directions"]?.["direction"]).map((direction: any) => {
                    return {
                        id: parseInt(direction["@_id"])
                    } satisfies FurnitureLogic["model"]["directions"][0]
                })
            },
            mask: document["objectData"]["mask"]?.["@_type"] ?? undefined,
            particleSystems: getValueAsArray(document["objectData"]["particlesystems"]?.["particlesystem"]).filter((particleSystem: any) => particleSystem["@_size"] !== '1').map((particleSystem: any) => {
                return {
                    size: parseInt(particleSystem["@_size"]),
                    canvasId: parseInt(particleSystem["@_canvas_id"]),
                    offsetY: parseInt(particleSystem["@_offset_y"]),
                    blend: parseFloat(particleSystem["@_blend"]),

                    emitters: getValueAsArray(particleSystem["emitter"]).map((emitter: any) => {
                        return {
                            id: parseInt(emitter["@_id"]),
                            spriteId: parseInt(emitter["@_sprite_id"]),
                            // explosionAnimation,
                            fuseTime: parseInt(emitter["@_fuse_time"]),
                            name: emitter["@_name"],
                            maxNumberParticles: parseInt(emitter["@_max_num_particles"]),
                            particlesPerFrame: parseInt(emitter["@_particles_per_frame"]),
                            burstPulse: parseInt(emitter["@_burst_pulse"]),

                            simulation: {
                                force: parseInt(emitter["simulation"]["@_force"]),
                                direction: parseFloat(emitter["simulation"]["@_direction"]),
                                energy: parseInt(emitter["simulation"]["@_energy"]),
                                shape: emitter["simulation"]["sphere"],
                                gravity: parseFloat(emitter["simulation"]["@_gravity"]),
                                airFriction: parseFloat(emitter["simulation"]["@_airfriction"])
                            },

                            particles: getValueAsArray(emitter["particles"]?.["particle"]).map((particle: any) => {
                                return {
                                    isEmitter: particle["@_is_emitter"] === 'true',
                                    lifetime: parseInt(particle["@_lifetime"]),
                                    fade: particle["@_fade"] === 'true',

                                    frames: getValueAsArray(particle["frame"]).map((frame: any) => {
                                        return {
                                            name: frame["@_name"]
                                        };
                                    })
                                }
                            })
                        };
                    })
                };
            })
        } satisfies FurnitureLogic;
    }
}

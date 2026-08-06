import { ServerLoadRoomData, ServerRoomData, ServerRoomLoadedData } from "@pixel63/events";
import RoomWorker from "./RoomWorker";
import Game from "../Game";
import { config } from "../Config/Config";

export default class RoomWorkerPool {
    private readonly workers: RoomWorker[] = [];

    constructor(private game: Game) {
    }

    public getRooms() {
        return this.workers.reduce<ServerRoomData[]>((previousValue, currentValue) => previousValue.concat(currentValue.rooms), []);
    }

    public async addServer(localSecure: boolean, localHost: string, localPort: number, publicSecure: boolean, publicHost: string, publicPort: number) {
        return new Promise<RoomWorker>((resolve) => {
            const roomWorker = new RoomWorker(this.game, localSecure, localHost, localPort, publicSecure, publicHost, publicPort, () => {
                this.workers.push(roomWorker);

                resolve(roomWorker);
            });
        });
    }

    public getRoom(roomId: string) {
        for(const roomServer of this.workers) {
            const roomData = roomServer.rooms.find((clientRoom) => clientRoom.roomId === roomId);

            return roomData;
        }

        return null;
    }

    public getRoomClient(roomId: string) {
        for(const roomServer of this.workers) {
            if(roomServer.rooms.some((clientRoom) => clientRoom.roomId === roomId)) {
                return roomServer;
            }
        }

        return null;
    }

    private async createRoom(roomId: string) {
        let roomServer = this.getServerForRoom();

        if(!roomServer) {
            roomServer = await this.getAllocatedServer();

            if(!roomServer) {
                throw new Error("Failed to get an allocated room worker.");
            }
        }

        return new Promise<RoomWorker>((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject("[RoomServers] Failed to load the room in a timely manner.");
            }, 5000);

            const listener = roomServer.client.eventHandler.addProtobuffListener(ServerRoomLoadedData, {
                handle: async (_: RoomWorker, payload: ServerRoomLoadedData) =>  {
                    if(payload.roomId !== roomId) {
                        return;
                    }

                    roomServer.rooms.push(payload.data!);

                    clearTimeout(timeout);

                    resolve(roomServer);

                    roomServer.client.eventHandler.removeProtobuffListener(ServerRoomLoadedData, listener);
                }
            })

            roomServer.client.sendProtobuff(ServerLoadRoomData, ServerLoadRoomData.create({
                roomId: roomId
            }));

            return roomServer;
        });
    }

    public async getOrCreateRoom(roomId: string) {
        const existingRoomClient = this.getRoomClient(roomId);

        if(existingRoomClient) {
            return existingRoomClient;
        }

        return await this.createRoom(roomId);
    }

    // TODO: measure load to automatically balance better for servers with the least usage
    // Idea: use messages sent/received per minute as a reducer
    private getServerForRoom() {
        const clientWithLeastRooms = this.workers.reduce((previousClient: RoomWorker | null, currentClient: RoomWorker) => {
            if(!currentClient) {
                return previousClient;
            }

            if(!previousClient) {
                return currentClient;
            }

            if(currentClient.rooms.length < previousClient.rooms.length) {
                return currentClient;
            }

            return previousClient;
        }, null);

        if(!clientWithLeastRooms) {
            console.error("[RoomServers] There is no active room servers!!");

            return null;
        }

        console.log(`[RoomServers] Next server for room allocation is ${clientWithLeastRooms.port}`)

        return clientWithLeastRooms;
    }

    private async getAllocatedServer() {
        for(const server of config.rooms.allocatedRoomServers) {
            if(this.workers.some((worker) => worker.host === server.public.host && worker.port === server.public.port)) {
                continue;
            }

            return await this.addServer(server.local.secure, server.local.host, server.local.port, server.public.secure, server.public.host, server.public.port);
        }

        return null;
    }
}

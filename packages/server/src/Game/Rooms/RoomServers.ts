import { ServerLoadRoomData, ServerRoomData, ServerRoomLoadedData } from "@pixel63/events";
import RoomServerClient from "./RoomServerClient";
import { RoomModel } from "../../Database/Models/Rooms/RoomModel";
import RoomServer from "./RoomServer";
import Game from "../Game";

export default class RoomServers {
    private readonly roomServers: RoomServer[] = [];

    constructor(private game: Game) {
    }

    public addServer(host: string, port: number) {
        this.roomServers.push(new RoomServer(this.game, host, port));
    }

    private getRoomClient(room: RoomModel) {
        for(const roomServer of this.roomServers) {
            if(roomServer.rooms.some((clientRoom) => clientRoom.roomId === room.id)) {
                return roomServer;
            }
        }

        return null;
    }

    private createRoom(room: RoomModel) {
        const roomServer = this.getServerForRoom();

        if(!roomServer) {
            throw new Error("Failed to get a server to create room.");
        }

        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject("Failed to load the room in a timely manner.");
            }, 5000);

            const listener = roomServer.client.eventHandler.addProtobuffListener(ServerRoomLoadedData, {
                handle: async (_: null, payload: ServerRoomLoadedData) =>  {
                    if(payload.roomId !== room.id) {
                        return;
                    }

                    clearTimeout(timeout);

                    resolve(roomServer);

                    roomServer.client.eventHandler.removeProtobuffListener(ServerRoomLoadedData, listener);
                }
            })

            roomServer.client.sendProtobuff(ServerLoadRoomData, ServerLoadRoomData.create({
                roomId: room.id
            }));

            return roomServer;
        });
    }

    public async getOrCreateRoom(room: RoomModel) {
        const existingRoomClient = this.getRoomClient(room);

        if(existingRoomClient) {
            return existingRoomClient;
        }

        return await this.createRoom(room);
    }

    // TODO: measure load to automatically balance better for servers with the least usage
    // Idea: use messages sent/received per minute as a reducer
    private getServerForRoom() {
        const clientWithLeastRooms = this.roomServers.reduce((previousClient: RoomServer | null, currentClient: RoomServer) => {
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

        console.log(`[RoomServers] Next server for room allocation is ${clientWithLeastRooms.client.port}`)

        return clientWithLeastRooms;
    }
}

import { GetNavigatorRoomsEventData } from "@shared/Communications/Requests/Navigator/GetNavigatorRoomsEventData.js";
import User from "../../../Users/User.js";
import IncomingEvent from "../../Interfaces/IncomingEvent.js";
import OutgoingEvent from "../../../Events/Interfaces/OutgoingEvent.js";
import { NavigatorRoomsEventData } from "@shared/Communications/Responses/Navigator/NavigatorRoomsEventData.js";
import { RoomModel } from "../../../Database/Models/Rooms/RoomModel.js";
import { game } from "../../../index.js";

export default class GetNavigatorRoomsEvent implements IncomingEvent<GetNavigatorRoomsEventData> {
    async handle(user: User, event: GetNavigatorRoomsEventData): Promise<void> {
        switch(event.category) {
            case "all": {
                const roomModels = await RoomModel.findAll({
                    order: [
                        [ "createdAt", "DESC" ]
                    ],
                    limit: 20
                });

                user.send(new OutgoingEvent<NavigatorRoomsEventData>("NavigatorRoomsEvent", [
                    {
                        title: "Most popular rooms",
                        rooms: game.roomManager.instances.toSorted((a, b) => b.users.length - a.users.length).slice(0, 20).map((room) => {
                            return {
                                id: room.model.id,
                                name: room.model.name,

                                users: room.users.length ?? 0,
                                maxUsers: room.model.maxUsers
                            };
                        })
                    },
                    {
                        title: "Recently created rooms",
                        rooms: roomModels.map((roomModel) => {
                            const room = game.roomManager.getRoomInstance(roomModel.id);

                            return {
                                id: roomModel.id,
                                name: roomModel.name,

                                users: room?.users.length ?? 0,
                                maxUsers: roomModel.maxUsers
                            };
                        }).toSorted((a, b) => b.users - a.users)
                    }
                ]));

                break;
            }
                
            case "mine": {
                const roomModels = await RoomModel.findAll({
                    where: {
                        ownerId: user.model.id,
                    },
                    order: [
                        [ "createdAt", "DESC" ]
                    ]
                });

                user.send(new OutgoingEvent<NavigatorRoomsEventData>("NavigatorRoomsEvent", [
                    {
                        title: "My rooms",
                        rooms: roomModels.map((roomModel) => {
                            const room = game.roomManager.getRoomInstance(roomModel.id);

                            return {
                                id: roomModel.id,
                                name: roomModel.name,

                                users: room?.users.length ?? 0,
                                maxUsers: roomModel.maxUsers
                            };
                        }).toSorted((a, b) => b.users - a.users)
                    }
                ]));
            
                break;
            }

            default:
                console.warn("Unrecognized navigator tab " + event.category);
                break;
        }
    }
}
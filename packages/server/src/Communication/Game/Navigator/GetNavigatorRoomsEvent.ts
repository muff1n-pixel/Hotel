import { GetNavigatorRoomsEventData } from "@shared/Communications/Requests/Navigator/GetNavigatorRoomsEventData.js";
import User from "../../../Users/User.js";
import IncomingEvent from "../../Interfaces/IncomingEvent.js";
import OutgoingEvent from "../../../Events/Interfaces/OutgoingEvent.js";
import { RoomModel } from "../../../Database/Models/Rooms/RoomModel.js";
import { game } from "../../../index.js";
import { RoomCategoryModel } from "../../../Database/Models/Rooms/Categories/RoomCategoryModel.js";
import { Op } from "sequelize";
import { NavigatorData } from "@pixel63/events";

export default class GetNavigatorRoomsEvent implements IncomingEvent<GetNavigatorRoomsEventData> {
    public readonly name = "GetNavigatorRoomsEvent";

    async handle(user: User, event: GetNavigatorRoomsEventData): Promise<void> {
        if(event.type === "search") {
            const roomModels = await RoomModel.findAll({
                where: {
                    name: {
                        [Op.like]: `%${event.search}%`
                    }
                },
                limit: 20
            });

            user.sendProtobuff(NavigatorData, NavigatorData.create({
                categories: [
                    {
                        title: "Search result",
                        rooms: roomModels.map((roomModel) => {
                            const room = game.roomManager.getRoomInstance(roomModel.id);

                            return {
                                id: roomModel.id,
                                name: roomModel.name,

                                users: room?.users.length ?? 0,
                                maxUsers: roomModel.maxUsers,

                                thumbnail: (roomModel.thumbnail)?(Buffer.from(roomModel.thumbnail).toString('utf8')):(undefined)
                            };
                        }).toSorted((a, b) => b.users - a.users)
                    }
                ]
            }))

            return;
        }

        switch(event.category) {
            case "public": {
                const roomModels = await RoomModel.findAll({
                    where: {
                        type: "public"
                    },
                    order: [
                        [ "createdAt", "DESC" ]
                    ],
                    include: [
                        {
                            model: RoomCategoryModel,
                            as: "category"
                        }
                    ]
                });

                const uniqueCategories = [...new Set(roomModels.map((room) => room.category.id))];

                user.sendProtobuff(NavigatorData, NavigatorData.create({
                    categories: uniqueCategories.map((categoryId) => {
                        const rooms = roomModels.filter((room) => room.category.id === categoryId);

                        return {
                            title: rooms[0]?.category.title ?? "",
                            rooms: rooms.map((roomModel) => {
                                const room = game.roomManager.getRoomInstance(roomModel.id);

                                return {
                                    id: roomModel.id,
                                    name: roomModel.name,

                                    users: room?.users.length ?? 0,
                                    maxUsers: roomModel.maxUsers,

                                    thumbnail: (roomModel.thumbnail)?(Buffer.from(roomModel.thumbnail).toString('utf8')):(undefined)
                                };
                            }).toSorted((a, b) => b.users - a.users)
                        }
                    })
                }));

                break;
            }

            case "all": {
                const roomModels = await RoomModel.findAll({
                    order: [
                        [ "createdAt", "DESC" ]
                    ],
                    limit: 20
                });

                user.sendProtobuff(NavigatorData, NavigatorData.create({
                    categories: [
                        {
                            title: "Most popular rooms",
                            rooms: game.roomManager.instances.toSorted((a, b) => b.users.length - a.users.length).slice(0, 20).map((room) => {
                                return {
                                    id: room.model.id,
                                    name: room.model.name,

                                    users: room.users.length ?? 0,
                                    maxUsers: room.model.maxUsers,

                                    thumbnail: (room.model.thumbnail)?(Buffer.from(room.model.thumbnail).toString('utf8')):(undefined)
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
                                    maxUsers: roomModel.maxUsers,

                                    thumbnail: (roomModel.thumbnail)?(Buffer.from(roomModel.thumbnail).toString('utf8')):(undefined)
                                };
                            }).toSorted((a, b) => b.users - a.users)
                        }
                    ]
                }));

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

                user.sendProtobuff(NavigatorData, NavigatorData.create({
                    categories: [
                        {
                            title: "My rooms",
                            rooms: roomModels.map((roomModel) => {
                                const room = game.roomManager.getRoomInstance(roomModel.id);

                                return {
                                    id: roomModel.id,
                                    name: roomModel.name,

                                    users: room?.users.length ?? 0,
                                    maxUsers: roomModel.maxUsers,

                                    thumbnail: (roomModel.thumbnail)?(Buffer.from(roomModel.thumbnail).toString('utf8')):(undefined)
                                };
                            }).toSorted((a, b) => b.users - a.users)
                        }
                    ]
                }));
            
                break;
            }

            default:
                console.warn("Unrecognized navigator tab " + event.category);
                break;
        }
    }
}
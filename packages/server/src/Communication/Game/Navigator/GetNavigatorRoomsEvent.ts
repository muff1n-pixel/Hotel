import User from "../../../Users/User.js";
import { RoomModel } from "../../../Database/Models/Rooms/RoomModel.js";
import { game } from "../../../index.js";
import { RoomCategoryModel } from "../../../Database/Models/Rooms/Categories/RoomCategoryModel.js";
import { Op } from "sequelize";
import { GetNavigatorData, NavigatorData } from "@pixel63/events";
import ProtobuffListener from "../../Interfaces/ProtobuffListener.js";
import { UserModel } from "../../../Database/Models/Users/UserModel.js";

export default class GetNavigatorRoomsEvent implements ProtobuffListener<GetNavigatorData> {
    public readonly name = "GetNavigatorRoomsEvent";

    async handle(user: User, payload: GetNavigatorData): Promise<void> {
        if(payload.search) {
            let roomModels;

            if(payload.category === "mine") {
                roomModels = await RoomModel.findAll({
                    where: {
                        name: {
                            [Op.like]: `%${payload.search}%`
                        },
                        ownerId: user.model.id
                    },
                    include: [
                        {
                            model: UserModel,
                            as: "owner"
                        }
                    ]
                });
                (payload.category === "mine")?(user.model.id):(undefined)
            }
            else {
                roomModels = await RoomModel.findAll({
                    where: {
                        name: {
                            [Op.like]: `%${payload.search}%`
                        },
                        type: (payload.category === "public")?("public"):("private"),
                    },
                    include: [
                        {
                            model: UserModel,
                            as: "owner"
                        }
                    ],
                    limit: 20
                });
            }

            user.sendProtobuff(NavigatorData, NavigatorData.create({
                categories: [
                    {
                        title: "Search result",
                        rooms: roomModels.map((roomModel) => {
                            const room = game.roomManager.getRoomInstance(roomModel.id);

                            return {
                                id: roomModel.id,

                                name: roomModel.name,
                                description: roomModel.description,

                                ownerId: roomModel.owner.id,
                                ownerName: roomModel.owner.name,

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

        switch(payload.category) {
            case "public": {
                const roomModels = await RoomModel.findAll({
                    where: {
                        type: {
                            [Op.in]: ["public", "bundle"]
                        }
                    },
                    order: [
                        [ "createdAt", "DESC" ]
                    ],
                    include: [
                        {
                            model: UserModel,
                            as: "owner"
                        },

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
                                    description: roomModel.description,

                                    ownerId: roomModel.owner.id,
                                    ownerName: roomModel.owner.name,

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
                    include: [
                        {
                            model: UserModel,
                            as: "owner"
                        }
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
                                    description: room.model.description,

                                    ownerId: room.model.owner.id,
                                    ownerName: room.model.owner.name,

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
                                    description: roomModel.description,

                                    ownerId: roomModel.owner.id,
                                    ownerName: roomModel.owner.name,

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
                    include: [
                        {
                            model: UserModel,
                            as: "owner"
                        }
                    ],
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
                                    description: roomModel.description,

                                    ownerId: roomModel.owner.id,
                                    ownerName: roomModel.owner.name,

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
                console.warn("Unrecognized navigator tab " + payload.category);
                break;
        }
    }
}
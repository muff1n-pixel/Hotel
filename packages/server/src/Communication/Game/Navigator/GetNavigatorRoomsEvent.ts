import User from "../../../Users/User.js";
import { RoomModel } from "../../../Database/Models/Rooms/RoomModel.js";
import { game } from "../../../index.js";
import { RoomCategoryModel } from "../../../Database/Models/Rooms/Categories/RoomCategoryModel.js";
import { Op } from "sequelize";
import { GetNavigatorData, NavigatorData, NavigatorRoomData } from "@pixel63/events";
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
            }
            else {
                roomModels = await RoomModel.scope({ method: [ 'withVisibility', user.model.id ] }).findAll({
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
                        rooms: roomModels.map(this.getRoomNavigatorData.bind(this)).toSorted((a, b) => b.users - a.users)
                    }
                ]
            }))

            return;
        }

        switch(payload.category) {
            case "public": {
                const roomModels = await RoomModel.scope({ method: [ 'withVisibility', user.model.id ] }).findAll({
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
                            rooms: rooms.map(this.getRoomNavigatorData.bind(this)).toSorted((a, b) => b.users - a.users)
                        }
                    })
                }));

                break;
            }

            case "all": {
                const roomModels = await RoomModel.scope({ method: [ 'withVisibility', user.model.id ] }).findAll({
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
                            rooms: game.roomManager.instances.toSorted((a, b) => b.users.length - a.users.length).filter((room) => room.hasUserVisibility(user.model)).slice(0, 20).map((room) => this.getRoomNavigatorData.bind(this)(room.model))
                        },
                        {
                            title: "Recently created rooms",
                            rooms: roomModels.map(this.getRoomNavigatorData.bind(this)).toSorted((a, b) => b.users - a.users)
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
                            rooms: roomModels.map(this.getRoomNavigatorData.bind(this)).toSorted((a, b) => b.users - a.users)
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

    private getRoomNavigatorData(roomModel: RoomModel) {
        const room = game.roomManager.getRoomInstance(roomModel.id);

        return NavigatorRoomData.create({
            id: roomModel.id,
            name: roomModel.name,
            description: roomModel.description,

            lock: roomModel.lock,

            ownerId: roomModel.owner.id,
            ownerName: roomModel.owner.name,

            users: room?.users.length ?? 0,
            maxUsers: roomModel.maxUsers,

            thumbnail: (roomModel.thumbnail)?(Buffer.from(roomModel.thumbnail).toString('utf8')):(undefined)
        });
    }

    private getFilteredRooms() {

    }
}
import User from "../../../Users/User.js";
import { RoomModel } from "../../../../Database/Models/Rooms/RoomModel.js";
import { game } from "../../../index.js";
import { RoomCategoryModel } from "../../../../Database/Models/Rooms/Categories/RoomCategoryModel.js";
import { Op } from "sequelize";
import { GetNavigatorData, GroupData, NavigatorData, NavigatorRoomData } from "@pixel63/events";
import { UserProtobuffListener } from "../../Interfaces/UserProtobuffListener.js";
import { UserModel } from "../../../../Database/Models/Users/UserModel.js";
import { GroupModel } from "../../../../Database/Models/Groups/RoomGroupModel.js";
import { WhereOptions } from "sequelize";

export default class GetNavigatorRoomsEvent implements UserProtobuffListener<GetNavigatorData> {
    minimumDurationBetweenEvents?: number = 100;

    async handle(user: User, payload: GetNavigatorData): Promise<void> {
        if(payload.search?.length || payload.filter === "group") {
            let roomModels;

            switch(payload.category) {
                case "mine": {
                    roomModels = await this.getRoomModels(user, payload, {
                        ownerId: user.model.id
                    }, undefined);
                    
                    break;
                }

                case "public": {
                    roomModels = await this.getRoomModels(user, payload, {
                        type: {
                            [Op.in]: ["public", "bundle"]
                        }
                    });

                    break;
                }

                case "events": {
                    roomModels = await this.getRoomModels(user, payload, {
                        eventExpiresAt: {
                            [Op.gt]: new Date().toISOString()
                        }
                    });

                    break;
                }

                default: {
                    roomModels = await this.getRoomModels(user, payload);

                    break;
                }
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
                            model: GroupModel,
                            as: "group"
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
                        },
                        {
                            model: GroupModel,
                            as: "group"
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

            case "events": {
                const roomModels = await RoomModel.scope({ method: [ 'withVisibility', user.model.id ] }).findAll({
                    where: {
                        eventExpiresAt: {
                            [Op.gt]: new Date().toISOString()
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
                            model: GroupModel,
                            as: "group"
                        },
                        {
                            model: RoomCategoryModel,
                            as: "category"
                        }
                    ],
                    limit: 20
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
                
            case "mine": {
                const roomModels = await RoomModel.findAll({
                    where: {
                        ownerId: user.model.id,
                    },
                    include: [
                        {
                            model: UserModel,
                            as: "owner"
                        },
                        {
                            model: GroupModel,
                            as: "group"
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

            thumbnail: (roomModel.thumbnail)?(Buffer.from(roomModel.thumbnail).toString('utf8')):(undefined),

            group: (roomModel.group)?(GroupData.fromJSON(roomModel.group)):(undefined)
        });
    }

    private getRoomWhereOptions(payload: GetNavigatorData): WhereOptions<any> | undefined {
        if(!payload.search?.length) {
            return undefined;
        }

        switch(payload.filter) {
            case undefined:
            case "name": {
                return {
                    name: {
                        [Op.like]: `%${payload.search}%`
                    }
                };
            }

            default: {
                return undefined;
            }
        }
    }

    private getOwnerWhereOptions(payload: GetNavigatorData): WhereOptions<any> | undefined {
        if(!payload.search?.length) {
            return undefined;
        }

        switch(payload.filter) {
            case "owner": {
                return {
                    name: {
                        [Op.like]: `%${payload.search}%`
                    }
                };
            }

            default: {
                return undefined;
            }
        }
    }

    private getGroupWhereOptions(payload: GetNavigatorData): WhereOptions<any> | undefined {
        if(!payload.search?.length) {
            return {};
        }

        switch(payload.filter) {
            case "group":  {
                return {
                    name: {
                        [Op.like]: `%${payload.search}%`
                    }
                };
            }

            default: {
                return undefined;
            }
        }
    }

    private async getRoomModels(user: User, payload: GetNavigatorData, whereOptions: WhereOptions<any> | undefined = undefined, limit: number | undefined = 20) {
        const roomWhereOptions = this.getRoomWhereOptions(payload);
        const ownerWhereOptions = this.getOwnerWhereOptions(payload);
        const groupWhereOptions = this.getGroupWhereOptions(payload);
        
        return await RoomModel.scope({ method: [ 'withVisibility', user.model.id ] }).findAll({
            ...((whereOptions || roomWhereOptions) && {
                where: {
                    ...whereOptions,
                    ...roomWhereOptions
                }
            }),
            include: [
                {
                    model: UserModel,
                    as: "owner",
                    ...(ownerWhereOptions && {
                        where: ownerWhereOptions
                    }),
                },
                {
                    model: GroupModel,
                    as: "group",
                    ...(groupWhereOptions && {
                        where: groupWhereOptions
                    }),
                }
            ],
            limit
        });
    }

    private getFilteredRooms() {

    }
}
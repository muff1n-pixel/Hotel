import { HotelAlertData, RoomUserTradingClosedData, RoomUserTradingData, UserInventoryFurnitureData } from "@pixel63/events";
import RoomUser from "../RoomUser";
import { UserFurnitureModel } from "../../../Database/Models/Users/Furniture/UserFurnitureModel";
import { FurnitureModel } from "../../../Database/Models/Furniture/FurnitureModel";
import { Op } from "sequelize";
import { sequelize } from "../../../Database/Database";

export default class RoomUserTrading {
    public tradingWithUser?: RoomUser;
    public requestedTradingWithUser?: RoomUser;

    private completesAt: Date | null = null;
    public locked: boolean = false;
    public userFurniture: UserFurnitureModel[] = [];

    constructor(private readonly roomUser: RoomUser) {

    }

    public startTrading(targetRoomUser: RoomUser) {
        delete this.requestedTradingWithUser;
        this.tradingWithUser = targetRoomUser;
        
        this.locked = false;
        this.completesAt = null;
        this.userFurniture = [];

        this.roomUser.user.sendProtobuff(RoomUserTradingData, this.getTradingData());
    }

    public stopTrading() {
        if(!this.tradingWithUser) {
            return;
        }

        const tradingWithUser = this.tradingWithUser;

        delete this.tradingWithUser;
        
        this.locked = false;
        this.completesAt = null;
        this.userFurniture = [];

        this.roomUser.user.sendProtobuff(RoomUserTradingClosedData, RoomUserTradingClosedData.create({
            userId: tradingWithUser.user.model.id
        }));

        tradingWithUser.trading.stopTrading();
    }

    public getTradingData(): RoomUserTradingData {
        if(!this.tradingWithUser) {
            throw new Error("User is not trading.");
        }

        return RoomUserTradingData.create({
            userId: this.tradingWithUser.user.model.id,
            completesAt: (this.completesAt)?(this.completesAt.toISOString()):(undefined),

            receivingLocked: this.tradingWithUser.trading.locked,
            givingLocked: this.locked,

            receivingUserFurniture: this.tradingWithUser.trading.getUserFurniture(),
            givingUserFurniture: this.getUserFurniture(),
        });
    }

    public getUserFurniture(userFurnitureList: UserFurnitureModel[] = this.userFurniture) {
        const allUserFurniture: UserInventoryFurnitureData[] = [];

        for(const userFurniture of userFurnitureList) {
            if(userFurniture.furniture.flags.inventoryStackable) {
                const existingUserfurniture = allUserFurniture.find((furniture) => furniture.furniture?.id === userFurniture.furniture.id);

                if(existingUserfurniture) {
                    existingUserfurniture.quantity++;
                }
                else {
                    allUserFurniture.push(UserInventoryFurnitureData.fromJSON({
                        id: userFurniture.id,
                        quantity: 1,
                        furniture: userFurniture.furniture,
                        userFurniture,

                        name: userFurniture.name,
                        description: userFurniture.description
                    }));
                }
            }
            else {
                allUserFurniture.push(UserInventoryFurnitureData.fromJSON({
                    id: userFurniture.id,
                    quantity: 1,
                    furniture: userFurniture.furniture,
                    userFurniture,

                    name: userFurniture.name,
                    description: userFurniture.description
                }));
            }
        }

        return allUserFurniture;
    }

    public async addUserFurniture(id: string, quantity?: number) {
        if(!this.tradingWithUser) {
            return;
        }

        if(this.completesAt) {
            return;
        }

        const requestedUserFurniture = await UserFurnitureModel.findByPk(id, {
            include: {
                model: FurnitureModel,
                as: "furniture"
            }
        });

        if(!requestedUserFurniture) {
            throw new Error("User furniture does not exist.");
        }

        const userFurniture: UserFurnitureModel[] = [];

        if(quantity && quantity > 1) {
            const bulkedUserFurniture = await UserFurnitureModel.findAll({
                where: {
                    id: {
                        [Op.notIn]: this.userFurniture.map((userFurniture) => userFurniture.id)
                    },
                    userId: this.roomUser.user.model.id,
                    roomId: null,
                    traxId: null,

                    furnitureId: requestedUserFurniture.furniture.id
                },
                include: {
                    model: FurnitureModel,
                    as: "furniture"
                },
                limit: quantity
            });

            userFurniture.push(...bulkedUserFurniture);
        }
        else {
            if(!this.userFurniture.some((userFurniture) => userFurniture.id === requestedUserFurniture.id)) {
                userFurniture.push(requestedUserFurniture);
            }
        }

        if(this.getUserFurniture([...this.userFurniture, ...userFurniture]).length > 9) {
            return;
        }

        this.locked = false;
        this.tradingWithUser.trading.locked = false;

        this.userFurniture.push(...userFurniture);

        await this.roomUser.user.getInventory().sendFurniture(true);

        this.roomUser.user.sendProtobuff(RoomUserTradingData, this.getTradingData());
        this.tradingWithUser.user.sendProtobuff(RoomUserTradingData, this.tradingWithUser.trading.getTradingData());
    }

    public async removeUserFurniture(id: string) {
        if(!this.tradingWithUser) {
            return;
        }

        if(this.completesAt) {
            return;
        }

        this.locked = false;
        this.tradingWithUser.trading.locked = false;

        this.userFurniture = this.userFurniture.filter((userFurniture) => userFurniture.id !== id);

        await this.roomUser.user.getInventory().sendFurniture(true);

        this.roomUser.user.sendProtobuff(RoomUserTradingData, this.getTradingData());
        this.tradingWithUser.user.sendProtobuff(RoomUserTradingData, this.tradingWithUser.trading.getTradingData());
    }

    public setLocked() {
        if(!this.tradingWithUser) {
            return;
        }

        if(this.locked) {
            return;
        }

        this.locked = true;

        if(this.tradingWithUser.trading.locked) {
            const date = new Date();
            date.setSeconds(date.getSeconds() + 5);

            this.completesAt = this.tradingWithUser.trading.completesAt = date;
        }

        this.roomUser.user.sendProtobuff(RoomUserTradingData, this.getTradingData());
        this.tradingWithUser.user.sendProtobuff(RoomUserTradingData, this.tradingWithUser.trading.getTradingData());
    }

    public cancel() {
        if(!this.tradingWithUser) {
            return;
        }

        this.completesAt = null;
        this.tradingWithUser.trading.completesAt = null;

        this.tradingWithUser.user.sendProtobuff(HotelAlertData, HotelAlertData.create({
            message: "The user you were trading with cancelled the trade."
        }));

        this.stopTrading();
    }

    public async handleActionsInterval() {
        if(!this.tradingWithUser) {
            return;
        }

        if(!this.locked) {
            return;
        }

        if(!this.tradingWithUser.trading.locked) {
            return;
        }

        if(!this.completesAt) {
            return;
        }

        if(!this.tradingWithUser.trading.completesAt) {
            return;
        }

        if(Date.now() < this.completesAt.getTime()) {
            return;
        }

        await UserFurnitureModel.update({
            userId: this.tradingWithUser.user.model.id
        }, {
            where: {
                id: {
                    [Op.in]: this.userFurniture.map((userFurniture) => userFurniture.id)
                }
            }
        });

        await UserFurnitureModel.update({
            userId: this.roomUser.user.model.id
        }, {
            where: {
                id: {
                    [Op.in]: this.tradingWithUser.trading.userFurniture.map((userFurniture) => userFurniture.id)
                }
            }
        });

        await this.roomUser.user.getInventory().sendFurniture();
        await this.tradingWithUser.user.getInventory().sendFurniture();

        this.stopTrading();
    }
}

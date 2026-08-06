import User from "../../../Users/User.js";
import { randomUUID } from "node:crypto";
import { ShopPageBotModel } from "../../../../Database/Models/Shop/ShopPageBotModel.js";
import { UserBotModel } from "../../../../Database/Models/Users/Bots/UserBotModel.js";
import { UserProtobuffListener } from "../../Interfaces/UserProtobuffListener.js";
import { PurchaseShopBotData, ShopPurchaseData } from "@pixel63/events";

export default class PurchaseShopBotEvent implements UserProtobuffListener<PurchaseShopBotData> {
    minimumDurationBetweenEvents?: number = 200;

    async handle(user: User, payload: PurchaseShopBotData) {
        const shopBot = await ShopPageBotModel.findOne({
            where: {
                id: payload.id
            }
        });

        if(!shopBot) {
            return;
        }

        if((shopBot.credits && user.model.credits < shopBot.credits)) {
            return;
        }

        if((shopBot.duckets && user.model.duckets < shopBot.duckets)) {
            return;
        }

        if((shopBot.diamonds && user.model.diamonds < shopBot.diamonds)) {
            return;
        }

        user.model.credits -= shopBot.credits ?? 0;
        user.model.duckets -= shopBot.duckets ?? 0;
        user.model.diamonds -= shopBot.diamonds ?? 0;

        user.habboClub.addCashback(shopBot.credits ?? 0);

        await user.save();

        const userBot = await UserBotModel.create({
            id: randomUUID(),

            position: null,
            direction: null,

            type: shopBot.type,

            name: shopBot.name,
            motto: shopBot.motto,

            figureConfiguration: shopBot.figureConfiguration,
            
            roomId: null,
            userId: user.model.id,
        });

        userBot.user = user.model;

        await user.getInventory().addBot(userBot);

        user.sendProtobuff(ShopPurchaseData, ShopPurchaseData.create({
            success: true,
            itemId: payload.id,
            quantity: 1
        }));
    }
}
import User from "../../../../Users/User.js";
import IncomingEvent from "../../../Interfaces/IncomingEvent.js";
import { FurnitureModel } from "../../../../Database/Models/Furniture/FurnitureModel.js";
import { ShopPageFurnitureModel } from "../../../../Database/Models/Shop/ShopPageFurnitureModel.js";
import GetShopPageFurnitureEvent from "../GetShopPageFurnitureEvent.js";
import { randomUUID } from "node:crypto";
import ProtobuffListener from "../../../Interfaces/ProtobuffListener.js";
import { GetShopPageFurnitureData, GetShopPagesData, UpdateShopFeatureData, UpdateShopFurnitureData } from "@pixel63/events";
import sharp from "sharp";
import { ShopPageFeatureModel } from "../../../../Database/Models/Shop/ShopPageFeatureModel.js";
import GetShopPagesEvent from "../GetShopPagesEvent.js";
import { ShopPageModel } from "../../../../Database/Models/Shop/ShopPageModel.js";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { config } from "../../../../Config/Config.js";
import path from "node:path";

export default class UpdateShopFeatureEvent implements ProtobuffListener<UpdateShopFeatureData> {
    minimumDurationBetweenEvents?: number = 1000;
    
    async handle(user: User, payload: UpdateShopFeatureData) {
        const permissions = await user.getPermissions();

        if(!permissions.hasPermission("shop:edit")) {
            throw new Error("User is not privileged to edit the shope.");
        }

        const page = await ShopPageModel.findByPk(payload.pageId);

        if(!page) {
            throw new Error("Page does not exist.");
        }

        if(payload.id !== undefined) {
            await ShopPageFeatureModel.update({
                title: payload.title,
                image: await this.getValidatedImage(payload.image),
                featuredPageId: payload.featuredPageId,
                configuration: payload.configuration
            }, {
                where: {
                    id: payload.id
                }
            });
        }
        else {
            const featureId = randomUUID();

            await ShopPageFeatureModel.create({
                id: featureId,

                title: payload.title,
                image: await this.getValidatedImage(payload.image),
                featuredPageId: payload.featuredPageId,
                configuration: payload.configuration
            });

            switch(payload.alignment) {
                case "vertical": {
                    await page.update({
                        featureVerticalId: featureId
                    });
                    
                    break;
                }
                
                case "top": {
                    await page.update({
                        featureHorizontalTopId: featureId
                    });
                    
                    break;
                }
                
                case "middle": {
                    await page.update({
                        featureHorizontalMiddleId: featureId
                    });
                    
                    break;
                }
                
                case "bottom": {
                    await page.update({
                        featureHorizontalBottomId: featureId
                    });
                    
                    break;
                }
            }
        }

        await (new GetShopPagesEvent()).handle(user, GetShopPagesData.create({
            category: page.category
        }));
    }
    
    private async getValidatedImage(dataUrl: string) {
        const matches = dataUrl.match(/^data:image\/png;base64,(.+)$/);

        if(!matches || !matches[1]) {
            throw new Error("Thumbnail image is not a valid PNG data URL.");
        }

        const buffer = Buffer.from(matches[1], "base64");

        const sharpImage = sharp(buffer);

        const metadata = await sharpImage.metadata();

        if(metadata.format !== "png") {
            throw new Error("Thumbnail image is not in PNG format.");
        }

        const outputBuffer =
            await sharpImage.png({
                compressionLevel: 9,
                adaptiveFiltering: true,
                force: true
            }).toBuffer();

        if(!existsSync(config.shop.features.path)) {
            mkdirSync(config.shop.features.path, {
                recursive: true
            });
        }

        const outputPath = `${randomUUID()}.png`;

        writeFileSync(path.join(config.shop.features.path, outputPath), outputBuffer);

        return outputPath;
    }
}

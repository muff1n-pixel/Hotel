import sharp from "sharp";
import User from "../../../../Users/User";
import { PurchaseRoomCameraPhotoData, UserFurnitureCustomData } from "@pixel63/events";
import ProtobuffListener from "../../../Interfaces/ProtobuffListener";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { config } from "../../../../Config/Config";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { FurnitureModel } from "../../../../Database/Models/Furniture/FurnitureModel";
import { UserFurnitureModel } from "../../../../Database/Models/Users/Furniture/UserFurnitureModel";

export default class PurchaseRoomCameraPhotoEvent implements ProtobuffListener<PurchaseRoomCameraPhotoData> {
    minimumDurationBetweenEvents?: number = 100;

    async handle(user: User, payload: PurchaseRoomCameraPhotoData) {
        if(!user.room) {
            throw new Error("User is not in a room.");
        }
        
        const image = await this.getValidatedCameraImage(payload.image);

        if(payload.action === "web") {
            // unsupported right now

            return;
        }

        let furniture: FurnitureModel | null = null;

        switch(payload.action) {
            case "small": {
                furniture = await FurnitureModel.findOne({
                    where: {
                        type: "external_image_wallitem_poster_small"
                    }
                });

                if(!furniture) {
                    throw new Error("Small poster furniture doesn't exist.");
                }

                if(user.model.credits < 3) {
                    throw new Error("User does not have enough credits.");
                }

                user.model.credits -= 3;

                await user.model.save();

                break;
            }
            
            case "regular": {
                furniture = await FurnitureModel.findOne({
                    where: {
                        type: "external_image_wallitem_poster"
                    }
                });

                if(!furniture) {
                    throw new Error("Small poster furniture doesn't exist.");
                }

                if(user.model.credits < 5) {
                    throw new Error("User does not have enough credits.");
                }

                user.model.credits -= 5;

                await user.model.save();

                break;
            }

            default: {
                throw new Error("Unsupported action.");
            }
        }

        const userFurniture = await UserFurnitureModel.create({
            id: randomUUID(),
            position: null,
            direction: null,
            animation: 0,
            color: null,
            data: UserFurnitureCustomData.create({
                externalImage: {
                    externalImage: `/assets/room/photos/generated/${image}`
                }
            }),
            
            roomId: null,
            userId: user.model.id,
            furnitureId: furniture.id
        }, {
            include: [
                {
                    model: FurnitureModel,
                    as: "furniture"
                }
            ]
        });

        userFurniture.user = user.model;
        userFurniture.furniture = furniture;

        await user.getInventory().addFurniture(userFurniture);
    }

    private async getValidatedCameraImage(dataUrl: string) {
        const matches = dataUrl.match(/^data:image\/png;base64,(.+)$/);

        if(!matches || !matches[1]) {
            throw new Error("Thumbnail image is not a valid PNG data URL.");
        }

        const buffer = Buffer.from(matches[1], "base64");

        const maxSizeBytes = (5 * 75) * 1024;

        if(buffer.length > maxSizeBytes) {
            throw new Error("Thumbnail image exceeds file size limit.");
        }

        const sharpImage = sharp(buffer);

        const metadata = await sharpImage.metadata();

        if(metadata.format !== "png") {
            throw new Error("Thumbnail image is not in PNG format.");
        }

        if(metadata.width !== 320 || metadata.height !== 320) {
            throw new Error("Thumbnail image is not 320x320 pixels.");
        }

        const outputBuffer =
            await sharpImage.png({
                compressionLevel: 9,
                adaptiveFiltering: true,
                force: true
            }).toBuffer();

        if(!existsSync(config.camera.path)) {
            mkdirSync(config.camera.path, {
                recursive: true
            });
        }

        const outputPath = `${randomUUID()}.png`;

        writeFileSync(path.join(config.camera.path, outputPath), outputBuffer);

        return outputPath;
    }
}

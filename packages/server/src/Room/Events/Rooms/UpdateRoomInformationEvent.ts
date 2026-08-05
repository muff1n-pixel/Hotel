import { RoomCategoryModel } from "../../../Database/Models/Rooms/Categories/RoomCategoryModel.js";
import sharp from "sharp";
import { RoomInformationData, UpdateRoomInformationData } from "@pixel63/events";
import bcrypt from "bcrypt";
import { RoomProtobuffListener } from "../Interfaces/RoomProtobuffListener.js";
import RoomWebSocketUser from "../../Server/Users/RoomWebSocketUser.js";

export default class UpdateRoomInformationEvent implements RoomProtobuffListener<UpdateRoomInformationData> {
    minimumDurationBetweenEvents?: number = 100;

    async handle(user: RoomWebSocketUser, payload: UpdateRoomInformationData) {
        if(user.roomUser.room.model.owner.id !== user.id) {
            throw new Error("User is not owner of room.");
        }

        if(payload.name !== undefined) {
            user.roomUser.room.model.name = payload.name;
        }
        
        if(payload.description !== undefined) {
            user.roomUser.room.model.description = payload.description;
        }
        
        if(payload.category !== undefined) {
            const category = await RoomCategoryModel.findOne({
                where: {
                    id: payload.category
                }
            });

            if(category) {
                if(!category.developer || user.permissions.hasPermission("room:type")) {
                    user.roomUser.room.model.set({
                        categoryId: category.id
                    });

                    user.roomUser.room.model.category = category;
                }
            }
        }

        if(payload.maxUsers !== undefined) {
            if(payload.maxUsers >= 5 && payload.maxUsers <= 50 && payload.maxUsers % 5 === 0) {
                user.roomUser.room.model.maxUsers = payload.maxUsers;
            }
        }

        if(payload.thumbnail !== undefined) {
            user.roomUser.room.model.thumbnail = await this.getValidatedThumbnailImage(payload.thumbnail);
        }

        if(payload.lock !== undefined) {
            user.roomUser.room.model.lock = payload.lock;
        }

        if(payload.trading !== undefined && ["everyone", "rights", "disabled"].includes(payload.trading)) {
            user.roomUser.room.model.trading = payload.trading;
        }

        if(payload.allowWalkingThroughUsers !== undefined) {
            user.roomUser.room.model.allowWalkingThroughUsers = payload.allowWalkingThroughUsers;

            user.roomUser.room.floorplan.regenerateStaticGrid();
        }

        if(payload.allowPets !== undefined) {
            user.roomUser.room.model.allowPets = payload.allowPets;
        }

        if(payload.allowPetsToEatFood !== undefined) {
            user.roomUser.room.model.allowPetsToEatFood = payload.allowPetsToEatFood;
        }

        if(payload.muteAllPets !== undefined) {
            user.roomUser.room.model.muteAllPets = payload.muteAllPets;
        }

        if(payload.password !== undefined) {
            user.roomUser.room.model.password = await bcrypt.hash(payload.password, 10);
        }

        if(payload.type && user.permissions.hasPermission("room:type")) {
            user.roomUser.room.model.type = payload.type;
        }

        if(user.roomUser.room.model.changed()) {
            await user.roomUser.room.model.save();

            user.roomUser.room.sendProtobuff(RoomInformationData, RoomInformationData.create(user.roomUser.room.getInformationData()));
        }
    }

    private async getValidatedThumbnailImage(dataUrl: string) {
        const matches = dataUrl.match(/^data:image\/png;base64,(.+)$/);

        if(!matches || !matches[1]) {
            throw new Error("Thumbnail image is not a valid PNG data URL.");
        }

        const buffer = Buffer.from(matches[1], "base64");

        const maxSizeBytes = 75 * 1024;

        if(buffer.length > maxSizeBytes) {
            throw new Error("Thumbnail image exceeds file size limit.");
        }

        const sharpImage = sharp(buffer);

        const metadata = await sharpImage.metadata();

        if(metadata.format !== "png") {
            throw new Error("Thumbnail image is not in PNG format.");
        }

        if(metadata.width !== 110 || metadata.height !== 110) {
            throw new Error("Thumbnail image is not 110x110 pixels.");
        }

        const outputBuffer =
            await sharpImage.png({
                compressionLevel: 9,
                adaptiveFiltering: true,
                force: true
            })
            .toBuffer();

        const base64 = outputBuffer.toString("base64");

        return `data:image/png;base64,${base64}`;
    }
}

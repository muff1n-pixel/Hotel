import User from "../../../Users/User.js";
import { RoomCategoryModel } from "../../../Database/Models/Rooms/Categories/RoomCategoryModel.js";
import sharp from "sharp";
import { RoomInformationData, UpdateRoomInformationData } from "@pixel63/events";
import ProtobuffListener from "../../Interfaces/ProtobuffListener.js";

export default class UpdateRoomInformationEvent implements ProtobuffListener<UpdateRoomInformationData> {
    public readonly name = "UpdateRoomInformationEvent";

    async handle(user: User, payload: UpdateRoomInformationData) {
        if(!user.room) {
            throw new Error("User is not in a room.");
        }

        if(payload.name !== undefined) {
            user.room.model.name = payload.name;
        }
        
        if(payload.description !== undefined) {
            user.room.model.description = payload.description;
        }
        
        if(payload.category !== undefined) {
            const category = await RoomCategoryModel.findOne({
                where: {
                    id: payload.category
                }
            });

            if(category) {
                user.room.model.set({
                    categoryId: category.id
                });

                user.room.model.category = category;
            }
        }

        if(payload.maxUsers !== undefined) {
            if(payload.maxUsers >= 5 && payload.maxUsers <= 50 && payload.maxUsers % 5 === 0) {
                user.room.model.maxUsers = payload.maxUsers;
            }
        }

        if(payload.thumbnail !== undefined) {
            user.room.model.thumbnail = await this.getValidatedThumbnailImage(payload.thumbnail);
        }

        const permissions = await user.getPermissions();

        if(payload.type && permissions.hasPermission("room:type")) {
            user.room.model.type = payload.type;
        }

        if(user.room.model.changed()) {
            await user.room.model.save();

            user.room.sendProtobuff(RoomInformationData, RoomInformationData.create(user.room.getInformationData()));
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

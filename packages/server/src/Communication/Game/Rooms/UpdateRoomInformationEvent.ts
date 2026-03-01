import OutgoingEvent from "../../../Events/Interfaces/OutgoingEvent.js";
import User from "../../../Users/User.js";
import IncomingEvent from "../../Interfaces/IncomingEvent.js";
import { UpdateRoomInformationEventData } from "@shared/Communications/Requests/Rooms/UpdateRoomInformationEventData.js";
import { RoomCategoryModel } from "../../../Database/Models/Rooms/Categories/RoomCategoryModel.js";
import sharp from "sharp";
import { RoomInformationData } from "@pixel63/events";

export default class UpdateRoomInformationEvent implements IncomingEvent<UpdateRoomInformationEventData> {
    public readonly name = "UpdateRoomInformationEvent";

    async handle(user: User, event: UpdateRoomInformationEventData) {
        if(!user.room) {
            throw new Error("User is not in a room.");
        }

        if(event.name !== undefined) {
            user.room.model.name = event.name;
        }
        
        if(event.description !== undefined) {
            user.room.model.description = event.description;
        }
        
        if(event.category !== undefined) {
            const category = await RoomCategoryModel.findOne({
                where: {
                    id: event.category
                }
            });

            if(category) {
                user.room.model.set({
                    categoryId: category.id
                });

                user.room.model.category = category;
            }
        }

        if(event.maxUsers !== undefined) {
            if(event.maxUsers >= 5 && event.maxUsers <= 50 && event.maxUsers % 5 === 0) {
                user.room.model.maxUsers = event.maxUsers;
            }
        }

        if(event.thumbnail !== undefined) {
            user.room.model.thumbnail = await this.getValidatedThumbnailImage(event.thumbnail);
        }

        const permissions = await user.getPermissions();

        if(event.type && permissions.hasPermission("room:type")) {
            user.room.model.type = event.type;
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

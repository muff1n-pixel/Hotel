import AssetFetcher from "@Client/Assets/AssetFetcher";
import ContextNotAvailableError from "@Client/Exceptions/ContextNotAvailableError";
import Figure from "@Client/Figure/Figure";
import { FigureConfigurationData, RoomActorChatOptionsData } from "@pixel63/events";
import { RoomActor } from "../RoomInstance";
import RoomFigureItem from "../Items/Figure/RoomFigureItem";
import RoomPetItem from "../Items/Pets/RoomPetItem";
import Pet from "@Client/Pets/Pet";

export default class RoomChatRenderer {
    public static async render(style: string, user: string, actor: RoomActor, message: string, options?: RoomActorChatOptionsData) {
        const roomChatStyles = await AssetFetcher.fetchJson<any[]>("/assets/room/RoomChatStyles.json");

        const chatStyleImage = await AssetFetcher.fetchImage(`/assets/room/chat/${style}_chat_bubble_base_png.png`);

        const canvas = new OffscreenCanvas(1, 1);

        const context = canvas.getContext("2d");

        if(!context) {
            throw new ContextNotAvailableError();
        }

        context.font = `${(options?.italic)?("italic"):("")} 12px "Ubuntu Bold"`;
        const userText = (options?.hideUsername)?({ width: 0 }):(context.measureText(`${user}: `));

        context.font = `${(options?.italic)?("italic"):("")} 12px "Ubuntu"`;
        const messageText = context.measureText(message);

        const textWidth = Math.ceil(userText.width + messageText.width);

        const minWidth = chatStyleImage.width + textWidth - 14;

        canvas.width = minWidth;
        canvas.height = chatStyleImage.height;

        const roomChatStyle = roomChatStyles.find((roomChatStyle) => roomChatStyle.assetName === style);

        if(!roomChatStyle) {
            throw new Error("Invalid room chat style.");
        }


        context.drawImage(chatStyleImage,
            0, 0, roomChatStyle.slice.left, chatStyleImage.height,
            0, 0, roomChatStyle.slice.left, chatStyleImage.height
        );

        context.drawImage(chatStyleImage,
            roomChatStyle.slice.left, 0, 1, chatStyleImage.height,
            roomChatStyle.slice.left, 0, textWidth, chatStyleImage.height
        );

        context.drawImage(chatStyleImage,
            roomChatStyle.slice.left, 0, chatStyleImage.width - roomChatStyle.slice.left, chatStyleImage.height,
            roomChatStyle.slice.left + textWidth - 14, 0, chatStyleImage.width - roomChatStyle.slice.left, chatStyleImage.height
        );

        context.textBaseline = "top";
        
        if(options?.transparent) {
            context.globalAlpha = 0.75;
        }

        if(!options?.hideUsername) {
            context.font = `${(options?.italic)?("italic"):("")} 12px "Ubuntu Bold"`;
            context.fillText(`${user}: `, roomChatStyle.text.left + 2, roomChatStyle.text.top + 2);
        }

        context.font = `${(options?.italic)?("italic"):("")} 12px "Ubuntu"`;
        context.fillText(message, roomChatStyle.text.left + 2 + userText.width, roomChatStyle.text.top + 2);

        context.globalAlpha = 1;

        if(roomChatStyle.figure && actor.item instanceof RoomFigureItem) {
            const figureRenderer = new Figure(actor.item.figureRenderer.configuration, 2, undefined, false);
            
            await figureRenderer.loadAssets(0);

            const { figure } = figureRenderer.renderToCanvas(0, false);
            
            context.drawImage(
                figure.image,
                0, 0, figure.image.width, 74 * 2,
                roomChatStyle.figure.left + -65, roomChatStyle.figure.top + -52, figure.image.width / 2, 74
            );
        }
        else if(roomChatStyle.figure && actor.item instanceof RoomPetItem) {
            console.log(actor.item);
            const figureRenderer = new Pet(actor.item.pet.type, actor.item.pet.palettes, undefined, true);
            
            await figureRenderer.loadAssets();

            const image = await figureRenderer.renderToCanvas();
            
            console.log(image);

            const maxSize = 30;

            const scale = Math.min(maxSize / image.width, maxSize / image.height, 1);

            const drawWidth = image.width * scale;
            const drawHeight = image.height * scale;

            context.drawImage(
                image,
                0, 0, image.width, image.height,
                roomChatStyle.figure.left - drawWidth / 2, roomChatStyle.figure.top - drawHeight / 2, drawWidth, drawHeight
            );
        }

        return canvas.transferToImageBitmap();
    }
}

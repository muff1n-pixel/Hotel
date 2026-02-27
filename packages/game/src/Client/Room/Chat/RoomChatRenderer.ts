import AssetFetcher from "@Client/Assets/AssetFetcher";
import ContextNotAvailableError from "@Client/Exceptions/ContextNotAvailableError";
import Figure from "@Client/Figure/Figure";
import { FigureConfiguration } from "@Shared/Interfaces/Figure/FigureConfiguration";
import { RoomChatOptionsData } from "../../../../../shared/Communications/Responses/Rooms/Chat/RoomChatEventData";
import { defaultFigureWorkerClient } from "@Client/Figure/Worker/FigureWorkerClient";

export default class RoomChatRenderer {
    public static async render(style: string, user: string, figureConfiguration: FigureConfiguration, message: string, options?: RoomChatOptionsData) {
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

        if(roomChatStyle.figure) {
            const figureRenderer = new Figure(figureConfiguration, 2, undefined, false);

            const { figure } = await figureRenderer.renderToCanvas(defaultFigureWorkerClient, 0, false);
            
            context.drawImage(
                figure.image,
                0, 0, figure.image.width, 74 * 2,
                roomChatStyle.figure.left + -65, roomChatStyle.figure.top + -52, figure.image.width / 2, 74
            );
        }

        return await createImageBitmap(canvas);
    }
}

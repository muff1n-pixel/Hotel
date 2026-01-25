import AssetFetcher from "@Client/Assets/AssetFetcher";
import ContextNotAvailableError from "@Client/Exceptions/ContextNotAvailableError";
import FigureRenderer from "@Client/Figure/FigureRenderer";
import { FigureConfiguration } from "@Shared/interfaces/figure/FigureConfiguration";

export default class RoomChatRenderer {
    public static async render(style: string, user: string, figureConfiguration: FigureConfiguration, message: string) {
        const roomChatStyles = await AssetFetcher.fetchJson<any[]>("/assets/room/RoomChatStyles.json");

        const chatStyleImage = await AssetFetcher.fetchImage(`/assets/room/chat/${style}_chat_bubble_base_png.png`);

        const canvas = new OffscreenCanvas(1, 1);

        const context = canvas.getContext("2d");

        if(!context) {
            throw new ContextNotAvailableError();
        }

        context.font = `12px "Ubuntu Bold"`;
        const userText = context.measureText(`${user}: `);

        context.font = `12px "Ubuntu"`;
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

        context.font = `12px "Ubuntu Bold"`;
        context.fillText(`${user}: `, roomChatStyle.text.left + 2, roomChatStyle.text.top + 2);

        context.font = `12px "Ubuntu"`;
        context.fillText(message, roomChatStyle.text.left + 2 + userText.width, roomChatStyle.text.top + 2);

        if(roomChatStyle.figure) {
            const figureRenderer = new FigureRenderer(figureConfiguration, 2, undefined, false);

            const sprite = await figureRenderer.renderToCanvas(FigureRenderer.figureWorker, 0, false);
            
            context.drawImage(
                sprite.image,
                0, 0, sprite.image.width, 74 * 2,
                roomChatStyle.figure.left + -65, roomChatStyle.figure.top + -52, sprite.image.width / 2, 74
            );
        }

        return await createImageBitmap(canvas);
    }
}

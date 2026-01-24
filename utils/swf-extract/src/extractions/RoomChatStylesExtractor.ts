import path from "path";
import { extractSwf } from "../swf/SwfExtraction.ts";
import { readFileSync, writeFileSync } from "fs";

export default async function extractRoomChatStyles() {
    const habboSwfCollection = await extractSwf("Habbo", "assets/Habbo/Habbo.swf");

    /*const roomStyleFiles = habboSwfCollection.extra.filter((filePath) => filePath.includes("roomchat_styles_"));

    for(let roomStyleFile of roomStyleFiles) {
        const assetName = path.basename(roomStyleFile, "_xml.xml").replace("abboRoomUICom_roomchat_styles_", "");

        if(assetName.endsWith("_speak") || assetName.endsWith("_shout") || assetName.endsWith("_whisper")) {
            console.log("Skipping " + assetName);

            continue;
        }

        console.log("Extracting " + assetName);
    }*/

    const roomStyleFiles = habboSwfCollection.extra.filter((filePath) => filePath.includes("FlowChatCom_style_"));

    const styles: any[] = [];

    for(let roomStyleFile of roomStyleFiles) {
        const assetName = path.basename(roomStyleFile, "_txt.xml").replace("reeFlowChatCom_style_", "").replace("_regpoints", "");

        console.log("Extracting " + assetName);
        const content = readFileSync(roomStyleFile, {
            encoding: "utf-8"
        });

        const lines = content.split('\n');

        const nineSliceXY = lines.find((line) => line.startsWith("9sliceXY"))?.split('=')[1]?.trim();
        const faceXY = lines.find((line) => line.startsWith("faceXY"))?.split('=')[1]?.trim();
        const textFieldMargins = lines.find((line) => line.startsWith("textFieldMargins"))?.split('=')[1]?.trim();
        
        styles.push({
            assetName,
            slice: (nineSliceXY) && {
                left: parseInt(nineSliceXY.split(',')[0]!.trim()),
                top: parseInt(nineSliceXY.split(',')[1]!.trim()),
            },
            figure: (faceXY) && {
                left: parseInt(faceXY.split(',')[0]!.trim()),
                top: parseInt(faceXY.split(',')[1]!.trim()),
            },
            text: (textFieldMargins) && {
                left: parseInt(textFieldMargins.split(',')[0]!.trim()),
                top: parseInt(textFieldMargins.split(',')[1]!.trim()),
            }
        });
    }

    writeFileSync("../../assets/room/RoomChatStyles.json", JSON.stringify(styles, undefined, 2));
}

import { ServerTokenModel } from "../Game/Database/Models/Server/ServerTokenModel";
import RoomServer from "./Server/RoomServer";

ServerTokenModel.findOne().then((serverToken) => {
    if(!serverToken) {
        throw new Error("There is no server token registered, is the game server running?");
    }

    const roomServer = new RoomServer(serverToken.secretKey);

    console.log("Room server started");
});

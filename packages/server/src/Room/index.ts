import { ServerTokenModel } from "../Database/Models/Server/ServerTokenModel";
import RoomServer from "./Server/RoomServer";

export let roomServer: RoomServer;

ServerTokenModel.findOne().then((serverToken) => {
    if(!serverToken) {
        throw new Error("There is no server token registered, is the game server running?");
    }

    roomServer = new RoomServer(serverToken.secretKey);

    console.log("Room server started");
});

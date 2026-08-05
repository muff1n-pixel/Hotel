import { clientInstance, webSocketClient } from "../../..";
import ProtobuffListener from "@Client/Communications/ProtobuffListener";
import WebSocketClient from "@Game/WebSocket/WebSocketClient";
import { ConnectToRoomData, RoomLoadData } from "@pixel63/events";
import Cookies from "js-cookie";

import RoomFurnitureEvent from "@Client/Communications/Room/Furniture/RoomFurnitureEvent";
import RoomStructureEvent from "@Client/Communications/Room/RoomStructureEvent";
import RoomInformationEvent from "@Client/Communications/Room/RoomInformationEvent";
import RoomFurnitureMovedEvent from "@Client/Communications/Room/Furniture/MoveRoomFurnitureEvent";
import RoomActorChatEvent from "@Client/Communications/Room/Actors/RoomActorChatEvent";
import RoomBotsEvent from "@Client/Communications/Room/Bots/RoomBotsEvent";
import RoomActorPositionEvent from "@Client/Communications/Room/Actors/RoomActorPositionEvent";
import { RoomActorActionData, RoomActorChatData, RoomActorPositionData, RoomActorWalkToData, RoomBotsData, RoomCategoriesData, RoomCategoryData, RoomChatStylesData, RoomFurnitureData, RoomFurnitureMovedData, RoomInformationData, RoomUserEnteredData, RoomUserData, UserData, RoomUserLeftData, RoomStructureData, UserPermissionsData, NavigatorCategoryData, LeaveRoomData, RoomPetsData, UserFriendData, UserFriendsData, UserFriendUpdateData, UserFriendMessageData, WidgetNotificationData, RoomLockData, RoomBellQueueData, HotelAlertData, UserClothingUnlockedData, RoomClickConfigurationData, RoomClickConfigurationResetData, RoomUserTradingData, RoomUserTradingClosedData, RoomGroupData, RoomEventData, UserNotificationData, UserHabboClubData } from "@pixel63/events";
import RoomActorWalkToEvent from "@Client/Communications/Room/Actors/RoomActorWalkToEvent";
import RoomActorActionEvent from "@Client/Communications/Room/Actors/RoomActorActionEvent";
import RoomCategoriesEvent from "@Client/Communications/Room/Categories/RoomCategoriesEvent";
import RoomChatStylesEvent from "@Client/Communications/Room/Chat/RoomChatStylesEvent";
import RoomUserEnteredEvent from "@Client/Communications/Room/User/RoomUserEnteredEvent";
import RoomUserEvent from "@Client/Communications/Room/User/RoomUserEvent";
import RoomUserLeftEvent from "@Client/Communications/Room/User/RoomUserLeftEvent";
import LeaveRoomEvent from "@Client/Communications/Room/LeaveRoomEvent";
import RoomPetsEvent from "@Client/Communications/Room/Pets/RoomPetsEvent";
import RoomLockEvent from "@Client/Communications/Room/Lock/RoomLockEvent";
import RoomClickConfigurationEvent from "@Client/Communications/Room/Configuration/RoomClickConfigurationEvent";
import RoomClickConfigurationResetEvent from "@Client/Communications/Room/Configuration/RoomClickConfigurationResetEvent";
import RoomUserTradingEvent from "@Client/Communications/Room/User/Trading/RoomUserTradingEvent";
import RoomUserTradingClosedEvent from "@Client/Communications/Room/User/Trading/RoomUserTradingClosedEvent";
import RoomGroupEvent from "@Client/Communications/Room/RoomGroupEvent";
import RoomEventEvent from "@Client/Communications/Room/RoomEventEvent";
import RoomInstance from "@Client/Room/RoomInstance";
import { RoomLogger } from "@pixel63/shared/Logger/Logger";
import RoomFurniture from "@Client/Room/Furniture/RoomFurniture";

export default class ConnectToRoomEvent implements ProtobuffListener<ConnectToRoomData> {
    async handle(payload: ConnectToRoomData) {
        if(clientInstance.roomInstance.value) {
            clientInstance.roomInstance.value.terminate();

            clientInstance.roomInstance.value = undefined;
            //throw new Error("TODO: room is already loaded!!");
        }

        const roomWebsocket = new WebSocketClient(false, payload.host, payload.port, {
            accessToken: Cookies.get("accessToken") ?? "",
            roomId: payload.roomId
        });

        roomWebsocket.addProtobuffListener(RoomLoadData, {
            async handle(payload: RoomLoadData) {
                clientInstance.roomInstance.value = new RoomInstance(clientInstance, roomWebsocket, payload, () => {
                    for(const furniture of payload.furniture) {
                        const furnitureData = payload.furnitureData.find((furnitureData) => furnitureData.id === furniture.furnitureId);

                        if(!furnitureData) {
                            RoomLogger.error("Server did not send furniture data for user furniture!", {
                                furniture
                            });

                            continue;
                        }

                        clientInstance.roomInstance.value!.furnitures.push(new RoomFurniture(clientInstance.roomInstance.value!, furnitureData, furniture));
                    }
                });

                roomWebsocket.setReady();
            },
        });

        // Room events
        roomWebsocket.addProtobuffListener(RoomCategoriesData, new RoomCategoriesEvent());
        roomWebsocket.addProtobuffListener(RoomChatStylesData, new RoomChatStylesEvent());
        roomWebsocket.addProtobuffListener(RoomGroupData, new RoomGroupEvent());
        roomWebsocket.addProtobuffListener(RoomEventData, new RoomEventEvent());
        roomWebsocket.addProtobuffListener(RoomInformationData, new RoomInformationEvent());
        roomWebsocket.addProtobuffListener(RoomStructureData, new RoomStructureEvent());
        roomWebsocket.addProtobuffListener(RoomClickConfigurationData, new RoomClickConfigurationEvent());
        roomWebsocket.addProtobuffListener(RoomClickConfigurationResetData, new RoomClickConfigurationResetEvent());

        // Room actor events
        roomWebsocket.addProtobuffListener(RoomActorWalkToData, new RoomActorWalkToEvent());
        roomWebsocket.addProtobuffListener(RoomActorPositionData, new RoomActorPositionEvent());
        roomWebsocket.addProtobuffListener(RoomActorActionData, new RoomActorActionEvent());
        roomWebsocket.addProtobuffListener(RoomActorChatData, new RoomActorChatEvent());

        // Room bot events
        roomWebsocket.addProtobuffListener(RoomBotsData, new RoomBotsEvent());

        // Room pet events
        roomWebsocket.addProtobuffListener(RoomPetsData, new RoomPetsEvent());

        // Room furniture events
        roomWebsocket.addProtobuffListener(RoomFurnitureMovedData, new RoomFurnitureMovedEvent());
        roomWebsocket.addProtobuffListener(RoomFurnitureData, new RoomFurnitureEvent());

        // Room user events
        roomWebsocket.addProtobuffListener(RoomUserData, new RoomUserEvent());
        roomWebsocket.addProtobuffListener(RoomUserEnteredData, new RoomUserEnteredEvent());
        roomWebsocket.addProtobuffListener(RoomUserLeftData, new RoomUserLeftEvent());
        roomWebsocket.addProtobuffListener(LeaveRoomData, new LeaveRoomEvent());

        // Room user trading events
        roomWebsocket.addProtobuffListener(RoomUserTradingData, new RoomUserTradingEvent());
        roomWebsocket.addProtobuffListener(RoomUserTradingClosedData, new RoomUserTradingClosedEvent());

        // Room bell events
        roomWebsocket.addProtobuffListener(RoomLockData, new RoomLockEvent());
    }
}

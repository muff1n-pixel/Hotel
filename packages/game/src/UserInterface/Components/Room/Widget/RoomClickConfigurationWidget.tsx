import { webSocketClient } from "@Game/index";
import { ResetRoomClickConfigurationData, SetRoomClickConfigurationData } from "@pixel63/events";
import { RoomClickFurnitureConfiguration, RoomClickUserConfiguration } from "@pixel63/events/build/Room/Configuration/RoomClickConfigurationData";
import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";
import WiredWidget from "@UserInterface/Common/Widgets/Wired/WiredWidget";
import WiredWidgetButton from "@UserInterface/Common/Widgets/Wired/WiredWidgetButton";
import useRoomClickConfiguration from "@UserInterface/Components/Room/Widget/Hooks/useRoomClickConfiguration";
import { useRoomInstance } from "@UserInterface/Hooks/useRoomInstance";
import { Fragment } from "react/jsx-runtime";

export default function RoomClickConfigurationWidget() {
    const roomInstance = useRoomInstance();
    const roomClickConfiguration = useRoomClickConfiguration();

    if(!roomClickConfiguration) {
        return null;
    }

    return (
        <WiredWidget>
            <FlexLayout direction="column" style={{
                padding: 8,
            }}>
                <div>
                    Clicking behaviour has changed for this room.
                </div>

                <div>
                    {(roomClickConfiguration?.userBehaviour === RoomClickUserConfiguration.CLICKABLE_USER_BEHAVIOUR) && (
                        <i>User clicks will walk behind the user</i>
                    )}

                    {(roomClickConfiguration?.userBehaviour === RoomClickUserConfiguration.UNCLICKABLE_USER_BEHAVIOUR) && (
                        <i>User clicks will passthrough</i>
                    )}

                    {(roomClickConfiguration?.userBehaviour && roomClickConfiguration?.furnitureBehaviour)?(
                        <i> and </i>
                    ):(
                        (roomClickConfiguration?.userBehaviour) && (
                            <i>. </i>
                        )
                    )}

                    {(roomClickConfiguration?.furnitureBehaviour === RoomClickFurnitureConfiguration.UNCLICKABLE_FURNITURE_CLICK_BEHAVIOUR) && (
                        <i>Furniture clicks will passthrough.</i>
                    )}
                </div>

                {(roomInstance?.hasRights) && (
                    <FlexLayout direction="row" justify="flex-end" align="center">
                        {(roomClickConfiguration?.enabled)?(
                            <WiredWidgetButton onClick={() => {
                                webSocketClient.sendProtobuff(SetRoomClickConfigurationData, SetRoomClickConfigurationData.create({
                                    enable: false
                                }));
                            }}>
                                Stop
                            </WiredWidgetButton>
                        ):(
                            <Fragment>
                                <WiredWidgetButton onClick={() => {
                                    webSocketClient.sendProtobuff(SetRoomClickConfigurationData, SetRoomClickConfigurationData.create({
                                        enable: true
                                    }));
                                }}>
                                    Resume
                                </WiredWidgetButton>

                                <WiredWidgetButton onClick={() => {
                                    webSocketClient.sendProtobuff(ResetRoomClickConfigurationData, ResetRoomClickConfigurationData.create({}));
                                }}>
                                    Reset
                                </WiredWidgetButton>
                            </Fragment>
                        )}
                    </FlexLayout>
                )}
            </FlexLayout>
        </WiredWidget>
    );
}

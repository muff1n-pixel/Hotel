import { webSocketClient } from "@Game/index";
import { ResetRoomClickConfigurationData, SetRoomClickConfigurationData } from "@pixel63/events";
import { RoomClickFurnitureConfiguration, RoomClickUserConfiguration } from "@pixel63/events/build/Client/Room/Configuration/RoomClickConfigurationData";
import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";
import WiredWidget from "@UserInterface/Common/Widgets/Wired/WiredWidget";
import WiredWidgetButton from "@UserInterface/Common/Widgets/Wired/WiredWidgetButton";
import useRoomClickConfiguration from "@UserInterface/Components/Room/Widget/Hooks/useRoomClickConfiguration";
import { useRoomInstance } from "@UserInterface/Hooks/useRoomInstance";
import { Fragment } from "react/jsx-runtime";
import { useTranslation } from "react-i18next";

export default function RoomClickConfigurationWidget() {
    const [getTranslation] = useTranslation("room");
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
                    {getTranslation("widget.click.changed")}
                </div>

                <div>
                    {(roomClickConfiguration?.userBehaviour === RoomClickUserConfiguration.CLICKABLE_USER_BEHAVIOUR) && (
                        <i>{getTranslation("widget.click.behind")}</i>
                    )}

                    {(roomClickConfiguration?.userBehaviour === RoomClickUserConfiguration.UNCLICKABLE_USER_BEHAVIOUR) && (
                        <i>{getTranslation("widget.click.user_passthrough")}</i>
                    )}

                    {(roomClickConfiguration?.userBehaviour && roomClickConfiguration?.furnitureBehaviour)?(
                        <i>{getTranslation("widget.click.and")}</i>
                    ):(
                        (roomClickConfiguration?.userBehaviour) && (
                            <i>{getTranslation("widget.click.period")}</i>
                        )
                    )}

                    {(roomClickConfiguration?.furnitureBehaviour === RoomClickFurnitureConfiguration.UNCLICKABLE_FURNITURE_CLICK_BEHAVIOUR) && (
                        <i>{getTranslation("widget.click.furniture_passthrough")}</i>
                    )}
                </div>

                {(roomInstance?.hasRights) && (
                    <FlexLayout direction="row" justify="flex-end" align="center">
                        {(roomClickConfiguration?.enabled)?(
                            <WiredWidgetButton onClick={() => {
                                roomInstance?.websocket.sendProtobuff(SetRoomClickConfigurationData, SetRoomClickConfigurationData.create({
                                    enable: false
                                }));
                            }}>
                                Stop
                            </WiredWidgetButton>
                        ):(
                            <Fragment>
                                <WiredWidgetButton onClick={() => {
                                    roomInstance?.websocket.sendProtobuff(SetRoomClickConfigurationData, SetRoomClickConfigurationData.create({
                                        enable: true
                                    }));
                                }}>
                                    Resume
                                </WiredWidgetButton>

                                <WiredWidgetButton onClick={() => {
                                    roomInstance?.websocket.sendProtobuff(ResetRoomClickConfigurationData, ResetRoomClickConfigurationData.create({}));
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

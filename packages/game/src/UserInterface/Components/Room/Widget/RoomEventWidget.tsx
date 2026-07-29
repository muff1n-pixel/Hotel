import DialogLink from "@UserInterface/Common/Dialog/Components/Link/DialogLink";
import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";
import WidgetPanel from "@UserInterface/Common/Widgets/WidgetPanel";
import useShopPageLink from "@UserInterface/Components/Shop/Hooks/useShopPageLink";
import { useRoomEvent } from "@UserInterface/Hooks/useRoomEvent";
import { useRoomInstance } from "@UserInterface/Hooks/useRoomInstance";

export default function RoomEventWidget() {
    const room = useRoomInstance();
    const roomEvent = useRoomEvent();

    const { openShopPage } = useShopPageLink("roomevent");

    if(!roomEvent && !room?.isOwner) {
        return null;
    }

    return (
        <WidgetPanel header={(
            <FlexLayout direction="row" align="center">
                <div className="sprite_navigator_event"/>

                {(roomEvent)?(
                    <div>{roomEvent.name}</div>
                ):(
                    <DialogLink onClick={openShopPage}>
                        <b>Promote room</b>
                    </DialogLink>
                )}
            </FlexLayout>
        )}>
            {(roomEvent) && (
                <FlexLayout direction="row" style={{
                    padding: "8px 16px 8px 8px"
                }}>
                    <div>{roomEvent?.description}</div>
                </FlexLayout>
            )}
        </WidgetPanel>
    );
}

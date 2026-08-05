import { useDialogs } from "../../Hooks/useDialogs";
import { useHotel } from "../../Hooks/useHotel";
import { useRoomInstance } from "../../Hooks/useRoomInstance";
import { useAnyPermissionAction } from "@UserInterface/Hooks/useAnyPermissionAction";
import DebugInformationFrameRate from "./DebugInformationFrameRate";

export default function DebugInformationPanel() {
    const room = useRoomInstance();

    const hotel = useHotel();
    const dialogs = useDialogs();

    const hasAdministrationPermissions = useAnyPermissionAction([
        "feedback:read",
    ]);

    return (
        <div style={{
            position: "absolute",

            left: 0,
            top: 0,

            padding: 32,

            textShadow: "1px 1px #000000"
        }}>
            <div style={{
                fontFamily: "Ubuntu Medium",
                fontSize: 40
            }}>
                Pixel63
            </div>

            {(hotel?.users !== undefined) && (
                <div>
                    {hotel.users} {(hotel.users !== 1)?("guests"):("guest")} online
                </div>
            )}

            {(room) && (
                <DebugInformationFrameRate/>
            )}

            <div style={{
                paddingTop: 20,

                display: "flex",
                flexDirection: "column",
                gap: 5
            }}>
                <div style={{
                    cursor: "pointer",
                    pointerEvents: "auto",
                    textDecoration: "underline"
                }} onClick={() => dialogs.addUniqueDialog("report-issue")}>
                    Report an issue
                </div>

                <div style={{
                    height: 20
                }}/>

                {(hasAdministrationPermissions) && (
                    <div style={{
                        cursor: "pointer",
                        pointerEvents: "auto",
                        textDecoration: "underline"
                    }} onClick={() => dialogs.addUniqueDialog("administration")}>
                        Administration tools
                    </div>
                )}

                <div style={{
                    height: 20
                }}/>
            </div>
        </div>
    );
}

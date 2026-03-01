import { useCallback } from "react";
import { useDialogs } from "../../hooks/useDialogs";
import { useHotel } from "../../hooks/useHotel";
import { useRoomInstance } from "../../hooks/useRoomInstance";
import { webSocketClient } from "../../..";
import { usePermissions } from "../../hooks/usePermissions";
import { RoomFurnitureExportData, RoomFurnitureImportData } from "@pixel63/events";

export default function DebugInformationPanel() {
    const room = useRoomInstance();
    const hotel = useHotel();
    const dialogs = useDialogs();

    const [
        hasReadFeedbackPermissions,

        hasImportRoomFurniturePermissions,
        hasExportRoomFurniturePermissions
    ] = usePermissions([
        "feedback:read",
        "room:import_furniture",
        "room:export_furniture"
    ]);

    const handleExportRoomFurniture = useCallback(() => {
        if(!room) {
            return;
        }

        const exportData: RoomFurnitureImportData = RoomFurnitureImportData.create({
            furniture: room.furnitures.map<RoomFurnitureExportData>((furniture) => {
                if(!furniture.data.furniture) {
                    throw new Error();
                }

                return RoomFurnitureExportData.create({
                    type: furniture.data.furniture.type,
                    color: furniture.data.furniture.color,
                    
                    data: furniture.data.data,

                    position: furniture.data.position,
                    direction: furniture.data.direction,
                    
                    animation: furniture.data.animation
                });
            })
        });

        navigator.clipboard.writeText(JSON.stringify(exportData))
            .then(() => {
                dialogs.addDialog("alert", {
                    message: "Room furniture export data has been copied to your clipboard."
                });
            })
            .catch(() => {
                dialogs.addDialog("alert", {
                    message: "Failed to copy text to your clipboard, please check your site settings."
                });
            });
    }, [dialogs, room]);

    const handleImportRoomFurniture = useCallback(() => {
        if(!room) {
            return;
        }

        navigator.clipboard.readText()
            .then((text) => {
                let exportData: RoomFurnitureExportData;

                try {
                    exportData = JSON.parse(text);
                }
                catch {
                    dialogs.addDialog("alert", {
                        message: "The text in your clipboard is not a JSON string."
                    });

                    return;
                }

                webSocketClient.sendProtobuff(RoomFurnitureImportData, exportData);
            })
            .catch(() => {
                dialogs.addDialog("alert", {
                    message: "Failed to read text from your clipboard, please check your site settings."
                });
            });
    }, [room, dialogs]);

    return (
        <div style={{
            position: "absolute",

            left: 0,
            top: 0,

            padding: 32
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

            <div style={{
                paddingTop: 20,

                display: "flex",
                flexDirection: "column",
                gap: 5
            }}>
                {(hasReadFeedbackPermissions) && (
                    <div style={{
                        cursor: "pointer",
                        pointerEvents: "auto",
                        textDecoration: "underline"
                    }} onClick={() => dialogs.addUniqueDialog("view-issues")}>
                        View feedback reports
                    </div>
                )}

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

                {(room && hasImportRoomFurniturePermissions) && (
                    <div style={{
                        cursor: "pointer",
                        pointerEvents: "auto",
                        textDecoration: "underline"
                    }} onClick={handleImportRoomFurniture}>
                        Import room furniture
                    </div>
                )}
                        
                {(room && hasExportRoomFurniturePermissions) && (
                    <div style={{
                        cursor: "pointer",
                        pointerEvents: "auto",
                        textDecoration: "underline"
                    }} onClick={handleExportRoomFurniture}>
                        Export room furniture
                    </div>
                )}
            </div>
        </div>
    );
}

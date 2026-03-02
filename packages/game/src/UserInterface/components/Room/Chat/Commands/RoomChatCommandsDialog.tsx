import Dialog from "../../../Dialog/Dialog";
import DialogContent from "../../../Dialog/DialogContent";
import DialogTable from "../../../Dialog/Table/DialogTable";

export type RoomChatCommandsDialogProps = {
    hidden?: boolean;
    onClose?: () => void;
}

export default function RoomChatCommandsDialog({ hidden, onClose }: RoomChatCommandsDialogProps) {
    return (
        <Dialog title="Chat commands" hidden={hidden} onClose={onClose} width={420} height={280} initialPosition="center">
            <DialogContent>
                <div style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                }}>
                    <DialogTable flex={[1, 3]} columns={["Command", "Description"]} items={[
                        {
                            id: ":commands",
                            values: [":commands", "Shows you this dialog!"]
                        },
                        {
                            id: ":furni",
                            values: [":furni", "Opens a dialog with a list of all furniture in the room."]
                        },
                        {
                            id: ":dance",
                            values: [":dance [0-4]", "Starts dancing or stop dancing if no dance provided."]
                        },
                        {
                            id: ":enable",
                            values: [":enable [id]", "Equips the enable id, if no provided, opens a dialog with all enables."]
                        },
                        {
                            id: ":carry",
                            values: [":carry [id]", "Equips the carry item, if no provided, opens a dialog with all items."]
                        },
                        {
                            id: ":floor",
                            values: [":floor", "Opens the floorplan editor."]
                        },
                        {
                            id: ":sit",
                            values: [":sit", "Sits your Habbo down!"]
                        },
                        {
                            id: ":wave",
                            values: [":wave", "Waves to everyone in the room!"]
                        },
                        {
                            id: ":speed",
                            values: [":speed [0-2]", "Sets the room's roller speed, 0 is never moving and 2 is moving instantly."]
                        },
                        {
                            id: ":teleport",
                            values: [":teleport", "Enables teleportation for yourself."]
                        }
                    ]}/>
                </div>
            </DialogContent>
        </Dialog>
    );
}

import Dialog from "../../../../Common/Dialog/Dialog";
import DialogContent from "../../../../Common/Dialog/Components/DialogContent";
import DialogTable from "../../../../Common/Dialog/Components/Table/DialogTable";
import { useTranslation } from "react-i18next";

export type RoomChatCommandsDialogProps = {
    hidden?: boolean;
    onClose?: () => void;
}

export default function RoomChatCommandsDialog({ hidden, onClose }: RoomChatCommandsDialogProps) {
    const [getTranslation] = useTranslation("room");
    return (
        <Dialog title={getTranslation("chat.commands.title")} hidden={hidden} onClose={onClose} width={420} height={280} initialPosition="center">
            <DialogContent>
                <div style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                }}>
                    <DialogTable flex={[1, 3]} columns={[getTranslation("chat.commands.command"), getTranslation("chat.commands.description")]} items={[
                        {
                            id: ":commands",
                            values: [":commands", getTranslation("chat.commands.commands")]
                        },
                        {
                            id: ":furni",
                            values: [":furni", getTranslation("chat.commands.furni")]
                        },
                        {
                            id: ":dance",
                            values: [":dance [0-4]", getTranslation("chat.commands.dance")]
                        },
                        {
                            id: ":enable",
                            values: [":enable [id]", getTranslation("chat.commands.enable")]
                        },
                        {
                            id: ":carry",
                            values: [":carry [id]", getTranslation("chat.commands.carry")]
                        },
                        {
                            id: ":sign",
                            values: [":sign [id]", getTranslation("chat.commands.sign")]
                        },
                        {
                            id: ":floor",
                            values: [":floor", getTranslation("chat.commands.floor")]
                        },
                        {
                            id: ":sit",
                            values: [":sit", getTranslation("chat.commands.sit")]
                        },
                        {
                            id: ":stand",
                            values: [":stand", getTranslation("chat.commands.stand")]
                        },
                        {
                            id: ":wave",
                            values: [":wave", getTranslation("chat.commands.wave")]
                        },
                        {
                            id: ":speed",
                            values: [":speed [0-2]", getTranslation("chat.commands.speed")]
                        },
                        {
                            id: ":teleport",
                            values: [":teleport", getTranslation("chat.commands.teleport")]
                        },
                        {
                            id: ":pickall",
                            values: [":pickall", getTranslation("chat.commands.pickall")]
                        }
                    ]}/>
                </div>
            </DialogContent>
        </Dialog>
    );
}

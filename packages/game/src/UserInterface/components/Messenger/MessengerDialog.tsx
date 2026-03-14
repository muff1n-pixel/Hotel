import { useState } from "react";
import DialogContent from "src/UserInterface/Common/Dialog/Components/DialogContent";
import DialogScrollArea from "src/UserInterface/Common/Dialog/Components/Scroll/DialogScrollArea";
import Dialog from "src/UserInterface/Common/Dialog/Dialog";
import Input from "src/UserInterface/Common/Form/Components/Input";
import UserLink from "src/UserInterface/Common/Users/UserLink";
import MessengerFigure from "src/UserInterface/Components/Messenger/Components/MessengerFigure";
import MessengerMessage from "src/UserInterface/Components/Messenger/Components/MessengerMessage";
import MessengerStatus from "src/UserInterface/Components/Messenger/Components/MessengerStatus";
import { useUser } from "src/UserInterface/Hooks/useUser";

export type MessengerDialogProps = {
    hidden?: boolean;
    onClose?: () => void;
}

export default function MessengerDialog({ hidden, onClose }: MessengerDialogProps) {
    const user = useUser();

    const [message, setMessage] = useState("");

    return (
        <Dialog title={
            (<UserLink id={user.id} name={user.name}/>)
        } hidden={hidden} initialPosition="center" onClose={onClose} width={280} height={380} style={{
            overflow: "visible"
        }}>
            <DialogContent style={{
                padding: 0,

                gap: 5
            }}>
                <div style={{
                    background: "rgba(0, 0, 0, .05)",
                    borderBottom: "1px solid rgba(0, 0, 0, .05)",
                    
                    padding: 6,

                    display: "flex",
                    flexDirection: "column",
                    gap: 5
                }}>
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 5
                    }}>
                        <MessengerFigure figureConfiguration={user.figureConfiguration}/>
                    </div>
                </div>

                <div style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: 5,
                    padding: "5px"
                }}>

                    <DialogScrollArea hideInactive style={{ gap: 5 }} contentStyle={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 5
                    }}>
                        <MessengerMessage side={"right"} name={user.name} figureConfiguration={user.figureConfiguration} messages={["hey! how are u?", "i haven't seen you in a while"]}/>
                        <MessengerMessage side={"left"} name={user.name} figureConfiguration={user.figureConfiguration} messages={["i am ok!", "how are you?"]}/>

                        <MessengerStatus>Your friend went offline</MessengerStatus>
                    </DialogScrollArea>

                    <Input placeholder="Type your message..." value={message} onChange={setMessage}/>
                </div>
            </DialogContent>
        </Dialog>
    );
}

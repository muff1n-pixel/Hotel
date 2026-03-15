import { SendUserFriendMessageData } from "@pixel63/events";
import { useCallback, useEffect, useState } from "react";
import { clientInstance, webSocketClient } from "src";
import DialogContent from "src/UserInterface/Common/Dialog/Components/DialogContent";
import DialogScrollArea from "src/UserInterface/Common/Dialog/Components/Scroll/DialogScrollArea";
import Dialog from "src/UserInterface/Common/Dialog/Dialog";
import Input from "src/UserInterface/Common/Form/Components/Input";
import UserLink from "src/UserInterface/Common/Users/UserLink";
import MessengerFigure from "src/UserInterface/Components/Messenger/Components/MessengerFigure";
import MessengerMessage from "src/UserInterface/Components/Messenger/Components/MessengerMessage";
import MessengerStatus from "src/UserInterface/Components/Messenger/Components/MessengerStatus";
import { MessengerTab } from "src/UserInterface/Components/Messenger/Interfaces/MessengerTab";
import useFriends from "src/UserInterface/Hooks/useFriends";
import { useMessenger } from "src/UserInterface/Hooks/useMessenger";
import { useMessengerUnread } from "src/UserInterface/Hooks/useMessengerUnread";
import { useUser } from "src/UserInterface/Hooks/useUser";

export type MessengerDialogProps = {
    hidden?: boolean;
    data?: {
        friendId?: string;
    };
    onClose?: () => void;
}

export default function MessengerDialog({ hidden, data, onClose }: MessengerDialogProps) {
    const user = useUser();
    const messenger = useMessenger();
    const messengerUnread = useMessengerUnread();
    const { friends } = useFriends();

    const [activeTab, setActiveTab] = useState<MessengerTab | null>(null);
    const [activeFriendId, setActiveFriendId] = useState<string | null>(data?.friendId ?? null);
    const [message, setMessage] = useState("");

    useEffect(() => {
        if(!data?.friendId) {
            return;
        }

        if(messenger.some((tab) => tab.friend.id === data.friendId)) {
            setActiveFriendId(data.friendId);

            return;
        }

        const friend = friends?.find((friend) => friend.id === data.friendId);

        if(!friend) {
            return;
        }

        clientInstance.messenger.value!.push({
            friend,
            entries: []
        });

        clientInstance.messenger.update();

        setActiveFriendId(data.friendId);
    }, [data, friends]);

    useEffect(() => {
        if(activeFriendId) {
            setActiveTab(messenger.find((tab) => tab.friend.id === activeFriendId) ?? null);
        }
        else {
            setActiveTab(messenger[0] ?? null);
            setActiveFriendId(messenger[0]?.friend?.id ?? null);
        }
    }, [messenger, activeFriendId]);

    useEffect(() => {
        if(messengerUnread) {
            clientInstance.messengerUnread.value = false;
        }
    }, [messengerUnread]);

    const handleSubmit = useCallback((value: string) => {
        if(!activeTab) {
            return;
        }

        if(!activeTab.friend.online) {
            return;
        }

        webSocketClient.sendProtobuff(SendUserFriendMessageData, SendUserFriendMessageData.create({
            userId: activeTab.friend.id,
            message: value
        }));

        setMessage("");
    }, [activeTab]);

    if(!activeTab) {
        return null;
    }

    return (
        <Dialog title={(<UserLink id={activeTab.friend.id} name={activeTab.friend.name}/>)} hidden={hidden} initialPosition="center" onClose={onClose} width={280} height={380} style={{
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
                        {messenger.map((tab, index) => (
                            <MessengerFigure
                                key={tab.friend.id}
                                figureConfiguration={tab.friend.figureConfiguration}
                                onClick={() => setActiveFriendId(tab.friend.id)}
                                onClose={() => {
                                    clientInstance.messenger.value?.splice(index, 1);
                                    clientInstance.messenger.update();

                                    if(activeFriendId === tab.friend.id) {
                                        setActiveTab(null);
                                        setActiveFriendId(null);
                                    }
                                }}/>
                        ))}
                    </div>
                </div>

                <div style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: 5,
                    padding: "5px"
                }}>
                    <DialogScrollArea hideInactive style={{ gap: 5 }} reversed contentStyle={{
                        display: "flex",
                        flexDirection: "column-reverse",
                        gap: 5
                    }}>
                        {activeTab.entries.toReversed().map((entry) => {
                            if(entry.type === "message") {
                                return (
                                    <MessengerMessage
                                        key={entry.id}
                                        side={(entry.userId === user.id)?("left"):("right")}
                                        name={(entry.userId === user.id)?(user.name):(activeTab.friend.name)}
                                        figureConfiguration={(entry.userId === user.id)?(user.figureConfiguration):(activeTab.friend.figureConfiguration)}
                                        messages={entry.message}
                                        receivedAt={entry.receivedAt}/>);
                            }

                            if(entry.type === "status") {
                                return (
                                    <MessengerStatus key={entry.id}>
                                        {entry.status}
                                    </MessengerStatus>
                                );
                            }

                            return null;
                        })}

                        <MessengerStatus>This is the start of your conversation</MessengerStatus>
                    </DialogScrollArea>

                    <Input readonly={!activeTab.friend.online} placeholder="Type your message..." value={message} onChange={setMessage} onSubmit={handleSubmit}/>
                </div>
            </DialogContent>
        </Dialog>
    );
}

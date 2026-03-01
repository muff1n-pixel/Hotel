import { UserBotData } from "@Shared/Interfaces/Room/RoomBotData";
import { useBotSpeech } from "../../hooks/Bots/useBotSpeech";
import Dialog from "../Dialog/Dialog";
import DialogContent from "../Dialog/DialogContent";
import DialogTable from "../Dialog/Table/DialogTable";
import { useCallback, useEffect, useState } from "react";
import Input from "../Form/Input";
import Checkbox from "../Form/Checkbox";
import DialogButton from "../Dialog/Button/DialogButton";
import { webSocketClient } from "../../..";
import { useDialogs } from "../../hooks/useDialogs";
import { UpdateRoomBotData } from "@pixel63/events";

export type BotSpeechDialogProps = {
    data: UserBotData;
    hidden?: boolean;
    onClose?: () => void;
}

export default function BotSpeechDialog({ data, hidden, onClose }: BotSpeechDialogProps) {
    const dialogs = useDialogs();
    const botSpeech = useBotSpeech(data.id);

    const [automaticChat, setAutomaticChat] = useState(false);
    const [automaticChatDelay, setAutomaticChatDelay] = useState<number>(0);
    const [randomizeMessages, setRandomizeMessages] = useState(false);

    const [messages, setMessages] = useState<string[]>([]);

    const [message, setMessage] = useState<string>("");
    const [activeMessageIndex, setActiveMessageIndex] = useState<number | null>(null);

    useEffect(() => {
        if(botSpeech) {
            setMessages(botSpeech.messages);

            setAutomaticChat(botSpeech.automaticChat);
            setAutomaticChatDelay(botSpeech.automaticChatDelay);
            setRandomizeMessages(botSpeech.randomizeMessages);
        }
    }, [botSpeech]);

    const handleAddMessage = useCallback(() => {
        const mutatedMessages = [...messages];
        mutatedMessages.push("");
        setMessages(mutatedMessages);
        
        setMessage("");
        setActiveMessageIndex(mutatedMessages.length - 1);
    }, [messages]);

    const handleApply = useCallback(() => {
        webSocketClient.sendProtobuff(UpdateRoomBotData, UpdateRoomBotData.create({
            id: data.id,

            speech: {
                automaticChat,
                automaticChatDelay,
                randomizeMessages,
                messages: messages.filter((message) => message.length > 0)
            }
        }));

        dialogs.closeDialog("bot-speech");
    }, [data, dialogs, automaticChat, automaticChatDelay, randomizeMessages, messages]);

    if(!botSpeech) {
        return null;
    }

    return (
        <Dialog title="Setup bot speech" hidden={hidden} onClose={onClose} width={430} height={380} initialPosition="center">
            <DialogContent style={{
                display: "flex",
                flexDirection: "column",
                gap: 10
            }}>
                <Input readonly={activeMessageIndex === null} placeholder={(activeMessageIndex === null)?("Add or select a message"):("Message...")} maxLength={128} value={message} onChange={(value) => {
                    if(activeMessageIndex === null) {
                        return;
                    }

                    setMessage(value);

                    const mutatedMessages = [...messages];
                    mutatedMessages[activeMessageIndex] = value;
                    setMessages(mutatedMessages);
                }}/>

                <DialogTable activeId={activeMessageIndex?.toString()} columns={["Message"]} items={messages.map((message, index) => {
                    return {
                        id: index.toString(),
                        values: [
                            (message.length)?(message):(<i style={{ opacity: 0.5 }}>New message</i>)
                        ],
                        tools: (
                            <div>
                                <div className="sprite_remove" style={{
                                    cursor: "pointer"
                                }} onClick={() => {
                                    if(activeMessageIndex === index) {
                                        setActiveMessageIndex(null);
                                        setMessage("");
                                    }

                                    const mutatedMessages = [...messages];
                                    mutatedMessages.splice(index, 1); 
                                    setMessages(mutatedMessages);
                                }}/>
                            </div>
                        ),
                        onClick: () => {
                            setActiveMessageIndex(index);
                            setMessage(message);
                        }
                    };
                })} tools={(messages.length < 30) && (
                    <div key={JSON.stringify(messages)} className="sprite_add" style={{
                        cursor: "pointer"
                    }} onClick={handleAddMessage}/>
                )}/>

                <Checkbox value={automaticChat} onChange={setAutomaticChat} label="Bot talks automatically"/>

                <Checkbox value={randomizeMessages} onChange={setRandomizeMessages} label="Messages are randomized"/>

                <b>Automatic chat delay (seconds)</b>

                <Input type="number" min={10} max={60 * 5} value={automaticChatDelay.toString()} onChange={(value) => setAutomaticChatDelay(parseInt(value))}/>

                <div style={{
                    display: "flex",
                    justifyContent: "flex-end"
                }}>
                    <DialogButton onClick={handleApply}>Apply changes</DialogButton>
                </div>
            </DialogContent>
        </Dialog>
    );
}

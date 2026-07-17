import { GroupIdentityData } from "@pixel63/events";
import DialogLink from "@UserInterface/Common/Dialog/Components/Link/DialogLink";
import Input from "@UserInterface/Common/Form/Components/Input";
import Selection from "@UserInterface/Common/Form/Components/Selection";
import TextArea from "@UserInterface/Common/Form/Components/TextArea";
import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";
import { useDialogs } from "@UserInterface/Hooks/useDialogs";
import { useUser } from "@UserInterface/Hooks/useUser";
import { useUserRooms } from "@UserInterface/Hooks/useUserRooms";
import { useEffect } from "react";

export type RoomGroupCreationIdentityStepProps = {
    data?: GroupIdentityData;
    onChange: (data: GroupIdentityData) => void;
}

export default function RoomGroupCreationIdentityStep({ data, onChange }: RoomGroupCreationIdentityStepProps) {
    const user = useUser();
    const dialogs = useDialogs();
    const userRooms = useUserRooms();

    return (
        <FlexLayout flex={1}>
            <b>Name of your group:</b>

            <Input placeholder={`${user.name}'s group`} value={data?.name} onChange={(name) => onChange(GroupIdentityData.create({ ...data, name}))}/>
            
            <b>Description of your group:</b>

            <TextArea placeholder={'Where all the cool kids hang!'} value={data?.description ?? ''} onChange={(description) => onChange(GroupIdentityData.create({ ...data, description}))} style={{ height: 60 }}/>

            <b>Choose a homeroom for your Group:</b>

            <i>Choose your Groups homeroom carefully, the homeroom cannot be changed later.</i>

            <Selection value={data?.homeroomId} items={userRooms.map((room) => {
                return {
                    label: (room.groupId)?(
                        <FlexLayout direction="row" align="center">
                            <div className="sprite_groups_icon"/>

                            {room.name}
                        </FlexLayout>
                    ):(
                        room.name
                    ),
                    value: room.id,
                    disabled: Boolean(room.groupId)
                }
            })} onChange={(homeroomId) => onChange(GroupIdentityData.create({ ...data, homeroomId }))}/>

            <DialogLink onClick={() => dialogs.addUniqueDialog("room-creation")}>No suitable room found? Click here to create a new one!</DialogLink>
        </FlexLayout>
    );
}
import { GroupIdentityData } from "@pixel63/events";
import DialogLink from "@UserInterface/Common/Dialog/Components/Link/DialogLink";
import Input from "@UserInterface/Common/Form/Components/Input";
import Selection from "@UserInterface/Common/Form/Components/Selection";
import TextArea from "@UserInterface/Common/Form/Components/TextArea";
import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";
import { useDialogs } from "@UserInterface/Hooks/useDialogs";
import { useUser } from "@UserInterface/Hooks/useUser";
import { useUserRooms } from "@UserInterface/Hooks/useUserRooms";
import { useTranslation } from "react-i18next";

export type RoomGroupCreationIdentityStepProps = {
    data?: GroupIdentityData;
    onChange: (data: GroupIdentityData) => void;
}

export default function RoomGroupCreationIdentityStep({ data, onChange }: RoomGroupCreationIdentityStepProps) {
    const [getTranslation] = useTranslation("room");
    const user = useUser();
    const dialogs = useDialogs();
    const userRooms = useUserRooms();

    return (
        <FlexLayout flex={1}>
            <b>{getTranslation("groups.creation.identity.name")}</b>

            <Input placeholder={getTranslation("groups.creation.identity.name_placeholder", { name: user.name })} value={data?.name} onChange={(name) => onChange(GroupIdentityData.create({ ...data, name}))}/>
            
            <b>{getTranslation("groups.creation.identity.description_label")}</b>

            <TextArea placeholder={getTranslation("groups.creation.identity.description_placeholder")} value={data?.description ?? ''} onChange={(description) => onChange(GroupIdentityData.create({ ...data, description}))} style={{ height: 60 }}/>

            <b>{getTranslation("groups.creation.identity.homeroom")}</b>

            <i>{getTranslation("groups.creation.identity.homeroom_hint")}</i>

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

            <DialogLink onClick={() => dialogs.addUniqueDialog("room-creation")}>{getTranslation("groups.creation.identity.create_room")}</DialogLink>
        </FlexLayout>
    );
}
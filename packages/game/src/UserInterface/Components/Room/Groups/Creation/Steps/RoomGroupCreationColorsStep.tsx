import { GroupColorsData } from "@pixel63/events";
import GroupColorEditor from "@UserInterface/Components/Groups/Editor/GroupColorEditor";

export type RoomGroupCreationColorsStepProps = {
    data?: GroupColorsData;
    onChange: (data: GroupColorsData) => void;
}

export default function RoomGroupCreationColorsStep({ data, onChange }: RoomGroupCreationColorsStepProps) {
    return (
        <GroupColorEditor data={data} onChange={onChange}/>
    );
}
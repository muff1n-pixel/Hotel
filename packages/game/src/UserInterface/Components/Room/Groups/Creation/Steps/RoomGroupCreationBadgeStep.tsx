import { GroupBadgeData } from "@pixel63/events";
import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";
import GroupBadgeEditor from "@UserInterface/Components/Groups/Editor/GroupBadgeEditor";
import GroupBadgeImage from "@UserInterface/Components/Groups/GroupBadgeImage";

export type RoomGroupCreationBadgeStepProps = {
    data?: GroupBadgeData;
    onChange: (data: GroupBadgeData) => void;
}

export default function RoomGroupCreationBadgeStep({ data, onChange }: RoomGroupCreationBadgeStepProps) {
    return (
        <GroupBadgeEditor data={data} onChange={onChange}/>
    );
}
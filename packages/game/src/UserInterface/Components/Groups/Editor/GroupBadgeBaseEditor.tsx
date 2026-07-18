import { GroupBadgeData } from "@pixel63/events";
import { GroupBadgeBaseData } from "@pixel63/events/build/Groups/GroupBadgeData";
import DialogButton from "@UserInterface/Common/Dialog/Components/Button/DialogButton";
import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";
import GroupBadgeColor from "@UserInterface/Components/Groups/Editor/GroupBadgeColor";
import GroupBadgeImage from "@UserInterface/Components/Groups/GroupBadgeImage";

export type GroupBadgeBaseEditorProps = {
    data?: GroupBadgeBaseData;
    onChange: (data: GroupBadgeBaseData) => void;
    onBaseChange: () => void;
};

export default function GroupBadgeBaseEditor({ data, onChange, onBaseChange }: GroupBadgeBaseEditorProps) {
    return (
        <FlexLayout direction="row" justify="space-between" style={{
            background: "#BDBAA2",
            borderRadius: 3,
            padding: 3,
        }}>
            <div style={{ flex: 1 }}>
                <DialogButton style={{
                    aspectRatio: 1,
                    height: 44,
                }} contentStyle={{
                    padding: 0,
                    overflow: "visible"
                }} onClick={onBaseChange}>
                    <GroupBadgeImage data={GroupBadgeData.create({
                        base: data
                    })}/>
                </DialogButton>
            </div>

            <div style={{ flex: 1 }}/>

            <b style={{ flex: 2 }}>
                <GroupBadgeColor color={data?.color} onChange={(color) => onChange(GroupBadgeBaseData.create({
                    ...data,
                    color
                }))}/>
            </b>
        </FlexLayout>
    );
}

export const groupBadgeBases = [
    "badgepart_base_advanced_1",
    "badgepart_base_advanced_2",
    "badgepart_base_advanced_3",
    "badgepart_base_advanced_4",
    "badgepart_base_basic_1",
    "badgepart_base_basic_2",
    "badgepart_base_basic_3",
    "badgepart_base_basic_4",
    "badgepart_base_basic_5",
    "badgepart_base_beams_part1",
    "badgepart_base_beams_part2",
    "badgepart_base_book",
    "badgepart_base_circles_1",
    "badgepart_base_circles_2",
    "badgepart_base_egg",
    "badgepart_base_gold_1_part1",
    "badgepart_base_gold_1_part2",
    "badgepart_base_gold_2_part1",
    "badgepart_base_gold_2_part2",
    "badgepart_base_gradient_1",
    "badgepart_base_gradient_2",
    "badgepart_base_misc_1_part1",
    "badgepart_base_misc_1_part2",
    "badgepart_base_misc_2",
    "badgepart_base_ornament",
    "badgepart_base_ornament_1_part1",
    "badgepart_base_ornament_1_part2",
    "badgepart_base_ornament_2_part1",
    "badgepart_base_ornament_2_part2",
    "badgepart_base_pin_part1",
    "badgepart_base_pin_part2"
];

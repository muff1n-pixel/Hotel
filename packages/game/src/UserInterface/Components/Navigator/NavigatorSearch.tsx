import Input from "@UserInterface/Common/Form/Components/Input";
import Selection from "@UserInterface/Common/Form/Components/Selection";
import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";

export type NavigatorSearchProps = {
    filter?: string;
    onFilterChange: (value: string | undefined) => void;

    search?: string;
    onSearchChange: (value: string) => void;
}

export default function NavigatorSearch({ filter, onFilterChange, search, onSearchChange }: NavigatorSearchProps) {
    return (
        <FlexLayout direction="row" gap={5}>
            <Selection value={filter} onChange={onFilterChange} items={[
                {
                    value: undefined,
                    label: "Anything"
                },
                {
                    value: "name",
                    label: "Room name"
                },
                {
                    value: "owner",
                    label: "Owner"
                },
                {
                    value: "group",
                    label: "Group"
                }
            ]} style={{ width: 100 }}/>

            <div style={{
                flex: 1
            }}>
                <Input placeholder="Search for a room name..." value={search} onChange={onSearchChange}>
                    <div className="sprite_room_user_motto_pen"/>
                </Input>
            </div>
        </FlexLayout>
    );
}
import Input from "@UserInterface/Common/Form/Components/Input";
import Selection from "@UserInterface/Common/Form/Components/Selection";
import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";
import { useTranslation } from "react-i18next";

export type NavigatorSearchProps = {
    filter?: string;
    onFilterChange: (value: string | undefined) => void;

    search?: string;
    onSearchChange: (value: string) => void;
}

export default function NavigatorSearch({ filter, onFilterChange, search, onSearchChange }: NavigatorSearchProps) {
    const [getTranslation] = useTranslation("navigator");

    return (
        <FlexLayout direction="row" gap={5}>
            <Selection value={filter} onChange={onFilterChange} items={[
                {
                    value: undefined,
                    label: getTranslation("search.anything")
                },
                {
                    value: "name",
                    label: getTranslation("search.room_name")
                },
                {
                    value: "owner",
                    label: getTranslation("search.owner")
                },
                {
                    value: "group",
                    label: getTranslation("search.group")
                }
            ]} style={{ width: 100 }}/>

            <div style={{
                flex: 1
            }}>
                <Input placeholder={getTranslation("search.placeholder")} value={search} onChange={onSearchChange}>
                    <div className="sprite_room_user_motto_pen"/>
                </Input>
            </div>
        </FlexLayout>
    );
}
import type { Meta, StoryObj } from "@storybook/react-vite";
import WiredDialog, { WiredDialogProps } from "./WiredDialog";
import WiredFurniture from "@UserInterface/Common/Dialog/Layouts/Wired/WiredFurniture";
import { FurnitureData, UserFurnitureData } from "@pixel63/events";
import WiredDivider from "@UserInterface/Common/Dialog/Layouts/Wired/WiredDivider";
import { Fragment } from "react/jsx-runtime";
import WiredSection from "@UserInterface/Common/Dialog/Layouts/Wired/WiredSection";
import WiredCheckbox from "@UserInterface/Common/Dialog/Layouts/Wired/WiredCheckbox";
import WiredDelay from "@UserInterface/Common/Dialog/Layouts/Wired/WiredDelay";
import WiredRadio from "@UserInterface/Common/Dialog/Layouts/Wired/WiredRadio";
import WiredButton from "@UserInterface/Common/Dialog/Layouts/Wired/WiredButton";
import WiredInput from "@UserInterface/Common/Dialog/Layouts/Wired/WiredInput";
import WiredFurniturePicker from "@UserInterface/Common/Dialog/Layouts/Wired/WiredFurniturePicker";
import WiredFurnitureSource from "@UserInterface/Common/Dialog/Layouts/Wired/WiredFurnitureSource";
import { useTranslation } from "react-i18next";

function WiredDialogStoryContent() {
    const [getTranslation] = useTranslation("wired");

    return (
        <Fragment>
            <WiredFurniture furniture={FurnitureData.create({
                type: "wf_trg",
                name: "Wired Trigger: Lorem ipsum"
            })}/>

            <WiredDivider/>

            <WiredSection>
                <b>{getTranslation("creator.story_input")}</b>

                <WiredInput value="" onChange={() => {}}/>
            </WiredSection>

            <WiredDivider/>

            <WiredSection>
                <b>{getTranslation("creator.story_checkboxes")}</b>

                <WiredCheckbox label={getTranslation("creator.story_checkbox")} value={false} onChange={() => {}}/>
            </WiredSection>

            <WiredDivider/>

            <WiredSection>
                <b>{getTranslation("creator.story_radio")}</b>

                <WiredRadio value={1} items={[
                    {
                        value: 1,
                        label: getTranslation("creator.story_item_one")
                    },
                    {
                        value: 2,
                        label: getTranslation("creator.story_item_two")
                    }
                ]} onChange={() => {}}/>
            </WiredSection>

            <WiredDivider/>

            <WiredDelay value={0} onChange={() => {}}/>

            <WiredDivider/>

            <WiredFurniturePicker maxFurniture={5} value={[]} onChange={() => {}}/>

            <WiredFurnitureSource value="list" onChange={() => {}} furnitureIds={[]} maxFurniture={5}/>

            <WiredDivider/>

            <WiredSection style={{ flexDirection: "row" }}>
                <WiredButton onClick={() => {}}>{getTranslation("creator.apply")}</WiredButton>
                <WiredButton onClick={() => {}}>{getTranslation("creator.cancel")}</WiredButton>
            </WiredSection>
        </Fragment>
    );
}

export default {
    component: WiredDialog
} satisfies Meta;

export const Default = {
    args: {
        children: <WiredDialogStoryContent />,
        initialPosition: "center"
    } satisfies WiredDialogProps,
} satisfies StoryObj;

export const Withfurniture = {
    args: {
        children: (
            <WiredFurniture furniture={UserFurnitureData.create({
                furniture: FurnitureData.create({
                    type: "wf_trg",
                    name: "Wired Trigger: Lorem ipsum"
                })
            })}/>
        ),
        initialPosition: "center"
    } satisfies WiredDialogProps,
} satisfies StoryObj;

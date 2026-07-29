import DialogLink from "@UserInterface/Common/Dialog/Components/Link/DialogLink";
import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";
import WidgetGamePanel from "@UserInterface/Common/Widgets/WidgetGamePanel";
import { useDialogs } from "@UserInterface/Hooks/useDialogs";
import { useTranslation } from "react-i18next";

export type WidgetSettingsProps = {
    settingsExpanded: boolean;
    onSettingsExpanded: (expanded: boolean) => void;
}

export default function WidgetSettings({ settingsExpanded, onSettingsExpanded }: WidgetSettingsProps) {
    const [getTranslation] = useTranslation("widget");

    const { openUniqueDialog } = useDialogs();

    if(!settingsExpanded) {
        return null;
    }

    return (
        <WidgetGamePanel title={getTranslation("settings.title")}>
            <FlexLayout direction="column">
                <DialogLink onClick={() => {
                    onSettingsExpanded(false);

                    openUniqueDialog("audio-settings");
                }}>
                    {getTranslation("settings.audio_settings")}
                </DialogLink>
                
                <DialogLink onClick={() => {
                    onSettingsExpanded(false);

                    openUniqueDialog("game-settings");
                }}>
                    {getTranslation("settings.game_settings")}
                </DialogLink>
            </FlexLayout>
        </WidgetGamePanel>
    );
}
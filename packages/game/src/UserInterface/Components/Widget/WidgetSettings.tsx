import DialogLink from "@UserInterface/Common/Dialog/Components/Link/DialogLink";
import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";
import WidgetPanel from "@UserInterface/Common/Widgets/WidgetPanel";
import { useDialogs } from "@UserInterface/Hooks/useDialogs";

export type WidgetSettingsProps = {
    settingsExpanded: boolean;
    onSettingsExpanded: (expanded: boolean) => void;
}

export default function WidgetSettings({ settingsExpanded, onSettingsExpanded }: WidgetSettingsProps) {
    const { openUniqueDialog } = useDialogs();

    if(!settingsExpanded) {
        return null;
    }

    return (
        <WidgetPanel title="Settings">
            <FlexLayout direction="column">
                <DialogLink onClick={() => {
                    onSettingsExpanded(false);

                    openUniqueDialog("audio-settings");
                }}>
                    Audio Settings
                </DialogLink>
                
                <DialogLink onClick={() => {
                    onSettingsExpanded(false);

                    openUniqueDialog("game-settings");
                }}>
                    Game Settings
                </DialogLink>
            </FlexLayout>
        </WidgetPanel>
    );
}
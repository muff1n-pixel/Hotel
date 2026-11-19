import DialogButton from "@UserInterface/Common/Dialog/Components/Button/DialogButton";
import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";
import { useDialogs } from "@UserInterface/Hooks/useDialogs";
import { useHotel } from "@UserInterface/Hooks/useHotel";
import { useTranslation } from "react-i18next";

export default function AdministrationOverviewTab() {
    const dialogs = useDialogs();
    const hotel = useHotel();
    const [getTranslation] = useTranslation("administration");

    return (
        <FlexLayout flex={1} direction="row">
            {(hotel?.users !== undefined) && (
                <div>
                    {getTranslation("overview.users", { count: hotel.users })}
                </div>
            )}

            <FlexLayout direction="row" justify="flex-end" align="flex-end">
                <DialogButton onClick={() => dialogs.addUniqueDialog("furniture-browser")}>{getTranslation("overview.furniture_browser")}</DialogButton>
                <DialogButton onClick={() => dialogs.addUniqueDialog("pet-browser")}>{getTranslation("overview.pet_browser")}</DialogButton>
                <DialogButton onClick={() => dialogs.addUniqueDialog("badge-browser")}>{getTranslation("overview.badge_browser")}</DialogButton>
            </FlexLayout>
        </FlexLayout>
    );
}

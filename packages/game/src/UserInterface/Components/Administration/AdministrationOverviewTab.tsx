import DialogButton from "@UserInterface/Common/Dialog/Components/Button/DialogButton";
import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";
import { useDialogs } from "@UserInterface/Hooks/useDialogs";
import { useHotel } from "@UserInterface/Hooks/useHotel";

export default function AdministrationOverviewTab() {
    const dialogs = useDialogs();
    const hotel = useHotel();

    return (
        <FlexLayout flex={1} direction="row">
            {(hotel?.users !== undefined) && (
                <div>
                    {hotel.users} {(hotel.users !== 1)?("users"):("user")} online
                </div>
            )}

            <FlexLayout direction="row" justify="flex-end" align="flex-end">
                <DialogButton onClick={() => dialogs.addUniqueDialog("furniture-browser")}>Furniture Browser</DialogButton>
                <DialogButton onClick={() => dialogs.addUniqueDialog("pet-browser")}>Pet Browser</DialogButton>
                <DialogButton onClick={() => dialogs.addUniqueDialog("badge-browser")}>Badge Browser</DialogButton>
            </FlexLayout>
        </FlexLayout>
    );
}

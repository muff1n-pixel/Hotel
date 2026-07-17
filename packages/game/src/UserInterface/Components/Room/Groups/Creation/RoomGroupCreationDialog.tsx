import Dialog from "../../../../Common/Dialog/Dialog";
import DialogContent from "../../../../Common/Dialog/Components/DialogContent";
import DialogStepsContent from "@UserInterface/Common/Dialog/Components/Step/DialogStepsContent";
import { Fragment, useCallback, useState } from "react";
import RoomGroupCreationIdentityStep from "@UserInterface/Components/Room/Groups/Creation/Steps/RoomGroupCreationIdentityStep";
import { useRoomInstance } from "@UserInterface/Hooks/useRoomInstance";
import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";
import DialogLink from "@UserInterface/Common/Dialog/Components/Link/DialogLink";
import DialogButton from "@UserInterface/Common/Dialog/Components/Button/DialogButton";
import RoomGroupCreationBadgeStep from "@UserInterface/Components/Room/Groups/Creation/Steps/RoomGroupCreationBadgeStep";
import { GroupBadgeData, GroupColorsData, ShopPageData, GroupIdentityData } from "@pixel63/events";
import RoomGroupCreationColorsStep from "@UserInterface/Components/Room/Groups/Creation/Steps/RoomGroupCreationColorsStep";
import RoomGroupCreationFinalStep from "@UserInterface/Components/Room/Groups/Creation/Steps/RoomGroupCreationFinalStep";
import { usePermissionAction } from "@UserInterface/Hooks/usePermissionAction";
import { useUser } from "@UserInterface/Hooks/useUser";

export type RoomGroupCreationDialogProps = {
    data?: {
        page: ShopPageData;
    };

    hidden?: boolean;
    onClose?: () => void;
}

export default function RoomGroupCreationDialog({ data, hidden, onClose }: RoomGroupCreationDialogProps) {
    const user = useUser();
    const hasEditShopPermission = usePermissionAction("shop:edit");
    const roomInstance = useRoomInstance();

    const [currentStep, setCurrentStep] = useState(0);

    const [identityData, setIdentityData] = useState<GroupIdentityData>(GroupIdentityData.create({
        name: `${user.name}'s group`,
        homeroomId: (roomInstance?.isOwner)?(roomInstance.information?.id):(undefined)
    }));

    const [badgeData, setBadgeData] = useState<GroupBadgeData>();
    const [colorsData, setColorsData] = useState<GroupColorsData>();
    
    const [editMode, setEditMode] = useState(false);

    const onEditClick = useCallback(() => {
        setEditMode(!editMode);
    }, [editMode]);

    if(!data?.page) {
        return null;
    }

    return (
        <Dialog title="Room Group Creation" editMode={editMode} onEditClick={hasEditShopPermission && onEditClick} hidden={hidden} onClose={onClose} initialPosition="center" width={400} height={520} style={{
            overflow: "visible"
        }}>
            <DialogStepsContent
                currentStepIndex={currentStep}
                steps={[
                    {
                        label: (
                            <b>Step 1</b>
                        ),
                        title: "Group identity",
                        description: "Describe your group here",
                        image: <div className="sprite_room_groups_step_1"/>
                    },
                    {
                        label: (
                            <b>Step 2</b>
                        ),
                        title: "Group badge",
                        description: "Wear it with pride! :)",
                        image: <div className="sprite_room_groups_step_2"/>
                    },
                    {
                        label: (
                            <b>Step 3</b>
                        ),
                        title: "Group colors",
                        description: "You can personalize your group furniture with these colors",
                        image: <div className="sprite_room_groups_step_3"/>
                    },
                    {
                        label: (
                            <Fragment>
                                <b>Buy group</b>

                                <div className="sprite_currencies_credits"/>
                            </Fragment>
                        ),
                        title: "Ready to go",
                        description: "All set! You can now purchase your group",
                        image: <div className="sprite_room_groups_step_4"/>
                    }
                ]}
                />

            <DialogContent style={{ gap: 10 }}>
                {
                    (() => {
                        switch(currentStep) {
                            case 0: {
                                return (<RoomGroupCreationIdentityStep data={identityData} onChange={setIdentityData}/>);
                            }
                            
                            case 1: {
                                return (<RoomGroupCreationBadgeStep data={badgeData} onChange={setBadgeData}/>);
                            }
                            
                            case 2: {
                                return (<RoomGroupCreationColorsStep data={colorsData} onChange={setColorsData}/>);
                            }
                            
                            case 3: {
                                return (<RoomGroupCreationFinalStep editMode={editMode} page={data.page} identityData={identityData} badgeData={badgeData} colorsData={colorsData} goBack={() => setCurrentStep(currentStep - 1)}/>);
                            }
                        }
                    })()
                }

                {(currentStep !== 3) && (
                    <FlexLayout direction="row" align="center" justify="space-between">
                        <DialogLink onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}>Go back</DialogLink>

                        <DialogButton onClick={() => setCurrentStep(Math.min(currentStep + 1, 3))}>Next step</DialogButton>
                    </FlexLayout>
                )}
            </DialogContent>
        </Dialog>
    );
}

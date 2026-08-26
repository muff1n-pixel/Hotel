import { HotelActivityRewardData } from "@pixel63/events/build/Client/Hotel/ActivityRewards/HotelActivityRewardsData";
import DialogButton from "@UserInterface/Common/Dialog/Components/Button/DialogButton";
import DialogTable from "@UserInterface/Common/Dialog/Components/Table/DialogTable";
import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";
import { useHotelActivityRewards } from "@UserInterface/Hooks/Hotel/ActivityRewards/useHotelActivityRewards";
import { useDialogs } from "@UserInterface/Hooks/useDialogs";
import { Fragment, useEffect, useState } from "react";

export default function AdministrationActivityRewardsTab() {
    const dialogs = useDialogs();
    const activityRewards = useHotelActivityRewards();

    const [activeActivityReward, setActiveActivityReward] = useState<HotelActivityRewardData>();

    useEffect(() => {
        if(activeActivityReward && !activityRewards?.includes(activeActivityReward)) {
            setActiveActivityReward(undefined);
        }
    }, [activityRewards]);

    return (
        <FlexLayout flex={1} direction="column">
            <b>Activity rewards</b>

            <p>Users are rewarded for their activity by being online for the amount of seconds defined in each reward.</p>

            <DialogTable
                activeId={activeActivityReward?.id}
                columns={["Interval", "Credits", "Duckets", "Diamonds"]}
                items={activityRewards?.map((activityReward) => ({
                    id: activityReward.id,
                    values: [activityReward.interval, activityReward.credits, activityReward.duckets, activityReward.diamonds],
                    onClick: () => setActiveActivityReward(activityReward),
                    tools: (
                        <div className="sprite_room_user_motto_pen" style={{
                            cursor: "pointer"
                        }} onClick={() => dialogs.addUniqueDialog("edit-hotel-activity-reward", { activityReward })}/>
                    ),
                }))}
                />
                            
            <FlexLayout direction="row">
                {(activeActivityReward) && (
                    <FlexLayout justify="center" align="center" style={{ fontSize: 12 }}>
                        Awards every {(activeActivityReward.interval > 60)?(`${Math.round(activeActivityReward.interval / 60 * 100) / 100} minutes`):(`${activeActivityReward.interval} seconds`)}
                    </FlexLayout>
                )}
                
                <div style={{ flex: 1 }}/>

                <DialogButton onClick={() => dialogs.addUniqueDialog("edit-hotel-activity-reward", {})}>Create a new reward</DialogButton>
            </FlexLayout>
        </FlexLayout>
    );
}

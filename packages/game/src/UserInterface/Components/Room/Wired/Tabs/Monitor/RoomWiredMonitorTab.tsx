import DialogTable from "@UserInterface/Common/Dialog/Components/Table/DialogTable";
import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";
import useRoomWiredMonitor from "@UserInterface/Components/Room/Wired/Tabs/Monitor/Hooks/useRoomWiredMonitor";
import { useTranslation } from "react-i18next";

export default function RoomWiredMonitorTab() {
    const [getCommonTranslation] = useTranslation("common");
    const [getWiredTranslation] = useTranslation("wired");

    const {monitor, handleRefresh} = useRoomWiredMonitor();

    return (
        <FlexLayout flex={1} direction="column">
            <FlexLayout direction="row" align="center">
                <FlexLayout flex={1} direction="column" gap={5}>
                    <FlexLayout direction="row" align="center" justify="space-between">
                        <div><b>{getWiredTranslation("monitor.statistics")}</b></div>

                        <div className="sprite_refresh" onClick={handleRefresh} style={{
                            filter: "invert(1)",
                            cursor: "pointer"
                        }}/>
                    </FlexLayout>

                    <div style={{
                        borderRadius: 6,
                        background: "#D9D9D9",

                        padding: 6,

                        fontSize: "0.9em"
                    }}>
                        <FlexLayout direction="column" gap={6}>
                            <div>{getWiredTranslation("monitor.variables.is_heavy")}: <span style={{ color: "#2B8B2A" }}>{(monitor?.statistics?.heavy)?(getCommonTranslation("yes")):(getCommonTranslation("no"))}</span></div>

                            {monitor?.statistics?.variables.map((variable) => (
                                <div>{getWiredTranslation(`monitor.variables.${variable.type}`)}: <span style={{ color: "#2B8B2A" }}>{variable.value}/{variable.maxValue}</span></div>
                            ))}
                        </FlexLayout>
                    </div>
                </FlexLayout>

                <div>
                    <img src="/assets/dialogs/teasers/wired-teaser.png"/>
                </div>
            </FlexLayout>

            <FlexLayout flex={1} direction="column" gap={5}>
                <div><b>{getWiredTranslation("monitor.logs")}</b></div>

                <DialogTable
                    flex={[2, 1, 1, 2]}
                    columns={[getWiredTranslation("monitor.type"), getWiredTranslation("monitor.category"), getWiredTranslation("monitor.amount"), getWiredTranslation("monitor.latest_occurrence")]}
                    items={monitor?.logs.map((log) => ({
                        id: log.category,
                        values: [
                            log.category,
                            log.level,
                            log.amount,
                            (log.latestOccurrence)?(new Date(log.latestOccurrence).toLocaleTimeString()):('-')
                        ]
                    }))}
                    empty={getWiredTranslation("monitor.no_logs")}
                    />
            </FlexLayout>
        </FlexLayout>
    );
}

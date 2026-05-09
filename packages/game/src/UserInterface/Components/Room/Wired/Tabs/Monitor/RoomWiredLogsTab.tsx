import DialogTable from "@UserInterface/Common/Dialog/Components/Table/DialogTable";
import Input from "@UserInterface/Common/Form/Components/Input";
import Selection from "@UserInterface/Common/Form/Components/Selection";
import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";
import useRoomWiredLogs from "@UserInterface/Components/Room/Wired/Tabs/Monitor/Hooks/useRoomWiredLogs";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function RoomWiredLogsTab() {
    const [getCommonTranslation] = useTranslation("common");
    const [getWiredTranslation] = useTranslation("wired");

    const [page, setPage] = useState(0);
    const [search, setSearch] = useState("");
    const [level, setLevel] = useState("");

    const { logs, handleRefresh } = useRoomWiredLogs(page, search, level);

    return (
        <FlexLayout flex={1} direction="column">
            <FlexLayout flex={1} direction="column" gap={5}>
                <FlexLayout direction="row" align="center">
                    <b>{getWiredTranslation("logs.filter")}:</b>

                    <Input style={{ width: "100%" }} placeholder={getWiredTranslation("logs.search")} value={search} onChange={setSearch}/>
                    
                    <b>{getWiredTranslation("monitor.level")}:</b>
                    
                    <Selection style={{ width: 100 }} value={level} onChange={setLevel} items={[
                        {
                            value: "",
                            label: getWiredTranslation("logs.all_levels")
                        },
                        {
                            value: "INFO",
                            label: "INFO"
                        },
                        {
                            value: "WARNING",
                            label: "WARNING"
                        },
                        {
                            value: "ERROR",
                            label: "ERROR"
                        }
                    ]}/>

                    <div style={{ flex: 1 }}/>

                    <div className="sprite_refresh" onClick={handleRefresh} style={{
                        filter: "invert(1)",
                        cursor: "pointer"
                    }}/>
                </FlexLayout>

                <DialogTable
                    flex={[1, 1, 4]}
                    columns={[getWiredTranslation("monitor.timestamp"), getWiredTranslation("monitor.level"), getWiredTranslation("monitor.message")]}
                    items={logs?.logs.map((log, index) => ({
                        id: index,
                        values: [
                            new Date(log.timestamp).toLocaleTimeString(),
                            log.level,
                            log.message
                        ]
                    }))}
                    empty={getWiredTranslation("monitor.no_logs")}
                    />

                <FlexLayout direction="row" justify="space-between" align="center">
                    <div style={{ cursor: "pointer" }} onClick={() => setPage(Math.max(page - 1, 0))}><b>{"<"}</b></div>

                    <div>{getCommonTranslation("page")} {page + 1} / {(logs?.maxPages ?? 0) + 1}</div>

                    <div style={{ cursor: "pointer" }} onClick={() => setPage(Math.min(page + 1, logs?.maxPages ?? 0))}><b>{">"}</b></div>
                </FlexLayout>
            </FlexLayout>
        </FlexLayout>
    );
}

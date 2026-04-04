import { FurnitureData } from "@pixel63/events";
import FurnitureIcon from "@UserInterface/Components/Furniture/FurnitureIcon";

import "./TraxDialogList.css";
import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";
import TraxDialogPanel from "@UserInterface/Common/Dialog/Layouts/Trax/Components/TraxDialogPanel";
import { useCallback, useEffect, useMemo, useState } from "react";

export type TraxDialogListProps = {
    sets: FurnitureData[];

    onClick?: (set: FurnitureData) => void;
}

export default function TraxDialogList({ sets, onClick }: TraxDialogListProps) {
    const [page, setPage] = useState(0);
    const maxPages = useMemo(() => Math.ceil(sets.length / 3), [sets]);

    useEffect(() => {
        if(page >= maxPages) {
            setPage(maxPages - 1);
        }
    }, [maxPages])

    const handleNextPage = useCallback(() => {
        if(page + 1 < maxPages) {
            setPage(page + 1);
        }
    }, [page, maxPages]);
    
    const handlePreviousPage = useCallback(() => {
        if(page > 0) {
            setPage(page - 1);
        }
    }, [page]);

    return (
        <div style={{ position: "relative" }}>
            <div className="sprite_dialog_trax_list trax-dialog-list">
                <div className="trax-dialog-list-container">
                    {Array(3).fill(null).map((_, index) => {
                        const set = sets[index + (page * 3)];
                        
                        return (
                            <div key={(index + (page * 3))} style={{
                                flex: 1
                            }}>
                                {(set) && (
                                    <FlexLayout direction="row" className="trax-dialog-list-item" onClick={() => onClick?.(set)}>
                                        <FurnitureIcon furnitureData={set}/>

                                        <FlexLayout flex={1} direction="column" justify="center" gap={0}>
                                            <div><b>{set.name}</b></div>

                                            <div className="trax-dialog-list-item-use">Use</div>
                                        </FlexLayout>
                                    </FlexLayout>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <FlexLayout direction="column" align="center" gap={0} style={{
                position: "absolute",

                top: "100%",
                left: 0,
                right: 0
            }}>
                <TraxDialogPanel type="top-off">
                    <FlexLayout direction="row" align="center" gap={5} style={{
                        padding: "0px 5px"
                    }}>
                        <div className="sprite_dialog_trax_arrow-left" onClick={handlePreviousPage} style={{
                            cursor: "pointer"
                        }}/>

                        <div style={{
                            fontSize: 10
                        }}>
                            {page + 1}/{maxPages}
                        </div>

                        <div className="sprite_dialog_trax_arrow-right" onClick={handleNextPage} style={{
                            cursor: "pointer"
                        }}/>
                    </FlexLayout>
                </TraxDialogPanel>
            </FlexLayout>
        </div>
    );
}
import { ReactNode } from "react";
import Dialog from "../Dialog/Dialog";
import DialogContent from "../Dialog/Components/DialogContent";
import DialogTable, { DialogTableProps } from "../Dialog/Components/Table/DialogTable";
import DialogButton from "../Dialog/Components/Button/DialogButton";

export type BrowserDialogProps = {
    activeId: string | null;
    count: number;
    page: number;

    table: DialogTableProps

    hidden?: boolean;

    onSelect?: (id: string) => void;
    onPageChange?: (page: number) => void;
    onClose?: () => void;

    children?: ReactNode;
}

export default function BrowserDialog({ count, table, page, activeId, hidden, children, onSelect, onPageChange, onClose }: BrowserDialogProps) {
    return (
        <Dialog title="Browser" hidden={hidden} onClose={onClose} width={780} height={440} initialPosition="center">
            <DialogContent>
                <div style={{
                    flex: 1,

                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                }}>
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 10
                    }}>
                        {children}
                    </div>

                    <DialogTable
                        {...table}
                        activeId={activeId}/>

                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",

                        alignItems: "center",

                        fontSize: 12
                    }}>
                        <div style={{
                            display: "flex",
                            flexDirection: "row",
                            gap: 5
                        }}>
                            {(count > 20) && (
                                <div style={{ cursor: "pointer" }} onClick={() => onPageChange?.(Math.max(page - 1, 0))}><b>{"<"}</b></div>
                            )}

                            <div>Page {page + 1} / {Math.floor((count) / 20) + 1}</div>

                            {(count > 20) && (
                                <div style={{ cursor: "pointer" }} onClick={() => onPageChange?.(Math.min(page + 1, Math.floor((count) / 20)))}><b>{">"}</b></div>
                            )}
                        </div>

                        {(onSelect) && (
                            <div style={{
                                display: "flex",
                                justifyContent: "flex-end"
                            }}>
                                <DialogButton disabled={!activeId} onClick={() => {
                                    if(activeId) {
                                        onSelect?.(activeId);
                                        onClose?.();
                                    }
                                }}>Select</DialogButton>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

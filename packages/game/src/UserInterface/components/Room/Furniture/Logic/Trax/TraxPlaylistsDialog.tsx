import RoomFurniture from "@Client/Room/Furniture/RoomFurniture";
import { DeleteRoomFurnitureTraxSongData, FurnitureTraxSongMetaData, UpdateRoomFurnitureTraxPlaylistData, UserFurnitureTraxPlaylistData, UseRoomFurnitureData } from "@pixel63/events";
import DialogScrollArea from "@UserInterface/Common/Dialog/Components/Scroll/DialogScrollArea";
import TraxButton from "@UserInterface/Common/Dialog/Layouts/Trax/Components/TraxButton";
import TraxDialogListPanel from "@UserInterface/Common/Dialog/Layouts/Trax/Components/TraxDialogListPanel";
import TraxDialogListPanelItem from "@UserInterface/Common/Dialog/Layouts/Trax/Components/TraxDialogListPanelItem";
import TraxDialogPanel from "@UserInterface/Common/Dialog/Layouts/Trax/Components/TraxDialogPanel";
import TraxDialog from "@UserInterface/Common/Dialog/Layouts/Trax/TraxDialog";
import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";
import { useDialogs } from "@UserInterface/Hooks/useDialogs";
import { useCallback, useMemo, useState } from "react";
import { webSocketClient } from "src";

export type TraxPlaylistsDialogProps = {
    hidden?: boolean;
    data: {
        roomFurniture: RoomFurniture;
    };
    onClose?: () => void;
}

export default function TraxPlaylistsDialog({ hidden, data, onClose }: TraxPlaylistsDialogProps) {
    const dialogs = useDialogs();

    const playlist = useMemo(() => {
        return data.roomFurniture.data.data?.trax?.playlist.map((playlist) => data.roomFurniture.data.data?.trax?.songs.find((song) => song.id === playlist)).filter((song) => song !== undefined) ?? [];
    }, [data.roomFurniture.data.data?.trax?.playlist]);

    const songs = useMemo(() => {
        return data.roomFurniture.data.data?.trax?.songs.filter((song) => !playlist.includes(song)) ?? [];
    }, [data.roomFurniture.data.data?.trax?.songs, playlist]);

    const [activeSongId, setActiveSongId] = useState<string>();

    const activeSong = useMemo(() => {
        if(!activeSongId) {
            return undefined;
        }

        return data.roomFurniture.data.data?.trax?.songs.find((song) => song.id === activeSongId);
    }, [activeSongId, data.roomFurniture.data.data?.trax?.songs]);

    const handleEditSong = useCallback(() => {
        if(!activeSong) {
            return;
        }

        onClose?.();

        dialogs.openUniqueDialog("trax-editor", {
            roomFurniture: data.roomFurniture,
            song: activeSong
        });
    }, [data, activeSong, dialogs, onClose]);

    const handleCreateSong = useCallback(() => {
        onClose?.();

        dialogs.openUniqueDialog("trax-editor", data);
    }, [data, dialogs, onClose]);

    const handleAddSong = useCallback(() => {
        if(!activeSong) {
            return;
        }

        if(playlist.some((playlist) => playlist.id === activeSong.id)) {
            webSocketClient.sendProtobuff(UpdateRoomFurnitureTraxPlaylistData, UpdateRoomFurnitureTraxPlaylistData.create({
                roomFurnitureId: data.roomFurniture.data.id,

                playlist: (data.roomFurniture.data.data?.trax?.playlist ?? []).filter((playlist) => playlist !== activeSong.id)
            }));

            return;
        }

        webSocketClient.sendProtobuff(UpdateRoomFurnitureTraxPlaylistData, UpdateRoomFurnitureTraxPlaylistData.create({
            roomFurnitureId: data.roomFurniture.data.id,

            playlist: (data.roomFurniture.data.data?.trax?.playlist ?? []).concat(activeSong.id)
        }));
    }, [activeSong, playlist, data]);

    const handleMoveUp = useCallback((song: FurnitureTraxSongMetaData) => {
        if(!data.roomFurniture.data.data?.trax?.playlist) {
            return;
        }

        const currentIndex = data.roomFurniture.data.data.trax.playlist.indexOf(song.id) ?? -1;

        if(currentIndex <= 0) {
            return;
        }

        const mutatedPlaylist = [...data.roomFurniture.data.data.trax.playlist];
        mutatedPlaylist.splice(currentIndex, 1);
        mutatedPlaylist.splice(currentIndex - 1, 0, song.id);

        webSocketClient.sendProtobuff(UpdateRoomFurnitureTraxPlaylistData, UpdateRoomFurnitureTraxPlaylistData.create({
            roomFurnitureId: data.roomFurniture.data.id,

            playlist: mutatedPlaylist
        }));
    }, [data.roomFurniture.data.data?.trax?.playlist]);
    
    const handleMoveDown = useCallback((song: FurnitureTraxSongMetaData) => {
        if(!data.roomFurniture.data.data?.trax?.playlist) {
            return;
        }

        const currentIndex = data.roomFurniture.data.data.trax.playlist.indexOf(song.id) ?? -1;

        if(currentIndex >= data.roomFurniture.data.data.trax.playlist.length - 1) {
            return;
        }

        const mutatedPlaylist = [...data.roomFurniture.data.data.trax.playlist];
        mutatedPlaylist.splice(currentIndex, 1);
        mutatedPlaylist.splice(currentIndex + 1, 0, song.id);

        webSocketClient.sendProtobuff(UpdateRoomFurnitureTraxPlaylistData, UpdateRoomFurnitureTraxPlaylistData.create({
            roomFurnitureId: data.roomFurniture.data.id,

            playlist: mutatedPlaylist
        }));
    }, [data.roomFurniture.data.data?.trax?.playlist]);

    const handleToggle = useCallback(() => {
        webSocketClient.sendProtobuff(UseRoomFurnitureData, UseRoomFurnitureData.create({
            id: data.roomFurniture.data.id,
            animation: (data.roomFurniture.data.animation === 0)?(1):(0)
        }));
    }, [data.roomFurniture.data.id, data.roomFurniture.data.animation]);

    const handleDeleteSong = useCallback(() => {
        if(!activeSong) {
            return;
        }

        webSocketClient.sendProtobuff(DeleteRoomFurnitureTraxSongData, DeleteRoomFurnitureTraxSongData.create({
            roomFurnitureId: data.roomFurniture.data.id,

            songId: activeSong.id
        }));
    }, [activeSong]);

    return (
        <TraxDialog title="Trax Playlists" hidden={hidden} onClose={onClose} width={540} height={330} initialPosition="center" style={{
            display: "flex",
            flexDirection: "column",
            gap: 10
        }}>
            <FlexLayout flex={1} direction="row" style={{ flex: 1 }}>
                <FlexLayout flex={4}>
                    <div style={{ textAlign: "center" }}><b>Traxmachine Songs</b></div>

                    <TraxDialogListPanel style={{
                        flex: "1 1 0",

                        display: "flex",
                        overflow: "hidden"
                    }}>
                        <DialogScrollArea hideInactive style={{ gap: 5 }} contentStyle={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 5
                        }}>
                            {(songs.length)?(
                                songs.map((song) => (
                                    <TraxDialogListPanelItem key={song.id} active={song.id === activeSong?.id} onClick={() => setActiveSongId(song.id)}>
                                        {song.name}
                                    </TraxDialogListPanelItem>
                                ))
                            ):(
                                <div style={{ color: "#97D5CE", textAlign: "center" }}><i>No songs available</i></div>
                            )}
                        </DialogScrollArea>
                    </TraxDialogListPanel>

                    <FlexLayout direction="row">
                        <TraxButton onClick={handleEditSong} disabled={!activeSong || activeSong.userFurnitureId !== undefined} containerStyle={{ flex: 1}}>
                            Edit song
                        </TraxButton>
                        
                        <TraxButton disabled={!activeSong || activeSong.userFurnitureId !== undefined} onClick={handleDeleteSong}>
                            <div className="sprite_dialog_trax_trash"/>
                        </TraxButton>
                    </FlexLayout>
                    
                    <TraxButton onClick={handleCreateSong}>
                        Create a new song
                    </TraxButton>
                </FlexLayout>

                <div>
                    <TraxButton disabled={!activeSong} containerStyle={{
                        alignSelf: "center",

                        marginTop: 64
                    }} onClick={handleAddSong}>
                        {(activeSong && playlist.some((playlist) => playlist.id === activeSong.id))?(
                            <div className="sprite_dialog_trax_add" style={{
                                transform: "rotateZ(180deg)"
                            }}/>
                        ):(
                            <div className="sprite_dialog_trax_add"/>
                        )}
                    </TraxButton>
                </div>

                <FlexLayout flex={4}>
                    <div style={{ textAlign: "center" }}><b>Playlist</b></div>

                    <FlexLayout direction="row" style={{
                        flex: "3 1 0",
                        display: "flex",
                        overflow: "hidden"
                    }}>
                        <TraxDialogListPanel style={{
                            flex: "1 1 0",

                            display: "flex",
                            overflow: "hidden"
                        }}>
                            <DialogScrollArea hideInactive style={{ gap: 5 }} contentStyle={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 5
                            }}>
                                {(playlist.length)?(
                                    playlist.map((song, index) => (
                                        <FlexLayout key={song.id} direction="row" gap={3}>
                                            <TraxDialogListPanelItem active={song.id === activeSong?.id} onClick={() => setActiveSongId(song.id)} style={{ flex: 1 }}>
                                                {song.name}
                                            </TraxDialogListPanelItem>

                                            <TraxDialogListPanelItem style={{ padding: 5 }} disabled={index === playlist.length - 1} onClick={() => handleMoveDown(song)}>
                                                <div className="sprite_dialog_trax_down"/>
                                            </TraxDialogListPanelItem>

                                            <TraxDialogListPanelItem style={{ padding: 5 }} disabled={index === 0} onClick={() => handleMoveUp(song)}>
                                                <div className="sprite_dialog_trax_down" style={{
                                                    transform: "rotateZ(180deg)"
                                                }}/>
                                            </TraxDialogListPanelItem>
                                        </FlexLayout>
                                    ))
                                ):(
                                    <div style={{ color: "#97D5CE", textAlign: "center" }}><i>No songs added</i></div>
                                )}
                            </DialogScrollArea>
                        </TraxDialogListPanel>
                    </FlexLayout>

                    <div style={{ padding: "0 10px" }}>
                        <TraxButton onClick={handleToggle} disabled={data.roomFurniture.data.animation === 0 && !playlist.length}>
                            {(data.roomFurniture.data.animation === 0)?(
                                "Start Playlist"
                            ):(
                                "Stop Playlist"
                            )}
                        </TraxButton>
                    </div>

                    <div style={{ textAlign: "center", color: "#97D5CE", opacity: (activeSong)?(1):(0) }}><b>Song Info</b></div>

                    {(activeSong)?(
                        <TraxDialogPanel containerStyle={{ flex: 2 }} style={{ display: "flex", padding: 10 }}>
                            <FlexLayout flex={1} align="center" gap={2}>
                                <div><b>{activeSong.name}</b></div>

                                <div style={{ color: "#97D5CE" }}>{new Date(activeSong.duration * 1000).toISOString().slice(14, 19)}min</div>

                                <div style={{ flex: 1 }}/>

                                {(activeSong.userFurnitureId)?(
                                    <TraxButton style={{ paddingLeft: 20, paddingRight: 20}}>Eject CD</TraxButton>
                                ):(
                                    <TraxButton style={{ paddingLeft: 20, paddingRight: 20}}>Burn Song</TraxButton>
                                )}
                            </FlexLayout>
                        </TraxDialogPanel>
                    ):(
                        <div style={{ flex: 2, padding: 2 }}></div>
                    )}
                </FlexLayout>
            </FlexLayout>
        </TraxDialog>
    );
}

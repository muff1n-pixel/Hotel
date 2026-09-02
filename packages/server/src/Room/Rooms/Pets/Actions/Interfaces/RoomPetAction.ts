export default interface RoomPetAction {
    expiresAt?: number;

    handleActionsInterval?(): Promise<void>;
}

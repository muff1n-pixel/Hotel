export default interface RoomActorPose {
    stand(): void;
    sit(): void;

    wave(): void;
    smile(): void;
    laugh(): void;
    sad(): void;
    angry(): void;
    surprised(): void;

    setEffect?(effect: string): void;
    removeEffect?(): void;

    isSitting(): boolean;

    handleActionsInterval?(): void;
}

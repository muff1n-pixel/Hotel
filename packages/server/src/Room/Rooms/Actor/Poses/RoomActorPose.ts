export default interface RoomActorPose {
    stand(): void;
    sit(): void;
    lay(): void;
    beg(): void;
    eat(): void;

    wave(): void;
    smile(): void;
    laugh(): void;
    sad(): void;
    angry(): void;
    surprised(): void;
    pet(): void;

    setEffect?(effect: string): void;
    removeEffect?(): void;

    isSitting(): boolean;

    handleActionsInterval?(): void;
}

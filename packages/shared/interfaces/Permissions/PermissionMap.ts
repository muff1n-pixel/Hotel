export type FurniturePermissions = 
    "furniture:edit";

export type ShopPermissions = 
    "shop:edit";

export type FeedbackPermissions =
    "feedback:read";

export type RoomPermissions =
    "room:export_furniture"
    | "room:import_furniture"
    | "room:type";

export type CommandPermissions =
    "command:give";

export type PermissionAction =
    FurniturePermissions
    | ShopPermissions
    | FeedbackPermissions
    | RoomPermissions
    | CommandPermissions;

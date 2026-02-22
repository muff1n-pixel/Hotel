export enum AlertType {
    SUCCESS,
    ERROR
}

export type Alert = {
    type: AlertType,
    message: string
}
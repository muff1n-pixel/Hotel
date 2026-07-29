export type NotificationIconProps = {
    count: number;
};

export default function NotificationIcon({ count }: NotificationIconProps) {
    if(!count) {
        return null;
    }
    
    return (
        <div style={{
            border: "1px solid #000000",
            borderBottomWidth: 2,
            borderRadius: 6
        }}>
            <div style={{
                border: "1px solid #ED2823",
                borderRadius: 6,

                background: "#AC1D19",
                color: "#FFFFFF",

                textAlign: "center",

                fontSize: 12,

                height: 13,

                paddingLeft: 4,
                paddingRight: 4
            }}>
                <b>{count}</b>
            </div>
        </div>
    );
}
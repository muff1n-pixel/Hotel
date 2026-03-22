import { useCallback, useContext, useState } from "react";
import { ThemeContext } from "../../ThemeProvider";
import tradeIcon from '../../Images/icons/small/trade.png';
import { Alert, AlertType } from "../Alert/Alert";
import Box from "../Box/Box";
import Button from "../Button/Button";


const SettingsTradeForm = () => {
    const { state: { currentUser }, dispatch } = useContext(ThemeContext);

    if (!currentUser)
        return (
            <Box>
                <div className='alert error noMargin'>Please reconnect on the website.</div>
            </Box>);
    else {
        const [alert, setAlert] = useState<null | Alert>(null);
        const [allowTrade, setAllowTrade] = useState(currentUser.preferences.allowTrade);

        const submitForm = useCallback((e: React.SubmitEvent<HTMLFormElement>) => {
            e.preventDefault();

            fetch("/api/settings/trade", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    allowTrade
                })
            })
                .then((response) => response.json())
                .then((result) => {
                    if (result.error)
                        return setAlert({
                            type: AlertType.ERROR,
                            message: result.error
                        });

                    const newUser = Object.create(
                        Object.getPrototypeOf(currentUser),
                        Object.getOwnPropertyDescriptors(currentUser)
                    );

                    newUser.preferences.allowTrade = allowTrade;

                    dispatch({ currentUser: newUser });
                    setAlert({
                        type: AlertType.SUCCESS,
                        message: result.success
                    });

                });
        }, [allowTrade]);

        return (
            <Box title={"Edit my trade settings"}>
                {alert && <div className={`alert ${alert.type === AlertType.SUCCESS ? "success" : "error"}`}>{alert.message}</div>}
                <form onSubmit={submitForm}>
                    <div className="row">
                        <span><img src={tradeIcon} alt="Trade icon" /> Allow trade</span>
                        <select value={Number(allowTrade)} onChange={(e) => setAllowTrade(e.target.value === "1") }>
                            <option value="0">No</option>
                            <option value="1">Yes</option>
                        </select>
                    </div>

                    <Button color="grey" shadow={false}><img src={tradeIcon} alt="Trade Icon" /> Edit my trade settings</Button>
                </form>
            </Box>
        )
    }
}

export default SettingsTradeForm;
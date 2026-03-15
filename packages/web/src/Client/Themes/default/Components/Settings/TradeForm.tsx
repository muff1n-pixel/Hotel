import { useCallback, useContext, useState } from "react";
import { ThemeContext } from "../../ThemeProvider";
import tradeIcon from '../../Images/icons/small/tools_edit.gif';
import { Alert, AlertType } from "../Alert/Alert";


const SettingsTradeForm = () => {
    const { state: { currentUser }, dispatch } = useContext(ThemeContext);

    if (!currentUser)
        return (
            <div className='box'>
                <div className='alert error noMargin'>Please reconnect on the website.</div>
            </div>);
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
            <div className="box">
                <div className="title">Edit my trade settings</div>
                {alert && <div className={`alert ${alert.type === AlertType.SUCCESS ? "success" : "error"}`}>{alert.message}</div>}
                <form onSubmit={submitForm}>
                    <div className="row">
                        <span><img src={tradeIcon} alt="Trade icon" /> Allow trade</span>
                        <select value={Number(allowTrade)} onChange={(e) => setAllowTrade(e.target.value === "1") }>
                            <option value="0">No</option>
                            <option value="1">Yes</option>
                        </select>
                    </div>
                    <button><img src={tradeIcon} alt="Trade Icon" /> Edit my trade settings</button>
                </form>
            </div>
        )
    }
}

export default SettingsTradeForm;
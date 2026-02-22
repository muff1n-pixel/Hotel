import { useCallback, useContext, useState } from "react";
import { ThemeContext } from "../../ThemeProvider";
import passwordIcon from '../../Images/settings/password.gif';
import { Alert, AlertType } from "./Alert";

const SettingsPasswordForm = () => {
    const { state: { currentUser }, dispatch } = useContext(ThemeContext);

    if (!currentUser)
        return (
            <div className='box'>
                <div className='alert error noMargin'>Please reconnect on the website.</div>
            </div>);
    else {
        const [alert, setAlert] = useState<null | Alert>(null);
        const [oldPassword, setOldPassword] = useState<string | undefined>(undefined);
        const [password, setPassword] = useState<string | undefined>(undefined);
        const [passwordConfirm, setPasswordConfirm] = useState<string | undefined>(undefined);

        const submitForm = useCallback((e: React.SubmitEvent<HTMLFormElement>) => {
            e.preventDefault();

            fetch("/api/settings/password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    oldPassword,
                    password,
                    passwordConfirm
                })
            })
                .then((response) => response.json())
                .then((result) => {
                    if (result.error)
                        return setAlert({
                            type: AlertType.ERROR,
                            message: result.error
                        });

                    setAlert({
                        type: AlertType.SUCCESS,
                        message: result.success
                    });

                    setOldPassword("");
                    setPassword("");
                    setPasswordConfirm("");
                });
        }, [oldPassword, password, passwordConfirm, setOldPassword, setPassword, setPasswordConfirm]);

        return (
            <div className="box">
                <div className="title">Edit my password</div>
                {alert && <div className={`alert ${alert.type === AlertType.SUCCESS ? "success" : "error"}`}>{alert.message}</div>}
                <form onSubmit={submitForm}>
                    <input type="password" placeholder="Current password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)}></input>
                    <input type="password" placeholder="New password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
                    <input type="password" placeholder="Confirm your new password" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)}></input>
                    <button><img src={passwordIcon} alt="Password Icon" /> Edit my password</button>
                </form>
            </div>
        )
    }
}

export default SettingsPasswordForm;
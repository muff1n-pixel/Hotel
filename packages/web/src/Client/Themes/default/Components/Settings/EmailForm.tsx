import { useCallback, useContext, useState } from "react";
import { ThemeContext } from "../../ThemeProvider";
import mailIcon from '../../Images/settings/mail.gif';
import { Alert, AlertType } from "./Alert";

const SettingsEmailForm = () => {
    const { state: { currentUser }, dispatch } = useContext(ThemeContext);
    if (!currentUser)
        return (
            <div className='box'>
                <div className='alert error noMargin'>Please reconnect on the website.</div>
            </div>);
    else {
        const [alert, setAlert] = useState<null | Alert>(null);
        const [mail, setMail] = useState<string | undefined>(undefined);

        const submitForm = useCallback((e: React.SubmitEvent<HTMLFormElement>) => {
            e.preventDefault();

            fetch("/api/settings/mail", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    mail
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

                    newUser.mail = mail;

                    dispatch({ currentUser: newUser });
                    setAlert({
                        type: AlertType.SUCCESS,
                        message: result.success
                    });

                    setMail("");
                });
        }, [mail, setMail]);

        return (
            <div className="box">
                <div className="title">Edit my email</div>
                {alert && <div className={`alert ${alert.type === AlertType.SUCCESS ? "success" : "error"}`}>{alert.message}</div>}
                <form onSubmit={submitForm}>
                    <input type="text" value={currentUser?.mail} disabled></input>
                    <input type="text" placeholder="New email" value={mail} onChange={(e) => setMail(e.target.value)}></input>
                    <button><img src={mailIcon} alt="Mail Icon" /> Edit my email</button>
                </form>
            </div>
        )
    }
}

export default SettingsEmailForm;
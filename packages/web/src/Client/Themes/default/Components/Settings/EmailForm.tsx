import { useCallback, useContext, useState } from "react";
import { ThemeContext } from "../../ThemeProvider";
import mailIcon from '../../Images/settings/mail.gif';
import { Alert, AlertType } from "../Alert/Alert";
import Box from "../Box/Box";
import Button from "../Button/Button";

const SettingsEmailForm = () => {
    const { state: { currentUser }, dispatch } = useContext(ThemeContext);
    if (!currentUser)
        return (
            <Box>
                <div className='alert error noMargin'>Please reconnect on the website.</div>
            </Box>);
    else {
        const [alert, setAlert] = useState<null | Alert>(null);
        const [email, setEmail] = useState<string | undefined>(undefined);

        const submitForm = useCallback((e: React.SubmitEvent<HTMLFormElement>) => {
            e.preventDefault();

            fetch("/api/settings/mail", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email
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

                    newUser.email = email;

                    dispatch({ currentUser: newUser });
                    setAlert({
                        type: AlertType.SUCCESS,
                        message: result.success
                    });

                    setEmail("");
                });
        }, [email, setEmail]);

        return (
            <Box title={"Edit my email"}>
                {alert && <div className={`alert ${alert.type === AlertType.SUCCESS ? "success" : "error"}`}>{alert.message}</div>}
                <form onSubmit={submitForm}>
                    <input type="text" value={currentUser?.email as string} disabled></input>
                    <input type="text" placeholder="New email" value={email} onChange={(e) => setEmail(e.target.value)}></input>
                    <Button color="grey" shadow={false}><img src={mailIcon} alt="Mail Icon" /> Edit my email</Button>
                </form>
            </Box>
        )
    }
}

export default SettingsEmailForm;
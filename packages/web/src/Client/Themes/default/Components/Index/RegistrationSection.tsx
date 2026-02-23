import { ThemeContext } from "../../ThemeProvider";
import Button from "../Button";
import Container from "../Container";
import Input from "../Input";
import { useCallback, useContext, useState } from "react";
import { useCookies } from "react-cookie";

export default function RegistrationSection() {
    const { state: { currentUser }, dispatch } = useContext(ThemeContext);
    const [_cookies, setCookie] = useCookies(["accessToken"]);
    
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    
    const [error, setError] = useState("");
    
    const handleSubmit = useCallback(() => {
        fetch("/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                email,
                password,
                confirmPassword
            })
        })
            .then((response) => response.json())
            .then((result) => {
                if (result.error) {
                    setError(result.error);

                    return;
                }

                if(result.accessToken) {
                    const date = new Date();
                    date.setFullYear(date.getFullYear() + 1);

                    dispatch({currentUser: result})

                    setCookie("accessToken", result.accessToken, {
                        expires: date
                    });
                }
            });
    }, [name, email, password, confirmPassword, setCookie, dispatch]);

    return (
        <div style={{
            height: "100vh",

            boxSizing: "border-box"
        }}>
            <Container style={{
                position: "relative"
            }}>
                <div style={{
                    position: "absolute",

                    width: 734,
                    height: 652,

                    right: -280,
                    top: 0,

                    background: `url(${new URL('../../Images/index/reception.png', import.meta.url).toString()})`,
                    backgroundRepeat: "no-repeat"
                }}/>
            </Container>

            <Container style={{ position: "relative" }}>
                <div style={{
                    width: "max-content",
                    marginTop: 140,

                    background: "rgba(16, 16, 22, 0.80)",
                    border: "1px solid #7aa3b9",
                    borderRadius: 7
                }}>
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 6,

                        borderBottom: "1px solid #7aa3b9",
                    
                        padding: "16px 20px"
                    }}>
                        <h1>REGISTRATION</h1>

                        <p style={{
                            color: "#5189be",
                            fontFamily: "Ubuntu Bold Italic",
                            fontSize: 17
                        }}>
                            Fill in these details to begin:
                        </p>
                    </div>

                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 18,
                        padding: "16px 20px",
                        width: 700,
                    }}>
                        <div style={{
                            flex: 1,

                            display: "flex",
                            flexDirection: "column",
                            gap: 32
                        }}>
                            <div style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 8
                            }}>
                                <p style={{
                                    color: "#9ec6dc",
                                    fontFamily: "Ubuntu Bold Italic",
                                    fontSize: 20
                                }}>
                                    Username
                                </p>

                                <p style={{
                                    fontFamily: "Ubuntu Italic",
                                    fontSize: 14,
                                    color: "#5198be"
                                }}>
                                    Choose a nick name that you might remember next time you revisit.
                                </p>

                                <Input style={{ width: "100%" }} value={name} onChange={setName} maxlength={32}/>
                            </div>

                            <div style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 8
                            }}>
                                <p style={{
                                    color: "#9ec6dc",
                                    fontFamily: "Ubuntu Bold Italic",
                                    fontSize: 20
                                }}>
                                    Email (optional)
                                </p>

                                <p style={{
                                    fontFamily: "Ubuntu Italic",
                                    fontSize: 14,
                                    color: "#5198be"
                                }}>
                                    <b>Optionally,</b> enter your email address, in case you lose your password!
                                </p>

                                <Input style={{ width: "100%" }} value={email} onChange={setEmail} maxlength={254}/>
                            </div>

                            <div style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 8
                            }}>
                                <p style={{
                                    color: "#9ec6dc",
                                    fontFamily: "Ubuntu Bold Italic",
                                    fontSize: 20
                                }}>
                                    Password
                                </p>

                                <p style={{
                                    fontFamily: "Ubuntu Italic",
                                    fontSize: 14,
                                    color: "#5198be"
                                }}>
                                    Create a new password that you do not use elsewhere.
                                </p>

                                <Input style={{ width: "100%" }} type="password" value={password} onChange={setPassword}/>
                            </div>

                            <div style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 8
                            }}>
                                <p style={{
                                    color: "#9ec6dc",
                                    fontFamily: "Ubuntu Bold Italic",
                                    fontSize: 20
                                }}>
                                    Confirm your password
                                </p>

                                <p style={{
                                    fontFamily: "Ubuntu Italic",
                                    fontSize: 14,
                                    color: "#5198be"
                                }}>
                                    To make sure you haven't made a mistake!
                                </p>

                                <Input style={{ width: "100%" }} type="password" value={confirmPassword} onChange={setConfirmPassword}/>
                            </div>

                            <div style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 16
                            }}>
                                {(error) && (
                                    <p style={{
                                        color: "#da5a4c",
                                        fontFamily: "Ubuntu Medium",
                                        fontSize: 17
                                    }}>
                                        {error}
                                    </p>
                                )}

                                <Button size="large" onClick={handleSubmit}>Register</Button>
                            </div>
                        </div>

                        <div style={{
                            flex: 1,

                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "flex-end",
                            gap: 8
                        }}>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
}

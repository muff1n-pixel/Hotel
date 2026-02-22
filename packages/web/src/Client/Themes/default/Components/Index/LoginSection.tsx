import { useNavigate } from "react-router";
import { ThemeContext } from "../../ThemeProvider";
import Button from "../Button";
import Container from "../Container";
import Input from "../Input";
import { useCallback, useContext, useState } from "react";
import { useCookies } from "react-cookie";

export type LoginSectionProps = {
    showRegistration: () => void;
}

export default function LoginSection({ showRegistration }: LoginSectionProps) {
    const { state: { currentUser }, dispatch } = useContext(ThemeContext);
    const [_cookies, setCookie] = useCookies(["accessToken"]);
    
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    
    const handleSubmit = useCallback(() => {
        fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                password
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
    }, [name, password, dispatch, setCookie]);

    return (
        <div style={{
            height: "100vh"
        }}>
            <Container style={{
                position: "relative"
            }}>
                <div style={{
                    position: "absolute",

                    width: 1027,
                    height: 756,

                    right: -480,
                    top: 0,

                    background: `url(${new URL('../../Images/index/hotel.png', import.meta.url).toString()})`,
                    backgroundRepeat: "no-repeat"
                }}/>
            </Container>
            
            <header style={{
                background: "rgba(16, 16, 22, 0.85)",
                borderBottom: "1px solid #7aa3b9",

                position: "relative"
            }}>
                <Container style={{
                    display: "flex",
                    flexDirection: "row",

                    padding: "24px 0",
                }}>
                    <div>
                        <img src={new URL('../../Images/logo.gif', import.meta.url).toString()}/>
                    </div>
                    
                    <div style={{
                        flex: 1,
                        display: "flex",
                        justifyContent: "flex-end"
                    }}>
                        <div style={{
                            display: "flex",
                            gap: 10,
                            flexDirection: "column",
                            justifyContent: "flex-end",
                        }}>
                            <div style={{
                                display: "flex",
                                gap: 10,
                                flexDirection: "row",
                                alignItems: "flex-end",
                                justifyContent: "flex-end",
                            }}>
                                <div style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 4
                                }}>
                                    <label style={{ fontFamily: "Ubuntu Bold", color: "#9DCED4" }}>Username</label>

                                    <Input value={name} onChange={setName}/>
                                </div>

                                <div style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 4
                                }}>
                                    <label style={{ fontFamily: "Ubuntu Bold", color: "#9DCED4" }}>Password</label>
                                
                                    <Input type="password" value={password} onChange={setPassword}/>
                                </div>

                                <div>
                                    <Button onClick={handleSubmit}>Login</Button>
                                </div>
                            </div>

                            {(error) && (
                                <div style={{
                                    color: "#da5a4c",
                                    fontFamily: "Ubuntu Medium",
                                }}>
                                    {error}
                                </div>
                            )}
                        </div>
                    </div>
                </Container>
            </header>

            <Container style={{ position: "relative" }}>
                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 32,
                    margin: "32px 0",
                }}>
                    <Button size="large" color="orange" onClick={() => showRegistration()}>
                        Register a new

                        <div style={{ height: 10 }}/>

                        guest user
                    </Button>

                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center"
                    }}>
                        <h1 style={{
                            fontSize: 40,
                            fontFamily: "Ubuntu Bold Italic",
                            textShadow: "2px 2px 2px rgba(0, 0, 0, 0.4)"
                        }}>
                            Welcome to Pixel63,
                        </h1>

                        <p style={{
                            color: "#7ecaee",

                            fontSize: 20,
                            fontFamily: "Ubuntu Medium Italic",

                            textShadow: "1px 1px 2px rgba(0, 0, 0, 0.4)"
                        }}>
                            a live demonstration of a new web client.
                        </p>
                    </div>
                </div>

                <div style={{
                    width: "max-content",

                    border: "1px solid #004F68",
                    borderRadius: 5,

                    background: "rgba(199, 219, 227, 0.90)",

                    boxShadow: "3px 3px rgba(0, 0, 0, .4)",

                    padding: 6
                }}>
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 6
                    }}>
                        <div style={{
                            flex: 1,
                            width: 270,
                            height: 200,
                            border: "1px solid #000",
                            overflow: "hidden"
                        }}>
                            <img src={new URL('../../Images/index/carousel_image_left.png', import.meta.url).toString()}/>
                        </div>
                        
                        <div style={{
                            flex: 1,
                            width: 270,
                            height: 200,
                            border: "1px solid #000",
                            overflow: "hidden"
                        }}>
                            <img src={new URL('../../Images/index/carousel_image_center.png', import.meta.url).toString()}/>
                        </div>

                        <div style={{
                            flex: 1,
                            width: 270,
                            height: 200,
                            border: "1px solid #000",
                            overflow: "hidden"
                        }}>
                            <img src={new URL('../../Images/index/carousel_image_right.png', import.meta.url).toString()}/>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
}

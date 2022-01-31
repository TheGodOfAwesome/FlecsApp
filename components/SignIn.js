import { useState } from "react";
import axios from 'axios';
// import { setToken, setUser } from "../auth/auth.js";
import { MDBContainer} from "mdbreact";
import LoadingSpinner from "./LoadingSpinner";
import createPersistedState from 'use-persisted-state';

const useUserState = createPersistedState('user');
const useTokenState = createPersistedState('token');

const SignIn = () => {
    const [user, setUser] = useUserState({});
    const [token, setToken] = useTokenState('');
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
        setErrorMessage("");
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        setErrorMessage("");
    }

    const handleSubmit = (e, data) => {
        e.preventDefault();
        if (!username || !password) {
            const error = 'Please check that all information has been entered correctly!';
            setErrorMessage(error);
        } else {
            setErrorMessage("");
            setLoading(true);

            axios.post(
                process.env.NEXT_PUBLIC_FLECS_USER_SERVICE, 
                {
                    user: username,
                    password: password
                },
                {
                    params: {
                        function: "login",
                        api_key: process.env.NEXT_PUBLIC_FLECS_USER_SERVICE_API_KEY,
                    }
                }
            )
            .then(result => {
                console.log(result);
                setLoading(false);
                setErrorMessage(result.data.message);
                // auth.signup(this.state.username, this.state.password);
                if (result.data.token && result.data.responsePayload.user) {
                    console.log(result.data.token);
                    console.log(result.data.responsePayload.user);
                    setToken(result.data.token);
                    setUser(result.data.responsePayload.user);
                    window.location.href='/';
                } else {
                    setErrorMessage("Please check that all information has been entered correctly and retry!");
                }
            })
            .catch(error => {
                setLoading(false);
                setErrorMessage("Check sign in details and retry!");
                console.log(error);
            });
        }
    }

    return (
        <MDBContainer 
            style={{
                width: "100vw !important",
                height:"700px", position:"relative", margin: "auto"
            }}
        >
            <div style={{
                    position: "absolute",
                    top:"50%", left:"50%",
                    transform: "translate(-50%,-50%)"
                }}
            >
                <form className="signInForm" onSubmit={handleSubmit}
                    style = {{
                        justifyContent: "center",
                        alignItems: "center",
                        textAlign: "center"
                    }}
                >
                    <h1 className="text-white text-center"><b>Sign In</b></h1>
                    <input 
                        className="form-control" 
                        type="text" 
                        placeholder="Username" 
                        onChange={handleUsernameChange}
                        style={{
                            backgroundColor: "transparent",
                            borderColor: "#00ffa1", 
                            borderWidth:"2px", 
                            width:"300px"
                        }}
                        required
                    />
                    <br/>
                    <input 
                        className="form-control"
                        type="password" 
                        placeholder="Password" 
                        onChange={handlePasswordChange}
                        style={{
                            backgroundColor: "transparent",
                            borderColor: "#00ffa1", 
                            borderWidth:"2px", 
                            width:"300px"
                        }}
                        required
                    />
                    <br/>
                    {
                        loading
                        ?
                            <LoadingSpinner/>
                        :
                            <button 
                                className="btn rounded" 
                                style={{
                                    backgroundColor: "#00ffa1", width:"300px", margin:"0px"
                                }}
                            >
                                <b>Sign In</b>
                            </button>
                    }
                    <br/>
                    <p style={{color:"#00ffa1"}}>{errorMessage}</p>
                </form>
            </div>
        </MDBContainer>
    )
}

export default SignIn;
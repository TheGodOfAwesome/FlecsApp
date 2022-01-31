import { useState } from "react";
import Router from 'next/router';
import axios from 'axios';
import { MDBContainer} from "mdbreact";
import LoadingSpinner from "./LoadingSpinner";

const SignUp = () => {
    const [errorMessage, setErrorMessage] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordReentry, setPasswordReentry] = useState("");
    const [loading, setLoading] = useState(false);
    const [disabledSubmit, setDisabledSubmit] = useState(true);
    
    const handlePasswordChange = (e) => {
        if (!(/[a-z]/.test(e.target.value))) {
            const error = 'Your password must contain at least one lower case letter!';
            setErrorMessage(error);
            setDisabledSubmit(true);
        } else if (!(/[A-Z]/.test(e.target.value))) {
            const error = 'Your password must contain at least one upper case letter!';
            setErrorMessage(error);
            setDisabledSubmit(true);
        } else if (!(/[0-9]/.test(e.target.value))) {
            const error = 'Your password must contain at least one number!';
            setErrorMessage(error);
            setDisabledSubmit(true);
        } else if (!(/[!@#$%^&]/.test(e.target.value))) {
            const error = 'Your password must contain at least one special character!';
            setErrorMessage(error);
        } else if (e.target.value.length < 8) {
            const error = 'Your password must contain at least 8 characters!';
            setErrorMessage(error);
            setDisabledSubmit(true);
        } else {
            const error = '';
            setErrorMessage(error);
            setDisabledSubmit(false);
            setPassword(e.target.value);
        }
    }
        
    const handlePasswordReentry = (e) => {
        if (password !== e.target.value) {
            const error = 'Your password and password re-entry must match!';
            setErrorMessage(error);
            setDisabledSubmit(true);
        } else {
            const error = '';
            setErrorMessage(error);
            setDisabledSubmit(false);
            setPasswordReentry(e.target.value);
        }
    }

    const handleUsernameChange = (e) => {
        // if (str.indexOf(' ') !== -1) {
        if (/\s/.test(e.target.value)) {
            const error = 'Your username must not contain spaces!';
            setErrorMessage(error);
            setDisabledSubmit(true);
        } else if (e.target.value.length < 4){
            const error = 'Your username must be at least 4 characters long!';
            setErrorMessage(error);
            setDisabledSubmit(true);
        } else {
            const error = '';
            setErrorMessage(error);
            setDisabledSubmit(false);
            setUsername(e.target.value);
        }
    }

    const handleSubmit = (e, data) => {
        e.preventDefault();
        if (!username || !password || (password !== passwordReentry)) {
            const error = 'Please check that all information has been entered correctly!';
            setErrorMessage(error);
        } else {
            
            setLoading(true);

            axios.put(
                process.env.NEXT_PUBLIC_FLECS_USER_SERVICE, 
                {
                    username: username,
                    password: password
                },
                {
                    params: {
                        api_key: process.env.NEXT_PUBLIC_FLECS_USER_SERVICE_API_KEY,
                    }
                }
            )
            .then(result => {
                console.log(result);
                setLoading(false);
                setErrorMessage(result.data.message);
                // auth.signup(this.state.username, this.state.password);
                if(result.data.message=="User Created!") {
                    Router.push('/signin');
                }
            })
            .catch(error => {
                setLoading(false);
                console.log(error);
            });
        }
    }
    
    return (
        <MDBContainer 
            style={{
                width: "100vw !important",
                height:"800px", position:"relative", margin: "auto"
            }}
        >            
            <div 
                style={{
                    position: "absolute",
                    top:"50%", left:"50%",
                    transform: "translate(-50%,-50%)"
                }}
            >
                
                <form className="signUpForm" onSubmit={handleSubmit}
                    style = {{
                        justifyContent: "center",
                        alignItems: "center",
                        textAlign: "center"
                    }}
                >
                        <h2 className="text-white text-center"><b>Sign Up</b></h2>
                        <input 
                            className="form-control" 
                            type="text" 
                            placeholder="Username" 
                            style={{
                                backgroundColor: "transparent",
                                borderColor: "#00ffa1", 
                                borderWidth:"2px", 
                                width:"300px"
                            }}
                            onChange={handleUsernameChange}
                            required
                        />
                        <br/>
                        <input 
                            className="form-control"
                            type="password"
                            placeholder="Password" 
                            style={{
                                backgroundColor: "transparent",
                                borderColor: "#00ffa1", 
                                borderWidth:"2px", 
                                width:"300px"
                            }}
                            onChange={handlePasswordChange}
                            required
                        />
                        <br/>
                        <input 
                            className="form-control"
                            type="password"
                            placeholder="Re-enter Password" 
                            style={{
                                backgroundColor: "transparent",
                                borderColor: "#00ffa1", 
                                borderWidth:"2px", 
                                width:"300px"
                            }}
                            onChange={handlePasswordReentry}
                            required
                        />
                        <br/>
                        <input 
                            className="form-control"
                            type="text" 
                            placeholder="Invite Code" 
                            style={{
                                backgroundColor: "transparent",
                                borderColor: "#00ffa1", 
                                borderWidth:"2px", 
                                width:"300px"
                            }}
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
                                    disabled={disabledSubmit}
                                >
                                    <b>Sign Up</b>
                                </button>

                        }
 
                        <br/>
                        <p style={{color:"#00ffa1"}}>{errorMessage}</p>
                </form>
            </div>
        </MDBContainer>
    )
}

export default SignUp;
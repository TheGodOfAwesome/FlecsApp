import { useState, useEffect } from "react";
import axios from "axios";
import { useMoralis } from "react-moralis";
import { MDBContainer, MDBRow, MDBCol, MDBIcon } from "mdbreact";
import useNativeTransactions from "../hooks/useNativeTransactions";
import LoadingSpinner from "./LoadingSpinner";
import createPersistedState from 'use-persisted-state';

const useUserState = createPersistedState('user');
const useTokenState = createPersistedState('token');

const AddressAuthentication = () => {
    const [toggleItem, setToggleItem] = useState(1);
    const [loading, setLoading] = useState(false);
    const [amount, setAmount] = useState(0.000016435923949612106);
    const [amountVal, setAmountVal] = useState(16435923949612106);
    const [address, setAddress] = useState("");
    const [copied, setCopied] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const { Moralis, user, isAuthenticated, authenticate, enableWeb3 } = useMoralis();
    const [user1, setUser] = useUserState({});
    const [token, setToken] = useTokenState('');

    const options = {
        type: "native", 
        amount: Moralis.Units.Token(amount, "21"), 
        receiver: process.env.NEXT_PUBLIC_FLECS_WALLET,
        // contractAddress: ""
    }
    
    const authenticateAddress = async () =>{
        setLoading(true);
        await enableWeb3();
        await Moralis.transfer(options);
        await authenticationCall();
    }

    const executeTransaction = async () =>{
        setLoading(true);
        await enableWeb3();
        await Moralis.transfer(options);
        setLoading(false);
    }

    const authenticationCall = async () =>{
        setLoading(true);
        axios.post(
            process.env.NEXT_PUBLIC_FLECS_USER_SERVICE, 
            {
                user: user1.username,
                transaction: amountVal
            },
            {
                params: {
                    api_key: process.env.NEXT_PUBLIC_FLECS_USER_SERVICE_API_KEY,
                    token: localStorage.getItem('token'),
                }
            }
        )
        .then(result => {
            console.log(result);
            setErrorMessage(result.data.message);
            if (result.data.responsePayload == "") {
                authenticationCall();
            } else {
                setLoading(false);
                toggleItems();
            }
        })
        .catch(error => {
            setLoading(false);
            setErrorMessage("Check sign in details and retry!");
            console.log(error);
        });
    }

    async function walletConn() {
        await authenticate({signingMessage:"Mint Condition Sign In"});
        try{
            let addr = user.get('ethAddress');
            setAddress(addr);
            console.log("User Address: " + addr);
        } catch(e) { 
            console.error(e);
        }
    }
    
    function copyAddr(){
        navigator.clipboard.writeText(process.env.NEXT_PUBLIC_FLECS_WALLET);
        console.log(process.env.NEXT_PUBLIC_FLECS_WALLET)
        setCopied(true);
    }
    
    function copyAmt(){
        navigator.clipboard.writeText(amount);
        console.log(amount)
        setCopied(true);
    }

    function moveDecimal(n) {
        var l = n.toString().length-1;
        var v = n/Math.pow(10, l);
        return v;
    }

    function toggleItems(){
        if(toggleItem < 4) {
            setToggleItem(toggleItem + 1);
            if(toggleItem == 1) {
                let uniqueID = Date.now() + Math.random();
                uniqueID = moveDecimal(uniqueID);
                console.log(uniqueID);
                setAmount(uniqueID);
            }
        } else if(toggleItem == 4) {
            setToggleItem(1);
        }
    }

    async function sendWithFlecs() {
        console.log("Send with flecs!");
        await enableWeb3();                
        let uniqueID = Date.now() + Math.random();
        uniqueID = moveDecimal(uniqueID);
        console.log(uniqueID);
        // setAmount(uniqueID);
        if(!isAuthenticated) {
            await walletConn(); 
        }      
        // authenticateAddress();
        executeTransaction();
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
                <div className="signInForm"
                    style = {{
                        justifyContent: "center",
                        alignItems: "center",
                        textAlign: "center"
                    }}
                >
                    <h3 className="text-white text-center"><b>Authenticate Address</b></h3>
                    {
                        (toggleItem == 1)
                        &&
                        <div 
                            className=""
                        >
                            <img
                                className="d-block w-100"
                                src="./Auth_Illustration_1.png"
                                alt="First slide"
                                style={{
                                    width: "320px !important"
                                }}
                            />
                            <div className="input-group" style={{justifyContent: "center",alignItems: "center",textAlign: "center"}}>
                            <span
                                className="border border-success rounded"
                                style={{
                                    backgroundColor: "transparent",
                                    borderColor: "#00ffa1 !important", 
                                    borderWidth:"2px",
                                    float: "center",
                                    width:"300px",
                                    color: "white"
                                }}
                            >
                                <h3><b>0xD15...6954970</b> <MDBIcon onClick={()=>{copyAddr()}} style={{color:"#00ffa1", padding:"5px", float:"right"}} icon="clone" far/></h3>
                            </span>
                            </div>
                        </div>
                    }

                    {
                        (toggleItem == 2)
                        &&
                        <div 
                            className="input-group"
                        >
                            <img
                                className="d-block w-100"
                                src="./Auth_Illustration_2.png"
                                alt="Second slide"
                                style={{
                                    width: "363px !important"
                                }}
                            />
                            <span
                                className="border border-success rounded"
                                style={{
                                    backgroundColor: "transparent",
                                    borderColor: "#00ffa1 !important", 
                                    borderWidth:"2px", 
                                    width:"300px",
                                    color: "white"
                                }}
                            >
                                <h3><b>{amount.toFixed(14)}</b> <MDBIcon onClick={()=>{copyAmt()}} style={{color:"#00ffa1", padding:"5px", float:"right"}} icon="clone" far/></h3>
                            </span>
                        </div>
                    }

                    {
                        (toggleItem == 3)
                        &&
                        <div 
                            className="input-group"
                        >
                            <img
                                className="d-block w-100"
                                src="./Auth_Illustration_3.png"
                                alt="Third slide"
                                style={{
                                    width: "363px !important"
                                }}
                            />
                        </div>
                    }

                    {
                        (toggleItem == 4)
                        &&
                        <div 
                            className="input-group"
                        >
                            <img
                                className="d-block w-100"
                                src="./Auth_Success_Illustration.svg"
                                alt="Fourth slide"
                                style={{
                                    width: "363px !important"
                                }}
                            />
                        </div>
                    }
                    
                    <br/>
                    {   
                        (toggleItem == 3)
                        ?
                            loading
                            ?
                                <LoadingSpinner/>
                            :
                                <button 
                                    onClick={()=>{authenticationCall()}}
                                    className="btn rounded" 
                                    style={{
                                        backgroundColor: "#00ffa1", width:"300px", margin:"0px"
                                    }}
                                >
                                    <b>Authenticate</b>
                                </button>
                        :
                            <div>
                                <button 
                                    onClick={()=>{toggleItems()}}
                                    className="btn rounded" 
                                    style={{
                                        backgroundColor: "#00ffa1", width:"300px", margin:"0px"
                                    }}
                                >
                                    <b>Next</b>
                                </button>
                                {
                                    (toggleItem == 1)
                                    &&
                                    <div>
                                        <p style={{color: "#00ffa1", paddingTop:"10px"}}>OR</p>
                                        {
                                            loading
                                            ?
                                                <LoadingSpinner/>
                                            :
                                                <button 
                                                    onClick={()=>{sendWithFlecs()}}
                                                    className="btn rounded" 
                                                    style={{
                                                        backgroundColor: "#00ffa1", width:"300px", margin:"0px"
                                                    }}
                                                >
                                                    <b>Send with Flecs</b>
                                                </button>
                                        }
                                    </div>
                                }
                            </div>
                    }
                </div>
            </div>
        </MDBContainer>
    )
}

export default AddressAuthentication;
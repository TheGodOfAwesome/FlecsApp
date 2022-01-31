import { useState, useEffect } from "react";
import { MDBContainer, MDBRow, MDBCol } from "mdbreact";
import ImageCard from "./ImageCard";
import LoadingSpinner from "./LoadingSpinner";
import axios from "axios";
import createPersistedState from 'use-persisted-state';

const useUserState = createPersistedState('user');

const Hosting = () => {
    const [toggleCreate, setToggleCreate] = useState(false);
    const [user, setUser] = useUserState({});
    const [isLoading, setIsLoading] = useState(false);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [disabledSubmit, setDisabledSubmit] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        setIsLoading(true);
        axios
        .get(
                process.env.NEXT_PUBLIC_FLECS_EVENTS_SERVICE
                + '?api_key=' + process.env.NEXT_PUBLIC_FLECS_EVENTS_SERVICE_API_KEY
                + '&token=sdfsfrfsvefwecewfewfefewfefewfefe'
                + '&event_creator=' + user.username
            , 
                {
                    headers: {
                        'Accept': 'application/json'
                    }
                }
        )
        .then(result => {
            setIsLoading(false);
            if (result.data.responsePayload) {
                setEvents(result.data.responsePayload);
            }
        })
        .catch(error => {
            setIsLoading(false);
            console.log(error);
        });
    }, []);

    const show = () => {
        return(
            <>
            {
                (events.length > 0)
                &&
                events.map(vent => {
                    let count = 0;
                    return(
                        <div key={count + 1} style={{paddingTop:"3em"}}>
                            <ImageCard key={vent.id} image={vent.event_pic_url} title={vent.event_name} desc={vent.event_desc} date={vent.created_at} interested={vent.event_attending} going={vent.event_rsvps}/>
                        </div>
                    )
                })
            }
            <div
                style={{
                    paddingTop:"3em"
                }}
            >
                <button 
                    className="btn rounded" 
                    style={{
                        backgroundColor: "#00ffa1", width:"100%", margin:"0px"
                    }}
                    onClick={()=>{setToggleCreate(true)}}
                >
                    <b>Create Event</b>
                </button>
            </div>
            </>
        )
    }

    const handleSubmit = (e, data) => {
        e.preventDefault();
        
        // "event_name": "Block Talk",
        // "event_creator": "You2!",
        // "event_desc": "Blockchain Discussions for the enthusiast",
        // "event_capacity": "100",
        // "event_wallet": "Address",

        setLoading(true);
        axios.put(
            process.env.NEXT_PUBLIC_FLECS_EVENTS_SERVICE, 
            {
                event_name: e.target.event_name.value,
                event_creator: user.username,
                event_desc: e.target.event_desc.value,
                event_capacity: e.target.event_capacity.value,
                event_wallet: e.target.event_wallet.value,
            },
            {
                params: {
                    api_key: process.env.NEXT_PUBLIC_FLECS_EVENTS_SERVICE_API_KEY,
                    token: "sdfsfrfsvefwecewfewfefewfefewfefe"
                }, 
                headers: {
                    'content-type': 'application/json',
                    'Accept': 'application/json'
                }
                
            }
        )
        .then(result => {
            console.log(result);
            setLoading(false);
            setErrorMessage(result.data.message);
            Router.push('/events');
        })
        .catch(error => {
            setLoading(false);
            console.log(error);
        });
    }

    const create = () => {
        return (
            <div
                // style = {{
                //     justifyContent: "center !important",
                //     alignItems: "center !important",
                //     textAlign: "center !important"
                // }}
            >
                <form onSubmit={handleSubmit}>
                    <h2 className="text-white text-center"><b>Create Event</b></h2>
                    <input 
                        id="event_name"
                        className="form-control" 
                        type="text" 
                        placeholder="Event Name" 
                        style={{
                            backgroundColor: "transparent",
                            borderColor: "#00ffa1", 
                            borderWidth:"2px", 
                            width:"300px"
                        }}
                        // onChange={handleUsernameChange}
                        required
                    />
                    <br/>
                    <input 
                        id="event_desc"
                        className="form-control"
                        type="text"
                        placeholder="Description" 
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
                        id="event_capacity"
                        className="form-control"
                        type="text"
                        placeholder="Capacity" 
                        style={{
                            backgroundColor: "transparent",
                            borderColor: "#00ffa1", 
                            borderWidth:"2px", 
                            width:"300px"
                        }}
                        // onChange={handlePasswordReentry}
                        required
                    />
                    <br/>
                    <input 
                        id="event_wallet"
                        className="form-control"
                        type="text" 
                        placeholder="Payments Wallet" 
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
                                // disabled={disabledSubmit}
                            >
                                <b>Create Event</b>
                            </button>
                    }

                    <br/>
                    <p style={{color:"#00ffa1"}}>{errorMessage}</p>
                </form>
                <button 
                    className="btn rounded" 
                    style={{
                        backgroundColor: "#00ffa1", width:"300px", margin:"0px"
                    }}
                    onClick={()=>{setToggleCreate(false)}}
                >
                    <b>Cancel</b>
                </button>
            </div>
        )
    }

    return (
            <MDBContainer>
                {
                    toggleCreate
                    ?
                        create()
                    :
                        show()
                }
            </MDBContainer>
        )
}

export default Hosting;
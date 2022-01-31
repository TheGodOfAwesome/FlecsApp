import { useState, useEffect } from "react";
import axios from "axios";
import { MDBContainer } from "mdbreact";
import ImageCard from "./ImageCard";

const EventsList = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [events, setEvents] = useState([]);

    useEffect(() => {
        setIsLoading(true);
        axios
        .get(
            process.env.NEXT_PUBLIC_FLECS_EVENTS_SERVICE
            + '?api_key=' + process.env.NEXT_PUBLIC_FLECS_EVENTS_SERVICE_API_KEY
            + '&token=sdfsfrfsvefwecewfewfefewfefewfefe'
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
    
    return (
        <MDBContainer style={{ maxHeight:"80vh",overflowY: "scroll"}}>
            {
                (events.length > 0)
                &&
                events.map(vent => {
                    return(
                        <div key={Math.floor(Math.random() * (100 - 1) + 1)} style={{paddingTop:"3em",}}>
                            <ImageCard key={vent.id} image={vent.event_pic_url} title={vent.event_name} desc={vent.event_desc} date={vent.created_at} interested={vent.event_attending} going={vent.event_rsvps}/>
                        </div>
                    )
                })
            }
        </MDBContainer>
    )
}


export default EventsList;
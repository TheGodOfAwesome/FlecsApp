import { MDBContainer } from "mdbreact";
import EventsList from "./EventsList";
import Hosting from "./Hosting";
import Tickets from "./Tickets";

const Landing = () => {
    return (
        <MDBContainer style={{ maxHeight:"98vh", paddingTop:"3em"}}>
            {/* <h3>Your Events</h3>
            <div className="mt-2" style={{ maxHeight:"40vh",overflowY: "scroll"}}>
                <Hosting/>
            </div>
            <br/> */}
            <h3 className="text-center" style={{color:"#00FFa1"}}><b>Upcoming events</b></h3>
            <div className="mt-2" style={{ maxHeight:"98vh",overflowY: "scroll"}}>
                <EventsList/>
            </div>
            {/* <h3>Your Tickets</h3>
            <div className="mt-2" style={{ maxHeight:"25vh",overflowY: "scroll"}}>
                <Tickets/>
            </div> */}
        </MDBContainer>
    )
}

export default Landing;
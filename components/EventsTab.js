import { useState } from "react";
import { MDBContainer, MDBTabPane, MDBTabContent, MDBNav, MDBNavItem, MDBNavLink } from "mdbreact";
import EventsList from "./EventsList";
import Hosting from "./Hosting";
import Tickets from "./Tickets";

const EventsTab = () => {
    const [toggleItem, setToggleItem] = useState("1");
    const green = "#00ffa1";

    return (
        <MDBContainer >
            <MDBNav className="nav-tabs mt-5" style={{border: "none", justifyContent: "center",alignItems: "center",textAlign: "center"}}>
                <MDBNavItem style={{padding: "5px"}}>
                    <div active={toggleItem === "1" ? "1" : ""} onClick={()=>{setToggleItem("1")}} role="tab" >
                        <h3 style={{color:(toggleItem == 1) && green}}>Events</h3>
                    </div>
                </MDBNavItem>
                <MDBNavItem style={{padding: "5px"}}>
                    <div active={toggleItem === "2" ? "2" : ""} onClick={()=>{setToggleItem("2")}} role="tab" >
                        <h3 style={{color:(toggleItem == 2) && green}}>Hosting</h3>
                    </div>
                </MDBNavItem>
                <MDBNavItem style={{padding: "5px"}}>
                    <div active={toggleItem === "3" ? "3" : ""} onClick={()=>{setToggleItem("3")}} role="tab" >
                        <h3 style={{color:(toggleItem == 3) && green}}>Tickets</h3>
                    </div>
                </MDBNavItem>
            </MDBNav>
            <MDBTabContent activeItem={toggleItem} >
                <MDBTabPane tabId="1" role="tabpanel">
                    <p className="mt-2">
                        <EventsList/>
                    </p>
                </MDBTabPane>
                <MDBTabPane tabId="2" role="tabpanel">
                    <p className="mt-2">
                        <Hosting/>
                    </p>
                </MDBTabPane>
                <MDBTabPane tabId="3" role="tabpanel">
                    <p className="mt-2">
                        <Tickets/>
                    </p>
                </MDBTabPane>
            </MDBTabContent>
        </MDBContainer>
    )
}

export default EventsTab;
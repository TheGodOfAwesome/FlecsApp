import { useState } from "react";
import { MDBContainer } from "mdbreact";
import Ticket from "./Ticket";

const Tickets = () => {
    const [toggleItem, setToggleItem] = useState("1");

    return (
            <MDBContainer >
                <Ticket image="Img" title="Title" date="Date" interested="Interest" going="Going"/>
            </MDBContainer>
        )
}

export default Tickets;
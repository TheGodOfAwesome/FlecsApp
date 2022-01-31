import { useState } from "react";
import { MDBContainer } from "mdbreact";
import ImageCard from "./ImageCard";

const User = () => {
    const [toggleItem, setToggleItem] = useState("1");

    return (
            <MDBContainer>
                <ImageCard image="Img" title="Title" date="Date" interested="Interest" going="Going"/>
            </MDBContainer>
        )
}

export default User;
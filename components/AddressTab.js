import { useState } from "react";
import { MDBContainer, MDBTabPane, MDBTabContent, MDBNav, MDBNavItem, MDBNavLink } from "mdbreact";
import AddressOnboarding from "./AddressOnboarding";
import AddressAuthentication from "./AddressAuthentication";

const AddressTab = () => {
    const [toggleItem, setToggleItem] = useState("1");
    const green = "#00ffa1";

    return (
        <MDBContainer >
            <MDBNav className="nav-tabs mt-5" style={{border: "none", justifyContent: "center",alignItems: "center",textAlign: "center"}}>
                <MDBNavItem style={{padding: "5px"}}>
                    <div active={toggleItem === "1" ? "1" : ""} onClick={()=>{setToggleItem("1")}} role="tab" >
                        <h3 style={{color:(toggleItem == 1) && green}}>How To Verify</h3>
                    </div>
                </MDBNavItem>
                <MDBNavItem style={{padding: "5px"}}>
                    <div active={toggleItem === "2" ? "2" : ""} onClick={()=>{setToggleItem("2")}} role="tab" >
                        <h3 style={{color:(toggleItem == 2) && green}}>Verify Wallet</h3>
                    </div>
                </MDBNavItem>
            </MDBNav>
            <MDBTabContent activeItem={toggleItem} >
                <MDBTabPane tabId="1" role="tabpanel">
                    <p className="mt-2">
                        <AddressOnboarding/>
                    </p>
                </MDBTabPane>
                <MDBTabPane tabId="2" role="tabpanel">
                    <p className="mt-2">
                        <AddressAuthentication/>
                    </p>
                </MDBTabPane>
            </MDBTabContent>
        </MDBContainer>
    )
}

export default AddressTab;
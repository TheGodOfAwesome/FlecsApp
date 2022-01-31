import { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import { MDBContainer, MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBTooltip, MDBIcon } from "mdbreact";
import { useMoralis, useMoralisWeb3ApiCall, useMoralisWeb3Api, useMoralisQuery, useMoralisCloudFunction } from "react-moralis";
import LoadingSpinner from "./LoadingSpinner";

const Ticket = (props) => {
    const chain = "Avalanche Testnet";
    const {image, title, date, interested, going} = props;
    const { authenticate, isAuthenticated, isAuthenticating, user, Moralis } = useMoralis();
    const Web3Api = useMoralisWeb3Api();
    const {
      fetch: nftFetch,
      data: nftData,
      error: nftError,
      isLoading: nftLoading,
    } = useMoralisWeb3ApiCall(Web3Api.account.getNFTs, {
      chain: chain,
    });
    const [userState, setUserState] = useState(null);

    useEffect(() => {
        //call API every 50 seconds
        const interval = setInterval(() => {
            if (user) {
                setUserState(user);
                nftFetch();
            } else {
                authenticate({signingMessage:"Flecs Sign In"});
            }
        }, 5000);
        //clear the interval
        console.log(user, "USER");
        return () => clearInterval(interval);
    }, [user]);

    const displayNFTs = (NFTData) => {
        return (
            <>
                {
                    NFTData.length !== 0 
                    ?   
                        (
                            NFTData.result.map((element, i) => {
                                if (element.name == "Flecs") {
                                    // console.log(element);
                                    // console.log(element.owner_of);
                                    return (
                                        <div key={element.block_number} style={{paddingTop:"3em"}}>
                                            <MDBCard
                                                className='card-image text-white'
                                                key={element.block_number}
                                                style={{
                                                    backgroundColor: "#ffffff",maxHeight:"350px",maxWidth:"350px"
                                                }}
                                            >
                                                <MDBCardBody style={{backgroundColor: "#ffffff"}}>
                                                    <MDBCardText 
                                                        style = {{
                                                            justifyContent: "center",
                                                            alignItems: "center",
                                                            textAlign: "center"
                                                        }}
                                                    >
                                                        <QRCode value={element.token_address}/>
                                                    </MDBCardText>
                                                    <MDBCardText>
                                                        <MDBIcon onClick={event=>window.location.href='/events'} style={{color:"black"}} icon="ticket-alt" /> {JSON.parse(element.metadata).name}
                                                        <br/>
                                                        <a className="" href={"https://testnet.snowtrace.io/token/" + element.token_address + "?a=" + element.token_id}  target="_blank" rel="noopener noreferrer">View on Explorer</a>
                                                    </MDBCardText>
                                                </MDBCardBody>
                                            </MDBCard>
                                        </div>
                                    )
                                }
                            })
                        )
                    :   
                        <></>
                }
            </>
        )
    }
    
    return (
        <MDBContainer style={{ maxHeight:"80vh",overflowY: "scroll"}}>
            {nftData !== null ? displayNFTs(nftData) : <LoadingSpinner/>}
        </MDBContainer>
    )
}

export default Ticket;
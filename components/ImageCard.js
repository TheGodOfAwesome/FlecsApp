import { useState } from "react";
import { 
  useMoralis, useMoralisFile, useWeb3ExecuteFunction
} from "react-moralis";
import { MDBContainer, MDBModal, MDBModalBody, MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBIcon, MDBRow, MDBCol } from "mdbreact";
import { abi } from "../contracts/flecs_abi.json";
import LoadingSpinner from "./LoadingSpinner";

const ImageCard = (props) => {
    const {image, title, desc, date, interested, going} = props;
    const [modal, setModal] = useState(false);
    const [modal1, setModal1] = useState(false);
    const [loading, setLoading] = useState(false);
    const { 
      authenticate, isAuthenticated, user, login, logout, enableWeb3, isWeb3Enabled, isWeb3EnableLoading, web3EnableError, Moralis
    } = useMoralis();
    const { fetch } = useWeb3ExecuteFunction();
    const { saveFile } = useMoralisFile();
    const nft_contract_address = "0x2f784FFca017F576A093FfeA49fE166848176bB9"; // Flecs Collection Avalanche Fuji Custom Contract
    
    async function walletConn() {
        await authenticate({signingMessage:"Flecs Sign In"});
        enableWeb3();
        try{
            let addr = user.get('ethAddress');
            console.log("User Address: " + addr);
        } catch(e) { 
            console.error(e);
        }
    }

    // after token mint
    const setInteractionData = async (_response) => {
        // confirm token was minted; that total circulation increased
        console.log("RESPONSE POST-MINT:", _response);
        // resetAll(true);
    };

    // mintToken(tokenURI);
    const mintToken = async (tokenURI) => {
        const options = {
            abi: abi,
            contractAddress: nft_contract_address,
            functionName: "safeMint",
            to: user.get('ethAddress'),
            uri: tokenURI,
            params: {
                to: user.get('ethAddress'),
                uri: tokenURI,
                tokenURI: tokenURI,
            },
        };

        console.log("Options: ", options);

        await fetch({
            params: options,
            onSuccess: (response) => {setInteractionData(response); console.log("MINT COMPLETE"); setLoading(false); setModal(!modal); setModal1(!modal1)},
            onComplete: () => {console.log("MINT COMPLETE"); setLoading(false); setModal(!modal)},
            onError: (error) => {console.log("ERROR", error); setLoading(false); setModal(!modal)},
        });
    };

    async function mint() {
        setLoading(true);
        await walletConn();
        enableWeb3();
        const name = title;
        const description = desc;
        const royalties = 10 * 100;
        const imageHashString = 'Qmf7SRjAjcwugTgJ6TfbckEiRrWdEs9ZbVv4aHcgDFCyuJ';
    
        let metadata = {
            name: name,
            description: description,
            image: "/ipfs/" + imageHashString
        }
    
        const jsonFile = await saveFile(
            "metadata.json", 
            {base64 : btoa(JSON.stringify(metadata))}, 
            { saveIPFS: true }
        );
    
        const metadataHash = jsonFile._hash;
    
        const tokenURI = 'ipfs://' + metadataHash;
        console.log("TokenURI: ", tokenURI);
        mintToken(tokenURI);
    }

    return (
        <MDBContainer>
            <MDBCard
                className='card-image text-white'
                style={{
                    backgroundColor: "#000000"
                }}
                onClick={()=>{setModal(!modal)}}
            >
                <MDBCardBody>
                    <MDBCardTitle tag='h5'><MDBIcon far icon="calendar-alt" size='sm'/> {title}
                        <MDBIcon icon="info-circle" style={{ fontSize: "small", float:'right', paddingTop:'3px'}}/>
                    </MDBCardTitle>
                    <MDBCardText>
                        <MDBRow>
                            <MDBCol>
                                <div
                                    style={{
                                        // maxHeight:"50px"
                                        justifyContent: "center",
                                        alignItems: "center",
                                        textAlign: "center"
                                    }}>
                                    <img
                                        className=""
                                        src={"./" +  (Math.floor(Math.random() * (8 - 1 + 1)) + 1) + ".svg"}
                                        alt=""
                                        style={{
                                            height:"100px"
                                        }}
                                    />

                                </div>
                            </MDBCol>
                            <MDBCol>
                                <MDBIcon far icon="calendar-alt" size='sm'/> {title}
                                <br/>
                                {String(desc).substring(0,41)}
                            </MDBCol>
                        </MDBRow>
                        
                    </MDBCardText>
                    <MDBCardText small muted>
                        {date}
                    </MDBCardText>
                </MDBCardBody>
            </MDBCard>

            <MDBModal isOpen={modal} toggle={() => { setModal(!modal) }} centered size="sm" >
                <MDBModalBody style={{backgroundColor:"#111111", border:"none"}} toggle={() => {setModal(!modal)}}  className="form black">
                    <MDBContainer className="form">
                        <MDBRow style={{justifyContent: "center", alignItems: "center", textAlign: "center"}}>
                            <MDBCol md="12">
                                <p className="h5 text-center mb-4 text"> 
                                    Are you sure you want to Mint a Ticket to this event?
                                </p>
                            </MDBCol>
                        
                            { 
                                loading 
                                ? 
                                    <LoadingSpinner/> 
                                : 
                                    <div>
                                        <button style={{ backgroundColor: "#00ffa1 !important", width: "100%" }} type="button" className="btn btn-dark" onClick={() => { mint() }}> Mint</button>
                                        <br/>
                                        <button style={{ backgroundColor: "#00ffa1", width: "100%" }} type="button" className="btn btn-dark" onClick={() => { setModal(!modal) }} hover>Cancel</button>
                                        <br/>
                                    </div>
                            }
                        </MDBRow>
                    </MDBContainer>
                </MDBModalBody>
            </MDBModal>

            <MDBModal isOpen={modal1} toggle={() => { setModal1(!modal1) }} centered size="sm" >
                <MDBModalBody style={{backgroundColor:"#111111", border:"none"}} toggle={() => {setModal1(!modal1)}}  className="form black">
                    <MDBContainer className="form">
                        <MDBRow>
                            <MDBCol md="12">
                                <p className="h5 text-center mb-4 text"> 
                                    You have minted a ticket for {title}!
                                </p>
                            </MDBCol>
                        
                            <button style={{ backgroundColor: "#00ffa1", width: "100%" }} type="button" className="btn btn-dark" onClick={() => { setModal1(!modal1) }} hover>Close</button>
                            <br/>
                        </MDBRow>
                    </MDBContainer>
                </MDBModalBody>
            </MDBModal>
        </MDBContainer>
    )
}

export default ImageCard;
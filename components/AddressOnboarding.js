import Link from 'next/link';
import { MDBCarousel, MDBCarouselInner, MDBCarouselItem, MDBContainer } from "mdbreact";

const Onboarding = ({children}) => {
    return (
        <MDBContainer 
            style={{
                width: "100vw !important"
            }}
        >
            <MDBCarousel
                color="#"
                activeItem={1}
                length={4}
                showIndicators={true}
                showControls={false}
                className="z-depth-0"
                style={{
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center"
                }}
            >
                <MDBCarouselInner style={{fontFamily: "'Rubik', sans-serif", color:"#ffffff", height:"600px", position:"relative", margin: "auto"}}>
                    <MDBCarouselItem itemId="1">
                        <div style={{height:"600px",  position:"relative", margin: "auto"}}>
                            <div style={{
                                    position: "absolute",
                                    top:"50%", left:"50%",
                                    transform: "translate(-50%,-50%)"
                                }}
                            >
                                <img
                                    className="d-block w-100"
                                    src="./Auth_Illustration_1.png"
                                    alt="First slide"
                                    style={{
                                        width: "363px !important"
                                    }}
                                />
                                <h3 style={{float:"bottom"}}>
                                    Step 1
                                </h3>
                            </div>
                        </div>
                    </MDBCarouselItem>
                    <MDBCarouselItem itemId="2">
                        <div style={{height:"600px", position:"relative", margin: "auto"}}>
                            <div style={{
                                    position: "absolute",
                                    top:"50%", left:"50%",
                                    transform: "translate(-50%,-50%)"
                                }}
                            >
                                <img
                                    className="d-block w-100"
                                    src="./Auth_Illustration_2.png"
                                    alt="First slide"
                                    style={{
                                        width: "363px !important"
                                    }}
                                />
                                <h3 style={{float:"bottom"}}>
                                    Step 2
                                </h3>
                            </div>
                        </div>
                    </MDBCarouselItem>
                    <MDBCarouselItem itemId="3">
                        <div style={{height:"600px", position:"relative", margin: "auto"}}>
                            <div style={{
                                    position: "absolute",
                                    top:"50%", left:"50%",
                                    transform: "translate(-50%,-50%)"
                                }}
                            >
                                <img
                                    className="d-block w-100"
                                    src="./Auth_Illustration_3.png"
                                    alt="First slide"
                                    style={{
                                        width: "363px !important"
                                    }}
                                />
                                <h3 style={{float:"bottom"}}>
                                    Step 3
                                </h3>
                            </div>
                        </div>
                    </MDBCarouselItem>
                    <MDBCarouselItem itemId="4">
                        <div style={{height:"600px", position:"relative", margin: "auto"}}>
                            <div style={{
                                    position: "absolute",
                                    top:"50%", left:"50%",
                                    transform: "translate(-50%,-50%)"
                                }}
                            >
                                <img
                                    className="d-block w-100"
                                    src="./Auth_Success_Illustration.svg"
                                    alt="First slide"
                                    style={{
                                        width: "363px !important"
                                    }}
                                />
                                <h3 style={{float:"bottom"}}>
                                    Success
                                </h3>
                            </div>
                        </div>
                    </MDBCarouselItem>
                </MDBCarouselInner>
            </MDBCarousel>
            <div
                style={{
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center"
                }}
            >
                <Link href="/signup" passHref>
                <button className="btn rounded" style={{
                        backgroundColor: "#00ffa1", width:"300px"
                    }}
                >
                    <b>Next</b>
                </button>
                </Link>
                <br/>
                {/* Already have an account <Link href="/signin" passHref><a style={{color:"white", cursor: "pointer !important"}}>Sign in</a></Link> */}
            </div>
        </MDBContainer>
    )
}

export default Onboarding
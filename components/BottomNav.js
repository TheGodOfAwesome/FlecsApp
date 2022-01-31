import { useEffect, useState } from "react";
import Link from "next/link";
import { MDBContainer, MDBIcon, MDBRow, MDBCol, MDBFooter } from "mdbreact";
import createPersistedState from 'use-persisted-state';

const useUserState = createPersistedState('user');
const useTokenState = createPersistedState('token');

const BottomNav = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useUserState({});
    const [token, setToken] = useTokenState('');
    const green = "#00ffa1";
    const white = "#ffffff";

    useEffect(() => {
        if (
            token != null && token != '' && token.length > 0 && user.username != null
        ) {
            setIsLoggedIn(true);
            console.log(user);
            console.log(token);
        } else {
            setIsLoggedIn(false);
        }
    }, [])

    return (
        isLoggedIn
        ?
            <MDBFooter color="transparent" className="footer font-small pt-4 mt-4 text-center" 
                style={{
                    position:"fixed",
                    bottom:0,
                    width:"100%",
                    // width:"300px",
                    // justifyContent: "center",
                    // alignItems: "center",
                    // textAlign: "center"
                }}
            >
                <div className=" text-center py-3">
                    <MDBContainer fluid>
                        <MDBRow>
                            <MDBCol><MDBIcon onClick={event=>window.location.href='/'} style={{color:(window.location =="/")?green:white}} icon="home" /></MDBCol>
                            <MDBCol><MDBIcon onClick={event=>window.location.href='/events'} style={{color:(window.location.href.includes("/events"))?green:white}} icon="ticket-alt" /></MDBCol>
                            <MDBCol><MDBIcon onClick={event=>window.location.href='/wallet'} style={{color:(window.location.href.includes("/wallet"))?green:white}} icon="wallet" /></MDBCol>
                            <MDBCol><MDBIcon onClick={event=>window.location.href='/chat'} style={{color:(window.location.href.includes("/chat"))?green:white}} icon="comment" far/></MDBCol>
                            <MDBCol><MDBIcon onClick={event=>window.location.href='/profile'} style={{color:(window.location.href.includes("/profile"))?green:white}} icon="user-circle" far/></MDBCol>
                        </MDBRow>
                    </MDBContainer>
                </div>
            </MDBFooter>
        :
            <></>
    )
}

export default BottomNav;
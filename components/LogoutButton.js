import { MDBContainer } from "mdbreact";
import { useMoralis } from "react-moralis";


const Logout = () => {
    const { logout, isAuthenticating } = useMoralis();
    const loggingOut = () => {
        logout();
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.href='/';
    }

    return (
            <MDBContainer style={{paddingTop:"2em"}}>
                <button 
                    className="btn rounded" 
                    style={{
                        backgroundColor: "#00ffa1", width:"100%", margin:"0px"
                    }}
                    onClick={()=>{loggingOut()}}
                >
                    <b>Log Out</b>
                </button>
            </MDBContainer>
        )
}

export default Logout;
import Head from 'next/head'
import "@fortawesome/fontawesome-free/css/all.min.css";
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';

export default function Chat() {
  return (
    <div className="">
      <Head>
          <title>Chat</title>
          <meta name="description" content="" />
          <link rel="icon" href="/favicon.ico" />
          <link rel="preconnect" href="https://fonts.googleapis.com"/>
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true"/>
          <link href="https://fonts.googleapis.com/css2?family=Rubik:wght@600&display=swap" rel="stylesheet"></link>
      </Head>

      <div style={{height:"600px",  position:"relative", margin: "auto"}}>
        <div style={{
                position: "absolute",
                top:"50%", left:"50%",
                transform: "translate(-50%,-50%)"
            }}
        >
          <img
            className="d-block w-100"
            src="./Chat.png"
            alt="First slide"
            style={{
                width: "363px !important", paddingTop:"3em"
            }}
          />
          <h3 className="text-center" style={{float:"bottom", color:"white"}}>
            <b>Chat Coming Soon</b>
          </h3>
        </div>
      </div>
    </div>
  )
}
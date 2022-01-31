import Head from 'next/head'
import "@fortawesome/fontawesome-free/css/all.min.css";
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import LogoutButton from '../components/LogoutButton';

export default function Profile() {
  return (
    <div className="">
        <Head>
            <title>Profile</title>
            <meta name="description" content="" />
            <link rel="icon" href="/favicon.ico" />
            <link rel="preconnect" href="https://fonts.googleapis.com"/>
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true"/>
            <link href="https://fonts.googleapis.com/css2?family=Rubik:wght@600&display=swap" rel="stylesheet"></link>
        </Head>

        <LogoutButton/>
    </div>
  )
}
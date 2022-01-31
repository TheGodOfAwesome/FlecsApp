import { useState, useEffect } from "react";
import Head from 'next/head'
import "@fortawesome/fontawesome-free/css/all.min.css";
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import Onboarding from '../components/Onboarding';
import createPersistedState from 'use-persisted-state';
import Landing from '../components/Landing';

const useUserState = createPersistedState('user');
const useTokenState = createPersistedState('token');

export default function Home() {
  const [user, setUser] = useUserState({});
  const [token, setToken] = useTokenState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (
      token != null && token != '' && token.length > 0 && user.username != null
    ) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [])

  return (
    <div className="">
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true"/>
        <link href="https://fonts.googleapis.com/css2?family=Rubik:wght@600&display=swap" rel="stylesheet"></link>
      </Head>

      {
        isLoggedIn
        ?
          <Landing/>
        :
          <Onboarding/>
      }
    </div>
  )
}

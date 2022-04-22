import React from "react";
import { useMoralis } from "react-moralis";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import DevilApp from "./components/Devil/devil";
import { Minter } from "./components/Minter/minter";
import { Team } from "./components/team";

export default function Header() {

  const { authenticate, logout, isAuthenticated, user } = useMoralis();
  const style = "uppercase font-bold md:text-2xl flex-auto border z-10 font-semibold rounded-lg shadow-md text-white bg-black h-14 hover:text-black hover:bg-white dm:text-8";

  return (
    <Router>
      <div>
        <header className="z-10 flex flex-wrap p-4 bg-black gap-4">
          <Link to="/" className="flex flex-auto "><button className={style} onClick={() => null}>Home</button></Link>
          <Link to="/minter" className="flex flex-auto"> <button className={style} onClick={() => null}>Mint</button></Link>
          <Link to="/team" className="flex flex-auto"><button className={style} onClick={() => null}>Team</button></Link>
          {isAuthenticated ?
            <div className="flex flex-auto gap-4 hover:basis-1/2">
              <div>
                <p onClick={() => null} className="flex justify-center content-center flex-col  h-full text-white border z-10  p-1 ">{user?.get('ethAddress')}</p>
              </div>
              <button className={style + " flex-auto bg-red-600 "} onClick={() => logout()}>{"LogOut"}</button>
            </div> :
            <button className={style + " bg-red-600 "} onClick={() => authenticate()}>Connect wallet</button>
          }
        </header>

        <Routes>
          <Route path="/" element={<DevilApp />}>

          </Route>
          <Route path="/team" element={<Team />} />
          <Route path="/minter" element={<Minter />} />
        </Routes>
      </div>
    </Router>
  );
};
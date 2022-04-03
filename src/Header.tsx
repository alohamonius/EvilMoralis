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

export default function Navigator() {

  const { authenticate, logout, isAuthenticated, user } = useMoralis();
  const style = "uppercase font-bold md:text-2xl flex-auto border z-10 font-semibold rounded-lg shadow-md text-white bg-black h-14 hover:text-black hover:bg-white dm:text-8";

  return (
    <Router>
      <div>
        <header className="z-10 flex flex-wrap p-4 bg-black gap-4">
          <Link to="/minter"> <button className={style} onClick={() => null}>Mint</button></Link>
          <Link to="/team"><button className={style} onClick={() => null}>Team</button></Link>
          <Link to="/"><button className={style} onClick={() => null}>Home</button></Link>
        
          {isAuthenticated ?
            < >
              <p onClick={() => null} className="text-white border z-10 flex-1 p-1 ">{"You address:"+user?.get('ethAddress')}</p>
              <button className={style+ " flex-initial w-32"} onClick={() => logout()}>{"LogOut"}</button>
            </> :
            <button className={style + " bg-red-600 text-black"} onClick={() => authenticate()}>Connect wallet</button>
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
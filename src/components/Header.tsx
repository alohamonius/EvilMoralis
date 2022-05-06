import { useMoralis } from "react-moralis";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  NavLink
} from "react-router-dom";
import Home from "./Home";
import { Minter } from "./Minter/minter";
import { Team } from "./team";

export default function Header() {

  const { authenticate, logout, isAuthenticated, user } = useMoralis();
  const style = "uppercase font-bold md:text-2xl flex-auto border z-10 font-semibold rounded-lg shadow-md text-white bg-black h-14 hover:text-black hover:bg-white dm:text-8";
  const auto = ' flex flex-auto';
  return (
    <Router>
      <div>
        <header className="z-10 flex flex-wrap p-8 bg-black gap-4">
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? 'active' : 'inactive') + auto}
          >
            <button className={style} onClick={() => null}>Home</button>
          </NavLink>

          <NavLink
            to="/minter"
            className={({ isActive }) => (isActive ? 'active' : 'inactive') + auto}
          >
            <button className={style} onClick={() => null}>Minter</button>
          </NavLink>
          <NavLink
            to="/team"
            className={({ isActive }) => (isActive ? 'active' : 'inactive') + auto}
          >
            <button className={style} onClick={() => null}>Team</button>
          </NavLink>

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
          <Route path="/" element={<Home />}/>
          <Route path="/team" element={<Team />} />
          <Route path="/minter" element={<Minter />} />
        </Routes>
      </div>
    </Router>
  );
};
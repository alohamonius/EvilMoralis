import { useMoralis } from "react-moralis";
import './assets/App.css';
import Header from './Header';

function App() {
  const { authenticate, logout, isAuthenticated, user } = useMoralis();

  return (
    <>
      <div id="app" className="h-96 md:bg-top sm:bg-bottom">
        <Header></Header>
      </div></>
  );
}

export default App;
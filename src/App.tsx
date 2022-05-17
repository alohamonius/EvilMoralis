import './assets/App.css';
import { useMoralis } from "react-moralis";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink
} from "react-router-dom";
import Home from "./components/Home";
import { Minter } from "./components/Minter/minter";
import { Team } from "./components/team";
import { Modal, Button, Layout } from 'antd';
import { useState } from 'react';
import Address from './components/Address/Address';
import telegramIcon from "./assets/images/icons/telegram.svg"
import twitterIcon from "./assets/images/icons/twitter.svg"
import discordIcon from "./assets/images/icons/discord.svg"
const { Header, Footer, Sider, Content } = Layout;


function App() {
  const { authenticate, logout, isAuthenticated, user } = useMoralis();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navLinks = [
    {
      to: "/",
      text: "Home"
    },
    {
      to: "/team",
      text: "Team"
    },
    {
      to: "/minter",
      text: "Minter"
    }
  ];
  const footerLinks = [
    {
      alt: "Discord server",
      icon: discordIcon
    },
    {
      alt: "Twitter",
      icon: twitterIcon
    },
    {
      alt: "Telegram",
      icon: telegramIcon
    },
  ];

  let cursor = document.querySelector(".cursor");


  window.addEventListener("mouseover", (e) => {
    (cursor as any).style.top = e.pageY + 'px';
    (cursor as any).style.left = e.pageX + 'px';
    console.log(e);
  });


  const styles = {
    content: {
      display: "block",
      justifyContent: "center",
      fontFamily: "Roboto, sans-serif",
      color: "#041836",
      marginTop: "5vh"
    },
    header: "w-full z-20 flex flex-wrap p-8 gap-4",
    navButton: "uppercase font-bold md:text-2xl flex-auto border z-10 font-semibold rounded-lg shadow-md text-white bg-black h-14 hover:text-black hover:bg-white dm:text-8",
    link: " flex flex-auto h-12",
    iconStyle: "border p-2 w-12 h-12  md:text-1xl flex-1  z-10 font-semibold rounded-lg shadow-md text-black  h-12 bg-white",
    footer: "flex flex-0 md:gap-8 gap-4 p-4 justify-center"
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  function account(): string {
    return user?.get("ethAddress")
  };

  const Navigation = () => {
    return <>
      {
        navLinks.map(item => {
          return <>
            <NavLink to={item.to} className={({ isActive }) => (isActive ? 'active' : 'inactive') + styles.link} >
              <button className={styles.navButton} onClick={() => null}>{item.text}</button>
            </NavLink>
          </>
        })
      }
    </>
  };

  return (
    <Layout style={{ "backgroundColor": "black", height: "100vh", minHeight: "1800px", overflow: "auto" }}>
      <Router>
        <Header className={styles.header} style={{ "backgroundColor": "black", "padding": "32px" }}>
          <Navigation></Navigation>
          {
            isAuthenticated ?
              <Address address={account()} onClick={showModal}></Address>
              :
              <></>
          }
          <Modal title="Basic Modal" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
            {isAuthenticated ?
              <div className="flex flex-auto gap-4 hover:basis-1/2">
                <div>
                  <p onClick={() => null} className="flex justify-center content-center flex-col  h-full text-white border z-10  p-1 ">{account}</p>
                </div>
                <button className={styles.navButton + " flex-auto bg-red-600 "} onClick={() => logout()}>{"LogOut"}</button>
              </div> :
              <button className={styles.navButton + " bg-red-600 "} onClick={() => authenticate()}>Connect wallet</button>
            }
          </Modal>
        </Header>
        <Content style={styles.content} className="z-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/team" element={<Team />} />
            <Route path="/minter" element={<Minter />} />
          </Routes>


        </Content>


      </Router>
      <Footer className="bg-black z-10">
        <div className="flex flex-0 md:gap-8 gap-4 p-4 justify-center">
          {
            footerLinks.map(item => {
              return <button>
                <img src={item.icon} alt={item.alt} className={styles.iconStyle} />
              </button>
            })
          }
        </div>
      </Footer>

    </Layout>
  );
}

export default App;
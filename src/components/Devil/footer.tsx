import React from 'react';
import { useMoralis } from "react-moralis";

import telegramIcon from "../../assets/telegram.svg"
import twitterIcon from "../../assets/twitter.svg"
import discordIcon from "../../assets/discord.svg"

const Footer = ({ height, text }: any) => {
    const { authenticate, logout, isAuthenticated, user } = useMoralis();

    const iconStylish = "border p-2 w-12 h-12  md:text-1xl flex-1  z-10 font-semibold rounded-lg shadow-md text-black  h-12 bg-white";

    return (
        <footer>
            <section className="next bg-black h-auto">

                <div className="flex flex-0 md:gap-8 gap-4 p-4 justify-center">
                    <button>
                        <img src={discordIcon} alt="Discord server" className={iconStylish} />
                    </button>
                    <button>
                        <img src={twitterIcon} alt="Discord server" className={iconStylish} />
                    </button>
                    <button>
                        <img src={telegramIcon} alt="Discord server" className={iconStylish} />
                    </button>
                </div>
            </section>
        </footer>
    );
}
export default Footer;
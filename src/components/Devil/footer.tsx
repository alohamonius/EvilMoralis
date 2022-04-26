import React from 'react';
import { useMoralis } from "react-moralis";

import telegramIcon from "../../assets/images/icons/telegram.svg"
import twitterIcon from "../../assets/images/icons/twitter.svg"
import discordIcon from "../../assets/images/icons/discord.svg"

const Footer = () => {
    const iconStyle = "border p-2 w-12 h-12  md:text-1xl flex-1  z-10 font-semibold rounded-lg shadow-md text-black  h-12 bg-white";

    return (
        <footer>
            <section className="next bg-black h-auto">

                <div className="flex flex-0 md:gap-8 gap-4 p-4 justify-center">
                    <button>
                        <img src={discordIcon} alt="Discord server" className={iconStyle} />
                    </button>
                    <button>
                        <img src={twitterIcon} alt="Twitter" className={iconStyle} />
                    </button>
                    <button>
                        <img src={telegramIcon} alt="Telegram" className={iconStyle} />
                    </button>
                </div>
            </section>
        </footer>
    );
}
export default Footer;
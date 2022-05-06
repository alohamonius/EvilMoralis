import ParticlesConfig from '../particles.config.js'
import Particles, { ISourceOptions } from "react-tsparticles";
import telegramIcon from "../assets/images/icons/telegram.svg"
import twitterIcon from "../assets/images/icons/twitter.svg"
import discordIcon from "../assets/images/icons/discord.svg"

function Home() {
    const particlesInit = (main: any) => {
        console.log(main);
    };

    const particlesLoaded = (container: any) => {
        console.log(container);
    };

    const Second = () => {
        return (
            <section className="next bg-green-400">
                <div className="grid grid-cols-3 gap-8">
                    <span className="pt-10 col-span-3 text-8xl font-bold text-center text-red-600 bg-black"> 2222</span>
                    <span className="col-span-2 text-6xl text-black text-left font-bold uppercase pl-3" >  unique artworks</span>
                    <p className="md:col-span-2 md:text-right col-span-3 text-4xl md:text-6xl text-center font-black font-bold uppercase bg-black text-white pr-3" >By an experienced team</p>
                    <p className="md:col-span-1 md:text-right col-span-3 text-4xl  text-center  font-black font-bold p-4">The Devil  Eyes holders obtain safety, integrity, and metaversal recognition. This project blends hypebeast fashion, country club mannerisms, and spooky vibes to create unique collectibles...</p>
                </div>
            </section>
        )
    };

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
    };


    return (
        <div id="home">
            <Particles options={ParticlesConfig as ISourceOptions} init={particlesInit} loaded={particlesLoaded} />
            <section className="welcome h-full">
                <div className="devil-start bg-center flex  flex-col">
                    <p className="text-opacity-70 uppercase text-center block z-20 text-gray-100 font-thin text-4xl md:text-8xl pb-40">Introduce you niggas to the new swag</p>
                </div>
            </section>
            <Second />
            <Footer />
        </div>

    );
}
export default Home;
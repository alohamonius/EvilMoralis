import ParticlesConfig from '../particles.config.js'
import Particles, { ISourceOptions } from "react-tsparticles";


function Home() {
    const styles = {
        title: "text-opacity-70 uppercase text-center block z-20 text-gray-100 font-thin text-4xl md:text-8xl pb-40",
        devil: "bg-devil bg-center flex flex-col md:h-m sm:h-m",
        runline: "text-white text-center runnable-line h-14 text-xl uppercase text-bold opacity-100 max-h-12 overflow-hidden",
        runlineParent:"w-full bg-red-700 opacity-25 -mt-4",
        amount:"flex justify-center items-center  h-64 borderius min-w-full min-h-full",
        amountBorder:"flex justify-center py-10  col-span-3 text-8xl font-bold text-center text-red-600  w-1/3"
    }
    const content={
        amount:"2222",

    }

    const t = 'You still have a chance...';
    const particlesInit = (main: any) => {
        console.log(main);
    };

    const particlesLoaded = (container: any) => {
        console.log(container);
    };

    return (
        <div id="home" className="welcome">
            <Particles options={ParticlesConfig as ISourceOptions} init={particlesInit} loaded={particlesLoaded} />
            <div className={styles.devil}>
                <p className={styles.title}>Introduce you niggas to the new swag</p>
            </div>
            <div className={styles.runlineParent}>
                <div className={styles.runline} style={{ lineHeight: '56px' }}>
                    <span>{Array(4).join(t)}</span>
                </div>
            </div>
            <div className='flex justify-center my-4' >
                <div className={styles.amountBorder}>
                    <span className={styles.amount} > {content.amount}</span>
                </div>
            </div>

            {/* <div className="grid grid-cols-3 gap-8 next bg-green-400">
                <span className="col-span-2 sm:col-span-3 text-6xl text-black text-left font-bold uppercase pl-3" >  unique artworks</span>
                <p className="md:col-span-2 md:text-right col-span-3 text-4xl md:text-6xl text-center font-black font-bold uppercase bg-black text-white pr-3" >By an experienced team</p>
                <p className="md:col-span-1 md:text-right col-span-3 text-4xl  text-center  font-black font-bold p-4">The Devil  Eyes holders obtain safety, integrity, and metaversal recognition. This project blends hypebeast fashion, country club mannerisms, and spooky vibes to create unique collectibles...</p>
            </div> */}
        </div>
    );
}

// order-bottom: 25px solid red;
//     border-radius: 100%;
export default Home;
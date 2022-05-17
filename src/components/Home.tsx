import ParticlesConfig from '../particles.config.js'
import Particles, { ISourceOptions } from "react-tsparticles";


function Home() {
    const particlesInit = (main: any) => {
        console.log(main);
    };

    const particlesLoaded = (container: any) => {
        console.log(container);
    };

    const Second = () => {
        return (
            <div className="grid grid-cols-3 gap-8 next bg-green-400">
                <span className="pt-10 col-span-3 text-8xl font-bold text-center text-red-600 bg-black"> 2222</span>
                <span className="col-span-2 text-6xl text-black text-left font-bold uppercase pl-3" >  unique artworks</span>
                <p className="md:col-span-2 md:text-right col-span-3 text-4xl md:text-6xl text-center font-black font-bold uppercase bg-black text-white pr-3" >By an experienced team</p>
                <p className="md:col-span-1 md:text-right col-span-3 text-4xl  text-center  font-black font-bold p-4">The Devil  Eyes holders obtain safety, integrity, and metaversal recognition. This project blends hypebeast fashion, country club mannerisms, and spooky vibes to create unique collectibles...</p>
            </div>
        )
    };

    return (
        <div id="home" className="welcome">
            <Particles options={ParticlesConfig as ISourceOptions} init={particlesInit} loaded={particlesLoaded} />
            <div className="devil-start bg-center flex flex-col">
                <p className="text-opacity-70 uppercase text-center block z-20 text-gray-100 font-thin text-4xl md:text-8xl pb-40">Introduce you niggas to the new swag</p>
            </div>
            <Second />
        </div>
    );
}
export default Home;
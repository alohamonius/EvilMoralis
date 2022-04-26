import ParticlesConfig from '../../particles.config.js'
import Particles, { ISourceOptions } from "react-tsparticles";
import Hello from './hello';
import Second from './second';
import Footer from './footer';

function DevilApp() {
    const particlesInit = (main: any) => {
        console.log(main);
    };

    const particlesLoaded = (container: any) => {
        console.log(container);
    };

    return (
        <div id="home">
            <Particles options={ParticlesConfig as ISourceOptions} init={particlesInit} loaded={particlesLoaded} />
            <Hello />
            <Second />
            <Footer />
        </div>

    );
}
export default DevilApp;
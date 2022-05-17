import Blockies from 'react-blockies';

const Address = (props: any) => {
    const styles = {
        accountButton: "flex items-center justify-around bg-pink-200 flex-auto border z-10 font-semibold  hover:text-black hover:bg-black h-14 ",
        text: "text-red-600 ",
        blockies: "rounded-full border-2 "

    }
    function short(address: string) {
        return address ? address.slice(0, 6) + "..." + address.slice(-6) : "";
    }

    return <>
        <button className={styles.accountButton} onClick={props.onClick}>
                <Blockies
                    seed={props.address}
                    size={10}
                    scale={3}
                    color="#afa"
                    bgColor="#000"
                    spotColor="#fae"
                    className={styles.blockies}
                />
                <span className={styles.text}>
                    {short(props.address)}
                </span>
        </button>
    </>
};

export default Address;

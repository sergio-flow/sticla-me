import Image from "next/image";
import styles from "./page.module.css";
import AutoPlayAudio from "./AutoPlayAudio";
import MainMap from "./MainMap";
import Nav from "./Nav";

export default function Home() {
  return (
    <div className={styles.homepage}>
      <div className={styles.header}>
        <h1 className={styles.logo}><span>sticla</span>.me</h1>
        <Nav />
      </div>
      {/* <p className={styles.description}>Recicleazǎ-mǎ</p> */}
      {/* <a href="https://docs.google.com/forms/d/e/1FAIpQLSfhQuQBESXXreeSkUnwmTRTdWyVk78GiOP17pL72_ID9kiqDQ/viewform?usp=sf_link" target="_blank" className={styles.joinWaitlistButton}>Ține-mǎ la curent</a> */}
      {/* <AutoPlayAudio /> */}
      <MainMap />
    </div>
  );
}

import React, { FC, ReactElement } from 'react';
import Link from 'next/link';
import { Button } from 'semantic-ui-react';
import styles from './Home.module.scss';

export interface HomeType {
  className?: string;
}

const Home: FC<HomeType> = ({ className = '' }: HomeType): ReactElement => (
  <div className={`ice-poker-home compnoent ${className} ${styles.main_wrapper}`}>
    <video autoPlay muted className={styles.home_video}>
      <source src="https://res.cloudinary.com/dnzambf4m/video/upload/q_auto:best/v1634761194/Web_Landing_2_1_gqgruf.webm" type="video/mp4" />
    </video>

    <div className={styles.lower_section}>
      <div className={styles.button_section}>
        <Button className={styles.get_started}>
          <Link href="/ice/start">Get Started</Link>
        </Button>
        <Button className={styles.play_button} href="https://api.decentral.games/ice/play" target="_blank">
          Play
        </Button>
      </div>

      <a href="https://ice.decentral.games" target="_blank" rel="noreferrer">
        <p className={styles.wp_text}>
          Read Whitepaper
          <svg style={{ margin: '0px 0px -1px 4px' }} width="10" height="10" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12.125 8.4292L12.1177 1.09033C12.1177 0.504395 11.7295 0.101562 11.1289 0.101562H3.78271C3.21875 0.101562 2.81592 0.519043 2.81592 1.02441C2.81592 1.52246 3.24072 1.92529 3.76807 1.92529H6.45605L9.19531 1.83008L7.8916 2.97998L1.17529 9.70361C0.977539 9.90869 0.867676 10.1504 0.867676 10.3921C0.867676 10.8828 1.32178 11.3516 1.82715 11.3516C2.06885 11.3516 2.31055 11.2417 2.5083 11.0439L9.23193 4.32764L10.3965 3.0166L10.2866 5.65332V8.45117C10.2866 8.97119 10.6821 9.40332 11.1948 9.40332C11.7002 9.40332 12.125 8.97852 12.125 8.4292Z"
              fill="white"
            />
          </svg>
        </p>
      </a>
    </div>
  </div>
);

export default Home;

import { Button, Icon } from 'semantic-ui-react';
import Aux from 'components/_Aux';
import styles from './DG.module.scss';

function SectionOne(props) {
  return (
    <Aux>
      <div>
        <video
          className={styles.video}
          id="my-video"
          src="https://res.cloudinary.com/dnzambf4m/video/upload/v1622134332/Full_Screen_Background_Animation_uo9h6b.webm"
          type="video/mp4"
          frameBorder="0"
          autoPlay={props.autoPlay}
          loop
          muted
        ></video>
      </div>

      <div className={styles.home_dashboard_content}>
        <img
          src="https://res.cloudinary.com/dnzambf4m/image/upload/v1622387586/pokerPlayer_niowhw.jpg"
          className={styles.home_gif}
        />
        <h1>Hit the tables in a metaverse Casino</h1>
        <p className={styles.content}>
          Non-custodial, probably fair slots, roulette, blackjack and poker
          playable with crypto in Decentraland
        </p>

        <span className={styles.button_group}>
          <Button
            color="blue"
            className={styles.earn_dg_button}
            href="https://docs.decentral.games/"
            target="_blank"
          >
            Learn More
          </Button>
          <Button
            color="blue"
            className={styles.play_button}
            href="https://play.decentraland.org/?position=-118%2C135"
            target="_blank"
          >
            Play Now
          </Button>
        </span>
        <p>
          <Icon name="chevron down" />
        </p>
      </div>
    </Aux>
  );
}

export default SectionOne;

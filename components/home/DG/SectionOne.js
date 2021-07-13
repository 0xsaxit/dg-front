import { Button, Icon } from 'semantic-ui-react';
import cn from 'classnames';
import { useMediaQuery } from 'hooks';
import Aux from 'components/_Aux';
import styles from './DG.module.scss';

function SectionOne(props) {
  const mobile = useMediaQuery('(max-width: 768px)');

  return (
    <Aux>
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

      <div className={cn(styles.home_dashboard_content, 'container')}>
        <div
          className={cn(
            'row',
            styles.row,
            mobile ? 'text-center' : 'text-left'
          )}
        >
          <div className="col-md-9 col-lg-6">
            <h1>
              {mobile
                ? 'Hit the Tables'
                : 'Hit the tables in a metaverse Casino'}
            </h1>
            <p className={cn(styles.content, mobile ? 'px-6' : 'px-0')}>
              {mobile
                ? 'With Decentral Games coin, you own the casino. Control the profits. Vote on new games. Earn money back directly by playing.'
                : 'Non-custodial, probably fair slots, roulette, blackjack and poker playable with crypto in Decentraland'}
            </p>
            <span className={cn(styles.button_group, 'd-md-flex d-none')}>
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
          </div>
        </div>

        <p className={styles.chevron_down}>
          <Icon name="chevron down" />
        </p>
      </div>
    </Aux>
  );
}

export default SectionOne;

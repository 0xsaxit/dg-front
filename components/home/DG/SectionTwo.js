import { Button } from 'semantic-ui-react';
import cn from 'classnames';
import { useMediaQuery } from 'hooks';
import Aux from 'components/_Aux';
import styles from './DG.module.scss';

function SectionTwo() {
  const mobile = useMediaQuery('(max-width: 768px)');
  const tablet = useMediaQuery('(max-width: 992px)');

  return (
    <Aux>
      <div className="container">
        <div
          className={cn(
            'row flex-md-row flex-column-reverse',
            styles.image_span
          )}
        >
          <div
            className={cn(
              mobile
                ? 'col-md-6'
                : 'col-md-6 d-flex flex-column justify-content-center'
            )}
            style={{ position: 'relative', zIndex: '3' }}
          >
            <h1 className={styles.section_h1}>Play to Earn</h1>
            <p className={styles.section_p}>
              Play games in the metaverse and earn rewards of up to 50% of your
              expected losses back in the $DG token.
            </p>

            <span
              className={cn(
                mobile ? 'w-100 d-flex justify-content-center' : ''
              )}
            >
              <Button
                className={styles.grey_button}
                href="https://docs.decentral.games/"
                target="_blank"
              >
                Learn More
              </Button>
              <Button
                className={styles.blue_button}
                href="/games"
                target="_blank"
              >
                See Games
              </Button>
            </span>
          </div>
          <div className="col-md-6 d-flex justify-content-center">
            {!mobile && (
              <video
                className={styles.image}
                src="https://res.cloudinary.com/dnzambf4m/video/upload/v1626409937/Play_to_Earn_w4deik.webm"
                type="video/mp4"
                frameBorder="0"
                autoPlay={true}
                loop
                muted
                style={{ marginTop: 0 }}
              ></video>
            )}
            {mobile && (
              <img
                className={styles.image}
                src="https://res.cloudinary.com/dnzambf4m/image/upload/v1626536789/Screen_Shot_2021-07-17_at_5.46.07_PM_p672iu.png"
                style={{ marginTop: 0 }}
                alt="img"
              />
            )}
          </div>
        </div>
      </div>

      <div className="container">
        <div className={cn('row', styles.image_span)}>
          <div className="col-md-6 d-flex justify-content-center">
            {!mobile && (
              <video
                className={styles.image}
                src="https://res.cloudinary.com/dnzambf4m/video/upload/v1626409937/Wallet_dhloo5.webm"
                type="video/mp4"
                frameBorder="0"
                autoPlay={true}
                loop
                muted
              ></video>
            )}
            {mobile && (
              <img
                className={styles.image}
                src="https://res.cloudinary.com/dnzambf4m/image/upload/v1626536789/Screen_Shot_2021-07-17_at_5.45.43_PM_wv07nl.png"
                style={{ marginTop: 0 }}
                alt="img"
              />
            )}
          </div>

          <div
            className={cn(
              mobile
                ? 'col-md-6'
                : 'col-md-6 d-flex flex-column justify-content-center'
            )}
            style={{ position: 'relative', zIndex: '3' }}
          >
            <h1 className={styles.section_h1}>Earn APY%</h1>
            <p className={styles.section_p}>
              Stake $DG in governance and earn up to 40% in yeild rewards.
            </p>

            <span
              className={cn(
                mobile ? 'w-100 d-flex justify-content-center' : ''
              )}
            >
              <Button
                className={styles.grey_button}
                href="https://docs.decentral.games/"
                target="_blank"
              >
                Learn More
              </Button>
              <Button
                className={styles.blue_button}
                href="https://docs.decentral.games/getting-started/earn-dg-gov-rewards"
                target="_blank"
              >
                Earn APY%
              </Button>
            </span>
          </div>
        </div>
      </div>

      <div className="container">
        <div
          className={cn(
            'row flex-md-row flex-column-reverse',
            styles.image_span
          )}
        >
          <div
            className={cn(
              mobile
                ? 'col-md-6'
                : 'col-md-6 d-flex flex-column justify-content-center'
            )}
            style={{ position: 'relative', zIndex: '3' }}
          >
            <h1 className={styles.section_h1}>
              Vote in the DAO <br /> (Be The House)
            </h1>
            <p className={styles.section_p}>
              With the $DG DAO, you own the casino, You control the profits. You
              vote for new games and proposals.
            </p>

            <span
              className={cn(
                mobile ? 'w-100 d-flex justify-content-center' : ''
              )}
            >
              <Button
                className={styles.grey_button}
                href="https://docs.decentral.games/"
                target="_blank"
              >
                Learn More
              </Button>
              <Button className={styles.blue_button} href="/dg/">
                {tablet ? 'Explore' : 'Explore Treasury'}
              </Button>
            </span>
          </div>
          <div className="col-md-6 d-flex justify-content-center">
            {!mobile && (
              <video
                className={cn(mobile ? styles.image_mobile : styles.image)}
                src="https://res.cloudinary.com/dnzambf4m/video/upload/v1626409937/Vote_DAO_zqaohw.webm"
                type="video/mp4"
                frameBorder="0"
                autoPlay={true}
                loop
                muted
              ></video>
            )}
            {mobile && (
              <img
                className={styles.image}
                src="https://res.cloudinary.com/dnzambf4m/image/upload/v1626536789/Screen_Shot_2021-07-17_at_5.45.16_PM_fo1juv.png"
                style={{ marginTop: 0 }}
                alt="img"
              />
            )}
          </div>
        </div>
      </div>
    </Aux>
  );
}

export default SectionTwo;

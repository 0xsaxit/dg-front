import { Button } from 'semantic-ui-react';
import cn from 'classnames';
import { Parallax } from 'react-scroll-parallax';
import { useMediaQuery } from 'hooks';
import Aux from 'components/_Aux';
import styles from './DG.module.scss';

function SectionTwo() {
  const mobile = useMediaQuery('(max-width: 768px)');

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
                href="https://play.decentraland.org/?position=-118%2C135"
                target="_blank"
              >
                See Games
              </Button>
            </span>
          </div>
          <div className="col-md-6 d-flex justify-content-center">
            <img
              className={styles.image}
              src="https://res.cloudinary.com/dnzambf4m/image/upload/v1624651327/Coins_fmq0km.png"
            />
          </div>
        </div>
      </div>

      <div className="container">
        <div className={cn('row', styles.image_span)}>
          <div className="col-md-6 d-flex justify-content-center">
            <img
              className={styles.image}
              src="https://res.cloudinary.com/dnzambf4m/image/upload/v1624651335/Wallet_w5odv4.png"
            />
          </div>

          <div
            className={cn(
              mobile
                ? 'col-md-6'
                : 'col-md-6 d-flex flex-column justify-content-center'
            )}
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
                href="https://play.decentraland.org/?position=-118%2C135"
                target="_blank"
              >
                Earn APY%
              </Button>
            </span>
          </div>
        </div>
      </div>

      <div className="container">
        <div className={cn('row', styles.image_span)}>
          <div
            className={cn(
              mobile
                ? 'col-md-6'
                : 'col-md-6 d-flex flex-column justify-content-center'
            )}
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
                Explore Treasury
              </Button>
            </span>
          </div>
          <div className="col-md-6 d-flex justify-content-center">
            <img
              className={styles.image_coins}
              src="https://res.cloudinary.com/dnzambf4m/image/upload/v1624651335/Yes_No_DAO_meuobj.png"
            />
          </div>
        </div>
      </div>
    </Aux>
  );
}

export default SectionTwo;

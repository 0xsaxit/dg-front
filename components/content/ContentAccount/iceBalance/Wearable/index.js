import React from 'react';
import { Image, Button } from 'semantic-ui-react';
import styles from './Wearable.module.scss';

const Wearable = () => {
  const detailsGames = {
    Poker: [
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1624919779/Poker_ekorsi.jpg',
      'games-pic',
      'Poker',
      'Decentral Games poker is in beta',
      '2-6 PLAYERS • ',
      'Ice Dress Shoes',
      'https://play.decentraland.org/?position=-110%2C129&realm=dg-diamond',
      'https://decentral.games/discord',
    ],
    BlackJack: [
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1624919297/Blackjack_logt66.jpg',
      'games-pic',
      'Blackjack',
      'Decentral Games blackjack follows',
      '1-4 PLAYERS • ',
      'Ice Dress Shoes',
      'https://play.decentraland.org/?position=-119%2C136&realm=dg-diamond',
      'https://docs.decentral.games/games/blackjack',
    ],
    Roulette: [
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1624919296/Roulette_hptwtf.jpg',
      'games-pic',
      'Roulette',
      'Decentral Games roulette is standard.',
      '1-8 PLAYERS • ',
      'Ice Dress Shoes',
      'https://play.decentraland.org/?position=-119%2C136&realm=dg-diamond',
      'https://docs.decentral.games/games/roulette',
    ],
  };

  return (
    <div className={styles.wearable}>
      <div className={styles.wearable_navBAr}>
        <h2 className={styles.title}>Balances</h2>
        <Button
          className={styles.newLink}
          href="http://defi.atarichain.com/"
          target="_blank"
        >
          Buy On Open Sea
          <TopRightArrow />
        </Button>
      </div>
      <div className={styles.products_wrapper}>
        {Object.keys(detailsGames).map((item, i) => (
          <a
            href={detailsGames[item][6]}
            target="_blank"
            className={styles.products}
          >
            <span className={styles.image_wrapper}>
              <Image src={detailsGames[item][0]} className={styles.pic} />
            </span>
            <div className={styles.button_wrapper}>
              <Button
                className={styles.newLink}
                href="http://defi.atarichain.com/"
                target="_blank"
              >
                Rank 4
              </Button>
              <Button
                className={styles.newLink}
                href="http://defi.atarichain.com/"
                target="_blank"
              >
                +31%
              </Button>
              <Button
                className={styles.newLink}
                href="http://defi.atarichain.com/"
                target="_blank"
              >
                1 of 100
              </Button>
            </div>
            <p className={styles.info}>{detailsGames[item][4]}</p>
            <p className={styles.title}>{detailsGames[item][5]}</p>
            <div className={styles.wearable_buttons}>
              <Button className="nft-read-button two" target="_blank">
                Play
              </Button>
              <Button
                id={`play-now-button-games-${i + 1}`}
                color="blue"
                className="nft-button"
                target="_blank"
              >
                info
              </Button>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Wearable;

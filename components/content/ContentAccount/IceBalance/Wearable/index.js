import React from 'react';
import { Image, Button, Popup } from 'semantic-ui-react';

import TopRigthArrow from 'assets/svg/toprightarrow.svg';
import Info from 'assets/svg/info.svg';
import styles from './Wearable.module.scss';

const Wearable = () => {

  const detailsGames = {
    Poker: [
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1619566941/unnamed-1_anqn8z.png',
      'games-pic',
      'Poker',
      'Decentral Games poker is in beta',
      '2-6 PLAYERS • ',
      'Ice Dress Shoes',
      'https://play.decentraland.org/?position=-110%2C129&realm=dg-diamond',
      'https://decentral.games/discord',
    ],
    BlackJack: [
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1619566941/unnamed-1_anqn8z.png',
      'games-pic',
      'Blackjack',
      'Decentral Games blackjack follows',
      '1-4 PLAYERS • ',
      'Ice Dress Shoes',
      'https://play.decentraland.org/?position=-119%2C136&realm=dg-diamond',
      'https://docs.decentral.games/games/blackjack',
    ],
    Roulette: [
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1619566941/unnamed-1_anqn8z.png',
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
      <div className={styles.wearable_navBar}>
        <span>
        <h2 className={styles.title}>ICED Wearables</h2>
        <p>87% Max ICE Bonus</p>
        </span>
        <Button
          className={styles.newLink}
          href="http://defi.atarichain.com/"
          target="_blank"
        >
          Buy On Open Sea
          <TopRigthArrow />
        </Button>
      </div>
      <div className={styles.products_wrapper}>
        {Object.keys(detailsGames).map((item, i) => (
          <a
            href={detailsGames[item][6]}
            target="_blank"
            className={styles.products}
          >
            <div className={styles.ribbon}>
              <div class={styles.pillers}>
                <div><span class={styles.triangle_right}></span></div>
                <div><span class={styles.triangle_left}></span></div>
              </div>
              <div className={styles.content}>P2E Enabled
                <div className={styles.wear_box}>
                  <Popup
                    on='click'
                    inverted
                    position='bottom center'
                    trigger={
                      <div className={styles.wear_box_questionmark}>
                        <Info />
                      </div>
                    } 
                    pinned
                  >
                    <div className={styles.popupcard}>
                      <div className={styles.header}>
                        
                        <div className={styles.logo}>
                          <svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path 
                              d="M8.50401 17.3747C13.1652 17.3747 17 13.5399 17 8.87874C17 4.20955 13.1652 0.374725 8.49599 0.374725C3.82681 0.374725 0 4.20955 0 8.87874C0 13.5399 3.83483 17.3747 8.50401 17.3747ZM8.49599 6.30346C7.80604 6.30346 7.22841 5.72583 7.22841 5.03589C7.22841 4.32187 7.80604 3.76028 8.49599 3.76028C9.18594 3.76028 9.75554 4.32187 9.75554 5.03589C9.75554 5.72583 9.18594 6.30346 8.49599 6.30346ZM6.97168 13.3955C6.52242 13.3955 6.16942 13.0826 6.16942 12.6093C6.16942 12.1841 6.52242 11.8391 6.97168 11.8391H7.89429V8.98303H7.13214C6.67485 8.98303 6.32987 8.66212 6.32987 8.20483C6.32987 7.77161 6.67485 7.43466 7.13214 7.43466H8.77678C9.35441 7.43466 9.65125 7.82777 9.65125 8.43749V11.8391H10.3813C10.8306 11.8391 11.1836 12.1841 11.1836 12.6093C11.1836 13.0826 10.8306 13.3955 10.3813 13.3955H6.97168Z" 
                              fill="white"
                            />
                          </svg>
                        </div>
                        <div className={styles.title}>
                          Your new ICE bonus will be randomly selected within the new rank range. If unhappy with your result, you can reroll for 10,000 ICE.
                        </div>

                      </div>

                      <div className={styles.images}>
                        <div className={styles.row}>
                          <div className={styles.col}>                      
                            <div className={styles.img}>
                              <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1630857308/diamond_1_1_r6etkk.png" />
                            </div>
                            <div className={styles.rank}>
                              Rank 1
                            </div>
                            <div className={styles.percent}>
                              + 0% ICE
                            </div>
                          </div>
                          <div className={styles.col}>
                            <div className={styles.img}>
                              <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1630857308/diamond_1_1_r6etkk.png" />
                            </div>
                            <div className={styles.rank}>
                              Rank 2
                            </div>
                            <div className={styles.percent}>
                              + 10 - 29% ICE
                            </div>
                          </div>
                        </div>

                        <div className={styles.row}>
                          <div className={styles.col}>
                            <div className={styles.img}>
                              <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1630857308/diamond_1_1_r6etkk.png" />
                            </div>
                            <div className={styles.rank}>
                              Rank 3
                            </div>
                            <div className={styles.percent}>
                              + 30% - 49% ICE
                            </div>
                          </div>
                          <div className={styles.col}>
                            <div className={styles.img}>
                              <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1630857308/diamond_1_1_r6etkk.png" />
                            </div>
                            <div className={styles.rank}>
                              Rank 4
                            </div>
                            <div className={styles.percent}>
                              + 50% - 69% ICE
                            </div>
                          </div>
                        </div>

                        <div className={styles.row}>
                          <div className={styles.col}>
                            <div className={styles.img}>
                              <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1630857308/diamond_1_1_r6etkk.png" />
                            </div>
                            <div className={styles.rank}>
                              Rank 5
                            </div>
                            <div className={styles.percent}>
                              + 70% - 100% ICE
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Popup>
                </div>
              </div>  
            </div>

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

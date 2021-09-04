import React from 'react';
import { Image, Button } from 'semantic-ui-react';
import styles from './Wearable.module.scss';
const Wearable = (props) => {

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
  }
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
					<svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M12.125 8.4292L12.1177 1.09033C12.1177 0.504395 11.7295 0.101562 11.1289 0.101562H3.78271C3.21875 0.101562 2.81592 0.519043 2.81592 1.02441C2.81592 1.52246 3.24072 1.92529 3.76807 1.92529H6.45605L9.19531 1.83008L7.8916 2.97998L1.17529 9.70361C0.977539 9.90869 0.867676 10.1504 0.867676 10.3921C0.867676 10.8828 1.32178 11.3516 1.82715 11.3516C2.06885 11.3516 2.31055 11.2417 2.5083 11.0439L9.23193 4.32764L10.3965 3.0166L10.2866 5.65332V8.45117C10.2866 8.97119 10.6821 9.40332 11.1948 9.40332C11.7002 9.40332 12.125 8.97852 12.125 8.4292Z" fill="white"/>
					</svg>
					</Button>
			</div>
			<div className={styles.products_wrapper}>
					{Object.keys(detailsGames).map((item, i) => (
						<a
							href={detailsGames[item][6]}
							target="_blank"
							className={styles.products}
						>
							<span
							  className={styles.image_wrapper}
							>
								<Image
										src={detailsGames[item][0]}
										className={styles.pic}
								/>
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
								<Button
									className="nft-read-button two"
									target="_blank"
								>
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
  )
}

export default Wearable;

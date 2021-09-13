import React from 'react';
import cn from 'classnames';
import { Button } from 'semantic-ui-react';

import TopRightArrow from 'assets/svg/toprightarrow.svg';
import styles from './Balance.module.scss';

const Balance = () => {
  const balenceItems = [
    {
      icon: 'https://res.cloudinary.com/dnzambf4m/image/upload/v1631324990/ICE_Diamond_ICN_kxkaqj.svg',
      name: 'ICE',
      type: 'ICE',
      model: '122,0123 ICE',
      price: '$1,220.00',
    },
    {
      icon: 'https://res.cloudinary.com/dnzambf4m/image/upload/v1631324990/ICE_XP_ICN_f9w2se.svg',
      name: 'Gameplay XP',
      type: 'XP',
      model: '14 XP',
      price: '$0.00',
    },
    {
      icon: 'https://res.cloudinary.com/dnzambf4m/image/upload/v1631325895/dgNewLogo_hkvlps.png',
      name: 'Dcentral Game',
      type: 'DG',
      model: '2.13 DG',
      price: '$890.00',
    },
  ];

  return (
    <div className={cn("row", styles.balance)}>
      <h2 className={styles.balance_title}>Balances</h2>
      <div className={cn("row", styles.content_container)}>
        <div className={cn("col-lg-8 col-md-8 col-sm-12 col-xs-12", styles.balance_column)}>
          {balenceItems.map((item, index) => (
            <div className={styles.balance_row} key={index}>
              <div className={styles.float_left}>
                <span className={styles.img_left}>
                  <img className={styles.img + `${item.type}`} src={item.icon} />
                </span>
                <div className={styles.balance_column_header}>
                  <p className={styles.bold_text}>{item.name}</p>
                  <p className={styles.bold_text}>{item.type}</p>
                </div>
              </div>

              <div className={styles.float_right}>
                <div className={styles.text_wrapper}>
                  <p className={styles.bold_text}>{item.model}</p>
                  <p className={styles.bold_text}>{item.price}</p>
                </div>
                <Button
                  className={styles.newLink}
                  href="http://defi.atarichain.com/"
                  target="_blank"
                >
                  Buy
                  <TopRightArrow />
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div className={cn("col-lg-4 col-md-4 col-sm-12 col-xs-12", styles.reward_column)}>
          <div className={styles.reward}>
            <p className={styles.reward_header}>Play-to-Earn Rewards</p>
            <div className={styles.reward_value}>
              <p className={styles.DG_value}>1830</p>
              <img
                style={{ marginTop: '-4px' }}
                src="https://res.cloudinary.com/dnzambf4m/image/upload/v1631324990/ICE_Diamond_ICN_kxkaqj.svg"
              />
            </div>
            <p className={styles.price}>$109.32</p>
            <Button className={styles.claim_button}>Claim 1,830 ICE</Button>
            <p className={styles.sell_all}>See All Rewards</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Balance;

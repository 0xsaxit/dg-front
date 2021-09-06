import React from 'react';
import { Button } from 'semantic-ui-react';

import TopRigthArrow from 'assets/svg/toprightarrow.svg';
import styles from './Balance.module.scss';

const Balance = () => {
  
  const balenceItems = [
    {
      icon: 'https://res.cloudinary.com/dnzambf4m/image/upload/v1629713504/image_23_nm4wev.png',
      name: 'ICE',
      type: 'ICE',
      model: '122,0123 ICE',
      price: '$1,220.00',
    },
    {
      icon: 'https://res.cloudinary.com/dnzambf4m/image/upload/v1629713504/Group_175_hajl2h.png',
      name: 'Gameplay XP',
      type: 'XP',
      model: '14 XP',
      price: '$0.00',
    },
    {
      icon: 'https://res.cloudinary.com/dnzambf4m/image/upload/v1629713504/image_22_w5ecsu.png',
      name: 'Dcentral Game',
      type: 'DG',
      model: '2.13 DG',
      price: '$$890.00',
    },
  ];

  return (
    <div className={styles.balance}>
      <h2 className={styles.balance_title}>Balances</h2>
      <div className={styles.content_container}>
        <div className={styles.balance_column}>
          {balenceItems.map((item, index) => (
            <div className={styles.balance_row} key={index}>
              <span className={styles.float_left}>
                <span className={styles.img_left}>
                  <img src={item.icon} />
                </span>
                <span className={styles.balance_column_header}>
                  <p className={styles.bold_text}>{item.name}</p>
                  <p className={styles.bold_text}>{item.type}</p>
                </span>
              </span>

              <div className={styles.float_right}>
                <span className={styles.balance_column_header}>
                  <p className={styles.bold_text}>{item.model}</p>
                  <p className={styles.bold_text}>{item.price}</p>
                </span>
                <Button
                  className={styles.newLink}
                  href="http://defi.atarichain.com/"
                  target="_blank"
                >
                  Buy
                  <TopRigthArrow />
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.reward}>
          <p className={styles.reward_header}>Claim $DG Rewards</p>
          <div className={styles.reward_value}>
            <p className={styles.DG_value}>1830</p>
            <img
              style={{ marginTop: '-4px' }}
              src="https://res.cloudinary.com/dnzambf4m/image/upload/v1630857308/diamond_1_1_r6etkk.png"
            />
          </div>
          <p className={styles.price}>$109.3</p>
          <Button className={styles.claim_button}>Claim $DG</Button>
          <p className={styles.sell_all}>See all rewards</p>
        </div>
      </div>
    </div>
  );
};

export default Balance;

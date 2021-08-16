import cn from 'classnames';
import { useEffect, useContext, useState, React } from 'react';
import { GlobalContext } from '../../../../store';
import { Loader, Popup, Icon, Button, Table } from 'semantic-ui-react';
import Aux from '../../../_Aux';
import styles from './Liquidity.module.scss';
import axios from 'axios';


const Liquidity = (props) => {
  // get the treasury's balances numbers from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables

  return (
    <Aux>
      <div className={cn(styles.lower)}>
        <p className={styles.lower_header}>Liquidity Provision</p>
        <img
          src="https://res.cloudinary.com/dnzambf4m/image/upload/v1628854697/image_14_jshx1l.svg"
          className={styles.lower_img}
        />
        <p className={styles.apy_text}> APY </p>
        <p className={styles.apy_percent}> 79.12% </p>
        <p className={styles.lower_text}>
          Provide liquidity to the ETH-$DG Uniswap pool for yield rewards.
        </p>
        <Button
          className={styles.lower_button}
          onClick={() => {
            router.push('/dg/liquidity');
          }}
        >
          Provide Liquidity
        </Button>
      </div>
    </Aux>
  );
}

export default Liquidity;
import { useEffect, useContext, useState } from 'react';
import { GlobalContext } from 'store/index';
import cn from 'classnames';
import { get, map, sumBy } from 'lodash';
import Global from 'components/Constants';
import Images from 'common/Images';
import poker from 'common/Poker';
import { Modal, Button, Grid, Table } from 'semantic-ui-react';
import Aux from 'components/_Aux';
import styles from './Ice.module.scss';
import ModalWearable from 'components/modal/ModalWearable';

function Ice({ state }) {
  // get user's transaction history from the Context API store
  const [dataHistory, dataPlay, dataPoker] = state.transactions;

  // define local variables
  const [open, setOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Aux>
      <div className={styles.ice_container}>
        <div className={styles.title}>
          <ModalWearable />
        </div>
        <div>
        </div>
      </div>
    </Aux>
  );
}

export default Ice;
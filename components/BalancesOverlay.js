import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../store';
import ContentBalances from './ContentBalances';
import Aux from './_Aux';

const BalancesOverlay = () => {
  // get balances overlay state from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [visibility, setVisibility] = useState('visible');

  useEffect(() => {
    if (state.balancesOverlay) {
      setVisibility('block');
    } else {
      setVisibility('none');
    }
  }, [state.balancesOverlay]);

  function close() {
    dispatch({
      type: 'balances_overlay',
      data: 0,
    });
  }

  // set overlay visibility based on value of state.balancesOverlay
  const styles = {
    balancesContainer: {
      position: 'absolute',
      top: '240px',
      left: 10,
      right: 10,
      marginLeft: 'auto',
      marginRight: 'auto',
      background: '#ffffff',
      borderRadius: '25px',
      zIndex: 5,
      display: visibility || 'none',
    },
    close: {
      cursor: 'pointer',
      position: 'absolute',
      fontSize: '24px',
      fontWeight: 800,
      top: '250px',
      right: 25,
      color: '#000000',
      zIndex: 6,
    },
  };

  return (
    <Aux>
      {state.balancesOverlay === 2 ? (
        <span style={styles.close} onClick={close}>
          X
        </span>
      ) : null}

      <div style={styles.balancesContainer}>
        <div className="page-container">
          <div className="account-other-inner-container"></div>
          <ContentBalances />
        </div>
      </div>
    </Aux>
  );
};

export default BalancesOverlay;

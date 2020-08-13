import { useState, useEffect, useContext } from 'react';
import { Icon } from 'semantic-ui-react';
import { GlobalContext } from '../store';
import ContentBalances from './ContentBalances';
import Aux from './_Aux';

const BalancesOverlay = () => {
  // get balances overlay state from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [positions, setPositions] = useState([]);
  const [visibility, setVisibility] = useState('');

  useEffect(() => {
    if (state.userStatus) {
      setPositions(['240px', '250px']);
    }
  }, [state.userStatus]);

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
      top: '0',
      minWidth: '446px',
      marginLeft: 'calc(50% - 223px)',
      marginRight: 'auto',
      background: '#ffffff',
      borderRadius: '12px',
      zIndex: 5,
      display: visibility || 'none',
    },
    close: {
      cursor: 'pointer',
      position: 'absolute',
      fontSize: '12px',
      fontWeight: 400,
      marginLeft: 'calc(50% - 188px)',
      marginTop: '72px',
      color: '#000000',
      zIndex: 6,
    },
  };

  return (
    <Aux>
      {state.balancesOverlay === 2 ? (
        <span style={styles.close} onClick={close}>
          <span className="material-icons" style={{ fontSize: '29px' }}>
            {' '}
            close{' '}
          </span>
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

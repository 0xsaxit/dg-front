import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../store';
import ContentBalances from './ContentBalances';
import Aux from './_Aux';

const BalancesOverlay = () => {
  // get balances overlay state from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [visibilityModal, setVisibilityModal] = useState('none');
  const [visibilityAccountPage, setVisibilityAccountPage] = useState('none');

  useEffect(() => {
    if (state.balancesOverlay === 1) {
      setVisibilityModal('block');
      setVisibilityAccountPage('none');
    } else if (state.balancesOverlay === 2) {
      setVisibilityModal('none');
      setVisibilityAccountPage('block');
    } else {
      setVisibilityModal('none');
      setVisibilityAccountPage('none');
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
    balancesModal: {
      position: 'absolute',
      top: '0',
      minWidth: '446px',
      marginLeft: 'calc(50% - 223px)',
      marginRight: 'auto',
      background: '#ffffff',
      borderRadius: '12px',
      zIndex: 5,
      display: visibilityModal || 'none',
    },
    balancesAccountPage: {
      position: 'absolute',

      top: '230px',
      right: '30px',
      left: '30px',
      background: '#ffffff',
      zIndex: 5,
      display: visibilityAccountPage || 'none',
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
      {state.balancesOverlay === 1 ? (
        <span style={styles.close} onClick={close}>
          <span className="material-icons" style={{ fontSize: '29px' }}>
            {' '}
            close{' '}
          </span>
        </span>
      ) : null}

      <div style={styles.balancesModal}>
        <div className="page-container">
          <div className="account-other-inner-container"></div>
          <ContentBalances balancesOverlay={1} />
        </div>
      </div>

      <div style={styles.balancesAccountPage}>
        <div className="page-container">
          <div className="account-other-inner-container"></div>
          <ContentBalances balancesOverlay={2} />
        </div>
      </div>
    </Aux>
  );
};

export default BalancesOverlay;

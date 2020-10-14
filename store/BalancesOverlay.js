import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from './index';
import ContentBalances from '../components/content/ContentBalances';
import Aux from '../components/_Aux';

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
    } else if (state.balancesOverlay === 3) {
      setVisibilityModal('block');
      setVisibilityAccountPage('block');
    } else {
      setVisibilityModal('none');
      setVisibilityAccountPage('none');
    }
  }, [state.balancesOverlay]);

  function close() {
    if (state.balancesOverlay === 3) {
      dispatch({
        type: 'balances_overlay',
        data: 2,
      });
    } else {
      dispatch({
        type: 'balances_overlay',
        data: 0,
      });
    }
  }

  // set overlay visibility based on value of state.balancesOverlay
  const styles = {
    balancesModal: {
      position: 'absolute',
      top: '132px',
      minWidth: '400px',
      marginLeft: 'calc(50% - 200px)',
      marginRight: 'auto',
      borderRadius: '2px',
      zIndex: 9,
      display: visibilityModal || 'none',
    },
    balancesAccountPage: {
      position: 'absolute',
      top: '215px',
      right: '30px',
      left: '30px',
      zIndex: 5,
      display: visibilityAccountPage || 'none',
    },
    close: {
      cursor: 'pointer',
      position: 'absolute',
      fontSize: '12px',
      fontWeight: '100',
      marginLeft: 'calc(50% - 174px)',
      marginTop: '127px',
      color: 'black',
      zIndex: 10,
      backgroundColor: 'rgba(0, 0, 0, 0)',
    },
  };

  return (
    <Aux>
      {state.balancesOverlay === 1 || state.balancesOverlay === 3 ? (
        <span className="menu-info-close" style={styles.close} onClick={() => close()}>
          <span className="material-icons" style={{ fontSize: '29px' }}>
            close
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

import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from './index';
import ContentBalances from './ContentBalances';
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
      minWidth: '446px',
      marginLeft: 'calc(50% - 223px)',
      marginRight: 'auto',
      background: '#ffffff',
      borderRadius: '12px',
      zIndex: 9,
      border: '1px solid #edf2f9',
      boxShadow: '0 0.75rem 1.5rem rgba(18, 38, 63, 0.03)',
      display: visibilityModal || 'none',
    },
    balancesAccountPage: {
      position: 'absolute',
      top: '215px',
      right: '30px',
      left: '30px',
      background: '#f9fbfd',
      zIndex: 5,
      display: visibilityAccountPage || 'none',
    },
    close: {
      cursor: 'pointer',
      position: 'absolute',
      fontSize: '12px',
      fontWeight: 400,
      marginLeft: 'calc(50% - 188px)',
      marginTop: '204px',
      color: '#000000',
      zIndex: 10,
    },
  };

  return (
    <Aux>
      {state.balancesOverlay === 1 || state.balancesOverlay === 3 ? (
        <span style={styles.close} onClick={() => close()}>
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

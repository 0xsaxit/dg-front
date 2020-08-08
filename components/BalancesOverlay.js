import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../store';
import ContentBalances from './ContentBalances';

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

  const styles = {
    balancesContainer: {
      position: 'absolute',
      top: '400px',
      left: 0,
      right: 0,
      marginLeft: 'auto',
      marginRight: 'auto',
      zIndex: 4,
      display: visibility,
    },
  };

  // function balancesOverlay() {
  return (
    <div style={styles.balancesContainer}>
      <ContentBalances />
    </div>
  );
  // }

  // return balancesOverlay();
};

export default BalancesOverlay;

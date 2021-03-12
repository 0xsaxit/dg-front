import { useEffect, useContext } from 'react';
import { GlobalContext } from './index';
import Fetch from '../common/Fetch';
import Fortmatic from 'fortmatic';
import Web3 from 'web3';

function WalletProvider() {
  // dispatch user's status value to the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  let userAddress = '';
  const fm = new Fortmatic('pk_live_C9EC08967C16ABA1');

  useEffect(() => {
    if (window.ethereum) {
      const walletProvider = new Web3(fm.getProvider());
      userAddress = window.ethereum.selectedAddress;

      if (userAddress) {
        // set user status to 3 to denote fetching user status, and dispatch the user address
        dispatch({
          type: 'wallet_provider',
          data: walletProvider,
        });
      }
    }
  }, []);

  return null;
}

export default walletProvider;

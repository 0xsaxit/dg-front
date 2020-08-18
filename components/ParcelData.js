import { useEffect, useContext } from 'react';
import Web3 from 'web3';
import { GlobalContext } from '../store';
import Global from './Constants';

// 0x968ba97EC67b5F8017419e640e19D2a0c95Bd6E2 // test account

function ParcelData() {
  // dispatch user's parcel data to the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  let userAddress = '';
  let landID = '3'; // hard-code to Tominoya for now
  let web3 = {};

  useEffect(() => {
    if (state.userStatus) {
      userAddress = window.web3.currentProvider.selectedAddress;
      web3 = new Web3(window.ethereum); // pass MetaMask provider to Web3 constructor

      (async function () {
        const tokenID = await getTokenID();

        // if user owns an NFT fetch parcel data for this particular token ID
        if (tokenID) {
          const response = await Global.fetchParcelData(landID, tokenID);
          const jsonData = await response.json();

          dispatch({
            type: 'parcel_data',
            data: jsonData,
          });
        }
      })();
    }
  }, [state.userStatus]);

  // get owner's token ID from NFT smart contract
  async function getTokenID() {
    try {
      const NFT_CONTRACT = new web3.eth.Contract(
        Global.ABIs.TOMINOYA_TOKEN,
        Global.ADDRESS_TOMINOYA
      );

      const tokenID = await NFT_CONTRACT.methods
        .tokenOfOwnerByIndex(userAddress, 0)
        .call();

      return tokenID;
    } catch (error) {
      console.log('No NFT token ID found');

      return false;
    }
  }

  return null;
}

export default ParcelData;

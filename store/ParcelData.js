import { useEffect, useContext } from 'react';
import { GlobalContext } from './index';
import Web3 from 'web3';
import ABI_TOMINOYA_TOKEN from '../components/ABI/ABITominoya';
import Global from '../components/Constants';
import Fetch from '../common/Fetch';

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
        // if user owns an NFT fetch parcel data for this particular token ID
        const tokenID = await getTokenID();
        if (tokenID) {
          const response = await Fetch.PARCEL_DATA(landID, tokenID);
          const jsonData = await response.json();

          dispatch({
            type: 'parcel_data_user',
            data: jsonData,
          });
        }

        // get all token data for the /admin area
        const response = await Fetch.PARCEL_DATA(landID, '*');
        const jsonData = await response.json();

        dispatch({
          type: 'parcel_data_all',
          data: jsonData,
        });
      })();
    }
  }, [state.userStatus]);

  // get owner's token ID from NFT smart contract
  async function getTokenID() {
    try {
      const NFT_CONTRACT = new web3.eth.Contract(
        ABI_TOMINOYA_TOKEN,
        Global.API_ADDRESSES.TOMINOYA_ADDRESS
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

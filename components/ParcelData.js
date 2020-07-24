import { useEffect, useContext } from 'react';
// import Web3 from 'web3';
import { GlobalContext } from '../store';
import Global from './Constants';

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
function ParcelData() {
  // dispatch user's parcel data to the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  let userAddress = '0x968ba97EC67b5F8017419e640e19D2a0c95Bd6E2'; // temporary
  let landID = '3'; // hard-code to Tominoya for now
  let web3 = {};

  useEffect(() => {
    if (window.web3) {
      // userAddress = window.web3.currentProvider.selectedAddress;
      web3 = new Web3(window.ethereum); // use the MetaMask provider

      (async function () {
        // get the owner's token ID from NFT smart contract
        const tokenID = await getTokenID();

        // make call to server API and fetch parcel data for this particular parcel
        // const response = await Global.getParcelData(landID, tokenID);

        // console.log('nft response...');
        // console.log(response);

        // dispatch({
        //   type: 'parcel_data',
        //   data: response,
        // });
      })();
    }
  }, []);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // get owner's token ID from NFT smart contract
  async function getTokenID() {
    try {
      const NFT_CONTRACT = window.web3.eth
        .contract(Global.ABIs.TOMINOYA_TOKEN)
        .at(Global.ADDRESS_TOMINOYA);

      console.log('nft contract...');
      console.log(NFT_CONTRACT);

      // await NFT_CONTRACT.tokenOfOwnerByIndex(
      //   userAddress,
      //   0,

      //   (err, tokens) => {
      //     if (err) {
      //       console.log('Get token ID error: ' + err);
      //       return;
      //     }

      //     const arrayToString = tokens.c.join('');
      //     return arrayToString;

      //     // fooFoo(arrayToString);
      //   }
      // );

      // const tokens = await NFT_CONTRACT.tokenOfOwnerByIndex(userAddress, 0);

      // const arrayToString = tokens.c.join('');
      // return arrayToString;
    } catch (error) {
      console.log('Get token ID error: ', error);
    }
  }

  // async function fooFoo(tokenID) {
  //   const response = await Global.getParcelData(landID, tokenID);

  //   console.log('nft response...');
  //   console.log(response);

  //   dispatch({
  //     type: 'parcel_data',
  //     data: response,
  //   });
  // }

  return null;
}

export default ParcelData;

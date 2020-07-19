import { useEffect, useContext } from 'react';
import { GlobalContext } from '../store';
import Global from './Constants';

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
function ParcelData() {
  const [state, dispatch] = useContext(GlobalContext);
  let userAddress = '0x968ba97EC67b5F8017419e640e19D2a0c95Bd6E2'; // temporary
  let landID = '3'; // hard-code to Tominoya for now

  useEffect(() => {
    if (window.web3) {
      // userAddress = window.web3.currentProvider.selectedAddress;

      async function fetchData() {
        // get the owner's token ID from NFT smart contract
        const tokenID = await getTokenID();

        // make call to server API and fetch parcel data for this particular parcel
        const response = await getParcelData(tokenID);

        dispatch({
          type: 'parcel_data',
          data: response,
        });
      }
      fetchData();
    }
  }, []);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // get owner's token ID from NFT smart contract
  async function getTokenID() {
    try {
      const NFT_CONTRACT = window.web3.eth
        .contract(Global.ABI_TOMINOYA)
        .at(Global.ADDRESS_TOMINOYA);

      await NFT_CONTRACT.tokenOfOwnerByIndex(
        userAddress,
        0,

        async (err, tokens) => {
          if (err) {
            console.log('Get token ID error: ' + err);
            return;
          }

          const arrayToString = tokens.c.join('');
          return arrayToString;
        }
      );
    } catch (error) {
      console.log('Get token ID error: ', error);
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // REST API functions: get parcel data for particular token ID
  async function getParcelData(tokenID) {
    const response = await fetchParcelData(tokenID);
    const json = await response.json();

    return json;
  }

  function fetchParcelData(tokenID) {
    return fetch(`${Global.API_BASE_URL}/nft/2/1`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    // return fetch(`${Global.API_BASE_URL}/nft/${landID}/${tokenID.toString()}`, {
    //   method: 'GET',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     Accept: 'application/json',
    //   },
    // });
  }

  return null;
}

export default ParcelData;

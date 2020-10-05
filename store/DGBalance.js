import { useEffect, useContext } from 'react';
import { GlobalContext } from './index';
import ABI_DG_POINTER from '../components/ABI/ABIDGPointer';
import Global from '../components/Constants';

function DGBalance() {
  // dispatch user's unclaimed DG balance to the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  let userAddress = '';
  let maticWeb3 = {};

  useEffect(() => {
    if (state.userStatus) {
      userAddress = window.web3.currentProvider.selectedAddress;

      maticWeb3 = new window.Web3(
        new window.Web3.providers.HttpProvider(Global.MATIC_URL)
      ); // pass MetaMask provider to Web3 constructor

      async function fetchData() {
        const balance = await getDGBalance();

        console.log('DG points balance: ' + balance);

        // update global state unclaimed DG balance
        dispatch({
          type: 'dg_points',
          data: balance,
        });
      }
      fetchData();
    }
  }, [state.userStatus]);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // get user's unclamed DG points (balance) amount
  // async function getDGBalance() {
  //   const addresses = await Global.API_ADDRESSES;

  //   const DG_CONTRACT = maticWeb3.eth
  //     .contract(Global.ABIs.DG_POINTER)
  //     .at(addresses.DG_POINTER_ADDRESS);

  //   try {
  //     // const DGPoints = await Global.getDGPoints(DG_CONTRACT, userAddress)

  //     const DGPoints = await DG_CONTRACT.pointsBalancer(userAddress);

  //     const pointsAdjusted = (DGPoints / FACTOR)
  //       .toFixed(3)
  //       .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  //     return pointsAdjusted;
  //   } catch (error) {
  //     console.log('Get DG balance error: ' + error);
  //   }
  // }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // get user's DG points balance from smart contract
  function getDGBalance() {
    return new Promise(async (resolve, reject) => {
      console.log("Get user's DG points balance from smart contract");

      const addresses = await Global.API_ADDRESSES;

      const dgPointerContract = maticWeb3.eth
        .contract(ABI_DG_POINTER)
        .at(addresses.DG_POINTER_ADDRESS);

      try {
        dgPointerContract.pointsBalancer(userAddress, async function (
          err,
          amount
        ) {
          if (err) {
            console.log('Get balance failed', err);
            reject(false);
          }

          const pointsAdjusted = (amount / Global.FACTOR)
            .toFixed(3)
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

          resolve(pointsAdjusted);
        });
      } catch (error) {
        console.log('No DG points found: ' + error);
      }
    });
  }

  return null;
}

export default DGBalance;

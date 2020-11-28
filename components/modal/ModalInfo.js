import { useEffect, useState, useContext } from 'react';
import { Modal, Button, Divider, Icon } from 'semantic-ui-react';
import { GlobalContext } from '../../store';
import Images from '../../common/Images';
import Fetch from '../../common/Fetch';


const ModalInfo = () => {
  // get user's unclaimed DG balance from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [open, setOpen] = useState(false);
  const [DGTotal, setDGTotal] = useState(0);
  const [DGTotal_2, setDGTotal_2] = useState(0);
  const [marketCap, setMarketCap] = useState(0);
  const [supply, setSupply] = useState(0);
  const [mainMATIC, setMainMATIC] = useState(0);

  let tokenAddress = "0xee06a81a695750e71a662b51066f2c74cf4478a0";
  let walletAddress = state.userInfo[1];

  // The minimum ABI to get ERC20 Token balance
  let minABI = [
    // balanceOf
    {
      "constant":true,
      "inputs":[{"name":"_owner","type":"address"}],
      "name":"balanceOf",
      "outputs":[{"name":"balance","type":"uint256"}],
      "type":"function"
    },
    // decimals
    {
      "constant":true,
      "inputs":[],
      "name":"decimals",
      "outputs":[{"name":"","type":"uint8"}],
      "type":"function"
    }
  ];

  // Get ERC20 Token contract instance
  let contract = web3.eth.contract(minABI).at(tokenAddress);

  useEffect(() => {
    // Call balanceOf function
    contract.balanceOf(walletAddress, (error, balance) => {
      // Get decimals
      contract.decimals((error, decimals) => {
        // calculate a balance
        let temp = balance.div(10**decimals);
        let temp_2 = temp.toFixed(3);
        balance = temp_2.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        setMainMATIC(balance);
        console.log(mainMATIC);
      });
    });
  }, []);

  useEffect(() => {

    const totalDG =
      parseFloat(state.userBalances[2][0]) +
      parseFloat(state.userBalances[2][1]) +
      parseFloat(state.DGBalances[0]) +
      parseFloat(state.DGBalances[1]) +
      parseFloat(state.DGBalances[2]) +
      parseFloat(state.DGBalances[3]);
    const totalDGAdjusted = totalDG
      .toFixed(0)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    setDGTotal(totalDGAdjusted);

    const totalDGAdjusted_2 = totalDG.toFixed(3);
    setDGTotal_2(totalDGAdjusted_2);

  }, [state.DGBalances, state.userBalances]);


  // fetch circulating supply
  useEffect(() => {

    (async function () {
      const response = await Fetch.DG_SUPPLY();
      const json = await response.json();
      setSupply(json.toLocaleString());
      let temp = (json * 15);
      setMarketCap(temp.toLocaleString());
    })();
  }, []);


  return (
    <Modal
      className="menu-info-modal"
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      close
      trigger={
        <Button color="blue" className="modal-info-button">
          <p className="right-menu-text dg">{DGTotal} DG</p>
        </Button>
      }
    >

      <div style={{ margin: '21px 30px 0px 30px' }}>
        <span className="mailchimp-close" onClick={() => setOpen(false)}>
          <Icon name="close" />
        </span>
      </div>

      <p className="mailchimp-header-text"> Your $DG Breakdown </p>

      <Divider style={{ marginTop: '-15px' }} />

      <div>
        <span style={{ display: 'flex', justifyContent: 'center' }}>
          <img
            src="https://res.cloudinary.com/dnzambf4m/image/upload/v1604946498/RotateY_05_250x250_Alpha_vkitya.gif"
            className="farming-logo"
            alt="Decentral Games Coin Logo"
          />
        </span>

        <span style={{ display: 'flex', justifyContent: 'center' }}>
          <p
            className="account-name"
            style={{
              marginLeft: '0px',
              paddingLeft: '0px',
              textAlign: 'center',
            }}
          >
            {DGTotal_2}
          </p>
        </span>
      </div>

      <div className="menu-info-container" style={{ marginTop: '24px' }}>
        <span className="menu-info-inner-span" style={{ paddingTop: '12px' }}>
          <p className="menu-info-label-link">
            <a className="menu-info-label-link" href="https://etherscan.io/token/0xee06a81a695750e71a662b51066f2c74cf4478a0">
              mainchain $DG balance
            </a>
          </p>
          <p className="menu-info-text">{mainMATIC}</p>
        </span>
        <span className="menu-info-inner-span">
          <p className="menu-info-label">
            <a className="menu-info-label-link" href="https://explorer-mainnet.maticvigil.com/address/0x2a93172c8DCCbfBC60a39d56183B7279a2F647b4/">
              matic $DG balance
            </a>
          </p>
          <p className="menu-info-text">{state.userBalances[2][1].toFixed(3)}</p>
        </span>
        <span className="menu-info-inner-span">
          <p className="menu-info-label">vested $DG</p>
          <p className="menu-info-text">{state.DGBalances[3]}</p>
        </span>
      </div>

      <div
        className="menu-info-container"
        style={{ marginTop: '12px', marginBottom: '12px' }}
      >
        <span className="menu-info-inner-span" style={{ paddingTop: '12px' }}>
          <p className="menu-info-label">unclaimed $dg - gameplay</p>
          <p className="menu-info-text">{state.DGBalances[0]}</p>
        </span>
        <span className="menu-info-inner-span">
          <p className="menu-info-label">unclaimed $dg - liquidity</p>
          <p className="menu-info-text">{state.DGBalances[1]}</p>
        </span>
        <span className="menu-info-inner-span">
          <p className="menu-info-label">unclaimed $dg - gov</p>
          <p className="menu-info-text">{state.DGBalances[2]}</p>
        </span>
      </div>

      <div className="menu-info-container" style={{ marginBottom: '30px' }}>
        <span className="menu-info-inner-span" style={{ paddingTop: '12px' }}>
          <p className="menu-info-label">price</p>
          <p className="menu-info-text">$15.00 USD</p>
        </span>
        <span className="menu-info-inner-span">
          <p className="menu-info-label">circulating supply</p>
          <p className="menu-info-text">{supply}</p>
        </span>
        <span className="menu-info-inner-span">
          <p className="menu-info-label">market capitalization</p>
          <p className="menu-info-text">${marketCap}</p>
        </span>
        <span className="menu-info-inner-span">
          <p className="menu-info-label">supply cap</p>
          <p className="menu-info-text">1,000,000</p>
        </span>
      </div>
    </Modal>
  );
};

export default ModalInfo;

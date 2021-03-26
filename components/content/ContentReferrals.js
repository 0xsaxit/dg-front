import { useEffect, useContext, useState } from 'react';
import { GlobalContext } from '../../store';
import Web3 from 'web3';
import { Button, Divider, Loader, Icon, Table } from 'semantic-ui-react';
import Aux from '../_Aux';
import Images from '../../common/Images';
import Fetch from '../../common/Fetch';
import Transactions from '../../common/Transactions';
import Global from '../Constants';


const ContentReferrals = (props) => {
  // get user's status from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);
  const [link, setLink] = useState('');

  const onCopy = () => {
    navigator.clipboard.writeText(
      Global.CONSTANTS.BASE_URL + '/' + state.userInfo[1]
    );
    setCopied(true);

    // track 'Affiliate Link' button click event
    analytics.track('Clicked AFFILIATE LINK button');
  };

  
  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////

  function contentReferrals() {
    return (
      <Aux>
        <div className="DG-liquidity-container top">
          <div className="DG-column top" style={{ minWidth: '100%' }}>
            <span style={{ display: 'flex', flexDirection: 'column' }}>
              <h3 className="DG-h3">Referral Bonuses</h3>
              <p> Copy your unique referral link and share it far and wide. Any time a new user deposits crypto, you'll earn 10% of their expected losses in MANA or DAI.
              This link will only earn you crypto when shared with a user who has not yet registered an account.</p>              
              <span style={{ display: 'flex', justifyContent: 'space-between',border: '1px solid rgb(229, 232, 235', borderRadius: '4px', padding: '3px 6px 6px 6px' }}>
                <p style={{ marginBottom: '0px' }}> https://decentral.games/{state.userAddress} </p>
                {copied == false ? (
                  <Icon className="affiliate-icon" onClick={() => onCopy()} name="copy" />
                ) : (
                  <Icon className="affiliate-icon" onClick={() => onCopy()} name="check" />
                )}
              </span>
            </span>
          </div>
        </div>

        <div className="DG-liquidity-container">
          <div className="DG-column unclaimed" style={{ minHeight: '339px' }}>
            <span style={{ display: 'flex' }}>
              <img
                src="https://res.cloudinary.com/dnzambf4m/image/upload/v1610421682/rwugnpwexjpfzfaiwdv1.png"
                className="farming-logo"
                alt="USD Logo"
              />
              <span className="farming-pool-span">
                <span>
                  <p className="welcome-text">Unclaimed</p>
                  <p className="account-name">
                    0.00
                  </p>
                </span>
              </span>
            </span>

            <Divider />

            <span
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingTop: '12px',
                paddingBottom: '12px',
              }}
            >
              <p className="earned-text">MANA</p>
              <p className="earned-amount">0.000</p>
            </span>

            <Divider />

            <span
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingTop: '12px',
                paddingBottom: '12px',
              }}
            >
              <p className="earned-text">DAI</p>
              <p className="earned-amount">0.000</p>
            </span>

            <Divider />

            <span className="DG-button-span">
              <Button disabled className="DG-claim-button">
                CLAIM RERFERRAL BONUS
              </Button>
            </span>
          </div>

          <span className="DG-tablet-container">
            <Table unstackable>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Address</Table.HeaderCell>
                  <Table.HeaderCell className="account-col-2">Claimable</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                <Table.Row>
                  <Table.Cell>
                    0xd8856cCe3F878d3Ea03964F80B18987fF1919272
                  </Table.Cell>
                  <Table.Cell className="account-col-2">
                    <img
                      src={Images.ICON_DAI}
                      style={{
                        width: '21px',
                        marginRight: '6px',
                        verticalAlign: 'middle',
                        marginTop: '-2px',
                        borderRadius: '100%',
                      }}
                    />
                    10.00 DAI
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </span>
        </div>
      </Aux>
    );
  }

  return contentReferrals();
};

export default ContentReferrals;
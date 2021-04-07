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
          <div className="DG-column unclaimed" style={{ maxHeight: '100%' }}>
            <p className="earned-amount">Unclaimed</p>

            <Divider className="divider-dg-top" />

            <span style={{ display: 'flex' }}>
              <img
                src="https://res.cloudinary.com/dnzambf4m/image/upload/v1610421682/rwugnpwexjpfzfaiwdv1.png"
                className="farming-logo-small"
                alt="Decentral Games Coin Logo"
              />
              <span className="farming-pool-span">
                <p className="welcome-text-top">Affiliate Balance</p>
                <p className="earned-amount">0.00</p>
              </span>
            </span>

            <Divider className="divider-dg-top"/>

            <span style={{ display: 'flex', flexDirection: 'column' }}>
              <p> Copy your unique referral link. Any time a new user deposits crypto, you'll earn 10% of their expected losses.</p>              
              <span style={{ display: 'flex', justifyContent: 'space-between',border: '1px solid rgb(229, 232, 235', borderRadius: '4px', padding: '3px 6px 6px 6px' }}>
                <p style={{ marginBottom: '0px' }}> https://decentral...</p>
                {copied == false ? (
                  <Icon className="affiliate-icon" onClick={() => onCopy()} name="copy" />
                ) : (
                  <Icon className="affiliate-icon" onClick={() => onCopy()} name="check" />
                )}
              </span>
            </span>

            <Divider className="divider-dg-top"/>

            <span className="DG-button-span">
              {Number(state.DGBalances.BALANCE_MINING_DG) ? (
                <Button
                  disabled
                  className="DG-claim-button"
                  id="balances-padding-correct"
                  onClick={() => metaTransaction()}
                >
                  CLAIM REFERRAL BONUS
                </Button>
              ) : (
                <Button disabled className="DG-claim-button">
                  CLAIM REFERRAL BONUS
                </Button>
              )}
            </span>
          </div>

          <span className="DG-column treasury-stats">
            <Table unstackable>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Affiliate</Table.HeaderCell>
                  <Table.HeaderCell className="account-col-2">Alias</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                <Table.Row>
                  <Table.Cell>
                    <p className="earned-amount">0xd8856cCe3F878d3Ea03964F80B18987fF1919272</p>
                  </Table.Cell>
                  <Table.Cell className="account-col-2">
                    <span style={{ display: 'flex' }}>
                      <img
                        className="avatar-picture"
                        src={`https://events.decentraland.org/api/profile/0xd8856cCe3F878d3Ea03964F80B18987fF1919272/face.png`}
                        style={{
                          width: '24px',
                          height: '24px',
                          marginRight: '6px',
                          marginTop: '2px',
                          border: '1px solid rgb(227, 232, 238)',
                          borderRadius: '100%',
                          boxShadow:
                            '0 0.75rem 1.5rem rgba(18, 38, 63, 0.03)',
                        }}
                      />
                      <p className="earned-amount">Hootie</p>
                    </span>
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
import { Button, Divider, Image, Grid } from 'semantic-ui-react';
import { useEffect, useContext, useState } from 'react';
import Aux from '../_Aux';
import { GlobalContext } from '../../store';
import Global from '../Constants';
import Fetch from '../../common/Fetch';

const ContentNFTs = (props) => {
  // get user's unclaimed DG balance from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [wearables, setWearables] = useState([]);

  useEffect(() => {
    (async function () {
      // get user nfts statistics
      if (state.userStatus) {
        let response = await Fetch.NFTS(state.userAddress);
        let json = await response.json();

        var wearables = [];
        var i;
        for (i = 0; i < json.assets.length; i++) {
          if (
            json.assets[i].asset_contract.address ==
              '0x7038e9d2c6f5f84469a84cf9bc5f4909bb6ac5e0' ||
            json.assets[i].asset_contract.address ==
              '0xbf53c33235cbfc22cef5a61a83484b86342679c5'
          ) {
            wearables.push(json.assets[i]);
          }
        }
        setWearables(wearables);
      }
    })();
  }, []);

  return (
    <Grid>
      {wearables.map((wearable, i) => (
        <Grid.Column
          computer={5}
          tablet={8}
          mobile={16}
          className="leaderboard-column"
          key={i}
        >
          <a href={wearable.permalink} className="my-nft-container">
            <div>
              <span
                style={{ display: 'flex', justifyContent: 'center' }}
                className="nft-image"
              >
                <Image
                  src={wearable.image_url}
                  className="nft-pic"
                  style={{ borderRadius: '4px' }}
                />
              </span>
              <div className="nft-description">
                <h3 className="nft-other-h3">{wearable.name}</h3>
                <span style={{ display: 'flex', justifyContent: 'center' }}>
                  <p className="nfts-info"></p>
                </span>

                <Divider
                  style={{
                    margin: '10px 0px 15px 0px',
                    width: 'calc(100% + 60px)',
                    marginLeft: '-30px',
                  }}
                />

                <p
                  className="nft-other-p"
                  style={{
                    marginTop: '-12px',
                    paddingTop: '15px',
                    textAlign: 'center',
                  }}
                >
                  {wearable.description}
                </p>

                <span
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Button
                    color="blue"
                    className="nft-button"
                    target="_blank"
                    href={wearable.permalink}
                  >
                    SELL NFT
                  </Button>
                  <Button
                    className="nft-read-button"
                    target="_blank"
                    href={wearable.permalink}
                  >
                    READ MORE
                  </Button>
                </span>
              </div>
            </div>
          </a>
        </Grid.Column>
      ))}
    </Grid>
  );
};

export default ContentNFTs;

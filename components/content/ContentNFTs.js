import { Button, Divider } from 'semantic-ui-react';
import Aux from '../_Aux';

const ContentNFTs = (props) => {
  // define local variables
  const monthNames = [
    'JANUARY',
    'FEBRUARY',
    'MARCH',
    'APRIL',
    'MAY',
    'JUNE',
    'JULY',
    'AUGUST',
    'SEPTEMBER',
    'OCTOBER',
    'NOVEMBER',
    'DECEMBER',
  ];

  const d = new Date();
  const months = [monthNames[d.getMonth()], 'TOTAL'];

  return (
    <div className="nft-container">
      <img
        src={`https://vegascity.land/vcs/vegas-city-card-tominoya${props.parcelDataUser.parcelLocation[0]},${props.parcelDataUser.parcelLocation[2]},1.png`}
        className="my-nft-pic"
        alt="Decentraland NFT Parcel Image"
      />
      <div
        className="nft-description"
        style={{ paddingLeft: '1px', paddingRight: '1px' }}
      >
        <Aux>
          <p className="nfts-info mine" style={{ width: '158px' }}>
            LOCATION: {props.parcelDataUser.parcelLocation[0]},{' '}
            {props.parcelDataUser.parcelLocation[2]}
          </p>

          <Divider style={{ marginTop: '18px' }} />

          {months.map((item, i) => {
            return (
              <Aux>
                <span
                  style={{
                    display: 'flex',
                    width: '100%',
                    justifyContent: 'space-between',
                  }}
                >
                  <p className="nft-bold-content">VOLUME ({item})</p>
                  <span>
                    <abbr className="nft-number-content">
                      {props.parcelDataUser.parcelVolume[i]} MANA
                    </abbr>
                  </span>
                </span>

                <Divider />

                <span
                  style={{
                    display: 'flex',
                    width: '100%',
                    justifyContent: 'space-between',
                  }}
                >
                  <p className="nft-bold-content">PROFIT ({item})</p>
                  <span>
                    <abbr className="nft-number-content">
                      {props.parcelDataUser.parcelRevenue[i]} MANA
                    </abbr>
                  </span>
                </span>

                <Divider />
              </Aux>
            );
          })}
        </Aux>

        <Button
          color="blue"
          className="my-nft-button"
          href={`https://play.decentraland.org/?position=${props.parcelDataUser.parcelLocation[0]}%2C${props.parcelDataUser.parcelLocation[2]}&realm=fenrir-gold`}
          target="_blank"
          style={{ marginTop: '18px' }}
        >
          Teleport in
        </Button>
      </div>
    </div>
  );
};

export default ContentNFTs;

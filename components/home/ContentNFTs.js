import { Button, Divider } from 'semantic-ui-react';
import Global from '../Constants';

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
  const months = [
    monthNames[d.getMonth()],
    'TOTAL',
  ];

  return (
    <div className="nft-container">
      <img
        src={`https://vegascity.land/vcs/vegas-city-card-tominoya${props.parcelData.parcelLocation[0]},${props.parcelData.parcelLocation[2]},1.png`}
        className="my-nft-pic"
      />
      <div className="nft-description" style={{ paddingLeft: '1px', paddingRight: '1px' }}>
        <div>
          <p className="nfts-info mine" style={{ width: '158px' }}>LOCATION:{' '}
            {props.parcelData.parcelLocation[0]},{' '}
            {props.parcelData.parcelLocation[2]}
          </p>

          <Divider style={{ marginTop: '18px' }}/>

          {months.map((item, i) => {
            return (
              <div>
                <span style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                  <p className="nft-bold-content">VOLUME ({item})</p>
                  <span>
                    <abbr
                      className="nft-number-content"
                    >
                      {props.parcelData.parcelVolume[i]} MANA
                    </abbr>
                  </span>
                </span>

                <Divider />

                <span style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                  <p className="nft-bold-content">PROFIT ({item})</p>
                  <span>
                    <abbr
                      className="nft-number-content"
                    >
                      {props.parcelData.parcelRevenue[i]} MANA
                    </abbr>
                  </span>
                </span>  

                <Divider />

              </div>
            );
          })}
        </div>


        <Button
          color="blue"
          className="my-nft-button"
          href={`https://play.decentraland.org/?position=${props.parcelData.parcelLocation[0]}%2C${props.parcelData.parcelLocation[2]}&realm=fenrir-gold`}
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

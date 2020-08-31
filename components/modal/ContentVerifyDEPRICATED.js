import { Grid } from 'semantic-ui-react';

const ContentVerify = (props) => {
  function verifyChrome() {
    return (
      <div
        className="modal-content-container"
        style={{ paddingBottom: '70px' }}
      >
        <Grid>
          <Grid.Row>
            <h3 className="modal-h3">Chrome Browser & MetaMask</h3>
          </Grid.Row>
          <Grid.Row>
            <p className="modal-p">
              Please use Chrome Browser with MetaMask enabled to proceed
            </p>
          </Grid.Row>
        </Grid>
      </div>
    );
  }

  function verifyMetaMask() {
    return (
      <div
        className="modal-content-container"
        style={{ paddingBottom: '70px' }}
      >
        <Grid>
          <Grid.Row>
            <h3 className="modal-h3">Enable MetaMask</h3>
          </Grid.Row>
          <Grid.Row>
            <p className="modal-p">
              Please install the MetaMask Ethereum wallet extension
            </p>
          </Grid.Row>
        </Grid>
      </div>
    );
  }

  if (props.content == 'chrome') {
    return verifyChrome();
  } else if (props.content == 'metamask') {
    return verifyMetaMask();
  }
};

export default ContentVerify;

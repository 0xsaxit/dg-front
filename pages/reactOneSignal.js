import React from 'react';

class ReactOneSignal extends React.Component {
  oneSignal = () => {
    return {
      __html: `window.OneSignal = window.OneSignal || []; OneSignal.push(function() { OneSignal.init({ appId: "e4f1249c-fb08-4ddf-9052-e3dded8953a9" }); });`,
    };
  };

  render = () => {
    return (
      <>
        <script src="https://cdn.onesignal.com/sdks/OneSignalSDK.js" async />
        <script dangerouslySetInnerHTML={this.oneSignal()} />
      </>
    );
  };
}

export default ReactOneSignal;

import React from 'react';
import ReactDOM from 'react-dom';

class ContentDocs extends React.Component {
  constructor(props) {
    super(props);

    this.state = { height: 0 };
  }

  componentDidMount() {
    // const height = window.document.body.scrollHeight;
    // this.setState({ height: height });

    const obj = ReactDOM.findDOMNode(this);
    this.setState({
      height: obj.contentWindow.document.body.scrollHeight + 'px',
    });

    console.log('height: ' + height);
  }

  render() {
    return (
      <iframe
        id="something"
        src="https://docs.decentral.games/"
        scrolling="no"
        style={{
          position: 'absolute',
          top: '75px',
          height: this.state.height,
          width: '100%',
          border: 'none',
        }}
      />
    );
  }
}

export default ContentDocs;

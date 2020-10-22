import React, { Component, useState } from "react";
import { render } from "react-dom";
import MailchimpSubscribe from "react-mailchimp-subscribe";
import { Modal, Button, Input, Divider } from 'semantic-ui-react';


const CustomForm = ({ status, message, onValidated }) => {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handleEmailChange(e) {
    setEmail(e.target.value);
  }

  const submit = () =>
    email &&
    name &&
    email.indexOf("@") > -1 &&
    onValidated({
      EMAIL: email,
      NAME: name
    });

  return (
    <span className="mailchimp-container">
      {status === "sending" && <div className="mailchimp-other-inner-p">sending...</div>}
      {status === "error" && (
        <div 
          className="mailchimp-other-inner-p"
          dangerouslySetInnerHTML={{ __html: message }}
        />
      )}
      {status === "success" && (
        <div 
          className="mailchimp-other-inner-p"
          dangerouslySetInnerHTML={{ __html: message }}
        />
      )}
      <Input
        className="mailchimp-input"
        onChange={handleNameChange.bind(this)}
        type="text"
        placeholder="Name"
      />
      <Input
        className="mailchimp-input"
        onChange={handleEmailChange.bind(this)}
        type="email"
        placeholder="Email"
      />
      <Button className="mailchimp-submit-button" onClick={submit}>
        Submit
      </Button>
    </span>
  );
};

class Mailchimp extends Component {
  constructor(props){
    super(props);
    this.state = {
      viewPopup: true,
      open: true,
    }
  }

  componentDidMount(){
    let visited = localStorage["alreadyVisited"];

    if(visited) {
      this.setState({ viewPopup: false })
    } else {
      localStorage["alreadyVisited"] = true;
      this.setState({ viewPopup: true});
    }
  }

  setOpen = (value) => {
    this.setState({ open: value });
  }

  render() {
    const url = "https://games.us2.list-manage.com/subscribe/post?u=167613222f6cee13b63b7cc1e&amp;id=bcab8ee1da";
    
    return (
      <div>
        {this.state.viewPopup === true ? (
          <Modal
            className="mailchimp-outter-container"
            onClose={() => this.setOpen(false)}
            onOpen={() => this.setOpen(true)}
            open={this.state.open}
            close
          >

            <span className="mailchimp-close" onClick={() => this.setOpen(false)}>
              <span className="material-icons" style={{ fontSize: '29px' }}>
                close
              </span>
            </span>

            <p className="mailchimp-header-text"> Sign Up </p>

            <Divider style={{ marginTop: '-15px', width: 'calc(100% + 60px)', marginLeft: '-30px' }} />

            <MailchimpSubscribe
              url={url}
              render={({ subscribe, status, message }) => (
                <CustomForm
                  status={status}
                  message={message}
                  onValidated={formData => subscribe(formData)}
                />
              )}
            />
          </Modal>
        ) : null }
      </div>
    );
  }
}

export default Mailchimp;
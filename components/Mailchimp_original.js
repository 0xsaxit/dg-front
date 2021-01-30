import React, { Component, useState } from 'react';
import { render } from 'react-dom';
import MailchimpSubscribe from 'react-mailchimp-subscribe';
import { Button, Input, Icon } from 'semantic-ui-react';

const CustomForm = ({ status, message, onValidated }) => {
  const [email, setEmail] = useState('');

  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handleEmailChange(e) {
    setEmail(e.target.value);
  }

  const submit = () =>
    email &&
    email.indexOf('@') > -1 &&
    onValidated({
      EMAIL: email,
    });

  return (
    <span className="mailchimp-container">
      <span style={{ display: 'flex' }}>
        <Input
          className="mailchimp-input"
          onChange={handleEmailChange.bind(this)}
          type="email"
          placeholder="Email"
        />
        <Button className="mailchimp-submit-button" onClick={submit}>
          SUBMIT
        </Button>
      </span>
      {status === 'sending' && (
        <div className="mailchimp-other-inner-p">sending...</div>
      )}
      {status === 'error' && (
        <div
          className="mailchimp-other-inner-p"
          dangerouslySetInnerHTML={{ __html: message }}
        />
      )}
      {status === 'success' && (
        <div
          className="mailchimp-other-inner-p"
          dangerouslySetInnerHTML={{ __html: message }}
        />
      )}
    </span>
  );
};

class Mailchimp extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const url =
      'https://games.us2.list-manage.com/subscribe/post?u=167613222f6cee13b63b7cc1e&amp;id=bcab8ee1da';

    return (
      <div>
        <MailchimpSubscribe
          url={url}
          render={({ subscribe, status, message }) => (
            <CustomForm
              status={status}
              message={message}
              onValidated={(formData) => subscribe(formData)}
            />
          )}
        />
      </div>
    );
  }
}

export default Mailchimp;
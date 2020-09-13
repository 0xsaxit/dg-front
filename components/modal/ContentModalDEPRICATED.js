import { Form, Input } from 'semantic-ui-react';

const ContentModal = (props) => {
  // define local variables
  const [amount, setAmount] = useState(0);

  function inputChange(e) {
    const valueWei = e.target.value * Global.FACTOR;
    setAmount(valueWei);
  }

  return (
    <span style={{ display: 'flex' }}>
      <Form.Field>
        <Input
          className="admin-modal-input"
          placeholder={'ENTER AMOUNT'}
          action={{
            color: 'blue',
            labelPosition: 'right',
            content: 'DEPOSIT',
            icon: 'ethereum',
            onClick: () => setTransaction(true),
          }}
          onChange={inputChange}
        />
      </Form.Field>

      <span
        className={
          props.gameSelect === 'dai' ? 'account-select dai' : 'account-select'
        }
        onClick={() => props.handleChange('dai')}
      >
        <img
          style={{
            verticalAlign: 'middle',
            marginTop: '35px',
          }}
          className="image inline"
          width="21px"
          height="21px"
          src={Global.IMAGES.DAI_CIRCLE}
        />
        DAI
      </span>

      <span
        className={
          props.gameSelect === 'mana' ? 'account-select mana' : 'account-select'
        }
        onClick={() => props.handleChange('mana')}
      >
        <img
          style={{
            verticalAlign: 'middle',
            marginTop: '35px',
          }}
          className="image inline"
          width="21px"
          height="21px"
          src={Global.IMAGES.MANA_CIRCLE}
        />
        MANA
      </span>
    </span>
  );
};

export default ContentModal;

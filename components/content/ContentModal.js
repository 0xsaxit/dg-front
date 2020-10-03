import { useState, useEffect, useContext } from 'react'
import { GlobalContext } from '../../store'
import { Form, Input } from 'semantic-ui-react'
import Global from '../Constants'

const ContentModal = (props) => {
  // get user's status from the Context API store
  const [state, dispatch] = useContext(GlobalContext)

  // define local variables
  const [amount, setAmount] = useState(0)
  const [transaction, setTransaction] = useState(false)

  let userAddress = ''
  let web3 = {}

  useEffect(() => {
    if (state.userStatus) {
      userAddress = window.web3.currentProvider.selectedAddress
      web3 = new Web3(window.ethereum) // pass MetaMask provider to Web3 constructor

      if (transaction && amount) {
        if (props.type === 'deposit') {
          depositFunds() // MetaMask popup window
        } else {
          withdrawFunds() // MetaMask popup window
        }
      } else {
        setTransaction(false)
      }
    }
  }, [state.userStatus, transaction, amount])

  function inputChange(e) {
    const valueWei = e.target.value * Global.FACTOR
    setAmount(valueWei)
  }

  async function depositFunds() {
    props.showModal(false) // close the modal

    const txHash = await Global.depositToParent(
      props.gameTypeInt,
      0,
      amount,
      userAddress,
      web3,
    )
    console.log('Tx Hash: ' + txHash)

    initializePings()
  }

  async function withdrawFunds() {
    props.showModal(false) // close the modal

    const txHash = await Global.withdrawFromParent(
      props.gameTypeInt,
      0,
      amount,
      userAddress,
      web3,
    )
    console.log('Tx Hash: ' + txHash)

    initializePings()
  }

  function initializePings() {
    console.log('Ping token contract')

    // ping token contract for transaction confirmation
    dispatch({
      type: 'token_pings',
      data: 2,
    })

    // display message box pending message
    // dispatch({
    //   type: 'message_box',
    //   data: 1,
    // });
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
            content: `${props.type}`,
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
  )
}

export default ContentModal

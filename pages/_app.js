import { Provider } from '../store'
import App from 'next/app'
import 'decentraland-ui/lib/styles.css'
import '../static/css/main.css'
import '../static/css/agate.css'
import '../static/css/blog.css'
import '../static/css/spinner.css'
import '../static/css/mobile.css'
import UserStatus from '../store/UserStatus'
import UserBalances from '../store/UserBalances'
import BalancesEvents from '../store/BalancesEvents'
import Transactions from '../store/Transactions'
import ParcelData from '../store/ParcelData'
import GameRecords from '../store/GameRecords'
import BalancesOverlay from '../store/BalancesOverlay'
import Location from '../store/Location'
import ActiveStatus from '../store/ActiveStatus'
import UserInfo from '../store/UserInfo'
import AdminBalances from '../store/AdminBalances'
import AdminData from '../store/AdminData'

class Application extends App {
  render() {
    const { Component, pageProps, store } = this.props

    return (
      <Provider store={store}>
        <UserStatus />
        <UserBalances />
        <BalancesEvents />
        <Transactions />
        <ParcelData />
        <GameRecords />
        <BalancesOverlay />
        <Location />
        <ActiveStatus />
        <UserInfo />
        <AdminBalances />
        <AdminData />

        <Component {...pageProps} />
      </Provider>
    )
  }
}

export default Application

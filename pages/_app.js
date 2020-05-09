import React from 'react'
import { Provider } from '../store'
import App from 'next/app'
import 'decentraland-ui/lib/styles.css'
import "../static/css/main.css";
import "../static/css/agate.css";
import "../static/css/blog.css";
import "../static/css/spinner.css";


class Application extends App {
    render () {
        const { Component, pageProps, store } = this.props;
        return (
            <>
                <Provider store={store}>
                    <Component {...pageProps} />
                </Provider>
            </>
        )
    }
}
export default Application
  

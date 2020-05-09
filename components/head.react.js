import React, {Component} from 'react'
import { withRouter } from 'next/router'
import Head from 'next/head'

class defHeader extends Component {
    render() {
        return (
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
                <title key="title">Decentral Game</title>
                <meta key="og:title" property="og:title" content="Game Title" />
                <meta key="og:description" property="og:description" content="Description" />
            </Head>
        );
    }
}

export default withRouter(defHeader)
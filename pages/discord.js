import React from 'react'

export default class extends React.Component {
    static async getInitialProps({ res }) {
        if (res) {
            res.writeHead(301, {
                Location: 'https://discord.gg/cvbSNzY'
            })
            res.end()
        } else {
            window.location = 'https://discord.gg/cvbSNzY'
        }
        return {}
    }
}
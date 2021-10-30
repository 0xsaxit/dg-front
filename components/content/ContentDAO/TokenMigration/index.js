import React, { useState, useEffect, useContext } from 'react'
import Link from 'next/link'
import { GlobalContext } from '../../../../store'
import { Button } from 'semantic-ui-react'
import styles from './TokenMigration.module.scss'

const TokenMigration = () => {
    // define local variables
    const [network, setNetwork] = useState('Polygon');

    return (
        <div className={styles.main_wrapper}>
            <div className={styles.title}>
                <h1>Token Migration</h1>
                <p>
                    Migrate your legacy $DG tokens to the new $DG token.<br />
                    Conversion at 1 : 1,000. Read more about the migration <Link href="https://decentral.games/dg/migration">here</Link>
                </p>
            </div>

            <div className={styles.main_div}>
                <div className={styles.network_div}>
                    <div
                        className={network === 'Polygon' ? styles.active : null}
                        onClick={() => {
                            setNetwork('Polygon')
                        }}
                    >
                        <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1635530918/Polygon2_zeu1tk.png" alt="Polygon" />
                        Polygon
                    </div>
                    <div
                        className={network === 'Ethereum' ? styles.active : null}
                        onClick={() => {
                            setNetwork('Ethereum')
                        }}
                    >
                        <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1635530917/ETH_hbuky5.png" alt="Ethereum" />
                        Ethereum
                    </div>
                </div>

                <div className={styles.main_Title}>DG Token Swap</div>

                <div className={styles.content_image}>
                    <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1635530918/Dg2_fpfn94.png" alt="DG" />
                    <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1635530918/Dg2_fpfn94.png" alt="DG" />
                </div>

                <div className={styles.contract_div}>
                    <div className={styles.contract_box}>
                        <div className={styles.tag}>
                            Old DG Contract
                            <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1635530963/arrow_b8xsav.png" alt="" />
                        </div>

                        <div className={styles.content}>
                            <img className={styles.dg} src="https://res.cloudinary.com/dnzambf4m/image/upload/v1631325895/dgNewLogo_hkvlps.png" alt="DG" />
                            3.4
                        </div>

                        <div className={styles.description}>
                            <h4 className={styles.active}>3.4 DG (Old) Detected!</h4>
                            <p>(On Polygon)</p>
                        </div>
                    </div>
                    <div className={styles.arrow}>
                        <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1635534332/arrow2_n1fwsf.png" alt="" />
                    </div>
                    <div className={styles.contract_box}>
                        <div className={styles.tag}>
                            New DG Contract
                            <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1635530963/arrow_b8xsav.png" alt="" />
                        </div>

                        <div className={styles.content}>
                            <img className={styles.new} src="https://res.cloudinary.com/dnzambf4m/image/upload/v1635540038/NEW_dqqtn6.png" alt="new" />
                            <img className={styles.dg} src="https://res.cloudinary.com/dnzambf4m/image/upload/v1631325895/dgNewLogo_hkvlps.png" alt="DG" />
                            <abbr>3,400</abbr>
                        </div>

                        <div className={styles.description}>
                            <h4>0 New DG Total</h4>
                            <p>(On Polygon)</p>
                        </div>
                    </div>
                </div>
            
                <Button className={styles.swap_button}>Swap All 3.4 DG</Button>
            </div>
        </div>
    )
}

export default TokenMigration
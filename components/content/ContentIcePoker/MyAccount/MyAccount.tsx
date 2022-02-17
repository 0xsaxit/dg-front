import React, { FC, ReactElement } from 'react'
import styles from './MyAccount.module.scss'

export interface MyAccountType {
  className?: string;
}

const MyAccount: FC<MyAccountType> = ({ className = '' } : MyAccountType): ReactElement => {
  return (
    <div className={styles.main_wrapper}>
      <div className={styles.title}>
        <h1>
          MyAccount
        </h1>
      </div>
    </div>
  )
}

export default MyAccount
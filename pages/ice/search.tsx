import React, { FC, ReactElement } from 'react';
import IcePoker from '../../components/home/IcePoker/index.js';
import Layout from '../../components/Layout.js';
import Header from '../../components/Header';
import Global from '../../components/Constants';
import Images from '../../common/Images';

export interface IceSearchType {
  className?: string;
}

const IceSearch: FC<IceSearchType> = ({ className = '' }: IceSearchType): ReactElement => (
  <Layout>
    <Header title={Global.CONSTANTS.TITLE + ' | Games'} description={Global.CONSTANTS.DESCRIPTION} image={Images.SOCIAL_SHARE} />

    <IcePoker iceState={'search'} />
  </Layout>
);

export default IceSearch;

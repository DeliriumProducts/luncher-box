import { message } from 'antd';
import { NextFunctionComponent } from 'next';
import Head from 'next/head';
import React from 'react';
import { TableAPI } from '../../api';
import FlexContainer from '../../components/FlexContainer';
import PageHeader from '../../components/PageHeader';
import { withAuth } from '../../hocs';
import { Table } from '../../interfaces';

interface Props {
  tables: Table[] | [];
  err: string | null;
}

const Tables: NextFunctionComponent<Props> = ({ err, tables }) => {
  /**
   * Show only on cDM
   */
  React.useEffect(() => {
    if (err) {
      message.error(`${err}`, 3);
    }
  }, []);

  return (
    <>
      <Head>
        <title>Tables • LuncherBox</title>
      </Head>
      <FlexContainer>
        <PageHeader
          title={
            <h1>
              <strong>Tables</strong>
            </h1>
          }
        >
          asdf
        </PageHeader>
      </FlexContainer>
    </>
  );
};

Tables.getInitialProps = async () => {
  try {
    let tables: Table[] = [];

    tables = await TableAPI.getAll();

    tables = tables.map(s => ({
      ...s,
      key: s.id
    }));

    if (tables) {
      return {
        tables,
        err: null
      };
    }
  } catch (err) {
    return {
      tables: [],
      err: `Network Error, Please try again later!`
    };
  }

  return {
    tables: [],
    err: null
  };
};

export default withAuth(Tables, ['Admin', 'Waiter']);

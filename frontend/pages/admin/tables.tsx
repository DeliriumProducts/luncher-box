import { message, Empty, Button } from 'antd';
import { NextFunctionComponent } from 'next';
import Head from 'next/head';
import React from 'react';
import { TableAPI } from '../../api';
import FlexContainer from '../../components/FlexContainer';
import PageHeader from '../../components/PageHeader';
import TableCard from '../../components/TableCard';
import { withAuth } from '../../hocs';
import { Table } from '../../interfaces';
import styled from 'styled-components';

const TableContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
`;

const CreateTableButton = styled(Button)`
  background: #fff;
  width: 12rem;
  height: 8rem;
  font-weight: 500;
  font-size: 4rem;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.12);
  border-radius: 7px;
  border: none;
`;
interface Props {
  tables: Table[];
  err: string | null;
}

const Tables: NextFunctionComponent<Props> = ({ err, tables }) => {
  let data: React.ReactNode[] | React.ReactNode;

  if (tables.length && !err) {
    data = tables.map(table => (
      <TableCard
        key={table.id}
        name={table.name}
        isTaken={table.isTaken!}
        currentOrdersAmount={5}
      />
    ));
  } else {
    data = <Empty description="No entries found" />;
  }

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
          subTitle={
            <h3>
              <strong>({tables.length})</strong>
            </h3>
          }
        >
          <TableContainer>
            {data}
            <CreateTableButton type="ghost">+</CreateTableButton>
          </TableContainer>
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

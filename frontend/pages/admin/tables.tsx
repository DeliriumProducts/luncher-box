import { Button, Empty, message } from 'antd';
import { NextFunctionComponent } from 'next';
import Head from 'next/head';
import React from 'react';
import styled from 'styled-components';
import { TableAPI } from '../../api';
import EntityModal from '../../components/EntityModal';
import FlexContainer from '../../components/FlexContainer';
import PageHeader from '../../components/PageHeader';
import TableCard from '../../components/TableCard';
import { AdminContext } from '../../context';
import { withAuth } from '../../hocs';
import { Table } from '../../interfaces';

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
  color: #000;
  border: none;
`;
interface Props {
  tables: Table[];
  err: string | null;
}

const Tables: NextFunctionComponent<Props> = ({ err, tables: t }) => {
  const [tables, setTables] = React.useState(t);
  const [modalVisible, setModalVisible] = React.useState(false);
  const adminContext = React.useContext(AdminContext);
  let data: React.ReactNode[] | React.ReactNode;

  let modalFormRef: any;

  if (tables.length && !err) {
    const ordersAndTablesMap: {
      [key: string]: { isTaken: boolean; amount: number };
    } = {};

    adminContext.state.orders.forEach(o => {
      const table = o.table.name;
      if (!ordersAndTablesMap[table]) {
        ordersAndTablesMap[table] = {
          amount: 0,
          isTaken: o.table.isTaken!
        };
      }

      if (o.state! === 1) {
        ordersAndTablesMap[table].amount++;
      }
    });

    console.log(tables);

    data = tables.map(table => (
      <TableCard
        key={table.id}
        name={table.name}
        isTaken={
          ordersAndTablesMap[table.name]
            ? ordersAndTablesMap[table.name].isTaken
            : table.isTaken!
        }
        currentOrdersAmount={
          ordersAndTablesMap[table.name]
            ? ordersAndTablesMap[table.name].amount
            : 0
        }
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

  const saveFormRef = formRef => {
    modalFormRef = formRef;
  };

  const handleCreateTable = () => {
    const modalForm = modalFormRef.props.form;

    modalForm.validateFields(async (errors: any, table: Table) => {
      if (errors) {
        return;
      }

      try {
        const response = (await TableAPI.create(table)).data;

        setTables(prevTables => [...prevTables, response]);

        message.success(
          `Successfully create a table with name ${table.name}🎉`
        );
      } catch (error) {
        message.error(`Error: ${error}`, 3);
      }

      setModalVisible(false);
    });
  };

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
            <CreateTableButton
              type="ghost"
              onClick={() => setModalVisible(true)}
            >
              +
            </CreateTableButton>
          </TableContainer>
        </PageHeader>
      </FlexContainer>
      <EntityModal
        wrappedComponentRef={saveFormRef}
        visible={modalVisible}
        onCreate={handleCreateTable}
        onCancel={() => setModalVisible(false)}
        entityType="table"
        actionType="create"
      />
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

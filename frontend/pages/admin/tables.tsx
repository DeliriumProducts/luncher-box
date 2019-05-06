import { Button, Empty, Icon, message, Switch } from 'antd';
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
import { ActionTypes } from '../../types';

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
  margin: 0.5rem;
  border: none;
`;
interface Props {
  tables: Table[];
  err: string | null;
}

const Tables: NextFunctionComponent<Props> = ({ err, tables: t }) => {
  const [tables, setTables] = React.useState(t);
  const [currentTable, setCurrentTable] = React.useState<Table | null>(null);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [isEdting, setIsEditing] = React.useState(false);
  const [actionType, setActionType] = React.useState('create');
  const adminContext = React.useContext(AdminContext);

  let data: React.ReactNode[] | React.ReactNode;

  const modalFormRef: any = React.useRef(null);

  const handleEditToggle = val => {
    setIsEditing(val);
  };

  const showModal = (a: ActionTypes, table?: Table) => {
    modalFormRef.current.props.form.resetFields();

    setActionType(a);
    setModalVisible(true);
    setCurrentTable(table || null);
  };

  const saveFormRef = formRef => {
    modalFormRef.current = formRef;
  };

  const handleModalConfirm = () => {
    const modalForm = modalFormRef.current.props.form;

    modalForm.validateFields(async (errors: any, table: Table) => {
      if (errors) {
        return;
      }

      try {
        if (actionType === 'create') {
          const response = (await TableAPI.create(table)).data;

          setTables(prevTables => [...prevTables, response]);

          message.success(`Successfully created table ${table.name}🎉`);
        } else {
          if (currentTable) {
            /**
             * Attach missing properties
             */
            table.id = currentTable.id;
            table.isTaken = currentTable.isTaken;

            const response = (await TableAPI.edit(table)).data;

            setTables(prevTables =>
              prevTables.map(pt => {
                if (pt.id === response.id) {
                  return response;
                } else {
                  return pt;
                }
              })
            );

            /**
             * Update the orders
             */
            adminContext.dispatch({
              type: 'setOrders',
              payload: adminContext.state.orders.map(o => {
                if (o.table.id === table.id) {
                  return {
                    ...o,
                    table
                  };
                } else {
                  return o;
                }
              })
            });
          }

          message.success(`Successfully edited table ${table.name}🎉`);
        }
      } catch (error) {
        message.error(`Error: ${error}`, 3);
      }

      setModalVisible(false);
    });
  };

  const handleModalCancel = () => {
    setModalVisible(false);
  };

  const handleCreateClick = (e: React.FormEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    showModal('create');
  };

  const handleEditClick = (e: React.FormEvent<HTMLButtonElement>, table) => {
    e.stopPropagation();
    showModal('edit', table);
  };

  const handleDeleteClick = async (
    e: React.FormEvent<HTMLButtonElement>,
    table: Table
  ) => {
    e.stopPropagation();

    try {
      await TableAPI.delete(table.id!);

      setTables(prevTables =>
        prevTables.filter(pt => {
          return pt.id !== table.id;
        })
      );

      /**
       * Update the orders (remove all the orders with the deleted table)
       */
      adminContext.dispatch({
        type: 'setOrders',
        payload: adminContext.state.orders.filter(o => {
          return o.table.id !== table.id;
        })
      });

      message.success(`Successfully deleted table ${table.name} 🎉`);
    } catch (error) {
      message.error(`Error: ${error}`, 3);
    }
  };

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

    data = tables.map(table => {
      return (
        <TableCard
          editable={isEdting}
          key={table.id}
          id={table.id!}
          name={table.name}
          handleDeleteClick={handleDeleteClick}
          handleEditClick={handleEditClick}
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
      );
    });
  } else if (!isEdting) {
    data = <Empty description="No entries found" />;
  } else {
    data = null;
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
          extra={[
            <Switch
              onClick={handleEditToggle}
              checked={isEdting}
              checkedChildren={<Icon type="edit" />}
              key="1"
              unCheckedChildren={<Icon type="inbox" />}
            />
          ]}
          subTitle={
            <h3>
              <strong>({tables.length})</strong>
            </h3>
          }
        >
          <TableContainer>
            {data}
            {isEdting && (
              <CreateTableButton type="ghost" onClick={handleCreateClick}>
                +
              </CreateTableButton>
            )}
          </TableContainer>
        </PageHeader>
      </FlexContainer>
      <EntityModal
        wrappedComponentRef={saveFormRef}
        visible={modalVisible}
        onConfirm={handleModalConfirm}
        onCancel={handleModalCancel}
        entityType="table"
        actionType={actionType}
        entity={currentTable}
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

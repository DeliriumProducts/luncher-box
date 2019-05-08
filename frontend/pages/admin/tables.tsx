import { Button, Empty, Icon, message, Modal, Switch } from 'antd';
import { NextFunctionComponent } from 'next';
import Head from 'next/head';
import React from 'react';
import styled from 'styled-components';
import { TableAPI } from '../../api';
import EntityModal from '../../components/EntityModal';
import FlexContainer from '../../components/FlexContainer';
import OrderContainer from '../../components/OrderCardContainer';
import PageHeader from '../../components/PageHeader';
import TableCard from '../../components/TableCard';
import { AdminContext } from '../../context';
import { withAuth } from '../../hocs';
import { Order, Table } from '../../interfaces';
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
  box-shadow: 0 20px 24px -18px rgba(0, 0, 0, 0.31);
  border-radius: 7px;
  color: #000;
  margin: 0.5rem;
  border: none;
  transition: all 0.3s;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
  }
`;
interface Props {
  tables: Table[];
  err: string | null;
}

const Tables: NextFunctionComponent<Props> = ({ err, tables: t }) => {
  const [tables, setTables] = React.useState(t);
  const [
    currentTableForModifying,
    setCurrentTableForModifying
  ] = React.useState<Table | null>(null);
  const [modifyingModalVisible, setModifyingModalVisible] = React.useState(
    false
  );
  const [isEdting, setIsEditing] = React.useState(false);
  const [actionType, setActionType] = React.useState('create');
  const [ordersModalVisible, setOrdersModalVisible] = React.useState(false);
  const [currentOrdersFromTable, setCurrentOrdersFromTable] = React.useState<
    Order[]
  >([]);
  const [
    currentOrdersTable,
    setCurrentOrdersTable
  ] = React.useState<Table | null>(null);

  const adminContext = React.useContext(AdminContext);

  let data: React.ReactNode[] | React.ReactNode;

  const modalFormRef: any = React.useRef(null);

  const handleEditToggle = val => {
    setIsEditing(val);
  };

  const showEntityModal = (a: ActionTypes, table?: Table) => {
    modalFormRef.current.props.form.resetFields();

    setActionType(a);
    setModifyingModalVisible(true);
    setCurrentTableForModifying(table || null);
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
          const response = await TableAPI.create(table);

          setTables(prevTables => [...prevTables, response.data]);

          message.success(`Successfully created table ${table.name}🎉`);
        } else {
          if (currentTableForModifying) {
            /**
             * Attach missing properties
             */
            table.id = currentTableForModifying.id;
            table.isTaken = currentTableForModifying.isTaken;

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
        if (error.response.status === 422) {
          message.error(`A table with the same name already exists`, 3);
        } else {
          message.error(`${error}`, 3);
        }
      }

      setModifyingModalVisible(false);
    });
  };

  const handleModalCancel = () => {
    setModifyingModalVisible(false);
  };

  const handleCreateClick = (e: React.FormEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    showEntityModal('create');
  };

  const handleEditClick = (e: React.FormEvent<HTMLButtonElement>, table) => {
    e.stopPropagation();
    showEntityModal('edit', table);
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

  const handleTableClick = (
    e: React.FormEvent<HTMLDivElement>,
    table: Table
  ) => {
    setOrdersModalVisible(true);
    setCurrentOrdersTable(table);
  };

  React.useEffect(() => {
    if (currentOrdersTable) {
      setCurrentOrdersFromTable(
        adminContext.state.orders.filter(
          o => o.table.id === currentOrdersTable!.id
        )
      );
    }
  }, [currentOrdersTable, adminContext.state.orders]);

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

      if (o.state! < 1) {
        ordersAndTablesMap[table].amount++;
      }

      ordersAndTablesMap[table].isTaken = !!ordersAndTablesMap[table].amount;
    });

    data = tables.map(table => {
      return (
        <TableCard
          editable={isEdting}
          key={table.id}
          id={table.id!}
          name={table.name}
          onClick={handleTableClick}
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
          extra={
            adminContext.state.user.role === 'Admin'
              ? [
                  <Switch
                    onClick={handleEditToggle}
                    checked={isEdting}
                    checkedChildren={<Icon type="edit" />}
                    key="1"
                    unCheckedChildren={<Icon type="inbox" />}
                  />
                ]
              : []
          }
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
        visible={modifyingModalVisible}
        onConfirm={handleModalConfirm}
        onCancel={handleModalCancel}
        entityType="table"
        actionType={actionType}
        entity={currentTableForModifying}
      />
      <Modal
        visible={ordersModalVisible}
        title={
          currentOrdersTable && (
            <strong>Orders for table {currentOrdersTable.name}</strong>
          )
        }
        centered
        onCancel={() => {
          setOrdersModalVisible(false);
        }}
        onOk={() => {
          setOrdersModalVisible(false);
        }}
      >
        Hi
        {currentOrdersFromTable.length > 0 ? (
          <OrderContainer
            orders={currentOrdersFromTable}
            role={adminContext.state.user.role}
          />
        ) : (
          <Empty description="No orders placed on this table yet!" />
        )}
      </Modal>
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

export default withAuth(Tables, ['Waiter']);

import { Popconfirm } from 'antd';
import styled from 'styled-components';
import { Table } from '../interfaces';
import ActionButton from './ActionButton';

const Card: any = styled.div`
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 12rem;
  height: 8rem;
  flex-direction: column;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.12);
  cursor: pointer;
  border-radius: 7px;
  margin: 0.5rem;

  & > * {
    flex: 1;
  }

  .table-name-and-status {
    width: 100%;
    display: flex;
    justify-content: ${(props: any) =>
      props.editable ? 'center' : 'space-between'};
    align-items: ${(props: any) => props.editable && 'center'};

    .table-name {
      font-weight: 600;
      margin-top: 3px;
      margin-left: ${(props: any) => (props.editable ? '0' : '15px')};
      font-size: 1.3rem;
      color: #000;
    }

    .table-status {
      width: 1rem;
      height: 1rem;
      box-shadow: 0 2px 2px rgba(0, 0, 0, 0.12);
      border-radius: 50%;
      margin-top: 10px;
      margin-right: 10px;
      background: ${(props: any) =>
        props.isTaken ? '#52c41a' : 'rgba(0,0,0,0.12)'};
    }
  }
  .table-current-order-amount {
    font-weight: 800;
    font-size: 2rem;
    color: #000;
  }
`;

interface Props {
  id: string;
  name: string;
  currentOrdersAmount: number;
  isTaken: boolean;
  editable: boolean;

  handleEditClick: (
    e: React.FormEvent<HTMLButtonElement>,
    table: Table
  ) => void;

  handleDeleteClick: (
    e: React.FormEvent<HTMLButtonElement>,
    table: Table
  ) => void;
}

const TableCard: React.FunctionComponent<Props> = ({
  id,
  name,
  currentOrdersAmount,
  isTaken,
  editable,
  handleDeleteClick,
  handleEditClick
}) => {
  const table: Table = {
    id,
    name
  };

  return (
    <Card isTaken={isTaken} editable={editable}>
      <div className="table-name-and-status">
        <div className="table-name">{name}</div>
        {!editable && <div className="table-status" />}
      </div>
      {!editable && (
        <>
          <div className="table-current-order-amount">
            {currentOrdersAmount}
          </div>
          <div>
            {currentOrdersAmount === 1 ? 'order' : 'orders'} in progress
          </div>
        </>
      )}
      {editable && (
        <>
          <div
            style={{
              display: 'flex',
              width: '100%',
              justifyContent: 'space-evenly',
              alignItems: 'center'
            }}
          >
            <ActionButton
              size="small"
              icon="edit"
              title={`Are you sure?`}
              onClick={(e: any) => handleEditClick(e, table)}
            >
              Edit
            </ActionButton>
            <Popconfirm
              title={`Are you sure?`}
              onConfirm={(e: any) => handleDeleteClick(e, table)}
              okText="Yes"
              placement="bottom"
            >
              <ActionButton
                size="small"
                key="delete"
                type="default"
                icon="delete"
              >
                Delete
              </ActionButton>
            </Popconfirm>
          </div>
        </>
      )}
    </Card>
  );
};

export default TableCard;

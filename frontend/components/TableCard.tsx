import styled from 'styled-components';

const Card: any = styled.div`
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
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
    justify-content: space-between;

    .table-name {
      font-weight: 600;
      margin-top: 3px;
      margin-left: 15px;
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
  name: string;
  currentOrdersAmount: number;
  isTaken: boolean;
}

const TableCard: React.FunctionComponent<Props> = ({
  name,
  currentOrdersAmount,
  isTaken
}) => {
  return (
    <Card isTaken={isTaken}>
      <div className="table-name-and-status">
        <div className="table-name">{name}</div>
        <div className="table-status" />
      </div>
      <div className="table-current-order-amount">{currentOrdersAmount}</div>
      <div>ongoing {currentOrdersAmount === 1 ? 'order' : 'orders'}</div>
    </Card>
  );
};

export default TableCard;

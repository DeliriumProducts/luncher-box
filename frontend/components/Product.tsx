import styled from 'styled-components';
import { Card, Button, Icon } from 'antd';

const { Meta } = Card;

const StyledCard = styled(Card)`
  border-radius: 7px;
  display: flex;
  flex-direction: column;
  text-align: center;
  margin: 8px 4px 0 4px;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.12);
  flex-basis: 16rem;
  padding-bottom: 0;

  .ant-card-body {
    padding-top: 0;
    height: 100%;
  }

  & img {
    border-radius: 7px 7px 0 0;
    object-fit: cover;
    width: 100%;
    height: 16rem;
  }

  @media (max-width: 768px) {
    border-bottom: 1px solid;
    border-bottom-color: rgb(210, 210, 210);
    box-shadow: none;
    margin: 8px 0 0 0;
    flex-basis: 100%;
  }

  .ant-card-actions {
    background-color: #fff;
    border-top-color: rgb(210, 210, 210);
    border-radius: 0 0 7px 7px;
  }
`;

const StyledMeta = styled(Meta)`
  display: flex;
  flex-grow: 1;
  align-items: center;
  justify-content: center;
  height: 100%;
  & * {
    white-space: initial;
    overflow-wrap: normal;
  }
`;

interface Props {
  name: string;
  image: string;
  description: string;
  price: string;
}

const ViewMoreButton: any = styled(Button)`
  border: none;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.12);
`;

const addDots = (str: string, limit: number) => {
  if (str.length > limit) {
    return [str.substring(0, limit) + '...', true];
  }

  return [str, false];
};

export default (props: Props) => {
  const [shortName, readMoreName] = addDots(props.name, 50);
  const [shortDesc, readMoreDesc] = addDots(props.description, 150);

  return (
    <StyledCard
      bordered={false}
      cover={
        <div>
          <img alt="example" src={props.image} />
          <Button
            style={{
              width: 44,
              height: 44,
              position: 'relative',
              bottom: 22,
              border: 'none',
              boxShadow: '0 4px 4px rgba(0, 0, 0, 0.12)'
            }}
            icon="plus"
            shape="circle"
          />
        </div>
      }
      actions={[
        <ViewMoreButton size="small" icon="info">
          View more
        </ViewMoreButton>
      ]}
    >
      <StyledMeta title={shortName} description={<p>{shortDesc}</p>} />
    </StyledCard>
  );
};

import styled from 'styled-components';
import { Card } from 'antd';
import Link from 'next/link';

const StyledDiv: any = styled.div`
  display: flex;
  white-space: normal;
  justify-content: center;
  align-items: center;
  word-break: break-all;
  position: relative;
  color: white;
  border-radius: 7px;
  font-size: 3rem;
  margin: 8px 4px 0 4px;
  width: 16rem;
  height: 16rem;
  user-select: none;
  cursor: pointer;
  @media (max-width: 768px) {
    margin: 8px 0 0 0;
    flex-basis: 100%;
  }
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.5);
`;

const BlurredDiv: any = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 7px;
  height: 100%;
  background: url(${(props: any) => props.img}) no-repeat center;
  background-size: cover;
  overflow: hidden;
  /* filter: blur(3px); */
`;

interface Props {
  id: number;
  name: string;
  image: string;
}

export default (props: Props) => {
  const { id, name, image } = props;

  return (
    <Link href={`/category?categoryId=${id}`} as={`/category/${id}`}>
      <StyledDiv>
        <BlurredDiv img={image}>
          <div
            style={{
              backgroundColor: 'rgba(0,0,0,0.45)',
              width: '100%',
              height: '100%'
            }}
          />
        </BlurredDiv>
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          {name}
        </div>
      </StyledDiv>
    </Link>
  );
};

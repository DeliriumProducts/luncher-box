import styled from 'styled-components';

const StyledDiv = styled.div`
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.12);
  border-radius: 6px;
  width: 330px;
  height: 510px;
  margin: 5px;
  text-align: center;
`;

const StyledH1 = styled.h1`
  margin-top: 25%;
  color: #393939;
  font-size: 3rem;
`;

const StyledParagraph = styled.p`
  color: #393939;
  font-size: 0.8rem;
`;

const StyledImg = styled.img`
  width: 100%;
  height: 256px;
  object-fit: cover;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
`;

interface Props {
  img: string;
  alt: string;
  name: string;
  desc?: string;
  price?: string;
}

export default (props: Props) => (
  <StyledDiv>
    <StyledImg src={props.img} alt={props.alt} />
    <StyledH1>{props.name}</StyledH1>
    <StyledParagraph>{props.desc}</StyledParagraph>
  </StyledDiv>
);

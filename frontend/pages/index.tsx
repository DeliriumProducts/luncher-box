import { Affix, Button, Card, Icon, Layout, Popover } from 'antd';
import Link from 'next/link';
import styled from 'styled-components';
import { THEME_VARIABLES } from '../config';

const { Header, Content } = Layout;

const StyledLayout = styled(Layout)`
  min-height: 100%;
  background: rgba(0, 0, 0, 0);
`;

const StyledContent = styled(Content)`
  padding: 50px;
  padding-top: 0;

  @media screen and (max-width: 768px) {
    padding-right: 0;
    padding-left: 0;
    padding-top: 50px;
  }

  min-height: 100vh;
`;

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  height: 100vh;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;

  @media screen and (max-width: 768px) {
    align-items: center;
  }
`;

const HeroImage = styled.img`
  height: 65%;
  width: auto;

  @media screen and (max-width: 768px) {
    align-items: center;
    margin-top: 50px;
  }

  transform: rotate(8deg);
`;

const StyledHeader = styled(Header)`
  background-color: #fafafa;
  height: 80px;
  display: flex;
  align-items: center;
  font-size: 1rem;
  font-family: 'Montserrat';
  box-shadow: rgba(0, 0, 0, 0.12) 0px 2px 2px;
  user-select: none;

  .items-desktop {
    display: flex;
  }

  .items-mobile {
    display: none;
  }

  .logo {
    flex: 1;
    margin-left: 45px;
    color: ${THEME_VARIABLES['@primary-color']};
    display: flex;
    font-size: 1.5rem;
    align-items: center;
    font-weight: 600;

    img {
      display: block;
      margin-right: 20px;
    }
  }

  @media screen and (max-width: 920px) {
    .items-desktop {
      display: none;
    }

    .items-mobile {
      display: flex;
    }

    .logo {
      justify-content: center;
      align-items: center;
      margin-left: 0;
      font-size: 1rem;
    }
  }

  @media screen and (max-width: 380px) {
    .logo {
      img {
        display: none;
      }
    }
  }
`;

const MenuItem = styled.a`
  text-transform: uppercase;
  margin-right: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${THEME_VARIABLES['@primary-color']}bb;
  font-weight: 500;

  &:hover {
    color: ${THEME_VARIABLES['@primary-color']};
    font-weight: 550;
  }

  @media screen and (max-width: 920px) {
    margin-right: 0;
  }
`;

const Heading = styled.h1`
  font-size: 2.5rem;
  font-family: 'Montserrat';
  font-weight: 450;
  word-wrap: break-word;
  text-align: center;
`;

const TopicCard = styled(Card)`
  border-radius: 7px;
  margin-top: 50px;
  text-align: center;
  border: none;
  width: 75%;

  @media (max-width: 768px) {
    width: 100%;
    border-radius: 0;
  }

  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.12);
`;

const TopicHeading = styled.div`
  border-radius: 7px;
  background-color: #fff;
  height: 50px;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.12);
  display: flex;
  justify-content: center;

  align-items: center;
  position: relative;
  bottom: 25px;
  padding: 20px;

  > h1 {
    color: ${THEME_VARIABLES['@primary-color']};
    text-transform: uppercase;
    margin: 0;
    font-family: 'Montserrat';
    font-weight: 500;
    font-size: 1.2rem;
  }

  text-align: center;
`;

interface TopicProps {
  name: string;
}

const Topic: React.FunctionComponent<TopicProps> = ({ children, name }) => {
  return (
    <TopicCard
      cover={
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center'
          }}
        >
          <TopicHeading>
            <h1>{name}</h1>
          </TopicHeading>
        </div>
      }
    >
      {children}
    </TopicCard>
  );
};

const StyledH1 = styled.h1`
  color: ${THEME_VARIABLES['@primary-color']};
  margin: 0;
  text-align: left;
`;

const StyledH2 = styled.h2`
  margin: 0;
  text-align: left;
`;

interface FeatureProps {
  icon: string;
  name: string;
}

const Feature: React.FunctionComponent<FeatureProps> = ({
  children,
  icon,
  name
}) => {
  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flexBasis: '25%',
        margin: 5
      }}
    >
      <div>
        <Icon
          type={icon}
          style={{
            margin: 15,
            fontSize: '3.5rem',
            color: THEME_VARIABLES['@primary-color']
          }}
        />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <StyledH1>{name}</StyledH1>
        <StyledH2>{children}</StyledH2>
      </div>
    </div>
  );
};

export default () => {
  const Items = (
    <>
      <MenuItem>Home</MenuItem>
      <MenuItem>Features</MenuItem>
      <MenuItem>About</MenuItem>
      <MenuItem>Contact</MenuItem>
      <MenuItem>
        <Link href="/app" as="/app">
          <Button size="large" type="primary">
            Launch LuncherBox
          </Button>
        </Link>
      </MenuItem>
    </>
  );

  return (
    <StyledLayout>
      <Affix offsetTop={0}>
        <StyledHeader>
          <div className="logo">
            <img src="/static/logo.svg" width="32px" />
            LuncherBox
          </div>
          <div className="items-desktop">{Items}</div>
          <div className="items-mobile">
            <Popover placement="bottom" content={Items}>
              <Icon
                type="menu"
                style={{
                  color: THEME_VARIABLES['@primary-color'],
                  cursor: 'pointer',
                  fontSize: '1.5rem',
                  padding: '1rem'
                }}
              />
            </Popover>
          </div>
        </StyledHeader>
      </Affix>
      <StyledContent>
        <Wrapper>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column'
            }}
          >
            <Heading>
              Placing orders has <br /> never been faster.
            </Heading>
            <div>
              <Link href="/app" as="/app">
                <Button size="large" type="primary">
                  Launch LuncherBox
                </Button>
              </Link>
              <Button
                size="large"
                type="default"
                style={{
                  marginLeft: 10,
                  color: THEME_VARIABLES['@primary-color'],
                  borderColor: THEME_VARIABLES['@primary-color']
                }}
              >
                Find out more
              </Button>
            </div>
          </div>
          <HeroImage src="/static/iphonex.png" />
        </Wrapper>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginTop: 100
          }}
        >
          <Topic name="Features">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                flexDirection: 'row',
                flexWrap: 'wrap'
              }}
            >
              <Feature name="Place orders" icon="menu">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </Feature>
              <Feature name="asdf" icon="book">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </Feature>
              <Feature name="Edit menu" icon="edit">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </Feature>
              <Feature name="asdf" icon="dollar">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </Feature>
              <Feature name="asdf" icon="safety-certificate">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </Feature>
              <Feature name="asdf" icon="shopping">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </Feature>
            </div>
          </Topic>
          <Topic name="About">asdf</Topic>
          <Topic name="Contact">asdf</Topic>
        </div>
      </StyledContent>
    </StyledLayout>
  );
};

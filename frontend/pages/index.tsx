import { Affix, Button, Icon, Layout, Popover } from 'antd';
import Router from 'next/router';
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
  min-height: 500vh;
`;

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  height: 100vh;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;

  @media screen and (max-width: 920px) {
    align-items: center;
  }
`;
const StyledImage = styled.img`
  height: 75%;
  width: auto;
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

const StyledH1 = styled.h1`
  font-size: 2rem;
  font-family: 'Montserrat';
  font-weight: 450;
  word-wrap: break-word;
`;

export default () => {
  const Items = (
    <>
      <MenuItem>Home</MenuItem>
      <MenuItem>Features</MenuItem>
      <MenuItem>About</MenuItem>
      <MenuItem>Contact</MenuItem>
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
                type="bars"
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
            <StyledH1>Placing orders has never been faster.</StyledH1>
            <Button
              size="large"
              type="primary"
              onClick={() => Router.push('/app')}
            >
              Start using LuncherBox now!
            </Button>
          </div>
          <StyledImage src="/static/iphone.png" />
        </Wrapper>
      </StyledContent>
    </StyledLayout>
  );
};

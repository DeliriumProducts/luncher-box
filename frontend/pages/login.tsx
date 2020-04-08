import { Button, Form, Icon, Input, message } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { NextPageContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Router from 'next/router';
import React, { Component } from 'react';
import styled from 'styled-components';
import { StaffAPI } from '../api';
import CenteredDiv from '../components/CenteredDiv';
import { User } from '../interfaces';
import { HandleLogin } from '../types';

const FormItem = Form.Item;

const Container = styled.div`
  background-color: #fafafa;
  padding: 30px;
  box-shadow: 0 20px 24px -18px rgba(0, 0, 0, 0.31);
  border-radius: 10px;

  #info {
    text-align: center;
  }

  .login-form {
    max-width: 300px;
  }

  .login-form-forgot {
    float: right;
  }

  .login-form-button {
    width: 100%;
  }
`;

interface Props extends FormComponentProps {
  handleLogin: HandleLogin;
}

interface State {
  loading: boolean;
}

class LoginForm extends Component<Props, State> {
  static async getInitialProps({ req, res }: NextPageContext) {
    let auth: { user: User | null; isAuthenticated: boolean } = {
      user: null,
      isAuthenticated: false
    };

    /**
     * Check wheter authentication is happening server-side or client-side based on received context
     */
    if (req && res) {
      if (req.headers.cookie) {
        auth = await StaffAPI.isAuthenticated(req.headers.cookie);
      }

      if (auth.isAuthenticated) {
        res.writeHead(302, {
          Location: '/admin'
        });
        res.end();
      }
    } else {
      auth = await StaffAPI.isAuthenticated();

      if (auth.isAuthenticated) {
        Router.replace('/admin');
      }
    }
  }

  state = {
    loading: false
  };

  handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    this.props.form.validateFields(async (err: any, values: any) => {
      if (!err) {
        const { email, password } = values;

        const credentials = {
          email,
          password
        };

        this.setState({ loading: true });
        try {
          await StaffAPI.login(credentials);
          message.success(
            'You successfully logged in! Redirecting you to dashboard...',
            3,
            () => Router.replace('/admin')
          );
        } catch (err) {
          if (!err.response) {
            message.error(`${err}`);
            return;
          }
          if (err.response.status === 401) {
            message.error(
              'Invalid credentials. Try again or click Forgot password to reset it',
              1
            );
          } else {
            message.error('Server error, please try again');
          }
        } finally {
          this.setState({ loading: false });
        }
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { loading } = this.state;
    return (
      <>
        <Head>
          <title>Login • LuncherBox</title>
        </Head>
        <CenteredDiv>
          <Container>
            <Form onSubmit={this.handleSubmit} className="login-form">
              <p id="info">Login to Create, Update or Delete products</p>
              <FormItem>
                {getFieldDecorator('email', {
                  rules: [
                    {
                      type: 'email',
                      message: 'The input is not valid Email!'
                    },
                    {
                      required: true,
                      message: 'Please input your Email!'
                    }
                  ]
                })(
                  <Input
                    prefix={
                      <Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />
                    }
                    type="email"
                    placeholder="Email"
                  />
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator('password', {
                  rules: [
                    {
                      required: true,
                      message: 'Please input your password!'
                    }
                  ]
                })(
                  <Input.Password
                    prefix={
                      <Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />
                    }
                    type="password"
                    placeholder="Password"
                  />
                )}
              </FormItem>
              <FormItem>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                  loading={loading}
                >
                  Login
                </Button>
                Or{' '}
                <Link href="/register">
                  <a>register now!</a>
                </Link>
              </FormItem>
            </Form>
          </Container>
        </CenteredDiv>
      </>
    );
  }
}

// @ts-ignore
export default Form.create<Props>()(LoginForm);

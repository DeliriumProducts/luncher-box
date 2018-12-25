import { Form, Icon, Input, Button, Checkbox } from 'antd';
import Link from 'next/link';
import styled from 'styled-components';
import React from 'react';
import { FormComponentProps } from 'antd/lib/form';
import { HandleLogin } from '../types';
import CenteredDiv from '../components/CenteredDiv';
import axios from 'axios';
import { NextContext } from 'next';

const FormItem = Form.Item;

const Container = styled.div`
  background-color: rgb(245, 245, 245);
  padding: 30px;
  box-shadow: 0 0 10px 5px #ebebeb;
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

class LoginForm extends React.Component<Props, State> {
  static async getInitialProps({ req }: NextContext) {
    if (req) {
      if (req.headers.cookie) {
        const response = await axios.get('http://80ee1d03.ngrok.io/auth', {
          withCredentials: true,
          headers: {
            cookie: req.headers.cookie
          }
        });
        console.log(response.data);
      }
    } else {
      console.log('client');
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
        const data = {
          email,
          password
        };
        this.setState({ loading: true });
        const response = await axios.post(
          'http://80ee1d03.ngrok.io/auth/login',
          data,
          {
            withCredentials: true
          }
        );
        console.log(response);
        this.setState({ loading: false });
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { loading } = this.state;
    return (
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
                  { required: true, message: 'Please input your Password!' }
                ]
              })(
                <Input
                  prefix={
                    <Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  type="password"
                  placeholder="Password"
                />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('remember', {
                valuePropName: 'checked',
                initialValue: true
              })(<Checkbox>Remember me</Checkbox>)}
              <a className="login-form-forgot" href="">
                Forgot password
              </a>
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
    );
  }
}

export default Form.create()(LoginForm);

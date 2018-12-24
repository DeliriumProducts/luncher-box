import { Form, Icon, Input, Button, Checkbox } from 'antd';
import styled from 'styled-components';
import React from 'react';
import { FormComponentProps } from 'antd/lib/form';
import { HandleLogin } from '../types';
import axios from 'axios';

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

  .login-form-button {
    width: 100%;
  }
`;

interface Props extends FormComponentProps {
  handleLogin: HandleLogin;
}

type State = {
  loading: boolean;
};

class LoginForm extends React.Component<Props, State> {
  state = {
    loading: false
  };

  handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        // this.setState(prev => ({
        //   loading: !prev.loading
        // }));

        const { email, password, name } = values;
        const data = {
          email,
          password,
          name
        };
        const response = await axios.post(
          'http://localhost:8000/auth/register',
          data,
          {
            withCredentials: true
          }
        );
        console.log(response);
      }
    });
  };

  componentDidUpdate() {
    const success = this.state.loading;
    if (success) {
      this.props.handleLogin(success);
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { loading } = this.state;
    return (
      <Container>
        <Form onSubmit={this.handleSubmit} className="register-form">
          <p id="info">Login to Create, Update or Delete products</p>
          <FormItem>
            {getFieldDecorator('name', {
              rules: [
                {
                  type: 'text',
                  message: 'The input is not valid Name!'
                },
                {
                  required: true,
                  message: 'Please type your name!'
                }
              ]
            })(
              <Input
                prefix={
                  <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                }
                type="text"
                placeholder="Name"
              />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('email', {
              rules: [
                {
                  type: 'email',
                  message: 'The typed is not valid Email!'
                },
                {
                  required: true,
                  message: 'Please type your Email!'
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
              rules: [{ required: true, message: 'Please type your Password!' }]
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
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
              loading={loading}
            >
              Login
            </Button>
            Already registered? <a href="">login now!</a>
          </FormItem>
        </Form>
      </Container>
    );
  }
}

export default Form.create()(LoginForm);

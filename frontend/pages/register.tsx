import { Button, Form, Icon, Input, message } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';
import { AuthAPI } from '../api';
import CenteredDiv from '../components/CenteredDiv';
import { HandleRegister } from '../types';
import Router from 'next/router';

const FormItem = Form.Item;

const Container = styled.div`
  background-color: rgb(245, 245, 245);
  padding: 30px;
  box-shadow: 0 0 10px 5px #ebebeb;
  border-radius: 10px;

  #info {
    text-align: center;
  }

  .register-form {
    max-width: 300px;
  }

  .register-form-button {
    width: 100%;
  }
`;

interface Props extends FormComponentProps {
  handleregister: HandleRegister;
}

interface State {
  loading: boolean;
}

class RegisterForm extends React.Component<Props, State> {
  state = {
    loading: false
  };

  handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const { email, password, name } = values;
        const credentials = {
          name,
          email,
          password
        };

        this.setState({ loading: true });
        try {
          await AuthAPI.register(credentials);
          message.success(
            'You successfully registered! An confirmation email was sent to the restaurant owner ✉️',
            3,
            () => Router.replace('/login')
          );
        } catch (err) {
          if (!err.response) {
            message.error(`${err}`);
            return;
          }
          if (err.response.status === 422) {
            message.error('An account with the same email already exists.');
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
      <CenteredDiv>
        <Container>
          <Form onSubmit={this.handleSubmit} className="register-form">
            <p id="info">Register to Create, Update or Delete products</p>
            <FormItem>
              {getFieldDecorator('name', {
                rules: [
                  {
                    type: 'string',
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
                    message: 'The input is not valid Email!'
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
                rules: [
                  {
                    required: true,
                    pattern: /^(?=.*[a-z])(?=.*[0-9])(?=.{8,})/,
                    message:
                      // tslint:disable-next-line
                      'Password must contain at least 1 lowercase alphabetical character, 1 numeric character and be at least 8 characters long'
                  }
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
              <Button
                type="primary"
                htmlType="submit"
                className="register-form-button"
                loading={loading}
              >
                Register
              </Button>
              Already registered?{' '}
              <Link href="login">
                <a>Login now!</a>
              </Link>
            </FormItem>
          </Form>
        </Container>
      </CenteredDiv>
    );
  }
}

export default Form.create()(RegisterForm);

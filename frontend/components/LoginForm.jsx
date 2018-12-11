import { Button, Checkbox, Form } from 'semantic-ui-react';
import styled from 'styled-components';
import 'semantic-ui-css/semantic.min.css';

const FormContainer = styled.div`
  background-color: rgb(245, 245, 245);
  padding: 30px;
  box-shadow: 0 0 10px 5px #ebebeb;
  border-radius: 10px;
  #info {
    text-align: center;
  }
  .login-form {
    width: 20vw;
    max-width: 100vw;

    @media only screen and (max-width: 768px) {
      /* For mobile phones: */
      width: 70vw;
    }
  }
  .login-forgot {
    float: right;
  }
  .login-button {
    width: 100%;
  }
`;

const LoginForm = () => (
  <FormContainer>
    <p id="info">Login to Create, Update or Delete products</p>
    <Form className="login-form">
      <Form.Field>
        <label>Email</label>
        <input placeholder="Please type your email" type="email" />
      </Form.Field>
      <Form.Field>
        <label>Password</label>
        <input placeholder="Please type your password" type="password" />
      </Form.Field>
      <Form.Field>
        <Checkbox label="Remember me" />
        <a className="login-form-forgot" href="">
          Forgot password
        </a>
      </Form.Field>
      <Button primary type="submit" className="login-button">
        Login
      </Button>
    </Form>
  </FormContainer>
);

export default LoginForm;

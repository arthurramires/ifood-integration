import React, { useCallback } from 'react';
import { Form } from '@unform/web';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

import Input from '../../components/Input';
import { Container, FormContainer, FormTitle, FormButton } from './styles';

const Credentials = () => {
  const history = useHistory();

  const handleSubmit = useCallback((credentials) => {
    var data = new FormData();
    data.append("client_id", 'id da sh da gestor food');
    data.append("client_secret", 'senha da sh da gestor food');
    data.append("grant_type", 'password');
    data.append("username", credentials.username);
    data.append("password", credentials.password);

    axios.post('https://pos-api.ifood.com.br/oauth/token', data).then(response => {
      localStorage.setItem('restaurant:token', response.token);
    });

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        console.log(this.responseText);
      }
    });

    xhr.open("POST", "https://pos-api.ifood.com.br/oauth/token");

    xhr.send(data);

    localStorage.setItem('restaurant:username', credentials.username);
    localStorage.setItem('restaurant:password', credentials.password);

    history.push('/dashboard');
  }, [history]);
  return (
    <Container>
      <FormContainer>
          <FormTitle>Coloque aqui suas credenciais do IFood</FormTitle>
          <Form onSubmit={handleSubmit}>
            <Input name="username" type="text" placeholder="Nome de usuário"/>
            <Input name="password" type="password" placeholder="Senha" />
            <FormButton type="submit">Entrar</FormButton>
          </Form>
      </FormContainer>
    </Container>
  );
}

export default Credentials;
import React, { useCallback } from 'react';
import { Form } from '@unform/web';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import api from '../../services/api';

import Input from '../../components/Input';
import { Container, FormContainer, FormTitle, FormButton } from './styles';

const Credentials = () => {
  const history = useHistory();

  const handleSubmit = useCallback(async (credentials) => {
    var data = new FormData();
    data.append("client_id", 'gestor_food');
    data.append("client_secret", 'dPrWrJ5n');
    data.append("grant_type", 'password');
    data.append("username", credentials.username);
    data.append("password", credentials.password);

    await axios.post('https://pos-api.ifood.com.br/oauth/token', data).then(response => {
      localStorage.setItem('restaurant:token', response.data.access_token);
    });

    

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
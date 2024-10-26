'use client';

import { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Card, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './styles.module.css'; // Importando o CSS como um objeto
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PaginaLogin() {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [redirect, setRedirect] = useState(false);
  const roteador = useRouter();

  const tratarLogin = () => {
    if (!usuario || !senha) {
      setMensagem('Por favor, preencha todos os campos.');
      return;
    }

    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const usuarioEncontrado = usuarios.find(user => user.usuario === usuario && user.senha === senha);

    if (usuarioEncontrado) {
      localStorage.setItem('usuarioLogado', JSON.stringify(usuarioEncontrado));
      setMensagem('Login bem-sucedido! Redirecionando...');
      setRedirect(true);
    } else {
      setMensagem('Usuário ou senha incorretos.');
    }
  };

  useEffect(() => {
    if (redirect) {
      const timer = setTimeout(() => {
        roteador.push('/');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [redirect]);

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', backgroundColor: '#E9F3F9' }}>
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', backgroundColor: '#E9F3F9' }}>
        <Row className="w-100">
          <Col md={6} lg={5} className="mx-auto">
            <Card className="shadow-lg p-3 mb-5 rounded" style={{ border: 'none' }}>
              <Card.Body style={{ backgroundColor: '#FFFFFF' }}>
                <h2 className={`text-center mb-4`} style={{ color: '#004B87' }}>Login</h2>
                {mensagem && (
                  <Alert variant={mensagem.includes('bem-sucedido') ? 'success' : 'danger'}>
                    {mensagem}
                  </Alert>
                )}
                <Form>
                  <Form.Group controlId="formUsuario">
                    <Form.Label style={{ color: '#333333' }}>Usuário</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Digite o nome de usuário"
                      value={usuario}
                      onChange={(e) => setUsuario(e.target.value)}
                      required
                      style={{ borderColor: '#4CAF50' }}
                    />
                  </Form.Group>
  
                  <Form.Group controlId="formSenha" className="mt-3">
                    <Form.Label style={{ color: '#333333' }}>Senha</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Digite a senha"
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                      required
                      style={{ borderColor: '#4CAF50' }}
                    />
                  </Form.Group>
  
                  <Button variant="primary" className="w-100 mt-4" style={{ backgroundColor: '#004B87', borderColor: '#004B87' }} onClick={tratarLogin}>
                    Login
                  </Button>
                </Form>
  
                <div className={`text-center mt-3`}>
                  <Link href="/register">
                    <Button variant="link" style={{ color: '#004B87' }}>
                      Não possui conta? Cadastre-se
                    </Button>
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

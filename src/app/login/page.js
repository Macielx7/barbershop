'use client';

import { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Card, Alert, Navbar } from 'react-bootstrap';
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
    <>
      <Navbar expand="lg" bg="dark" variant="dark" className="shadow-lg p-3" style={{ fontSize: '1.1em' }}>
        <Container className="d-flex justify-content-center">
          <Navbar.Brand className="d-flex justify-content-center">
            <img
              src="/imagens/logo.png"
              height="80"
              className="d-inline-block align-top"
              alt="Logo"
            />
          </Navbar.Brand>
        </Container>
      </Navbar>

      <div style={{ marginTop: '20px' }}>
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
          <Row className="w-100">
            <Col md={6} lg={5} className="mx-auto">
              <Card className={`${styles.card} shadow-lg p-3 mb-5 rounded`}>
                <Card.Body>
                <h2 className={`${styles.cardH2} text-center mb-4`}><strong>Login</strong></h2>
                {mensagem && <Alert className={mensagem.includes('Login bem-sucedido! Redirecionando...') ? styles.alertSuccess : styles.alertDanger}>{mensagem}</Alert>}
                  <Form>
                  <Form.Group controlId="formUsuario">
                      <Form.Label>Usuário</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Digite o nome de usuário"
                        value={usuario}
                        onChange={(e) => setUsuario(e.target.value)}
                        required
                      />
                    </Form.Group>

                    <Form.Group controlId="formSenha" className="mt-3">
                      <Form.Label>Senha</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Digite a senha"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        required
                      />
                    </Form.Group>

                    <Button className={`${styles.btnPrimary} w-100 mt-4`} onClick={tratarLogin}>
                      Login
                    </Button>
                  </Form>

                  <div className={`text-center mt-3`}>
                    <a href="/registro">
                      <Button variant="link" className={styles.link}>
                        Não possui conta? Cadastre-se
                      </Button>
                    </a>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}

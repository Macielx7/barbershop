'use client';

import { useState } from 'react';
import { Form, Button, Container, Row, Col, Card, Alert, Navbar, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './styles.module.css';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PaginaRegistro() {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const roteador = useRouter();

  const tratarRegistro = () => {
    if (!usuario || !senha || !confirmarSenha) {
      setMensagem('Por favor, preencha todos os campos.');
      return;
    }

    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const usuarioExistente = usuarios.some(user => user.usuario === usuario);

    if (senha !== confirmarSenha) {
      setMensagem('As senhas não coincidem.');
      return;
    }

    if (usuarioExistente) {
      setMensagem('Usuário já existe.');
    } else {
      usuarios.push({ usuario, senha });
      localStorage.setItem('usuarios', JSON.stringify(usuarios));
      setMensagem('Registrado com sucesso! Redirecionando para login...');
      setTimeout(() => roteador.push('/login'), 2000);
    }
  };

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
                  <h2 className={`${styles.cardH2} text-center mb-4`}><strong>Registro</strong></h2>
                  {mensagem && <Alert className={mensagem.includes('sucesso') ? styles.alertSuccess : styles.alertDanger}>{mensagem}</Alert>}
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

                    <Form.Group controlId="formConfirmarSenha" className="mt-3">
                      <Form.Label>Confirme a Senha</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Confirme a senha"
                        value={confirmarSenha}
                        onChange={(e) => setConfirmarSenha(e.target.value)}
                        required
                      />
                    </Form.Group>

                    <Button className={`${styles.btnPrimary} w-100 mt-4`} onClick={tratarRegistro}>
                      Registrar
                    </Button>
                  </Form>

                  <div className="text-center mt-3">
                    <a href="/login">
                      <Button variant="link" className={styles.link}>
                        Já tem conta? Faça login
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

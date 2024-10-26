'use client';

import { useState } from 'react';
import { Form, Button, Container, Row, Col, Card, Alert } from 'react-bootstrap';
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
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', backgroundColor: '#E9F3F9' }}>
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', backgroundColor: '#E9F3F9' }}>
        <Row className="w-100">
          <Col md={6} lg={5} className="mx-auto">
            <Card className="shadow-lg p-3 mb-5 rounded" style={{ border: 'none' }}>
              <Card.Body style={{ backgroundColor: '#FFFFFF' }}>
                <h2 className={`text-center mb-4`} style={{ color: '#004B87' }}>Registro</h2>
                {mensagem && <Alert variant={mensagem.includes('sucesso') ? 'success' : 'danger'}>{mensagem}</Alert>}
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

                  <Form.Group controlId="formConfirmarSenha" className="mt-3">
                    <Form.Label style={{ color: '#333333' }}>Confirme a Senha</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Confirme a senha"
                      value={confirmarSenha}
                      onChange={(e) => setConfirmarSenha(e.target.value)}
                      required
                      style={{ borderColor: '#4CAF50' }}
                    />
                  </Form.Group>

                  <Button variant="primary" className="w-100 mt-4" style={{ backgroundColor: '#004B87', borderColor: '#004B87' }} onClick={tratarRegistro}>
                    Registrar
                  </Button>
                </Form>

                <div className="text-center mt-3">
                  <Link href="/login">
                    <Button variant="link" style={{ color: '#004B87' }}>
                      Já tem conta? Faça login
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

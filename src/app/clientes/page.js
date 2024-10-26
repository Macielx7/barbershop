'use client';

import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Form, Container, Row, Col } from 'react-bootstrap';
import { FaUserPlus, FaEdit, FaTrash } from 'react-icons/fa';
import Pagina from "../components/Pagina";

export default function Clientes() {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [newCliente, setNewCliente] = useState({
    id: '',
    nome: '',
    email: '',
    telefone: '',
    dataNascimento: '',
    endereco: '',
    cpf: ''
  });
  const [clienteParaExcluir, setClienteParaExcluir] = useState(null);

  useEffect(() => {
    // Recupera os clientes do localStorage ao carregar o componente
    const storedClientes = localStorage.getItem('clientes');
    if (storedClientes) {
      setClientes(JSON.parse(storedClientes));
    }
  }, []);

  const handleShow = () => {
    setNewCliente({
      id: '',
      nome: '',
      email: '',
      telefone: '',
      dataNascimento: '',
      endereco: '',
      cpf: ''
    });
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCliente({
      ...newCliente,
      [name]: value
    });
  };

  const handleSave = () => {
    const updatedClientes = newCliente.id
      ? clientes.map(cliente => (cliente.id === newCliente.id ? newCliente : cliente))
      : [...clientes, { ...newCliente, id: Date.now() }];
      
    setClientes(updatedClientes);
    localStorage.setItem('clientes', JSON.stringify(updatedClientes));
    handleClose();
  };

  const handleEdit = (cliente) => {
    setNewCliente(cliente);
    setShowModal(true);
  };

  const handleDelete = (cliente) => {
    setClienteParaExcluir(cliente);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    const updatedClientes = clientes.filter(cliente => cliente.id !== clienteParaExcluir.id);
    setClientes(updatedClientes);
    localStorage.setItem('clientes', JSON.stringify(updatedClientes));
    setShowDeleteModal(false);
  };

  return (
    <Pagina titulo="Clientes">
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">Lista de Clientes</h2>
          <Button variant="success" onClick={handleShow}>
            <FaUserPlus className="me-2" /> Cadastrar Cliente
          </Button>
        </div>
        
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {clientes.map(cliente => (
            <Col key={cliente.id}>
              <Card className="shadow-sm">
                <Card.Body>
                  <Card.Title>{cliente.nome}</Card.Title>
                  <Card.Text>Email: {cliente.email}</Card.Text>
                  <Card.Text>Telefone: {cliente.telefone}</Card.Text>
                  <div className="d-flex justify-content-between">
                    <Button variant="warning" onClick={() => handleEdit(cliente)}>
                      <FaEdit /> Editar
                    </Button>
                    <Button variant="danger" onClick={() => handleDelete(cliente)}>
                      <FaTrash /> Excluir
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        
        {/* Modal para cadastro/edição de clientes */}
        <Modal show={showModal} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>{newCliente.id ? 'Editar Cliente' : 'Cadastrar Cliente'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3" controlId="formNome">
                <Form.Label>Nome</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Digite o nome do cliente"
                  name="nome"
                  value={newCliente.nome}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Digite o email do cliente"
                  name="email"
                  value={newCliente.email}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formTelefone">
                <Form.Label>Telefone</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Digite o telefone"
                  name="telefone"
                  value={newCliente.telefone}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formDataNascimento">
                <Form.Label>Data de Nascimento</Form.Label>
                <Form.Control
                  type="date"
                  name="dataNascimento"
                  value={newCliente.dataNascimento}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formEndereco">
                <Form.Label>Endereço</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Digite o endereço"
                  name="endereco"
                  value={newCliente.endereco}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formCPF">
                <Form.Label>CPF</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Digite o CPF"
                  name="cpf"
                  value={newCliente.cpf}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
            <Button variant="primary" onClick={handleSave}>Salvar</Button>
          </Modal.Footer>
        </Modal>

        {/* Modal de confirmação de exclusão */}
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirmar Exclusão</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Você tem certeza que deseja excluir o cliente <strong>{clienteParaExcluir?.nome}</strong>?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancelar</Button>
            <Button variant="danger" onClick={confirmDelete}>Excluir</Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </Pagina>
  );
}

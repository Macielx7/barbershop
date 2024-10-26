'use client';

import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Container, Table } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import Pagina from "../components/Pagina";

export default function Funcionarios() {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [funcionarios, setFuncionarios] = useState([]);
  const [newFuncionario, setNewFuncionario] = useState({ id: null, nome: '', cargo: '', email: '' });
  const [selectedFuncionario, setSelectedFuncionario] = useState(null);

  // Carrega os funcionários do localStorage quando o componente é montado
  useEffect(() => {
    const storedFuncionarios = localStorage.getItem('funcionarios');
    if (storedFuncionarios) {
      setFuncionarios(JSON.parse(storedFuncionarios));
    }
  }, []);

  const handleShow = () => {
    setNewFuncionario({ id: null, nome: '', cargo: '', email: '' });
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);
  const handleDeleteClose = () => setShowDeleteModal(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFuncionario({ ...newFuncionario, [name]: value });
  };

  const handleSave = () => {
    let updatedFuncionarios;

    // Se já existe um ID, atualiza o funcionário existente
    if (newFuncionario.id) {
      updatedFuncionarios = funcionarios.map(funcionario => funcionario.id === newFuncionario.id ? newFuncionario : funcionario);
    } else {
      // Se não, adiciona um novo funcionário
      updatedFuncionarios = [...funcionarios, { ...newFuncionario, id: Date.now() }];
    }

    // Atualiza o estado local e o localStorage
    setFuncionarios(updatedFuncionarios);
    localStorage.setItem('funcionarios', JSON.stringify(updatedFuncionarios));
    handleClose();
  };

  const handleEdit = (funcionario) => {
    setNewFuncionario(funcionario);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    const updatedFuncionarios = funcionarios.filter(funcionario => funcionario.id !== id);
    setFuncionarios(updatedFuncionarios);
    localStorage.setItem('funcionarios', JSON.stringify(updatedFuncionarios));
    handleDeleteClose();
  };

  const confirmDelete = (funcionario) => {
    setSelectedFuncionario(funcionario);
    setShowDeleteModal(true);
  };

  return (
    <Pagina titulo="Funcionários">
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">Lista de Funcionários</h2>
          <Button variant="success" onClick={handleShow}>
            <FaPlus className="me-2" /> Cadastrar Funcionário
          </Button>
        </div>

        {/* Tabela de Funcionários */}
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Cargo</th>
              <th>Email</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {funcionarios.map(funcionario => (
              <tr key={funcionario.id}>
                <td>{funcionario.id}</td>
                <td>{funcionario.nome}</td>
                <td>{funcionario.cargo}</td>
                <td>{funcionario.email}</td>
                <td>
                  <Button variant="primary" onClick={() => handleEdit(funcionario)} className="me-2">
                    <FaEdit /> Editar
                  </Button>
                  <Button variant="danger" onClick={() => confirmDelete(funcionario)}>
                    <FaTrash /> Excluir
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Modal para cadastro/edição de funcionários */}
        <Modal show={showModal} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>{newFuncionario.id ? 'Editar Funcionário' : 'Cadastrar Funcionário'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3" controlId="formNome">
                <Form.Label>Nome</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Digite o nome do funcionário"
                  name="nome"
                  value={newFuncionario.nome}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formCargo">
                <Form.Label>Cargo</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Digite o cargo do funcionário"
                  name="cargo"
                  value={newFuncionario.cargo}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Digite o email do funcionário"
                  name="email"
                  value={newFuncionario.email}
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
        <Modal show={showDeleteModal} onHide={handleDeleteClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirmar Exclusão</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Tem certeza que deseja excluir o funcionário "{selectedFuncionario?.nome}"?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleDeleteClose}>Cancelar</Button>
            <Button variant="danger" onClick={() => { handleDelete(selectedFuncionario.id); handleDeleteClose(); }}>Excluir</Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </Pagina>
  );
}

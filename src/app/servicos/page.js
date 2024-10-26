'use client';
import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Form, Container, Row, Col } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import Pagina from "../components/Pagina";
export default function Servicos() {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [servicos, setServicos] = useState([]);
  const [newServico, setNewServico] = useState({ id: null, nome: '', descricao: '', imagem: '', preco: '' });
  const [selectedServico, setSelectedServico] = useState(null);

  // Carrega os serviços do localStorage quando o componente é montado
  useEffect(() => {
    const storedServicos = localStorage.getItem('servicos');
    if (storedServicos) {
      setServicos(JSON.parse(storedServicos));
    }
  }, []);

  const handleShow = () => {
    setNewServico({ id: null, nome: '', descricao: '', imagem: '', preco: '' });
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);
  const handleDeleteClose = () => setShowDeleteModal(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewServico({ ...newServico, [name]: value });
  };

  const handleSave = () => {
    let updatedServicos;

    // Se já existe um ID, atualiza o serviço existente
    if (newServico.id) {
      updatedServicos = servicos.map(servico => servico.id === newServico.id ? newServico : servico);
    } else {
      // Se não, adiciona um novo serviço
      updatedServicos = [...servicos, { ...newServico, id: Date.now() }];
    }

    // Atualiza o estado local e o localStorage
    setServicos(updatedServicos);
    localStorage.setItem('servicos', JSON.stringify(updatedServicos));
    handleClose();
  };

  const handleEdit = (servico) => {
    setNewServico(servico);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    const updatedServicos = servicos.filter(servico => servico.id !== id);
    setServicos(updatedServicos);
    localStorage.setItem('servicos', JSON.stringify(updatedServicos));
    handleDeleteClose();
  };

  const confirmDelete = (servico) => {
    setSelectedServico(servico);
    setShowDeleteModal(true);
  };

  return (
    <Pagina titulo="Serviços">
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">Lista de Serviços</h2>
          <Button variant="success" onClick={handleShow}>
            <FaPlus className="me-2" /> Cadastrar Serviço
          </Button>
        </div>

        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {servicos.map(servico => (
            <Col key={servico.id}>
              <Card className="shadow-sm text-center">
                <Card.Img variant="top" src={servico.imagem || 'https://via.placeholder.com/200'} />
                <Card.Body>
                  <Card.Title>{servico.nome}</Card.Title>
                  <Card.Text>{servico.descricao}</Card.Text>
                  <Card.Text><strong>Preço:</strong> R$ {servico.preco}</Card.Text>
                  <Button variant="primary" onClick={() => handleEdit(servico)} className="me-2">
                    <FaEdit /> Editar
                  </Button>
                  <Button variant="danger" onClick={() => confirmDelete(servico)}>
                    <FaTrash /> Excluir
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Modal para cadastro/edição de serviços */}
        <Modal show={showModal} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>{newServico.id ? 'Editar Serviço' : 'Cadastrar Serviço'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3" controlId="formNome">
                <Form.Label>Nome do Serviço</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Digite o nome do serviço"
                  name="nome"
                  value={newServico.nome}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formDescricao">
                <Form.Label>Descrição</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Digite a descrição do serviço"
                  name="descricao"
                  value={newServico.descricao}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formImagem">
                <Form.Label>Imagem (URL)</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Digite a URL da imagem do serviço"
                  name="imagem"
                  value={newServico.imagem}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formPreco">
                <Form.Label>Preço</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Digite o preço do serviço"
                  name="preco"
                  value={newServico.preco}
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
            <p>Tem certeza que deseja excluir o serviço "{selectedServico?.nome}"?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleDeleteClose}>Cancelar</Button>
            <Button variant="danger" onClick={() => { handleDelete(selectedServico.id); handleDeleteClose(); }}>Excluir</Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </Pagina>
  );
}

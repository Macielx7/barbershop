'use client'
import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Form, Container, Row, Col } from 'react-bootstrap';
import { FaUserPlus, FaEdit, FaTrash } from 'react-icons/fa';
import Pagina from "../components/Pagina";


export default function Page(){
       
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [produto, setProduto] = useState([]);
  const [newProduto, setNewProduto] = useState({
    id: '',
    nome: '',
    preco: '',
    descricao: '',
    imagem: '',
  });
  const [produtoParaExcluir, setProdutoParaExcluir] = useState(null);

  useEffect(() => {
    // Recupera os produtos do localStorage ao carregar o componente
    const storedProduto = localStorage.getItem('produtos');
    if (storedProduto) {
      setProduto(JSON.parse(storedProduto));
    }
  }, []);

  const handleShow = () => {
    setNewProduto({
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
    setNewProduto({
      ...newProduto,
      [name]: value
    });
  };

  const handleSave = () => {
    const updatedProduto = newProduto.id
      ? produto.map(produto => (produto.id === newProduto.id ? newProduto : produto))
      : [...produto, { ...newProduto, id: Date.now() }];
      
    setProduto(updatedProduto);
    localStorage.setItem('produto', JSON.stringify(updatedProduto));
    handleClose();
  };

  const handleEdit = (produto) => {
    setNewProduto(produto);
    setShowModal(true);
  };

  const handleDelete = (produto) => {
    setProdutoParaExcluir(produto);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    const updatedProduto = produto.filter(produto => produto.id !== produtoParaExcluir.id);
    setProduto(updatedProduto);
    localStorage.setItem('produto', JSON.stringify(updatedProduto));
    setShowDeleteModal(false);
  };

  return (
    <Pagina titulo="Produtos">
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">Lista de Produto</h2>
          <Button variant="success" onClick={handleShow}>
            <FaUserPlus className="me-2" /> Cadastrar Produto
          </Button>
        </div>
        
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {produto.map(produto => (
            <Col key={produto.id}>
              <Card className="shadow-sm">
              <Card.Img variant="top" src={produto.imagem || 'https://via.placeholder.com/200'} />
                <Card.Body>
                  <Card.Title>{produto.nome}</Card.Title>
                  <Card.Text><strong>Preço:</strong> R$ {produto.preco}</Card.Text>
                  <Card.Text>{produto.descricao}</Card.Text>
                  <div className="d-flex justify-content-between">
                    <Button variant="warning" onClick={() => handleEdit(produto)}>
                      <FaEdit /> Editar
                    </Button>
                    <Button variant="danger" onClick={() => handleDelete(produto)}>
                      <FaTrash /> Excluir
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        
        {/* Modal para cadastro/edição de Produto */}
        <Modal show={showModal} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>{newProduto.id ? 'Editar Produto' : 'Cadastrar Produto'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3" controlId="formNome">
                <Form.Label>Nome</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Digite o nome do produto"
                  name="nome"
                  value={newProduto.nome}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formPreco">
                <Form.Label>Preço</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Digite o preço do produto"
                  name="preco"
                  value={newProduto.preco}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formDescricao">
                <Form.Label>Descrição</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Digite a descrição do produto"
                  name="descricao"
                  value={newProduto.descricao}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formImagem">
                <Form.Label>Imagem (URL)</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Digite a URL da imagem do produto"
                  name="imagem"
                  value={newProduto.imagem}
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
            Você tem certeza que deseja excluir o produto <strong>{produtoParaExcluir?.nome}</strong>?
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
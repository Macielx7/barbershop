'use client'
import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Form, Container, Row, Col } from 'react-bootstrap';
import { FaUserPlus, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import Pagina from "../components/Pagina";
import { Formik } from 'formik';
import * as yup from 'yup';
import { mask, unMask } from 'remask';



const schema = yup.object().shape({
  nome: yup.string().required('Nome é obrigatório'),
  preco: yup.string().required('Preço é obrigatório'),
  descricao: yup.string().max(30, 'Limite de caracteres atingido, apague um por gentileza')
});

export default function Page() {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [produtos, setProdutos] = useState([]);
  const [produtoParaExcluir, setProdutoParaExcluir] = useState(null);
  const [produtoEditando, setProdutoEditando] = useState(null); // Estado para armazenar o produto em edição

  useEffect(() => {
    const storedProdutos = localStorage.getItem('produtos');
    if (storedProdutos) {
      setProdutos(JSON.parse(storedProdutos));
    }
  }, []);

  const handleShow = () => {
    setProdutoEditando(null); // Limpa qualquer produto em edição para um novo cadastro
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);



  const handleSave = (values) => {
    const produtoParaSalvar = {
      ...values,
      id: values.id || Date.now(),
      preco: parseFloat(values.preco),
      dataVenda: values.dataVenda || '', // Adiciona a data da venda
    };

    const updatedProdutos = values.id
      ? produtos.map((produto) => (produto.id === values.id ? produtoParaSalvar : produto))
      : [...produtos, produtoParaSalvar];

    setProdutos(updatedProdutos);
    localStorage.setItem('produtos', JSON.stringify(updatedProdutos));
    handleClose();
  };

  const handleEdit = (produto) => {
    setProdutoEditando(produto); // Define o produto atual para edição
    setShowModal(true);
  };

  const handleDelete = (produto) => {
    setProdutoParaExcluir(produto);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    const updatedProdutos = produtos.filter(produto => produto.id !== produtoParaExcluir.id);
    setProdutos(updatedProdutos);
    localStorage.setItem('produtos', JSON.stringify(updatedProdutos));
    setShowDeleteModal(false);
  };

  return (
    <Pagina titulo="Produtos">
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">Lista de Produtos</h2>
          <Button variant="success" onClick={handleShow}>
            <FaPlus className="me-2" /> Cadastrar Produto
          </Button>
        </div>

        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {produtos.map(produto => (
            <Col key={produto.id}>
              <Card className="shadow-sm text-center h-100">
                <Card.Img variant="top" src={produto.imagem || 'https://via.placeholder.com/200'}
                  style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                />
                <Card.Body className="d-flex flex-column">
                  <Card.Title style={{ fontSize: '1.1em', height: '2.5em', overflow: 'hidden' }}>
                    {produto.nome}
                  </Card.Title>
                  <Card.Text>
                    <strong>Preço:</strong> R$ {produto.preco}
                  </Card.Text>
                  <Card.Text><strong>Status:</strong> {produto.status === 'em_estoque' ? 'Em estoque' : 'Vendido'}</Card.Text>
                  <Card.Text style={{ flex: '1', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {produto.descricao}
                  </Card.Text>
                  <Card.Text>
                  <strong>Data da Venda:</strong> {produto.dataVenda}
                  </Card.Text>
                  <div className="mt-auto">
                    <Button variant="primary" onClick={() => handleEdit(produto)} className="me-2">
                      <FaEdit />
                    </Button>
                    <Button variant="danger" onClick={() => handleDelete(produto)}>
                      <FaTrash />
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
            <Modal.Title>{produtoEditando ? 'Editar Produto' : 'Cadastrar Produto'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Formik
              validationSchema={schema}
              initialValues={{
                id: produtoEditando?.id || '',
                nome: produtoEditando?.nome || '',
                preco: produtoEditando?.preco || '',
                descricao: produtoEditando?.descricao || '',
                imagem: produtoEditando?.imagem || '',
                status: produtoEditando?.status || 'em_estoque',
                dataVenda: produtoEditando?.dataVenda || '', 
              }}
              onSubmit={handleSave}
              enableReinitialize // Recarrega os valores iniciais ao alterar o produto em edição
            >
              {({ handleSubmit, handleChange, values, errors }) => (
                <Form noValidate onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="formNome">
                    <Form.Label>Nome</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Digite o nome do produto"
                      name="nome"
                      value={values.nome}
                      onChange={handleChange}
                      isInvalid={!!errors.nome}
                    />
                    <Form.Control.Feedback type="invalid">{errors.nome}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formPreco">
                    <Form.Label>Preço do Produto</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Digite o preço do produto"
                      name="preco"
                      value={values.preco}
                      onChange={(e) =>
                        handleChange({
                          target: {
                            name: 'preco',
                            value: mask(unMask(e.target.value), ['9.99', '99.99', '999.99', '9.999.99', '99.999.99', '999.999.99', '9.999.999.99', '99.999.999.99'])
                          },
                        })
                      }
                      isInvalid={!!errors.preco}
                    />
                    <Form.Control.Feedback type="invalid">{errors.preco}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formStatus">
                    <Form.Label>Status</Form.Label>
                    <Form.Control
                      as="select"
                      name="status"
                      value={values.status}
                      onChange={handleChange}
                    >
                      <option value="em_estoque">Em estoque</option>
                      <option value="vendido">Vendido</option>
                    </Form.Control>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formDescricao">
                    <Form.Label>Descrição</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Digite a descrição do produto"
                      name="descricao"
                      value={values.descricao}
                      onChange={handleChange}
                      isInvalid={!!errors.descricao}
                      maxLength={31} // Limita o campo a 30 caracteres
                    />
                    <Form.Control.Feedback type="invalid">{errors.descricao}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formImagem">
                    <Form.Label>Imagem (URL)</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Digite a URL da imagem do produto"
                      name="imagem"
                      value={values.imagem}
                      onChange={handleChange}
                    />
                  </Form.Group>


                  <Form.Group className="mb-3" controlId="formDataVenda">
                    <Form.Label>Data da Venda</Form.Label>
                    <Form.Control
                      type="date"
                      name="dataVenda"
                      value={values.dataVenda}
                      onChange={handleChange}
                    />
                  </Form.Group>






                  <Button variant="primary" type="submit">
                    Salvar
                  </Button>
                </Form>
              )}
            </Formik>
          </Modal.Body>
        </Modal>

        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirmar Exclusão</Modal.Title>
          </Modal.Header>
          <Modal.Body>Você tem certeza que deseja excluir o produto <strong>{produtoParaExcluir?.nome}</strong>?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancelar</Button>
            <Button variant="danger" onClick={confirmDelete}>Excluir</Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </Pagina>
  );
}

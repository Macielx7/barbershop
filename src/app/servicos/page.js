'use client';
import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Form, Container, Row, Col } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import Pagina from "../components/Pagina";
import { Formik } from 'formik';
import * as yup from 'yup';
import { mask, unMask } from 'remask';

export default function Servicos() {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [servicos, setServicos] = useState([]);
  const [selectedServico, setSelectedServico] = useState(null);

  // Esquema de validação com Yup
  const validationSchema = yup.object().shape({
    nome: yup.string().required('Nome do serviço é obrigatório'),
    preco: yup.string().required('Preço é obrigatório'),
    descricao: yup.string().max(30, 'Limite de caracteres atingido, apague um por gentileza'),
  });

  // Carrega os serviços do localStorage quando o componente é montado
  useEffect(() => {
    const storedServicos = localStorage.getItem('servicos');
    if (storedServicos) {
      setServicos(JSON.parse(storedServicos));
    }
  }, []);

  const handleShow = () => {
    setSelectedServico(null); // Limpa o serviço selecionado para um novo cadastro
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);
  const handleDeleteClose = () => setShowDeleteModal(false);

  const handleSave = (values) => {
    let updatedServicos;

    // Se já existe um ID, atualiza o serviço existente
    if (values.id) {
      updatedServicos = servicos.map(servico => servico.id === values.id ? values : servico);
    } else {
      // Se não, adiciona um novo serviço
      updatedServicos = [...servicos, { ...values, id: Date.now() }];
    }

    // Atualiza o estado local e o localStorage
    setServicos(updatedServicos);
    localStorage.setItem('servicos', JSON.stringify(updatedServicos));
    handleClose();
  };

  const handleEdit = (servico) => {
    setSelectedServico(servico);
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
              <Card className="shadow-sm text-center h-100"> {/* h-100 força altura total */}
                <Card.Img
                  variant="top"
                  src={servico.imagem || 'https://via.placeholder.com/200'}
                  style={{ width: '100%', height: '300px', objectFit: 'cover' }}
                />
                <Card.Body className="d-flex flex-column">
                  <Card.Title style={{ fontSize: '1.1em', height: '2.5em', overflow: 'hidden' }}>
                    {servico.nome}
                  </Card.Title>
                  <Card.Text style={{ flex: '1', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {servico.descricao}
                  </Card.Text>
                  <Card.Text><strong>Preço:</strong> R$ {servico.preco}</Card.Text>
                  <div className="mt-auto">
                    <Button variant="primary" onClick={() => handleEdit(servico)} className="me-2">
                      <FaEdit />
                    </Button>
                    <Button variant="danger" onClick={() => confirmDelete(servico)}>
                      <FaTrash />
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>



        {/* Modal para cadastro/edição de serviços */}
        <Modal show={showModal} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>{selectedServico ? 'Editar Serviço' : 'Cadastrar Serviço'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Formik
              validationSchema={validationSchema}
              initialValues={{
                id: selectedServico?.id || null,
                nome: selectedServico?.nome || '',
                descricao: selectedServico?.descricao || '',
                imagem: selectedServico?.imagem || '',
                preco: selectedServico?.preco || '',
              }}
              onSubmit={handleSave}
              enableReinitialize
            >
              {({ handleSubmit, handleChange, values, errors, touched }) => (
                <Form noValidate onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="formNome">
                    <Form.Label>Nome do Serviço</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Digite o nome do serviço"
                      name="nome"
                      value={values.nome}
                      onChange={handleChange}
                      isInvalid={!!errors.nome && touched.nome}
                    />
                    <Form.Control.Feedback type="invalid">{errors.nome}</Form.Control.Feedback>
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
                      placeholder="Digite a URL da imagem do serviço"
                      name="imagem"
                      value={values.imagem}
                      onChange={handleChange}
                      isInvalid={!!errors.imagem && touched.imagem}
                    />
                    <Form.Control.Feedback type="invalid">{errors.imagem}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formPreco">
                    <Form.Label>Preço</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Digite o preço do serviço"
                      name="preco"
                      value={values.preco}
                      onChange={(e) =>
                        handleChange({
                          target: {
                            name: 'preco',
                            value: mask(unMask(e.target.value), ['9.99', '99.99', '999.99', '9.999.99', '99.999.99', '999.999.99']),
                          },
                        })
                      }
                      isInvalid={!!errors.preco && touched.preco}
                    />
                    <Form.Control.Feedback type="invalid">{errors.preco}</Form.Control.Feedback>
                  </Form.Group>

                  <Button variant="primary" type="submit">
                    Salvar
                  </Button>
                </Form>
              )}
            </Formik>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
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

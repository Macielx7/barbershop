'use client';

import React, { useState, useEffect } from 'react';
import { Button, Modal, Container, Table, Card, Form, Row, Col } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaUserPlus } from 'react-icons/fa';
import { Formik, Form as FormikForm, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Pagina from "../components/Pagina";
import { mask } from 'remask';

export default function Funcionarios() {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [funcionarios, setFuncionarios] = useState([]);
  const [selectedFuncionario, setSelectedFuncionario] = useState(null);

  // Carrega os funcionários do localStorage quando o componente é montado
  useEffect(() => {
    const storedFuncionarios = localStorage.getItem('funcionarios');
    if (storedFuncionarios) {
      setFuncionarios(JSON.parse(storedFuncionarios));
    }
  }, []);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);
  const handleDeleteClose = () => setShowDeleteModal(false);

  const handleSave = (values) => {
    let updatedFuncionarios;
    const newFuncionario = { ...values, id: values.id || Date.now() };

    if (values.id) {
      // Atualiza o funcionário existente
      updatedFuncionarios = funcionarios.map((func) =>
        func.id === values.id ? newFuncionario : func
      );
    } else {
      // Adiciona um novo funcionário
      updatedFuncionarios = [...funcionarios, newFuncionario];
    }

    setFuncionarios(updatedFuncionarios);
    localStorage.setItem('funcionarios', JSON.stringify(updatedFuncionarios));
    handleClose();
  };

  const handleEdit = (funcionario) => {
    setShowModal(true);
    setSelectedFuncionario(funcionario);
  };

  const handleDelete = (id) => {
    const updatedFuncionarios = funcionarios.filter((funcionario) => funcionario.id !== id);
    setFuncionarios(updatedFuncionarios);
    localStorage.setItem('funcionarios', JSON.stringify(updatedFuncionarios));
    handleDeleteClose();
  };

  const confirmDelete = (funcionario) => {
    setSelectedFuncionario(funcionario);
    setShowDeleteModal(true);
  };

  // Validação com Yup
  const validationSchema = Yup.object({
    nome: Yup.string().required('O nome é obrigatório'),
    email: Yup.string().email('Email inválido').required('O email é obrigatório'),
    telefone: Yup.string().required('O telefone é obrigatório'),
    imagem: Yup.string().required('A imagem é obrigatória'),
  });

  return (
    <Pagina titulo="Funcionários">
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">Lista de Funcionários</h2>
          <Button variant="success" onClick={() => { setSelectedFuncionario(null); handleShow(); }}>
            <FaUserPlus className="me-2" /> Cadastrar Funcionário
          </Button>
        </div>

        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {funcionarios.map(funcionario => (
            <Col key={funcionario.id}>
              <Card className="shadow-sm text-center h-100"> {/* h-100 força altura total */}
                <Card.Img
                  variant="top"
                  src={funcionario.imagem || 'https://via.placeholder.com/200'}
                  style={{ width: '100%', height: '300px', objectFit: 'cover' }}
                />
                <Card.Body className="d-flex flex-column">
                  <Card.Title style={{ fontSize: '1.1em', height: '2.5em', overflow: 'hidden' }}>
                    {funcionario.nome}
                  </Card.Title>
                  <Card.Text>
                  <strong>Telefone: </strong>{funcionario.telefone}
                  </Card.Text>
                  <Card.Text><strong>Email: </strong>{funcionario.email}</Card.Text>
                  <div className="mt-auto">
                    <Button variant="primary" onClick={() => handleEdit(funcionario)} className="me-2">
                      <FaEdit />
                    </Button>
                    <Button variant="danger" onClick={() => confirmDelete(funcionario)}>
                      <FaTrash />
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>


        {/* Modal para cadastro/edição de funcionários */}
        <Modal show={showModal} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>{selectedFuncionario ? 'Editar Funcionário' : 'Cadastrar Funcionário'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Formik
              initialValues={
                selectedFuncionario || { id: null, nome: '', email: '', telefone: '', imagem: '' }
              }
              validationSchema={validationSchema}
              onSubmit={(values) => handleSave(values)}
            >
              {({ values, handleChange, setFieldValue }) => (
                <FormikForm>
                  <Form.Group className="mb-3">
                    <Form.Label>Nome</Form.Label>
                    <Field
                      name="nome"
                      type="text"
                      className="form-control"
                      placeholder="Digite o nome do funcionário"
                      value={values.nome}
                      onChange={handleChange}
                    />
                    <ErrorMessage name="nome" component="div" className="text-danger" />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Field
                      name="email"
                      type="email"
                      className="form-control"
                      placeholder="Digite o email do funcionário"
                      value={values.email}
                      onChange={handleChange}
                    />
                    <ErrorMessage name="email" component="div" className="text-danger" />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Telefone</Form.Label>
                    <Field
                      name="telefone"
                      type="text"
                      className="form-control"
                      placeholder="Digite o telefone do funcionário"
                      value={values.telefone}
                      onChange={(e) => setFieldValue('telefone', mask(e.target.value, ['(99) 99999-9999']))}
                    />
                    <ErrorMessage name="telefone" component="div" className="text-danger" />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Imagem (URL)</Form.Label>
                    <Field
                      name="imagem"
                      type="text"
                      className="form-control"
                      placeholder="Digite a URL da imagem do funcionário"
                      value={values.imagem}
                      onChange={handleChange}
                    />
                    <ErrorMessage name="imagem" component="div" className="text-danger" />
                  </Form.Group>

                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                      Cancelar
                    </Button>
                    <Button variant="primary" type="submit">
                      Salvar
                    </Button>
                  </Modal.Footer>
                </FormikForm>
              )}
            </Formik>
          </Modal.Body>
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
            <Button variant="secondary" onClick={handleDeleteClose}>
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                handleDelete(selectedFuncionario.id);
                handleDeleteClose();
              }}
            >
              Excluir
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </Pagina>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Form, Container, Row, Col } from 'react-bootstrap';
import { FaUserPlus, FaEdit, FaTrash } from 'react-icons/fa';
import Pagina from "../components/Pagina";
import axios from 'axios';
import { mask } from 'remask'; // Atualização na importação do remask
import * as Yup from 'yup'; // Importando o Yup para validação
import { Formik } from 'formik'; // Usando Formik para gerenciar o formulário
import jsPDF from 'jspdf';
import 'jspdf-autotable';

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
    cep: '',
    endereco: '',
    bairro: '',
    cidade: '',
    uf: '',
    cpf: '',
    numero: '',
  });
  const [clienteParaExcluir, setClienteParaExcluir] = useState(null);
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    const storedClientes = localStorage.getItem('clientes');
    if (storedClientes) {
      setClientes(JSON.parse(storedClientes));
    }
  }, []);

  const buscarEnderecoPorCep = async (cep) => {
    const cepFormatado = cep.replace(/\D/g, '');
    if (cepFormatado.length === 8) {
      try {
        const response = await axios.get(`https://viacep.com.br/ws/${cepFormatado}/json/`);
        const dadosEndereco = response.data;

        if (dadosEndereco.erro) {
          alert('CEP não encontrado!');
          return;
        }

        setNewCliente(prevCliente => ({
          ...prevCliente,
          endereco: dadosEndereco.logradouro || '',
          bairro: dadosEndereco.bairro || '',
          cidade: dadosEndereco.localidade || '',
          uf: dadosEndereco.uf || ''
        }));
      } catch (error) {
        alert('Erro ao buscar CEP!');
      }
    }
  };

  // Validação com Yup
  const validationSchema = Yup.object({
    nome: Yup.string().required('O nome é obrigatório'),
    email: Yup.string().email('Email inválido').required('O email é obrigatório'),
    telefone: Yup.string().required('O telefone é obrigatório'),
    dataNascimento: Yup.string().required('A data de nascimento é obrigatória'),
    cpf: Yup.string().required('O CPF é obrigatório').min(11, 'CPF inválido'),
});



  // Função para exportar os clientes em PDF
  const exportarPdfClientes = () => {
    // Cria o documento com orientação paisagem
    const doc = new jsPDF('l', 'mm', 'a4'); // 'l' para landscape, 'a4' para o tamanho A4
  
    // Definindo o título
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(14);
    doc.text('Lista de Clientes', 10, 10);
  
    // Dados dos clientes
    const data = clientes.map(cliente => [
      cliente.nome,
      cliente.email,
      cliente.telefone,
      cliente.dataNascimento,
      cliente.cpf,
      cliente.endereco,
      cliente.numero,
      cliente.bairro,
      cliente.cidade,
      cliente.uf,
    ]);
  
    // Cabeçalhos da tabela
    const headers = ['Nome', 'Email', 'Telefone', 'Data Nascimento', 'CPF', 'Endereço', 'Número', 'Bairro', 'Cidade', 'UF'];
  
    // Gerando a tabela
    doc.autoTable({
      head: [headers],
      body: data,
      startY: 20,
      margin: { top: 10, left: 2, right: 2 },
      styles: {
        fontSize: 8, // Reduzindo o tamanho da fonte para ajustar as células
        cellPadding: 3, // Menos preenchimento para as células
        overflow: 'linebreak',
        halign: 'center',
        valign: 'middle',
      },
      headStyles: {
        fillColor: [22, 160, 133],
        textColor: [255, 255, 255],
      },
      bodyStyles: {
        fillColor: [245, 245, 245],
      },
      columnStyles: {
        0: { cellWidth: 30 }, // Nome
        1: { cellWidth: 40 }, // Email
        2: { cellWidth: 30 }, // Telefone
        3: { cellWidth: 25 }, // Data Nascimento
        4: { cellWidth: 30 }, // CPF
        5: { cellWidth: 50 }, // Endereço
        6: { cellWidth: 20 }, // Número
        7: { cellWidth: 25 }, // Bairro
        8: { cellWidth: 25 }, // Cidade
        9: { cellWidth: 15 }, // UF
      },
    });
  
    // Salva o PDF com o nome
    doc.save('clientes.pdf');
  };


















  const handleShow = () => {
    setNewCliente({
      id: '',
      nome: '',
      email: '',
      telefone: '',
      dataNascimento: '',
      cep: '',
      endereco: '',
      bairro: '',
      cidade: '',
      uf: '',
      cpf: '',
      numero: '',
    });
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'cep') {
      let cepFormatado = value.replace(/\D/g, '');

      if (cepFormatado.length > 8) {
        cepFormatado = cepFormatado.slice(0, 8);
      }

      cepFormatado = cepFormatado.replace(/^(\d{5})(\d)/, '$1-$2');

      setNewCliente({
        ...newCliente,
        [name]: cepFormatado
      });

      if (cepFormatado.replace(/\D/g, '').length === 8) {
        buscarEnderecoPorCep(cepFormatado);
      }
    } else {
      setNewCliente({
        ...newCliente,
        [name]: value
      });
    }
  };

  const handleSave = (values) => {
    const clienteParaSalvar = {
      id: newCliente.id || Date.now(),
      nome: values.nome,
      email: values.email,
      telefone: values.telefone,
      dataNascimento: values.dataNascimento,
      cep: newCliente.cep,
      endereco: newCliente.endereco,
      bairro: newCliente.bairro,
      cidade: newCliente.cidade,
      uf: newCliente.uf,
      cpf: values.cpf,
      numero: newCliente.numero,
    };

    const updatedClientes = newCliente.id
      ? clientes.map(cliente => (cliente.id === newCliente.id ? clienteParaSalvar : cliente))
      : [...clientes, clienteParaSalvar];

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

          <Button variant="info" onClick={exportarPdfClientes}>
            Exportar PDF
          </Button>

          <Button variant="success" onClick={handleShow}>
            <FaUserPlus className="me-2" /> Cadastrar Cliente
          </Button>    
        </div>

        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {clientes.map(cliente => (
            <Col key={cliente.id}>
              <Card className="shadow-sm text-center h-100">
                <Card.Body className="d-flex flex-column">
                  <Card.Title style={{ fontSize: '1.1em', height: '2.5em', overflow: 'hidden' }}>
                    {cliente.nome}
                    </Card.Title>
                  <Card.Text><strong>Email:</strong> {cliente.email}</Card.Text>
                  <Card.Text><strong>Telefone:</strong> {cliente.telefone}</Card.Text>
                  <div className="mt-auto">
                    <Button variant="primary" onClick={() => handleEdit(cliente)} className="me-2">
                      <FaEdit />
                    </Button>
                    <Button variant="danger" onClick={() => handleDelete(cliente)}>
                      <FaTrash />
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        <Modal show={showModal} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>{newCliente.id ? 'Editar Cliente' : 'Cadastrar Cliente'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Formik
              initialValues={newCliente}
              validationSchema={validationSchema}
              onSubmit={handleSave}
            >
              {({
                values,
                handleChange,
                handleBlur,
                handleSubmit,
                touched,
                errors
              }) => (
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="formNome">
                    <Form.Label>Nome</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Digite o nome do cliente"
                      name="nome"
                      value={values.nome}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.nome && !!errors.nome}
                    />
                    {touched.nome && errors.nome && <div className="invalid-feedback">{errors.nome}</div>}
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Digite o email do cliente"
                      name="email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.email && !!errors.email}
                    />
                    {touched.email && errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formTelefone">
                    <Form.Label>Telefone</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Digite o telefone"
                      name="telefone"
                      value={mask(values.telefone, ['(99) 9999-9999', '(99) 99999-9999'])}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.telefone && !!errors.telefone}
                    />
                    {touched.telefone && errors.telefone && <div className="invalid-feedback">{errors.telefone}</div>}
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formDataNascimento">
                    <Form.Label>Data de Nascimento</Form.Label>
                    <Form.Control
                      type="date"
                      name="dataNascimento"
                      value={values.dataNascimento}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.dataNascimento && !!errors.dataNascimento}
                    />
                    {touched.dataNascimento && errors.dataNascimento && <div className="invalid-feedback">{errors.dataNascimento}</div>}
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formCpf">
                    <Form.Label>CPF</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Digite o CPF"
                      name="cpf"
                      value={mask(values.cpf, ['999.999.999-99'])}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.cpf && !!errors.cpf}
                    />
                    {touched.cpf && errors.cpf && <div className="invalid-feedback">{errors.cpf}</div>}
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formCep">
                    <Form.Label>CEP</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Digite o CEP"
                      name="cep"
                      value={newCliente.cep}
                      onChange={handleInputChange}
                      isInvalid={touched.cep && !!errors.cep}
                    />
                     {touched.cep && errors.cep && <div className="invalid-feedback">{errors.cep}</div>}
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formEndereco">
                    <Form.Label>Endereço</Form.Label>
                    <Form.Control
                      type="text"
                      name="endereco"
                      value={newCliente.endereco}
                      disabled
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formBairro">
                    <Form.Label>Bairro</Form.Label>
                    <Form.Control
                      type="text"
                      name="bairro"
                      value={newCliente.bairro}
                      disabled
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formCidade">
                    <Form.Label>Cidade</Form.Label>
                    <Form.Control
                      type="text"
                      name="cidade"
                      value={newCliente.cidade}
                      disabled
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formUf">
                    <Form.Label>UF</Form.Label>
                    <Form.Control
                      type="text"
                      name="uf"
                      value={newCliente.uf}
                      disabled
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formNum">
                    <Form.Label>Número</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Digite o Número da casa"
                      name="numero"
                      value={newCliente.numero}
                      onChange={handleInputChange}
                      
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

        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirmar Exclusão</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Você tem certeza que deseja excluir este cliente?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Excluir
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </Pagina>
  );
}

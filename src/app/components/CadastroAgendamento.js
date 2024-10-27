import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const CadastroAgendamento = ({ show, handleClose, handleSave, clientes, funcionarios, servicos, selectedDate }) => {
  const [clienteId, setClienteId] = useState('');
  const [funcionarioId, setFuncionarioId] = useState('');
  const [servicoId, setServicoId] = useState('');
  const [horarioInicio, setHorarioInicio] = useState('');
  const [horarioFim, setHorarioFim] = useState('');
  const [dataAgendamento, setDataAgendamento] = useState(selectedDate ? selectedDate.toISOString().split('T')[0] : ''); // Data inicial

  // Reseta os campos quando o modal é aberto
  useEffect(() => {
    if (show) {
      setClienteId('');
      setFuncionarioId('');
      setServicoId('');
      setHorarioInicio('');
      setHorarioFim('');
      setDataAgendamento(selectedDate ? selectedDate.toISOString().split('T')[0] : '');
    }
  }, [show, selectedDate]);

  const handleSubmit = () => {
    const newAgendamento = {
      cliente: clienteId,
      funcionario: funcionarioId,
      servico: servicoId,
      inicio: new Date(`${dataAgendamento}T${horarioInicio}`).toISOString(),
      fim: new Date(`${dataAgendamento}T${horarioFim}`).toISOString(),
      id: Date.now(), // ID único
    };

    // Chama a função de salvar
    handleSave(newAgendamento);

    handleClose(); // Fecha o modal
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Cadastro de Agendamento</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formCliente">
            <Form.Label>Cliente</Form.Label>
            <Form.Control as="select" onChange={(e) => setClienteId(e.target.value)}>
              <option value="">Selecione um cliente</option>
              {clientes.map((cliente, index) => (
                <option key={index} value={cliente.nome}>{cliente.nome}</option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="formFuncionario">
            <Form.Label>Funcionário</Form.Label>
            <Form.Control as="select" onChange={(e) => setFuncionarioId(e.target.value)}>
              <option value="">Selecione um funcionário</option>
              {funcionarios.map((funcionario, index) => (
                <option key={index} value={funcionario.nome}>{funcionario.nome}</option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="formServico">
            <Form.Label>Serviço</Form.Label>
            <Form.Control as="select" onChange={(e) => setServicoId(e.target.value)}>
              <option value="">Selecione um serviço</option>
              {servicos.map((servico, index) => (
                <option key={index} value={servico.nome}>{servico.nome}</option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="formData">
            <Form.Label>Data</Form.Label>
            <Form.Control type="date" value={dataAgendamento} onChange={(e) => setDataAgendamento(e.target.value)} />
          </Form.Group>
          <Form.Group controlId="formHorarioInicio">
            <Form.Label>Horário de Início</Form.Label>
            <Form.Control type="time" value={horarioInicio} onChange={(e) => setHorarioInicio(e.target.value)} />
          </Form.Group>
          <Form.Group controlId="formHorarioFim">
            <Form.Label>Horário de Fim</Form.Label>
            <Form.Control type="time" value={horarioFim} onChange={(e) => setHorarioFim(e.target.value)} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Fechar
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Salvar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CadastroAgendamento;

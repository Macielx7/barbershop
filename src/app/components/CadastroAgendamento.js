import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import * as yup from 'yup';
import { remask } from 'remask';
import Pagina from './Pagina';



const CadastroAgendamento = ({
  show,
  handleClose,  // Isso vem como prop
  handleSave,
  handleDelete,
  clientes,
  funcionarios,
  servicos,
  selectedDate,
  agendamentoSelecionado,
}) => {
  const [clienteId, setClienteId] = useState('');
  const [funcionarioId, setFuncionarioId] = useState('');
  const [servicoId, setServicoId] = useState('');
  const [horarioInicio, setHorarioInicio] = useState('');
  const [horarioFim, setHorarioFim] = useState('');
  const [dataAgendamento, setDataAgendamento] = useState(selectedDate ? selectedDate.toISOString().split('T')[0] : '');
  const [status, setStatus] = useState('a_confirmar');
  const [servicoValor, setServicoValor] = useState('');
  const [errors, setErrors] = useState({});
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  // Altere o nome da função interna para evitar conflito
  const handleCloseModal = () => {
    setClienteId('');
    setFuncionarioId('');
    setServicoId('');
    setServicoValor(''); // Limpa o valor do serviço
    setHorarioInicio('');
    setHorarioFim('');
    setDataAgendamento(selectedDate ? selectedDate.toISOString().split('T')[0] : '');
    setStatus('a_confirmar');
    setErrors({}); // Limpa os erros
    handleClose();  // Chama a função handleClose recebida como prop
  };


  const validationSchema = yup.object().shape({
    cliente: yup.string().required('Selecione um cliente'),
    funcionario: yup.string().required('Selecione um funcionário'),
    servico: yup.string().required('Selecione um serviço'),
    horarioInicio: yup.string().required('Informe o horário de início'),
    horarioFim: yup.string().required('Informe o horário de fim'),
    dataAgendamento: yup.date().required('Informe a data do agendamento').nullable(),
    status: yup.string().required('Selecione o status do agendamento'),
  });




  useEffect(() => {
    if (show) {
      if (agendamentoSelecionado) {
        // Preenche os campos para edição
        setClienteId(agendamentoSelecionado.cliente);
        setFuncionarioId(agendamentoSelecionado.funcionario);
        setServicoId(agendamentoSelecionado.servico);
        setServicoValor(agendamentoSelecionado.valor); // Preenche o valor do serviço
        setHorarioInicio(agendamentoSelecionado.inicio.split('T')[1].slice(0, 5));
        setHorarioFim(agendamentoSelecionado.fim.split('T')[1].slice(0, 5));
        setDataAgendamento(agendamentoSelecionado.inicio.split('T')[0]);
        setStatus(agendamentoSelecionado.status || 'a_confirmar');
      } else {
        // Limpa os campos para novo agendamento
        setClienteId('');
        setFuncionarioId('');
        setServicoId('');
        setServicoValor(''); // Limpa o valor do serviço
        setHorarioInicio('');
        setHorarioFim('');
        setDataAgendamento(selectedDate ? selectedDate.toISOString().split('T')[0] : '');
        setStatus('a_confirmar');
      }
      setErrors({}); // Limpa os erros ao abrir o modal
    }
  }, [show, agendamentoSelecionado, selectedDate]);



  useEffect(() => {
    if (servicoId) {
      const servicoEncontrado = servicos.find(servico => servico.nome === servicoId);
      if (servicoEncontrado) {
        setServicoValor(servicoEncontrado.preco);
      }
    }
  }, [servicoId, servicos]);

  const handleChange = (e, setter, mask = null) => {
    let value = e.target.value;
    if (mask) {
      value = remask(value, mask);
    }
    setter(value);
  };

  const handleSubmit = async () => {
    try {
      await validationSchema.validate({
        cliente: clienteId,
        funcionario: funcionarioId,
        servico: servicoId,
        horarioInicio,
        horarioFim,
        dataAgendamento,
        status,
      }, { abortEarly: false });

      const newAgendamento = {
        cliente: clienteId,
        funcionario: funcionarioId,
        servico: servicoId,
        valor: servicoValor,
        inicio: new Date(`${dataAgendamento}T${horarioInicio}`).toISOString(),
        fim: new Date(`${dataAgendamento}T${horarioFim}`).toISOString(),
        status: status,
        id: agendamentoSelecionado ? agendamentoSelecionado.id : Date.now(),
      };

      const agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];
      if (agendamentoSelecionado) {
        const index = agendamentos.findIndex(agendamento => agendamento.id === agendamentoSelecionado.id);
        if (index > -1) {
          agendamentos[index] = newAgendamento;
        }
      } else {
        agendamentos.push(newAgendamento);
      }
      localStorage.setItem('agendamentos', JSON.stringify(agendamentos));

      handleSave(newAgendamento);
      handleClose();

      // Recarregar a página rapidamente
      window.location.reload();  // Recarrega a página

    } catch (validationErrors) {
      const newErrors = validationErrors.inner.reduce((acc, error) => {
        acc[error.path] = error.message;
        return acc;
      }, {});
      setErrors(newErrors);
    }
  };


  const handleDeleteConfirmation = () => {
    setShowDeleteConfirmation(true); // Mostra a confirmação de exclusão
  };

  const handleDeleteAgendamento = () => {
    const agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];
    const updatedAgendamentos = agendamentos.filter(agendamento => agendamento.id !== agendamentoSelecionado.id);
    localStorage.setItem('agendamentos', JSON.stringify(updatedAgendamentos));

    handleDelete(agendamentoSelecionado.id); // Chama a função de exclusão

    // Fechar o modal após exclusão
    handleClose();

    // Esconder a confirmação de exclusão
    setShowDeleteConfirmation(false);
  };


  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false); // Fecha a confirmação de exclusão sem excluir
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{agendamentoSelecionado ? 'Editar Agendamento' : 'Cadastro de Agendamento'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formCliente">
              <Form.Label>Cliente</Form.Label>
              <Form.Control as="select" value={clienteId} onChange={(e) => handleChange(e, setClienteId)}>
                <option value="">Selecione um cliente</option>
                {clientes.map((cliente, index) => (
                  <option key={index} value={cliente.nome}>{cliente.nome}</option>
                ))}
              </Form.Control>
              {errors.cliente && <div className="text-danger">{errors.cliente}</div>}
            </Form.Group>

            <Form.Group controlId="formFuncionario">
              <Form.Label>Funcionário</Form.Label>
              <Form.Control as="select" value={funcionarioId} onChange={(e) => handleChange(e, setFuncionarioId)}>
                <option value="">Selecione um funcionário</option>
                {funcionarios.map((funcionario, index) => (
                  <option key={index} value={funcionario.nome}>{funcionario.nome}</option>
                ))}
              </Form.Control>
              {errors.funcionario && <div className="text-danger">{errors.funcionario}</div>}
            </Form.Group>

            <Form.Group controlId="formServico">
              <Form.Label>Serviço</Form.Label>
              <Form.Control as="select" value={servicoId} onChange={(e) => handleChange(e, setServicoId)}>
                <option value="">Selecione um serviço</option>
                {servicos.map((servico, index) => (
                  <option key={index} value={servico.nome}>{servico.nome}</option>
                ))}
              </Form.Control>
              {errors.servico && <div className="text-danger">{errors.servico}</div>}
            </Form.Group>

            <Form.Group controlId="formValor">
              <Form.Label>Valor</Form.Label>
              <Form.Control type="text" value={servicoValor} disabled />
            </Form.Group>

            <Form.Group controlId="formData">
              <Form.Label>Data</Form.Label>
              <Form.Control type="date" value={dataAgendamento} onChange={(e) => handleChange(e, setDataAgendamento)} />
              {errors.dataAgendamento && <div className="text-danger">{errors.dataAgendamento}</div>}
            </Form.Group>

            <Form.Group controlId="formHorarioInicio">
              <Form.Label>Horário de Início</Form.Label>
              <Form.Control type="time" value={horarioInicio} onChange={(e) => handleChange(e, setHorarioInicio)} />
              {errors.horarioInicio && <div className="text-danger">{errors.horarioInicio}</div>}
            </Form.Group>

            <Form.Group controlId="formHorarioFim">
              <Form.Label>Horário de Fim</Form.Label>
              <Form.Control type="time" value={horarioFim} onChange={(e) => handleChange(e, setHorarioFim)} />
              {errors.horarioFim && <div className="text-danger">{errors.horarioFim}</div>}
            </Form.Group>

            <Form.Group controlId="formStatus">
              <Form.Label>Status</Form.Label>
              <Form.Control as="select" value={status} onChange={(e) => handleChange(e, setStatus)}>
                <option value="a_confirmar">A Confirmar</option>
                <option value="confirmado">Confirmado</option>
              </Form.Control>
              {errors.status && <div className="text-danger">{errors.status}</div>}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          {agendamentoSelecionado && (
            <Button variant="danger" onClick={handleDeleteConfirmation}>Excluir</Button>
          )}
          <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
          <Button variant="primary" onClick={handleSubmit}>Salvar</Button>
        </Modal.Footer>
      </Modal>

      {/* Confirmação de exclusão */}
      {showDeleteConfirmation && (
        <Modal show={showDeleteConfirmation} onHide={handleCancelDelete}>
          <Modal.Header closeButton>
            <Modal.Title>Confirmar Exclusão</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Você tem certeza de que deseja excluir este agendamento?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCancelDelete}>Cancelar</Button>
            <Button variant="danger" onClick={handleDeleteAgendamento}>Excluir</Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default CadastroAgendamento;

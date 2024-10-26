'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { Button, Modal, Form, Alert } from 'react-bootstrap';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Pagina from "../components/Pagina";

// Configuração do localizador do calendário
const localizer = momentLocalizer(moment);

export default function Agendamentos() {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    start: new Date(),
    end: new Date(),
    barbeiro: '',
    cliente: '',
  });
  const [barbeiros, setBarbeiros] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  // Carregar barbeiros do localStorage
  useEffect(() => {
    const storedBarbeiros = localStorage.getItem('funcionarios');
    if (storedBarbeiros) {
      setBarbeiros(JSON.parse(storedBarbeiros));
    }
  }, []);

  const handleSelect = ({ start, end }) => {
    setNewEvent({ ...newEvent, start, end });
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setErrorMessage('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({ ...newEvent, [name]: value });
  };

  const handleSave = () => {
    const existingEvent = events.find(event =>
      (event.start <= newEvent.start && event.end >= newEvent.start) ||
      (event.start <= newEvent.end && event.end >= newEvent.end)
    );

    if (existingEvent) {
      setErrorMessage('Esse horário já está ocupado. Por favor, escolha outro.');
      return;
    }

    setEvents([...events, { ...newEvent, id: Date.now() }]);
    setShowModal(false);
    setNewEvent({ title: '', start: new Date(), end: new Date(), barbeiro: '', cliente: '' });
    setErrorMessage('');
  };

  const eventStyleGetter = (event) => {
    const style = {
      backgroundColor: '#3174eb',
      border: 'none',
      borderRadius: '5px',
      padding: '10px',
      color: 'white',
      display: 'block',
    };
    return {
      style,
    };
  };

  return (
    <Pagina titulo="Agendamentos">
      <div style={{ height: '80vh', margin: '20px' }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          selectable
          onSelectSlot={handleSelect}
          components={{
            event: ({ event }) => (
              <span>
                <strong>{event.title}</strong>
                <br />
                <span>Barbeiro: {event.barbeiro}</span>
                <br />
                <span>Cliente: {event.cliente}</span>
                <br />
                <span>Horário: {moment(event.start).format('DD/MM/YYYY HH:mm')} - {moment(event.end).format('HH:mm')}</span>
              </span>
            ),
          }}
          eventPropGetter={eventStyleGetter}
        />
      </div>

      {/* Modal para cadastrar um novo agendamento */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Cadastrar Agendamento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
          <Form>
            <Form.Group controlId="formTitle">
              <Form.Label>Título</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite o título do agendamento"
                name="title"
                value={newEvent.title}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formBarbeiro">
              <Form.Label>Selecionar Barbeiro</Form.Label>
              <Form.Control
                as="select"
                name="barbeiro"
                value={newEvent.barbeiro}
                onChange={handleInputChange}
              >
                <option value="">Selecione um barbeiro</option>
                {barbeiros.map(barbeiro => (
                  <option key={barbeiro.id} value={barbeiro.nome}>{barbeiro.nome}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formCliente">
              <Form.Label>Cliente</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite o nome do cliente"
                name="cliente"
                value={newEvent.cliente}
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
    </Pagina>
  );
}

'use client'
import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { Button, Modal, Form, Alert } from 'react-bootstrap';
import moment from 'moment';
import 'moment/locale/pt-br'; // Importa a localidade em português
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Pagina from "../components/Pagina";

// Localização do calendário
const localizer = momentLocalizer(moment);
moment.locale('pt-br'); // Define o locale do moment.js para português

export default function Agendamentos() {
    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newEvent, setNewEvent] = useState({ service: '', start: new Date(), end: new Date(), barbeiro: '' });
    const [barbeiros, setBarbeiros] = useState([]);
    const [servicos, setServicos] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [usuarioLogado, setUsuarioLogado] = useState('');
    const [currentDate, setCurrentDate] = useState(new Date()); // Estado para a data atual

    useEffect(() => {
        const storedBarbeiros = localStorage.getItem('funcionarios');
        if (storedBarbeiros) {
            setBarbeiros(JSON.parse(storedBarbeiros));
        }

        const storedServicos = localStorage.getItem('servicos');
        if (storedServicos) {
            setServicos(JSON.parse(storedServicos));
        }

        const storedUsuario = localStorage.getItem('usuarioLogado');
        if (storedUsuario) {
            const { usuario } = JSON.parse(storedUsuario);
            setUsuarioLogado(usuario);
        }

        const storedAgendamentos = localStorage.getItem('agendamentos');
        if (storedAgendamentos) {
            setEvents(JSON.parse(storedAgendamentos));
        }
    }, []);

    const handleSelect = ({ start }) => {
        setNewEvent({
            ...newEvent,
            start,
            end: moment(start).add(60, 'minutes').toDate(),
        });
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
        setErrorMessage('');
        setNewEvent({ service: '', start: new Date(), end: new Date(), barbeiro: '' });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewEvent({ ...newEvent, [name]: value });
    };

    const handleDateChange = (date) => {
        setNewEvent({ 
            ...newEvent, 
            start: date,
            end: moment(date).add(60, 'minutes').toDate()
        });
    };

    const handleSave = () => {
        // Lógica de salvamento (aqui você pode adicionar a lógica que já estava implementada)
    };

    const goToPreviousMonth = () => {
        setCurrentDate(moment(currentDate).subtract(1, 'months').toDate());
    };

    const goToNextMonth = () => {
        setCurrentDate(moment(currentDate).add(1, 'months').toDate());
    };

    return (
        <Pagina titulo="Agendamentos">
            <div className="d-flex justify-content-between mb-3">
                <Button variant="secondary" onClick={goToPreviousMonth}>Anterior</Button>
                <Button variant="primary" onClick={() => setShowModal(true)}>Novo Agendamento</Button>
                <Button variant="secondary" onClick={goToNextMonth}>Próximo</Button>
            </div>

            {/* Exibe o mês atual */}
            <h3 className="text-center mb-4">
                {moment(currentDate).format('MMMM YYYY')} {/* Mês atual em português */}
            </h3>

            <div style={{ height: '80vh', margin: '20px' }}>
                <Calendar
                    localizer={localizer}
                    events={events.map(event => ({
                        ...event,
                        start: new Date(event.start),
                        end: new Date(event.end)
                    }))}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: '100%' }}
                    selectable
                    onSelectSlot={handleSelect}
                    defaultView="month"
                    date={currentDate}
                    views={['month']} // Limita a visualização apenas ao mês
                    toolbar={false} // Remove a barra de ferramentas
                />
            </div>

            {/* Modal para cadastrar agendamento */}
            <Modal show={showModal} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Cadastrar Agendamento</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                    <Form>
                        <Form.Group controlId="formDate">
                            <Form.Label>Selecionar Data</Form.Label>
                            <DatePicker
                                selected={newEvent.start}
                                onChange={handleDateChange}
                                dateFormat="dd/MM/yyyy"
                                className="form-control"
                            />
                        </Form.Group>
                        <Form.Group controlId="formService">
                            <Form.Label>Selecionar Serviço</Form.Label>
                            <Form.Control
                                as="select"
                                name="service"
                                value={newEvent.service}
                                onChange={handleInputChange}
                            >
                                <option value="">Selecione um serviço</option>
                                {servicos.map(servico => (
                                    <option key={servico.id} value={servico.id}>{servico.nome}</option>
                                ))}
                            </Form.Control>
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
                                    <option key={barbeiro.nome} value={barbeiro.nome}>{barbeiro.nome}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Fechar</Button>
                    <Button variant="primary" onClick={handleSave}>Salvar</Button>
                </Modal.Footer>
            </Modal>
        </Pagina>
    );
}

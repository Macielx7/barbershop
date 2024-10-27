import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/pt-br';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Container, Button, ButtonGroup } from 'react-bootstrap';
import CadastroAgendamento from './CadastroAgendamento'; // Importar o novo componente

// Configurar o localizer com idioma português
moment.locale('pt-br');
const localizer = momentLocalizer(moment);

const Calendario = () => {
  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month');
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  // Carregar eventos do localStorage quando o componente for montado
  useEffect(() => {
    const agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];
    const formattedEvents = agendamentos.map(agendamento => ({
      title: `${agendamento.servico} - ${agendamento.cliente}`,
      start: new Date(agendamento.inicio),
      end: new Date(agendamento.fim),
      allDay: false,
    }));
    setEvents(formattedEvents);
  }, []);

  const handleSelectSlot = (slotInfo) => {
    setSelectedDate(slotInfo.start);
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  const handleSave = (newAgendamento) => {
    const updatedEvents = [
      ...events,
      {
        title: `${newAgendamento.servico} - ${newAgendamento.cliente}`,
        start: new Date(newAgendamento.inicio),
        end: new Date(newAgendamento.fim),
        allDay: false,
      },
    ];
  
    setEvents(updatedEvents);
  
    // Atualiza o localStorage
    const agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];
    agendamentos.push(newAgendamento);
    localStorage.setItem('agendamentos', JSON.stringify(agendamentos));
  };
  

  const getDataFromLocalStorage = (key) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  };

  const clientes = getDataFromLocalStorage('clientes');
  const funcionarios = getDataFromLocalStorage('funcionarios');
  const servicos = getDataFromLocalStorage('servicos');

  return (
    <Container>
      <h2 className="text-center my-4">Calendário de Agendamentos</h2>

      {/* Botões para mudar a visão do calendário */}
      <ButtonGroup className="mb-3">
        <Button variant={view === 'month' ? 'primary' : 'secondary'} onClick={() => setView('month')}>
          Mês
        </Button>
        <Button variant={view === 'week' ? 'primary' : 'secondary'} onClick={() => setView('week')}>
          Semana
        </Button>
        <Button variant={view === 'day' ? 'primary' : 'secondary'} onClick={() => setView('day')}>
          Dia
        </Button>
      </ButtonGroup>

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        views={['month', 'week', 'day']}
        date={currentDate}
        view={view}
        onNavigate={(date) => setCurrentDate(date)}
        onView={(newView) => setView(newView)}
        selectable
        onSelectSlot={handleSelectSlot}
        messages={{
          allDay: 'Dia Todo',
          previous: '<',
          next: '>',
          today: 'Hoje',
          month: 'Mês',
          week: 'Semana',
          day: 'Dia',
          agenda: 'Agenda',
          date: 'Data',
          time: 'Hora',
          event: 'Evento',
          noEventsInRange: 'Nenhum evento neste período',
        }}
      />

      {/* Componente do Modal de Cadastro */}
      <CadastroAgendamento
        show={showModal}
        handleClose={handleClose}
        handleSave={handleSave}
        clientes={clientes}
        funcionarios={funcionarios}
        servicos={servicos}
        selectedDate={selectedDate}
      />
    </Container>
  );
};

export default Calendario;

import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/pt-br';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Container, Button, Dropdown, DropdownButton, Form } from 'react-bootstrap';
import CadastroAgendamento from './CadastroAgendamento';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

moment.locale('pt-br');
const localizer = momentLocalizer(moment);

const Calendario = () => {
  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month');
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [agendamentoSelecionado, setAgendamentoSelecionado] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [periodo, setPeriodo] = useState('');
  const [dataEscolhida, setDataEscolhida] = useState(null);
  const [intervaloEscolhido, setIntervaloEscolhido] = useState({ start: null, end: null }); // Intervalo personalizado
  const [anoSelecionado, setAnoSelecionado] = useState(new Date().getFullYear());
  const [mesSelecionado, setMesSelecionado] = useState(new Date().getMonth());


  useEffect(() => {
    const agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];
    const formattedEvents = agendamentos.map(agendamento => ({
      id: agendamento.id,
      title: `${agendamento.servico} - ${agendamento.cliente}`,
      start: new Date(agendamento.inicio),
      end: new Date(agendamento.fim),
      allDay: false,
      status: agendamento.status || 'pendente',
    }));
    setEvents(formattedEvents);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const clientesData = JSON.parse(localStorage.getItem('clientes')) || [];
      const funcionariosData = JSON.parse(localStorage.getItem('funcionarios')) || [];
      const servicosData = JSON.parse(localStorage.getItem('servicos')) || [];

      setClientes(clientesData);
      setFuncionarios(funcionariosData);
      setServicos(servicosData);
    }
  }, []);

  const handleSelectSlot = (slotInfo) => {
    setSelectedDate(slotInfo.start);
    setAgendamentoSelecionado(null);
    setShowModal(true);
  };

  const handleSelectEvent = (event) => {
    const agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];
    const agendamento = agendamentos.find(ag => ag.id === event.id);
    setAgendamentoSelecionado(agendamento);
    setSelectedDate(event.start);
    setShowModal(true);
  };




  const handleAnoChange = (e) => {
    setAnoSelecionado(Number(e.target.value));
    setCurrentDate(new Date(Number(e.target.value), mesSelecionado, 1));
  };

  const handleMesChange = (e) => {
    setMesSelecionado(Number(e.target.value));
    setCurrentDate(new Date(anoSelecionado, Number(e.target.value), 1));
  };




  const handleClose = () => setShowModal(false);

  const handleSave = (newAgendamento) => {
    const updatedEvents = [
      ...events.filter(event => event.id !== newAgendamento.id),
      {
        id: newAgendamento.id,
        title: `${newAgendamento.servico} - ${newAgendamento.cliente}`,
        start: new Date(newAgendamento.inicio),
        end: new Date(newAgendamento.fim),
        allDay: false,
        status: newAgendamento.status,
      },
    ];
    setEvents(updatedEvents);

    const agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];
    const index = agendamentos.findIndex(ag => ag.id === newAgendamento.id);
    if (index >= 0) {
      agendamentos[index] = newAgendamento;
    } else {
      agendamentos.push(newAgendamento);
    }
    localStorage.setItem('agendamentos', JSON.stringify(agendamentos));
  };

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este agendamento?')) {
      const updatedEvents = events.filter(event => event.id !== id);
      setEvents(updatedEvents);

      const agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];
      const updatedAgendamentos = agendamentos.filter(ag => ag.id !== id);
      localStorage.setItem('agendamentos', JSON.stringify(updatedAgendamentos));
      setShowModal(false);
    }
  };

  const eventPropGetter = (event) => {
    const backgroundColor = event.status === 'confirmado' ? '#28a745' : '#6c757d'; // Verde para confirmado, cinza para pendente
    return { style: { backgroundColor, color: '#ffffff' } };
  };

  const filtrarAgendamentos = () => {
    const agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];
    let filteredEvents = [];

    if (periodo === 'diario') {
      if (dataEscolhida) {
        filteredEvents = agendamentos.filter(agendamento => {
          const eventDate = new Date(agendamento.inicio).toLocaleDateString();
          const chosenDateStr = new Date(dataEscolhida).toLocaleDateString();
          return eventDate === chosenDateStr;
        });
      }
    } else if (periodo === 'personalizado' && intervaloEscolhido.start && intervaloEscolhido.end) {
      filteredEvents = agendamentos.filter(agendamento => {
        const eventDate = new Date(agendamento.inicio);
        return eventDate >= new Date(intervaloEscolhido.start) && eventDate <= new Date(intervaloEscolhido.end);
      });
    }
    return filteredEvents;
  };

  const formatarIntervaloParaTitulo = () => {
    if (periodo === 'diario' && dataEscolhida) {
      return moment(dataEscolhida).format('DD/MM/YYYY');
    } else if (periodo === 'personalizado' && intervaloEscolhido.start && intervaloEscolhido.end) {
      const startOfPeriod = moment(intervaloEscolhido.start).format('DD/MM/YYYY');
      const endOfPeriod = moment(intervaloEscolhido.end).format('DD/MM/YYYY');
      return `${startOfPeriod} - ${endOfPeriod}`;
    }
    return '';
  };

  const exportarPdf = () => {
    if (!intervaloEscolhido.start || !intervaloEscolhido.end) {
      alert('Por favor, selecione um intervalo de datas completo antes de confirmar.');
      return;
    }

    const agendamentos = filtrarAgendamentos(); // Filtra os agendamentos
    const doc = new jsPDF();

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10); // Tamanho de fonte adequado para a tabela

    // Definindo o título com o intervalo
    const intervaloTitulo = formatarIntervaloParaTitulo();
    doc.text(`Agendamentos de ${intervaloTitulo}`, 10, 10);

    // Definindo os dados da tabela


    const data = agendamentos.map(agendamento => {
      const inicioDate = new Date(agendamento.inicio);
      const fimDate = new Date(agendamento.fim);
      return [
        agendamento.cliente || '',
        agendamento.funcionario || '',
        agendamento.servico || '',
        new Date(agendamento.inicio).toLocaleDateString() || '',
        inicioDate instanceof Date && !isNaN(inicioDate) ? inicioDate.toISOString().split('T')[1].slice(0, 5) : '',
        fimDate instanceof Date && !isNaN(fimDate) ? fimDate.toISOString().split('T')[1].slice(0, 5) : '',
        agendamento.status || '',
        agendamento.valor || ''
      ];
    });

    // Cabeçalhos da tabela
    const headers = ['Cliente', 'Funcionário', 'Serviço', 'Data', 'Início', 'Fim', 'Status', 'Valor'];

    // Usando o autoTable para gerar a tabela
    doc.autoTable({
      head: [headers],
      body: data,
      startY: 20, // A posição de onde a tabela começa
      margin: { top: 10, left: 2, right: 1 }, // Ajuste nas margens
      styles: {
        fontSize: 9,  // Tamanho da fonte das células
        cellPadding: 4, // Padding das células
        overflow: 'linebreak',  // Permite quebra de linha, mas de forma controlada
        halign: 'center', // Alinha o texto no centro da célula
        valign: 'middle', // Alinha o texto no meio da célula
      },
      headStyles: {
        fillColor: [22, 160, 133], // Cor de fundo do cabeçalho
        textColor: [255, 255, 255], // Cor do texto do cabeçalho
      },
      bodyStyles: {
        fillColor: [245, 245, 245], // Cor de fundo das linhas da tabela
      },
      columnStyles: {
        0: { cellWidth: 30 }, // Largura da coluna 'Cliente'
        1: { cellWidth: 30 }, // Largura da coluna 'Funcionário'
        2: { cellWidth: 30 }, // Largura da coluna 'Serviço'
        3: { cellWidth: 30 }, // Largura da coluna 'Data'
        4: { cellWidth: 20 }, // Largura da coluna 'Início'
        5: { cellWidth: 20 }, // Largura da coluna 'Fim'
        6: { cellWidth: 25 }, // Largura da coluna 'Status'
        7: { cellWidth: 20 }, // Largura da coluna 'Valor'
      },
    });


    console.log("Exportando PDF...");
    setPeriodo(''); // Esconde o botão "Confirmar" ao exportar o PDF


    doc.save('agendamentos.pdf');
  };

  const handleExportarClick = () => {
    if (periodo === 'personalizado') {
      // Se já estiver no modo 'personalizado', escondemos os controles
      setPeriodo('');
      setIntervaloEscolhido({ start: null, end: null }); // Limpa o intervalo escolhido
    } else {
      // Caso contrário, mostramos os controles para selecionar o período
      setPeriodo('personalizado');
    }
  };



  return (
    <Container className="rounded shadow-sm p-4" style={{ backgroundColor: '#f8f9fa' }}>
      <h2 className="text-center my-4" style={{ color: '#343a40' }}>Calendário de Agendamentos</h2>

      <div style={{ position: 'relative', top: '-5px'}}>
        <Button variant="success" onClick={handleExportarClick}>
          Exportar PDF
        </Button>

        {periodo === 'personalizado' && (
          <div className="mt-3">
            <p><strong>Escolha o período desejado:</strong></p>

            <Form.Control
              type="date"
              value={intervaloEscolhido.start ? moment(intervaloEscolhido.start).format('YYYY-MM-DD') : ''}
              onChange={(e) => setIntervaloEscolhido(prev => ({ ...prev, start: e.target.value }))}
              className="mt-2"
              style={{ maxWidth: '200px' }}
            />
            <Form.Control
              type="date"
              value={intervaloEscolhido.end ? moment(intervaloEscolhido.end).format('YYYY-MM-DD') : ''}
              onChange={(e) => setIntervaloEscolhido(prev => ({ ...prev, end: e.target.value }))}
              className="mt-2"
              style={{ maxWidth: '200px' }}
            />

            {intervaloEscolhido.start && intervaloEscolhido.end && (
              <Button variant="success" onClick={exportarPdf} className="mt-3">
                Confirmar
              </Button>
            )}
          </div>
        )}
      </div>





     
    <div style={{ position: 'relative', top: '-75px'}}>
      <div style={{ position: 'absolute', top: 0, right: 0, display: 'flex', gap: '10px' }}>
        <Form.Group controlId="mesSelecionado" className="mb-0">
          <Form.Label><strong>Mês</strong></Form.Label>
          <Form.Control as="select" value={mesSelecionado} onChange={handleMesChange}>
            {['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'].map((mes, index) => (
              <option key={index} value={index}>{mes}</option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="anoSelecionado" className="mb-0">
          <Form.Label><strong>Ano</strong></Form.Label>
          <Form.Control as="select" value={anoSelecionado} onChange={handleAnoChange}>
            {Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - 4 + i).map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </Form.Control>
        </Form.Group>
      </div>
    </div>





      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        className="custom-calendar"
        style={{
          height: 500,
          border: '1px solid #dee2e6',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
          backgroundColor: '#ffffff'
        }}
        views={['month', 'week', 'day']}
        date={currentDate}
        view={view}
        onNavigate={(date) => setCurrentDate(date)}
        onView={(newView) => setView(newView)}
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        eventPropGetter={eventPropGetter}
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

      <CadastroAgendamento
        show={showModal}
        handleClose={handleClose}
        handleSave={handleSave}
        handleDelete={handleDelete}
        clientes={clientes}
        funcionarios={funcionarios}
        servicos={servicos}
        selectedDate={selectedDate}
        agendamentoSelecionado={agendamentoSelecionado}
      />
    </Container >
  );
};

export default Calendario;

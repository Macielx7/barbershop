'use client';
import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { Button, Modal, Form, Alert } from 'react-bootstrap';
import moment from 'moment';
import 'moment/locale/pt-br';
import DatePicker from 'react-datepicker';
import AsyncSelect from 'react-select/async';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Pagina from "../components/Pagina";

const localizer = momentLocalizer(moment);
moment.locale('pt-br');

export default function Agendamentos() {
    const [eventos, setEventos] = useState([]);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [novoEvento, setNovoEvento] = useState({ cliente: '', servico: '', barbeiro: '', inicio: new Date(), fim: new Date() });
    const [clientes, setClientes] = useState([]);
    const [barbeiros, setBarbeiros] = useState([]);
    const [servicos, setServicos] = useState([]);
    const [mensagemErro, setMensagemErro] = useState('');
    const [dataAtual, setDataAtual] = useState(new Date());
    const [eventoDetalhe, setEventoDetalhe] = useState(null);
    const [mostrarDetalheModal, setMostrarDetalheModal] = useState(false);
    const [cardPosicao, setCardPosicao] = useState({ x: 0, y: 0 });
    const [editarEventoId, setEditarEventoId] = useState(null); // Novo estado para armazenar o ID do evento que será editado
    const [timeoutId, setTimeoutId] = useState(null);

    useEffect(() => {
        const dadosClientes = localStorage.getItem('clientes');
        if (dadosClientes) setClientes(JSON.parse(dadosClientes));

        const dadosBarbeiros = localStorage.getItem('funcionarios');
        if (dadosBarbeiros) setBarbeiros(JSON.parse(dadosBarbeiros));

        const dadosServicos = localStorage.getItem('servicos');
        if (dadosServicos) setServicos(JSON.parse(dadosServicos));

        const dadosAgendamentos = localStorage.getItem('agendamentos');
        if (dadosAgendamentos) setEventos(JSON.parse(dadosAgendamentos));
    }, []);

    const agruparEventos = (eventos) => {
        return eventos.reduce((acc, evento) => {
            const key = moment(evento.inicio).format('YYYY-MM-DD HH:mm'); // Agrupa por data e hora
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(evento);
            return acc;
        }, {});
    };

    const eventosAgrupados = agruparEventos(eventos);

    const aoPassarMouse = (evento, e) => {
        setEventoDetalhe(evento);
        setCardPosicao({ x: e.clientX + 10, y: e.clientY + 10 });
    
        // Limpa o timeout existente para evitar problemas de timing
        clearTimeout(timeoutId);
    
        // Inicia um novo timeout para mostrar o card de detalhes após 500ms
        const id = setTimeout(() => {
            setMostrarDetalheModal(true);
        }, 0); // 500ms ou outro valor que preferir
    
        // Armazena o ID do timeout
        setTimeoutId(id);
    };
    
    const aoSairMouse = () => {
        // Limpa o modal de detalhes
        clearTimeout(timeoutId); // Limpa o timeout se o mouse sair antes do tempo
        setMostrarDetalheModal(false);
        setEventoDetalhe(null);
    };

    const aoSelecionar = (evento) => {
        if (evento.id) {
            // Se um evento existente foi selecionado, preencha os dados no modal
            setNovoEvento({
                cliente: evento.cliente,
                servico: evento.servico,
                barbeiro: evento.barbeiro,
                inicio: new Date(evento.inicio),
                fim: new Date(evento.fim)
            });
            setEditarEventoId(evento.id); // Define o ID do evento a ser editado
        } else {
            const dataSelecionada = evento.start; // Captura a data do evento selecionado
            setNovoEvento({
                cliente: '',
                servico: '',
                barbeiro: '',
                inicio: dataSelecionada, // Define a data de início com a data selecionada
                fim: moment(dataSelecionada).add(60, 'minutes').toDate() // Define o fim como 60 minutos após o início
            });
            setEditarEventoId(null); // Limpa o ID ao criar um novo evento
        }
        setMostrarModal(true);
    };
    
    

    const aoFecharModal = () => {
        setMostrarModal(false);
        setMensagemErro('');
        setNovoEvento({ cliente: '', servico: '', barbeiro: '', inicio: new Date(), fim: new Date() });
        setEditarEventoId(null); // Reseta o ID do evento a ser editado
    };

    const aoSalvarAgendamento = () => {
        // Verifica se todos os campos obrigatórios estão preenchidos
        if (!novoEvento.cliente || !novoEvento.servico || !novoEvento.barbeiro) {
            setMensagemErro("Todos os campos devem ser preenchidos.");
            return;
        }
    
        // Verifica se já existe um agendamento no mesmo horário para o mesmo barbeiro
        const conflito = eventos.some(evento =>
            evento.barbeiro === novoEvento.barbeiro &&
            (
                (moment(novoEvento.inicio).isBefore(evento.fim) && moment(novoEvento.fim).isAfter(evento.inicio)) || // Novo evento inicia antes do evento existente terminar e termina depois que o evento existente começa
                (moment(novoEvento.inicio).isSame(evento.inicio) || moment(novoEvento.fim).isSame(evento.fim)) // Novo evento começa ou termina exatamente quando o evento existente começa ou termina
            )
        );
    
        if (conflito) {
            setMensagemErro("Já existe um agendamento para este barbeiro neste horário.");
            return;
        }
    
        let agendamentosAtualizados;
    
        if (editarEventoId) {
            // Editar o agendamento existente
            agendamentosAtualizados = eventos.map(agendamento =>
                agendamento.id === editarEventoId ? { ...novoEvento, id: editarEventoId } : agendamento
            );
        } else {
            // Criar um novo agendamento
            const novoAgendamento = { ...novoEvento, id: Date.now() }; // Gera um ID único para o novo agendamento
            agendamentosAtualizados = [...eventos, novoAgendamento];
        }
    
        setEventos(agendamentosAtualizados);
        localStorage.setItem('agendamentos', JSON.stringify(agendamentosAtualizados));
        aoFecharModal();
    };
    
    

    const aoExcluirAgendamento = () => {
        const agendamentosAtualizados = eventos.filter(agendamento => agendamento.id !== editarEventoId);
        setEventos(agendamentosAtualizados);
        localStorage.setItem('agendamentos', JSON.stringify(agendamentosAtualizados));
        aoFecharModal();
    };

    const carregarClientes = (inputValue) => {
        return new Promise((resolve) => {
            const resultados = clientes.filter(cliente =>
                cliente.nome.toLowerCase().includes(inputValue.toLowerCase())
            );
            setTimeout(() => resolve(resultados), 500);
        });
    };

    const carregarServicos = (inputValue) => {
        return new Promise((resolve) => {
            const resultados = servicos.filter(servico =>
                servico.nome.toLowerCase().includes(inputValue.toLowerCase())
            );
            setTimeout(() => resolve(resultados), 500);
        });
    };

    const carregarBarbeiros = (inputValue) => {
        return new Promise((resolve) => {
            const resultados = barbeiros.filter(barbeiro =>
                barbeiro.nome.toLowerCase().includes(inputValue.toLowerCase())
            );
            setTimeout(() => resolve(resultados), 500);
        });
    };

    return (
        <Pagina titulo="Agendamentos">
            <div className="d-flex justify-content-between mb-3">
                <Button variant="secondary" onClick={() => setDataAtual(moment(dataAtual).subtract(1, 'months').toDate())}>Anterior</Button>
                <Button variant="primary" onClick={() => {
                    setNovoEvento({ cliente: '', servico: '', barbeiro: '', inicio: new Date(), fim: new Date() });
                    setEditarEventoId(null); // Limpa o ID ao criar um novo evento
                    setMostrarModal(true);
                }}>Novo Agendamento</Button>
                <Button variant="secondary" onClick={() => setDataAtual(moment(dataAtual).add(1, 'months').toDate())}>Próximo</Button>
            </div>

            <h3 className="text-center mb-4">
                {moment(dataAtual).format('MMMM YYYY')}
            </h3>

            <div style={{ height: '80vh', margin: '20px' }}>
                <Calendar
                    localizer={localizer}
                    events={eventos.map(evento => ({
                        ...evento,
                        inicio: new Date(evento.inicio),
                        fim: new Date(evento.fim)
                    }))}
                    startAccessor="inicio"
                    endAccessor="fim"
                    style={{ height: '100%' }}
                    selectable
                    onSelectSlot={aoSelecionar}
                    onSelectEvent={aoSelecionar} // Altera o comportamento ao clicar no evento
                    defaultView="month"
                    date={dataAtual}
                    views={['month']}
                    toolbar={false}
                    components={{
                        event: ({ event, ...props }) => (
                            <div
                                {...props}
                                
                                onMouseLeave={aoSairMouse}
                                onContextMenu={(e) => {
                                    e.preventDefault(); // Previne o menu de contexto padrão
                                    // Chame sua função para lidar com o clique do botão direito aqui
                                    aoPassarMouse(event, e);
                                }}
                                style={{ backgroundColor: 'lightblue', padding: '5px', borderRadius: '5px' }}
                            >
                                {/* Mostra os dados do evento */}
                            </div>
                        )
                    }}
                    
                />
            </div>

            <Modal show={mostrarModal} onHide={aoFecharModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{editarEventoId ? 'Editar Agendamento' : 'Cadastrar Agendamento'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {mensagemErro && <Alert variant="danger">{mensagemErro}</Alert>}
                    <Form>
                        <Form.Group controlId="formData">
                            <Form.Label>Data</Form.Label>
                            <DatePicker
                                selected={novoEvento.inicio}
                                onChange={(date) => setNovoEvento({
                                    ...novoEvento,
                                    inicio: date,
                                    fim: moment(date).add(60, 'minutes').toDate()
                                })}
                                dateFormat="dd/MM/yyyy"
                                className="form-control"
                            />
                        </Form.Group>

                        <Form.Group controlId="formHoraInicio">
                            <Form.Label>Hora de Início</Form.Label>
                            <Form.Control
                                type="time"
                                value={moment(novoEvento.inicio).format('HH:mm')}
                                onChange={(e) => {
                                    const horaInicio = e.target.value;
                                    const dataComHora = moment(novoEvento.inicio).set({
                                        hour: horaInicio.split(':')[0],
                                        minute: horaInicio.split(':')[1],
                                    });
                                    setNovoEvento({
                                        ...novoEvento,
                                        inicio: dataComHora.toDate(),
                                        fim: dataComHora.add(60, 'minutes').toDate(), // atualiza o fim de acordo com o novo início
                                    });
                                }}
                            />
                        </Form.Group>

                        <Form.Group controlId="formHoraFim">
                            <Form.Label>Hora de Fim</Form.Label>
                            <Form.Control
                                type="time"
                                value={moment(novoEvento.fim).format('HH:mm')}
                                onChange={(e) => {
                                    const horaFim = e.target.value;
                                    const dataComHora = moment(novoEvento.fim).set({
                                        hour: horaFim.split(':')[0],
                                        minute: horaFim.split(':')[1],
                                    });
                                    setNovoEvento({
                                        ...novoEvento,
                                        fim: dataComHora.toDate(),
                                    });
                                }}
                            />
                        </Form.Group>

                        <Form.Group controlId="formCliente">
                            <Form.Label>Cliente</Form.Label>
                            <AsyncSelect
                                cacheOptions
                                loadOptions={carregarClientes}
                                defaultOptions={clientes}
                                getOptionLabel={(cliente) => cliente.nome}
                                getOptionValue={(cliente) => cliente.id}
                                onChange={(cliente) => setNovoEvento({ ...novoEvento, cliente: cliente.nome })}
                                placeholder="Digite para buscar cliente..."
                                value={clientes.find(cliente => cliente.nome === novoEvento.cliente) || null}
                            />
                        </Form.Group>

                        <Form.Group controlId="formServico">
                            <Form.Label>Serviço</Form.Label>
                            <AsyncSelect
                                cacheOptions
                                loadOptions={carregarServicos}
                                defaultOptions={servicos}
                                getOptionLabel={(servico) => servico.nome}
                                getOptionValue={(servico) => servico.id}
                                onChange={(servico) => setNovoEvento({ ...novoEvento, servico: servico.nome })}
                                placeholder="Digite para buscar serviço..."
                                value={servicos.find(servico => servico.nome === novoEvento.servico) || null}
                            />
                        </Form.Group>

                        <Form.Group controlId="formBarbeiro">
                            <Form.Label>Barbeiro</Form.Label>
                            <AsyncSelect
                                cacheOptions
                                loadOptions={carregarBarbeiros}
                                defaultOptions={barbeiros}
                                getOptionLabel={(barbeiro) => barbeiro.nome}
                                getOptionValue={(barbeiro) => barbeiro.id}
                                onChange={(barbeiro) => setNovoEvento({ ...novoEvento, barbeiro: barbeiro.nome })}
                                placeholder="Digite para buscar barbeiro..."
                                value={barbeiros.find(barbeiro => barbeiro.nome === novoEvento.barbeiro) || null}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    {editarEventoId && (
                        <Button variant="danger" onClick={aoExcluirAgendamento}>
                            Excluir
                        </Button>
                    )}
                    <Button variant="secondary" onClick={aoFecharModal}>
                        Fechar
                    </Button>
                    <Button variant="primary" onClick={aoSalvarAgendamento}>
                        Salvar
                    </Button>
                </Modal.Footer>
            </Modal>
            

            {/* Card flutuante com detalhes do evento */}
            {mostrarDetalheModal && eventoDetalhe && (
                <div style={{
                    position: 'absolute',
                    top: cardPosicao.y,
                    left: cardPosicao.x,
                    backgroundColor: 'white',
                    border: '1px solid black',
                    padding: '10px',
                    borderRadius: '5px',
                    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                    zIndex: 1000
                }}>
                    <h5>Detalhes do Agendamento</h5>
                    <p><strong>Cliente:</strong> {eventoDetalhe.cliente}</p>
                    <p><strong>Serviço:</strong> {eventoDetalhe.servico}</p>
                    <p><strong>Barbeiro:</strong> {eventoDetalhe.barbeiro}</p>
                    <p><strong>Início:</strong> {moment(eventoDetalhe.inicio).format('DD/MM/YYYY HH:mm')}</p>
                    <p><strong>Fim:</strong> {moment(eventoDetalhe.fim).format('DD/MM/YYYY HH:mm')}</p>
                </div>
            )}
        </Pagina>
    );
}

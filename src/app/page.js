'use client';

import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, ListGroup, Badge } from 'react-bootstrap';
import Pagina from "@/app/components/Pagina";
import { FaUser, FaClock } from 'react-icons/fa'; // Importando ícones
import Calendario from './components/Calendario';

export default function HomePage() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [ranking, setRanking] = useState([]);

  useEffect(() => {
    // Carregar agendamentos e barbeiros do localStorage
    const agendamentosData = JSON.parse(localStorage.getItem('agendamentos')) || [];
    const barbeirosData = JSON.parse(localStorage.getItem('barbeiros')) || [];

    setAgendamentos(agendamentosData);
    setRanking(barbeirosData.sort((a, b) => b.cortes - a.cortes)); // Ordena barbeiros pelo número de cortes
  }, []);

  // Função para formatar horário no formato HH:mm
  const formatarHorario = (dataString) => {
    const data = new Date(dataString);
    const horas = String(data.getHours()).padStart(2, '0');
    const minutos = String(data.getMinutes()).padStart(2, '0');
    return `${horas}:${minutos}`;
  };

  return (
    <Pagina>
      <Container>
        <Row className="my-5">
          {/* Agenda do Dia */}
          <Col md={6}>
            <Card className="shadow-sm border-primary mb-4">
              <Card.Header className="bg-primary text-white text-center">
                <Card.Title>Agenda do Dia</Card.Title>
              </Card.Header>
              <Card.Body>
                <ListGroup variant="flush">
                  {agendamentos.map((agendamento, index) => (
                    <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center">
                        <FaClock className="me-2" />
                        <strong>{formatarHorario(agendamento.inicio)} - {formatarHorario(agendamento.fim)}</strong>
                        <span className="ms-2">- {agendamento.cliente}</span>
                      </div>
                      <Badge bg="info">{agendamento.barbeiro}</Badge>
                    </ListGroup.Item>
                  ))}
                  {agendamentos.length === 0 && (
                    <ListGroup.Item className="text-center mt-3">
                      <em>Nenhum agendamento para hoje</em>
                    </ListGroup.Item>
                  )}
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>

          {/* Ranking dos Barbeiros */}
          <Col md={6}>
            <Card className="shadow-sm border-success mb-4">
              <Card.Header className="bg-success text-white text-center">
                <Card.Title>Ranking de Barbeiros</Card.Title>
              </Card.Header>
              <Card.Body>
                <ListGroup variant="flush">
                  {ranking.map((barbeiro, index) => (
                    <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center">
                        <FaUser className="me-2" /> {index + 1}. {barbeiro.nome}
                      </div>
                      <Badge bg="warning" pill>{barbeiro.cortes} cortes</Badge>
                    </ListGroup.Item>
                  ))}
                  {ranking.length === 0 && <ListGroup.Item className="text-center mt-3">Nenhum corte registrado</ListGroup.Item>}
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <Calendario/>
    </Pagina>
  );
}

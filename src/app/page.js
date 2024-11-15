'use client'
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, ListGroup, Badge, Image } from 'react-bootstrap';
import Pagina from "@/app/components/Pagina";
import Calendario from './components/Calendario';
import EstatisticasBarbeiros from './components/EstatisticasBarbeiros';


export default function HomePage() {
  const [agendamentos, setAgendamentos] = useState(JSON.parse(localStorage.getItem('agendamentos')) || []);
  const [ranking, setRanking] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [servicos, setServicos] = useState([]); // Adicionei o estado para serviços

  useEffect(() => {
    // Carregar dados do localStorage
    const agendamentosData = JSON.parse(localStorage.getItem('agendamentos')) || [];
    const barbeirosData = JSON.parse(localStorage.getItem('barbeiros')) || [];
    const funcionariosData = JSON.parse(localStorage.getItem('funcionarios')) || [];
    const servicosData = JSON.parse(localStorage.getItem('servicos')) || []; // Carregue os serviços

    setAgendamentos(agendamentosData);
    setRanking(barbeirosData.sort((a, b) => b.cortes - a.cortes)); // Ordena barbeiros pelo número de cortes
    setFuncionarios(funcionariosData); // Configura lista de funcionários
    setServicos(servicosData); // Configura lista de serviços
  }, []);

  // Função para formatar horário no formato HH:mm
  const formatarHorario = (dataString) => {
    const data = new Date(dataString);
    const horas = String(data.getHours()).padStart(2, '0');
    const minutos = String(data.getMinutes()).padStart(2, '0');
    return `${horas}:${minutos}`;
  };

  const atualizarAgendamentos = (novoAgendamento) => {
    const novosAgendamentos = [...agendamentos, novoAgendamento];
    setAgendamentos(novosAgendamentos);
    localStorage.setItem('agendamentos', JSON.stringify(novosAgendamentos));
  };

  

  return (
    <Pagina titulo="Gestão BarberShop" >
      <Container>
        <EstatisticasBarbeiros agendamentos={agendamentos} servicos={servicos} /> {/* Passa os serviços aqui */}

        {/* Listagem Horizontal dos Funcionários */}
        <Row className="my-5">
          <Col>
            <h4 className="text-center m-3 text-white">Equipe</h4>
            <div className="d-flex flex-row justify-content-center align-items-center flex-wrap">
              {funcionarios.map((funcionario, index) => (
                <div key={index} className="text-center mx-3 text-black">
                  <Image
                    src={funcionario.imagem}
                    alt={funcionario.nome}
                    style={{
                      width: '80px', // Tamanho fixo
                      height: '80px', // Tamanho fixo
                      objectFit: 'cover', // Corta a imagem mantendo a proporção
                      borderRadius: '50%', // Mantém o formato circular
                    }}
                    className="mb-2"
                  />
                  <p><strong>{funcionario.nome}</strong></p>
                </div>
              ))}
            </div>
          </Col>
        </Row>

      </Container>

      <Calendario className="mb-5" />
      
    </Pagina>
    
  );
}

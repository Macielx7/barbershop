import React, { useEffect, useState } from 'react';
import { Card, Container, Row, Col, Form } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function EstatisticasPage() {
  const [produto, setProduto] = useState([]);
  const [estatisticas, setEstatisticas] = useState({
    totalProdutos: 0,
    totalLucroBruto: 0,
    totalLucroLiquidoBarbeiros: 0,
    totalLucroLiquidoBarbearia: 0,
  });
  const [anoSelecionado, setAnoSelecionado] = useState(new Date().getFullYear());
  const [lucroMensal, setLucroMensal] = useState(Array(12).fill(0));
  const [agendamentos, setAgendamentos] = useState([]);
  const [mesSelecionado, setMesSelecionado] = useState(new Date().getMonth());

  useEffect(() => {
    const storedProduto = localStorage.getItem('produtos');
    if (storedProduto) {
      setProduto(JSON.parse(storedProduto));
    }

    const storedAgendamentos = localStorage.getItem('agendamentos');
    if (storedAgendamentos) {
      setAgendamentos(JSON.parse(storedAgendamentos));
    }
  }, []);

  useEffect(() => {
    const agendamentosConfirmados = agendamentos.filter(
      (agendamento) => agendamento.status === 'confirmado'
    );
    calcularEstatisticas(produto, agendamentosConfirmados);
    calcularLucroMensal(produto, agendamentosConfirmados);
  }, [produto, agendamentos, anoSelecionado, mesSelecionado]);

  const calcularEstatisticas = (produtos, agendamentosConfirmados) => {
    let totalLucroBruto = 0;
    let totalProdutosVendidos = 0;

    // Somando os preços dos produtos com status 'Vendido' apenas no mês e ano selecionados
    produtos.forEach((produto) => {
      const dataVenda = new Date(produto.dataVenda);
      if (
        produto.status === 'vendido' &&
        dataVenda.getFullYear() === anoSelecionado &&
        dataVenda.getMonth() === mesSelecionado
      ) {
        const preco = Number(produto.preco) || 0;
        totalLucroBruto += preco;
        totalProdutosVendidos += 1;
      }
    });

    // Somando os valores dos serviços confirmados apenas no mês e ano selecionados
    agendamentosConfirmados.forEach((agendamento) => {
      const dataAgendamento = new Date(agendamento.inicio);
      if (
        agendamento.status === 'confirmado' &&
        dataAgendamento.getFullYear() === anoSelecionado &&
        dataAgendamento.getMonth() === mesSelecionado
      ) {
        const precoServico = Number(agendamento.valor) || 0;
        totalLucroBruto += precoServico;
      }
    });

    const totalLucroLiquidoBarbeiros = totalLucroBruto * 0.3;
    const totalLucroLiquidoBarbearia = totalLucroBruto - totalLucroLiquidoBarbeiros;

    setEstatisticas({
      totalProdutos: totalProdutosVendidos,
      totalLucroBruto,
      totalLucroLiquidoBarbeiros,
      totalLucroLiquidoBarbearia,
    });
  };


  const calcularLucroMensal = (produtos, agendamentosConfirmados) => {
    const lucroMensalStorage = JSON.parse(localStorage.getItem('lucroMensal')) || {};
    const lucroMensalAno = lucroMensalStorage[anoSelecionado] || Array(12).fill(0);

    const lucroMensalArray = [...lucroMensalAno];

    // Calculando lucro mensal para produtos vendidos
    produtos.forEach((produto) => {
      const dataVenda = new Date(produto.dataVenda);
      const preco = Number(produto.preco) || 0;

      if (produto.status === 'vendido' && dataVenda.getFullYear() === anoSelecionado) {
        const mes = dataVenda.getMonth();
        lucroMensalArray[mes] += preco;
      }
    });

    // Calculando lucro mensal para serviços confirmados
    agendamentosConfirmados.forEach((agendamento) => {
      const dataVenda = new Date(agendamento.inicio); // Considerando a data do agendamento
      const precoServico = Number(agendamento.valor) || 0;

      if (agendamento.status === 'confirmado' && dataVenda.getFullYear() === anoSelecionado) {
        const mes = dataVenda.getMonth();
        lucroMensalArray[mes] += precoServico;
      }
    });

    setLucroMensal(lucroMensalArray);
  };

  const handleMesChange = (e) => {
    setMesSelecionado(Number(e.target.value));
  };

  const handleAnoChange = (e) => {
    setAnoSelecionado(Number(e.target.value));
  };

  const data = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    datasets: [
      {
        label: `Lucro Mensal em ${anoSelecionado}`,
        data: lucroMensal,
        backgroundColor: 'rgba(34, 139, 34, 0.5)',  // Cor do fundo das barras
        borderColor: 'rgba(34, 139, 34, 1)',  // Cor das linhas (se houver)
        borderWidth: 4,  // Espessura das linhas
        pointBackgroundColor: 'rgba(34, 139, 34, 1)',  // Cor dos pontos ao longo da linha
        pointBorderColor: 'rgba(34, 139, 34, 1)',  // Cor da borda dos pontos
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'white',  // Cor da fonte do título (label)
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          color: 'white',  // Cor das linhas de grade horizontais
          lineWidth: 1,  // Largura da linha da grade no eixo X
        },
        ticks: {
          color: 'white',  // Cor dos números no eixo X
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'white',  // Cor das linhas de grade verticais
          lineWidth: 1,  // Largura da linha da grade no eixo Y
        },
        ticks: {
          color: 'white',  // Cor dos números no eixo Y
        },
        title: {
          display: true,
          text: 'Lucro',
          color: 'white',  // Cor do título do eixo Y
          font: {
            size: 16,
          },
        },
      },
    },
  };







  return (

    <Container>





      <Row className="my-5">
        <Col md={6}>
          <Form.Group controlId="anoSelecionado">
            <Form.Label><strong>Selecionar Ano</strong></Form.Label>
            <Form.Control as="select" value={anoSelecionado} onChange={handleAnoChange}>
              {[...Array(5).keys()].map((i) => {
                const year = new Date().getFullYear() - i;
                return <option key={year} value={year}>{year}</option>;
              })}
            </Form.Control>
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group controlId="mesSelecionado">
            <Form.Label><strong>Selecionar Mês</strong></Form.Label>
            <Form.Control as="select" value={mesSelecionado} onChange={handleMesChange}>
              {['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'].map((mes, index) => (
                <option key={index} value={index}>{mes}</option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>














      <Row className="my-5">
        <Col md={6}>
          <Card className="mb-3 shadow-sm bg-primary text-white text-center">
            <Card.Body>
              <Card.Title>Total de Produtos Vendidos</Card.Title>
              <h3>{estatisticas.totalProdutos}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="mb-3 shadow-sm bg-success text-white text-center">
            <Card.Body>
              <Card.Title>Lucro Bruto</Card.Title>
              <h3>R$ {estatisticas.totalLucroBruto.toFixed(2)}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="mb-3 shadow-sm bg-info text-white text-center">
            <Card.Body>
              <Card.Title>Lucro Líquido Barbeiros</Card.Title>
              <h3>R$ {estatisticas.totalLucroLiquidoBarbeiros.toFixed(2)}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="mb-3 shadow-sm bg-info text-white text-center">
            <Card.Body>
              <Card.Title>Lucro Líquido Barbearia</Card.Title>
              <h3>R$ {estatisticas.totalLucroLiquidoBarbearia.toFixed(2)}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="my-5">
        <Col>
          <Form.Group controlId="anoSelecionado">
            <Form.Label><strong>Selecionar Ano</strong></Form.Label>
            <Form.Control
              as="select"
              value={anoSelecionado}
              onChange={handleAnoChange}
            >
              {[...Array(5).keys()].map((i) => {
                const year = new Date().getFullYear() - i;
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>

      <Row className="my-5">
        <Col>
          <h4 className="text-center text-black"  >Comparação de Lucro Mensal - {anoSelecionado}</h4>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
            <Bar data={data} options={options} />
          </div>
        </Col>
      </Row>
    </Container>
  );
}

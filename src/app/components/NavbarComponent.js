import React, { useEffect, useState } from 'react';
import { Navbar, Nav, Container, Dropdown } from 'react-bootstrap';
import { FaUserFriends, FaCut, FaCalendarAlt, FaShoppingBag, FaUser } from 'react-icons/fa';

const NavbarComponent = () => {
  const [usuarioLogado, setUsuarioLogado] = useState('');

  useEffect(() => {
    const usuario = localStorage.getItem('usuarioLogado');
    if (usuario) {
      const usuarioData = JSON.parse(usuario);
      setUsuarioLogado(usuarioData.usuario);
    } else {
      setUsuarioLogado(''); // Reseta o nome do usuário caso não exista
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('usuarioLogado');
    setUsuarioLogado(''); // Reseta o nome do usuário
    // Redirecionar para a página de login, se necessário
  };

  return (
    <Navbar expand="lg" bg="dark" variant="dark" className="shadow-lg p-3" style={{ fontSize: '1.1em' }}>
      <Container>
        <Navbar.Brand href="/" className="d-flex align-items-center">
          <FaCut size={30} className="me-2 text-warning" />
          <span className="fw-bold text-light">BarberShop</span>
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto">
            {usuarioLogado ? (
              // Menu para usuário logado
              <>
                

                <Nav.Item className="text-center mx-2">
                  <Nav.Link href="/clientes" className="d-flex flex-column align-items-center text-light">
                    <FaUserFriends size={22} className="mb-1 text-warning" />
                    <span className="d-none d-lg-block">Clientes</span>
                  </Nav.Link>
                </Nav.Item>

                <Nav.Item className="text-center mx-2">
                  <Nav.Link href="/servicos" className="d-flex flex-column align-items-center text-light">
                    <FaCut size={22} className="mb-1 text-warning" />
                    <span className="d-none d-lg-block">Serviços</span>
                  </Nav.Link>
                </Nav.Item>

                <Nav.Item className="text-center mx-2">
                  <Nav.Link href="/funcionarios" className="d-flex flex-column align-items-center text-light">
                    <FaUserFriends size={22} className="mb-1 text-warning" />
                    <span className="d-none d-lg-block">Funcionários</span>
                  </Nav.Link>
                </Nav.Item>

                <Nav.Item className="text-center mx-2">
                  <Nav.Link href="/agendamentos" className="d-flex flex-column align-items-center text-light">
                    <FaCalendarAlt size={22} className="mb-1 text-warning" />
                    <span className="d-none d-lg-block">Agendamentos</span>
                  </Nav.Link>
                </Nav.Item>

                <Nav.Item className="text-center mx-2">
                  <Nav.Link href="/produtos" className="d-flex flex-column align-items-center text-light">
                    <FaShoppingBag size={22} className="mb-1 text-warning" />
                    <span className="d-none d-lg-block">Produtos</span>
                  </Nav.Link>
                </Nav.Item>

                <Dropdown className="d-flex align-items-center me-3">
                  <Dropdown.Toggle variant="link" id="dropdown-user" className="text-light d-flex align-items-center">
                    <FaUser size={22} className="me-1 text-warning" />
                    <span>{usuarioLogado}</span>
                  </Dropdown.Toggle>
                  <Dropdown.Menu align="end">
                    <Dropdown.Item href="/perfil">Perfil</Dropdown.Item>
                    <Dropdown.Item onClick={handleLogout}>Deslogar</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            ) : (
              // Menu para usuário não logado
              <>
                <Nav.Item className="text-center mx-2">
                  <Nav.Link href="/login" className="text-light">
                    Login
                  </Nav.Link>
                </Nav.Item>

                <Nav.Item className="text-center mx-2">
                  <Nav.Link href="/register" className="text-light">
                    Registro
                  </Nav.Link>
                </Nav.Item>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;

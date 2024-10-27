import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { FaUserFriends, FaCut, FaCalendarAlt, FaShoppingBag } from 'react-icons/fa';

const NavbarComponent = () => {
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
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;

import React, { useEffect, useState } from 'react';
import { Navbar, Nav, Container, Dropdown } from 'react-bootstrap';
import { FaUserFriends, FaCut, FaShoppingBag } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { IoLogOut } from "react-icons/io5";



const NavbarComponent = () => {
  const [autenticado, setAutenticado] = useState(false);
  const [usuario, setUsuario] = useState('');
  const router = useRouter();


  useEffect(() => {

    const usuarioLogado = localStorage.getItem('usuarioLogado');
    if (!usuarioLogado) {
      router.push('/login');
    } else {

      setAutenticado(true);
      setUsuario(JSON.parse(usuarioLogado).usuario);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('usuarioLogado');
    router.push('/login');
  };

  if (!autenticado) {
    return null;
  }

  return (
    <>

      <Navbar expand="lg" bg="dark" variant="dark" className="shadow-lg p-3" style={{ fontSize: '1.1em' }}>
        <Container>
          <Navbar.Brand href="/" className="">
            <img
              src="/imagens/logo.png"
              height="80"
              className="d-inline-block align-top"
              alt="Logo"
            />
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="navbar-nav" />
          <Navbar.Collapse id="navbar-nav">
            <Nav className="ms-auto">
              <Nav.Item className="text-center mx-2">
                <Nav.Link href="/clientes" className="d-flex flex-column align-items-center text-light card-hover-effect">
                  <FaUserFriends size={22} className="mb-1 text-white" />
                  <span className="d-none d-lg-block">Clientes</span>
                </Nav.Link>
              </Nav.Item>

              <Nav.Item className="text-center mx-2">
                <Nav.Link href="/funcionarios" className="d-flex flex-column align-items-center text-light card-hover-effect">
                  <FaUserFriends size={22} className="mb-1 text-white" />
                  <span className="d-none d-lg-block">Funcionários</span>
                </Nav.Link>
              </Nav.Item>

              <Nav.Item className="text-center mx-2">
                <Nav.Link href="/servicos" className="d-flex flex-column align-items-center text-light card-hover-effect">
                  <FaCut size={22} className="mb-1 text-white" />
                  <span className="d-none d-lg-block">Serviços</span>
                </Nav.Link>
              </Nav.Item>

              <Nav.Item className="text-center mx-2">
                <Nav.Link href="/produtos" className="d-flex flex-column align-items-center text-light card-hover-effect">
                  <FaShoppingBag size={22} className="mb-1 text-white" />
                  <span className="d-none d-lg-block">Produtos</span>
                </Nav.Link>
              </Nav.Item>

              <Nav.Item className="text-center mx-2" style={{ marginLeft: '40px' }}>
                <Nav.Link onClick={handleLogout} className="d-flex flex-column align-items-center text-light card-hover-effect" role="button">
                  <IoLogOut size={22} className="mb-1 text-white" />
                  <span className="d-none d-lg-block">Sair</span>
                </Nav.Link>
              </Nav.Item>

            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default NavbarComponent;

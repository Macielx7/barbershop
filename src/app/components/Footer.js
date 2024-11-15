import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaPhone, FaEnvelope } from 'react-icons/fa'; // Ícones das redes sociais
import { BsFillGeoAltFill } from 'react-icons/bs'; // Ícone de localização

const footerStyle = {
  backgroundColor: '#2d2d2d', // Cor de fundo mais escura
  color: 'white', // Cor do texto
  padding: '40px 20px', // Mais espaço interno
  textAlign: 'center', // Centraliza o texto
  position: 'relative',
  bottom: 0,
  width: '100%',
};

const linkStyle = {
  color: 'white',
  textDecoration: 'none',
  margin: '0 10px',
  fontSize: '20px', // Tamanho maior para os ícones
};

const footerContentStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '20px',
  flexDirection: 'column',
};

const socialLinksStyle = {
  marginTop: '10px',
  display: 'flex',
  justifyContent: 'center',
  gap: '15px', // Espaçamento maior entre os ícones
};

const Footer = () => {
  return (
    <footer style={footerStyle}>
      <div style={footerContentStyle}>
        <p>&copy; {new Date().getFullYear()} BarberShop. Todos os direitos reservados.</p>
        <div>
          <p><FaPhone /> (11) 98765-4321</p>
          <p><FaEnvelope /> contato@barbershop.com</p>
          <p><BsFillGeoAltFill /> Rua Exemplo, 123 - Centro, São Paulo - SP</p>
        </div>

        <div style={socialLinksStyle}>
          <a href="#" style={linkStyle}>
            <FaFacebook />
          </a>
          <a href="#" style={linkStyle}>
            <FaTwitter />
          </a>
          <a href="#" style={linkStyle}>
            <FaInstagram />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

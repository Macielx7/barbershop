// Pagina.js
import React from 'react';
import { Container } from "react-bootstrap";
import NavbarComponent from './NavbarComponent';  // Importe o NavbarComponent

export default function Pagina(props) {
    return (
        <>
            <NavbarComponent />  {/* Use o NavbarComponent aqui */}

            <div className="bg-secondary text-white text-center p-3">
                <h1>{props.titulo}</h1>
            </div>

            <Container className="my-3">
                {props.children}
            </Container>
        </>
    );
}

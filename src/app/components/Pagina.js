'use client';

import React, { useState, useEffect } from 'react';
import { Container } from "react-bootstrap";
import NavbarComponent from './NavbarComponent';
import Footer from './Footer';
import { useRouter } from 'next/navigation';


export default function Pagina(props) {
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


    return (
        <div className={`bg-secondary d-flex flex-column min-vh-100`}>
            <NavbarComponent /> 

            <div className="bg-secondary text-white text-center p-3 flex-grow-0">
                <h1>{props.titulo}</h1>
            </div>

            <Container className="my-3 flex-grow-1">
                {props.children}
            </Container>
            <Footer className="mt-auto"/>
        </div>
    );
}

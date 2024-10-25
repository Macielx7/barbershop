'use client'

import Pagina from "@/app/components/Pagina";
import Link from "next/link";
import { Table } from "react-bootstrap";
import { FaPlusCircle } from "react-icons/fa";

const passageiros = JSON.parse(localStorage.getItem('passageiros')) || [];

export default function Page(){
    return(
        <Pagina titulo="Passageiros">
            <Link
                href="/passageiros/create"
                className="btn btn-primary mb-3"
            >
                <FaPlusCircle /> Novo
            </Link>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Nome</th>
                        <th>Tipo Documento</th>
                        <th>Documento</th>
                        <th>E-mail</th>
                        <th>Telefone</th>
                        <th>Data de Nascimento</th>
                    </tr>
                </thead>
                <tbody>
                    {passageiros.map((item, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.nome}</td>
                            <td>{item.tipo_documento}</td>
                            <td>{item.documento}</td>
                            <td>{item.email}</td>
                            <td>{item.telefone}</td>
                            <td>{item.data_nascimento}</td>
                            
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Pagina>
        
    )
}
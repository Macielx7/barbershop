'use client'

import Pagina from "@/app/components/Pagina";
import Link from "next/link";
import { Table } from "react-bootstrap";
import { FaPlusCircle } from "react-icons/fa";

const aeroportos = JSON.parse(localStorage.getItem('aeroportos')) || [];

export default function Page(){
    return(
        <Pagina titulo="Aeroportos">
            <Link
                href="/aeroportos/create"
                className="btn btn-primary mb-3"
            >
                <FaPlusCircle /> Novo
            </Link>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Nome</th>
                        <th>Sigla</th>
                        <th>UF</th>
                        <th>Cidade</th>
                        <th>País</th>
                    </tr>
                </thead>
                <tbody>
                    {aeroportos.map((item, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.nome}</td>
                            <td>{item.sigla}</td>
                            <td>{item.uf}</td>
                            <td>{item.cidade}</td>
                            <td>{item.pais}</td>
                            
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Pagina>
        
    )
}
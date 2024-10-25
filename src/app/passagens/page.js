'use client'

import Pagina from "@/app/components/Pagina";
import Link from "next/link";
import { Table } from "react-bootstrap";
import { FaPlusCircle } from "react-icons/fa";

const passagens = JSON.parse(localStorage.getItem('passagens')) || [];

export default function Page(){
    return(
        <Pagina titulo="Passagens">
            <Link
                href="/passagens/create"
                className="btn btn-primary mb-3"
            >
                <FaPlusCircle /> Novo
            </Link>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Nº Voo</th>
                        <th>Cod. Passageiro</th>
                        <th>Assento</th>
                        <th>Preço</th>
                    </tr>
                </thead>
                <tbody>
                    {passagens.map((item, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.voo_id}</td>
                            <td>{item.passageiro_id}</td>
                            <td>{item.assento}</td>
                            <td>{item.preco}</td>                            
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Pagina>
        
    )
}
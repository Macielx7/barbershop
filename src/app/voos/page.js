'use client'

import Pagina from "@/app/components/Pagina";
import Link from "next/link";
import { Table } from "react-bootstrap";
import { FaPlusCircle } from "react-icons/fa";

const voos = JSON.parse(localStorage.getItem('voos')) || [];

export default function Page(){
    return(
        <Pagina titulo="Voos">
            <Link
                href="/voos/create"
                className="btn btn-primary mb-3"
            >
                <FaPlusCircle /> Novo
            </Link>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>internacional</th>
                        <th>identificador</th>
                        <th>checkin</th>
                        <th>embarque</th>
                        <th>origem</th>
                        <th>destino</th>
                        <th>empresa</th>
                        <th>preço</th>
                    </tr>
                </thead>
                <tbody>
                    {voos.map((item, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.voo_id}</td>
                            <td>{item.identificador}</td>
                            <td>{item.data_checkin}</td>
                            <td>{item.data_embarque}</td>                            
                            <td>{item.id_origem}</td>                            
                            <td>{item.id_destino}</td>                            
                            <td>{item.empresa_id}</td>                            
                            <td>{item.preco}</td>                            
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Pagina>
        
    )
}
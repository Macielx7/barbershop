'use client'

import Pagina from "@/app/components/Pagina"
import Link from "next/link"
import { useEffect, useState } from "react";
import { Table } from "react-bootstrap"
import { FaEdit, FaPlusCircle } from "react-icons/fa";
import { MdDelete } from "react-icons/md";


export default function Page() {

    const [empresas, setEmpresas] = useState([]);

    useEffect(()=>{
        setEmpresas(JSON.parse(localStorage.getItem('empresas')) || [])
    }, [])

    function excluir(id){
        if(confirm('Deseja realmente excluir o registro?')){
            const dados = empresas.filter(item=>item.id != id)
            localStorage.setItem('empresas', JSON.stringify(dados));
            setEmpresas(dados)
        }

    }

    return (
        <Pagina titulo="Empresas">

            <Link
                href="/empresas/create"
                className="btn btn-primary mb-3"
            >
                <FaPlusCircle /> Novo
            </Link>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Nome</th>
                        <th>Logo</th>
                    </tr>
                </thead>
                <tbody>
                    {empresas.map((item, i) => (
                        <tr key={item.id}>
                            <td>
                                <FaEdit title="Editar" className="text-primary" />
                                <MdDelete 
                                    title="Excluir" 
                                    className="text-danger"
                                    onClick={()=>excluir(item.id)}
                                    />
                            </td>
                            <td>{item.nome}</td>
                            <td>
                                <a target="Blank" href={item.site}>
                                    <img src={item.logo} alt={`sem imagem`} style={{ width: '100px', height: '100%' }} />
                                </a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Pagina>
    )
}

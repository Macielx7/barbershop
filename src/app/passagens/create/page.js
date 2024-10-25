'use client'

import Pagina from "@/app/components/Pagina";
import { Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Form } from "react-bootstrap";
import { FaCheck } from "react-icons/fa";
import { MdOutlineArrowBack } from "react-icons/md";

export default function Page() {

    const route = useRouter()

    function salvar(dados) {
        const passagens = JSON.parse(localStorage.getItem('passagens')) || [];
        passagens.push(dados);
        localStorage.setItem('passagens', JSON.stringify(passagens));
        return route.push('/passagens/')
    }

    return (
        <Pagina titulo="Passagem">

            <Formik
                initialValues={{voo_id: '', passageiro_id: '', assento: '', preco: ''}}
                onSubmit={values => salvar(values)}
            >
                {({
                    values,
                    handleChange,
                    handleSubmit,
                }) => (
                    <Form>
                        <Form.Group className="mb-3" controlId="voo">
                            <Form.Label>Nº Voo</Form.Label>
                            <Form.Control 
                                type="number" 
                                name="voo" 
                                value={values.voo_id}
                                onChange={handleChange('voo_id')}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="passageiro_id">
                            <Form.Label>Cod. Passageiro</Form.Label>
                            <Form.Control 
                                type="number" 
                                name="passageiro_id"
                                value={values.passageiro_id}
                                onChange={handleChange('passageiro_id')}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="assento">
                            <Form.Label>Assento</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="assento"
                                value={values.assento}
                                onChange={handleChange('assento')}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="preco">
                            <Form.Label>Preço</Form.Label>
                            <Form.Control 
                                type="decimal" 
                                name="preco"
                                value={values.preco}
                                onChange={handleChange('preco')}
                            />
                        </Form.Group>
                        <div className="text-center">
                            <Button onClick={handleSubmit} variant="success">
                                <FaCheck /> Salvar
                            </Button>
                            <Link
                                href="/passagens"
                                className="btn btn-danger ms-2"
                            >
                                <MdOutlineArrowBack /> Voltar
                            </Link>
                        </div>
                    </Form>
                )}
            </Formik>
        </Pagina>
    );
}

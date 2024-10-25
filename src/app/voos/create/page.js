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
        const voos = JSON.parse(localStorage.getItem('voos')) || [];
        voos.push(dados);
        localStorage.setItem('voos', JSON.stringify(voos));
        return route.push('/voos/')
    }

    return (
        <Pagina titulo="Voo">

            <Formik
                initialValues={{ internacional: '', identificador: '', data_checkin: '', data_embarque: '', id_origem: '', id_destino: '', empresa_id: '', preco: '' }}
                onSubmit={values => salvar(values)}
            >
                {({
                    values,
                    handleChange,
                    handleSubmit,
                }) => (
                    <Form>
                        <Form.Group className="mb-3" controlId="internacional">
                            <Form.Label>Internacional</Form.Label>
                            <Form.Control
                                as="select"
                                name="interncional"
                                value={values.nome}
                                onChange={handleChange('internacional')}
                            >

                                <option value="">Selecione...</option>
                                <option value="S">Sim</option>
                                <option value="N">Não</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="identificador">
                            <Form.Label>Identificador</Form.Label>
                            <Form.Control
                                type="text"
                                name="identificador"
                                value={values.identificador}
                                onChange={handleChange('identificador')}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="data_checkin">
                            <Form.Label>Data de Checkin</Form.Label>
                            <Form.Control 
                                type="date"
                                name="data_checkin"
                                value={values.data_checkin}
                                onChange={handleChange('data_checkin')}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="data_embarque">
                            <Form.Label>Data de Embarque</Form.Label>
                            <Form.Control 
                                type="date"
                                name="data_embarque"
                                value={values.data_embarque}
                                onChange={handleChange('data_embarque')}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="id_origem">
                            <Form.Label>Origem</Form.Label>
                            <Form.Control
                                type="text"
                                name="id_origem"
                                value={values.id_origem}
                                onChange={handleChange('id_origem')}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="id_destino">
                            <Form.Label>Destino</Form.Label>
                            <Form.Control
                                type="text"
                                name="id_destino"
                                value={values.id_destino}
                                onChange={handleChange('id_destino')}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="empresa_id">
                            <Form.Label>Empresa</Form.Label>
                            <Form.Control
                                type="text"
                                name="empresa_id"
                                value={values.empresa_id}
                                onChange={handleChange('empresa_id')}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="preco">
                            <Form.Label>Preço</Form.Label>
                            <Form.Control
                                type="text"
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
                                href="/voos"
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

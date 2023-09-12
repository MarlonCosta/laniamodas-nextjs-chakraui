import React, { useEffect, useState } from "react";
import { Box, Select, Button, Table, Thead, Tr, Th, Tbody, Modal, Td, Input, IconButton } from "@chakra-ui/react";

import {
    Step,
    StepDescription,
    StepIcon,
    StepIndicator,
    StepNumber,
    StepSeparator,
    StepStatus,
    StepTitle,
    Stepper,
    useSteps,
} from '@chakra-ui/stepper'
import { Database } from "@/lib/database.types";
import ProductsPage from "./products";
import ProductModal from "@/components/ProductSelectionCard";
import { FaCartPlus, FaShoppingBag, FaShoppingBasket, FaShoppingCart } from "react-icons/fa";

type Client = Database['public']['Tables']['clientes']['Row'];
type SoldProduct = Database['public']['Tables']['produtos_vendidos']['Row'];

const steps = [
    { title: 'Cliente', description: 'Selecione um cliente' },
    { title: 'Produtos', description: 'Selecione os produtos' },
    { title: 'Pagamento', description: 'Selecione a forma de pagamento' },
]

var cart: SoldProduct[] = [
    {
        data_hora: "2022-01-01 10:00:00",
        id: 1,
        produto: 123,
        quantidade: 5,
        venda: 456
    },
    {
        data_hora: "2022-01-02 15:30:00",
        id: 2,
        produto: null,
        quantidade: null,
        venda: null
    },
    {
        data_hora: "2022-01-03 08:45:00",
        id: 3,
        produto: 789,
        quantidade: 2,
        venda: 987
    }
];

const clients: Client[] = [
    {
        apelido: 'John',
        cpf: '12345678901',
        endereco: '123 Main St',
        id: '1',
        instagram: 'john123',
        nome: 'John Doe',
        numero_endereco: 123,
        saldo_devedor: 0,
        sobrenome: 'Doe',
        telefone: '1234567890',
        ultima_compra: '2022-01-01',
        ultimo_pagamento: '2022-01-01'
    },
    {
        apelido: 'Jane',
        cpf: '23456789012',
        endereco: '456 Elm St',
        id: '2',
        instagram: 'jane456',
        nome: 'Jane Smith',
        numero_endereco: 456,
        saldo_devedor: 0,
        sobrenome: 'Smith',
        telefone: '2345678901',
        ultima_compra: '2022-02-01',
        ultimo_pagamento: '2022-02-01'
    },
    {
        apelido: 'Bob',
        cpf: '34567890123',
        endereco: '789 Pine St',
        id: '3',
        instagram: 'bob789',
        nome: 'Bob Johnson',
        numero_endereco: 789,
        saldo_devedor: 0,
        sobrenome: 'Johnson',
        telefone: '3456789012',
        ultima_compra: '2022-03-01',
        ultimo_pagamento: '2022-03-01'
    }
];

function NewSalePage() {

    const [isOpen, setIsOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const { activeStep, setActiveStep } = useSteps({
        index: 1,
        count: steps.length,
    })

    type Product = { id: string, name: string, price: number };
    const products: Product[] = [
        { id: '1', name: 'Product 1', price: 100 },
        { id: '2', name: 'Product 2', price: 200 },
        { id: '3', name: 'Product 3', price: 300 },
    ];

    useEffect(() => {
        setActiveStep(1);
    }, [selectedClient, setActiveStep]);

    const [cart, setCart] = useState<SoldProduct[]>([
        {
            data_hora: "2022-01-01 10:00:00",
            id: 1,
            produto: 1,
            quantidade: 5,
            venda: 1
        }        
    ]);

    function handleRemoveProduct(productId: number) {
        const updatedCart = cart.filter((product) => product.id !== productId);
        setCart(updatedCart);
    }

    const handleOpenModal = () => {
        setIsOpen(true);
    }

    const handleCloseModal = () => {
        setIsOpen(false);
    }


    function SelectProduct() {
        return (
            <Box>
                <AddToCartButton />
                <Table>
                    <Thead>
                        <Tr>
                            <Th style={{ textAlign: 'center' }}>Produto</Th>
                            <Th style={{ textAlign: 'center' }}>Quantidade</Th>
                            <Th style={{ textAlign: 'center' }}>Total</Th>
                            <Th style={{ textAlign: 'center' }}>Remover</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {
                            cart.map((product: SoldProduct) => (
                                <Tr key={product.id}>
                                    <Td style={{ width: '70%' }}>{products.find(p => parseInt(p.id) === product.produto)?.name}</Td>
                                    <Td style={{ textAlign: 'center', width: '10%', padding: '0px'}}>
                                        <Input type="text" style={{ width: '50%', height: '100%', textAlign: 'center'}} defaultValue="1" />
                                    </Td>
                                    <Td style={{ textAlign: 'center', width: '10%' }}>{products.find(p => parseInt(p.id) === product.produto)?.price}</Td>
                                    <Td style={{ textAlign: 'center', width: '10%' }}>
                                        <Button onClick={() => handleRemoveProduct(product.id)}>❌</Button>
                                    </Td>
                                </Tr>
                            ))
                        }
                    </Tbody>
                </Table>
            </Box>
        );
    }

    function AddToCartButton() {
        return (
            <>
                <IconButton
                    icon={<FaCartPlus />}
                    aria-label="Add to Cart"
                    marginBottom={'10px'}
                    style={{ marginLeft: 'auto' }}
                    onClick={handleOpenModal}
                />
            </>
        );
    }


    function handleNextStep() {
        if (activeStep === 1) {
            if (selectedClient) {
                setActiveStep(activeStep + 1);

            } else {
                alert('Selecione um cliente');
            }
        }

    }

    return (
        <Stepper index={activeStep} orientation='vertical' height='400px' gap='0'>
            {steps.map((step, index) => (
                <Step key={index} >
                    <StepIndicator>
                        <StepStatus
                            complete={<StepIcon />}
                            incomplete={<StepNumber />}
                            active={<StepNumber />}
                        />
                    </StepIndicator>

                    <Box flexShrink='0'>
                        <StepTitle>{step.title}</StepTitle>
                        <StepDescription>{step.description}</StepDescription>
                        {index === 0 && <Select
                            placeholder="Escolha um cliente"
                            value={selectedClient?.nome || ''}
                            onChange={(event) => {
                                const selectedClient = clients.find(client => client.nome === event.target.value) || null;
                                setSelectedClient(selectedClient);
                            }}
                        >
                            {clients.map((client) => (
                                <option key={client.id} value={client.nome}>
                                    {`${client.nome} (${client.apelido})`}
                                </option>
                            ))}
                        </Select>}
                        {index === 1 && <SelectProduct />}

                        {index === 0 && <Button onClick={handleNextStep} isDisabled={selectedClient === null || activeStep !== 1} style={{ marginTop: '10px' }}>Confirmar</Button>}
                    </Box>
                    <StepSeparator />
                </Step>
            ))}
            <ProductModal isOpen={isOpen} onClose={handleCloseModal}/>
        </Stepper>
        
    )
}

export default NewSalePage;
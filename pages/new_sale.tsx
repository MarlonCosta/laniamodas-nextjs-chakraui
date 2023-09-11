import React, { useEffect, useState } from "react";
import { Box, Select, Button } from "@chakra-ui/react";

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

type Client = Database['public']['Tables']['clientes']['Row'];
type SoldProduct = Database['public']['Tables']['produtos_vendidos']['Row'];

const steps = [
    { title: 'Cliente', description: 'Selecione um cliente' },
    { title: 'Produtos', description: 'Selecione os produtos' },
    { title: 'Pagamento', description: 'Selecione a forma de pagamento' },
]

var cart: SoldProduct[] = [
]

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

    const [cart, setCart] = useState<Product[]>([]);

    function SelectProduct() {
        return (
            <Select
                placeholder="Escolha um produto"
                onChange={(event) => {
                    const selectedProduct = products.find(product => product.name === event.target.value);
                    if (selectedProduct) {
                        setCart([...cart, selectedProduct]);
                    }
                }}
            >
                {products.map((product) => (
                    <option key={product.id} value={product.name}>
                        {product.name}
                    </option>
                ))}
            </Select>
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
                                <option key={client.cpf} value={client.nome}>
                                    {client.nome}
                                </option>
                            ))}
                        </Select>}
                        {index === 1 && <SelectProduct />}
                        
                        {index === 0 && <Button onClick={handleNextStep} isDisabled={selectedClient === null || activeStep !== 1} style={{ marginTop: '10px' }}>Confirmar</Button>}
                    </Box>
                    <StepSeparator />
                </Step>
            ))}
        </Stepper>
    )
}

export default NewSalePage;
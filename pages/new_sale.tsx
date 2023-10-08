import React, { useEffect, useRef, useState } from "react";
import { Box, Select, Button, Table, Thead, Tr, Th, Tbody, Td, Input, useDisclosure, ButtonGroup, Stack, Text } from "@chakra-ui/react";
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
import ProductsSelectionCard from "@/components/ProductSelectionCard";
import { FaCartPlus } from "react-icons/fa";
import PaymentSelectionCard from "@/components/SelectPaymentMethod";

type Client = Database['public']['Tables']['clientes']['Row'];
type SoldProduct = Database['public']['Tables']['produtos_vendidos']['Insert'];
type Sale = Database['public']['Tables']['vendas']['Insert'];
type Product = Database['public']['Tables']['produtos']['Row'];

const steps = [
    { title: 'Etapa 1', description: 'Selecione um cliente' },
    { title: 'Etapa 2', description: 'Selecione os produtos' },
    { title: 'Etapa 3', description: 'Selecione a forma de pagamento' },
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
    const initialRef = useRef<HTMLInputElement>(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const { activeStep, setActiveStep } = useSteps({
        index: 1,
        count: steps.length,
    })

    const [sale, setSale] = useState<Sale>({
        id_cliente: selectedClient?.id!,
        data_hora: null,
        total: 0,
        desconto: 0,
        forma_pagamento: "",
        valor_pago: 0,
        desconto_percentual: true
    });

    const products: Product[] = [
        {
            descricao: 'Product 1',
            categoria: 'Category 1',
            codigo_barras: '1234567890',
            cor: 'Red',
            data_cadastro: '2022-04-01',
            estoque: 10,
            genero: 'Male',
            id: 1,
            marca: 'Brand 1',
            preco_custo: 50,
            preco_venda: 100,
            tamanho: 'M'
        },
        {
            descricao: 'Product 2',
            categoria: 'Category 2',
            codigo_barras: '2345678901',
            cor: 'Blue',
            data_cadastro: '2022-04-02',
            estoque: 20,
            genero: 'Female',
            id: 2,
            marca: 'Brand 2',
            preco_custo: 60,
            preco_venda: 120,
            tamanho: 'S'
        },
        {
            descricao: 'Product 3',
            categoria: 'Category 3',
            codigo_barras: '3456789012',
            cor: 'Green',
            data_cadastro: '2022-04-03',
            estoque: 30,
            genero: 'Unisex',
            id: 3,
            marca: 'Brand 3',
            preco_custo: 70,
            preco_venda: 140,
            tamanho: 'L'
        }
    ];

    useEffect(() => {
        setActiveStep(0);
    }, [selectedClient, setActiveStep]);

    const [cart, setCart] = useState<SoldProduct[]>([
        {
            id_produto: 1,
            quantidade: 5,
            id_venda: null
        }
    ]);

    function handleAddToCart(product: Product) {
        const productAlreadyInCart = cart.some((p) => p.id_produto === product.id);
        if (productAlreadyInCart) {
            alert('Este produto já está no carrinho!');
            return;
        }
        const newProduct: SoldProduct = {
            id_produto: product.id,
            quantidade: 1
        };
        setCart([...cart, newProduct]);
        onClose();
    }

    function SelectClient() {
        return (
            <>
                <Select
                    placeholder="Escolha um cliente"
                    value={selectedClient?.nome || ''}
                    onChange={(event) => {
                        const selectedClient: Client | null = clients.find(client => client.nome === event.target.value) ?? null;
                        setSelectedClient(selectedClient);
                    }}
                >
                    {clients.map((client) => (
                        <option key={client.id} value={client.nome}>
                            {`${client.nome} (${client.apelido})`}
                        </option>
                    ))}
                </Select>
                <Box style={{ textAlign: 'right' }}>
                    <Button onClick={handleNextStep} isDisabled={selectedClient === null || activeStep !== 0} style={{ marginTop: '10px' }}>Confirmar</Button>
                </Box>
            </>
        )
    }

    function handleRemoveProduct(product: SoldProduct) {
        const updatedCart = cart.map((p) => {
            if (p.id_produto === product.id_produto) {
                if (p.quantidade === 1) {
                    if (window.confirm('Deseja remover o produto do carrinho?')) {
                        return null;
                    }
                } else {
                    return { ...p, quantidade: p.quantidade! - 1 };
                }
            }
            return p;
        }).filter(p => p !== null) as SoldProduct[];
        setCart(updatedCart);
    }

    function SelectProduct() {
        return (
            <Box>
                <AddToCartButton />
                <Table>
                    <Thead>
                        <Tr>
                            <Th style={{ textAlign: 'center', borderTopLeftRadius: '10px' }}>Produto</Th>
                            <Th style={{ textAlign: 'center' }}>Quantidade</Th>
                            <Th style={{ textAlign: 'center', borderTopRightRadius: '10px' }}>Total</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {
                            cart.map((product: SoldProduct, index: number) => (
                                <Tr key={product.id_produto} style={{ borderBottomLeftRadius: index === cart.length - 1 ? '10px' : '0px', borderBottomRightRadius: index === cart.length - 1 ? '10px' : '0px' }}>
                                    <Td style={{ width: '70%' }}>{products.find(p => p.id === product.id_produto)?.descricao}</Td>
                                    <Td style={{ textAlign: 'center', width: '10%', padding: '0px' }}>
                                        <ButtonGroup size="sm">
                                            <Button onClick={() => handleRemoveProduct(product)}>-</Button>
                                            <Input type="text" style={{ height: 'inherit', textAlign: 'center' }} value={product.quantidade} readOnly />
                                            <Button onClick={() => {
                                                const updatedCart = cart.map((p) => {
                                                    if (p.id_produto === product.id_produto) {
                                                        return { ...p, quantidade: p.quantidade! + 1 };
                                                    }
                                                    return p;
                                                });
                                                setCart(updatedCart);
                                            }}>+</Button>
                                        </ButtonGroup>
                                    </Td>
                                    <Td style={{ textAlign: 'center', width: '10%' }}>R${(products.find(p => p.id === product.id_produto)?.preco_venda! * product.quantidade).toFixed(2)}</Td>
                                </Tr>
                            ))
                        }
                    </Tbody>
                </Table>
                <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
                    <Text style={{ color: 'black', fontWeight: 'bold' }}>Total: R${cart.reduce((total, product) => total + product.quantidade! * products.find(p => p.id === product.id_produto)?.preco_venda!, 0).toFixed(2)}</Text>
                    <Button onClick={() => {
                        setActiveStep(2);
                    }} isDisabled={cart.length === 0} style={{ marginTop: '10px' }}>Próximo</Button>
                </Box>
                <ProductsSelectionCard isOpen={isOpen} onClose={onClose} initialRef={initialRef} products={products} onClickHandler={handleAddToCart} />
            </Box>
        );
    }


    function AddToCartButton() {
        return (
            <>
                <Stack dir="row" spacing={4}>
                    <Button
                        leftIcon={<FaCartPlus />}
                        aria-label="Add to Cart"
                        marginBottom={"10px"}
                        style={{ marginLeft: "auto" }}
                        onClick={onOpen}>
                        Adicionar produto
                    </Button>
                </Stack>
            </>
        );
    }

    function handleNextStep() {
        if (activeStep === 0) {
            if (selectedClient) {
                setActiveStep(activeStep + 1);

            } else {
                alert('Selecione um cliente');
            }
        }
        if (activeStep === 1) {
            if (cart.length > 0) {
                setActiveStep(activeStep + 1);
            } else {
                alert('Adicione um produto');
            }
        }
    }

    return (
        <Stepper index={activeStep} orientation='vertical' height='400px' gap='0'>
            {steps.map((step, index) => (
                <Step key={index}>
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
                        {index === 0 && <SelectClient />}
                        {index === 1 && <SelectProduct />}
                        {index === 2 && <PaymentSelectionCard sale={sale} setSale={setSale} cart={cart} products={products}/>}
                    </Box>
                    <StepSeparator />
                </Step>
            ))}
        </Stepper>
    )
}

export default NewSalePage;

import React, {useEffect, useRef, useState} from "react";
import {
    Alert,
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    AlertIcon,
    Box,
    Button,
    ButtonGroup,
    Input,
    InputGroup,
    InputLeftAddon,
    InputRightAddon,
    Select,
    Stack,
    Stat,
    StatGroup,
    StatLabel,
    StatNumber,
    Table,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    useDisclosure,
    useToast
} from "@chakra-ui/react";
import {Step, StepDescription, StepIcon, StepIndicator, StepNumber, Stepper, StepSeparator, StepStatus, StepTitle, useSteps,} from '@chakra-ui/stepper'
import {Database} from "@/lib/database.types";
import ProductsSelectionCard from "@/components/ProductSelectionCard";
import {FaCartPlus} from "react-icons/fa";
import {supabase} from "@/lib/supabase";

type Client = Database['public']['Tables']['clientes']['Row'];
type SoldProduct = Database['public']['Tables']['produtos_vendidos']['Insert'];
type Sale = Database['public']['Tables']['vendas']['Insert'];
type Product = Database['public']['Tables']['produtos']['Row'];

type SelectProductProps = {
    cart: SoldProduct[];
    products: Product[];
    handleAddToCart: (product: Product) => void;
    isOpen: boolean;
    onClose: () => void;
    initialRef: React.RefObject<HTMLInputElement>;
};

const steps = [
    {title: 'Etapa 1', description: 'Selecione um cliente'},
    {title: 'Etapa 2', description: 'Selecione os produtos'},
    {title: 'Etapa 3', description: 'Selecione a forma de pagamento'},
]


function NewSalePage() {
    const initialRef = useRef<HTMLInputElement>(null);
    const {isOpen, onOpen, onClose} = useDisclosure();
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const {activeStep, setActiveStep} = useSteps({
        index: 0,
        count: steps.length,
    })

    const toast = useToast();

    const [sale, setSale] = useState<Sale>({
        id_cliente: selectedClient?.id!,
        data_hora: null,
        total: 0,
        desconto: 0,
        forma_pagamento: "",
        valor_pago: 0,
        desconto_percentual: true
    });

    useEffect(() => {
        Promise.all([fetchProducts(), fetchClients()]).then(([productsData, clientsData]) => {
            if (productsData) {
                setProducts(productsData);
            }
            if (clientsData) {
                setClients(clientsData);
            }
        });
    }, []);


    async function fetchProducts() {
        const {data, error} = await supabase
            .from("produtos")
            .select("*");
        if (error) {
            console.error(error);
        } else {
            return data;
        }
    }

    async function fetchClients() {
        const {data, error} = await supabase
            .from("clientes")
            .select("*");
        if (error) {
            console.error(error);
        } else {
            return data;
        }
    }

    const [cart, setCart] = useState<SoldProduct[]>([]);

    const [messageAlert, setAlert] = useState<{ status: "error" | "info" | "warning" | "success", message: string } | null>(null);

    function handleAddToCart(product: Product) {
        const productAlreadyInCart = cart.some((p) => p.id_produto === product.id);
        if (productAlreadyInCart) {
            setAlert({status: "error", message: 'Este produto já está no carrinho!'});
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
            <Box>
                {selectedClient ? null : (
                    <Alert status="error">
                        <AlertIcon/>
                        {"Escolha um cliente"}
                    </Alert>
                )}
                <Select
                    placeholder="Escolha um cliente"
                    value={selectedClient?.nome || ''}
                    onChange={(event) => {
                        const selectedClient = clients.find(client => client.nome === event.target.value) || null as Client | null;
                        setSelectedClient(selectedClient);
                        setActiveStep(selectedClient ? 1 : 0);
                    }}
                >
                    {clients.map((client) => (
                        <option key={client.id} value={client.nome}>
                            {`${client.nome} (${client.apelido})`}
                        </option>
                    ))}
                </Select>
            </Box>
        )
    }


    useEffect(() => {
        if (activeStep === 1) {
            setActiveStep(cart.length !== 0 ? 2 : 1);
        }
    }, [activeStep, cart, setActiveStep]);


    function SelectProduct({cart, products, handleAddToCart, isOpen, onClose, initialRef}: SelectProductProps) {
        const {isOpen: isRemoveDialogOpen, onOpen: onRemoveDialogOpen, onClose: onRemoveDialogClose} = useDisclosure();
        const [productToRemove, setProductToRemove] = useState<SoldProduct | null>(null);

        function handleRemoveProduct(product: SoldProduct) {
            if (product.quantidade === 1) {
                setProductToRemove(product);
                onRemoveDialogOpen();
            } else {
                subtractProductFromCart(product);
            }
        }

        function subtractProductFromCart(product: SoldProduct) {
            const updatedCart = cart.map((p) => {
                if (p.id_produto === product.id_produto) {
                    return {...p, quantidade: p.quantidade! - 1};
                }
                return p;
            }) as SoldProduct[];
            setCart(updatedCart);
        }

        function removeProductFromCart(product: SoldProduct) {
            const updatedCart = cart.filter(p => p.id_produto !== product.id_produto);
            setCart(updatedCart);
        }

        return (
            <Box>
                {cart.length !== 0 ? null : (
                    <Alert status="error" marginTop={4}>
                        <AlertIcon/>
                        {"Adicione algum item ao carrinho"}
                    </Alert>
                )}

                <AlertDialog
                    isOpen={isRemoveDialogOpen}
                    onClose={onRemoveDialogClose}
                    leastDestructiveRef={initialRef}
                >
                    <AlertDialogOverlay>
                        <AlertDialogContent>
                            <AlertDialogHeader fontSize="lg" fontWeight="bold">
                                Remover Produto
                            </AlertDialogHeader>

                            <AlertDialogBody>
                                Você tem certeza que deseja remover este produto?
                            </AlertDialogBody>

                            <AlertDialogFooter>
                                <Button onClick={onRemoveDialogClose}>
                                    Cancelar
                                </Button>
                                <Button colorScheme="red" onClick={() => productToRemove && removeProductFromCart(productToRemove)} ml={3}>
                                    Remover
                                </Button>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialogOverlay>
                </AlertDialog>

                <AddToCartButton/>
                <Table>
                    <Thead>
                        <Tr>
                            <Th style={{textAlign: 'center', borderTopLeftRadius: '10px'}}>Produto</Th>
                            <Th style={{textAlign: 'center'}}>Quantidade</Th>
                            <Th style={{textAlign: 'center', borderTopRightRadius: '10px'}}>Total</Th>
                        </Tr>
                    </Thead>
                    <Tbody>

                        {cart.length === 0 ?
                            <Tr>
                                <Td/>
                                <Td colSpan={3} style={{
                                    textAlign: 'center',
                                    height: '3em',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: 'none'
                                }}>
                                    Carrinho vazio!
                                </Td>
                                <Td/>
                            </Tr> :
                            cart.map((product: SoldProduct, index: number) => (
                                <Tr key={product.id_produto} style={{borderBottomLeftRadius: index === cart.length - 1 ? '10px' : '0px', borderBottomRightRadius: index === cart.length - 1 ? '10px' : '0px'}}>
                                    <Td style={{width: '70%'}}>{products.find(p => p.id === product.id_produto)?.descricao}</Td>
                                    <Td style={{textAlign: 'center', width: '10%', padding: '0px'}}>
                                        <ButtonGroup size="sm">
                                            <Button onClick={() => handleRemoveProduct(product)}>-</Button>
                                            <Input type="text" style={{height: 'inherit', textAlign: 'center'}} value={product.quantidade} readOnly/>
                                            <Button onClick={() => {
                                                const updatedCart = cart.map((p) => {
                                                    if (p.id_produto === product.id_produto) {
                                                        return {...p, quantidade: p.quantidade! + 1};
                                                    }
                                                    return p;
                                                });
                                                setCart(updatedCart);
                                            }}>+</Button>
                                        </ButtonGroup>
                                    </Td>
                                    <Td style={{textAlign: 'center', width: '10%'}}>R${(products.find(p => p.id === product.id_produto)?.preco_venda! * product.quantidade).toFixed(2)}</Td>
                                </Tr>
                            ))
                        }
                    </Tbody>
                </Table>
                <Box style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px'}}>
                    <Text style={{color: 'black', fontWeight: 'bold'}}>Total: R${cart.reduce((total, product) => total + product.quantidade! * products.find(p => p.id === product.id_produto)?.preco_venda!, 0).toFixed(2)}</Text>
                </Box>
                <ProductsSelectionCard isOpen={isOpen} onClose={onClose} initialRef={initialRef} products={products} onClickHandler={handleAddToCart}/>
            </Box>
        );
    }

    function AddToCartButton() {
        return (
            <Box>
                <Stack dir="row" spacing={4}>
                    <Button
                        leftIcon={<FaCartPlus/>}
                        aria-label="Add to Cart"
                        marginBottom={"10px"}
                        style={{marginLeft: "auto"}}
                        onClick={onOpen}>
                        Adicionar produto
                    </Button>
                </Stack>
            </Box>
        );
    }

    async function saveSaleOnDb(sale: Sale): Promise<Sale | null> {
        const {data, error} = await supabase.from('vendas').insert(sale).select();

        if (error) {
            setAlert({status: "error", message: error.message});
            return null;
        }

        return Array.isArray(data) && data.length > 0 ? data[0] : null;
    }

    async function addDebtToClient(client: Client, debt: number) {
        const {error} = await supabase
            .from('clientes')
            .update({saldo_devedor: client.saldo_devedor + debt})
            .eq('id', client.id);
        if (error) {
            setAlert({status: "error", message: "Erro ao atualizar o saldo devedor do cliente: " + error.message});
            return error;
        }
        return null;
    }

    function SelectPayment({sale, setSale, cart, products}: { sale: Sale, setSale: React.Dispatch<React.SetStateAction<Sale>>, cart: SoldProduct[], products: Product[] }) {
        const [discount, setDiscount] = useState(0);
        const [paidValue, setPaidValue] = useState<number>(0);
        const [percentualDiscount, setPercentualDiscount] = useState(true);
        const [paymentMethod, setPaymentMethod] = useState("");
        const [installments, setInstallments] = useState(1);

        let total = cart.reduce((total, product) => total + product.quantidade! * products.find(p => p.id === product.id_produto)?.preco_venda!, 0) as number;

        function calculateDiscount() {
            if (percentualDiscount) {
                return (total * discount / 100) || 0;
            }
            return discount || 0;
        }

        function validateDiscount(discount: number, percentualDiscount: boolean) {
            if (percentualDiscount) {
                return discount >= 0 && discount <= 30;
            } else {
                return discount >= 0 && discount <= total && discount + paidValue <= total;
            }
        }

        function validatePaidValue(paidValue: number) {
            return paidValue >= 0 && (paidValue + calculateDiscount()) <= total;
        }

        function validateSale(sale: Sale) {
            if (!sale.id_cliente) {
                alert("Id do cliente inválido: " + sale.id_cliente)
                setAlert({status: "error", message: "Selecione um cliente"});
                return false;
            }
            if (cart.length === 0) {
                alert("Carrinho vazio!")
                setAlert({status: "error", message: "Adicione produtos ao carrinho"});
                return false;
            }
            if (paymentMethod === "") {
                alert("Forma de pagamento inválida!")
                setAlert({status: "error", message: "Escolha uma forma de pagamento"});
                return false;
            }
            if (!validatePaidValue(paidValue)) {
                alert("Valor pago inválido!")
                setAlert({status: "error", message: "O valor pago + desconto deve ser menor ou igual ao valor total da compra"});
                return false;
            }
            if (!validateDiscount(discount, percentualDiscount)) {
                if (percentualDiscount) {
                    setAlert({status: "error", message: "O desconto percentual deve ser maior ou igual a 0 e menor ou igual a 30%"});
                } else {
                    setAlert({status: "error", message: "O desconto real deve ser maior ou igual a 0 e menor ou igual ao valor da compra"});
                }
                return false;
            }
            return true;
        }

        function buildSale() {
            const newSale = {
                ...sale,
                id_cliente: selectedClient!.id,
                data_hora: new Date().toLocaleString("en-US", {timeZone: "America/Sao_Paulo"}),
                desconto: discount,
                desconto_percentual: percentualDiscount,
                forma_pagamento: paymentMethod,
                total: total,
                valor_pago: paidValue
            };
            setSale(newSale);
            return newSale;
        }

        async function finishSale(sale: Sale, selectedClient: Client) {
            
            if (!validateSale(sale)) {
                toast({
                    title: "Transaction Failed",
                    description: "Validation failed",
                    status: "error",
                    duration: 9000,
                    isClosable: true,
                });
            } else {
                const savedSale = await saveSaleOnDb(sale);
                if (savedSale !== null) {
                    for (const item of cart) {
                        const {error} = await supabase
                            .from('produtos_vendidos')
                            .insert([
                                {
                                    id_venda: savedSale.id,
                                    id_produto: item.id_produto,
                                    quantidade: item.quantidade
                                }
                            ]);
                        if (error) {
                            console.error('Error: ', error);
                            toast({
                                title: "Falha ao concluir venda",
                                description: `Erro: ${error}`,
                                status: "error",
                                duration: 9000,
                                isClosable: true,
                            });
                        }
                    }

                    const error = await addDebtToClient(selectedClient, sale.total - sale.valor_pago);
                    if (error) {
                        console.error('Error: savedSale is null');
                        toast({
                            title: "Registro de venda falhou",
                            description: "Erro: falha ao salvar venda",
                            status: "error",
                            duration: 9000,
                            isClosable: true,
                        });
                    }

                    toast({
                        title: "Venda registrada",
                        description: "Venda concluída com sucesso",
                        status: "success",
                        duration: 9000,
                        isClosable: true,
                    });
                } else {
                    console.error('Error: savedSale is null');
                    toast({
                        title: "Registro de venda falhou",
                        description: "Erro: falha ao salvar venda",
                        status: "error",
                        duration: 9000,
                        isClosable: true,
                    });
                }
            }
        }


        return (
            <Box>
                {validateDiscount(discount, percentualDiscount) ? null : (
                    <Alert status="error" marginTop={4}>
                        <AlertIcon/>
                        {percentualDiscount ? "O desconto percentual deve ser maior ou igual a 0 e menor ou igual a 30%" : "O desconto real deve ser maior ou igual a 0 e menor ou igual ao valor da compra"}
                    </Alert>
                )}
                {paymentMethod !== "" ? null : (
                    <Alert status="error" marginTop={4}>
                        <AlertIcon/>
                        Escolha uma forma de pagamento</Alert>
                )}
                {validatePaidValue(paidValue) ? null : (
                    <Alert status="error" marginTop={4}>
                        <AlertIcon/>
                        O valor pago + desconto deve ser menor ou igual ao valor total da compra
                    </Alert>
                )}
                {(total - calculateDiscount() - paidValue) !== 0 || cart.length === 0 ? null : (
                    <Alert status="success" marginTop={4}>
                        <AlertIcon/>
                        Compra paga à vista ou no cartão que delícia cara
                    </Alert>
                )}
                <Select placeholder="Forma de pagamento" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                    <option value="dinheiro">Dinheiro/Pix</option>
                    <option value="cartao">Cartão</option>
                    <option value="cheque">Cheque</option>
                </Select>
                <Box marginTop={"10px"}>
                    <Box display="flex" justifyContent="space-between">
                        <InputGroup mr={2} flex="1">
                            <InputLeftAddon bg={"pink.500"} color={"white"}>Valor pago </InputLeftAddon>
                            <Input type="number" value={paidValue} step="0.01" min="0" onChange={(e) => {
                                setPaidValue(parseFloat(e.target.value) || 0);
                            }} onBlur={(e) => {
                                e.target.value = parseFloat(e.target.value || "0").toFixed(2);
                            }}/>
                        </InputGroup>
                        <InputGroup mr={2} flex="1" hidden={paymentMethod !== "cartao"}>
                            <InputLeftAddon bg={"pink.500"} color={"white"}>Parcelas</InputLeftAddon>
                            <Input type="number" value={installments} min="1" max="4" onChange={(e) => {
                                setInstallments(parseInt(e.target.value) || 1);
                            }} onBlur={(e) => {
                                e.target.value = (e.target.value || "0");
                            }}/>
                        </InputGroup>
                        <InputGroup mr={2} flex="1" marginRight={"0px"}>
                            <InputLeftAddon bg={"pink.500"} color={"white"}>Desconto</InputLeftAddon>

                            {/* TODO: Adicionar cálculo automático de desconto */}

                            <Input type="number" placeholder="Desconto" value={discount} step="1" min="0" max="30" onChange={(e) => {
                                setDiscount(parseFloat(e.target.value));
                            }} onBlur={(e) => {
                                setDiscount(parseFloat(e.target.value) || 0);
                                e.target.value = percentualDiscount ? parseFloat(e.target.value).toString() : parseFloat(e.target.value).toFixed(2);
                            }}/>
                            <InputRightAddon onClick={() => setPercentualDiscount(!percentualDiscount)} cursor="pointer" w="50px" textAlign="center">{percentualDiscount ? "%" : "R$"}</InputRightAddon>
                        </InputGroup>
                    </Box>
                    <Box marginTop={"10px"}>
                        <StatGroup bg={"pink.500"} borderRadius={"10px"} color={"white"} p={"4"}>
                            <Stat>
                                <StatLabel>Carrinho:</StatLabel>
                                <StatNumber>R$ {total.toFixed(2)}</StatNumber>
                            </Stat>
                            <Stat>
                                <StatLabel>Desconto real:</StatLabel>
                                <StatNumber>-R$ {calculateDiscount().toFixed(2) || 0}</StatNumber>
                            </Stat>
                            <Stat>
                                <StatLabel>Saldo Devedor:</StatLabel>
                                <StatNumber>R$ {((total - calculateDiscount() - paidValue) || 0).toFixed(2)}</StatNumber>
                            </Stat>
                            <Stat>
                                <StatLabel>Total recebido:</StatLabel>
                                <StatNumber>R$ {(paidValue || 0).toFixed(2)}</StatNumber>
                            </Stat>
                            <Stat hidden={paymentMethod !== "cartao"}>
                                <StatLabel>Parcelas:</StatLabel>
                                <StatNumber>{installments}x R$ {(paidValue / installments || 0).toFixed(2)}</StatNumber>
                            </Stat>
                        </StatGroup>
                    </Box>
                    <Box display="flex" justifyContent="flex-end">
                        <Button colorScheme="pink" onClick={() => finishSale(buildSale(), selectedClient!!)} style={{marginTop: "10px"}}>Concluir venda</Button>
                    </Box>
                </Box>
            </Box>
        );
    }


    return (
        <>
            {messageAlert && (
                <Alert status={messageAlert.status as "error" | "info" | "warning" | "success"}>
                    <AlertIcon/>
                    {messageAlert.message}
                </Alert>
            )}

            <Stepper index={activeStep} orientation='vertical' height='400px' gap='0'>
                {steps.map((step, index) => (
                    <Step key={index}>
                        <StepIndicator>
                            <StepStatus
                                complete={<StepIcon/>}
                                incomplete={<StepNumber/>}
                                active={<StepNumber/>}
                            />
                        </StepIndicator>

                        <Box flexShrink='0'>
                            <StepTitle>{step.title}</StepTitle>
                            <StepDescription>{step.description}</StepDescription>
                            {index === 0 && <SelectClient/>}
                            {index === 1 && <SelectProduct
                                cart={cart}
                                products={products}
                                handleAddToCart={handleAddToCart}
                                isOpen={isOpen}
                                onClose={onClose}
                                initialRef={initialRef}
                            />}
                            {index === 2 && <SelectPayment sale={sale} setSale={setSale} cart={cart} products={products}/>}
                        </Box>
                        <StepSeparator/>
                    </Step>
                ))}
            </Stepper>
        </>
    )
}

export default NewSalePage;

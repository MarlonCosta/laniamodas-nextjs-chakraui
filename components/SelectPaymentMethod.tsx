import {Database} from "@/lib/database.types";
import {Alert, AlertIcon, Box, Button, Input, InputGroup, InputLeftAddon, InputRightAddon, Select, Stat, StatGroup, StatLabel, StatNumber} from "@chakra-ui/react";
import React, {useState} from "react";

type Sale = Database['public']['Tables']['vendas']['Insert']
type SoldProduct = Database['public']['Tables']['produtos_vendidos']['Insert']
type Product = Database['public']['Tables']['produtos']['Row']

function PaymentSelectionCard({sale, setSale, cart, products}: { sale: Sale, setSale: React.Dispatch<React.SetStateAction<Sale>>, cart: SoldProduct[], products: Product[] }) {
    const [discount, setDiscount] = useState(0);
    const [paidValue, setPaidValue] = useState<number>(0);
    const [percentualDiscount, setPercentualDiscount] = useState(true);
    const [paymentMethod, setPaymentMethod] = useState("");
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

    function updateSale() {
        setSale({
            ...sale,
            desconto: discount,
            valor_pago: paidValue,
            total: total,
            desconto_percentual: percentualDiscount,
            forma_pagamento: paymentMethod
        })
    }

    return (
        <Box>
            {validateDiscount(discount, percentualDiscount) ? null : (
                <Alert status="error" marginTop={4}>
                    <AlertIcon/>
                    {percentualDiscount ? "O desconto percentual deve ser maior ou igual a 0 e menor ou igual a 30%" : "O desconto real deve ser maior ou igual a 0 e menor ou igual ao valor da compra"}
                </Alert>
            )}
            {validatePaidValue(paidValue) ? null : (
                <Alert status="error" marginTop={4}>
                    <AlertIcon/>
                    O valor pago + desconto deve ser menor ou igual ao valor total da compra
                </Alert>
            )}
            {(total - calculateDiscount() - paidValue) !== 0 ? null : (
                <Alert status="success" marginTop={4}>
                    <AlertIcon/>
                    Compra paga à vista, que delícia cara
                </Alert>
            )}
            <Select placeholder="Forma de pagamento" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                <option value="dinheiro">Dinheiro</option>
                <option value="cartao">Cartão</option>
                <option value="cheque">Cheque</option>
                <option value="crediario">Crediário</option>
            </Select>
            <Box marginTop={"10px"}>
                <Box display="flex" justifyContent="space-between">
                    <InputGroup mr={2} flex="1">
                        <InputLeftAddon bg={"pink.500"} color={"white"}>Valor pago </InputLeftAddon>
                        <Input type="number" value={paidValue} placeholder="Valor pago à vista" step="0.01" min="0" onChange={(e) => {
                            setPaidValue(parseFloat(e.target.value) || 0);
                        }} onBlur={(e) => {
                            e.target.value = parseFloat(e.target.value || "0").toFixed(2);
                        }}/>
                    </InputGroup>
                    <InputGroup mr={2} flex="1">
                        <InputLeftAddon bg={"pink.500"} color={"white"}>Desconto</InputLeftAddon>
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
                    </StatGroup>
                </Box>
                <Box display="flex" justifyContent="flex-end">
                    <Button colorScheme="pink" onClick={() => updateSale()} style={{marginTop: "10px"}}>Concluir venda</Button>
                </Box>
            </Box>
        </Box>
    );
}

export default PaymentSelectionCard;
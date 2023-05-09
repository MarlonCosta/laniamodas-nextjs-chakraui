import {Table, TableContainer, Tbody, Td, Th, Thead, Tr, VStack} from "@chakra-ui/react";
import React from "react";

export default function SalesPage() {
    return (
        <VStack>
            <TableContainer>
                <Table>
                    <Thead bg={"pink.400"}>
                        <Tr bg={"pink.400"} sx={{"&:hover": {background: "none", color: "inherit"}}}>
                            <Th key="codigo">Cód. Venda</Th>
                            <Th key="cliente">Cliente</Th>
                            <Th key="data">Data</Th>
                            <Th key="valor">Valor</Th>
                            <Th key="desconto">Desconto</Th>
                            <Th key="total">Total</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        <Tr>
                            <Td>1</Td>
                            <Td>Marlon</Td>
                            <Td>28/02/1993</Td>
                            <Td>R$ 100.00</Td>
                            <Td>15%</Td>
                            <Td>R$ 85.00</Td>
                        </Tr>
                    </Tbody>
                </Table>
            </TableContainer>
        </VStack>
    )
}
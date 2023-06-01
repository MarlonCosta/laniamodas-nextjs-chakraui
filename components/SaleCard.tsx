import {Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay} from "@chakra-ui/modal";
import React, {useState} from "react";
import {Database} from "@/lib/database.types";
import {Box, Select} from "@chakra-ui/react";
import CustomTable from "@/components/CustomTable";

type Client = Database['public']['Tables']['clientes']['Row'];
type Product = Database['public']['Tables']['produtos']['Row'];
type Sale = Database['public']['Tables']['vendas']['Row'];
type SaleUpdate = Database['public']['Tables']['vendas']['Update'];

interface SalesCardProps {
    isOpen: boolean;
    onClose: () => void;
    // initialRef: React.MutableRefObject<HTMLInputElement | null>;

}

type CartProduct = {
    descricao: string;
    quantidade: number;
    valor_unitario: number;
}

export default function SaleCard({isOpen, onClose}: SalesCardProps) {

    const [client, setClient] = useState<Client | null>(null);
    const [products, setProducts] = useState<Product[]>([
        {
            id: 1,
            codigo: '123',
            codigo_barras: '123456789',
            descricao: 'Camiseta',
            preco_venda: 10,
            preco_custo: 5,
            cor: 'Azul',
            tamanho: 'M',
            categoria: 'Camiseta',
            genero: 'M',
            marca: 'Nike',
            estoque: 10,
            data_cadastro: new Date().toDateString(),
        },
        {
            id: 2,
            codigo: '456',
            codigo_barras: '987654321',
            descricao: 'Calça',
            preco_venda: 20,
            preco_custo: 12,
            cor: 'Preto',
            tamanho: 'L',
            categoria: 'Calça',
            genero: 'F',
            marca: 'Adidas',
            estoque: 5,
            data_cadastro: new Date().toDateString(),
        },
        {
            id: 3,
            codigo: '789',
            codigo_barras: '246813579',
            descricao: 'Sapato',
            preco_venda: 50,
            preco_custo: 30,
            cor: 'Marrom',
            tamanho: '40',
            categoria: 'Sapato',
            genero: 'M',
            marca: 'Puma',
            estoque: 3,
            data_cadastro: new Date().toDateString(),
        }
    ]);


    function closeHandler() {

    }

    const columns = [
        {acessor: 'descricao', Header: 'Descrição'},
        {acessor: 'quantidade', Header: 'Quantidade'},
        {acessor: 'valor_unitario', Header: 'Valor Unitário'},
        {acessor: 'valor_total', Header: 'Valor Total'},
    ]

    const cartProducts = products.map((product) => {
            return {
                descricao: product.descricao,
                quantidade: 1,
                valor_unitario: product.preco_venda,
                valor_total: product.preco_venda,
            }
        }
    )

    console.log("CartProducts: ", cartProducts)

    return (
        <Modal isOpen={isOpen} onClose={closeHandler}>
            <ModalOverlay>
                <ModalContent>
                    <ModalHeader>Modal Title</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody w={"100%"}>

                        <Select>
                            <option>Cliente</option>
                        </Select>
                        <CustomTable columns={columns} data={cartProducts} onClickHandler={closeHandler}/>
                    </ModalBody>
                </ModalContent>
            </ModalOverlay>
        </Modal>
    )
}
import { Database } from "@/lib/database.types";
import { supabase } from "@/lib/supabase";
import { AddIcon, SearchIcon } from "@chakra-ui/icons";
import { Center, CircularProgress, Divider, HStack, Icon, Input, InputGroup, InputLeftElement, Modal, ModalContent, ModalOverlay, Select, Table, TableContainer, Tbody, Td, Th, Thead, Tr, VStack, useDisclosure } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { ProductCard } from "./ProductCard";
import { AddButton } from "./AddButton";

type Product = Database['public']['Tables']['produtos']['Row'];
type Client = Database['public']['Tables']['clientes']['Row'];

function ProductsSelectionCard({ isOpen, onClose, initialRef, products}) {
    const [searchTerm, setSearchTerm] = useState('');
    const [size, setSize] = useState('');
    const [color, setColor] = useState('');
    const [gender, setGender] = useState('');
    const [brand, setBrand] = useState('');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const [isLoading, setIsLoading] = useState(false);

    const uniqueBrands = () => {
        return products.reduce((brands: string[], product: Product) => {
            if (product.marca && !brands.includes(product.marca)) {
                brands.push(product.marca);
            }
            return brands;
        }, []);
    }



    const filteredProducts = products.filter((produto: Product) => {
        const regex = new RegExp(searchTerm, 'i');
        return (regex.test(produto.descricao) || regex.test(produto.codigo_barras)) && (size === '' || size === produto.tamanho) && (gender === '' || gender === produto.genero.toUpperCase()) && (brand === '' || brand === produto.marca) && (color === '' || color === produto.cor);
    });

    if (isLoading) {
        return (
            <Center verticalAlign="center" h="100vh">
                <CircularProgress isIndeterminate color="pink.400" />
            </Center>
        )
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} >
            <ModalOverlay>
            <ModalContent p={5} h="80vh" w="80vw" maxW={"100vw"} >
            <VStack>
            <HStack w={"100%"}>
                <InputGroup>
                    <InputLeftElement pointerEvents="none">
                        <Icon as={SearchIcon} color={"gray.300"}/>
                    </InputLeftElement>
                    <Input type="text" placeholder="Busca produtos por nome ou código de barras" value={searchTerm}
                           onChange={(event) => setSearchTerm(event.target.value)} focusBorderColor="pink.400"/>
                </InputGroup>
                <Input placeholder="Tamanho" value={size} onChange={(event) => setSize(event.target.value)} focusBorderColor="pink.400" maxWidth="100px"/>
                <Select placeholder="Cor" focusBorderColor="pink.400" maxWidth="100px" value={color} onChange={(event) => setColor(event.target.value)}>
                    <option value="Branco">Branco</option>
                    <option value="Preto">Preto</option>
                    <option value="Vermelho">Vermelho</option>
                    <option value="Azul">Azul</option>
                    <option value="Verde">Verde</option>
                    <option value="Amarelo">Amarelo</option>
                    <option value="Rosa">Rosa</option>
                    <option value="Laranja">Laranja</option>
                    <option value="Roxo">Roxo</option>
                    <option value="Marrom">Marrom</option>
                    <option value="Cinza">Cinza</option>
                    <option value="Bege">Bege</option>
                    <option value="Outra">Outra</option>
                </Select>
                <Select placeholder="Gênero" value={gender} onChange={(event) => setGender(event.target.value)} focusBorderColor="pink.400" maxWidth="100px">
                    <option value="MASCULINO">Masculino</option>
                    <option value="FEMININO">Feminino</option>
                    <option value="UNISSEX">Unissex</option>
                </Select>

                <Select placeholder="Marca" value={brand} onChange={(event) => setBrand(event.target.value)} focusBorderColor="pink.400" maxWidth="100px">
                    {uniqueBrands().map((marca: string) => (
                        <option key={marca} value={marca}>{marca}</option>
                    ))}
                </Select>
            </HStack>
            <Divider/>
            <TableContainer w={"100%"}>
                <Table w={"100%"}>
                    <Thead bg="pink.400">
                        <Tr bg={"pink.400"} sx={{"&:hover": {background: "none", color: "inherit"}}}>
                            <Th>Descrição</Th>
                            <Th>Preço</Th>
                            <Th>Estoque</Th>
                            <Th>Cor</Th>
                            <Th>Tamanho</Th>
                            <Th>Marca</Th>
                            <Th>Gênero</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {filteredProducts.map((produto: Product) => (
                            <Tr key={produto.id} onClick={() => {}} style={{cursor: "pointer"}}>
                                <Td>{produto.descricao}</Td>
                                <Td>R$ {produto.preco_venda.toFixed(2)}</Td>
                                <Td>{produto.estoque}</Td>
                                <Td>{produto.cor}</Td>
                                <Td>{produto.tamanho}</Td>
                                <Td>{produto.marca}</Td>
                                <Td>{produto.genero}</Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>
        </VStack>
        </ModalContent>
        </ModalOverlay>
        </Modal>
    )
}

export default ProductsSelectionCard;

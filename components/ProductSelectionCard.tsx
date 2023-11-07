import { Database } from "@/lib/database.types";
import { SearchIcon } from "@chakra-ui/icons";
import { Center, CircularProgress, Divider, HStack, Icon, Input, InputGroup, InputLeftElement, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Select, Table, TableContainer, Tbody, Td, Th, Thead, Tr, VStack } from "@chakra-ui/react";
import React, { useState } from "react";

type Product = Database['public']['Tables']['produtos']['Row'];

function ProductsSelectionCard({
    isOpen,
    onClose,
    initialRef,
    products,
    onClickHandler
}: { isOpen: boolean, onClose: () => void, initialRef: React.RefObject<HTMLInputElement>, products: Product[], onClickHandler: (product: Product) => void }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [size, setSize] = useState('');
    const [color, setColor] = useState('');
    const [gender, setGender] = useState('');
    const [brand, setBrand] = useState('');

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
                <CircularProgress isIndeterminate color="pink.500" />
            </Center>
        )
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay>
                <ModalContent p={5} h="80vh" w="80vw" maxW={"100vw"}>
                    <ModalHeader>Adicionar produto</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack>
                            <HStack w={"100%"}>
                                <InputGroup>
                                    <InputLeftElement pointerEvents="none">
                                        <Icon as={SearchIcon} color={"gray.300"} />
                                    </InputLeftElement>
                                    <Input type="text" placeholder="Busca produtos por nome ou código de barras" value={searchTerm}
                                        onChange={(event) => setSearchTerm(event.target.value)} focusBorderColor="pink.500" />
                                </InputGroup>
                                <Input placeholder="Tamanho" value={size} onChange={(event) => setSize(event.target.value)} focusBorderColor="pink.500" maxWidth="100px" />
                                <Select placeholder="Cor" focusBorderColor="pink.500" maxWidth="100px" value={color} onChange={(event) => setColor(event.target.value)}>
                                    {["Branco",
                                        "Preto",
                                        "Vermelho",
                                        "Azul",
                                        "Verde",
                                        "Amarelo",
                                        "Rosa",
                                        "Laranja",
                                        "Roxo",
                                        "Marrom",
                                        "Cinza",
                                        "Bege",
                                        "Outra"].map((colorOption) => (
                                            <option key={colorOption} value={colorOption}>{colorOption}</option>
                                        ))}
                                </Select>
                                <Select placeholder="Gênero" value={gender} onChange={(event) => setGender(event.target.value)} focusBorderColor="pink.500" maxWidth="100px">
                                    {["MASCULINO", "FEMININO", "UNISSEX"].map((genderOption) => (
                                        <option key={genderOption} value={genderOption}>{genderOption}</option>
                                    ))}
                                </Select>
                                <Select placeholder="Marca" value={brand} onChange={(event) => setBrand(event.target.value)} focusBorderColor="pink.500" maxWidth="100px">
                                    {uniqueBrands().map((marca: string) => (
                                        <option key={marca} value={marca}>{marca}</option>
                                    ))}
                                </Select>
                            </HStack>
                            <Divider />
                            <TableContainer w={"100%"}>
                                <Table w={"100%"}>
                                    <Thead bg="pink">
                                        <Tr bg={"pink"} sx={{ "&:hover": { background: "none", color: "inherit" } }}>
                                            {["Descrição", "Preço", "Estoque", "Cor", "Tamanho", "Marca", "Gênero"].map((header) => (
                                                <Th key={header}>{header}</Th>
                                            ))}
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {filteredProducts.map((produto: Product) => (
                                            <Tr key={produto.id} onClick={() => onClickHandler(produto)} style={{ cursor: "pointer" }}>
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
                    </ModalBody>
                </ModalContent>
            </ModalOverlay>
        </Modal>
    )

}

export default ProductsSelectionCard;

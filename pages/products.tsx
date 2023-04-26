import {Divider, HStack, Icon, Input, InputGroup, InputLeftElement, Select, Table, TableContainer, Tbody, Td, Th, Thead, Tr, useDisclosure, VStack} from "@chakra-ui/react";
import {AddIcon, SearchIcon} from "@chakra-ui/icons";
import {useRef, useState} from "react";
import {Database} from "@/lib/database.types";
import {AddButton} from "@/components/AddButton";
import {ProductCard} from "@/components/ProductCard";

type Product = Database['public']['Tables']['produtos']['Row'];

export default function ProductsPage() {
    const initialRef = useRef<HTMLInputElement>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [size, setSize] = useState('');
    const [gender, setGender] = useState('');
    const [brand, setBrand] = useState('');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [products, setProducts] = useState<Product[]>([
        {
            categoria: "Camisetas",
            codigo: "12345",
            codigo_barras: "7890123456789",
            cor: "Azul",
            data_cadastro: "2022-01-01",
            descricao: "Camiseta Azul Masculina",
            estoque: 10,
            genero: "Masculino",
            id: 1,
            preco_custo: 20,
            preco_venda: 40,
            tamanho: "M",
            marca: "Nike"
        },
        {
            categoria: "Calças",
            codigo: "67890",
            codigo_barras: "1234567890123",
            cor: "Preto",
            data_cadastro: "2022-01-02",
            descricao: "Calça Preta Feminina",
            estoque: 5,
            genero: "Feminino",
            id: 2,
            preco_custo: 30,
            preco_venda: 60,
            tamanho: "P",
            marca: "Adidas"
        },
        {
            categoria: "Sapatos",
            codigo: "24680",
            codigo_barras: "2345678901234",
            cor: "Marrom",
            data_cadastro: "2022-01-03",
            descricao: "Sapato Marrom Masculino",
            estoque: 8,
            genero: "Masculino",
            id: 3,
            preco_custo: 50,
            preco_venda: 100,
            tamanho: "42",
            marca: "Nike"
        }
    ]);

    const {isOpen, onOpen, onClose} = useDisclosure();
    const uniqueBrands = () => {
        return products.reduce((brands: string[], product) => {
            if (!brands.includes(product.marca)) {
                brands.push(product.marca);
            }
            return brands;
        }, []);
    }

    const filteredProducts = products.filter((produto) => {
        const regex = new RegExp(searchTerm, 'i');
        return (regex.test(produto.descricao) || regex.test(produto.codigo_barras)) && (size === '' || size === produto.tamanho) && (gender === '' || gender === produto.genero.toUpperCase()) && (brand === '' || brand === produto.marca);
    });

    const addProductHandler = () => {
        setSelectedProduct(null);
        onOpen();
    }

    return (
        <VStack>
            <HStack w={"100%"}>
                <InputGroup>
                    <InputLeftElement pointerEvents="none">
                        <Icon as={SearchIcon} color={"gray.300"}/>
                    </InputLeftElement>
                    <Input type="text" placeholder="Busca produtos por nome ou código de barras" value={searchTerm}
                           onChange={(event) => setSearchTerm(event.target.value)} focusBorderColor="pink.400"/>
                </InputGroup>
                <Select placeholder="Tamanho" value={size} onChange={(event) => setSize(event.target.value)} focusBorderColor="pink.400" maxWidth="200px">
                    <option value="PP">PP</option>
                    <option value="P">P</option>
                    <option value="M">M</option>
                    <option value="G">G</option>
                    <option value="GG">GG</option>
                </Select>

                <Select placeholder="Gênero" value={gender} onChange={(event) => setGender(event.target.value)} focusBorderColor="pink.400" maxWidth="200px">
                    <option value="MASCULINO">Masculino</option>
                    <option value="FEMININO">Feminino</option>
                </Select>

                <Select placeholder="Marca" value={brand} onChange={(event) => setBrand(event.target.value)} focusBorderColor="pink.400" maxWidth="200px">
                    {uniqueBrands().map((brand) => (
                        <option key={brand} value={brand}>{brand}</option>
                    ))}
                </Select>
            </HStack>
            <Divider/>
            <TableContainer w={"100%"}>
                <Table w={"100%"}>
                    <Thead bg="pink.400">
                        <Tr bg={"pink.400"} sx={{"&:hover": {background: "none", color: "inherit"}}}>
                            <Th>Descrição</Th>
                            <Th>Código de barras</Th>
                            <Th>Preço</Th>
                            <Th>Estoque</Th>
                            <Th>Cor</Th>
                            <Th>Tamanho</Th>
                            <Th>Marca</Th>
                            <Th>Gênero</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {filteredProducts.map((produto) => (
                            <Tr key={produto.id}>
                                <Td>{produto.descricao}</Td>
                                <Td>{produto.codigo_barras}</Td>
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
            <ProductCard isOpen={isOpen} onClose={onClose} product={selectedProduct} setProduct={setSelectedProduct} initialRef={initialRef}/>
            <AddButton label={"Adicionar produto"} icon={<AddIcon/>} handler={addProductHandler}/>
        </VStack>
    )
}
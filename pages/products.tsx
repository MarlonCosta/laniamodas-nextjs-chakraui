import {Center, CircularProgress, Divider, HStack, Icon, Input, InputGroup, InputLeftElement, Select, useDisclosure, VStack} from "@chakra-ui/react";
import {AddIcon, SearchIcon} from "@chakra-ui/icons";
import React, {useEffect, useRef, useState} from "react";
import {Database} from "@/lib/database.types";
import {AddButton} from "@/components/AddButton";
import {ProductCard} from "@/components/ProductCard";
import {supabase} from "@/lib/supabase";
import CustomTable from "@/components/CustomTable";
import {Column} from "react-table";

type Product = Database['public']['Tables']['produtos']['Row'];

export default function ProductsPage() {
    const initialRef = useRef<HTMLInputElement>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [size, setSize] = useState('');
    const [color, setColor] = useState('');
    const [gender, setGender] = useState('');
    const [brand, setBrand] = useState('');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [products, setProducts] = useState<Product[]>([]);

    const [isLoading, setIsLoading] = useState(false);
    const {isOpen, onOpen, onClose} = useDisclosure();

    const uniqueBrands = () => {
        return products.reduce((brands: string[], product) => {
            if (!brands.includes(product.marca)) {
                brands.push(product.marca);
            }
            return brands;
        }, []);
    }

    const getProducts = async () => {
        setIsLoading(true);
        try {
            let {data: products} = await supabase
                .from('produtos')
                .select('*');
            setProducts(products as Product[])
            setIsLoading(false);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getProducts().then(response => console.log(response));
    }, []);


    const filteredProducts = products.filter((produto) => {
        const regex = new RegExp(searchTerm, 'i');
        return (regex.test(produto.descricao) || regex.test(produto.codigo_barras)) && (size === '' || size === produto.tamanho) && (gender === '' || gender === produto.genero.toUpperCase()) && (brand === '' || brand === produto.marca) && (color === '' || color === produto.cor);
    });

    const openProductHandler = (product: Product) => {
        setSelectedProduct(product);
        onOpen();
    }
    const addProductHandler = () => {
        setSelectedProduct(null);
        onOpen();
    }

    if (isLoading) {
        return (
            <Center verticalAlign="center" h="100vh">
                <CircularProgress isIndeterminate color="pink.400"/>
            </Center>
        )
    }

    const headers = [
        {accessor: 'descricao', Header: 'Descrição'},
        {accessor: 'codigo_barras', Header: 'Código de Barras'},
        {accessor: 'preco_venda', Header: 'Preço'},
        {accessor: 'estoque', Header: 'Estoque'},
        {accessor: 'cor', Header: 'Cor'},
        {accessor: 'tamanho', Header: 'Tamanho'},
        {accessor: 'marca', Header: 'Marca'},
        {accessor: 'genero', Header: 'Gênero'},
    ];

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
                    {uniqueBrands().map((marca) => (
                        <option key={marca} value={marca}>{marca}</option>
                    ))}
                </Select>
            </HStack>
            <Divider/>
            <CustomTable columns={headers as Column[]} data={filteredProducts} onClickHandler={openProductHandler}/>
            <ProductCard isOpen={isOpen} onClose={onClose} product={selectedProduct} setProduct={setSelectedProduct} initialRef={initialRef}/>
            <AddButton label={"Adicionar produto"} icon={<AddIcon/>} handler={addProductHandler}/>
        </VStack>
    )
}
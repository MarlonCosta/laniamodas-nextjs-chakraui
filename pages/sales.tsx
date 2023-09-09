import {Center, CircularProgress, Divider, HStack, Icon, Input, InputGroup, InputLeftElement, Select, Table, TableContainer, Tbody, Td, Th, Thead, Tr, useDisclosure, VStack} from "@chakra-ui/react";
import {AddIcon, SearchIcon} from "@chakra-ui/icons";
import React, {useEffect, useRef, useState} from "react";
import {Database} from "@/lib/database.types";
import {AddButton} from "@/components/AddButton";
import {SaleCard} from "@/components/SaleCard";
import {supabase} from "@/lib/supabase";
import {RangeDatepicker} from "chakra-dayzed-datepicker";

type Sale = Database['public']['Tables']['vendas']['Row'];

export default function SalesPage() {
    const initialRef = useRef<HTMLInputElement>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDates, setSelectedDates] = useState<Date[]>([new Date(), new Date()]);
    const [paymentType, setPaymentType] = useState('');
    const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
    const [Sales, setSales] = useState<Sale[]>([]);

    const [isLoading, setIsLoading] = useState(false);
    const {isOpen, onOpen, onClose} = useDisclosure();

    const fetchSales = async () => {
        setIsLoading(true);
        try {
            let {data: Sales} = await supabase
                .from('vendas')
                .select('*');
            setSales(Sales as Sale[])
            setIsLoading(false);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchSales().then(response => console.log(response));
    }, []);


    const filteredSales = Sales.filter((sale) => {
    });

    const openSaleHandler = (Sale: Sale) => {
        setSelectedSale(Sale);
        onOpen();
    }
    const addSaleHandler = () => {
        setSelectedSale(null);
        onOpen();
    }

    if (isLoading) {
        return (
            <Center verticalAlign="center" h="100vh">
                <CircularProgress isIndeterminate color="pink.400"/>
            </Center>
        )
    }

    return (
        <VStack>
            <HStack w={"100%"}>
                <InputGroup>
                    <InputLeftElement pointerEvents="none">
                        <Icon as={SearchIcon} color={"gray.300"}/>
                    </InputLeftElement>
                    <Input type="text" placeholder="Nome do cliente" value={searchTerm}
                           onChange={(event) => setSearchTerm(event.target.value)} focusBorderColor="pink.400"/>
                </InputGroup>
                <Select placeholder="Tipo" value={paymentType} onChange={(event) => setPaymentType(event.target.value)} focusBorderColor="pink.400" maxWidth="100px">
                    <option value="VENDA">Venda</option>
                    <option value="PAGAMENTO">Pagamento</option>
                    <option value="MOVIMENTACAO">Movimentação</option>
                </Select>
                <RangeDatepicker selectedDates={selectedDates} onDateChange={setSelectedDates} configs={{
                dateFormat: 'dd/MM/yyyy',
                    dayNames: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
                    monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']}
                }/>
            </HStack>
            <Divider/>
            <TableContainer w={"100%"}>
                <Table w={"100%"}>
                    <Thead bg="pink.400">
                        <Tr bg={"pink.400"} sx={{"&:hover": {background: "none", color: "inherit"}}}>
                            <Th>Data</Th>
                            <Th>Cliente</Th>
                            <Th>Valor</Th>
                            <Th>Estoque</Th>
                            <Th>Cor</Th>
                            <Th>Tamanho</Th>
                            <Th>Marca</Th>
                            <Th>Gênero</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {filteredSales.map((sale) => (
                            <Tr key={sale.id} onClick={() => openSaleHandler(sale)}>


                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>
            <SaleCard isOpen={isOpen} onClose={onClose} sale={selectedSale!!} setSale={setSelectedSale} initialRef={initialRef}/>
            <AddButton label={"Adicionar produto"} icon={<AddIcon/>} handler={addSaleHandler}/>
        </VStack>
    )
}
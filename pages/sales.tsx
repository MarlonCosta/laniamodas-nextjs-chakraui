import {HStack, Input, InputGroup, InputLeftElement, useDisclosure, VStack} from "@chakra-ui/react";
import React, {useEffect, useState} from "react";
import {Database} from "@/lib/database.types";
import CustomTable from "@/components/CustomTable";
import {SearchIcon} from "@chakra-ui/icons";
import {supabase} from "@/lib/supabase";
import {Column} from "react-table";
import SaleCard from "@/components/SaleCard";

type Sale = Database['public']['Tables']['vendas']['Row'];

export default function SalesPage() {

    const [sales, setSales] = React.useState<Sale[]>([]);

    const [isLoading, setIsLoading] = useState(false);
    const {isOpen, onOpen, onClose} = useDisclosure();

    const getSales = async () => {
        setIsLoading(true);
        try {
            let {data: sales} = await supabase
                .from('vendas')
                .select('*');
            setSales(sales as Sale[])
        } catch (error) {
            console.error(error);
        }
        setIsLoading(false);
    }

    useEffect(() => {
        getSales().then(response => console.log(response));
    }, []);

    const headers = [
        {accessor: "codigo", Header: "Cód. Venda"},
        {accessor: "cliente", Header: "Cliente"},
        {accessor: "data", Header: "Data"},
        {accessor: "valor", Header: "Valor"},
        {accessor: "desconto", Header: "Desconto"},
        {accessor: "total", Header: "Total"},
    ]

    const data = [
        {codigo: 1, cliente: "João", data: "01/01/2021", valor: 100, desconto: 10, total: 90},
        {codigo: 2, cliente: "Maria", data: "02/01/2021", valor: 200, desconto: 20, total: 180},
        {codigo: 3, cliente: "José", data: "03/01/2021", valor: 300, desconto: 30, total: 270},
    ]

    const onSaleClick = () => {
        console.log("Sale clicked");
    }

    return (
        // <VStack>
        //     <HStack w={"100%"}>
        //         <InputGroup>
        //             <InputLeftElement pointerEvents={"none"}>
        //                 <SearchIcon color={"gray.300"}/>
        //             </InputLeftElement>
        //             <Input type="text" placeholder="Buscar por nome do cliente"/>
        //         </InputGroup>
        //     </HStack>
        //     <CustomTable columns={headers as Column[]} data={data} onClickHandler={onSaleClick}/>
        // </VStack>
        <SaleCard isOpen={true} onClose={() => {
        }}/>

    )
}
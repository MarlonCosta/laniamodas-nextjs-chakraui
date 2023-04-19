import React, {useEffect, useRef, useState} from 'react';
import {Box, Center, CircularProgress, Divider, Flex, Icon, IconButton, Input, InputGroup, InputLeftElement, Text, useDisclosure, VStack} from '@chakra-ui/react';
import {AddIcon, SearchIcon} from '@chakra-ui/icons';
import {Database} from '@/lib/database.types';
import {supabase} from '@/lib/supabase';
import {ClientCard} from '@/components/ClientCard';


type Client = Database['public']['Tables']['clientes']['Row'];

function ClientPage() {
    const initialRef = useRef<HTMLInputElement>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [clients, setClients] = useState<Client[]>([]);

    const {isOpen, onOpen, onClose} = useDisclosure();

    const fetchClients = async () => {
        setIsLoading(true);
        try {
            let {data: clients, error} = await supabase
                .from('clientes')
                .select('*')
            if (error) {
                console.error(error);
                return;
            }
            setClients(clients as Client[]);
            setIsLoading(false);
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        fetchClients().then(response => console.log(response));
    }, []);

    const openClientHandler = (client: Client) => {
        setSelectedClient(client);
        onOpen();
    }

    const addClientHandler = () => {
        setSelectedClient(null);
        onOpen();
    }

    const filteredClients = clients.filter((client) => {
        const regex = new RegExp(searchTerm, 'i');
        return regex.test(client.nome) || regex.test(client.sobrenome) || client.apelido?.match(regex);
    });

    const AddClientButton = () => {
        return (
            <IconButton aria-label="Add client"
                        icon={<AddIcon/>}
                        isRound={true}
                        position="fixed"
                        bottom="6"
                        right="6"
                        size="lg"
                        colorScheme="pink"
                        onClick={addClientHandler}/>
        )
    }

    if (isLoading) {
        return (
            <Center verticalAlign="center" h="100vh">
                <CircularProgress isIndeterminate color="pink.400"/>
            </Center>
        )
    }

    return (
        <VStack spacing="4" p="4">
            <InputGroup>
                <InputLeftElement pointerEvents="none">
                    <Icon as={SearchIcon} color="gray.300"/>
                </InputLeftElement>
                <Input type="text" placeholder="Busca clientes por nome, sobrenome ou apelido" value={searchTerm}
                       onChange={(e) => setSearchTerm(e.target.value)} focusBorderColor="pink.400"/>
            </InputGroup>
            <Divider/>
            <VStack w="100%">
                {filteredClients.map(client => (
                    <Box key={client.cpf} w="100%">
                        <Flex w="100%" p="2" borderRadius="md" bg="gray.100"
                              _hover={{bg: 'pink.400', color: 'white', cursor: 'pointer'}}
                              onClick={() => openClientHandler(client)}>
                            <Text fontSize="lg"
                                  fontWeight="bold">{`${client.nome} ${client.sobrenome}${client.apelido ? ` (${client.apelido})` : ''}`}</Text>
                        </Flex>
                    </Box>
                ))}
            </VStack>
            <ClientCard isOpen={isOpen} onClose={onClose} initialRef={initialRef} client={selectedClient} setClient={setSelectedClient}></ClientCard>
            <AddClientButton/>
        </VStack>
    );
}

export default ClientPage;
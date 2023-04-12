import {useEffect, useState} from 'react';
import {
    VStack,
    Text,
    Divider,
    Input,
    InputGroup,
    InputLeftElement,
    Icon,
    Modal,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalOverlay,
    Box,
    Flex,
    Button,
    GridItem,
    Grid,
    ModalFooter,
    CircularProgress,
    Center
} from '@chakra-ui/react';
import {SearchIcon} from '@chakra-ui/icons';
import {
    FaDollarSign,
    FaIdCard,
    FaInstagram,
    FaMapMarkerAlt,
    FaMoneyBill,
    FaPhone,
    FaShoppingCart
} from 'react-icons/fa';
import {Database} from '@/lib/database.types';
import {supabase} from '@/lib/supabase';


type Client = Database['public']['Tables']['clientes']['Row'];
type ClientInsert = Database['public']['Tables']['clientes']['Insert'];
type ClientUpdate = Database['public']['Tables']['clientes']['Update'];

// This is a sample data of clients. You can fetch data from your backend API.

interface ClientCardProps {
    client: Client | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (client: ClientUpdate) => void;
}

function ClientCard({client, isOpen, onClose, onSave}: ClientCardProps) {
    const [isEditing, setIsEditing] = useState(false);

    if (!client) {
        return null;
    }

    const handleToggleEdit = () => {
        setIsEditing((prevIsEditing) => !prevIsEditing);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="2xl">
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader bg="pink.400" color="white">
                    {client.nome} {client.sobrenome} ({client.apelido})
                </ModalHeader>
                <ModalCloseButton color='white'/>
                <ModalBody>
                    <VStack align="flex-start">
                        <Grid templateRows='repeat(4, 1fr)'
                              templateColumns='repeat(6, 1fr)' gap={2}>

                            <GridItem colSpan={2}>
                                <Text>Nome:</Text>
                                <Input defaultValue={client.nome} disabled={!isEditing} _disabled={{color: 'black'}}/>
                            </GridItem>

                            <GridItem colSpan={2}>
                                <Text>Sobrenome:</Text>
                                <Input defaultValue={client.sobrenome} disabled={!isEditing}
                                       _disabled={{color: 'black'}}/>
                            </GridItem>

                            <GridItem colSpan={2}>
                                <Text>Apelido:</Text>
                                <Input defaultValue={client.apelido ?? ""} disabled={!isEditing}
                                       _disabled={{color: 'black'}}/>
                            </GridItem>

                            <GridItem colSpan={2}>
                                <Text>CPF:</Text>
                                <InputGroup>
                                    <InputLeftElement pointerEvents='none'><FaIdCard
                                        color='#ED64A6'/></InputLeftElement>
                                    <Input defaultValue={client.cpf} disabled={!isEditing}
                                           _disabled={{color: 'black'}}/>
                                </InputGroup>
                            </GridItem>

                            <GridItem colSpan={2}>
                                <Text>Telefone:</Text>
                                <InputGroup>
                                    <InputLeftElement pointerEvents='none'>
                                        <FaPhone color='#ED64A6'/></InputLeftElement>
                                    <Input defaultValue={client.telefone} disabled={!isEditing} _disabled={{color: 'black'}}/>
                                </InputGroup>
                            </GridItem>

                            <GridItem colSpan={2}>
                                <Text>Instagram:</Text>
                                <InputGroup>
                                    <InputLeftElement pointerEvents='none'><FaInstagram
                                        color='#ED64A6'/></InputLeftElement>

                                    <Input defaultValue={client.instagram ?? ""} disabled={!isEditing}
                                           _disabled={{color: 'black'}}/>
                                </InputGroup>
                            </GridItem>

                            <GridItem colSpan={4}>
                                <Text>Endereço:</Text>
                                <InputGroup>
                                    <InputLeftElement pointerEvents='none'
                                    ><FaMapMarkerAlt color='#ED64A6'/></InputLeftElement>
                                    <Input defaultValue={client.endereco} disabled={!isEditing}
                                           _disabled={{color: 'black'}}/>
                                </InputGroup>
                            </GridItem>

                            <GridItem colSpan={2}>
                                <Text>Número:</Text>
                                <Input defaultValue={client.numero_endereco} disabled={!isEditing}
                                       _disabled={{color: 'black'}}/>
                            </GridItem>

                            <GridItem colSpan={2}>
                                <Text>Saldo Devedor:</Text>
                                <InputGroup>
                                    <InputLeftElement pointerEvents='none'><FaDollarSign
                                        color='#ED64A6'/></InputLeftElement>
                                    <Input defaultValue={'R$ ' + client.saldo_devedor.toFixed(2) ?? ""} disabled={true}
                                           _disabled={{color: 'black'}}/>
                                </InputGroup>
                            </GridItem>

                            <GridItem colSpan={2}>
                                <Text>Última Compra:</Text>
                                <InputGroup>
                                    <InputLeftElement pointerEvents='none'
                                    ><FaShoppingCart color='#ED64A6'/></InputLeftElement>
                                    <Input defaultValue={client.ultima_compra ?? ""} disabled={true}
                                           _disabled={{color: 'black'}}/>
                                </InputGroup>
                            </GridItem>

                            <GridItem colSpan={2}>
                                <Text>Último Pagamento:</Text>
                                <InputGroup>
                                    <InputLeftElement pointerEvents='none'><FaMoneyBill
                                        color='#ED64A6'/></InputLeftElement>
                                    <Input defaultValue={client.ultimo_pagamento ?? ""} disabled={true}
                                           _disabled={{color: 'black'}}/>
                                </InputGroup>
                            </GridItem>
                        </Grid>
                    </VStack>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={handleToggleEdit}
                            _hover={{bg: isEditing ? 'red.500' : 'pink.400', color: 'white'}}>
                        {isEditing ? 'Cancelar' : 'Editar'}
                    </Button>
                    {isEditing && (
                        <Button ml={3} colorScheme="green" onClick={() => onSave(client)}>
                            Salvar
                        </Button>
                    )}
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

function ClientPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [isClientCardOpen, setIsClientCardOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [clients, setClients] = useState<Client[]>([]);

    useEffect(() => {
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
        fetchClients().then(response => console.log(response));
    }, []);

    const handleSaveClick = async (client: ClientUpdate) => {
        console.log("Saving client: " + client.nome)
        const {data: updatedClient, error} = await supabase
            .from("clientes")
            .update(
                {
                    nome: client.nome,
                    sobrenome: client.sobrenome,
                    apelido: client.apelido,
                    cpf: client.cpf,
                    telefone: client.telefone,
                    instagram: client.instagram,
                    endereco: client.endereco,
                    numero_endereco: client.numero_endereco,
                }
            )
            .eq("id", client.id);

        if (error) {
            console.error(error);
            return;
        }

        console.log(updatedClient);
    };


    const onClientCardOpen = (client: Client) => {
        setSelectedClient(client);
        setIsClientCardOpen(true);
    };

    const onClientCardClose = () => {
        setIsClientCardOpen(false);
    };

    const filteredClients = clients.filter((client) => {
        const regex = new RegExp(searchTerm, 'i');
        return regex.test(client.nome) || regex.test(client.sobrenome) || client.apelido?.match(regex);
    });

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
                              onClick={() => onClientCardOpen(client)}>
                            <Text fontSize="lg"
                                  fontWeight="bold">{`${client.nome} ${client.sobrenome}${client.apelido ?? ''}`}</Text>
                        </Flex>
                    </Box>
                ))}
            </VStack>
            <ClientCard isOpen={isClientCardOpen} onClose={onClientCardClose} client={selectedClient} onSave={handleSaveClick}/>
        </VStack>
    );
}

export default ClientPage;
import React, {useEffect, useState} from "react";
import {supabase} from "@/lib/supabase";
import {Database} from "@/lib/database.types";
import {Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay} from "@chakra-ui/modal";
import {Alert, AlertIcon, Button, ButtonGroup, FormControl, FormLabel, Input, Text} from "@chakra-ui/react";

type Client = Database['public']['Tables']['clientes']['Row'];
type ClientInsert = Database['public']['Tables']['clientes']['Insert'];
type ClientUpdate = Database['public']['Tables']['clientes']['Update'];

interface ClientCardProps {
    client: Client | null;
    isOpen: boolean;
    onClose: () => void;
    initialRef: React.RefObject<HTMLInputElement>;
    setClient: (client: Client | null) => void;
}

export const ClientCard = ({isOpen, onClose, initialRef, client, setClient}: ClientCardProps) => {
    const [nome, setNome] = useState(client?.nome);
    const [sobrenome, setSobrenome] = useState(client?.sobrenome);
    const [apelido, setApelido] = useState(client?.apelido);
    const [cpf, setCpf] = useState(client?.cpf);
    const [telefone, setTelefone] = useState(client?.telefone);
    const [instagram, setInstagram] = useState(client?.instagram);
    const [endereco, setEndereco] = useState(client?.endereco);
    const [numero_endereco, setNumero_endereco] = useState(client?.numero_endereco);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (client) {
            setNome(client.nome);
            setSobrenome(client.sobrenome);
            setApelido(client.apelido ?? '');
            setCpf(client.cpf);
            setTelefone(client.telefone);
            setInstagram(client.instagram ?? '');
            setEndereco(client.endereco);
            setNumero_endereco(client.numero_endereco);
        }
    }, [client]);

    const submitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        setErrorMessage("");
        let supabaseError;
        let updatedClient;

        if (client) {
            const {data: clientReturn, error} = await supabase
                .from("clientes")
                .update(
                    {
                        nome: nome,
                        sobrenome: sobrenome,
                        apelido: apelido,
                        cpf: cpf,
                        telefone: telefone,
                        instagram: instagram,
                        endereco: endereco,
                        numero_endereco: numero_endereco,
                    } as ClientUpdate)
                .eq("id", client.id);
            supabaseError = error
            updatedClient = clientReturn;
        } else {
            const {data: newClient, error} = await supabase
                .from("clientes")
                .insert(
                    {
                        nome: nome,
                        sobrenome: sobrenome,
                        apelido: apelido,
                        cpf: cpf,
                        telefone: telefone,
                        instagram: instagram,
                        endereco: endereco,
                        numero_endereco: numero_endereco,
                    } as ClientInsert);
            supabaseError = error;
            updatedClient = newClient;
        }
        setIsLoading(false)

        if (supabaseError) {
            setErrorMessage(supabaseError.message);
        } else {
            closeHandler();
        }
    }

    const closeHandler = () => {
        setNome("");
        setSobrenome("");
        setApelido("");
        setCpf("");
        setTelefone("");
        setInstagram("");
        setEndereco("");
        setNumero_endereco(-1);
        setClient(null);
        window.location.reload();
        onClose();
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={closeHandler}
            initialFocusRef={initialRef}
            isCentered>
            <ModalOverlay>
                <ModalContent>
                    <form onSubmit={submitHandler}>
                        <ModalHeader bg={"pink.400"} color={"white"}>{client ? `${client.nome} ${client.sobrenome} ${client.apelido ? ` (${client.apelido})` : ""}` : "Criar cliente"}</ModalHeader>
                        <ModalCloseButton onClick={closeHandler} color={"white"}/>
                        <ModalBody pb={6}>
                            {errorMessage && (
                                <Alert status="error" borderRadius="lg" mb="6">
                                    <AlertIcon/>
                                    <Text textAlign="center">{errorMessage}</Text>
                                </Alert>
                            )}
                            <FormControl isRequired={true}>
                                <FormLabel>Nome</FormLabel>
                                <Input
                                    ref={initialRef}
                                    placeholder="Nome"
                                    value={nome}
                                    onChange={(event) => setNome(event.target.value)}/>
                            </FormControl>

                            <FormControl isRequired={true}>
                                <FormLabel>Sobrenome</FormLabel>
                                <Input
                                    placeholder="Sobrenome"
                                    value={sobrenome}
                                    onChange={(event) => setSobrenome(event.target.value)}/>
                            </FormControl>

                            <FormControl>
                                <FormLabel>Apelido</FormLabel>
                                <Input
                                    placeholder="Apelido"
                                    value={apelido ?? ''}
                                    onChange={(event) => setApelido(event.target.value)}/>
                            </FormControl>

                            <FormControl>
                                <FormLabel>CPF</FormLabel>
                                <Input
                                    placeholder="CPF"
                                    value={cpf}
                                    onChange={(event) => setCpf(event.target.value)}/>
                            </FormControl>

                            <FormControl isRequired={true}>
                                <FormLabel>Telefone</FormLabel>
                                <Input
                                    placeholder="Telefone"
                                    value={telefone}
                                    onChange={(event) => setTelefone(event.target.value)}/>
                            </FormControl>

                            <FormControl>
                                <FormLabel>Instagram</FormLabel>
                                <Input
                                    placeholder="Instagram"
                                    value={instagram ?? ''}
                                    onChange={(event) => setInstagram(event.target.value)}/>
                            </FormControl>

                            <FormControl isRequired={true}>
                                <FormLabel>Endereço</FormLabel>
                                <Input
                                    placeholder="Endereço"
                                    value={endereco}
                                    onChange={(event) => setEndereco(event.target.value)}/>
                            </FormControl>

                            <FormControl isRequired={true}>
                                <FormLabel>Número</FormLabel>
                                <Input
                                    placeholder="00"
                                    value={numero_endereco}
                                    onChange={(event) => setNumero_endereco(parseInt(event.target.value))}/>
                            </FormControl>
                        </ModalBody>

                        <ModalFooter>
                            <ButtonGroup spacing={3}>
                                <Button
                                    onClick={closeHandler}
                                    colorScheme="red"
                                    type="reset"
                                    isDisabled={isLoading}>
                                    Cancelar
                                </Button>
                                <Button
                                    colorScheme="blue"
                                    type="submit"
                                    isLoading={isLoading}>
                                    {client ? "Atualizar" : "Criar"}
                                </Button>
                            </ButtonGroup>
                        </ModalFooter>
                    </form>
                </ModalContent>
            </ModalOverlay>
        </Modal>
    );

}
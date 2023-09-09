import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Database } from "@/lib/database.types";
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/modal";
import {Alert, AlertIcon, Button, ButtonGroup, FormControl, FormLabel, Grid, GridItem, Input, InputGroup, InputLeftElement, Select, Switch, Text} from "@chakra-ui/react";
import InputMask from "react-input-mask";
import { FaIdCard, FaInstagram, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";

type Sale = Database["public"]["Tables"]["vendas"]["Row"];
type SaleUpdate = Database["public"]["Tables"]["vendas"]["Update"];
type SaleInsert = Database["public"]["Tables"]["vendas"]["Insert"];

interface SaleCardProps {
    sale: Sale | null;
    isOpen: boolean;
    onClose: () => void;
    initialRef: React.RefObject<HTMLInputElement>;
    setSale: (client: Sale | null) => void;
}

export const SaleCard = ({ isOpen, onClose, initialRef, sale, setSale }: SaleCardProps) => {
    const [descricao, setDescricao] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (sale) {
            setDescricao(sale.descricao);
            setCodigo_barras(sale.codigo_barras);
            setCor(sale.cor!);
            setCategoria(sale.categoria);
            setEstoque(sale.estoque);
            setGenero(sale.genero);
            setPreco_custo(sale.preco_custo);
            setPreco_venda(sale.preco_venda);
            setTamanho(sale.tamanho);
            setMarca(sale.marca);
        }
    }, [sale]);

    const submitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        setErrorMessage("");
        let supabaseError;

        if (sale) {
            const { error } = await supabase
              .from("vendas")
              .update({
                descricao: descricao,
                codigo_barras: codigo_barras,
                preco_venda: preco_venda,
                preco_custo: preco_custo,
                estoque: estoque,
                marca: marca,
                categoria: categoria,
                tamanho: tamanho,
                genero: genero,
                cor: cor
              } as SaleUpdate)
              .eq("id", sale.id);
            supabaseError = error;
          } else {
            const { error } = await supabase
              .from("vendas")
              .insert({


              } as SaleInsert);
            supabaseError = error;
          }
        setIsLoading(false)

        if (supabaseError) {
            setErrorMessage(supabaseError.message);
        } else {
            closeHandler();
        }
    }

    const closeHandler = () => {
        setDescricao("");
        setCodigo_barras("");
        setCor("");
        setCategoria("");
        setEstoque(0);
        setGenero("");
        setPreco_custo(0);
        setPreco_venda(0);
        setTamanho("");
        setMarca("");

        setSale(null);
        setIsEditing(false);
        window.location.reload();
        onClose();
    }

    const handleDeleteSale = async () => {
        if (sale) {
            const { error } = await supabase
                .from("produtos")
                .delete()
                .eq("id", sale.id);
            if (error) {
                setErrorMessage(error.message);
            } else {
                closeHandler();
            }
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={closeHandler}
            initialFocusRef={initialRef}
            isCentered
            size={"4xl"}>
            <ModalOverlay>
                <ModalContent>
                    <form onSubmit={submitHandler}>
                        <ModalHeader bg={"pink.400"} color={"white"}>{sale ? `${sale.descricao}` : "Criar cliente"}</ModalHeader>
                        <ModalCloseButton onClick={closeHandler} color={"white"} />
                        <ModalBody pb={6}>

                            {errorMessage && (
                                <Alert status="error" borderRadius="lg" mb="6">
                                    <AlertIcon />
                                    <Text textAlign="center">{errorMessage}</Text>
                                </Alert>
                            )}
                            <Grid templateRows='repeat(4, 1fr)'
                                templateColumns='repeat(12, 1fr)'
                                gap={1}>
                                <GridItem colSpan={12}>
                                    <FormControl isRequired={true}>
                                        <FormLabel>Descrição</FormLabel>
                                        <Input disabled={!isEditing}
                                            ref={initialRef}
                                            placeholder="Descrição"
                                            value={descricao}
                                            onChange={(event) => setDescricao(event.target.value)}
                                            bg={"yellow.100"}
                                            _disabled={{ bg: "white", caretColor: "black" }}
                                        />
                                    </FormControl>

                                </GridItem>
                                <GridItem colSpan={6}>
                                    <FormControl isRequired={true}>
                                        <FormLabel>Código de barras</FormLabel>
                                        <Input disabled={!isEditing}
                                               placeholder="Código de barras"
                                               value={codigo_barras}
                                               onChange={(event) => setCodigo_barras(event.target.value)}
                                               bg={"yellow.100"}
                                               _disabled={{ bg: "white", caretColor: "black" }}
                                        />
                                    </FormControl>
                                </GridItem>
                                <GridItem colSpan={6}>
                                    <FormControl isRequired={true}>
                                        <FormLabel>Marca</FormLabel>
                                        <Input disabled={!isEditing}
                                            placeholder="Marca"
                                            value={marca}
                                            onChange={(event) => setMarca(event.target.value)}
                                            bg={"yellow.100"}
                                            _disabled={{ bg: "white", caretColor: "black" }}
                                        />
                                    </FormControl>
                                </GridItem>
                                <GridItem colSpan={3}>
                                    <FormControl isRequired={true}>
                                        <FormLabel>Categoria</FormLabel>
                                        <Select
                                            disabled={!isEditing}
                                            placeholder="Categoria"
                                            value={categoria}
                                            onChange={(event) => setCategoria(event.target.value)}
                                            bg={"yellow.100"}
                                            _disabled={{ bg: "white", caretColor: "black" }}
                                        >
                                            <option value="Camiseta">Camiseta</option>
                                            <option value="Calça">Calça</option>
                                            <option value="Short">Short</option>
                                            <option value="Vestido">Vestido</option>
                                            <option value="Blusa">Blusa</option>
                                            <option value="Jaqueta">Jaqueta</option>
                                            <option value="Casaco">Casaco</option>
                                            <option value="Peça Íntima">Peça Íntima</option>
                                            <option value="Vestido">Vestido</option>
                                            <option value="Saia">Saia</option>
                                        </Select>
                                    </FormControl>
                                </GridItem>

                                <GridItem colSpan={3}>
                                    <FormControl isRequired={true}>
                                        <FormLabel>Cor</FormLabel>
                                        <Select
                                            disabled={!isEditing}
                                            placeholder="Cor"
                                            value={cor ?? "Outras"}
                                            onChange={(event) => setCor(event.target.value)}
                                            bg={"yellow.100"}
                                            _disabled={{ bg: "white", caretColor: "black" }}
                                        >
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
                                    </FormControl>
                                </GridItem>
                                <GridItem colSpan={3}>
                                    <FormControl isRequired={true}>
                                        <FormLabel>Tamanho</FormLabel>
                                        <Input disabled={!isEditing}
                                            placeholder="Tamanho"
                                            value={tamanho}
                                            onChange={(event) => setTamanho(event.target.value)}
                                            bg={"yellow.100"}
                                            _disabled={{ bg: "white", caretColor: "black" }}
                                        />
                                    </FormControl>
                                </GridItem>
                                <GridItem colSpan={3}>
                                    <FormControl isRequired={true}>
                                        <FormLabel>Gênero</FormLabel>
                                        <Select
                                            disabled={!isEditing}
                                            placeholder="Gênero"
                                            value={genero}
                                            onChange={(event) => setGenero(event.target.value)}
                                            bg={"yellow.100"}
                                            _disabled={{ bg: "white", caretColor: "black" }}
                                        >
                                            <option value="Masculino">Masculino</option>
                                            <option value="Feminino">Feminino</option>
                                            <option value="Unissex">Unissex</option>
                                        </Select>
                                    </FormControl>
                                </GridItem>
                                <GridItem colSpan={3}>
                                    <FormControl isRequired={true}>
                                        <FormLabel>Preço de venda</FormLabel>
                                        <Input disabled={!isEditing}
                                            placeholder="Preço de venda"
                                            value={preco_venda}
                                            onChange={(event) => setPreco_venda(Number(event.target.value))}
                                            bg={"yellow.100"}
                                            _disabled={{ bg: "white", caretColor: "black" }}
                                        />
                                    </FormControl>
                                </GridItem>
                                <GridItem colSpan={3}>
                                    <FormControl isRequired={true}>
                                        <FormLabel>Preço de custo</FormLabel>
                                        <Input disabled={!isEditing}
                                               placeholder="Preço de custo"
                                               value={preco_custo}
                                               onChange={(event) => setPreco_custo(Number(event.target.value))}
                                               bg={"yellow.100"}
                                               _disabled={{ bg: "white", caretColor: "black" }}
                                        />
                                    </FormControl>
                                </GridItem>
                                <GridItem colSpan={2}>
                                    <FormControl isRequired={true}>
                                        <FormLabel>Estoque</FormLabel>
                                        <Input disabled={!isEditing}
                                            placeholder="Estoque"
                                            value={estoque}
                                            onChange={(event) => setEstoque(Number(event.target.value))}
                                            bg={"yellow.100"}
                                            _disabled={{ bg: "white", caretColor: "black" }}
                                        />
                                    </FormControl>
                                </GridItem>
                            </Grid>

                        </ModalBody>

                        <ModalFooter>
                            <ButtonGroup spacing={3} display={"flex"} alignItems={"center"}>
                                <Switch
                                    onChange={() => setIsEditing(!isEditing)}
                                    isChecked={isEditing}>
                                    Editar
                                </Switch>
                                <Button
                                    onClick={handleDeleteSale}
                                    colorScheme="red"
                                    type="button"
                                    isDisabled={!isEditing}>
                                    Excluir
                                </Button>
                                <Button
                                    isDisabled={!isEditing}
                                    colorScheme="blue"
                                    type="submit"
                                    isLoading={isLoading}>
                                    {sale ? "Atualizar" : "Criar"}
                                </Button>
                            </ButtonGroup>
                        </ModalFooter>
                    </form>
                </ModalContent>
            </ModalOverlay>
        </Modal>
    );
}
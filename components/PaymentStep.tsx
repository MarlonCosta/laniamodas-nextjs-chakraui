import { Box, Select } from "@chakra-ui/react";
import React from "react";

function PaymentStep() {
    return (
        <Box>
            <Select placeholder="Forma de pagamento">
                <option value="dinheiro">Dinheiro</option>
                <option value="cartao">Cartão</option>
                <option value="cheque">Cheque</option>
                <option value="crediario">Crediário</option>
            </Select>
        </Box>
    );
}

export default PaymentStep;
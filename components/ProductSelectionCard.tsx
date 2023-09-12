import ProductsPage from "@/pages/products";
import { Modal } from "@chakra-ui/react";
import React from "react";

const ProductModal = ({ isOpen, onClose}) => (
    <Modal isOpen={isOpen} onClose={onClose}>
        <ProductsPage />
    </Modal>
)

export default ProductModal;

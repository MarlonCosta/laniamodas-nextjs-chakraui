import {extendTheme} from "@chakra-ui/react";

const theme = extendTheme({
    components: {
        Input: {
            baseStyle: {
                _disabled: {
                    color: "black"
                }
            }
        },
        Button: {
            variants: {
                solid: {
                    _hover: {
                        bg: "pink.400",
                        color: "white",
                    }
                }
            }
        },
        Table: {
            variants: {
                simple: {
                    th: {
                        color: "white",
                    },
                    tr: {
                        bg: "white",
                        _hover: {
                            bg: "gray.400",
                            color: "white"
                        }
                    }
                }
            }
        }
    },
});

export default theme;
import {extendTheme} from "@chakra-ui/react";


const theme = extendTheme({
    components: {
        Input: {
            baseStyle: {
                _disabled: {
                    color: "black",
                },
            },
        },
        Button: {
            variants: {
                solid: {
                    _hover: {
                        bg: "pink.400",
                        color: "white",
                    },
                },
            },
        },
        Table: {
            variants: {
                simple: {
                    th: {
                        color: "white",
                        bg: "pink.500"
                    },
                    tr: {
                        bg: "white",
                        _hover: {
                            bg: "gray.400",
                            color: "white",
                        },
                    },
                },
            },
        },
        Stepper: {
            baseStyle: {
              step: {
                padding: "20px",
                backgroundColor: "white",
                borderRadius: "10px",
                borderWidth: "2px",
                borderColor: "gray.300",
                margin: "10px",
              },
              title: {
                fontWeight: "bold",
                fontSize: "lg",
              },
              description: {
                color: "gray.500",
              },
              indicator: {
                color: "pink.400",
                borderColor: "pink.400",
              },
            },
          },
    },
});



export default theme;
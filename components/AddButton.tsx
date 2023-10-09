import {IconButton} from "@chakra-ui/react";
import React from "react";

export function AddButton(props: { label: string, icon: any, handler: () => void }) {
    return (
        <IconButton aria-label={props.label}
                    icon={props.icon}
                    isRound={true}
                    position="fixed"
                    bottom="6"
                    right="6"
                    size="lg"
                    colorScheme="pink"
                    onClick={props.handler}/>
    )
}
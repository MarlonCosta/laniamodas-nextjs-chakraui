import React from "react";
import {Box, Stack} from "@chakra-ui/react";
import {
    Step,
    StepDescription,
    StepIcon,
    StepIndicator,
    StepNumber,
    StepSeparator,
    StepStatus,
    StepTitle,
    Stepper,
    useSteps,
} from '@chakra-ui/stepper'

const steps = [
    {title: 'Cliente', description: 'Selecione um cliente'},
    {title: 'Produtos', description: 'Selecione os produtos'},
    {title: 'Pagamento', description: 'Selecione a forma de pagamento'},
]


function NewSalePage() {
    const { activeStep, setActiveStep } = useSteps({
        index: 1,
        count: steps.length,
    })
    return (
        <Stepper index={activeStep} orientation='vertical' height='400px' gap='0'>
            {steps.map((step, index) => (
                <Step key={index}>
                    <StepIndicator>
                        <StepStatus
                            complete={<StepIcon/>}
                            incomplete={<StepNumber/>}
                            active={<StepNumber/>}
                        />
                    </StepIndicator>

                    <Box flexShrink='0'>
                        <StepTitle>{step.title}</StepTitle>
                        <StepDescription>{step.description}</StepDescription>
                    </Box>
                    <StepSeparator/>
                </Step>
            ))}
        </Stepper>
    )
}

export default NewSalePage;
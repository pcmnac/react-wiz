import React, { Component } from 'react';

function onValueChange(setStepState, field, validator, event) {
    setStepState({ [field]: event.target.value }, validator);
}

function onCheckChange(setStepState, field, validator, event) {
    setStepState({ [field]: event.target.checked }, validator);
}

function setField (setStepState, field, value, validator) {
    setStepState({ [field]: value }, validator);
}

class WizardContent extends Component {

    constructor(props) {
        super(props);
    }

    handleValidationChange = (step, status) => {
        this.props.onValidateStep(step, status);
    }

    handleStateChange(step, state, validator) {
        this.props.onStepStateChange(step, state, validator);
    }

    render() {

        let { 
            steps, 
            current, 
            setStepActiveStatus, 
            getStepState,
            isStepActive,
            renderContainer,
            renderStep,
        } = this.props;

        return renderContainer(steps.map( (step, i) => {

            let stateChangeHandler = this.handleStateChange.bind(this, i);
            let validationChangeHandler = this.handleValidationChange.bind(this, i);

            return renderStep(
                step, 
                i, 
                current,
                setStepActiveStatus,
                isStepActive,
                {
                    setState: stateChangeHandler,
                    validate: validationChangeHandler,
                    onValueChange: (field, validator) => onValueChange.bind(null, stateChangeHandler, field, validator),
                    onCheckChange: (field, validator) => onCheckChange.bind(null, stateChangeHandler, field, validator),
                    onSet: (field, value, validator) => setField.bind(null, stateChangeHandler, field, value, validator),
                    getStepState,
                },
            )
        }));

    }

}

export default WizardContent;
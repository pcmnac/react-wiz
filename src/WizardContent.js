import React, { Component } from 'react';

class WizardContent extends Component {

    constructor(props) {
        super(props);
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

            return renderStep(
                step, 
                i, 
                current,
                setStepActiveStatus,
                isStepActive,
                getStepState,
            )
        }));
    }
}

export default WizardContent;
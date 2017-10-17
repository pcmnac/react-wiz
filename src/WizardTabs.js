import React, { Component } from 'react';

class WizardTabs extends Component {

    constructor(props) {
        super(props);
    }

    handleStepChange(step) {
        let { 
            onStepChange = (step) => { console.log("step changed: ", step) },
            current,
        } = this.props;
        
        if (current != step) {
            onStepChange(step);
        }
    }

    render() {

        let { 
            steps = [], 
            current, 
            customNumbers = false,
            hideNumbers = false,
            renderContainer,
            renderTab
        } = this.props;

        let tabNumber = 1;

        return renderContainer(steps.map((step, i) => {
            let clickHandler = step.navigable ? this.handleStepChange.bind(this, i) : null;
            let numberedStep = {
                ...step, 
                number: customNumbers ? step.number : (step.active ? tabNumber++ : 0),
            };
            return renderTab(numberedStep, i, current == i, hideNumbers, clickHandler);
        }));
    }

}

export default WizardTabs;
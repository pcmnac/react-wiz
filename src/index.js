import React, { Component } from 'react';
import Tabs from './WizardTabs';
import Content from './WizardContent';
import Nav from './WizardNavigation';
import * as defaultRenderer from './defaultRenderer';
import _ from 'lodash';

const stepKeyPattern = /(step_)(\d)+/;

function steps2array(state) {
    
    let steps = _.map(state, (val, key) => stepKeyPattern.test(key) ? {key, val} : null)
        .filter(i => i != null);
    steps.sort((a, b) => a.key - b.key);

    steps = steps.map(i => i.val);

    return steps;
}

function getStepState(stepsArray) {
    return stepsArray.reduce((curr, { label, state }, i) => {
        let result = {
            ...curr,
            [i]: state,
        };

        if (label) {
            result = {...result, [label]: state };
        }

        return result;
    }, {});
}

function exportState(state) {
    return getStepState(steps2array(state));
}

function getValidationState(valid) {
    if (typeof(valid) === 'function') {
        valid = valid();
    }

    return valid;
}

function withoutValidationErrors(valid) {
    if (typeof(valid) === 'object') {
        valid = _.map(valid, () => 1).length === 0;
    }

    return valid;
}


class Wizard extends Component {

    constructor(props) {
        super(props);

        const { 
            start = 0, 
            steps = [], 
            renderer = defaultRenderer 
        } = props;

        this.renderer = renderer;

        this.labelsMap = steps.reduce((curr, step, i) => {
            const { label = ("" + i)} = step;
            return {
                ...curr,
                [label]: i,
            };
        }, {});

        const stepsState = steps.reduce((state, step, idx) => {
            return {
                ...state,
                [`step_${idx}`]: {
                    ...step, 
                    active: step.active ? step.active : true,
                    valid: step.valid,
                    touched: idx === start,
                    submitted: false,
                }
            }
        }, {});

        const initialState = {
            current: parseInt(start),
            ...stepsState,
        };

        this.state = initialState;
    }

    getStepIndex = label => {
        if (typeof(label) === "string")
            return this.labelsMap[label];

        return label;
    }

    handleStepChange = stepIndex => {
        const stepKey = `step_${stepIndex}`;
        
        this.setState( prevState => {
            const prevStepKey = `step_${prevState.current}`;
            return {
                current: stepIndex,
                [prevStepKey]: { ...prevState[prevStepKey], submitted: true },
                [stepKey]: { ...prevState[stepKey], touched: true },
            };
        });
    }

    handleSubmitAttempt = stepIndex => {
        const stepKey = `step_${stepIndex}`;
        this.setState( prevState => ({ 
            [stepKey]: { ...prevState[stepKey], submitted: true },
        }));
    }

    isStepActive = step => this.state[`step_${this.getStepIndex(step)}`].active;

    setStepActiveStatus = (stepId, active) => {
        this.setState( prevState => {
            const stepKey = `step_${this.getStepIndex(stepId)}`;
            const step = prevState[stepKey];
            return { 
                [stepKey]: {...step, active},
            };
        });
    }

    handleFinish = () => {
        this.props.onFinish(exportState(this.state));
    }

    render() {

        const { current } = this.state;

        let stepsState = steps2array(this.state);
        const { steps: stepProps } = this.props;
        const state = getStepState(stepsState);
        let prevActiveStep = { valid: true, navigable: true };

        stepsState = stepsState.map( (step, i) => {
            let { active, title } = step;
            let { valid = true } = stepProps[i];
            
            if (typeof(active) === 'function') {
                active = active(state) || false;
            }
            if (typeof(title) === 'function') {
                title = title(state);
            }

            let errors = {};
            let stepValid = true;

            if (valid !== undefined && valid !== null) {
                const validationStatus = getValidationState(valid);
                if (typeof(validationStatus) === 'object') {
                    errors = validationStatus;
                    stepValid = withoutValidationErrors(errors);
                } else {
                    stepValid = validationStatus;
                }
            }
            
            const navigable = prevActiveStep.valid && prevActiveStep.navigable;

            const result = {
                ...step,
                initialProps: stepProps[i].props,
                active,
                title,
                valid: stepValid,
                navigable,
                errors,
            };

            if (active) {
                prevActiveStep = result;
            }

            return result;
        });

        let { customNumbers = false, hideNumbers = false } = this.props;

        return this.renderer.wiz(
            <Tabs steps={stepsState} current={current} 
                customNumbers={customNumbers}
                hideNumbers={hideNumbers}
                renderContainer={this.renderer.tabsContainer}
                renderTab={this.renderer.tab}
                onStepChange={this.handleStepChange} />,
            <Content steps={stepsState} current={current} 
                renderContainer={this.renderer.stepsContainer}
                renderStep={this.renderer.step}
                setStepActiveStatus={this.setStepActiveStatus}
                getStepState={this.getStepState}
                isStepActive={this.isStepActive} />,
            <Nav steps={stepsState} current={current} render={this.renderer.nav}
                onFinish={this.handleFinish}
                onSubmitError={this.handleSubmitAttempt}
                onStepChange={this.handleStepChange} />
        );
    }

}

export default Wizard;
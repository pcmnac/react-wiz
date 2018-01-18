import React, { Component } from 'react';

class WizardNavigation extends Component {

    constructor(props) {
        super(props);
    }

    handleStepChange(step, forward = true) {
        const { 
            current,
            steps,
            onStepChange,
            onSubmitError,
        } = this.props;

        if (forward && !steps[current].valid) {
            onSubmitError(current);
        } else {
            onStepChange(step);
        }
    }

    handleFinish = () => {
        const { 
            current,
            steps,
            onFinish,
            onSubmitError,
        } = this.props;

        if (!steps[current].valid) {
            onSubmitError(current);
        } else {
            onFinish();
        }
    }

    render() {
        const { 
            steps,
            current,
            onFinish,
            render,
        } = this.props;

        const total = steps.length;

        let prev = 0, next = -1, last = -1;

        for (let i = 0; i < total; i++) {
            if (steps[i].active) {
                last = i;
                if (i < current) {
                    prev = i;
                } else if (i > current && next == -1) {
                    next = i;
                }
            }
        }

        return render(
            current == 0, // first
            current == last, // last
            steps[current] && steps[current].valid, // valid
            this.handleStepChange.bind(this, prev, false), // prev
            this.handleStepChange.bind(this, next, true), // next
            this.handleFinish, // finish
        ); 
    }

}

export default WizardNavigation;
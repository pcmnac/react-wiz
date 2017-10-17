import React, { Component } from 'react';

class WizardNavigation extends Component {

    constructor(props) {
        super(props);
    }

    handleStepChange(step, forward = true) {

        let { 
            current,
            steps,
            onStepChange = (step) => { console.log("step changed: ", step) } 
        } = this.props;

        if (forward && !steps[current].valid) {
            alert("invalid");
            return false;
        }

        onStepChange(step);
    }

    render() {

        let { 
            steps,
            current,
            onFinish,
            render,
        } = this.props;

        let total = steps.length;

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
            steps[current].valid, // valid
            this.handleStepChange.bind(this, prev, false), // prev
            this.handleStepChange.bind(this, next), // next
            onFinish, // finish
        ); 
    }

}

export default WizardNavigation;
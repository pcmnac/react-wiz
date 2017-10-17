import React, { Component } from 'react';
import Rx from 'rxjs/Rx';

const DELAY = 500;

export default class StepContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {};

        this.state$ = new Rx.Subject();

        this.state$.subscribe(({state}) => {
            console.log("local state:", state);
            this.setState(state)
        });

        let stepState$ = Rx.Observable.merge(
            this.state$.debounceTime(DELAY),
            this.state$.throttleTime(DELAY)
        );
        
        stepState$.subscribe( ({state, validator}) => {
            console.log("uptade step state: ", state);
            props.stateManager.setState(state, validator);
        });
    }

    handleValueChange(field, validator, event) {
        this.setStateStream({[field]: event.target.value}, validator);
    }

    handleCheckChange(field, validator, event) {
        this.setStateStream({[field]: event.target.checked}, validator);
    }

    handleChange(field, validator, value) {
        this.setStateStream({[field]: value}, validator);
    }

    setLocal = (state) => {
        this.setStateStream(state);
    }

    setStateStream(state, validator) {
        this.state$.next({ state, validator });
    }

    render() {
        
        const { Component, children, stateManager } = this.props;

        const enhancedStateManager = {
            ...stateManager,
            onLocalValueChange: (field, validator) => this.handleValueChange.bind(this, field, validator),
            onLocalCheckChange: (field, validator) => this.handleCheckChange.bind(this, field, validator),
            onLocalChange: (field, validator) => this.handleChange.bind(this, field, validator),
            local: this.state,
            setLocal: this.setLocal,
        }

        return (
            <Component {...this.props}
                stateManager={enhancedStateManager} />
        );
    }
}
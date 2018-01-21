import React from 'react';

export function wiz(tabs, content, nav) {
    return (
        <div>
            {tabs}
            {content}
            {nav}
        </div>
    );
}

export function tab(step, index, current, hideNumbers, changeStep) {
    return (
        <span key={index}
            style={{
                cursor: step.navigable && !current ? 'pointer' : '', 
                fontWeight: current ? 'bold' : 'normal',
                display: step.active !== false ? 'inline-block' : 'none',
            }}
            onClick={changeStep}>
            {step.title} 
            {/* ({step.navigable ? "T" : "F"}, {step.valid ? "T" : "F"}) */}
            {' | '}
        </span>
    );
}

export function tabsContainer(tabs) {
    return <div>{tabs}</div>;
}

export function step(step, index, current, setStepActiveStatus, isStepActive, getStepState) {
    return (
        <div style={{display: index === current ? 'block' : 'none'}}>
            <step.component
                {...step.initialProps}
                key={index} index={index} 
                valid={step.valid}
                submitted={step.submitted}
                stepState={step.state}
                isStepActive={isStepActive}
                setStepActiveStatus={setStepActiveStatus}
                getStepState={getStepState}
                errors={step.errors} />
        </div>
    );
}

export function stepsContainer(steps) {
    return <div>{steps}</div>;
}

export function nav(first, last, valid, prev, next, finish) {

    return (
        <div>
            <button 
                style={{display: first ? 'none' : 'inline-block',}}
                onClick={prev}> Anterior</button>
            
            <button disabled={!valid}
                style={{display: last ? 'none' : 'inline-block',}}
                onClick={next}>Próximo</button> 
            
            <button disabled={!valid}
                style={{ display: last ? 'inline-block' : 'none', }}
                onClick={finish}>Concluir</button> 
        </div>
    );
}

/* eslint-disable react/prop-types */
import React from 'react';
import '../assets/stepper.css';

function Stepper({ steps, currentStep }) {
  return (
    <div className="bs-stepper-header">
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <div className={`step ${currentStep === index + 1 ? 'active' : ''}`} data-target={step.target}>
            <button type="button" className="step-trigger">
              <span className="bs-stepper-circle">
                {currentStep > index + 1 ? <i className="mdi mdi-check"></i> : index + 1}
              </span>
              <span className="bs-stepper-label">
                <span className="bs-stepper-number">{`0${index + 1}`}</span>
                <span className="d-flex flex-column gap-1 ms-2">
                  <span className="bs-stepper-title">{step.title}</span>
                  <span className="bs-stepper-subtitle">{step.subtitle}</span>
                </span>
              </span>
            </button>
          </div>
          {index < steps.length - 1 && <div className="line"></div>}
        </React.Fragment>
      ))}
    </div>
  );
}

export default Stepper;

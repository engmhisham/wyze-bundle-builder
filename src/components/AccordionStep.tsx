import type { Product, StepConfig } from '../types';
import { useBundle } from '../context/BundleContext';
import ProductCard from './ProductCard';
import './AccordionStep.css';

interface Props {
  step: StepConfig;
  stepIndex: number;
  totalSteps: number;
  products: Product[];
  nextStepTitle?: string;
}

export default function AccordionStep({ step, stepIndex, totalSteps, products, nextStepTitle }: Props) {
  const { state, setStep, getQuantity } = useBundle();
  const isOpen = state.activeStep === stepIndex;

  const selectedCount = products.reduce((count, p) => {
    if (p.variants && p.variants.length > 0) {
      const hasAny = p.variants.some(v => getQuantity(p.id, v.id) > 0);
      return count + (hasAny ? 1 : 0);
    }
    return count + (getQuantity(p.id) > 0 ? 1 : 0);
  }, 0);

  const handleToggle = () => {
    setStep(isOpen ? -1 : stepIndex);
  };

  const handleNext = () => {
    if (stepIndex < totalSteps - 1) {
      setStep(stepIndex + 1);
    }
  };

  const iconSrc = `/${step.icon}.${step.iconExt || 'svg'}`;

  return (
    <div className="accordion-step">
      {isOpen ? (
        <div className="accordion-step__body accordion-step__body--open">
          {/* Label INSIDE the blue container */}
          <div className="accordion-step__label">
            STEP {stepIndex + 1} OF {totalSteps}
          </div>
          {/* Content area - header + cards are TOGETHER below the border-top */}
          <div className="accordion-step__content">
            <button className="accordion-step__header-row" onClick={handleToggle}>
              <div className="accordion-step__title-row">
                <img src={iconSrc} alt="" width="26" height="26" className="accordion-step__icon" />
                <h3 className="accordion-step__title">{step.title}</h3>
              </div>
              <div className="accordion-step__header-right">
                {selectedCount > 0 && (
                  <span className="accordion-step__count">{selectedCount} selected</span>
                )}
                <img src="/icons/chevron-up.svg" alt="" width="12" height="12" />
              </div>
            </button>
            <div className="accordion-step__grid">
              {products.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
            {nextStepTitle && (
              <button className="accordion-step__next-btn" onClick={handleNext}>
                Next: {nextStepTitle}
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="accordion-step__label accordion-step__label--collapsed">
            STEP {stepIndex + 1} OF {totalSteps}
          </div>
          <button className="accordion-step__header accordion-step__header--collapsed" onClick={handleToggle}>
            <div className="accordion-step__title-row">
              <img src={iconSrc} alt="" width="26" height="26" className="accordion-step__icon" />
              <h3 className="accordion-step__title">{step.title}</h3>
            </div>
            <div className="accordion-step__header-right">
              {selectedCount > 0 && (
                <span className="accordion-step__count">{selectedCount} selected</span>
              )}
              <img src="/icons/chevron-down.svg" alt="" width="12" height="12" />
            </div>
          </button>
        </>
      )}
    </div>
  );
}

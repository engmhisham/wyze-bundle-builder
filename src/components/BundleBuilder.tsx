import type { Product, StepConfig } from '../types';
import data from '../data/products.json';
import AccordionStep from './AccordionStep';
import ReviewPanel from './ReviewPanel';
import './BundleBuilder.css';

const products = data.products as Product[];
const steps = data.steps as StepConfig[];

export default function BundleBuilder() {
  return (
    <div className="bundle-builder">
      <h1 className="bundle-builder__mobile-heading">Let's get started!</h1>
      <div className="bundle-builder__main">
        <div className="bundle-builder__accordion">
          {steps.map((step, i) => (
            <AccordionStep
              key={step.id}
              step={step}
              stepIndex={i}
              totalSteps={steps.length}
              products={products.filter(p => p.category === step.category)}
              nextStepTitle={i < steps.length - 1 ? steps[i + 1].title : undefined}
            />
          ))}
        </div>
      </div>
      <aside className="bundle-builder__sidebar">
        <ReviewPanel products={products} />
      </aside>
    </div>
  );
}

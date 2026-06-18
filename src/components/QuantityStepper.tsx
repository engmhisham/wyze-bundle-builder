import './QuantityStepper.css';

interface Props {
  quantity: number;
  onChange: (qty: number) => void;
  min?: number;
  max?: number;
  compact?: boolean;
}

export default function QuantityStepper({ quantity, onChange, min = 0, max, compact }: Props) {
  const atMax = max !== undefined && quantity >= max;
  return (
    <div className={`qty-stepper ${compact ? 'qty-stepper--compact' : ''}`}>
      <button
        className="qty-stepper__btn"
        onClick={() => onChange(Math.max(min, quantity - 1))}
        disabled={quantity <= min}
        aria-label="Decrease quantity"
      >
        <img src="/icons/minus.svg" alt="" width="8" height="8" />
      </button>
      <span className="qty-stepper__value">{quantity}</span>
      <button
        className="qty-stepper__btn"
        onClick={() => onChange(quantity + 1)}
        disabled={atMax}
        aria-label="Increase quantity"
      >
        <img src="/icons/plus.svg" alt="" width="8" height="8" />
      </button>
    </div>
  );
}

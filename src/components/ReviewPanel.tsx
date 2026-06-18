import type { Product } from '../types';
import { useBundle } from '../context/BundleContext';
import QuantityStepper from './QuantityStepper';
import './ReviewPanel.css';

interface Props {
  products: Product[];
}

interface ReviewLineItem {
  product: Product;
  variantId?: string;
  variantLabel?: string;
  quantity: number;
  linePrice: number;
  lineComparePrice?: number;
}

const FINANCING_MONTHS = 10;

export default function ReviewPanel({ products }: Props) {
  const { state, setQuantity, saveSystem } = useBundle();

  const buildLineItems = (): ReviewLineItem[] => {
    const items: ReviewLineItem[] = [];
    for (const li of state.lineItems) {
      const product = products.find(p => p.id === li.productId);
      if (!product || li.quantity <= 0) continue;

      const variant = product.variants?.find(v => v.id === li.variantId);
      items.push({
        product,
        variantId: li.variantId,
        variantLabel: variant?.color,
        quantity: li.quantity,
        linePrice: product.isFreeWithBundle ? 0 : product.price * li.quantity,
        lineComparePrice: product.compareAtPrice ? product.compareAtPrice * li.quantity : undefined,
      });
    }
    return items;
  };

  const lineItems = buildLineItems();

  const fastShippingItem = lineItems.find(li => li.product.hideFromGroup);
  const groupableItems = lineItems.filter(li => !li.product.hideFromGroup);

  const grouped: Record<string, ReviewLineItem[]> = {};
  for (const item of groupableItems) {
    const cat = item.product.category;
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(item);
  }

  const categoryOrder = ['cameras', 'sensors', 'protection', 'plans'] as const;
  const categoryLabels: Record<string, string> = {
    cameras: 'CAMERAS',
    sensors: 'SENSORS',
    protection: 'ACCESSORIES',
    plans: 'PLAN',
  };

  const subtotal = lineItems.reduce((sum, li) => sum + li.linePrice, 0);
  const compareTotal = lineItems.reduce((sum, li) => {
    if (li.product.isFreeWithBundle && li.product.compareAtPrice) {
      return sum + li.product.compareAtPrice * li.quantity;
    }
    return sum + (li.lineComparePrice || li.linePrice);
  }, 0);
  const savings = compareTotal - subtotal;

  const handleSave = () => {
    saveSystem();
    alert('Your system has been saved! It will be restored on your next visit.');
  };

  return (
    <div className="review-panel">
      <div className="review-panel__label">REVIEW</div>
      <div className="review-panel__content">
      <div className="review-panel__header">
        <h2>Your security system</h2>
        <p>Review your personalized protection system designed to keep what matters most safe.</p>
      </div>

      <div className="review-panel__items">
        {categoryOrder.map(cat => {
          const items = grouped[cat];
          if (!items || items.length === 0) return null;
          return (
            <div key={cat} className="review-panel__group">
              <span className="review-panel__group-label">{categoryLabels[cat]}</span>
              {items.map((item) => (
                <div key={`${item.product.id}-${item.variantId || ''}`} className="review-line">
                  {item.product.image && (
                    <img
                      className={item.product.reviewIcon ? "review-line__image--small" : "review-line__image"}
                      src={item.product.reviewImage || item.product.reviewIcon || item.product.image}
                      alt={item.product.name}
                    />
                  )}
                  <div className="review-line__info">
                    {item.product.isSpecialPlan ? (
                      <span className="review-line__name review-line__name--plan">
                        <span>Cam </span><span className="text-purple">Unlimited</span>
                      </span>
                    ) : (
                      <span className="review-line__name">
                        {item.product.name}
                        {item.variantLabel && ` - ${item.variantLabel}`}
                      </span>
                    )}
                  </div>
                  {item.product.priceLabel ? (
                    <>
                      <div className="review-line__pricing">
                        {item.lineComparePrice !== undefined && (
                          <span className="price--compare">${(item.product.compareAtPrice!).toFixed(2)}{item.product.priceLabel}</span>
                        )}
                        <span className="price--active">${item.product.price.toFixed(2)}{item.product.priceLabel}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <QuantityStepper
                        quantity={item.quantity}
                        onChange={(qty) => setQuantity(item.product.id, item.variantId, qty)}
                        min={item.product.isFreeWithBundle ? 1 : 0}
                        max={item.product.isFreeWithBundle ? 1 : undefined}
                        compact
                      />
                      <div className="review-line__pricing">
                        {item.product.isFreeWithBundle ? (
                          <>
                            {item.product.price > 0 && (
                              <span className="price--compare">${(item.product.price * item.quantity).toFixed(2)}</span>
                            )}
                            <span className="price--free">FREE</span>
                          </>
                        ) : (
                          <>
                            {item.lineComparePrice && item.lineComparePrice !== item.linePrice && (
                              <span className="price--compare">${item.lineComparePrice.toFixed(2)}</span>
                            )}
                            <span className="price--active">${item.linePrice.toFixed(2)}</span>
                          </>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          );
        })}
        {fastShippingItem && (
          <div className="review-panel__group">
            <div className="review-line">
              {fastShippingItem.product.image && (
                <img
                  className="review-line__image"
                  src={fastShippingItem.product.image}
                  alt={fastShippingItem.product.name}
                />
              )}
              <div className="review-line__info">
                <span className="review-line__name">{fastShippingItem.product.name}</span>
              </div>
              <div className="review-line__pricing">
                {fastShippingItem.product.compareAtPrice && (
                  <span className="price--compare">${fastShippingItem.product.compareAtPrice.toFixed(2)}</span>
                )}
                <span className="price--free">FREE</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="review-panel__footer">
        <div className="review-panel__guarantee">
          <img className="guarantee-badge__img" src="/icons/satisfaction-badge.png" alt="100% satisfaction" />
          <div className="guarantee-info">
            <div className="review-panel__financing">
              <span className="financing-badge">as low as ${(subtotal / FINANCING_MONTHS).toFixed(2)}/mo</span>
            </div>
            <div className="review-panel__total">
              {savings > 0 && (
                <span className="price--compare">${compareTotal.toFixed(2)}</span>
              )}
              <span className="total-price">${subtotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {savings > 0 && (
          <div className="review-panel__savings">
            Congrats! You're saving ${savings.toFixed(2)} on your security bundle!
          </div>
        )}

        <button className="review-panel__checkout" onClick={() => alert('Checkout is a placeholder in this prototype.')}>
          Checkout
        </button>

        <button className="review-panel__save-link" onClick={handleSave}>
          Save my system for later
        </button>
      </div>
      </div>
    </div>
  );
}

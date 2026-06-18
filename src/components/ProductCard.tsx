import { useState } from 'react';
import type { Product } from '../types';
import { useBundle } from '../context/BundleContext';
import QuantityStepper from './QuantityStepper';
import './ProductCard.css';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { getQuantity, setQuantity } = useBundle();
  const hasVariants = product.variants && product.variants.length > 0;

  const [selectedVariantId, setSelectedVariantId] = useState(
    hasVariants ? product.variants![0].id : undefined
  );

  const currentQty = getQuantity(product.id, selectedVariantId);
  const totalQty = hasVariants
    ? product.variants!.reduce((sum, v) => sum + getQuantity(product.id, v.id), 0)
    : currentQty;

  const isSelected = totalQty > 0;

  const handleQtyChange = (qty: number) => {
    setQuantity(product.id, selectedVariantId, qty);
  };

  const handleCardClick = () => {
    if (product.isFreeWithBundle) return;
    if (!isSelected) {
      setQuantity(product.id, selectedVariantId, 1);
    } else if (product.priceLabel) {
      setQuantity(product.id, selectedVariantId, 0);
    }
  };

  return (
    <div
      className={`product-card ${isSelected ? 'product-card--selected' : ''} ${!product.isFreeWithBundle ? 'product-card--clickable' : ''}`}
      onClick={handleCardClick}
    >
      <div className={`product-card__image ${product.priceLabel ? 'product-card__image--centered' : ''}`}>
        {product.badge && <span className="product-card__badge">{product.badge}</span>}
        <img src={product.image} alt={product.name} />
      </div>

      <div className="product-card__info">
        <h4 className="product-card__name">{product.name}</h4>
        {(product.description || product.learnMoreUrl) && (
          <p className="product-card__desc">
            {product.description && <span>{product.description} </span>}
            {product.learnMoreUrl && (
              <a href={product.learnMoreUrl} className="product-card__learn-more">
                Learn More
              </a>
            )}
          </p>
        )}

        {hasVariants && (
          <div className="product-card__variants" onClick={e => e.stopPropagation()}>
            {product.variants!.map(v => (
              <button
                key={v.id}
                className={`variant-chip ${v.id === selectedVariantId ? 'variant-chip--active' : ''}`}
                onClick={() => setSelectedVariantId(v.id)}
                title={v.color}
              >
                <img
                  className="variant-chip__icon"
                  src={v.image}
                  alt={v.color}
                />
                <span className="variant-chip__label">{v.color}</span>
              </button>
            ))}
          </div>
        )}

        <div className={`product-card__footer ${product.priceLabel ? 'product-card__footer--end' : ''}`} onClick={e => e.stopPropagation()}>
          {!product.priceLabel && (
            <QuantityStepper
              quantity={currentQty}
              onChange={handleQtyChange}
              min={product.isFreeWithBundle ? 1 : 0}
              max={product.isFreeWithBundle ? 1 : undefined}
            />
          )}
          <div className="product-card__pricing">
            {product.isFreeWithBundle ? (
              <>
                <span className="price--compare">${product.price.toFixed(2)}</span>
                <span className="price--free">FREE</span>
              </>
            ) : (
              <>
                {product.compareAtPrice && (
                  <span className="price--compare">${product.compareAtPrice.toFixed(2)}{product.priceLabel || ''}</span>
                )}
                <span className="price--active">
                  ${product.price.toFixed(2)}
                  {product.priceLabel || ''}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

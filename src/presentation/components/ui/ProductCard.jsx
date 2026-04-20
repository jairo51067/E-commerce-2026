// ProductCard con badges + precio descuento
export const ProductCard = ({ product }) => {
  const { addItem, removeItem, updateItemQuantity, cart } = useCart();
  const cartItem = cart.find(item => item.id === product.id);
  const currentQty = cartItem ? cartItem.quantity : 0;

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPct = hasDiscount
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <div className="product-card">

      {/* BADGES */}
      <div className="product-badges">
        {product.isNew && (
          <span className="badge badge-new">NUEVO</span>
        )}
        {hasDiscount && (
          <span className="badge badge-discount">-{discountPct}%</span>
        )}
        {product.stock === 0 && (
          <span className="badge badge-out">AGOTADO</span>
        )}
        {product.stock <= 3 && product.stock > 0 && (
          <span className="badge badge-low">ÚLTIMAS</span>
        )}
      </div>

      <img
        src={product.image}
        alt={product.name}
        onError={e => {
          e.target.src = 'https://via.placeholder.com/300x200?text=Sin+imagen';
        }}
      />

      <div className="product-info">
        <h3>{product.name}</h3>

        {/* PRECIOS */}
        <div className="product-prices">
          {hasDiscount && (
            <span className="price-original">
              ${Number(product.originalPrice).toFixed(2)}
            </span>
          )}
          <span className="price">
            ${Number(product.price).toFixed(2)}
          </span>
        </div>

        {/* STOCK */}
        <p className="stock">
          {product.stock === 0
            ? '❌ Agotado'
            : product.stock <= 3
              ? `⚠️ Últimas ${product.stock} unidades`
              : `📦 Disponible`
          }
        </p>
      </div>

      {/* CONTROLES */}
      <div className="quantity-section">
        {currentQty === 0 ? (
          <button
            className="add-to-cart-btn"
            onClick={() => {
              addItem(product, 1);
              Notifier.cart(`🛒 ${product.name} agregado`);
            }}
            disabled={product.stock === 0}
          >
            🛒 Agregar
          </button>
        ) : (
          <>
            <div className="quantity-control">
              <button
                className="qty-btn"
                onClick={() => {
                  if (currentQty === 1) removeItem(product.id);
                  else updateItemQuantity(product.id, currentQty - 1);
                }}
              >
                −
              </button>
              <span className="qty-display">{currentQty}</span>
              <button
                className="qty-btn"
                onClick={() => updateItemQuantity(product.id, currentQty + 1)}
                disabled={currentQty >= product.stock}
              >
                +
              </button>
            </div>
            <p className="subtotal">
              ${(Number(product.price) * currentQty).toFixed(2)}
            </p>
          </>
        )}
      </div>
    </div>
  );
};
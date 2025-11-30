export const addRandomDiscounts = (products) => {
  return products.map((p) => {
    const hasDiscount = Math.random() < 0.3; // نسبة الخصم 30%
    const discountFactor = 1 + (Math.random() * 0.3 + 0.1); // خصم عشوائي 10% - 40%

    return {
      ...p,
      oldPrice: hasDiscount ? (p.price * discountFactor).toFixed(2) : null,
      discountPercent: hasDiscount ? Math.round((discountFactor - 1) * 100) : null,
    };
  });
};

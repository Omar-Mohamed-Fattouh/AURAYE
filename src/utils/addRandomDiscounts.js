// دالة توليد رقم عشوائي ثابت بناءً على id
function pseudoRandom(id) {
  const x = Math.sin(id) * 10000;
  return x - Math.floor(x);
}

export const addRandomDiscounts = (products) => {
  return products.map((p) => {
    const rndForDiscount = pseudoRandom(p.id); // لتحديد إذا فيه خصم
    const rndForFactor = pseudoRandom(p.id + 1); // لتحديد نسبة الخصم

    const hasDiscount = rndForDiscount < 0.3; // 30% احتمالية خصم
    const discountFactor = 1 + (rndForFactor * 0.3 + 0.1); // خصم ثابت بين 10% - 40%

    return {
      ...p,
      oldPrice: hasDiscount ? (p.price * discountFactor).toFixed(2) : null,
      discountPercent: hasDiscount ? Math.round((discountFactor - 1) * 100) : null,
    };
  });
};

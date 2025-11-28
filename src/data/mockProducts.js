export const mockProducts = [
  {
    id: "7",
    name: "Premium Wireless Headphones",
    price: 299.99,
    colors: ["Black", "White", "Blue"],
    image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=400&fit=crop",
    description: "High-quality wireless headphones with active noise cancellation",
  },
  {
    id: "8",
    name: "Smart Watch Pro",
    price: 449.99,
    colors: ["Black", "Silver"],
    image_url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=400&fit=crop",
    description: "Advanced smartwatch with health tracking and GPS",
  },
  {
    id: "9",
    name: "Portable Bluetooth Speaker",
    price: 129.99,
    colors: ["Red", "Blue"],
    image_url: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=400&fit=crop",
    description: "Waterproof speaker with 20-hour battery life",
  },
]

// Simulate async API call with delay
export const fetchProducts = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockProducts)
    }, 1500)
  })
}

const products = [
  {
    productId: "C001",
    name: "Classic Cotton T-Shirt",
    category: "T-Shirts",
    price: 699,
    description: "Comfortable cotton regular-fit t-shirt.",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
    brand: "Raritone",
    stock: 45
  },
  {
    productId: "C002",
    name: "Premium Black T-Shirt",
    category: "T-Shirts",
    price: 899,
    description: "Premium soft cotton black t-shirt.",
    image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1",
    brand: "Raritone",
    stock: 38
  },
  {
    productId: "C003",
    name: "Oversized Graphic T-Shirt",
    category: "T-Shirts",
    price: 999,
    description: "Modern oversized graphic t-shirt.",
    image: "https://images.unsplash.com/photo-1583743814966-8936f37f4678",
    brand: "Raritone",
    stock: 30
  },
  {
    productId: "C004",
    name: "Slim Fit Polo T-Shirt",
    category: "T-Shirts",
    price: 1199,
    description: "Stylish slim-fit polo t-shirt.",
    image: "https://images.unsplash.com/photo-1625910513413-5fc45c5c6f9a",
    brand: "Raritone",
    stock: 25
  },
  {
    productId: "C005",
    name: "Striped Casual T-Shirt",
    category: "T-Shirts",
    price: 799,
    description: "Classic striped t-shirt for everyday wear.",
    image: "https://images.unsplash.com/photo-1527719327859-4b9e7b1b8d5b",
    brand: "Raritone",
    stock: 32
  },

  {
    productId: "C006",
    name: "Classic Denim Jacket",
    category: "Jackets",
    price: 2499,
    description: "Timeless blue denim jacket.",
    image: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9",
    brand: "Raritone",
    stock: 20
  },
  {
    productId: "C007",
    name: "Black Casual Jacket",
    category: "Jackets",
    price: 2799,
    description: "Minimal black casual jacket.",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5",
    brand: "Raritone",
    stock: 18
  },
  {
    productId: "C008",
    name: "Bomber Jacket",
    category: "Jackets",
    price: 2999,
    description: "Modern lightweight bomber jacket.",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea",
    brand: "Raritone",
    stock: 15
  },
  {
    productId: "C009",
    name: "Hooded Winter Jacket",
    category: "Jackets",
    price: 3499,
    description: "Warm hooded jacket for cold weather.",
    image: "https://images.unsplash.com/photo-1548883354-7622d03aca27",
    brand: "Raritone",
    stock: 12
  },
  {
    productId: "C010",
    name: "Lightweight Casual Jacket",
    category: "Jackets",
    price: 2299,
    description: "Lightweight jacket for casual styling.",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f",
    brand: "Raritone",
    stock: 22
  },

  {
    productId: "C011",
    name: "Slim Fit Blue Jeans",
    category: "Jeans",
    price: 1799,
    description: "Classic slim-fit blue denim jeans.",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d",
    brand: "Raritone",
    stock: 35
  },
  {
    productId: "C012",
    name: "Black Stretch Jeans",
    category: "Jeans",
    price: 1899,
    description: "Comfortable stretch denim jeans.",
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246",
    brand: "Raritone",
    stock: 28
  },
  {
    productId: "C013",
    name: "Relaxed Fit Jeans",
    category: "Jeans",
    price: 1999,
    description: "Relaxed-fit jeans for everyday comfort.",
    image: "https://images.unsplash.com/photo-1602293589930-45aad59ba3ab",
    brand: "Raritone",
    stock: 24
  },
  {
    productId: "C014",
    name: "Straight Fit Denim",
    category: "Jeans",
    price: 1699,
    description: "Classic straight-fit denim.",
    image: "https://images.unsplash.com/photo-1475178626620-a4d074967452",
    brand: "Raritone",
    stock: 31
  },
  {
    productId: "C015",
    name: "Dark Wash Jeans",
    category: "Jeans",
    price: 2199,
    description: "Premium dark-wash jeans.",
    image: "https://images.unsplash.com/photo-1548883354-94bcfe321cbb",
    brand: "Raritone",
    stock: 19
  },

  {
    productId: "C016",
    name: "Formal White Shirt",
    category: "Shirts",
    price: 1299,
    description: "Classic white formal shirt.",
    image: "https://images.unsplash.com/photo-1603252110481-7ba873bf42ab",
    brand: "Raritone",
    stock: 40
  },
  {
    productId: "C017",
    name: "Oxford Blue Shirt",
    category: "Shirts",
    price: 1499,
    description: "Premium Oxford shirt for work and casual wear.",
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf",
    brand: "Raritone",
    stock: 27
  },
  {
    productId: "C018",
    name: "Casual Linen Shirt",
    category: "Shirts",
    price: 1599,
    description: "Breathable linen shirt for warm weather.",
    image: "https://images.unsplash.com/photo-1626497764746-6dc36546b388",
    brand: "Raritone",
    stock: 21
  },
  {
    productId: "C019",
    name: "Checked Casual Shirt",
    category: "Shirts",
    price: 1199,
    description: "Classic checked casual shirt.",
    image: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273",
    brand: "Raritone",
    stock: 33
  },
  {
    productId: "C020",
    name: "Mandarin Collar Shirt",
    category: "Shirts",
    price: 1399,
    description: "Modern mandarin collar shirt.",
    image: "https://images.unsplash.com/photo-1605763240000-7e93b172d754",
    brand: "Raritone",
    stock: 16
  },

  {
    productId: "C021",
    name: "Cotton Hoodie",
    category: "Hoodies",
    price: 1799,
    description: "Soft cotton hoodie for everyday wear.",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7",
    brand: "Raritone",
    stock: 29
  },
  {
    productId: "C022",
    name: "Oversized Grey Hoodie",
    category: "Hoodies",
    price: 1999,
    description: "Relaxed oversized streetwear hoodie.",
    image: "https://images.unsplash.com/photo-1509942774463-acf339cf87d5",
    brand: "Raritone",
    stock: 23
  },
  {
    productId: "C023",
    name: "Zip-Up Hoodie",
    category: "Hoodies",
    price: 2199,
    description: "Versatile full-zip casual hoodie.",
    image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3",
    brand: "Raritone",
    stock: 20
  },
  {
    productId: "C024",
    name: "Graphic Print Hoodie",
    category: "Hoodies",
    price: 2299,
    description: "Streetwear-inspired graphic hoodie.",
    image: "https://images.unsplash.com/photo-1578681994506-b8f463449011",
    brand: "Raritone",
    stock: 14
  },
  {
    productId: "C025",
    name: "Fleece Winter Hoodie",
    category: "Hoodies",
    price: 2499,
    description: "Warm fleece hoodie for winter.",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f",
    brand: "Raritone",
    stock: 17
  },

  {
    productId: "C026",
    name: "Cotton Chinos",
    category: "Trousers",
    price: 1599,
    description: "Comfortable cotton chinos.",
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a",
    brand: "Raritone",
    stock: 26
  },
  {
    productId: "C027",
    name: "Formal Black Trousers",
    category: "Trousers",
    price: 1799,
    description: "Smart formal trousers for office wear.",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35",
    brand: "Raritone",
    stock: 34
  },
  {
    productId: "C028",
    name: "Slim Fit Trousers",
    category: "Trousers",
    price: 1899,
    description: "Modern slim-fit formal trousers.",
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80",
    brand: "Raritone",
    stock: 18
  },
  {
    productId: "C029",
    name: "Casual Cargo Pants",
    category: "Trousers",
    price: 1999,
    description: "Functional cargo pants with utility pockets.",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9",
    brand: "Raritone",
    stock: 22
  },
  {
    productId: "C030",
    name: "Relaxed Fit Cargo Pants",
    category: "Trousers",
    price: 2199,
    description: "Relaxed cargo trousers with a streetwear style.",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f",
    brand: "Raritone",
    stock: 15
  }
];

export default products;
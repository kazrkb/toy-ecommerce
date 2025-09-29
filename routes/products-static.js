const express = require('express');
const router = express.Router();

// Static product data for demo (no database needed)
const products = [
  {
    id: 1,
    name: 'Thunder Racer Pro',
    description: 'High-performance RC sports car with 30mph top speed',
    price: 299.99,
    category_id: 1,
    category_name: 'Sports Cars',
    image_url: '/images/products/sports-car-placeholder.svg',
    stock_quantity: 15,
    brand: 'SpeedTech',
    model: 'TR-2024',
    specifications: '{"scale": "1:10", "speed": "30mph", "range": "100m", "battery": "7.4V Li-Po"}'
  },
  {
    id: 2,
    name: 'Lightning Drift King',
    description: 'Drift-ready sports car with precision handling',
    price: 249.99,
    category_id: 1,
    category_name: 'Sports Cars',
    image_url: '/images/products/sports-car-placeholder.svg',
    stock_quantity: 20,
    brand: 'DriftMaster',
    model: 'DK-300',
    specifications: '{"scale": "1:12", "speed": "25mph", "range": "80m", "battery": "6V Ni-MH"}'
  },
  {
    id: 3,
    name: 'Sky Hunter Elite',
    description: 'Professional-grade RC helicopter with 6-axis gyro',
    price: 399.99,
    category_id: 2,
    category_name: 'Helicopters',
    image_url: '/images/products/helicopter-placeholder.svg',
    stock_quantity: 10,
    brand: 'AirForce',
    model: 'SH-450',
    specifications: '{"rotor_diameter": "450mm", "flight_time": "15min", "range": "150m", "channels": "6"}'
  },
  {
    id: 4,
    name: 'Mini Falcon',
    description: 'Compact indoor/outdoor helicopter perfect for beginners',
    price: 149.99,
    category_id: 2,
    category_name: 'Helicopters',
    image_url: '/images/products/helicopter-placeholder.svg',
    stock_quantity: 25,
    brand: 'SkyTech',
    model: 'MF-200',
    specifications: '{"rotor_diameter": "200mm", "flight_time": "8min", "range": "50m", "channels": "4"}'
  },
  {
    id: 5,
    name: 'F-22 Raptor RC',
    description: 'Scale replica of the famous stealth fighter',
    price: 449.99,
    category_id: 3,
    category_name: 'Fighter Jets',
    image_url: '/images/products/fighter-jet-placeholder.svg',
    stock_quantity: 8,
    brand: 'WarBird',
    model: 'F22-RC',
    specifications: '{"wingspan": "800mm", "speed": "40mph", "range": "200m", "channels": "6"}'
  },
  {
    id: 6,
    name: 'Tornado Strike',
    description: 'Twin-engine fighter jet with LED lights',
    price: 329.99,
    category_id: 3,
    category_name: 'Fighter Jets',
    image_url: '/images/products/fighter-jet-placeholder.svg',
    stock_quantity: 12,
    brand: 'JetPro',
    model: 'TS-500',
    specifications: '{"wingspan": "650mm", "speed": "35mph", "range": "150m", "channels": "5"}'
  },
  {
    id: 7,
    name: 'Aqua Rocket 3000',
    description: 'High-speed racing boat with water cooling system',
    price: 279.99,
    category_id: 4,
    category_name: 'Speed Boats',
    image_url: '/images/products/speed-boat-placeholder.svg',
    stock_quantity: 18,
    brand: 'WaveRider',
    model: 'AR-3000',
    specifications: '{"length": "600mm", "speed": "45mph", "range": "120m", "waterproof": "IPX7"}'
  },
  {
    id: 8,
    name: 'Tsunami Pro',
    description: 'Professional racing boat with brushless motor',
    price: 359.99,
    category_id: 4,
    category_name: 'Speed Boats',
    image_url: '/images/products/speed-boat-placeholder.svg',
    stock_quantity: 14,
    brand: 'AquaSpeed',
    model: 'TP-700',
    specifications: '{"length": "700mm", "speed": "50mph", "range": "180m", "waterproof": "IPX8"}'
  }
];

const categories = [
  { id: 1, name: 'Sports Cars', description: 'High-speed remote-controlled sports cars' },
  { id: 2, name: 'Helicopters', description: 'Remote-controlled helicopters for aerial adventures' },
  { id: 3, name: 'Fighter Jets', description: 'Military-style remote-controlled fighter jets' },
  { id: 4, name: 'Speed Boats', description: 'Fast remote-controlled boats for water racing' }
];

// Get all products with optional category filter
router.get('/', (req, res) => {
  try {
    const { category, search, sort } = req.query;
    let filteredProducts = [...products];

    // Category filter
    if (category) {
      filteredProducts = filteredProducts.filter(p => p.category_name === category);
    }

    // Search filter
    if (search) {
      const searchTerm = search.toLowerCase();
      filteredProducts = filteredProducts.filter(p =>
        p.name.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm)
      );
    }

    // Sorting
    switch (sort) {
      case 'price_low':
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price_high':
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // Keep original order
        break;
    }

    res.render('products/index', {
      title: 'Products - RC Toy Store',
      products: filteredProducts,
      categories,
      currentCategory: category || '',
      currentSearch: search || '',
      currentSort: sort || '',
      user: req.session.admin
    });
  } catch (error) {
    console.error('Error loading products:', error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Unable to load products',
      error: { status: 500 }
    });
  }
});

// Get single product
router.get('/:id', (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const product = products.find(p => p.id === productId);

    if (!product) {
      return res.status(404).render('error', {
        title: '404 - Product Not Found',
        message: 'The product you are looking for does not exist.',
        error: { status: 404 }
      });
    }

    // Get related products from same category
    const relatedProducts = products
      .filter(p => p.category_id === product.category_id && p.id !== product.id)
      .slice(0, 4);

    res.render('products/detail', {
      title: `${product.name} - RC Toy Store`,
      product,
      relatedProducts,
      user: req.session.admin
    });
  } catch (error) {
    console.error('Error loading product:', error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Unable to load product details',
      error: { status: 500 }
    });
  }
});

module.exports = router;
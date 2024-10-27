const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Initialize the app
const app = express();
const PORT = 5000;

// Middleware
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(`mongodb+srv://nivethikashivakumar56:ul5hZmKi0xMe7pnR@e-commercecluster.du0pux6.mongodb.net/?retryWrites=true&w=majority&appName=e-commerceCluster`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Define a Product Schema
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
});

const Product = mongoose.model('Product', productSchema);

// Routes

// Create a new product
app.post('/api/products', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single product
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a product
app.put('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a product
app.delete('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

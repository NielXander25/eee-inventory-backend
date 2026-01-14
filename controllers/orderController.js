const Order = require('../models/Order');
const Product = require('../models/Product');

// Generate order number
const generateOrderNumber = () => {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ORD-${timestamp}-${random}`;
};

// Create order
exports.createOrder = async (req, res) => {
  try {
    const { customer, products } = req.body;
 // Calculate total and check product availability
    let totalAmount = 0;
    for (let item of products) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product not found: ${item.product}` });
      }
      if (product.quantity < item.quantity) {
        return res.status(400).json({ success: false, message: `Insufficient quantity for ${product.name}` });
      }
      item.price = product.price;
      totalAmount += product.price * item.quantity;
    }

    const order = await Order.create({
      orderNumber: generateOrderNumber(),
      customer,
      products,
      totalAmount,
      createdBy: req.user.id,
    });
     // Update product quantities
    for (let item of products) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { quantity: -item.quantity },
      });
    }

    const populatedOrder = await Order.findById(order._id)
      .populate('customer', 'name email phone')
      .populate('products.product', 'name price');

    res.status(201).json({ success: true, data: populatedOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all orders
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('customer', 'name email phone')
      .populate('products.product', 'name price')
      .populate('createdBy', 'name email')
      .sort('-createdAt');
       res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single order
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer')
      .populate('products.product');
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('customer', 'name email').populate('products.product', 'name');
    
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete order
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
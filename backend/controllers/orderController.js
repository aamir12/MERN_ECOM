import asyncHandler from 'express-async-handler';
import orderModel from '../models/orderModel.js';

// @desc    create new order
// @route   Post /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  } else {
    const order = new orderModel({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createOrder = await order.save();
    res.status(201).json(createOrder);
  }
});

// @desc   get order by id
// @route   GET /api/orders/:id
// @access  private
const getOrderById = asyncHandler(async (req, res) => {
  const orderId = req.params.id;
  const order = await orderModel
    .findById(orderId)
    .populate('user', 'id name email');
  if (order) {
    res.status(201).json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc   get order by id
// @route   Put /api/orders/:id/pay
// @access  private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const orderId = req.params.id;
  const order = await orderModel.findById(orderId);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };
    const orderUpdate = await order.save();
    res.status(201).json(orderUpdate);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc   get my order list
// @route   Put /api/orders/myorders
// @access  private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await orderModel.find({ user: req.user._id });
  res.json(orders);
});

// @desc   Update order to delivered
// @route   Put /api/orders/:id/deliver
// @access  private/admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const orderId = req.params.id;
  const order = await orderModel.findById(orderId);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    const orderUpdate = await order.save();
    res.json(orderUpdate);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc   get order list
// @route   get /api/orders/
// @access  private/admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await orderModel.find({}).populate('user', 'id name');
  res.json(orders);
});

export {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  getOrders,
  updateOrderToDelivered,
};

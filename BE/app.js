import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import { logger, errorHandler } from './middleware/index.js'

// Import routes
import authRoutes from './routes/auth.js'
import productRoutes from './routes/product.js'
import manufacturerRoutes from './routes/manufacturer.js'
import categoryRoutes from './routes/category.js'
import warehouseRoutes from './routes/warehouse.js'
import productBatchRoutes from './routes/productBatch.js'
import purchaseInvoiceRoutes from './routes/purchaseInvoice.js'
import saleInvoiceRoutes from './routes/saleInvoice.js'
import orderStatusRoutes from './routes/orderStatus.js'
import stockTransactionRoutes from './routes/stockTransaction.js'
import paymentRoutes from './routes/payment.js'

dotenv.config()

const app = express()
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true, 
}))
const PORT = process.env.PORT || 3000

// Middleware để parse JSON
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Logger middleware
app.use(logger)

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB successfully'))
  .catch(err => console.log('❌ MongoDB connection error:', err))

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Medical Website API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      manufacturers: '/api/manufacturers',
      categories: '/api/categories',
      warehouses: '/api/warehouses',
      productBatches: '/api/product-batches',
      purchaseInvoices: '/api/purchase-invoices',
      saleInvoices: '/api/sale-invoices',
      orderStatuses: '/api/order-statuses',
      stockTransactions: '/api/stock-transactions',
      payments: '/api/payments'
    }
  })
});

// Mount routes
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/manufacturers', manufacturerRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/warehouses', warehouseRoutes)
app.use('/api/product-batches', productBatchRoutes)
app.use('/api/purchase-invoices', purchaseInvoiceRoutes)
app.use('/api/sale-invoices', saleInvoiceRoutes)
app.use('/api/order-statuses', orderStatusRoutes)
app.use('/api/stock-transactions', stockTransactionRoutes)
app.use('/api/payments', paymentRoutes)

// Error handler (must be last)
app.use(errorHandler)

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`)
});

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const logsRouter = require('./routes/logs');
const whatsappRouter = require('./routes/whatsapp'); // your existing WhatsApp routes

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/whatsapp-messages', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Routes
app.use('/api', logsRouter);
app.use('/api', whatsappRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const express = require('express');
const router = express.Router();
const Medicine = require('../models/Medicine');
const moment = require('moment');
const { Parser } = require('json2csv');
const PDFDocument = require('pdfkit');

// GET summary report data
router.get('/summary', async (req, res) => {
  try {
    const today = new Date();
    
    // Get counts for each status
    const expired = await Medicine.countDocuments({ expiryDate: { $lt: today } });
    
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);
    
    const expiringSoon = await Medicine.countDocuments({ 
      expiryDate: { $gte: today, $lte: thirtyDaysFromNow } 
    });
    
    const safe = await Medicine.countDocuments({ 
      expiryDate: { $gt: thirtyDaysFromNow } 
    });
    
    // Get total count by category
    const byCategory = await Medicine.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    
    // Get counts expiring this week and month
    const oneWeekFromNow = new Date();
    oneWeekFromNow.setDate(today.getDate() + 7);
    
    const expiringThisWeek = await Medicine.countDocuments({
      expiryDate: { $gte: today, $lte: oneWeekFromNow }
    });
    
    const oneMonthFromNow = new Date();
    oneMonthFromNow.setMonth(today.getMonth() + 1);
    
    const expiringThisMonth = await Medicine.countDocuments({
      expiryDate: { $gte: today, $lte: oneMonthFromNow }
    });
    
    res.json({
      statusCounts: { expired, expiringSoon, safe },
      categoryCounts: byCategory,
      expiringThisWeek,
      expiringThisMonth
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET expired medicines report
router.get('/expired', async (req, res) => {
  try {
    const today = new Date();
    const medicines = await Medicine.find({ expiryDate: { $lt: today } })
      .sort({ expiryDate: 1 });
      
    res.json(medicines);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET medicines expiring this week
router.get('/expiring-this-week', async (req, res) => {
  try {
    const today = new Date();
    const oneWeekFromNow = new Date();
    oneWeekFromNow.setDate(today.getDate() + 7);
    
    const medicines = await Medicine.find({
      expiryDate: { $gte: today, $lte: oneWeekFromNow }
    }).sort({ expiryDate: 1 });
    
    res.json(medicines);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET medicines expiring this month
router.get('/expiring-this-month', async (req, res) => {
  try {
    const today = new Date();
    const oneMonthFromNow = new Date();
    oneMonthFromNow.setMonth(today.getMonth() + 1);
    
    const medicines = await Medicine.find({
      expiryDate: { $gte: today, $lte: oneMonthFromNow }
    }).sort({ expiryDate: 1 });
    
    res.json(medicines);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Download medicines data as CSV
router.get('/download/csv', async (req, res) => {
  try {
    // Get query parameters for filtering
    const { status, category } = req.query;
    let query = {};
    
    // Add status filter if provided
    if (status) {
      const today = new Date();
      
      switch(status) {
        case 'expired':
          query.expiryDate = { $lt: today };
          break;
        case 'expiring-soon':
          const thirtyDaysFromNow = new Date();
          thirtyDaysFromNow.setDate(today.getDate() + 30);
          query.expiryDate = { $gte: today, $lte: thirtyDaysFromNow };
          break;
        case 'safe':
          const thirtyDays = new Date();
          thirtyDays.setDate(today.getDate() + 30);
          query.expiryDate = { $gt: thirtyDays };
          break;
      }
    }
    
    // Add category filter if provided
    if (category) {
      query.category = category;
    }
    
    const medicines = await Medicine.find(query).sort({ expiryDate: 1 });
    
    // Transform data for CSV
    const medicinesForCSV = medicines.map(med => {
      const m = med.toObject();
      return {
        Name: m.name,
        Quantity: m.quantity,
        'Batch Number': m.batchNumber,
        'Expiry Date': moment(m.expiryDate).format('YYYY-MM-DD'),
        Manufacturer: m.manufacturer,
        Category: m.category,
        Barcode: m.barcode || 'N/A',
        'Expiry Status': m.expiryStatus,
        Notes: m.notes || 'N/A'
      };
    });
    
    // Convert to CSV
    const fields = ['Name', 'Quantity', 'Batch Number', 'Expiry Date', 'Manufacturer', 
      'Category', 'Barcode', 'Expiry Status', 'Notes'];
    const parser = new Parser({ fields });
    const csv = parser.parse(medicinesForCSV);
    
    // Set headers for download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=medicines.csv');
    
    res.send(csv);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Download medicines data as PDF
router.get('/download/pdf', async (req, res) => {
  try {
    // Get query parameters for filtering
    const { status, category } = req.query;
    let query = {};
    let title = 'Medicines Report';
    
    // Add status filter if provided
    if (status) {
      const today = new Date();
      
      switch(status) {
        case 'expired':
          query.expiryDate = { $lt: today };
          title = 'Expired Medicines Report';
          break;
        case 'expiring-soon':
          const thirtyDaysFromNow = new Date();
          thirtyDaysFromNow.setDate(today.getDate() + 30);
          query.expiryDate = { $gte: today, $lte: thirtyDaysFromNow };
          title = 'Expiring Soon Medicines Report';
          break;
        case 'safe':
          const thirtyDays = new Date();
          thirtyDays.setDate(today.getDate() + 30);
          query.expiryDate = { $gt: thirtyDays };
          title = 'Safe Medicines Report';
          break;
      }
    }
    
    // Add category filter if provided
    if (category) {
      query.category = category;
      title += ` - ${category.charAt(0).toUpperCase() + category.slice(1)}`;
    }
    
    const medicines = await Medicine.find(query).sort({ expiryDate: 1 });
    
    // Create PDF document
    const doc = new PDFDocument();
    
    // Set headers for download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=medicines-report.pdf');
    
    // Pipe the PDF document to the response
    doc.pipe(res);
    
    // Add title
    doc.fontSize(20).text(title, { align: 'center' });
    doc.moveDown();
    
    // Add generation date
    doc.fontSize(10).text(`Generated on: ${moment().format('MMMM Do YYYY, h:mm:ss a')}`, { align: 'center' });
    doc.moveDown(2);
    
    // Add table header
    const tableTop = 150;
    const columnSpacing = 25;
    
    doc.font('Helvetica-Bold');
    doc.fontSize(10).text('Name', 50, tableTop);
    doc.text('Batch', 160, tableTop);
    doc.text('Expiry Date', 220, tableTop);
    doc.text('Qty', 320, tableTop);
    doc.text('Status', 360, tableTop);
    doc.text('Category', 430, tableTop);
    
    // Horizontal line
    doc.moveTo(50, tableTop + 15)
       .lineTo(550, tableTop + 15)
       .stroke();
    
    doc.font('Helvetica');
    
    // Add rows for each medicine
    let y = tableTop + 30;
    medicines.forEach((med, i) => {
      // Add a new page if needed
      if (y > 700) {
        doc.addPage();
        y = 50;
      }
      
      const expiryDate = moment(med.expiryDate).format('YYYY-MM-DD');
      let status = '';
      
      switch(med.expiryStatus) {
        case 'expired':
          status = 'EXPIRED';
          doc.fillColor('red');
          break;
        case 'expiring-soon':
          status = 'EXPIRING SOON';
          doc.fillColor('orange');
          break;
        case 'safe':
          status = 'SAFE';
          doc.fillColor('green');
          break;
      }
      
      doc.fontSize(9).text(med.name, 50, y, { width: 100, ellipsis: true });
      
      doc.fillColor('black');
      doc.text(med.batchNumber, 160, y);
      doc.text(expiryDate, 220, y);
      doc.text(med.quantity.toString(), 320, y);
      
      // Status with appropriate color
      switch(med.expiryStatus) {
        case 'expired':
          doc.fillColor('red');
          break;
        case 'expiring-soon':
          doc.fillColor('orange');
          break;
        case 'safe':
          doc.fillColor('green');
          break;
      }
      doc.text(status, 360, y);
      
      // Reset to black for category
      doc.fillColor('black');
      doc.text(med.category, 430, y);
      
      y += 20;
    });
    
    // Footer with summary
    doc.fontSize(10).text(`Total Medicines: ${medicines.length}`, 50, y + 20);
    
    // End the document
    doc.end();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

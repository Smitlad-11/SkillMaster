// utils/generateCertificate.js
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generateCertificate = (studentName, courseName, date) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', layout: 'landscape' });
    const filename = `certificate_${Date.now()}.pdf`;
    const filepath = path.join('uploads', 'certificates', filename);

    const stream = fs.createWriteStream(filepath);
    doc.pipe(stream);

    // Background
    doc.rect(0, 0, doc.page.width, doc.page.height).fill('#f0f4ff');

    // Border
    doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40)
      .lineWidth(3).stroke('#2563EB');

    // Title
    doc.fillColor('#1E3A5F')
      .fontSize(44)
      .font('Helvetica-Bold')
      .text('Certificate of Completion', { align: 'center' });

    doc.moveDown(0.5);

    // Subtitle
    doc.fillColor('#555')
      .fontSize(18)
      .font('Helvetica')
      .text('This is to certify that', { align: 'center' });

    doc.moveDown(0.3);

    // Student name
    doc.fillColor('#2563EB')
      .fontSize(32)
      .font('Helvetica-Bold')
      .text(studentName, { align: 'center' });

    doc.moveDown(0.3);

    doc.fillColor('#555')
      .fontSize(18)
      .font('Helvetica')
      .text('has successfully completed the course', { align: 'center' });

    doc.moveDown(0.3);

    // Course name
    doc.fillColor('#1E3A5F')
      .fontSize(26)
      .font('Helvetica-Bold')
      .text(courseName, { align: 'center' });

    doc.moveDown(0.3);

    doc.fillColor('#555')
      .fontSize(16)
      .font('Helvetica')
      .text(`Completed on: ${date}`, { align: 'center' });

    doc.moveDown(1.5);

    // Footer
    doc.fillColor('#888')
      .fontSize(12)
      .text('SkillMaster E-Learning Platform | Brainybeam Info-Tech Pvt Ltd', { align: 'center' });

    doc.end();

    stream.on('finish', () => resolve(filename));
    stream.on('error', reject);
  });
};

module.exports = generateCertificate;

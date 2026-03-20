import { jsPDF } from 'jspdf';
import { formatINR } from './currencyHelpers';

export function generateTaxPDF({ riderName, phone, financialYear, totalEarnings, poolDeductions, payoutsReceived, netTaxable }) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();

  // Header bg
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageW, 40, 'F');

  // Logo text
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text('GigShield', 15, 18);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text('AI-Powered Parametric Insurance for Delivery Partners', 15, 26);
  doc.text('www.gigshield.io', 15, 33);

  // Title
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('Annual Tax Summary', 15, 55);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text(`Financial Year: ${financialYear}`, 15, 63);
  doc.text(`Generated on: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}`, 15, 70);

  // Divider
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(15, 75, pageW - 15, 75);

  // Rider info section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('Rider Information', 15, 85);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  doc.text(`Name: ${riderName || 'N/A'}`, 15, 93);
  doc.text(`Phone: +91 ${phone || 'N/A'}`, 15, 100);

  // Summary table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('Income Summary', 15, 115);

  const tableData = [
    ['Total Gross Earnings', formatINR(totalEarnings), '#0F172A'],
    ['Pool Deductions (₹1/delivery)', `- ${formatINR(poolDeductions)}`, '#DC2626'],
    ['Insurance Payouts Received', `+ ${formatINR(payoutsReceived)}`, '#16A34A'],
    ['Net Taxable Income', formatINR(netTaxable), '#1E40AF'],
  ];

  let y = 122;
  tableData.forEach(([label, value, color], i) => {
    const isLast = i === tableData.length - 1;

    if (isLast) {
      doc.setFillColor(239, 246, 255);
      doc.rect(13, y - 5, pageW - 26, 12, 'F');
    }

    doc.setFont('helvetica', isLast ? 'bold' : 'normal');
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    doc.text(label, 18, y);

    // Parse color
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    doc.setFont('helvetica', isLast ? 'bold' : 'normal');
    doc.setTextColor(r, g, b);
    doc.text(value, pageW - 18, y, { align: 'right' });

    if (!isLast) {
      doc.setDrawColor(241, 245, 249);
      doc.line(15, y + 4, pageW - 15, y + 4);
    }

    y += 14;
  });

  // Disclaimer
  y += 10;
  doc.setFillColor(254, 252, 232);
  doc.setDrawColor(234, 179, 8);
  doc.setLineWidth(0.5);
  doc.rect(13, y, pageW - 26, 22, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(120, 53, 15);
  doc.text('⚠ Disclaimer', 18, y + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(120, 53, 15);
  const disclaimer = 'This document is an estimate generated for reference purposes only. Actual tax liability may differ. Please consult a qualified tax professional before filing your income tax return.';
  const lines = doc.splitTextToSize(disclaimer, pageW - 36);
  doc.text(lines, 18, y + 14);

  // Footer
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 277, pageW, 20, 'F');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('GigShield • Empowering Gig Workers • www.gigshield.io', pageW / 2, 289, { align: 'center' });

  // Download
  const fileName = `gigshield-tax-FY${financialYear.replace(/[^0-9]/g, '')}.pdf`;
  doc.save(fileName);
}

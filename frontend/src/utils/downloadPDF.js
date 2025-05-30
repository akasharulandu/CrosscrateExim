import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Make sure logo is accessible publicly or imported as base64
import logo from '../assets/crosscrate-logo.png'; // adjust this path as needed

export const downloadPDF = async (elementId) => {
  const input = document.getElementById(elementId);

  const canvas = await html2canvas(input);
  const imgData = canvas.toDataURL('image/png');

  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();

  // Add company logo to header
  const logoWidth = 30;
  const logoHeight = 30;
  const logoX = 10;
  const logoY = 10;
  pdf.addImage(logo, 'PNG', logoX, logoY, logoWidth, logoHeight);

  // Company name and contact details next to logo
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Crosscrate International Exim', logoX + logoWidth + 10, 20);

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Phone: +91 98765 43210', logoX + logoWidth + 10, 27);
  pdf.text('Email: contact@crosscrate.com', logoX + logoWidth + 10, 32);
  pdf.text('123, Green Avenue, Chennai, Tamil Nadu, India – 600001', logoX + logoWidth + 10, 37);

  // Add a line separator
  pdf.setLineWidth(0.5);
  pdf.line(10, 42, pageWidth - 10, 42);

  // Add captured HTML content below header
  const contentY = 50;
  const imgProps = pdf.getImageProperties(imgData);
  const pdfWidth = pageWidth - 20;
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

  pdf.addImage(imgData, 'PNG', 10, contentY, pdfWidth, pdfHeight);

  // Save the PDF
  pdf.save('Product_Details.pdf');
};

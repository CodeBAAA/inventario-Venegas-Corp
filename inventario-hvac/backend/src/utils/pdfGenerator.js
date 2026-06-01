const PDFDocument = require('pdfkit');

function addHeader(doc, title) {
  doc.fontSize(20).text(title, { align: 'center' });
  doc.moveDown();
  doc.fontSize(10).text(`Generado: ${new Date().toLocaleString()}`, { align: 'right' });
  doc.moveDown();
}

function createShoppingListPdf(list) {
  const doc = new PDFDocument({ margin: 40 });

  addHeader(doc, `Lista de compras - ${list.name}`);

  doc.fontSize(12).text(`Creada por: ${list.user?.name || 'Usuario'}`);
  if (list.description) {
    doc.text(`Descripción: ${list.description}`);
  }

  doc.moveDown();

  doc.fontSize(12).text('Herramientas por comprar:', { underline: true });
  doc.moveDown(0.5);

  list.items.forEach((item, index) => {
    doc.fontSize(11).text(`${index + 1}. ${item.toolName}`);
    doc.fontSize(10).text(`   Cantidad: ${item.quantityNeeded}`);
    doc.text(`   Prioridad: ${item.priority}`);
    doc.text(`   Comprado: ${item.purchased ? 'Sí' : 'No'}`);
    if (item.description) doc.text(`   Nota: ${item.description}`);
    doc.moveDown(0.5);
  });

  return doc;
}

function createInventoryPdf(tools) {
  const doc = new PDFDocument({ margin: 40 });

  addHeader(doc, 'Inventario de herramientas HVAC');

  tools.forEach((tool, index) => {
    doc.fontSize(11).text(`${index + 1}. ${tool.code} - ${tool.name}`);
    doc.fontSize(10).text(`   Categoría: ${tool.category?.name || 'Sin categoría'}`);
    doc.text(`   Marca/Modelo: ${tool.brand || '-'} / ${tool.model || '-'}`);
    doc.text(`   Cantidad: ${tool.quantity} ${tool.unit || 'unidad'}`);
    doc.text(`   Mínimo recomendado: ${tool.minimumQuantity}`);
    doc.text(`   Ubicación: ${tool.location || '-'}`);
    doc.text(`   Estado: ${tool.status}`);
    doc.moveDown(0.5);
  });

  return doc;
}

module.exports = {
  createShoppingListPdf,
  createInventoryPdf
};

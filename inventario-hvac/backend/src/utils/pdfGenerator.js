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
  const doc = new PDFDocument({ size: 'LETTER', margin: 40 });

  addHeader(doc, 'Inventario de herramientas HVAC');

  doc.fontSize(14).text('Resumen del inventario');
  doc.moveDown(0.5);
  doc.fontSize(10).text(`Total de herramientas: ${tools.length}`);
  doc.moveDown();

  if (tools.length === 0) {
    doc.fontSize(12).text('No hay herramientas registradas en el inventario.');
  }

  tools.forEach((tool, index) => {
    if (doc.y > 700) doc.addPage();

    const lowStock = tool.quantity < tool.minimumQuantity ? 'Sí' : 'No';

    doc.fontSize(11).text(`${index + 1}. ${tool.code} - ${tool.name}`);
    doc.fontSize(10).text(`   Categoría: ${tool.category?.name || 'Sin categoría'}`);
    doc.text(`   Marca/Modelo: ${tool.brand || '-'} / ${tool.model || '-'}`);
    doc.text(`   Cantidad: ${tool.quantity} ${tool.unit || 'unidad'}`);
    doc.text(`   Mínimo recomendado: ${tool.minimumQuantity}`);
    doc.text(`   Ubicación: ${tool.location || '-'}`);
    doc.text(`   Estado: ${tool.status}`);
    doc.text(`   Bajo stock: ${lowStock}`);
    doc.moveDown(0.5);
  });

  return doc;
}

module.exports = {
  createShoppingListPdf,
  createInventoryPdf
};

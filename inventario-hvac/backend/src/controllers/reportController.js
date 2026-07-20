const prisma = require('../config/prisma');
const { createShoppingListPdf, createInventoryPdf } = require('../utils/pdfGenerator');
const { calculateInventoryMetrics } = require('../utils/inventoryMetrics');

function renderPdf(doc) {
  return new Promise((resolve, reject) => {
    const chunks = [];

    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);
    doc.end();
  });
}

async function getDashboardStats(req, res) {
  try {
    const [totalTools, totalCategories, totalUsers, tools] = await Promise.all([
      prisma.tool.count(),
      prisma.category.count(),
      prisma.user.count(),
      prisma.tool.findMany({ include: { category: true } })
    ]);

    res.json(calculateInventoryMetrics({
      totalTools,
      totalCategories,
      totalUsers,
      tools
    }));
  } catch (error) {
    res.status(500).json({ message: 'Error al generar estadísticas.', error: error.message });
  }
}

async function downloadShoppingListPdf(req, res) {
  try {
    const { listId } = req.params;

    const list = await prisma.shoppingList.findUnique({
      where: { id: Number(listId) },
      include: {
        user: true,
        items: true
      }
    });

    if (!list) {
      return res.status(404).json({ message: 'Lista no encontrada.' });
    }

    const pdfBuffer = await renderPdf(createShoppingListPdf(list));

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="lista-compras-${list.id}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    return res.status(200).send(pdfBuffer);
  } catch (error) {
    res.status(500).json({ message: 'Error al generar PDF.', error: error.message });
  }
}

async function generateInventoryPdf(req, res) {
  try {
    const tools = await prisma.tool.findMany({
      include: {
        category: true,
        user: true
      },
      orderBy: { name: 'asc' }
    });

    const pdfBuffer = await renderPdf(createInventoryPdf(tools));

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="inventario-hvac.pdf"');
    res.setHeader('Content-Length', pdfBuffer.length);
    return res.status(200).send(pdfBuffer);
  } catch (error) {
    console.error('Error generando PDF:', error);
    return res.status(500).json({ message: 'Error generando PDF', error: error.message });
  }
}

module.exports = {
  getDashboardStats,
  downloadShoppingListPdf,
  generateInventoryPdf
};

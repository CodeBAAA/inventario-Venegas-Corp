const prisma = require('../config/prisma');
const { createShoppingListPdf, createInventoryPdf } = require('../utils/pdfGenerator');

async function getDashboardStats(req, res) {
  try {
    const [totalTools, totalCategories, totalUsers, tools] = await Promise.all([
      prisma.tool.count(),
      prisma.category.count(),
      prisma.user.count(),
      prisma.tool.findMany({ include: { category: true } })
    ]);

    const lowStock = tools.filter(tool => tool.quantity < tool.minimumQuantity).length;
    const available = tools.filter(tool => tool.status === 'DISPONIBLE').length;
    const damaged = tools.filter(tool => tool.status === 'DANADA').length;
    const lost = tools.filter(tool => tool.status === 'PERDIDA').length;

    const byCategory = {};
    for (const tool of tools) {
      const name = tool.category?.name || 'Sin categoría';
      byCategory[name] = (byCategory[name] || 0) + tool.quantity;
    }

    res.json({
      totalTools,
      totalCategories,
      totalUsers,
      lowStock,
      available,
      damaged,
      lost,
      byCategory
    });
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

    const doc = createShoppingListPdf(list);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=lista-compras-${list.id}.pdf`);

    doc.pipe(res);
    doc.end();
  } catch (error) {
    res.status(500).json({ message: 'Error al generar PDF.', error: error.message });
  }
}

async function downloadInventoryPdf(req, res) {
  try {
    const tools = await prisma.tool.findMany({
      include: { category: true },
      orderBy: { name: 'asc' }
    });

    const doc = createInventoryPdf(tools);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=inventario-hvac.pdf');

    doc.pipe(res);
    doc.end();
  } catch (error) {
    res.status(500).json({ message: 'Error al generar PDF de inventario.', error: error.message });
  }
}

module.exports = {
  getDashboardStats,
  downloadShoppingListPdf,
  downloadInventoryPdf
};

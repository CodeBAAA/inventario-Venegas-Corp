const prisma = require('../config/prisma');

function buildToolCode(id) {
  return `TL-${String(id).padStart(4, '0')}`;
}

async function getTools(req, res) {
  try {
    const { search, categoryId, status, location } = req.query;

    const tools = await prisma.tool.findMany({
      where: {
        AND: [
          search ? {
            OR: [
              { name: { contains: search } },
              { code: { contains: search } },
              { brand: { contains: search } },
              { model: { contains: search } }
            ]
          } : {},
          categoryId ? { categoryId: Number(categoryId) } : {},
          status ? { status } : {},
          location ? { location: { contains: location } } : {}
        ]
      },
      include: { category: true, user: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'desc' }
    });

    res.json(tools);
  } catch (error) {
    res.status(500).json({ message: 'Error al listar herramientas.', error: error.message });
  }
}

async function createTool(req, res) {
  try {
    const {
      name,
      description,
      brand,
      model,
      serialNumber,
      quantity,
      minimumQuantity,
      unit,
      location,
      status,
      imageUrl,
      categoryId
    } = req.body;

    if (!name || !categoryId) {
      return res.status(400).json({ message: 'Nombre y categoría son obligatorios.' });
    }

    const created = await prisma.tool.create({
      data: {
        code: `TEMP-${Date.now()}`,
        name,
        description,
        brand,
        model,
        serialNumber,
        quantity: Number(quantity || 1),
        minimumQuantity: Number(minimumQuantity || 1),
        unit: unit || 'unidad',
        location,
        status: status || 'DISPONIBLE',
        imageUrl,
        categoryId: Number(categoryId),
        userId: req.user.id
      }
    });

    const tool = await prisma.tool.update({
      where: { id: created.id },
      data: { code: buildToolCode(created.id) },
      include: { category: true }
    });

    res.status(201).json(tool);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear herramienta.', error: error.message });
  }
}

async function updateTool(req, res) {
  try {
    const { id } = req.params;

    const data = { ...req.body };

    if (data.quantity !== undefined) data.quantity = Number(data.quantity);
    if (data.minimumQuantity !== undefined) data.minimumQuantity = Number(data.minimumQuantity);
    if (data.categoryId !== undefined) data.categoryId = Number(data.categoryId);

    const tool = await prisma.tool.update({
      where: { id: Number(id) },
      data,
      include: { category: true }
    });

    res.json(tool);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar herramienta.', error: error.message });
  }
}

async function deleteTool(req, res) {
  try {
    const { id } = req.params;

    await prisma.tool.delete({
      where: { id: Number(id) }
    });

    res.json({ message: 'Herramienta eliminada correctamente.' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar herramienta.', error: error.message });
  }
}

async function getLowStockTools(req, res) {
  try {
    const tools = await prisma.tool.findMany({
      include: { category: true },
      orderBy: { name: 'asc' }
    });

    const lowStock = tools.filter(tool => tool.quantity < tool.minimumQuantity);

    res.json(lowStock);
  } catch (error) {
    res.status(500).json({ message: 'Error al consultar bajo stock.', error: error.message });
  }
}

module.exports = {
  getTools,
  createTool,
  updateTool,
  deleteTool,
  getLowStockTools
};

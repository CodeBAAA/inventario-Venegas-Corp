const prisma = require('../config/prisma');

async function getCategories(req, res) {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: {
        parent: true,
        _count: { select: { tools: true } }
      }
    });

    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error al listar categorías.', error: error.message });
  }
}

async function createCategory(req, res) {
  try {
    const { name, description, parentId } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'El nombre de la categoría es obligatorio.' });
    }

    const category = await prisma.category.create({
      data: {
        name,
        description,
        parentId: parentId ? Number(parentId) : null
      }
    });

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear categoría.', error: error.message });
  }
}

async function updateCategory(req, res) {
  try {
    const { id } = req.params;
    const { name, description, parentId } = req.body;

    const category = await prisma.category.update({
      where: { id: Number(id) },
      data: {
        name,
        description,
        parentId: parentId ? Number(parentId) : null
      }
    });

    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar categoría.', error: error.message });
  }
}

async function deleteCategory(req, res) {
  try {
    const { id } = req.params;

    await prisma.category.delete({
      where: { id: Number(id) }
    });

    res.json({ message: 'Categoría eliminada correctamente.' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar categoría.', error: error.message });
  }
}

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
};

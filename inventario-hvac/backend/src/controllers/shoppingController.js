const prisma = require('../config/prisma');

async function getShoppingLists(req, res) {
  try {
    const lists = await prisma.shoppingList.findMany({
      where: req.user.role === 'ADMIN' ? {} : { userId: req.user.id },
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(lists);
  } catch (error) {
    res.status(500).json({ message: 'Error al listar compras.', error: error.message });
  }
}

async function createShoppingList(req, res) {
  try {
    const { name, description } = req.body;

    const list = await prisma.shoppingList.create({
      data: {
        name,
        description,
        userId: req.user.id
      },
      include: { items: true }
    });

    res.status(201).json(list);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear lista.', error: error.message });
  }
}

async function addShoppingItem(req, res) {
  try {
    const { listId } = req.params;
    const { toolName, description, quantityNeeded, priority } = req.body;

    const item = await prisma.shoppingListItem.create({
      data: {
        listId: Number(listId),
        toolName,
        description,
        quantityNeeded: Number(quantityNeeded || 1),
        priority: priority || 'MEDIA'
      }
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Error al agregar item.', error: error.message });
  }
}

async function updateShoppingItem(req, res) {
  try {
    const { itemId } = req.params;

    const data = { ...req.body };
    if (data.quantityNeeded !== undefined) data.quantityNeeded = Number(data.quantityNeeded);

    const item = await prisma.shoppingListItem.update({
      where: { id: Number(itemId) },
      data
    });

    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar item.', error: error.message });
  }
}

async function deleteShoppingItem(req, res) {
  try {
    const { itemId } = req.params;

    await prisma.shoppingListItem.delete({
      where: { id: Number(itemId) }
    });

    res.json({ message: 'Item eliminado correctamente.' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar item.', error: error.message });
  }
}

module.exports = {
  getShoppingLists,
  createShoppingList,
  addShoppingItem,
  updateShoppingItem,
  deleteShoppingItem
};

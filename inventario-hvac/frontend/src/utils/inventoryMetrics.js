export function calculateInventoryMetrics({ totalTools, totalCategories, totalUsers, tools }) {
  const lowStock = tools.filter(tool => tool.quantity < tool.minimumQuantity).length;
  const available = tools.filter(tool => tool.status === 'DISPONIBLE').length;
  const damaged = tools.filter(tool => tool.status === 'DANADA').length;
  const lost = tools.filter(tool => tool.status === 'PERDIDA').length;

  const byCategory = {};
  for (const tool of tools) {
    const name = tool.category?.name || 'Sin categoría';
    byCategory[name] = (byCategory[name] || 0) + tool.quantity;
  }

  return {
    totalTools,
    totalCategories,
    totalUsers,
    lowStock,
    available,
    damaged,
    lost,
    byCategory
  };
}

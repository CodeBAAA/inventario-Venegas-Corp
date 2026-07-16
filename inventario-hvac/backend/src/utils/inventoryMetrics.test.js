const { calculateInventoryMetrics } = require('./inventoryMetrics');

describe('calculateInventoryMetrics', () => {
  test('calcula bajo stock, estados y cantidades por categoria', () => {
    const result = calculateInventoryMetrics({
      totalTools: 4,
      totalCategories: 3,
      totalUsers: 1,
      tools: [
        {
          name: 'Manometro digital',
          quantity: 1,
          minimumQuantity: 2,
          status: 'DISPONIBLE',
          category: { name: 'Medicion' }
        },
        {
          name: 'Bomba de vacio',
          quantity: 3,
          minimumQuantity: 1,
          status: 'DISPONIBLE',
          category: { name: 'Equipos' }
        },
        {
          name: 'Taladro inalambrico',
          quantity: 0,
          minimumQuantity: 1,
          status: 'PERDIDA',
          category: { name: 'Electricas' }
        },
        {
          name: 'Pinza amperimetrica',
          quantity: 1,
          minimumQuantity: 1,
          status: 'DANADA',
          category: { name: 'Medicion' }
        }
      ]
    });

    expect(result).toEqual({
      totalTools: 4,
      totalCategories: 3,
      totalUsers: 1,
      lowStock: 2,
      available: 2,
      damaged: 1,
      lost: 1,
      byCategory: {
        Medicion: 2,
        Equipos: 3,
        Electricas: 0
      }
    });
  });
});

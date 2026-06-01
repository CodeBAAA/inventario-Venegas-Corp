const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@hvac.com' },
    update: {},
    create: {
      name: 'Administrador HVAC',
      email: 'admin@hvac.com',
      password,
      role: 'ADMIN'
    }
  });

  const categories = [
    { name: 'Medición', description: 'Manómetros, termómetros, multímetros y herramientas de diagnóstico' },
    { name: 'Instalación', description: 'Herramientas para instalar equipos de aire acondicionado' },
    { name: 'Mantenimiento', description: 'Herramientas para limpieza, revisión y mantenimiento preventivo' },
    { name: 'Refrigeración', description: 'Bomba de vacío, gases, mangueras y accesorios' },
    { name: 'Seguridad', description: 'Guantes, gafas, mascarillas y protección personal' }
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category
    });
  }

  const medicion = await prisma.category.findUnique({ where: { name: 'Medición' } });
  const refrigeracion = await prisma.category.findUnique({ where: { name: 'Refrigeración' } });

  await prisma.tool.upsert({
    where: { code: 'TL-0001' },
    update: {},
    create: {
      code: 'TL-0001',
      name: 'Manómetro digital',
      description: 'Equipo para medir presión en sistemas HVAC',
      brand: 'Testo',
      model: 'Digital',
      quantity: 1,
      minimumQuantity: 1,
      location: 'Taller',
      status: 'DISPONIBLE',
      categoryId: medicion.id,
      userId: admin.id
    }
  });

  await prisma.tool.upsert({
    where: { code: 'TL-0002' },
    update: {},
    create: {
      code: 'TL-0002',
      name: 'Bomba de vacío',
      description: 'Bomba para evacuación de sistemas de refrigeración',
      brand: 'Value',
      model: '2 etapas',
      quantity: 1,
      minimumQuantity: 1,
      location: 'Camioneta',
      status: 'DISPONIBLE',
      categoryId: refrigeracion.id,
      userId: admin.id
    }
  });

  console.log('Seed completado. Usuario: admin@hvac.com / admin123');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

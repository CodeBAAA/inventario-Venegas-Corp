const prisma = require('../config/prisma');

async function getJobTypes(req, res) {
  try {
    const jobTypes = await prisma.jobType.findMany({
      include: {
        items: {
          include: {
            tool: {
              include: {
                category: true
              }
            }
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    res.json(jobTypes);
  } catch (error) {
    res.status(500).json({
      message: 'Error al listar tipos de trabajo.',
      error: error.message
    });
  }
}

async function createJobType(req, res) {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        message: 'El nombre del tipo de trabajo es obligatorio.'
      });
    }

    const jobType = await prisma.jobType.create({
      data: {
        name,
        description
      }
    });

    res.status(201).json(jobType);
  } catch (error) {
    res.status(500).json({
      message: 'Error al crear tipo de trabajo.',
      error: error.message
    });
  }
}

async function updateJobType(req, res) {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const jobType = await prisma.jobType.update({
      where: {
        id: Number(id)
      },
      data: {
        name,
        description
      }
    });

    res.json(jobType);
  } catch (error) {
    res.status(500).json({
      message: 'Error al actualizar tipo de trabajo.',
      error: error.message
    });
  }
}

async function deleteJobType(req, res) {
  try {
    const { id } = req.params;

    await prisma.jobType.delete({
      where: {
        id: Number(id)
      }
    });

    res.json({
      message: 'Tipo de trabajo eliminado correctamente.'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al eliminar tipo de trabajo.',
      error: error.message
    });
  }
}

async function addToolToJobType(req, res) {
  try {
    const { jobTypeId } = req.params;
    const { toolId, quantityNeed, note } = req.body;

    if (!toolId) {
      return res.status(400).json({
        message: 'Debes seleccionar una herramienta.'
      });
    }

    const item = await prisma.jobTypeTool.create({
      data: {
        jobTypeId: Number(jobTypeId),
        toolId: Number(toolId),
        quantityNeed: Number(quantityNeed || 1),
        note
      },
      include: {
        tool: {
          include: {
            category: true
          }
        }
      }
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({
      message: 'Error al agregar herramienta al tipo de trabajo.',
      error: error.message
    });
  }
}

async function removeToolFromJobType(req, res) {
  try {
    const { itemId } = req.params;

    await prisma.jobTypeTool.delete({
      where: {
        id: Number(itemId)
      }
    });

    res.json({
      message: 'Herramienta removida del tipo de trabajo.'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al remover herramienta.',
      error: error.message
    });
  }
}

async function getJobTypeChecklist(req, res) {
  try {
    const { id } = req.params;

    const jobType = await prisma.jobType.findUnique({
      where: {
        id: Number(id)
      },
      include: {
        items: {
          include: {
            tool: {
              include: {
                category: true
              }
            }
          }
        }
      }
    });

    if (!jobType) {
      return res.status(404).json({
        message: 'Tipo de trabajo no encontrado.'
      });
    }

    const checklist = jobType.items.map(item => ({
      itemId: item.id,
      toolId: item.tool.id,
      code: item.tool.code,
      name: item.tool.name,
      category: item.tool.category?.name || 'Sin categoría',
      location: item.tool.location || '-',
      status: item.tool.status,
      quantityAvailable: item.tool.quantity,
      quantityNeed: item.quantityNeed,
      enoughStock: item.tool.quantity >= item.quantityNeed,
      note: item.note || ''
    }));

    res.json({
      id: jobType.id,
      name: jobType.name,
      description: jobType.description,
      checklist
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al generar checklist.',
      error: error.message
    });
  }
}

module.exports = {
  getJobTypes,
  createJobType,
  updateJobType,
  deleteJobType,
  addToolToJobType,
  removeToolFromJobType,
  getJobTypeChecklist
};
import { PrismaClient } from '@prisma/client'; // Оновлений стандартний імпорт

const prisma = new PrismaClient();

export const getAnnouncements = async (req, res, next) => {
  try {
    const { search, sort = 'newest', page = 1 } = req.query;

    const perPage = 10;
    const pageNum = Number(page);

    const where = {};

    if (search) {
      where.title = {
        contains: search,
      };
    }

    let orderBy = {
      createdAt: 'desc',
    };

    if (sort === 'oldest') {
      orderBy = {
        createdAt: 'asc',
      };
    }

    const [announcements, total] = await Promise.all([
      prisma.announcement.findMany({
        where,
        orderBy,
        skip: (pageNum - 1) * perPage,
        take: perPage,
        include: {
          user: {
            select: {
              id: true,
              username: true,
              name: true,
            },
          },
        },
      }),

      prisma.announcement.count({
        where,
      }),
    ]);

    res.json({
      data: announcements,
      pagination: {
        total,
        page: pageNum,
        totalPages: Math.ceil(total / perPage),
        perPage,
      },
    });
  } catch (err) {
    next(err);
  }
};

export async function getAnnouncementById(req, res, next) {
  try {
    const id = Number(req.params.id);

    const announcement = await prisma.announcement.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
          },
        },
      },
    });

    if (!announcement) {
      return res.status(404).json({
        error: 'Announcement not found'
      });
    }

    res.json(announcement);

  } catch (err) {
    next(err);
  }
}

export async function createAnnouncement(req, res, next) {
  try {
    const { title, description, price, category, contactInfo } = req.body;

    const errors = {};
    const validCategories = ['sale', 'service', 'job', 'other'];

    if (!title || title.trim().length < 5) {
      errors.title = 'Назва має бути не менше 5 символів';
    }

    if (!description || description.trim().length < 10) {
      errors.description = 'Опис має бути не менше 10 символів';
    }

    if (!contactInfo || contactInfo.trim().length < 5) {
      errors.contactInfo = 'Контакти мають бути не менше 5 символів';
    }

    if (!validCategories.includes(category)) {
      errors.category = 'Оберіть категорію';
    }

    if (!price || isNaN(price) || Number(price) <= 0) {
      errors.price = 'Ціна має бути додатним числом';
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        errors,
      });
    }

    const announcement = await prisma.announcement.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        price: Number(price),
        category,
        contactInfo: contactInfo.trim(),
        userId: req.user.id,
      },
    });

    res.status(201).json(announcement);
  } catch (err) {
    next(err);
  }
}

export async function updateAnnouncement(req, res, next) {
  try {
    const id = Number(req.params.id);
    const { title, description, price, category, contactInfo } = req.body;

    const announcement = await prisma.announcement.findUnique({
      where: { id },
    });

    if (!announcement) {
      return res.status(404).json({
        error: 'Announcement not found',
      });
    }

    if (announcement.userId !== req.user.id) {
      return res.status(403).json({
        error: 'Access denied',
      });
    }

    // Оновлюємо безпечно, захищаючи службові поля бази
    const updated = await prisma.announcement.update({
      where: { id },
      data: {
        ...(title && { title: title.trim() }),
        ...(description && { description: description.trim() }),
        ...(price && { price: Number(price) }),
        ...(category && { category }),
        ...(contactInfo && { contactInfo: contactInfo.trim() }),
      },
    });

    res.json(updated);
  } catch (err) {
    next(err);
  }
}

export async function deleteAnnouncement(req, res, next) {
  try {
    const id = Number(req.params.id);

    const announcement = await prisma.announcement.findUnique({
      where: { id },
    });

    if (!announcement) {
      return res.status(404).json({
        error: 'Announcement not found',
      });
    }

    if (announcement.userId !== req.user.id) {
      return res.status(403).json({
        error: 'Access denied',
      });
    }

    await prisma.announcement.delete({
      where: { id },
    });

    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
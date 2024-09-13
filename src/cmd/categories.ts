//
// Description: This file contains the script to create categories in the database.
// It uses the Prisma client to interact with the database and creates multiple categories with predefined names.
// To run this script, use the following command:
// npx ts-node src/categories.ts
//

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const createCategories = async () => {
  try {
    const categories = await prisma.category.createMany({
      data: [
        { name: 'Programming' },
        { name: 'Health' },
        { name: 'Education' },
        { name: 'Lifestyle' },
        { name: 'Technology' },
        { name: 'Science' },
        { name: 'Business' },
        { name: 'Entertainment' },
        { name: 'Sports' },
        { name: 'Travel' },
        { name: 'Food' },
        { name: 'News' },
        { name: 'Music' },
        { name: 'Movies' },
        { name: 'Books' },
        { name: 'Fashion' },
        { name: 'Art' },
        { name: 'Design' },
        { name: 'Photography' },
        { name: 'Gaming' },
        { name: 'Fitness' },
        { name: 'Parenting' },
        { name: 'Home' },
        { name: 'Gardening' },
        { name: 'DIY' },
        { name: 'Auto' },
        { name: 'Outdoors' },
        { name: 'Pets' },
        { name: 'Crafts' },
        { name: 'Beauty' },
        { name: 'Wedding' },
        { name: 'Dating' },
        { name: 'Relationships' },
        { name: 'Family' },
        { name: 'Self-Improvement' },
        { name: 'Spirituality' },
        { name: 'History' },
        { name: 'Culture' },
        { name: 'Language' },
        { name: 'Politics' },
        { name: 'Philosophy' },
        { name: 'Psychology' },
        { name: 'Sociology' },
        { name: 'Economics' },
        { name: 'Marketing' },
        { name: 'Management' },
        { name: 'Leadership' },
        { name: 'Productivity' },
        { name: 'Motivation' },
        { name: 'Inspiration' },
        { name: 'Creativity' },
        { name: 'Innovation' },
        { name: 'Startups' },
        { name: 'Entrepreneurship' },
        { name: 'Freelancing' },
        { name: 'Remote Work' },
        { name: 'Work-Life Balance' },
        { name: 'Career' },
        { name: 'Job Search' },
        { name: 'Interviews' },
      ]
    });

    console.log(`${categories.count} categories created`);
  } catch (error) {
    console.error('Error creating categories:', error);
  } finally {
    await prisma.$disconnect();
  }
};

// Invoke the function
createCategories();

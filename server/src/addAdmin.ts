//
// This script adds an admin role to a user by creating an Admin record and linking it to the User record.
// It uses the Prisma client to interact with the database.
// To run this script, use the following command:
// npx ts-node src/addAdmin.ts
//

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// npx ts-node src/addAdmin.ts 

async function updateUserToAdmin(userId: string) {
  try {
    // Create or ensure the Admin record exists
    const admin = await prisma.admin.upsert({
      where: { userId },
      update: {},
      create: { userId },
    });

    // Update the User record to link with Admin
    await prisma.user.update({
      where: { id: userId },
      data: { adminId: admin.id },
    });

    console.log(`User with ID ${userId} is now an admin.`);
  } catch (error) {
    console.error('Error updating user to admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateUserToAdmin('cm0wm8st3000061u1d422cd4i');

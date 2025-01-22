import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding test data...");

  const hashedPassword1 = bcrypt.hashSync("Test123!", 10);
  const hashedPassword2 = bcrypt.hashSync("Password1!", 10);

  await prisma.user.createMany({
    data: [
      {
        name: "Test User",
        email: "test@example.com",
        password: hashedPassword1,
        profilePicture: "/default-profile.png",
      },
      {
        name: "Example User",
        email: "user@example.com",
        password: hashedPassword2,
        profilePicture: "/default-profile.png",
      },
    ],
    skipDuplicates: true,
  });

  console.log("Seeding completed!");

  await prisma.$disconnect();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });

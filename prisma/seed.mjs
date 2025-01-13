import { PrismaClient } from "@prisma/client";
import {hashSync} from "bcrypt-ts";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding test data...");

  const hashedPassword1 = hashSync("Test123!");
  const hashedPassword2 = hashSync("Password1!");

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

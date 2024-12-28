import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { authOptions } from "@/lib/auth";

const uploadDir = path.join(process.cwd(), "public/uploads/profile-pictures");

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Nie jesteś zalogowany." },
        { status: 401 },
      );
    }

    const userId = parseInt(session.user.id, 10);
    const formData = await request.formData();
    const newName = formData.get("name") as string | null;
    const file = formData.get("file") as File | null;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json(
        { error: "Użytkownik nie istnieje." },
        { status: 404 },
      );
    }

    let newProfilePicture = user.profilePicture;

    if (file) {
      const filename = `${uuidv4()}-${file.name}`;
      const filepath = path.join(uploadDir, filename);

      await fs.mkdir(uploadDir, { recursive: true });
      await fs.writeFile(filepath, Buffer.from(await file.arrayBuffer()));

      if (
        user.profilePicture &&
        user.profilePicture !== "/default-profile.png"
      ) {
        const oldFilePath = path.join(
          process.cwd(),
          "public",
          user.profilePicture,
        );
        await fs.unlink(oldFilePath).catch(() => {});
      }

      newProfilePicture = `/uploads/profile-pictures/${filename}`;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: newName || user.name,
        profilePicture: newProfilePicture,
      },
    });

    return NextResponse.json({
      message: "Profil zaktualizowany.",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Błąd podczas aktualizacji profilu:", error);
    return NextResponse.json(
      { error: "Błąd podczas aktualizacji profilu." },
      { status: 500 },
    );
  }
}

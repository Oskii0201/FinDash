import { NextResponse } from "next/server";
import { hashSync } from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, password } = body;

  if (!name || !email || !password) {
    return NextResponse.json(
      { error: "Wszystkie pola są wymagane." },
      { status: 400 },
    );
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email już zarejestrowany." },
        { status: 400 },
      );
    }

    const hashedPassword = hashSync(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    return NextResponse.json(
      {
        message: "Użytkownik zarejestrowany pomyślnie!",
        user,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Błąd podczas rejestracji:", error);
    return NextResponse.json(
      { error: "Wystąpił błąd podczas rejestracji." },
      { status: 500 },
    );
  }
}

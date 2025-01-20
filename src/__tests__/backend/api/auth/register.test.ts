import { prismaMock } from "@/__mocks__/prisma";
import { POST } from "@/app/api/auth/register/route";
import { NextResponse } from "next/server";
jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  default: prismaMock,
}));
jest.mock("bcrypt", () => ({
  hashSync: jest.fn().mockReturnValue("mockedHashedPassword"),
}));
jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn(),
  },
}));
const mockNextResponseJson = NextResponse.json as jest.Mock;
describe("POST /api/auth/register", () => {
  it("should create a new user for valid data", async () => {
    const createdAt = new Date();
    const updatedAt = new Date();
    prismaMock.user.findUnique.mockResolvedValue(null);
    prismaMock.user.create.mockResolvedValue({
      id: 1,
      name: "Test User",
      email: "test@example.com",
      password: "hashedpassword",
      profilePicture: null,
      createdAt: createdAt,
      updatedAt: updatedAt,
    });

    const body = JSON.stringify({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    });

    const request = new Request("http://localhost/api/auth/register", {
      method: "POST",
      body,
    });

    await POST(request);

    expect(mockNextResponseJson).toHaveBeenCalledWith(
      {
        message: "Użytkownik zarejestrowany pomyślnie!",
        user: {
          id: 1,
          name: "Test User",
          email: "test@example.com",
          password: "hashedpassword",
          profilePicture: null,
          createdAt: createdAt,
          updatedAt: updatedAt,
        },
      },
      { status: 200 },
    );
  });

  it("should return 400 for already registered email", async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      id: 1,
      name: "Existing User",
      email: "test@example.com",
      password: "hashedpassword",
      profilePicture: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const body = JSON.stringify({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    });

    const request = new Request("http://localhost/api/auth/register", {
      method: "POST",
      body,
    });

    await POST(request);

    expect(mockNextResponseJson).toHaveBeenCalledWith(
      { error: "Email już zarejestrowany." },
      { status: 400 },
    );
  });
});

import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    email: string | null;
    name: string | null;
  }

  interface Session extends DefaultSession {
    user: {
      id: string;
      email: string | undefined;
      name?: string | undefined;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string | undefined;
    name: string | undefined;
  }
}

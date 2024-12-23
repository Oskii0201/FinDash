"use client";
import { toast } from "react-toastify";
import React, { useState } from "react";
import { FaLock, FaUser } from "react-icons/fa";
import { Button } from "@/components/Button";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      toast.error("Nieprawidłowy email lub hasło.");
    } else {
      toast.success("Zalogowano pomyślnie!");
      router.push("/dashboard");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      <div className="relative">
        <FaUser className="absolute left-3 top-1/3 text-gray-400" />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full rounded-md bg-gray-800 px-10 py-3 text-offWhite placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600"
          required
        />
      </div>

      <div className="relative">
        <FaLock className="absolute left-3 top-1/3 text-gray-400" />
        <input
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Hasło"
          className="w-full rounded-md bg-gray-800 px-10 py-3 text-offWhite placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600"
          required
        />
      </div>

      <div className="flex flex-col items-center space-y-2 text-gray-400">
        <div className="flex w-full items-center justify-between">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
              className="form-checkbox h-4 w-4 text-green-500"
            />
            <span className="text-sm">Pokaż hasło</span>
          </label>
          <a href="#" className="text-sm hover:underline">
            Zapomniałeś hasła?
          </a>
        </div>
        <a
          href="/register"
          className="mt-2 text-center text-sm text-gray-400 hover:text-mutedGreen hover:underline"
        >
          Nie masz konta? Dołącz do Nas!
        </a>
      </div>

      <Button color="green" type="submit" additionalClasses="uppercase">
        Zaloguj
      </Button>
    </form>
  );
};

export default LoginForm;

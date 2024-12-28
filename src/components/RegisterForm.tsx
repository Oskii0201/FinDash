"use client";
import React, { useState } from "react";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";

const RegisterForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || "Wystąpił błąd.");
      }

      toast.success("Rejestracja zakończona sukcesem!");
      router.push("/login");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Wystąpił błąd.");
    }
  };

  return (
    <form onSubmit={handleRegister} className="flex flex-col space-y-4">
      <div className="relative">
        <FaUser className="absolute left-3 top-1/3 text-gray-400" />
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Imię"
          className="w-full rounded-md bg-gray-800 px-10 py-3 text-offWhite placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600"
          required
        />
      </div>

      <div className="relative">
        <FaEnvelope className="absolute left-3 top-1/3 text-gray-400" />
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
        </div>
        <a
          href="/login"
          className="mt-2 text-center text-sm text-gray-400 hover:text-mutedGreen hover:underline"
        >
          Masz już konto? Zaloguj się!
        </a>
      </div>

      <Button color="green" type="submit" additionalClasses="uppercase">
        Zarejestruj się
      </Button>
    </form>
  );
};

export default RegisterForm;

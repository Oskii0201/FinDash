import React from "react";
import { FaUser } from "react-icons/fa";
import RegisterForm from "@/components/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="from-darkNavy flex min-h-screen w-full items-center justify-center bg-gradient-to-tl via-gray-700 to-gray-800">
      <div className="rounded-xl bg-white/10 bg-opacity-20 p-8 shadow-lg backdrop-blur-md md:w-96">
        <div className="mb-6 flex justify-center">
          <div className="flex items-center justify-center rounded-full bg-green-700 p-4">
            <FaUser className="text-offWhite text-4xl" />
          </div>
        </div>

        <h2 className="text-offWhite mb-6 text-center text-2xl font-semibold">
          Zarejestruj się
        </h2>
        <RegisterForm />
      </div>
    </div>
  );
}

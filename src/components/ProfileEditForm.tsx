"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { Button } from "@/components/Button";

export default function ProfileEditForm() {
  const { data: session, update } = useSession();
  const [name, setName] = useState(session?.user?.name || "");
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    if (file) {
      formData.append("file", file);
    }

    const response = await fetch("/api/user/edit", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (response.ok) {
      setMessage("Profil zaktualizowany!");
      await update();
    } else {
      setMessage(data.error || "Wystąpił błąd.");
    }
    toast.success(message);
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium">
          Imię
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block max-w-6xl rounded border-gray-300 shadow-sm"
        />
      </div>
      <div>
        <label htmlFor="file" className="block text-sm font-medium">
          Zdjęcie profilowe
        </label>
        <input
          id="file"
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="mt-1 block w-full text-sm"
        />
      </div>
      <Button type="submit" color="blue" width="w-fit">
        Zapisz zmiany
      </Button>
    </form>
  );
}

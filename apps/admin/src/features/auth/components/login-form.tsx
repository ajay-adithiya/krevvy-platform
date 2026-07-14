"use client";

import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { login } from "../auth.service";
import { loginSchema, LoginSchema } from "../login.schema";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function LoginForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginSchema) {
    try {
      const response = await login(data);

      Cookies.set(
        "accessToken",
        response.data.accessToken,
      );

      router.push("/dashboard");
    } catch {
      alert("Invalid Credentials");
    }
  }

  return (
    <Card className="mx-auto mt-32 w-[400px] p-8">

      <h1 className="mb-6 text-3xl font-bold">
        Krevvy Admin
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >

        <Input
          placeholder="Email"
          {...register("email")}
        />

        {errors.email && (
          <p className="text-red-500 text-sm">
            {errors.email.message}
          </p>
        )}

        <Input
          type="password"
          placeholder="Password"
          {...register("password")}
        />

        {errors.password && (
          <p className="text-red-500 text-sm">
            {errors.password.message}
          </p>
        )}

        <Button
          className="w-full"
          disabled={isSubmitting}
        >
          Login
        </Button>

      </form>

    </Card>
  );
}
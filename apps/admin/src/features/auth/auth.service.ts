import api from "@/lib/api";
import { LoginSchema } from "./login.schema";

export function login(data: LoginSchema) {
  return api.post("/auth/login", data);
}
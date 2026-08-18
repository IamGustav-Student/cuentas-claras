import axios from "axios";
import { env } from "@/config/env";

// Cliente HTTP único para toda la app (REST contra server/, ver docs/04-arquitectura.md).
export const httpClient = axios.create({
  baseURL: env.apiUrl,
  timeout: 10000,
});

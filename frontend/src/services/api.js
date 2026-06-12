import axios from "axios";

/**
 * Cliente HTTP centralizado.
 * Centraliza a URL do backend num lugar so — basta mudar aqui se
 * o backend mudar de porta ou de host.
 *
 * O endpoint /usuarios/login do backend retorna 401 quando email/senha
 * nao batem; o frontend trata isso na tela de Login.
 */
const api = axios.create({
  baseURL: "http://localhost:8080",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

export default api;

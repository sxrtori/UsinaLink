(function () {
  const BASE_URL = "http://localhost:3001";

  async function request(path, options = {}) {
    try {
      const response = await fetch(`${BASE_URL}${path}`, {
        headers: {
          "Content-Type": "application/json",
          ...(options.headers || {})
        },
        ...options
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        const message = data.errors?.join(" ") || data.message || "Nao foi possivel concluir a requisicao.";
        throw new Error(message);
      }
      return data;
    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error("Nao foi possivel conectar ao servidor. Verifique se o backend esta rodando.");
      }
      throw error;
    }
  }

  window.UsinaLinkApi = {
    BASE_URL,
    get: (path) => request(path),
    post: (path, body) => request(path, { method: "POST", body: JSON.stringify(body) }),
    patch: (path, body) => request(path, { method: "PATCH", body: JSON.stringify(body) }),
    put: (path, body) => request(path, { method: "PUT", body: JSON.stringify(body) }),
    delete: (path) => request(path, { method: "DELETE" })
  };
}());

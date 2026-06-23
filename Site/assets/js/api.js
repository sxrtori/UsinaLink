(function () {
  const API_BASE_URL = 'http://localhost:3000/api';

  function buildUrl(path) {
    const cleanPath = String(path || '').replace(/^\/api(?=\/|$)/, '').replace(/^\/?/, '/');
    return `${API_BASE_URL}${cleanPath}`;
  }

  function extractErrorMessage(data) {
    if (Array.isArray(data?.message)) return data.message.join(' ');
    if (Array.isArray(data?.errors)) return data.errors.join(' ');
    return data?.message || data?.error || 'Nao foi possivel concluir a requisicao.';
  }

  async function request(path, options = {}) {
    const response = await fetch(buildUrl(path), {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(localStorage.getItem('accessToken') ? { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } : {}),
        ...(options.headers || {})
      }
    }).catch((error) => {
      throw new Error('Nao foi possivel conectar ao servidor. Verifique se o backend esta rodando.', { cause: error });
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(extractErrorMessage(data));
    }
    return data;
  }

  window.UsinaLinkApi = {
    API_BASE_URL,
    BASE_URL: API_BASE_URL,
    buildUrl,
    get: (path) => request(path),
    post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
    patch: (path, body) => request(path, { method: 'PATCH', body: JSON.stringify(body) }),
    put: (path, body) => request(path, { method: 'PUT', body: JSON.stringify(body) }),
    delete: (path) => request(path, { method: 'DELETE' })
  };
}());

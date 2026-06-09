(function () {
  const protectedRole = document.body?.dataset.userRole;
  if (!protectedRole) return;

  const session = JSON.parse(sessionStorage.getItem("usinalinkSession") || localStorage.getItem("usinalinkSession") || "null");
  if (session?.tipo === protectedRole) return;

  const loginByRole = {
    empresa: "login-empresa.html",
    usina: "login-usina.html",
    "pessoa-fisica": "login.html"
  };

  window.location.href = loginByRole[protectedRole] || "login.html";
}());

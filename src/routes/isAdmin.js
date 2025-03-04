function isAdminSite(req, res, next) {
  if (!req.user.admin) {
    return res.redirect("/disponivel");
  }
  next();
}

function isAdminApi(req, res, next) {
  if (!req.user.admin) {
    res.status(403).json({ error: "O usuario não está logado" });
  }
  next();
}

export { isAdminSite, isAdminApi };

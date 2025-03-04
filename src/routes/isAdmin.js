function isAdminSite(req, res, next) {
  //http://localhost:4000/disponivel/
  if (!req.user.admin) {
    return res.send(
      "<script>window.location.href =  'http://localhost:4000/' + 'disponivel';</script>"
    );
  }
  next();
}

function isAdminApi(req, res, next) {
  console.log(req.user);
}

export { isAdminSite, isAdminApi };

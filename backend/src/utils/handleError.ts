export default (err, res) => {
  if (!err.status) {
    err.status = 500;
  }

  if (!err.msg) {
    err.msg = err.message;
  }

  console.error(err);

  res.status(err.status).send({
    msg: err.msg
  });
};

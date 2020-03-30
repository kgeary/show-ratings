const errorHandler = (err, req, res, next) => {
  console.error("Error Handler");
  console.error(err.message)

  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    return res.status(400).send({ error: 'malformatted id' });
  }

  next(err)
}

module.exports = {
  errorHandler,
}
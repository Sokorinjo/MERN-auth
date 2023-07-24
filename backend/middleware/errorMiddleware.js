//Default Express handler is an HTML page
//So we make custom error handlers which will return json object
//that has an error message

//Catch all for routes
const notFound = (req, res, next) => {
  const error = new Error(`Not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

//Catch all for errors
const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  //for mongoose Cast error
  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 404;
    message = "Resource not found";
  }

  res
    .status(statusCode)
    .json({
      message,
      stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
};

export {notFound, errorHandler}

class ErrorHandler extends Error {
  constructor(message, statuscode) {
    super(message);
    this.statuscode = statuscode;
  }
}
export const errorMiddleware = (err, req, res, next) => {
  err.message = err.message || "internal server error";
  if (err.name == "CaseError") {
    const message = `Resource not found.invalid ${err.path}`;
    err = new ErrorHandler(message, 400);
  }
  if (err.code === 11000) {
    const message = `duplicate ${Object.keys(err.keyValue)}Entered`;
    err = new ErrorHandler(message, 400);
  }
  if (err.name == "JsonWebTokenError") {
    const message = `Jsonwebtoken is invalid`;
    err = new ErrorHandler(message, 400);
  }
  if (err.name === "TokenExpiredError") {
    const message = `Json web token is expired`;
    err = new ErrorHandler(message, 400);
  }
  return res.status(err.statuscode || 500).json({
    success: false,
    message: err.message,
  });
};
export default ErrorHandler;

const response = (res, { payload = null, msg = "", statusCode = 200, error = "" }) => {
  try {
    return res.status(statusCode).json({
      payload,
      message: msg,
      error,
      status: statusCode,
    });
  } catch (err) {
    return res.status(500).json({
      payload: null,
      message: "Internal server error",
      error: err.message || err,
      status: 500,
    });
  }
};

module.exports = {
  response,
};

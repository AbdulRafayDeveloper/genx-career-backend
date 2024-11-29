export const successResponse = (res, message, data) => {
  return res.status(200).json({
    status: 200,
    message: message,
    data: data,
  });
};

export const badRequestResponse = (res, message, data) => {
  return res.status(400).json({
    status: 400,
    message: message,
    data: data,
  });
};

export const notFoundResponse = (res, message, data) => {
  return res.status(404).json({
    status: 404,
    message: message,
    data: data,
  });
};

export const conflictResponse = (res, message, data) => {
  return res.status(409).json({
    status: 409,
    message: message,
    data: data,
  });
};

export const unsupportedMediaTypeResponse = (res, message, data) => {
  return res.status(415).json({
    status: 415,
    message: message,
    data: data,
  });
};

export const serverErrorResponse = (res, message) => {
  return res.status(500).json({
    status: 500,
    message: message,
  });
};

export const unauthorizedResponse = (res, message) => {
  return res.status(401).json({
    status: 401,
    message: message,
  });
};

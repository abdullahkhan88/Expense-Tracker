
import jwt from "jsonwebtoken";

const verifyTokenGuard = (req, res, next) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      return res.status(401).send({
        message: "Authorization token required",
      });
    }

    const [type, token] = authorization.split(" ");

    if (type !== "Bearer" || !token) {
      return res.status(401).send({
        message: "Invalid authorization format",
      });
    }

    const payload = jwt.verify(
      token,
      process.env.FORGOT_TOKEN_SECRET
    );

    req.user = payload;
    return next();
  } catch (err) {
    return res.status(401).send({
      message: "Invalid or expired token",
    });
  }
};

const invalid = (res) => {
  res.cookie("AuthToken", "", {
    httpOnly: true,
    secure: process.env.ENVIRONMENT !== "DEV",
    sameSite:
      process.env.ENVIRONMENT === "DEV" ? "lax" : "none",
    path: "/",
    maxAge: 0,
  });

  return res.status(401).send({
    message: "Invalid or expired authentication",
  });
};

const AdminUserGuard = (req, res, next) => {
  try {
    const { AuthToken } = req.cookies || {};

    if (!AuthToken) {
      return invalid(res);
    }

    const payload = jwt.verify(
      AuthToken,
      process.env.AUTH_SECRET
    );

    if (payload.role !== "user" && payload.role !== "admin") {
      return invalid(res);
    }

    req.user = payload;
    return next();
  } catch (err) {
    return invalid(res);
  }
};

const AdminGuard = (req, res, next) => {
  try {
    const { AuthToken } = req.cookies || {};

    if (!AuthToken) {
      return invalid(res);
    }

    const payload = jwt.verify(
      AuthToken,
      process.env.AUTH_SECRET
    );

    if (payload.role !== "admin") {
      return invalid(res);
    }

    req.user = payload;
    return next();
  } catch (err) {
    return invalid(res);
  }
};

export {
  AdminUserGuard,
  AdminGuard,
  verifyTokenGuard,
};

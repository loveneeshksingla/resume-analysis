import User from "../modules/auth/user.model.js";
import AppError from "../shared/errors/AppError.js";
import asyncHandler from "../shared/utils/asyncHandler.js";
import * as tokenService from "../modules/auth/token.service.js";

export const protect = asyncHandler(async (req, res, next) => {
    let token;

    // 1️⃣ Extract token
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        throw new AppError("Not authorized, no token", 401);
    }

    // 2️⃣ Verify token
    const decoded = tokenService.verifyAccessToken(token);

    // 3️⃣ Fetch user from DB
    const user = await User.findById(decoded.id);

    if (!user) {
        throw new AppError("User no longer exists", 401);
    }

    // 4️⃣ Attach user to request
    req.user = user;

    next();
});


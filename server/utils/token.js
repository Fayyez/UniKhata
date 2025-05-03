import jwt from "jsonwebtoken";

const ACCESS_TOKEN_EXPIRY = '1h';
const REFRESH_TOKEN_EXPIRY = '7d';

export const generateTokens = (user) => {
    const accessToken = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: ACCESS_TOKEN_EXPIRY }
    );

    const refreshToken = jwt.sign(
        { id: user._id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: REFRESH_TOKEN_EXPIRY }
    );

    return { accessToken, refreshToken };
};

export const verifyToken = (token, isRefresh = false) => {
    try {
        return jwt.verify(
            token,
            isRefresh ? process.env.JWT_REFRESH_SECRET : process.env.JWT_SECRET
        );
    } catch (error) {
        throw error;
    }
};

export const refreshAccessToken = (refreshToken) => {
    try {
        const decoded = verifyToken(refreshToken, true);
        const newAccessToken = jwt.sign(
            { id: decoded.id },
            process.env.JWT_SECRET,
            { expiresIn: ACCESS_TOKEN_EXPIRY }
        );
        return newAccessToken;
    } catch (error) {
        throw error;
    }
};

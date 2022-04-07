const jwt = require('jsonwebtoken')

const jwtConfig = {
    secret: "thisissecrekey",
    refreshTokenSecret: "thisisrefreshkey",
    expireTime: 30*60,
    refreshTokenExpireTime: 30*60*60
}

exports.generateAccessToken = (user) => {
    const payload = {user}
    const accessToken = jwt.sign(payload,jwtConfig.secret,{expiresIn: jwtConfig.expireTime})
    return accessToken
}

exports.generateRefreshToken = (user) => {
    const payload = {user}
    const refreshToken = jwt.sign(payload,jwtConfig.refreshTokenSecret,{expiresIn: jwtConfig.refreshTokenExpireTime})
    return refreshToken
}

exports.verifyJWTToken = (token) => {
    const data = jwt.verify(token,jwtConfig.secret)
    return data
}

exports.verifyRefreshToken = (token) => {
    const data = jwt.verify(token,jwtConfig.refreshTokenSecret)
    return data
}
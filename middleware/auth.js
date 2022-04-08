const jwt = require('jsonwebtoken')

const jwtConfig = {
    secret: "thisissecrekey",
    refreshTokenSecret: "thisisrefreshkey",
    expireTime: 30 * 60,
    refreshTokenExpireTime: 30 * 60 * 60
}

exports.generateAccessToken = (user) => {
    const payload = { user }
    const accessToken = jwt.sign(payload, jwtConfig.secret, { expiresIn: jwtConfig.expireTime })
    return accessToken
}

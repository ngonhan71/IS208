const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authorizationHeader = req.headers['authorization']
    if (!authorizationHeader) return res.status(401).json({message: '401 Unauthorized'})

    const token = authorizationHeader.split(' ')[1]
    if (!token) return res.status(401).json({message: '401 Unauthorized'})

    jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET, async (err, user) => {
        if (err) return res.status(403).json({message: '403 Forbidden'})
        
        req.user = user
        next()
    })
}

const isAdmin = (req, res, next) => {
    const { role } = req.user
    if (role > 0) {
        next()
    } else {
        return res.status(403).json({message: '403 Forbidden'})
    }
}

module.exports = { verifyToken, isAdmin }

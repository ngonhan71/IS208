const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authorizationHeader = req.headers['authorization']
    if (!authorizationHeader) return res.status(401).json({message: '401 Unauthorized'})

    const token = authorizationHeader.split(' ')[1]
    if (!token) return res.status(401).json({message: '401 Unauthorized'})

    jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET, async (err, user) => {
        if (err) return res.status(403).json({message: '403 Forbidden'})
        const { userId, role } = user
        req.user = {userId: userId, role: role || 0}
        next()
    })
}

const checkRole = (permissions) => {
    return (req, res, next) => {
        const id = req.params.userId || req.query.userId
        const { role, userId } = req.user
        if (!permissions.includes(role) && id !== userId) return res.status(403).json({status: "error", error: 'Bạn không đủ quyền!!'})
        next()
    }
}

const isAdmin = (req, res, next) => {
    const { role } = req.user
    if (role > 0) {
        next()
    } else {
        return res.status(403).json({message: '403 Forbidden'})
    }
}


const roleEnum = {
    Customer: 0,
    Staff: 1,
    Admin: 2
}

module.exports = { verifyToken, isAdmin, checkRole, roleEnum }

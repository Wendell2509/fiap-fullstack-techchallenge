const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'Token não fornecido.' });
    }

    const parts = authHeader.split(' ');

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json({ message: 'Erro no formato do token.' });
    }

    const token = parts[1];
    const secret = process.env.JWT_SECRET || 'secret_key_default';

    try {
        const decoded = jwt.verify(token, secret);
        req.user = decoded;
        return next();
    } catch (err) {
        return res.status(401).json({ message: 'Token inválido ou expirado.' });
    }
};

// NOVO: Middleware para validar se o usuário possui o perfil necessário
const authorizeRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(403).json({ message: 'Acesso negado. Perfil de usuário não informado.' });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Acesso negado. Permissão insuficiente.' });
        }

        return next();
    };
};

module.exports = {
    authMiddleware,
    authorizeRole
};
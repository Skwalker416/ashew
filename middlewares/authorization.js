// const jwt = require('jsonwebtoken');
// const { default: mongoose } = require('mongoose');

// async function authorizePostRequests(req, res, next) {
//     if (req.method !== 'POST') return next();
//     const API = process.env.API_URL;
//     if (req.originalUrl.startsWith(`${API}/admin`)) return next();

//     const endpoints = [
//         `${API}/login`,
//         `${API}/register`,
//         `${API}/forgot-password`,
//         `${API}/verify-otp`,
//         `${API}/reset-password`,
//     ];

//     const isMatchingEndpoint = endpoints.some((endpoint) =>
//         req.originalUrl.includes(endpoint)
//     );

//     if (isMatchingEndpoint) return next();

//     const message =
//         "User conflict!\nThe user making the request doesn't match the user in the request.";

//     const authHeader = req.header('Authorization');

//     if (!authHeader) return next();
//     const accessToken = authHeader.replace('Bearer', '').trim();
//     const tokenData = jwt.decode(accessToken);

//     if (req.body.user && tokenData.id !== req.body.user) {
//         return res.status(401).json({ message });
//     } else if (/\/users\/([^/]+)\//.test(req.originalUrl)) {
//         const parts = req.originalUrl.split('/');
//         const usersIndex = parts.indexOf('users');

//         const id = parts[usersIndex + 1];
//         if (!mongoose.isValidObjectId(id)) return next();
//         if (tokenData.id !== id) return res.status(401).json({ message });
//     } else if (req.body.vendor && tokenData.id !== req.body.vendor) {
//         return res.status(401).json({ message });
//     } else if (/\/vendors\/([^/]+)\//.test(req.originalUrl)) {
//         const parts = req.originalUrl.split('/');
//         const vendorsIndex = parts.indexOf('vendors');

//         const id = parts[vendorsIndex + 1];
//         if (!mongoose.isValidObjectId(id)) return next();
//         if (tokenData.id !== id) return res.status(401).json({ message });
//     } else if (req.body.eventOrganizer && tokenData.id !== req.body.eventOrganizer) {
//         return res.status(401).json({ message });
//     } else if (/\/eventOrganizers\/([^/]+)\//.test(req.originalUrl)) {
//         const parts = req.originalUrl.split('/');
//         const eventOrganizersIndex = parts.indexOf('eventOrganizers');

//         const id = parts[eventOrganizersIndex + 1];
//         if (!mongoose.isValidObjectId(id)) return next();
//         if (tokenData.id !== id) return res.status(401).json({ message });
//     }
//     return next();
// }



// module.exports = authorizePostRequests;

// // this is a work in theory where users will be authorized for post requests
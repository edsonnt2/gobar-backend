export default {
  secret: process.env.SECRET_JWT || 'not-env',
  expiresIn: '1d',
};

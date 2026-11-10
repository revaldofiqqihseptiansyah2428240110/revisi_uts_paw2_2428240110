function cekApiKey(req, res, next) {
  const apiKey = req.headers['x-api-key'];
  const configuredKey = process.env.API_KEY;

  if (!configuredKey || apiKey !== configuredKey) {
    return res.status(401).json({ message: 'API key tidak valid atau belum dikonfigurasi' });
  }
  next();
}

module.exports = cekApiKey;

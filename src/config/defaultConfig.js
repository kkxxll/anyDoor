module.exports = {
  root: process.cwd(),
  hostname: '127.0.0.1',
  port: 7777,
  compress: /\.(html|js|css|md)/,
  cache: {
    maxAge: 600, //1分钟600秒.
    expires: true,
    cacheControl: true,
    lastModified: true,
    etag: true
  }
}

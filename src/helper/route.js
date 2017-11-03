const fs = require('fs')
const path = require('path')
const Handlebars = require('handlebars')
const promisify = require('util').promisify
const stat = promisify(fs.stat)
const readdir = promisify(fs.readdir)
// const config = require('../config/defaultConfig')
const mime = require('./mime')
const compress = require('./compress')
const range = require('./range')

const tplPath = path.join(__dirname, '../template/dir.tpl')
const source = fs.readFileSync(tplPath) //同步，只会执行一次，之后都是用缓存
const template = Handlebars.compile(source.toString())
const isFresh = require('./cache')

module.exports = async function (req, res, filePath, config) {
  try {
    const stats = await stat(filePath)
    if(stats.isFile()) {
      const contentType = mime(filePath)
      res.setHeader('Content-Type', contentType)


      if (isFresh(stats, req, res)) {
        res.statusCode = 304
        res.end()
        return
      }


      let rs
      const {code, start, end} = range(stats.size, req, res)

      if(code === 200) {
        res.statusCode = 200
        rs = fs.createReadStream(filePath)
      } else {
        res.statusCode = 206
        rs = fs.createReadStream(filePath, {start, end})
      }

      if (filePath.match(config.compress)) {
        rs = compress(rs, req, res)
      }

      rs.pipe(res)

      //相比于readFile，流的方法性能更好，因为流是每次取部分显示，而不是一次性读取
      // fs.readFile(filePath, (err, data) => {
      //   res.end(data)
      // })
    } else if (stats.isDirectory) {
      const files = await readdir(filePath)
      res.statusCode = 200
      res.setHeader('Content-Type', 'text/html')
      const data = {
        files: files.map((file => {
          return {
            file,
            icon: mime(file)
          }
        })),
        title: path.basename(filePath),
        dir: path.relative(config.root, filePath) //取出相对路径
      }
      res.end(template(data))
    }
  } catch (ex) {
    res.statusCode = 404
    res.setHeader('Content-Type', 'text/plain')
    res.end(`${filePath} is not a directory or file`)
  }
}

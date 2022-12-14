const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

const whitelist = ['http://localhost:3000']
const corsOptions = {
    origin: function (origin, callback) {
      if (!origin || whitelist.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        callback(new Error("Not allowed by CORS"))
      }
    },
    credentials: true,
  }
app.use(cors(corsOptions))

app.use(express.urlencoded({extended: false}))
app.use(express.json())

const rapchieuRouter = require('./routes/rapchieu.router')
const phongchieuRouter = require('./routes/phongchieu.router')
const loaigheRouter = require('./routes/loaighe.router')
const gheRouter = require('./routes/ghe.router')
const theloaiRouter = require('./routes/theloai.router')
const loaisuatchieuRouter = require('./routes/loaisuatchieu.router')
const phimRouter = require('./routes/phim.router')
const suatchieuRouter = require('./routes/suatchieu.router')
const veRouter = require('./routes/ve.router')
const hoadonRouter = require('./routes/hoadon.router')

const ngayleRouter = require('./routes/ngayle.router')
const authRouter = require('./routes/auth.router')
const nguoidungRouter = require('./routes/nguoidung.router')

app.use("/api/v1/rapchieu", rapchieuRouter)
app.use("/api/v1/phongchieu", phongchieuRouter)
app.use("/api/v1/loaighe", loaigheRouter)
app.use("/api/v1/ghe", gheRouter)
app.use("/api/v1/theloai", theloaiRouter)
app.use("/api/v1/loaisuatchieu", loaisuatchieuRouter)
app.use("/api/v1/phim", phimRouter)
app.use("/api/v1/suatchieu", suatchieuRouter)
app.use("/api/v1/ve", veRouter)
app.use("/api/v1/hoadon", hoadonRouter)


app.use("/api/v1/ngayle", ngayleRouter)
app.use("/api/v1/auth", authRouter)
app.use("/api/v1/nguoidung", nguoidungRouter)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log("Server is running .... " + PORT)
})

// phim, suatchieu, hoadon, ve, user
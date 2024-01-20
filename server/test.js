const bcrypt = require("bcrypt")
const passwd = "123456"

const demo = async () => {
  console.log(await bcrypt.hash(passwd, 10))
}

demo()

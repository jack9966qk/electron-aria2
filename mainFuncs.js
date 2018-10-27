const { spawn } = require('child_process')
const path = require('path')

var ariaProc

const port = 6800
module.exports.port = port
const secret = "secret"
module.exports.secret = secret

module.exports.getAriaProc = () => {
    return ariaProc
}

module.exports.launchAria = () => {
    console.log("launchAria get called")
    dhtPath = path.join(__dirname, "dht.dat")
    ariaProc = spawn("aria2c", [
        "--enable-rpc=true",
        `--rpc-listen-port=${port}`,
        `--rpc-secret=${secret}`,
        `--dht-file-path=${dhtPath}`])
    ariaProc.stdout.pipe(process.stdout)
    ariaProc.stderr.pipe(process.stderr)
    return ariaProc
}

module.exports.killAriaProc = () => {
    ariaProc.kill()
}
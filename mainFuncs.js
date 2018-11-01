const { spawn } = require('child_process')
const path = require('path')
const fixPath = require('fix-path')

// fix broken OS $PATH when launched from GUI
// https://github.com/electron-userland/electron-packager/issues/603
fixPath()

var ariaProc

const hostUrl = "ws://localhost:6800/jsonrpc"
module.exports.hostUrl = hostUrl
const secret = "secret"
module.exports.secret = secret

module.exports.getAriaProc = () => {
    return ariaProc
}

module.exports.launchAria = () => {
    console.log("launchAria get called")
    const dhtPath = path.join(__dirname, "dht.dat")
    const ariaPath = process.platform === 'win32' ?
        path.join(__dirname, "bin", "win64", "aria2c.exe") : "aria2c"
    ariaProc = spawn(ariaPath, [
        "--enable-rpc=true",
        `--rpc-listen-port=6800`,
        `--rpc-secret=${secret}`,
        `--dht-file-path=${dhtPath}`])
    ariaProc.stdout.pipe(process.stdout)
    ariaProc.stderr.pipe(process.stderr)
    return ariaProc
}

module.exports.killAriaProc = () => {
    ariaProc.kill()
}
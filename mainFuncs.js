const { spawn } = require('child_process')
const path = require('path')
const fixPath = require('fix-path')
const fs = require('fs')
const electron = require('electron')
const app = electron.app

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
    const dhtPath = path.join(__dirname, "save", "dht.dat")
    const sessionPath = path.join(__dirname, "save", "session")
    const downloadPath = app.getPath("downloads")
    const ariaPath =
        process.platform === 'win32' ?
            path.join(__dirname, "bin", "win64", "aria2c.exe")
        : process.platform === 'darwin' ?
            path.join(__dirname, "bin", "macOS", "aria2c")
        : "aria2c"
    const args = [
        `--dir=${downloadPath}`,
        "--enable-rpc=true",
        `--rpc-listen-port=6800`,
        `--rpc-secret=${secret}`,
        `--enable-dht=true`,
        `--dht-file-path=${dhtPath}`,
        `--dht-entry-point=router.bittorrent.com:6881`,
        `--bt-enable-lpd=true`,
        `--save-session=${sessionPath}`
        ]
    if (fs.existsSync(sessionPath)) {
        args.push(`--input-file=${sessionPath}`)
    }
    console.log(`launch aria2 with args: ${args}`)
    ariaProc = spawn(ariaPath, args)
    ariaProc.stdout.pipe(process.stdout)
    ariaProc.stderr.pipe(process.stderr)
    return ariaProc
}

module.exports.killAriaProc = () => {
    ariaProc.kill()
}
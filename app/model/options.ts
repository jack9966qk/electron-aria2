// union type from tuple, see
// https://stackoverflow.com/questions/45251664/typescript-derive-union-type-from-tuple-array-values
type Lit = string | number | boolean | undefined | null | void | {};
const tuple = <T extends Lit[]>(...args: T) => args;
export const optionNames = tuple(
    "all-proxy", "all-proxy-passwd", "all-proxy-user", "allow-overwrite",
    "allow-piece-length-change", "always-resume", "async-dns",
    "auto-file-renaming", "bt-enable-hook-after-hash-check",
    "bt-enable-lpd", "bt-exclude-tracker", "bt-external-ip",
    "bt-force-encryption", "bt-hash-check-seed", "bt-load-saved-metadata",
    "bt-max-peers", "bt-metadata-only", "bt-min-crypto-level",
    "bt-prioritize-piece", "bt-remove-unselected-file", "bt-request-peer-speed-limit",
    "bt-require-crypto", "bt-save-metadata", "bt-seed-unverified",
    "bt-stop-timeout", "bt-tracker", "bt-tracker-connect-timeout",
    "bt-tracker-interval", "bt-tracker-timeout", "check-integrity",
    "checksum", "conditional-get", "connect-timeout",
    "content-disposition-default-utf8", "continue", "dir", "dry-run",
    "enable-http-keep-alive", "enable-http-pipelining", "enable-mmap",
    "enable-peer-exchange", "file-allocation", "follow-metalink",
    "follow-torrent", "force-save", "ftp-passwd", "ftp-pasv", "ftp-proxy",
    "ftp-proxy-passwd", "ftp-proxy-user", "ftp-reuse-connection",
    "ftp-type", "ftp-user", "gid", "hash-check-only", "header",
    "http-accept-gzip", "http-auth-challenge", "http-no-cache",
    "http-passwd", "http-proxy", "http-proxy-passwd", "http-proxy-user",
    "http-user", "https-proxy", "https-proxy-passwd", "https-proxy-user",
    "index-out", "lowest-speed-limit", "max-connection-per-server",
    "max-download-limit", "max-file-not-found", "max-mmap-limit",
    "max-resume-failure-tries", "max-tries", "max-upload-limit",
    "metalink-base-uri", "metalink-enable-unique-protocol",
    "metalink-language", "metalink-location", "metalink-os",
    "metalink-preferred-protocol", "metalink-version", "min-split-size",
    "no-file-allocation-limit", "no-netrc", "no-proxy", "out",
    "parameterized-uri", "pause", "pause-metadata", "piece-length",
    "proxy-method", "realtime-chunk-checksum", "referer", "remote-time",
    "remove-control-file", "retry-wait", "reuse-uri", "rpc-save-upload-metadata",
    "seed-ratio", "seed-time", "select-file", "split", "ssh-host-key-md",
    "stream-piece-selector", "timeout", "uri-selector", "use-head", "user-agent"
)

export type OptionName = typeof optionNames[number]
export type Options = {
    [option in OptionName]?: string
}

export const basicOptionNames = tuple(
    "dir", "max-download-limit"
)

export const httpFtpSftpOptionNames = tuple(
    "all-proxy", "all-proxy-passwd", "all-proxy-user", "checksum",
    "connect-timeout", "dry-run", "lowest-speed-limit",
    "max-connection-per-server", "max-file-not-found",
    "max-tries", "min-split-size", "no-netrc", "no-proxy",
    "out", "proxy-method", "remote-time", "reuse-uri", "retry-wait",
    "split", "stream-piece-selector", "timeout", "uri-selector"
)

export const httpOptionNames = tuple(
    "http-accept-gzip", "http-auth-challenge", "http-no-cache",
    "http-passwd", "http-proxy", "http-proxy-passwd",
    "http-proxy-user", "http-user", "https-proxy",
    "https-proxy-passwd", "https-proxy-user", "referer",
    "enable-http-keep-alive", "enable-http-pipelining",
    "header", "use-head", "user-agent"
)

export const ftpSftpOptionNames = tuple(
    "ftp-passwd", "ftp-pasv", "ftp-proxy", "ftp-proxy-passwd",
    "ftp-proxy-user", "ftp-reuse-connection", "ftp-type", "ftp-user",
    "ssh-host-key-md"
)

export const torrentMetalinkOptionNames = tuple(
    "select-file"
)

export const torrentOptionNames = tuple(
    "bt-enable-hook-after-hash-check", "bt-enable-lpd", "bt-exclude-tracker",
    "bt-external-ip", "bt-force-encryption", "bt-hash-check-seed", 
    "bt-load-saved-metadata", "bt-max-peers", "bt-metadata-only",
    "bt-min-crypto-level", "bt-prioritize-piece", "bt-remove-unselected-file",
    "bt-request-peer-speed-limit", "bt-require-crypto", "bt-save-metadata",
    "bt-seed-unverified", "bt-stop-timeout", "bt-tracker",
    "bt-tracker-connect-timeout", "bt-tracker-interval", "bt-tracker-timeout",
    "enable-peer-exchange", "follow-torrent", "index-out", "max-upload-limit",
    "seed-ratio", "seed-time"
)

export const metalinkOptionNames = tuple(
    "follow-metalink", "metalink-base-uri", "metalink-enable-unique-protocol",
    "metalink-language", "metalink-location", "metalink-os",
    "metalink-preferred-protocol", "metalink-version",
)

export const rpcOptionNames = tuple(
    "rpc-save-upload-metadata"
)

const makeOtherOptionNames = () => {
    const nonOtherOptions: Set<string> = new Set([
        ...basicOptionNames,
        ...httpFtpSftpOptionNames,
        ...httpOptionNames,
        ...ftpSftpOptionNames,
        ...torrentMetalinkOptionNames,
        ...torrentOptionNames,
        ...metalinkOptionNames,
        ...rpcOptionNames
    ])
    return tuple(
        ...optionNames.filter((n) => !nonOtherOptions.has(n))
    )
}

export const otherOptionNames = makeOtherOptionNames()

const makeEmptyOptions = () => {
    const options = {}
    for (const name of optionNames) {
        options[name] = ""
    }
    return options
}

export const emptyOptions: Options = makeEmptyOptions()
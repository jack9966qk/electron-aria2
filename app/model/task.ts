import { isEqual } from 'lodash'

type Status =
    "active" |
    "waiting" |
    "paused" |
    "error" |
    "complete" |
    "removed"

export interface Task {
    bitfield?: string
    bittorrent?: {
        announceList?: string[][]
        comment: string
        creationDate: number
        info: {
            name: string
        }
        mode: string
    }
    completedLength: string
    connections: string
    dir: string
    downloadSpeed: string
    errorCode?: string
    errorMessage?: string
    followedBy?: string[]
    following?: string
    belongsTo?: string
    files: {
        completedLength: string
        index: string
        length: string
        path: string
        selected: string
        uris: {
            status: string,
            uri: string
        }[]
    }[]
    gid: string
    infoHash: string
    numPieces: string
    numSeeders: string
    pieceLength: string
    seeder: string
    status: Status
    totalLength: string
    uploadLength: string
    uploadSpeed: string
}

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

const makeEmptyOptions = () => {
    const options = {}
    for (const name of optionNames) {
        options[name] = ""
    }
    return options
}

export const emptyOptions: Options = makeEmptyOptions()

export enum TaskCategory {
    Active = "ACTIVE",
    Waiting = "WAITING",
    Completed = "COMPLETED",
    Stopped = "STOPPED"
}

export const taskCategoryDescription = {
    [TaskCategory.Active]: "Active",
    [TaskCategory.Waiting]: "Waiting",
    [TaskCategory.Completed]: "Completed",
    [TaskCategory.Stopped]: "Stopped"
}

export function getName(task: Task): string {
    const {bittorrent, files, dir} = task
    return isHttp(task) ?
        (files[0].path === "" ?
            files[0].uris[0].uri :
            files[0].path.replace(dir + "/", "")) :
        bittorrent.info.name
}

export function isHttp(task: Task): boolean {
    return task.bittorrent === undefined || task.bittorrent.info === undefined
}

export function isBittorrent(task: Task): boolean {
    return task.bittorrent !== undefined && task.bittorrent.info !== undefined
}

export function isMetadata(task: Task): boolean {
    return task.bittorrent !== undefined && task.bittorrent.info === undefined
}

export function downloadComplete(task: Task): boolean {
    if (task.status === "complete") { return true }
    if (["active", "paused"].includes(task.status)) {
        const completed = parseInt(task.completedLength)
        const total = parseInt(task.totalLength)
        if (completed === total) {
            if (isMetadata(task)) {
                return false
            } else {
                // for torrent tasks that have completed
                // download but still seeding
                return true
            }
        }
        return false
    }
}

function getCategory(task: Task): TaskCategory {
    if (["waiting"].includes(task.status)) {
        return TaskCategory.Waiting
    }

    if (["error", "removed"].includes(task.status)) {
        return TaskCategory.Stopped
    }

    if (downloadComplete(task)) {
        return TaskCategory.Completed
    }

    return TaskCategory.Active
}

export const countCategory = (tasks: Task[]) => {
    const count = {
        [TaskCategory.Active]: 0,
        [TaskCategory.Waiting]: 0,
        [TaskCategory.Completed]: 0,
        [TaskCategory.Stopped]: 0
    }
    for (const t of tasks) {
        count[getCategory(t)] += 1
    }
    return count
}

export type CategoryCount = ReturnType<typeof countCategory>

export function filterTasks(tasks: Task[], category: TaskCategory) {
    return tasks.filter(e => getCategory(e) === category)
}

export const updateTaskList = (
    oldTasks: Map<string, Task>,
    newTasks: Map<string, Task>) => {
    // compare task lists, only update references where tasks are changed
    // if no task has changed, do not update array reference
    // O(n) with 2 passes, not very optimal
    var changed = false
    // check for deleted tasks
    for (const gid of oldTasks.keys()) {
        if (!newTasks.has(gid)) { changed = true }
    }
    // check for added/updated tasks
    const tasks: Map<string, Task> = new Map()
    newTasks.forEach((t, gid, _) => {
        if (oldTasks.has(gid)) {
            const ot = oldTasks.get(gid)
            if (isEqual(t, ot)) {
                tasks.set(gid, ot)
            } else {
                changed = true
                tasks.set(gid, t)
            }
        } else {
            changed = true
            tasks.set(gid, t)
        }
    })
    return changed ? tasks : oldTasks
}
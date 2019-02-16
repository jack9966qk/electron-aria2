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
    const { bittorrent, files, dir } = task
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
            if (total === 0) {
                // tasks that are not yet started have 0 total length
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
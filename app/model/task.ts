import { isEqual } from 'lodash'

interface Mapping {
    [key: string]: string | Mapping
}

type Status =
    "active" |
    "waiting" |
    "paused" |
    "error" |
    "complete" |
    "removed"

export interface Task extends Mapping {
    gid: string
    status: Status
    bittorrent?: {
        info: Mapping
        [key: string]: string | Mapping
    }
    completedLength: string
    totalLength: string
    [key: string]: string | Mapping
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

function isMetadata(task: Task): boolean {
    return task.bittorrent !== undefined && task.bittorrent.info === undefined
}

function getCategory(task: Task): TaskCategory {
    if (["active", "paused"].includes(task.status)) {
        const completed = parseInt(task.completedLength)
        const total = parseInt(task.totalLength)
        if (completed === total) {
            if (isMetadata(task)) {
                return TaskCategory.Active
            } else {
                // for torrent tasks that have completed
                // download but still seeding
                return TaskCategory.Completed
            }
        }
        return TaskCategory.Active
    }

    if (["waiting"].includes(task.status)) {
        return TaskCategory.Waiting
    }

    if (["complete"].includes(task.status)) {
        return TaskCategory.Completed
    }

    if (["error", "removed"].includes(task.status)) {
        return TaskCategory.Stopped
    }
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
    // O(n) with 3 passes, not very optimal
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
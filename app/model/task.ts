import { isEqual } from 'lodash'

interface Mapping {
    [key: string]: string | Mapping
}

export interface Task extends Mapping {
    gid: string
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

function getCategory(task: any): TaskCategory {
    if (["active", "paused"].includes(task.status)) {
        const completed = parseInt(task.completedLength)
        const total = parseInt(task.totalLength)
        if (completed === total) {
            if (total === 0) {
                // probably a torrent/metadata task that
                // has not obtained a size yet
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

export function filterTasks(tasks, category) {
    return tasks.filter(e => getCategory(e) === category)
}

export const updateTaskList = (oldTasks: Task[], newTasks: Task[]) => {
    // compare task lists, only update references where tasks are changed
    // if no task has changed, do not update array reference
    // O(n) with 3 passes, not very optimal
    const toMap = (tasks: Task[]) => {
        const map = new Map()
        for (const t of tasks) { map.set(t.gid, t) }
        return map
    }
    const oldTasksMap = toMap(oldTasks)
    const newTasksMap = toMap(newTasks)
    var changed = false
    // check for deleted tasks
    for (const gid of oldTasksMap.keys()) {
        if (!newTasksMap.has(gid)) { changed = true }
    }
    // check for added/updated tasks
    const tasks: Task[] = []
    for (const t of newTasks) {
        if (oldTasksMap.has(t.gid)) {
            const ot = oldTasksMap.get(t.gid)
            if (isEqual(t, ot)) {
                tasks.push(ot)
            } else {
                changed = true
                tasks.push(t)
            }
        } else {
            changed = true
            tasks.push(t)
        }
    }
    return changed ? tasks : oldTasks
}
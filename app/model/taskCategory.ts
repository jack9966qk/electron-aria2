export const ACTIVE = "ACTIVE"
export const WAITING = "WAITING"
export const COMPLETED = "COMPLETED"
export const STOPPED = "STOPPED"

export const description = {
    ACTIVE: "Active",
    WAITING: "Waiting",
    COMPLETED: "Completed",
    STOPPED: "Stopped"
}

function getCategory(task) {
    if (["active", "paused"].includes(task.status)) {
        return task.completedLength < task.totalLength ? ACTIVE : COMPLETED
    }

    if (["waiting"].includes(task.status)) {
        return WAITING
    }

    if (["complete"].includes(task.status)) {
        return COMPLETED
    }

    if (["error", "removed"].includes(task.status)) {
        return STOPPED
    }
}

export function filterTasks(tasks, category) {
    return tasks.filter(e => getCategory(e) === category)
}
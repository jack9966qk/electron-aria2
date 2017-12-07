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

export function filterTasks(tasks, category) {
    switch (category) {
        case ACTIVE:
            return tasks.filter(e => ["active", "paused"].includes(e.status))
        case WAITING:
            return tasks.filter(e => ["waiting"].includes(e.status))
        case COMPLETED:
            return tasks.filter(e => ["complete"].includes(e.status))
        case STOPPED:
            return tasks.filter(e => ["error", "removed"].includes(e.status))
        default:
            return []
    }
}
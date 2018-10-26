export enum TaskCategory {
    Active = "ACTIVE",
    Waiting = "WAITING",
    Completed = "COMPLETED",
    Stopped = "STOPPED"
}

export const description = {
    [TaskCategory.Active]: "Active",
    [TaskCategory.Waiting]: "Waiting",
    [TaskCategory.Completed]: "Completed",
    [TaskCategory.Stopped]: "Stopped"
}

function getCategory(task: any): TaskCategory {
    if (["active", "paused"].includes(task.status)) {
        return task.completedLength < task.totalLength ? TaskCategory.Active : TaskCategory.Completed
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

export function filterTasks(tasks, category) {
    return tasks.filter(e => getCategory(e) === category)
}
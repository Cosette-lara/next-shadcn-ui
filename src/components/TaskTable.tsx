// src/components/TaskTable.tsx
"use client"

import React, { useState } from "react"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useDashboard } from "@/components/DashboardContext"

export function TasksTable() {
    const { tasks, members, projects, addTask, updateTask, deleteTask, settings } = useDashboard()

    // pagination
    const pageSize = settings?.itemsPerPage ?? 5
    const [page, setPage] = useState(1)
    const totalPages = Math.max(1, Math.ceil(tasks.length / pageSize))
    const currentTasks = tasks.slice((page - 1) * pageSize, page * pageSize)

    // new task form
    const [creating, setCreating] = useState(false)
    const [newTask, setNewTask] = useState({
        description: "",
        projectId: projects.length ? projects[0].id : null,
        project: projects.length ? projects[0].title : "N/A",
        status: "Pendiente",
        priority: "Media",
        userId: members.length ? members[0].userId : null,
        assignee: members.length ? members[0].name : "",
        dateline: "",
    })

    const [editingId, setEditingId] = useState<number | null>(null)
    const [editForm, setEditForm] = useState<any>(null)
    const [loadingId, setLoadingId] = useState<number | null>(null)

    function handleCreate() {
        if (!newTask.description.trim()) return
        setCreating(true)
        setTimeout(() => {
            addTask({
                description: newTask.description,
                project: projects.find(p => p.id === newTask.projectId)?.title ?? "N/A",
                projectId: newTask.projectId,
                status: newTask.status,
                priority: newTask.priority,
                userId: newTask.userId,
                assignee: members.find(m => m.userId === newTask.userId)?.name ?? newTask.assignee,
                dateline: newTask.dateline,
            })
            setNewTask({
                description: "",
                projectId: projects.length ? projects[0].id : null,
                project: projects.length ? projects[0].title : "N/A",
                status: "Pendiente",
                priority: "Media",
                userId: members.length ? members[0].userId : null,
                assignee: members.length ? members[0].name : "",
                dateline: "",
            })
            setCreating(false)
            setPage(totalPages) // jump to last page
        }, 600)
    }

    function startEdit(t: any) {
        setEditingId(t.id)
        setEditForm({ ...t })
    }

    function saveEdit() {
        if (!editingId || !editForm) return
        setLoadingId(editingId)
        setTimeout(() => {
            updateTask(editingId, {
                description: editForm.description,
                status: editForm.status,
                priority: editForm.priority,
                dateline: editForm.dateline,
                userId: editForm.userId,
                assignee: members.find(m => m.userId === editForm.userId)?.name ?? editForm.assignee,
            })
            setEditingId(null)
            setEditForm(null)
            setLoadingId(null)
        }, 600)
    }

    function cancelEdit() {
        setEditingId(null)
        setEditForm(null)
    }

    return (
        <div className="rounded-md border p-2">
            <div className="mb-4">
                <div className="flex gap-2 items-center">
                    <input
                        className="p-2 border rounded flex-1"
                        placeholder="Nueva tarea (descripción)"
                        value={newTask.description}
                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    />
                    <select
                        className="p-2 border rounded"
                        value={newTask.projectId ?? ""}
                        onChange={(e) => setNewTask({ ...newTask, projectId: e.target.value ? Number(e.target.value) : null })}
                    >
                        {projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                    </select>
                    <select
                        className="p-2 border rounded"
                        value={newTask.userId ?? ""}
                        onChange={(e) => setNewTask({ ...newTask, userId: e.target.value ? Number(e.target.value) : null })}
                    >
                        <option value="">Sin asignar</option>
                        {members.map(m => <option key={m.userId} value={m.userId}>{m.name}</option>)}
                    </select>
                    <Button size="sm" onClick={handleCreate} disabled={creating}>
                        {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Agregar"}
                    </Button>
                </div>
            </div>

            <Table>
                <TableCaption>Lista de todas las tareas del proyecto</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[50px]"><Checkbox disabled /></TableHead>
                        <TableHead>Tarea</TableHead>
                        <TableHead>Proyecto</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Prioridad</TableHead>
                        <TableHead>Asignado a</TableHead>
                        <TableHead>Fecha límite</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {currentTasks.map((task) => (
                        <TableRow key={task.id}>
                            <TableCell><Checkbox /></TableCell>

                            <TableCell className="font-medium">
                                {editingId === task.id ? (
                                    <input className="p-1 border rounded w-full" value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} />
                                ) : task.description}
                            </TableCell>

                            <TableCell>{projects.find(p => p.id === task.projectId)?.title ?? task.project}</TableCell>

                            <TableCell>
                                {editingId === task.id ? (
                                    <select value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })} className="p-1 border rounded">
                                        <option>Completado</option>
                                        <option>En progreso</option>
                                        <option>Pendiente</option>
                                    </select>
                                ) : <Badge variant={task.status === "Completado" ? "default" : task.status === "En progreso" ? "secondary" : "outline"}>{task.status}</Badge>}
                            </TableCell>

                            <TableCell>
                                {editingId === task.id ? (
                                    <select value={editForm.priority} onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })} className="p-1 border rounded">
                                        <option>Urgente</option>
                                        <option>Alta</option>
                                        <option>Media</option>
                                        <option>Baja</option>
                                    </select>
                                ) : <Badge variant={task.priority === "Urgente" ? "destructive" : task.priority === "Alta" ? "default" : "secondary"}>{task.priority}</Badge>}
                            </TableCell>

                            <TableCell>
                                {editingId === task.id ? (
                                    <select value={editForm.userId ?? ""} onChange={(e) => setEditForm({ ...editForm, userId: e.target.value ? Number(e.target.value) : null })} className="p-1 border rounded">
                                        <option value="">Sin asignar</option>
                                        {members.map(m => <option key={m.userId} value={m.userId}>{m.name}</option>)}
                                    </select>
                                ) : task.assignee}
                            </TableCell>

                            <TableCell>
                                {editingId === task.id ? (
                                    <input type="date" className="p-1 border rounded" value={editForm.dateline ?? ""} onChange={(e) => setEditForm({ ...editForm, dateline: e.target.value })} />
                                ) : task.dateline}
                            </TableCell>

                            <TableCell className="text-right">
                                {editingId === task.id ? (
                                    <div className="flex items-center justify-end gap-2">
                                        <Button size="sm" onClick={saveEdit} disabled={loadingId === task.id}>{loadingId === task.id ? <Loader2 className="h-4 w-4 animate-spin" /> : "Guardar"}</Button>
                                        <Button size="sm" variant="outline" onClick={cancelEdit}>Cancelar</Button>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-end gap-2">
                                        <Button size="sm" variant="ghost" onClick={() => startEdit(task)}>Editar</Button>
                                        <Button size="sm" variant="ghost" onClick={() => deleteTask(task.id)}>Eliminar</Button>
                                    </div>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* pagination small */}
            <div className="flex items-center justify-between mt-3">
                <div className="text-sm text-muted-foreground">Página {page} de {totalPages}</div>
                <div className="flex gap-2">
                    <Button size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Anterior</Button>
                    <Button size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Siguiente</Button>
                </div>
            </div>
        </div>
    )
}

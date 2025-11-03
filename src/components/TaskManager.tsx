// /components/TaskManager.tsx
"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Calendar } from "@/components/ui/calendar";
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext } from "@/components/ui/pagination";
import { Loader2 } from "lucide-react";

interface Task {
    id: number;
    description: string;
    projectId?: number | null;
    status: string;
    priority: string;
    userId?: number | null;
    dateline: string;
}

export function TaskManager() {
    const [tasks, setTasks] = useState<Task[]>([
        { id: 1, description: "Implementar autenticación", projectId: 1, status: "En progreso", priority: "Alta", userId: 1, dateline: "2025-11-15" },
        { id: 2, description: "Diseñar pantalla de perfil", projectId: 2, status: "Pendiente", priority: "Media", userId: 2, dateline: "2025-11-20" },
        { id: 3, description: "Configurar CI/CD", projectId: 3, status: "Completado", priority: "Alta", userId: 3, dateline: "2025-11-10" },
    ]);
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({ description: "", projectId: "", priority: "", userId: "", dateline: "" });
    const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const tasksPerPage = 3;

    const addTask = (e: React.FormEvent) => {
        e.preventDefault();
        setAlert(null);
        if (!form.description) {
            setAlert({ type: "error", message: "Descripción es obligatoria." });
            return;
        }
        setLoading(true);
        setTimeout(() => {
            const newTask: Task = {
                id: tasks.length + 1,
                description: form.description,
                projectId: form.projectId ? Number(form.projectId) : null,
                priority: form.priority || "Media",
                status: "Pendiente",
                userId: form.userId ? Number(form.userId) : null,
                dateline: form.dateline || new Date().toISOString().split("T")[0],
            };
            setTasks((t) => [...t, newTask]);
            setForm({ description: "", projectId: "", priority: "", userId: "", dateline: "" });
            setOpen(false);
            setLoading(false);
            setAlert({ type: "success", message: "Tarea creada correctamente." });
        }, 900);
    };

    const deleteTask = (id: number) => {
        setTasks((t) => t.filter((x) => x.id !== id));
    };

    const totalPages = Math.max(1, Math.ceil(tasks.length / tasksPerPage));
    const currentTasks = tasks.slice((page - 1) * tasksPerPage, page * tasksPerPage);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Tareas (CRUD)</CardTitle>
                <CardDescription>Campos: description, projectId, status, priority, userId, dateline</CardDescription>
            </CardHeader>
            <CardContent>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild><Button>Nueva Tarea</Button></DialogTrigger>
                    <DialogContent>
                        <form onSubmit={addTask}>
                            <DialogHeader><DialogTitle>Crear tarea</DialogTitle></DialogHeader>
                            <div className="space-y-2 py-3">
                                <Label>Descripción *</Label>
                                <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                                <Label>Project ID</Label>
                                <Input value={form.projectId} onChange={(e) => setForm({ ...form, projectId: e.target.value })} />
                                <Label>Prioridad</Label>
                                <Input value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} />
                                <Label>User ID</Label>
                                <Input value={form.userId} onChange={(e) => setForm({ ...form, userId: e.target.value })} />
                                <Label>Fecha límite</Label>
                                <Input type="date" value={form.dateline} onChange={(e) => setForm({ ...form, dateline: e.target.value })} />
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                                <Button type="submit" disabled={loading}>
                                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Guardar
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {alert && (
                    <Alert variant={alert.type === "error" ? "destructive" : "default"}>
                        <AlertTitle>{alert.type === "error" ? "Error" : "Éxito"}</AlertTitle>
                        <AlertDescription>{alert.message}</AlertDescription>
                    </Alert>
                )}

                <Table className="mt-4">
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Descripción</TableHead>
                            <TableHead>Proyecto</TableHead>
                            <TableHead>Prioridad</TableHead>
                            <TableHead>Fecha límite</TableHead>
                            <TableHead>Acción</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentTasks.map((t) => (
                            <TableRow key={t.id}>
                                <TableCell>{t.id}</TableCell>
                                <TableCell>{t.description}</TableCell>
                                <TableCell>{t.projectId ?? "-"}</TableCell>
                                <TableCell>{t.priority}</TableCell>
                                <TableCell>{t.dateline}</TableCell>
                                <TableCell className="text-right">
                                    <Button size="sm" variant="ghost" onClick={() => deleteTask(t.id)}>Eliminar</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <div className="mt-4 flex items-center justify-between">
                    <div className="w-1/2">
                        <Calendar mode="single" selected={new Date()} />
                    </div>
                    <div className="w-1/2 flex justify-end items-center">
                        <Pagination>
                            <PaginationContent>
                                <PaginationPrevious onClick={() => setPage((p) => Math.max(1, p - 1))} />
                                <PaginationItem>{`Página ${page} / ${totalPages}`}</PaginationItem>
                                <PaginationNext onClick={() => setPage((p) => Math.min(totalPages, p + 1))} />
                            </PaginationContent>
                        </Pagination>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

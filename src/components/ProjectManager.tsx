// /components/ProjectManager.tsx
"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

interface Project {
    id: number;
    title: string;
    description: string;
    status: string;
    progress: number;
    members: string;
}

export function ProjectManager() {
    const [projects, setProjects] = useState<Project[]>([
        { id: 1, title: "E-commerce Platform", description: "Plataforma de venta online", status: "En progreso", progress: 60, members: "María, Juan" },
        { id: 2, title: "Mobile App", description: "Aplicación móvil", status: "Planificado", progress: 10, members: "Ana" },
    ]);

    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({ title: "", description: "", status: "Planificado", members: "" });
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setAlert(null);
        if (!form.title) {
            setAlert({ type: "error", message: "El título es obligatorio" });
            return;
        }
        setLoading(true);
        setTimeout(() => {
            const newProject: Project = {
                id: projects.length + 1,
                title: form.title,
                description: form.description,
                status: form.status,
                progress: 0,
                members: form.members,
            };
            setProjects((p) => [...p, newProject]);
            setForm({ title: "", description: "", status: "Planificado", members: "" });
            setOpen(false);
            setLoading(false);
            setAlert({ type: "success", message: "Proyecto creado correctamente" });
        }, 900);
    };

    const handleDelete = (id: number) => {
        setProjects((p) => p.filter((x) => x.id !== id));
    };

    const handleShowDetails = (p: Project) => {
        // Aquí podrías abrir un Dialog más complejo; por simplicidad usamos alert()
        alert(`Proyecto: ${p.title}\nMiembros: ${p.members || "Sin asignar"}\nProgreso: ${p.progress}%`);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Gestión de Proyectos</CardTitle>
                <CardDescription>Crear, ver detalles y eliminar proyectos (miembros incluidos).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button>Nuevo Proyecto</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <form onSubmit={handleSubmit}>
                            <DialogHeader>
                                <DialogTitle>Crear nuevo proyecto</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-2 py-3">
                                <Label>Título *</Label>
                                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                                <Label>Descripción</Label>
                                <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                                <Label>Miembros (coma separados)</Label>
                                <Input value={form.members} onChange={(e) => setForm({ ...form, members: e.target.value })} />
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

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {projects.map((p) => (
                        <Card key={p.id}>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle>{p.title}</CardTitle>
                                        <CardDescription>{p.description}</CardDescription>
                                        <p className="text-sm text-gray-500">Equipo: {p.members || "Sin asignar"}</p>
                                    </div>
                                    <Badge variant="secondary">{p.status}</Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <p>Progreso: {p.progress}%</p>
                                <div className="flex gap-2">
                                    <Button size="sm" variant="outline" onClick={() => handleShowDetails(p)}>Detalles</Button>
                                    <Button size="sm" variant="ghost" onClick={() => handleDelete(p.id)}>Eliminar</Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

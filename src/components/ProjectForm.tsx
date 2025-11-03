// /components/ProjectForm.tsx
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { useDashboard } from "@/components/DashboardContext";

export function ProjectForm() {
    const { addProject } = useDashboard();
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({ title: "", description: "", membersText: "" });
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        setAlert(null);
        if (!form.title.trim()) return setAlert({ type: "error", message: "Título obligatorio" });
        setLoading(true);
        setTimeout(() => {
            // convert membersText (nombres) -> leave empty array (for simplicity) or parse to ids if needed
            addProject({ title: form.title, description: form.description, status: "Planificado", progress: 0, members: [] });
            setLoading(false);
            setOpen(false);
            setForm({ title: "", description: "", membersText: "" });
            setAlert({ type: "success", message: "Proyecto creado" });
        }, 900);
    };

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button>Nuevo Proyecto</Button>
                </DialogTrigger>
                <DialogContent>
                    <form onSubmit={submit}>
                        <DialogHeader>
                            <DialogTitle>Crear Proyecto</DialogTitle>
                        </DialogHeader>

                        <div className="space-y-3 py-3">
                            <div>
                                <Label>Título *</Label>
                                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                            </div>
                            <div>
                                <Label>Descripción</Label>
                                <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                            </div>
                            <div>
                                <Label>Miembros (nombres, coma separados)</Label>
                                <Input value={form.membersText} onChange={(e) => setForm({ ...form, membersText: e.target.value })} />
                            </div>

                            {alert && <Alert variant={alert.type === "error" ? "destructive" : "default"}><AlertTitle>{alert.type === "error" ? "Error" : "Éxito"}</AlertTitle><AlertDescription>{alert.message}</AlertDescription></Alert>}
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                            <Button type="submit" disabled={loading}>{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Guardar</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

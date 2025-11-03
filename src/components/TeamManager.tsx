// /components/TeamManager.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useDashboard } from "@/components/DashboardContext";
import { Loader2 } from "lucide-react";

export function TeamManager() {
    const { members, addMember, deleteMember, toggleMemberActive } = useDashboard();
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({ role: "", name: "", email: "", position: "", birthdate: "", phone: "", projectId: "" });
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        setAlert(null);
        if (!form.name || !form.email) return setAlert({ type: "error", message: "Nombre y email obligatorios" });
        setLoading(true);
        setTimeout(() => {
            addMember({
                role: form.role || "Miembro",
                name: form.name,
                email: form.email,
                position: form.position,
                birthdate: form.birthdate,
                phone: form.phone,
                projectId: form.projectId ? Number(form.projectId) : null
            });
            setLoading(false);
            setOpen(false);
            setForm({ role: "", name: "", email: "", position: "", birthdate: "", phone: "", projectId: "" });
            setAlert({ type: "success", message: "Miembro agregado" });
        }, 800);
    };

    return (
        <div className="space-y-4">
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild><Button>Nuevo Miembro</Button></DialogTrigger>
                <DialogContent>
                    <form onSubmit={submit}>
                        <DialogHeader><DialogTitle>Agregar Miembro</DialogTitle></DialogHeader>
                        <div className="space-y-2 py-3">
                            <Label>Nombre *</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                            <Label>Email *</Label><Input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                            <Label>Rol</Label><Input value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} />
                            <Label>Posición</Label><Input value={form.position} onChange={e => setForm({ ...form, position: e.target.value })} />
                            <Label>Fecha Nac</Label><Input type="date" value={form.birthdate} onChange={e => setForm({ ...form, birthdate: e.target.value })} />
                            <Label>Teléfono</Label><Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                            <Label>Project ID</Label><Input value={form.projectId} onChange={e => setForm({ ...form, projectId: e.target.value })} />
                            {alert && <Alert variant={alert.type === "error" ? "destructive" : "default"}><AlertTitle>{alert.type === "error" ? "Error" : "Éxito"}</AlertTitle><AlertDescription>{alert.message}</AlertDescription></Alert>}
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                            <Button type="submit" disabled={loading}>{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Guardar</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <div className="space-y-3">
                {members.map(m => (
                    <div key={m.userId} className="flex items-center justify-between border p-3 rounded">
                        <div>
                            <p className="font-semibold">{m.name} <span className="text-xs text-muted-foreground">({m.role})</span></p>
                            <p className="text-xs">{m.email} • {m.phone || "-"}</p>
                            <p className="text-xs">Nac: {m.birthdate || "-"} • Proyecto: {m.projectId ?? "-"}</p>
                        </div>
                        <div className="flex gap-2 items-center">
                            <span className={`px-2 py-1 rounded text-sm ${m.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>{m.isActive ? "Activo" : "Inactivo"}</span>
                            <Button size="sm" variant="outline" onClick={() => toggleMemberActive(m.userId)}>Toggle</Button>
                            <Button size="sm" variant="ghost" onClick={() => deleteMember(m.userId)}>Eliminar</Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

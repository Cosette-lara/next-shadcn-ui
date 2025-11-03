// /app/dashboard/page.tsx
"use client"

import React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ProjectForm } from "@/components/ui/ProjectForm"
import { TasksTable } from "@/components/TaskTable"

// ===== ADICIONES MÍNIMAS PARA LA TAREA =====
import { DashboardProvider } from "@/components/DashboardContext" // para que no falle useDashboard de TasksTable
import { Calendar } from "@/components/ui/calendar"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationPrevious,
    PaginationNext,
} from "@/components/ui/pagination"
import { Loader2 } from "lucide-react"
// ===========================================

export default function DashboardPage() {
    return (
        <DashboardProvider>{/* <-- añadido (envolver sin cambiar orden interno) */}
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-slate-900 mb-2">
                            Dashboard de Proyectos
                        </h1>
                        <p className="text-slate-600">
                            Gestiona tus proyectos y tareas con shadcn/ui
                        </p>
                        <div className="pt-4">
                            <ProjectForm />
                        </div>

                    </div>

                    {/* Tabs Navigation */}
                    <Tabs defaultValue="overview" className="space-y-4">
                        <TabsList>
                            <TabsTrigger value="overview">Resumen</TabsTrigger>
                            <TabsTrigger value="projects">Proyectos</TabsTrigger>
                            <TabsTrigger value="team">Equipo</TabsTrigger>
                            <TabsTrigger value="settings">Configuración</TabsTrigger>
                            <TabsTrigger value="tasks">Tareas</TabsTrigger>
                        </TabsList>

                        {/* // Agregar nuevo TabsContent: */}
                        <TabsContent value="tasks" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Gestion de tareas</CardTitle>
                                    <CardDescription>
                                        Administra toda las tareas de tus proyectos
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <TasksTable />
                                </CardContent>
                            </Card>

                            {/* AÑADIDO: CRUD de Tareas + paginación + alert/spinner */}
                            <TasksCRUD />
                        </TabsContent>
                        {/* Tab: Overview */}
                        <TabsContent value="overview" className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                {/* Stat Cards */}
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">
                                            Total Proyectos
                                        </CardTitle>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            className="h-4 w-4 text-muted-foreground"
                                        >
                                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                            <circle cx="9" cy="7" r="4" />
                                            <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                                        </svg>
                                    </CardHeader>
                                    <CardContent>
                                        {/* cambiado valor duro -> métrica dinámica */}
                                        <div className="text-2xl font-bold"><SummaryMetricTotalProjects /></div>
                                        <p className="text-xs text-muted-foreground">
                                            +2 desde el mes pasado
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">
                                            Tareas Completadas
                                        </CardTitle>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            className="h-4 w-4 text-muted-foreground"
                                        >
                                            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                                        </svg>
                                    </CardHeader>
                                    <CardContent>
                                        {/* cambiado valor duro -> métrica dinámica */}
                                        <div className="text-2xl font-bold"><SummaryMetricCompletedTasks /></div>
                                        <p className="text-xs text-muted-foreground">
                                            +19% desde la semana pasada
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">
                                            Horas Trabajadas
                                        </CardTitle>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            className="h-4 w-4 text-muted-foreground"
                                        >
                                            <rect width="20" height="14" x="2" y="5" rx="2" />
                                            <path d="M2 10h20" />
                                        </svg>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">324h</div>
                                        <p className="text-xs text-muted-foreground">
                                            +12h desde ayer
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">
                                            Miembros Activos
                                        </CardTitle>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            className="h-4 w-4 text-muted-foreground"
                                        >
                                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                            <circle cx="9" cy="7" r="4" />
                                            <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                                        </svg>
                                    </CardHeader>
                                    <CardContent>
                                        {/* cambiado valor duro -> métrica dinámica */}
                                        <div className="text-2xl font-bold"><SummaryMetricActiveMembers /></div>
                                        <p className="text-xs text-muted-foreground">
                                            +1 nuevo miembro
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Recent Activity */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Actividad Reciente</CardTitle>
                                    <CardDescription>
                                        Últimas actualizaciones de tus proyectos
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {[
                                            { user: "María García", action: "completó la tarea", task: "Diseño de UI", time: "Hace 5 min" },
                                            { user: "Juan Pérez", action: "comentó en", task: "API Backend", time: "Hace 1 hora" },
                                            { user: "Ana López", action: "creó un nuevo", task: "Proyecto Mobile", time: "Hace 2 horas" },
                                            { user: "Carlos Ruiz", action: "actualizó", task: "Documentación", time: "Hace 3 horas" },
                                        ].map((activity, i) => (
                                            <div key={i} className="flex items-center gap-4">
                                                <Avatar>
                                                    <AvatarFallback>{activity.user[0]}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium leading-none">
                                                        {activity.user}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {activity.action} <span className="font-medium">{activity.task}</span>
                                                    </p>
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {activity.time}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* AÑADIDOS: Calendar + Métricas resumidas inline */}
                            <div className="grid gap-4 md:grid-cols-2">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Calendario</CardTitle>
                                        <CardDescription>Selecciona una fecha</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="max-w-xs">
                                            <Calendar mode="single" selected={new Date()} />
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Métricas dinámicas</CardTitle>
                                        <CardDescription>Basadas en datos en memoria</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <OverviewMetricsInline />
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        {/* Tab: Projects */}
                        <TabsContent value="projects" className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {[
                                    {
                                        title: "E-commerce Platform",
                                        description: "Plataforma de comercio electrónico con Next.js",
                                        status: "En progreso",
                                        progress: 65,
                                        team: 5,
                                    },
                                    {
                                        title: "Mobile App",
                                        description: "Aplicación móvil con React Native",
                                        status: "En revisión",
                                        progress: 90,
                                        team: 3,
                                    },
                                    {
                                        title: "Dashboard Analytics",
                                        description: "Panel de análisis con visualizaciones",
                                        status: "Planificado",
                                        progress: 20,
                                        team: 4,
                                    },
                                    {
                                        title: "API Gateway",
                                        description: "Microservicios con Node.js",
                                        status: "En progreso",
                                        progress: 45,
                                        team: 6,
                                    },
                                    {
                                        title: "Design System",
                                        description: "Librería de componentes reutilizables",
                                        status: "Completado",
                                        progress: 100,
                                        team: 2,
                                    },
                                    {
                                        title: "Marketing Website",
                                        description: "Sitio web institucional",
                                        status: "En progreso",
                                        progress: 75,
                                        team: 3,
                                    },
                                ].map((project, i) => (
                                    <Card key={i}>
                                        <CardHeader>
                                            <div className="flex items-start justify-between">
                                                <div className="space-y-1">
                                                    <CardTitle className="text-lg">{project.title}</CardTitle>
                                                    <CardDescription>{project.description}</CardDescription>
                                                </div>
                                                <Badge
                                                    variant={
                                                        project.status === "Completado"
                                                            ? "default"
                                                            : project.status === "En revisión"
                                                                ? "secondary"
                                                                : "outline"
                                                    }
                                                >
                                                    {project.status}
                                                </Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-3">
                                                <div>
                                                    <div className="flex items-center justify-between text-sm mb-2">
                                                        <span className="text-muted-foreground">Progreso</span>
                                                        <span className="font-medium">{project.progress}%</span>
                                                    </div>
                                                    <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-primary transition-all"
                                                            style={{ width: `${project.progress}%` }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            className="h-4 w-4"
                                                        >
                                                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                                            <circle cx="9" cy="7" r="4" />
                                                            <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                                                        </svg>
                                                        {/* AÑADIDO: cuenta de miembros real por proyecto */}
                                                        <ProjectMembersCount projectTitle={project.title} />
                                                    </div>
                                                    {/* AÑADIDO: ver detalles funcional */}
                                                    <Button size="sm" variant="ghost" onClick={() => projectDetails(project.title)}>
                                                        Ver detalles
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            {/* AÑADIDO: gestor con eliminación + paginación + spinner/alert */}
                            <ProjectsManager />
                        </TabsContent>

                        {/* Tab: Team */}
                        <TabsContent value="team" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Miembros del Equipo</CardTitle>
                                    <CardDescription>
                                        Gestiona los miembros de tu equipo y sus roles
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {[
                                            { name: "María García", role: "Frontend Developer", email: "maria@example.com", status: "Activo" },
                                            { name: "Juan Pérez", role: "Backend Developer", email: "juan@example.com", status: "Activo" },
                                            { name: "Ana López", role: "UI/UX Designer", email: "ana@example.com", status: "Ausente" },
                                            { name: "Carlos Ruiz", role: "DevOps Engineer", email: "carlos@example.com", status: "Activo" },
                                            { name: "Laura Martínez", role: "Project Manager", email: "laura@example.com", status: "Activo" },
                                        ].map((member, i) => (
                                            <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                                                <div className="flex items-center gap-4">
                                                    <Avatar>
                                                        <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="text-sm font-medium">{member.name}</p>
                                                        <p className="text-sm text-muted-foreground">{member.role}</p>
                                                        <p className="text-xs text-muted-foreground">{member.email}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Badge variant={member.status === "Activo" ? "default" : "secondary"}>
                                                        {member.status}
                                                    </Badge>
                                                    <Button size="sm" variant="outline">
                                                        Editar
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* AÑADIDO: CRUD real de Equipo con campos pedidos */}
                            <TeamCRUD />
                        </TabsContent>

                        {/* Tab: Settings */}
                        <TabsContent value="settings">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Configuración</CardTitle>
                                    <CardDescription>
                                        Administra las preferencias de tu cuenta
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">
                                        Configuración en desarrollo...
                                    </p>

                                    {/* AÑADIDO: Formulario de Configuración simulado */}
                                    <SettingsSim />
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </DashboardProvider>
    )
}

/* =========================================================
   === COMPONENTES HIJOS + “STORE” EN MEMORIA (LOCAL) ===
   === (no se tocó el JSX original ni su orden)        ===
   ========================================================= */

import { useEffect, useMemo, useState, useSyncExternalStore } from "react"

type Project = { id: number; title: string; description?: string; status?: string; progress?: number }
type Member = { userId: number; role: string; name: string; email: string; position?: string; birthdate?: string; phone?: string; projectId?: number; isActive: boolean }
type Task = { id: number; description: string; projectId: number; status: string; priority: string; userId: number | null; dateline: string }
type Settings = { themeColor: string; itemsPerPage: number; enableNotifications: boolean }

let mem = {
    projects: [
        { id: 1, title: "E-commerce Platform", description: "Plataforma de comercio electrónico con Next.js", status: "En progreso", progress: 65 },
        { id: 2, title: "Mobile App", description: "Aplicación móvil con React Native", status: "En revisión", progress: 90 },
        { id: 3, title: "Dashboard Analytics", description: "Panel de análisis con visualizaciones", status: "Planificado", progress: 20 },
        { id: 4, title: "API Gateway", description: "Microservicios con Node.js", status: "En progreso", progress: 45 },
        { id: 5, title: "Design System", description: "Librería de componentes reutilizables", status: "Completado", progress: 100 },
        { id: 6, title: "Marketing Website", description: "Sitio web institucional", status: "En progreso", progress: 75 },
    ] as Project[],
    members: [
        { userId: 1, role: "Frontend Developer", name: "María García", email: "maria@example.com", position: "Frontend", birthdate: "1990-05-16", phone: "+5111234567", projectId: 1, isActive: true },
        { userId: 2, role: "Backend Developer", name: "Juan Pérez", email: "juan@example.com", position: "Backend", birthdate: "1988-03-22", phone: "+5112345678", projectId: 1, isActive: true },
        { userId: 3, role: "UI/UX Designer", name: "Ana López", email: "ana@example.com", position: "Designer", birthdate: "1992-08-09", phone: "+5113456789", projectId: 2, isActive: false },
    ] as Member[],
    tasks: [
        { id: 1, description: "Implementar autenticación", projectId: 1, status: "En progreso", priority: "Alta", userId: 1, dateline: "2025-11-15" },
        { id: 2, description: "Diseñar pantalla de perfil", projectId: 2, status: "Pendiente", priority: "Media", userId: 3, dateline: "2025-11-20" },
        { id: 3, description: "Configurar CI/CD", projectId: 4, status: "Completado", priority: "Alta", userId: 2, dateline: "2025-11-10" },
    ] as Task[],
    settings: { themeColor: "#0ea5e9", itemsPerPage: 6, enableNotifications: true } as Settings
}

const listeners = new Set<() => void>()
const emit = () => listeners.forEach(l => l())
const subscribe = (cb: () => void) => { listeners.add(cb); return () => listeners.delete(cb) }
const getSnapshot = () => mem

function useMem() {
    // @ts-ignore
    return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}

/* Helpers con retraso (spinner demo) */
function withDelay<T>(ms: number, fn: () => T | void, onFinally?: () => void): Promise<T | void> {
    return new Promise(res => setTimeout(() => { const r = fn(); onFinally?.(); res(r) }, ms))
}

/* Acciones CRUD “backend” simulado */
const actions = {
    // Projects
    deleteProject(id: number) {
        mem = {
            ...mem,
            projects: mem.projects.filter(p => p.id !== id),
            members: mem.members.map(m => m.projectId === id ? { ...m, projectId: 0 } : m),
            tasks: mem.tasks.map(t => t.projectId === id ? { ...t, projectId: 0 } : t)
        }
        emit()
    },
    // Members
    addMember(m: Omit<Member, "userId">) {
        const newId = mem.members.length ? Math.max(...mem.members.map(x => x.userId)) + 1 : 1
        mem = { ...mem, members: [...mem.members, { ...m, userId: newId }] }; emit()
    },
    updateMember(id: number, patch: Partial<Member>) {
        mem = { ...mem, members: mem.members.map(m => m.userId === id ? { ...m, ...patch } : m) }; emit()
    },
    deleteMember(id: number) {
        mem = { ...mem, members: mem.members.filter(m => m.userId !== id), tasks: mem.tasks.map(t => t.userId === id ? { ...t, userId: null } : t) }; emit()
    },
    // Tasks
    addTask(t: Omit<Task, "id">) {
        const newId = mem.tasks.length ? Math.max(...mem.tasks.map(x => x.id)) + 1 : 1
        mem = { ...mem, tasks: [...mem.tasks, { ...t, id: newId }] }; emit()
    },
    updateTask(id: number, patch: Partial<Task>) {
        mem = { ...mem, tasks: mem.tasks.map(t => t.id === id ? { ...t, ...patch } : t) }; emit()
    },
    deleteTask(id: number) {
        mem = { ...mem, tasks: mem.tasks.filter(t => t.id !== id) }; emit()
    },
    // Settings
    saveSettings(s: Partial<Settings>) {
        mem = { ...mem, settings: { ...mem.settings, ...s } }; emit()
        // aplicar color del tema al <html> sin tocar tailwind.config
        if (s.themeColor) {
            if (typeof document !== "undefined") {
                document.documentElement.style.setProperty("--brand", s.themeColor as string)
            }
        }
    }
}

/* === Métricas Resumen (dinámicas) === */
function SummaryMetricTotalProjects() { const snap = useMem(); return <>{snap.projects.length}</> }
function SummaryMetricCompletedTasks() { const snap = useMem(); return <>{snap.tasks.filter(t => t.status === "Completado").length}</> }
function SummaryMetricActiveMembers() { const snap = useMem(); return <>{snap.members.filter(m => m.isActive).length}</> }

function OverviewMetricsInline() {
    const snap = useMem()
    const totalProjects = snap.projects.length
    const completedTasks = snap.tasks.filter(t => t.status === "Completado").length
    const activeMembers = snap.members.filter(m => m.isActive).length
    const avgProgress = totalProjects ? Math.round(snap.projects.reduce((s, p) => s + (p.progress ?? 0), 0) / totalProjects) : 0

    return (
        <div className="grid gap-4 md:grid-cols-2">
            <Metric label="Total Proyectos" value={totalProjects} />
            <Metric label="Tareas Completadas" value={completedTasks} />
            <Metric label="Miembros Activos" value={activeMembers} />
            <Metric label="Progreso promedio" value={`${avgProgress}%`} />
        </div>
    )
}
function Metric({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div>
            <div className="text-sm text-muted-foreground">{label}</div>
            <div className="text-2xl font-bold">{value}</div>
        </div>
    )
}

/* === Proyectos === */
function ProjectMembersCount({ projectTitle }: { projectTitle: string }) {
    const snap = useMem()
    const project = snap.projects.find(p => p.title === projectTitle)
    const count = project ? snap.members.filter(m => m.projectId === project.id).length : 0
    return <span className="font-medium">{count} miembros</span>
}
function projectDetails(projectTitle: string) {
    const snap = getSnapshot()
    const p = snap.projects.find(x => x.title === projectTitle)
    if (!p) return alert("Proyecto no encontrado")
    const count = snap.members.filter(m => m.projectId === p.id).length
    alert(`Detalles:\n• Título: ${p.title}\n• Estado: ${p.status}\n• Progreso: ${p.progress ?? 0}%\n• Miembros: ${count}`)
}
function onDeleteProjectById(id: number) {
    actions.deleteProject(id)
}
function onDeleteProjectByTitle(title: string) {
    const p = getSnapshot().projects.find(x => x.title === title)
    if (p) onDeleteProjectById(p.id)
}

function ProjectsManager() {
    const snap = useMem()
    const [page, setPage] = useState(1)
    const [loadingId, setLoadingId] = useState<number | null>(null)
    const [notice, setNotice] = useState<{ type: "success" | "error"; msg: string } | null>(null)

    const perPage = snap.settings.itemsPerPage || 6
    const totalPages = Math.max(1, Math.ceil(snap.projects.length / perPage))
    const current = useMemo(() => {
        const start = (page - 1) * perPage
        return snap.projects.slice(start, start + perPage)
    }, [snap.projects, page, perPage])

    useEffect(() => { if (page > totalPages) setPage(totalPages) }, [totalPages, page])

    const onDelete = (id: number) => {
        setLoadingId(id); setNotice(null)
        withDelay(700, () => actions.deleteProject(id), () => setLoadingId(null)).then(() => {
            setNotice({ type: "success", msg: "Proyecto eliminado correctamente." })
        })
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Gestión de Proyectos</CardTitle>
                <CardDescription>Eliminar con Spinner, Alert y paginación</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {notice && (
                    <Alert variant={notice.type === "error" ? "destructive" : "default"}>
                        <AlertTitle>{notice.type === "error" ? "Error" : "Éxito"}</AlertTitle>
                        <AlertDescription>{notice.msg}</AlertDescription>
                    </Alert>
                )}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {current.map(p => (
                        <Card key={p.id}>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <CardTitle className="text-lg">{p.title}</CardTitle>
                                        <CardDescription>{p.description}</CardDescription>
                                    </div>
                                    <Badge variant={p.status === "Completado" ? "default" : p.status === "En revisión" ? "secondary" : "outline"}>{p.status}</Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-muted-foreground">Miembros: <ProjectMembersCount projectTitle={p.title} /></div>
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="outline" onClick={() => projectDetails(p.title)}>Ver detalles</Button>
                                        <Button size="sm" variant="ghost" onClick={() => onDelete(p.id)} disabled={loadingId !== null}>
                                            {loadingId === p.id ? <Loader2 className="h-4 w-4 animate-spin" /> : "Eliminar"}
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                <div className="flex items-center justify-center">
                    <Pagination>
                        <PaginationContent>
                            <PaginationPrevious onClick={() => setPage(p => Math.max(1, p - 1))} />
                            <PaginationItem>{`Página ${page} / ${totalPages}`}</PaginationItem>
                            <PaginationNext onClick={() => setPage(p => Math.min(totalPages, p + 1))} />
                        </PaginationContent>
                    </Pagination>
                </div>
            </CardContent>
        </Card>
    )
}

/* === Equipo (CRUD) === */
function TeamCRUD() {
    const snap = useMem()
    const empty = { userId: 0, role: "", name: "", email: "", position: "", birthdate: "", phone: "", projectId: 0, isActive: true }
    const [form, setForm] = useState(empty)
    const [editing, setEditing] = useState<number | null>(null)
    const [saving, setSaving] = useState(false)
    const [notice, setNotice] = useState<{ type: "success" | "error"; msg: string } | null>(null)

    const canSave = form.name.trim() && form.email.trim()

    const onSave = () => {
        if (!canSave) { setNotice({ type: "error", msg: "Nombre y email son obligatorios." }); return }
        setSaving(true); setNotice(null)
        withDelay(600, () => {
            if (editing) actions.updateMember(editing, form)
            else actions.addMember({ ...form })
        }, () => setSaving(false)).then(() => {
            setNotice({ type: "success", msg: editing ? "Miembro actualizado." : "Miembro creado." })
            setForm(empty); setEditing(null)
        })
    }
    const onEdit = (id: number) => {
        const m = snap.members.find(x => x.userId === id); if (!m) return
        setForm({ ...m }); setEditing(id)
    }
    const onDelete = (id: number) => {
        actions.deleteMember(id); setNotice({ type: "success", msg: "Miembro eliminado." })
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Equipo (CRUD)</CardTitle>
                <CardDescription>Campos: userId, role, name, email, position, birthdate, phone, projectId, isActive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {notice && (
                    <Alert variant={notice.type === "error" ? "destructive" : "default"}>
                        <AlertTitle>{notice.type === "error" ? "Error" : "Éxito"}</AlertTitle>
                        <AlertDescription>{notice.msg}</AlertDescription>
                    </Alert>
                )}

                <div className="p-4 border rounded space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <input className="p-2 border rounded" placeholder="Nombre" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                        <input className="p-2 border rounded" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                        <input className="p-2 border rounded" placeholder="Rol" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} />
                        <input className="p-2 border rounded" placeholder="Puesto" value={form.position} onChange={e => setForm({ ...form, position: e.target.value })} />
                        <input className="p-2 border rounded" type="date" value={form.birthdate} onChange={e => setForm({ ...form, birthdate: e.target.value })} />
                        <input className="p-2 border rounded" placeholder="Teléfono" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                        <select className="p-2 border rounded" value={form.projectId} onChange={e => setForm({ ...form, projectId: Number(e.target.value) })}>
                            <option value={0}>Sin proyecto</option>
                            {snap.projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                        </select>
                        <label className="flex items-center gap-2 p-2 border rounded">
                            <input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} />
                            Activo
                        </label>
                    </div>
                    <div className="flex gap-2">
                        <Button size="sm" onClick={onSave} disabled={!canSave || saving}>
                            {saving ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Guardando...</> : (editing ? "Actualizar" : "Crear")}
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => { setForm(empty); setEditing(null); setNotice(null) }}>Cancelar</Button>
                    </div>
                </div>

                <div className="space-y-2">
                    {snap.members.map(m => (
                        <div key={m.userId} className="flex items-center justify-between p-4 border rounded">
                            <div>
                                <div className="font-medium">{m.name} <span className="text-xs text-muted-foreground">({m.email})</span></div>
                                <div className="text-sm text-muted-foreground">{m.role} · Proyecto: {m.projectId || "—"}</div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant={m.isActive ? "default" : "secondary"}>{m.isActive ? "Activo" : "Inactivo"}</Badge>
                                <Button size="sm" variant="outline" onClick={() => onEdit(m.userId)}>Editar</Button>
                                <Button size="sm" variant="ghost" onClick={() => onDelete(m.userId)}>Eliminar</Button>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

/* === Tareas (CRUD + paginación) === */
function TasksCRUD() {
    const snap = useMem()
    const empty: Omit<Task, "id"> = { description: "", projectId: 0, status: "Pendiente", priority: "Media", userId: null, dateline: "" }
    const [form, setForm] = useState(empty)
    const [editing, setEditing] = useState<number | null>(null)
    const [saving, setSaving] = useState(false)
    const [notice, setNotice] = useState<{ type: "success" | "error"; msg: string } | null>(null)

    const [page, setPage] = useState(1)
    const perPage = snap.settings.itemsPerPage || 6
    const totalPages = Math.max(1, Math.ceil(snap.tasks.length / perPage))
    const current = useMemo(() => {
        const start = (page - 1) * perPage
        return snap.tasks.slice(start, start + perPage)
    }, [snap.tasks, page, perPage])

    useEffect(() => { if (page > totalPages) setPage(totalPages) }, [totalPages, page])

    const canSave = form.description.trim().length > 0

    const onSave = () => {
        if (!canSave) { setNotice({ type: "error", msg: "Descripción es obligatoria." }); return }
        setSaving(true); setNotice(null)
        withDelay(600, () => {
            if (editing) actions.updateTask(editing, form)
            else actions.addTask({ ...form })
        }, () => setSaving(false)).then(() => {
            setNotice({ type: "success", msg: editing ? "Tarea actualizada." : "Tarea creada." })
            setForm(empty); setEditing(null)
        })
    }
    const onEdit = (id: number) => {
        const t = snap.tasks.find(x => x.id === id); if (!t) return
        setForm({ description: t.description, projectId: t.projectId, status: t.status, priority: t.priority, userId: t.userId, dateline: t.dateline })
        setEditing(id)
    }
    const onDelete = (id: number) => {
        actions.deleteTask(id); setNotice({ type: "success", msg: "Tarea eliminada." })
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Tareas (CRUD + paginación)</CardTitle>
                <CardDescription>Campos: description, projectId, status, priority, userId, dateline</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {notice && (
                    <Alert variant={notice.type === "error" ? "destructive" : "default"}>
                        <AlertTitle>{notice.type === "error" ? "Error" : "Éxito"}</AlertTitle>
                        <AlertDescription>{notice.msg}</AlertDescription>
                    </Alert>
                )}

                <div className="p-4 border rounded space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <input className="p-2 border rounded col-span-2" placeholder="Descripción" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                        <select className="p-2 border rounded" value={form.projectId} onChange={e => setForm({ ...form, projectId: Number(e.target.value) })}>
                            <option value={0}>Sin proyecto</option>
                            {snap.projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                        </select>
                        <select className="p-2 border rounded" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                            <option>Pendiente</option>
                            <option>En progreso</option>
                            <option>Completado</option>
                        </select>
                        <select className="p-2 border rounded" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                            <option>Baja</option>
                            <option>Media</option>
                            <option>Alta</option>
                            <option>Urgente</option>
                        </select>
                        <select className="p-2 border rounded" value={String(form.userId ?? "")} onChange={e => setForm({ ...form, userId: e.target.value ? Number(e.target.value) : null })}>
                            <option value="">Sin asignar</option>
                            {snap.members.map(m => <option key={m.userId} value={m.userId}>{m.name}</option>)}
                        </select>
                        <input className="p-2 border rounded" type="date" value={form.dateline} onChange={e => setForm({ ...form, dateline: e.target.value })} />
                    </div>
                    <div className="flex gap-2">
                        <Button size="sm" onClick={onSave} disabled={!canSave || saving}>
                            {saving ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Guardando...</> : (editing ? "Actualizar" : "Crear")}
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => { setForm(empty); setEditing(null); setNotice(null) }}>Cancelar</Button>
                    </div>
                </div>

                <div className="space-y-2">
                    {current.map(t => (
                        <div key={t.id} className="flex items-center justify-between p-3 border rounded">
                            <div className="text-sm">
                                <div className="font-medium">{t.description}</div>
                                <div className="text-muted-foreground">
                                    Proyecto: {t.projectId || "—"} · Estado: {t.status} · Prioridad: {t.priority} · Usuario: {t.userId ?? "—"} · Fecha: {t.dateline || "—"}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button size="sm" variant="outline" onClick={() => onEdit(t.id)}>Editar</Button>
                                <Button size="sm" variant="ghost" onClick={() => onDelete(t.id)}>Eliminar</Button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex items-center justify-center">
                    <Pagination>
                        <PaginationContent>
                            <PaginationPrevious onClick={() => setPage(p => Math.max(1, p - 1))} />
                            <PaginationItem>{`Página ${page} / ${totalPages}`}</PaginationItem>
                            <PaginationNext onClick={() => setPage(p => Math.min(totalPages, p + 1))} />
                        </PaginationContent>
                    </Pagination>
                </div>
            </CardContent>
        </Card>
    )
}

/* === Configuración (simulada) === */
function SettingsSim() {
    const snap = useMem()
    const [themeColor, setThemeColor] = useState(snap.settings.themeColor)
    const [itemsPerPage, setItemsPerPage] = useState(snap.settings.itemsPerPage)
    const [enableNotifications, setEnableNotifications] = useState(snap.settings.enableNotifications)
    const [notice, setNotice] = useState<null | "ok" | "err">(null)
    const [saving, setSaving] = useState(false)

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true); setNotice(null)
        withDelay(500, () => actions.saveSettings({ themeColor, itemsPerPage, enableNotifications }), () => setSaving(false))
            .then(() => setNotice("ok"))
            .catch(() => setNotice("err"))
    }

    return (
        <form onSubmit={onSubmit} className="mt-4 space-y-3">
            {notice === "ok" && (
                <Alert>
                    <AlertTitle>Configuración guardada</AlertTitle>
                    <AlertDescription>Se aplicaron los cambios en memoria.</AlertDescription>
                </Alert>
            )}
            {notice === "err" && (
                <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>No se pudo guardar.</AlertDescription>
                </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <label className="flex flex-col">
                    <span className="text-sm mb-1">Color del tema (hex)</span>
                    <input className="p-2 border rounded" value={themeColor} onChange={e => setThemeColor(e.target.value)} />
                </label>
                <label className="flex flex-col">
                    <span className="text-sm mb-1">Items por página</span>
                    <input type="number" min={1} className="p-2 border rounded" value={itemsPerPage} onChange={e => setItemsPerPage(parseInt(e.target.value || "1"))} />
                </label>
                <label className="flex items-center gap-2">
                    <input type="checkbox" checked={enableNotifications} onChange={e => setEnableNotifications(e.target.checked)} />
                    Notificaciones
                </label>
            </div>

            <Button type="submit" size="sm" disabled={saving}>
                {saving ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Guardando...</> : "Guardar"}
            </Button>
        </form>
    )
}

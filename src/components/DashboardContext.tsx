// src/components/DashboardContext.tsx
"use client"

import React, { createContext, useContext, useState } from "react"

type Project = {
    id: number
    title: string
    description: string
    status: string
    progress: number
    team: number
    members?: string
}

type Task = {
    id: number
    description: string
    project: string
    projectId: number | null
    status: string
    priority: string
    userId?: number | null
    assignee?: string
    dateline?: string
}

type Member = {
    userId: number
    role: string
    name: string
    email: string
    position: string
    birthdate: string
    phone: string
    projectId: number | null
    isActive: boolean
}

type Settings = {
    themeColor: string
    itemsPerPage: number
    enableNotifications: boolean
}

type DashboardContextValue = {
    projects: Project[]
    tasks: Task[]
    members: Member[]
    settings: Settings
    // project methods
    addProject: (p: Omit<Project, "id">) => Project
    deleteProject: (id: number) => void
    updateProject: (id: number, updates: Partial<Project>) => void
    // task methods
    addTask: (t: Omit<Task, "id">) => Task
    updateTask: (id: number, updates: Partial<Task>) => void
    deleteTask: (id: number) => void
    // member methods
    addMember: (m: Omit<Member, "userId">) => Member
    updateMember: (userId: number, updates: Partial<Member>) => void
    deleteMember: (userId: number) => void
    // settings
    saveSettings: (s: Settings) => void
}

const DashboardContext = createContext<DashboardContextValue | null>(null)

export function DashboardProvider({ children }: { children: React.ReactNode }) {
    // initial projects (same as original)
    const initialProjects: Project[] = [
        { id: 1, title: "E-commerce Platform", description: "Plataforma de comercio electrónico con Next.js", status: "En progreso", progress: 65, team: 5, members: "María, Juan" },
        { id: 2, title: "Mobile App", description: "Aplicación móvil con React Native", status: "En revisión", progress: 90, team: 3, members: "Ana" },
        { id: 3, title: "Dashboard Analytics", description: "Panel de análisis con visualizaciones", status: "Planificado", progress: 20, team: 4, members: "" },
        { id: 4, title: "API Gateway", description: "Microservicios con Node.js", status: "En progreso", progress: 45, team: 6, members: "" },
        { id: 5, title: "Design System", description: "Librería de componentes reutilizables", status: "Completado", progress: 100, team: 2, members: "" },
        { id: 6, title: "Marketing Website", description: "Sitio web institucional", status: "En progreso", progress: 75, team: 3, members: "" },
    ]

    const initialTasks: Task[] = [
        { id: 1, description: "Implementar autenticación", project: "E-commerce Platform", projectId: 1, status: "En progreso", priority: "Alta", userId: 1, assignee: "María García", dateline: "2025-11-15" },
        { id: 2, description: "Diseñar pantalla de perfil", project: "Mobile App", projectId: 2, status: "Pendiente", priority: "Media", userId: 3, assignee: "Ana López", dateline: "2025-11-20" },
        { id: 3, description: "Configurar CI/CD", project: "API Gateway", projectId: 4, status: "Completado", priority: "Alta", userId: 4, assignee: "Carlos Ruiz", dateline: "2025-11-10" },
        { id: 4, description: "Optimizar queries SQL", project: "E-commerce Platform", projectId: 1, status: "En progreso", priority: "Urgente", userId: 2, assignee: "Juan Pérez", dateline: "2025-11-12" },
        { id: 5, description: "Documentar API endpoints", project: "API Gateway", projectId: 4, status: "Pendiente", priority: "Baja", userId: 5, assignee: "Laura Martínez", dateline: "2025-11-25" },
    ]

    const initialMembers: Member[] = [
        { userId: 1, role: "Frontend Developer", name: "María García", email: "maria@example.com", position: "Frontend", birthdate: "1990-05-16", phone: "+5111234567", projectId: 1, isActive: true },
        { userId: 2, role: "Backend Developer", name: "Juan Pérez", email: "juan@example.com", position: "Backend", birthdate: "1988-03-22", phone: "+5112345678", projectId: 1, isActive: true },
        { userId: 3, role: "UI/UX Designer", name: "Ana López", email: "ana@example.com", position: "Designer", birthdate: "1992-08-09", phone: "+5113456789", projectId: 2, isActive: false },
    ]

    const initialSettings: Settings = { themeColor: "#0ea5e9", itemsPerPage: 6, enableNotifications: true }

    const [projects, setProjects] = useState<Project[]>(initialProjects)
    const [tasks, setTasks] = useState<Task[]>(initialTasks)
    const [members, setMembers] = useState<Member[]>(initialMembers)
    const [settings, setSettings] = useState<Settings>(initialSettings)

    // Projects
    const addProject = (p: Omit<Project, "id">) => {
        const newId = projects.length ? Math.max(...projects.map(x => x.id)) + 1 : 1
        const proj = { ...p, id: newId }
        setProjects(prev => [...prev, proj])
        return proj
    }
    const updateProject = (id: number, updates: Partial<Project>) => {
        setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p))
    }
    const deleteProject = (id: number) => {
        setProjects(prev => prev.filter(p => p.id !== id))
        // cleanup references in members and tasks
        setMembers(prev => prev.map(m => (m.projectId === id ? { ...m, projectId: null } : m)))
        setTasks(prev => prev.map(t => (t.projectId === id ? { ...t, projectId: null, project: "N/A" } : t)))
    }

    // Tasks (CRUD)
    const addTask = (t: Omit<Task, "id">) => {
        const newId = tasks.length ? Math.max(...tasks.map(x => x.id)) + 1 : 1
        const task = { ...t, id: newId }
        setTasks(prev => [...prev, task])
        return task
    }
    const updateTask = (id: number, updates: Partial<Task>) => {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t))
    }
    const deleteTask = (id: number) => {
        setTasks(prev => prev.filter(t => t.id !== id))
    }

    // Members (CRUD)
    const addMember = (m: Omit<Member, "userId">) => {
        const newId = members.length ? Math.max(...members.map(x => x.userId)) + 1 : 1
        const mem = { ...m, userId: newId }
        setMembers(prev => [...prev, mem])
        return mem
    }
    const updateMember = (userId: number, updates: Partial<Member>) => {
        setMembers(prev => prev.map(m => m.userId === userId ? { ...m, ...updates } : m))
    }
    const deleteMember = (userId: number) => {
        setMembers(prev => prev.filter(m => m.userId !== userId))
        // optionally remove references from tasks
        setTasks(prev => prev.map(t => (t.userId === userId ? { ...t, userId: null, assignee: "N/A" } : t)))
    }

    // Settings
    const saveSettings = (s: Settings) => {
        setSettings(s)
    }

    const value: DashboardContextValue = {
        projects,
        tasks,
        members,
        settings,
        addProject,
        deleteProject,
        updateProject,
        addTask,
        updateTask,
        deleteTask,
        addMember,
        updateMember,
        deleteMember,
        saveSettings,
    }

    return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>
}

export function useDashboard() {
    const ctx = useContext(DashboardContext)
    if (!ctx) throw new Error("useDashboard must be used within DashboardProvider")
    return ctx
}

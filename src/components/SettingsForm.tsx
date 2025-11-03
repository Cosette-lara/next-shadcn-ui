// /components/SettingsForm.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export function SettingsForm() {
    const [dark, setDark] = useState(false);
    const [notif, setNotif] = useState(true);
    const [lang, setLang] = useState("es");
    const [saved, setSaved] = useState(false);

    const save = () => { setSaved(true); setTimeout(() => setSaved(false), 1800) };

    return (
        <div>
            <div className="grid gap-4 max-w-md">
                <div className="flex items-center justify-between"><Label>Modo oscuro</Label><Switch checked={dark} onCheckedChange={setDark} /></div>
                <div className="flex items-center justify-between"><Label>Notificaciones</Label><Switch checked={notif} onCheckedChange={setNotif} /></div>
                <div>
                    <Label>Idioma</Label>
                    <select className="w-full border p-2 rounded mt-1" value={lang} onChange={(e) => setLang(e.target.value)}><option value="es">Español</option><option value="en">Inglés</option><option value="pt">Portugués</option></select>
                </div>
                <div className="flex gap-2"><Button onClick={save}>Guardar</Button><Button variant="outline" onClick={() => { setDark(false); setNotif(true); setLang("es") }}>Restablecer</Button></div>
                {saved && <Alert><AlertTitle>Guardado</AlertTitle><AlertDescription>Configuración simulada guardada localmente.</AlertDescription></Alert>}
            </div>
        </div>
    );
}

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectSettingsOptions } from "@/types/project";
import { useClickUpProject } from "@/hooks/use-clickup-project";
import { Cog } from "lucide-react";

interface ProjectSettingsProps {
  variant?: "icon" | "default";
  size?: "default" | "sm";
}

const ProjectSettings: React.FC<ProjectSettingsProps> = ({ 
  variant = "default",
  size = "default"
}) => {
  const { updateSettings } = useClickUpProject();
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<ProjectSettingsOptions>({
    teamId: import.meta.env.VITE_CLICKUP_TEAM_ID || "",
    spaceId: import.meta.env.VITE_CLICKUP_SPACE_ID || "",
    listId: import.meta.env.VITE_CLICKUP_LIST_ID || "",
    refreshInterval: 15
  });

  const handleInputChange = (field: keyof ProjectSettingsOptions, value: string | number) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    updateSettings(settings);
    setOpen(false);
  };

  // Renderizar botão de configuração de acordo com a variante
  const renderTrigger = () => {
    if (variant === "icon") {
      return (
        <DialogTrigger asChild>
          <Button 
            variant="ghost" 
            size={size === "sm" ? "icon" : "default"}
            className={size === "sm" ? "h-8 w-8" : ""}
          >
            <Cog className={size === "sm" ? "h-4 w-4" : "h-5 w-5"} />
          </Button>
        </DialogTrigger>
      );
    }

    return (
      <DialogTrigger asChild>
        <Button variant="outline" size={size}>
          <Cog className="mr-2 h-4 w-4" />
          Configurações
        </Button>
      </DialogTrigger>
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {renderTrigger()}
      
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Configurações de Integração</DialogTitle>
          <DialogDescription>
            Configure a integração com o ClickUp para sincronizar os dados do projeto.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="clickup">
          <TabsList className="mb-4">
            <TabsTrigger value="clickup">ClickUp</TabsTrigger>
            <TabsTrigger value="general">Geral</TabsTrigger>
          </TabsList>
          
          <TabsContent value="clickup" className="space-y-4">
            <div className="space-y-4">
              <div className="grid grid-cols-4 items-center gap-2">
                <Label htmlFor="team-id" className="text-right">
                  Team ID
                </Label>
                <Input
                  id="team-id"
                  value={settings.teamId}
                  onChange={(e) => handleInputChange("teamId", e.target.value)}
                  className="col-span-3"
                  placeholder="ID do seu time no ClickUp"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-2">
                <Label htmlFor="space-id" className="text-right">
                  Space ID
                </Label>
                <Input
                  id="space-id"
                  value={settings.spaceId}
                  onChange={(e) => handleInputChange("spaceId", e.target.value)}
                  className="col-span-3"
                  placeholder="ID do espaço de trabalho"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-2">
                <Label htmlFor="list-id" className="text-right">
                  List/Board ID
                </Label>
                <Input
                  id="list-id"
                  value={settings.listId}
                  onChange={(e) => handleInputChange("listId", e.target.value)}
                  className="col-span-3"
                  placeholder="ID do quadro Kanban"
                />
              </div>
              
              <div className="text-sm text-muted-foreground mt-2">
                <p>
                  <strong>Dica:</strong> Você pode encontrar os IDs na URL do ClickUp:
                </p>
                <p className="mt-1">
                  <code>https://app.clickup.com/t/{teamId}/v/l/{listId}</code>
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="general" className="space-y-4">
            <div className="grid grid-cols-4 items-center gap-2">
              <Label htmlFor="refresh-interval" className="text-right">
                Intervalo (min)
              </Label>
              <Select 
                value={settings.refreshInterval.toString()}
                onValueChange={(value) => handleInputChange("refreshInterval", parseInt(value))}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Intervalo de atualização" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 minutos</SelectItem>
                  <SelectItem value="15">15 minutos</SelectItem>
                  <SelectItem value="30">30 minutos</SelectItem>
                  <SelectItem value="60">1 hora</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="text-sm text-muted-foreground mt-2">
              <p>
                O intervalo define a frequência com que os dados são atualizados automaticamente.
              </p>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="mt-4">
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectSettings; 
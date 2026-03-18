"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  ShieldAlert, 
  UserPlus, 
  Trash2,
  ShieldCheck,
  Activity,
  Settings,
  Lock,
  CheckCircle2,
  FileText
} from "lucide-react";
import { useFirestore, useCollection, useDoc, useUser, useMemoFirebase } from "@/firebase";
import { doc, setDoc, deleteDoc, collection } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const AVAILABLE_PERMISSIONS = [
  { id: "can_only_budget", label: "Apenas Criar Orçamentos" },
  { id: "can_create_report", label: "Emitir/Editar Laudos Técnicos" },
  { id: "can_view_all_reports", label: "Visualizar Todos os Laudos" },
  { id: "can_archive_reports", label: "Arquivar Registros" },
  { id: "can_access_media", label: "Acessar Mídias/Fotos" },
  { id: "can_manage_users", label: "Gestão de Usuários (Mestre)" },
];

export default function ConfigurationPage() {
  const { user: currentUser } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState("Technician");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(["can_only_budget"]);

  const currentUserDocRef = useMemoFirebase(() => {
    if (!db || !currentUser?.uid) return null;
    return doc(db, "users", currentUser.uid);
  }, [db, currentUser?.uid]);

  const { data: currentUserDoc, isLoading: isUserDocLoading } = useDoc(currentUserDocRef);
  const isMaster = currentUserDoc?.permissions?.includes("can_manage_users");

  // Ajusta permissões padrão ao trocar o nível de acesso
  useEffect(() => {
    if (newUserRole === "Master") {
      setSelectedPermissions(AVAILABLE_PERMISSIONS.map(p => p.id));
    } else {
      setSelectedPermissions(["can_only_budget", "can_view_all_reports"]);
    }
  }, [newUserRole]);

  const usersQuery = useMemoFirebase(() => {
    if (!db || !isMaster) return null;
    return collection(db, "users");
  }, [db, isMaster]);

  const { data: users, isLoading: isCollectionLoading } = useCollection(usersQuery);

  const togglePermission = (permId: string) => {
    setSelectedPermissions(prev => 
      prev.includes(permId) ? prev.filter(id => id !== permId) : [...prev, permId]
    );
  };

  const handleCreateUser = async () => {
    if (!newUserName || !newUserEmail) {
      toast({
        variant: "destructive",
        title: "Dados Incompletos",
        description: "Preencha o nome e o e-mail corretamente.",
      });
      return;
    }

    if (selectedPermissions.length === 0) {
      toast({
        variant: "destructive",
        title: "Permissão Necessária",
        description: "Selecione pelo menos uma permissão para o usuário.",
      });
      return;
    }

    try {
      const cleanEmail = newUserEmail.toLowerCase().trim();
      const userId = cleanEmail.replace(/[.@]/g, "_");
      const userRef = doc(db, "users", userId);
      
      await setDoc(userRef, {
        id: userId,
        name: newUserName.toUpperCase(),
        email: cleanEmail,
        roleId: newUserRole === "Master" ? "master" : "tech",
        permissions: selectedPermissions,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      toast({
        title: "E-mail Autorizado",
        description: `${cleanEmail} agora possui as permissões selecionadas.`,
      });
      setNewUserName("");
      setNewUserEmail("");
      setNewUserRole("Technician");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao cadastrar",
        description: "Falha na comunicação com o banco de dados.",
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm("Deseja remover o acesso deste usuário permanentemente?")) {
      try {
        await deleteDoc(doc(db, "users", userId));
        toast({ title: "Acesso Removido" });
      } catch (error) {
        toast({ variant: "destructive", title: "Erro ao remover" });
      }
    }
  };

  if (isUserDocLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <Activity className="h-8 w-8 animate-spin text-accent" />
        </main>
      </div>
    );
  }

  if (!isMaster) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full border-none shadow-2xl">
            <CardContent className="pt-10 pb-10 text-center space-y-4">
              <ShieldAlert className="h-20 w-20 text-destructive mx-auto" />
              <h2 className="text-2xl font-black text-primary uppercase">ACESSO NEGADO</h2>
              <p className="text-muted-foreground font-medium">Apenas o Responsável Técnico (DIEGO ROSA) pode gerenciar permissões.</p>
              <Button onClick={() => window.location.href = "/"} className="bg-primary w-full h-12">VOLTAR AO TERMINAL</Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-primary uppercase tracking-tighter">Autorizações do Sistema</h1>
            <p className="text-muted-foreground font-medium flex items-center gap-2">
              <Settings className="h-4 w-4 text-accent" />
              Gestão de técnicos e níveis de acesso granular.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <Card className="lg:col-span-5 border-none shadow-lg h-fit bg-white/90 backdrop-blur-md">
            <CardHeader className="bg-[#0B1A2B] text-white rounded-t-lg">
              <CardTitle className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-accent" />
                CONFIGURAR NOVO ACESSO
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-8 space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60">Nome Completo do Usuário</Label>
                <Input 
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="EX: RODRIGO ARAUJO" 
                  className="h-12 border-primary/10 font-black uppercase bg-muted/10" 
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60">E-mail de Login</Label>
                <Input 
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  type="email"
                  placeholder="tecnico@certifica.com" 
                  className="h-12 border-primary/10 font-bold bg-muted/10" 
                />
              </div>
              
              <div className="space-y-4">
                <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60">Nível de Hierarquia</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant={newUserRole === "Technician" ? "default" : "outline"} 
                    className="h-12 font-black text-xs uppercase"
                    onClick={() => setNewUserRole("Technician")}
                  >
                    TÉCNICO
                  </Button>
                  <Button 
                    variant={newUserRole === "Master" ? "default" : "outline"} 
                    className="h-12 font-black text-xs uppercase"
                    onClick={() => setNewUserRole("Master")}
                  >
                    MESTRE (FULL)
                  </Button>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <Label className="text-[10px] font-black uppercase tracking-widest text-accent">Permissões de Ação</Label>
                <div className="grid grid-cols-1 gap-3">
                  {AVAILABLE_PERMISSIONS.map((perm) => (
                    <div key={perm.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/5 transition-colors">
                      <Checkbox 
                        id={perm.id} 
                        checked={selectedPermissions.includes(perm.id)}
                        onCheckedChange={() => togglePermission(perm.id)}
                      />
                      <Label htmlFor={perm.id} className="text-xs font-bold uppercase cursor-pointer leading-none">
                        {perm.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Button 
                onClick={handleCreateUser}
                className="w-full bg-accent hover:bg-accent/90 text-white h-14 font-black shadow-lg transition-all text-sm uppercase mt-4"
              >
                AUTORIZAR ACESSO
              </Button>
            </CardContent>
          </Card>

          <Card className="lg:col-span-7 border-none shadow-lg bg-white overflow-hidden">
            <CardHeader className="bg-muted/30 border-b">
              <CardTitle className="text-lg font-black text-primary uppercase tracking-tight flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                CONTROLE DE ACESSOS ATIVOS
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 border-b">
                    <tr className="text-left">
                      <th className="px-6 py-4 font-black text-muted-foreground uppercase text-[10px] tracking-widest">Nome / E-mail</th>
                      <th className="px-6 py-4 font-black text-muted-foreground uppercase text-[10px] tracking-widest">Capacidades</th>
                      <th className="px-6 py-4 font-black text-muted-foreground uppercase text-[10px] tracking-widest text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {users?.map((u) => (
                      <tr key={u.id} className="hover:bg-accent/5 transition-colors">
                        <td className="px-6 py-5">
                          <div className="flex flex-col">
                            <span className="font-black text-primary uppercase text-xs">{u.name}</span>
                            <span className="text-[10px] text-muted-foreground font-medium">{u.email}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex flex-wrap gap-1">
                            {u.permissions?.map((p: string) => (
                              <Badge key={p} variant="outline" className="text-[8px] font-black uppercase border-accent/20 text-accent bg-accent/5">
                                {AVAILABLE_PERMISSIONS.find(ap => ap.id === p)?.label.split(' ')[0]}
                              </Badge>
                            ))}
                            {(!u.permissions || u.permissions.length === 0) && (
                              <Badge variant="destructive" className="text-[8px] font-black uppercase">SEM ACESSO</Badge>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-destructive hover:bg-destructive/10"
                            onClick={() => handleDeleteUser(u.id)}
                            disabled={u.email === currentUser?.email}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="py-8 text-center border-t bg-white">
        <div className="flex items-center justify-center gap-3">
          <Activity className="h-5 w-5 text-accent" />
          <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">
            TERMINAL DE CONFIGURAÇÃO CERTIFICA LAUDO CVT - RESPONSÁVEL: DIEGO ROSA
          </p>
        </div>
      </footer>
    </div>
  );
}

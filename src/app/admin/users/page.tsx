
"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  PlusCircle, 
  ShieldAlert, 
  UserPlus, 
  Users, 
  Trash2,
  ShieldCheck,
  Activity
} from "lucide-react";
import { useFirestore, useCollection, useDoc, useUser, useMemoFirebase } from "@/firebase";
import { doc, setDoc, deleteDoc, collection } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export default function UserManagementPage() {
  const { user: currentUser } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState("Technician");

  const currentUserDocRef = useMemoFirebase(() => {
    if (!db || !currentUser?.uid) return null;
    return doc(db, "users", currentUser.uid);
  }, [db, currentUser?.uid]);

  const { data: currentUserDoc, isLoading: isUserDocLoading } = useDoc(currentUserDocRef);
  const isMaster = currentUserDoc?.permissions?.includes("can_manage_users");

  const usersQuery = useMemoFirebase(() => {
    if (!db || !isMaster) return null;
    return collection(db, "users");
  }, [db, isMaster]);

  const { data: users, isLoading: isCollectionLoading } = useCollection(usersQuery);

  const handleCreateUser = async () => {
    if (!newUserName || !newUserEmail) return;

    try {
      // Usamos o email como base para o ID apenas se não for criar via Auth real. 
      // Em uma app real, o Master usaria o Firebase Admin ou convidaria o usuário.
      // Para o protótipo, criamos o registro no Firestore.
      const userId = newUserEmail.replace(/[.@]/g, "_");
      const userRef = doc(db, "users", userId);
      
      const permissions = newUserRole === "Master" 
        ? ["can_manage_users", "can_create_report", "can_view_all_reports", "can_archive_reports", "can_access_media"] 
        : ["can_create_report"];

      await setDoc(userRef, {
        id: userId,
        name: newUserName,
        email: newUserEmail,
        roleId: newUserRole === "Master" ? "master" : "tech",
        permissions,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      toast({
        title: "Usuário Cadastrado",
        description: `${newUserName} foi adicionado como ${newUserRole}.`,
      });
      setNewUserName("");
      setNewUserEmail("");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao cadastrar",
        description: "Falha na comunicação com o banco de dados.",
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteDoc(doc(db, "users", userId));
      toast({ title: "Usuário Removido" });
    } catch (error) {
      toast({ variant: "destructive", title: "Erro ao remover" });
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
              <p className="text-muted-foreground font-medium">Apenas Usuários Mestre podem gerenciar permissões do sistema.</p>
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
            <h1 className="text-3xl font-black text-primary uppercase tracking-tighter">Gestão de Equipe</h1>
            <p className="text-muted-foreground font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-accent" />
              Controle de acesso e atribuição de cargos técnicos.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="border-none shadow-lg h-fit bg-white/90 backdrop-blur-md">
            <CardHeader className="bg-[#0B1A2B] text-white rounded-t-lg">
              <CardTitle className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-accent" />
                CADASTRAR TÉCNICO
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-8 space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60">Nome Completo</Label>
                <Input 
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="EX: DIEGO SILVA" 
                  className="h-12 border-primary/10 font-black uppercase bg-muted/10" 
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60">E-mail de Acesso</Label>
                <Input 
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  type="email"
                  placeholder="tecnico@certifica.com" 
                  className="h-12 border-primary/10 font-bold bg-muted/10" 
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60">Cargo Hierárquico</Label>
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
                    MESTRE
                  </Button>
                </div>
              </div>
              <Button 
                onClick={handleCreateUser}
                className="w-full bg-accent hover:bg-accent/90 text-white h-14 font-black shadow-lg transition-all text-sm uppercase"
              >
                AUTORIZAR ACESSO
              </Button>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 border-none shadow-lg bg-white overflow-hidden">
            <CardHeader className="bg-muted/30 border-b">
              <CardTitle className="text-lg font-black text-primary uppercase tracking-tight flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                USUÁRIOS ATIVOS NO SISTEMA
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 border-b">
                    <tr className="text-left">
                      <th className="px-6 py-4 font-black text-muted-foreground uppercase text-[10px] tracking-widest">Nome</th>
                      <th className="px-6 py-4 font-black text-muted-foreground uppercase text-[10px] tracking-widest">E-mail</th>
                      <th className="px-6 py-4 font-black text-muted-foreground uppercase text-[10px] tracking-widest">Cargo</th>
                      <th className="px-6 py-4 font-black text-muted-foreground uppercase text-[10px] tracking-widest text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {users?.map((u) => (
                      <tr key={u.id} className="hover:bg-accent/5 transition-colors">
                        <td className="px-6 py-5 font-black text-primary uppercase text-xs">{u.name}</td>
                        <td className="px-6 py-5 text-muted-foreground font-medium text-xs">{u.email}</td>
                        <td className="px-6 py-5">
                          <Badge 
                            className={u.permissions?.includes("can_manage_users") 
                              ? "bg-primary text-white border-none font-black text-[10px] uppercase" 
                              : "bg-accent/10 text-accent border-none font-black text-[10px] uppercase"}
                          >
                            {u.permissions?.includes("can_manage_users") ? "MESTRE" : "TÉCNICO"}
                          </Badge>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-destructive hover:bg-destructive/10"
                            onClick={() => handleDeleteUser(u.id)}
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
            TERMINAL DE ADMINISTRAÇÃO CERTIFICA LAUDO CVT
          </p>
        </div>
      </footer>
    </div>
  );
}

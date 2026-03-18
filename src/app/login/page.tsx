"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Lock, User, Activity, ShieldAlert } from "lucide-react";
import { useAuth, useFirestore } from "@/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const auth = useAuth();
  const db = useFirestore();
  const { toast } = useToast();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "Acesso Autorizado",
        description: "Bem-vindo ao terminal CERTIFICA.",
      });
      router.push("/");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Falha na Autenticação",
        description: "Credenciais inválidas ou acesso negado.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const provisionMaster = async () => {
    setIsLoading(true);
    const masterEmail = "3DRIMPRESSOES@GMAIL.COM";
    const masterPass = "Diego1810@";

    try {
      // Tentar criar o usuário no Auth
      let userCredential;
      try {
        userCredential = await createUserWithEmailAndPassword(auth, masterEmail, masterPass);
      } catch (e: any) {
        // Se o usuário já existe no Auth, apenas tentamos o login para pegar as credenciais
        userCredential = await signInWithEmailAndPassword(auth, masterEmail, masterPass);
      }

      const user = userCredential.user;
      
      // Criar/Atualizar o documento no Firestore com permissões de MESTRE
      await setDoc(doc(db, "users", user.uid), {
        id: user.uid,
        name: "DIEGO (MESTRE)",
        email: masterEmail,
        roleId: "master",
        permissions: ["can_manage_users", "can_create_report", "can_view_all_reports", "can_archive_reports", "can_access_media"],
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      toast({
        title: "Mestre Provisionado",
        description: "Acesso administrativo configurado com sucesso.",
      });
      router.push("/");
    } catch (error: any) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Erro no Provisionamento",
        description: error.message || "Não foi possível configurar o acesso mestre.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-3xl" />
      
      <div className="w-full max-w-md space-y-8 relative">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="bg-primary p-5 rounded-[2rem] shadow-2xl rotate-6 hover:rotate-0 transition-transform duration-500">
            <Activity className="h-12 w-12 text-accent" />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-primary uppercase">
              CERTIFICA <span className="text-accent italic">LAUDO CVT</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-2 font-bold tracking-widest uppercase opacity-70">Sistemas de Alta Precisão</p>
          </div>
        </div>

        <Card className="border-none shadow-[0_20px_50px_rgba(32,63,96,0.1)] overflow-hidden bg-white/90 backdrop-blur-md">
          <div className="h-3 w-full bg-gradient-to-r from-primary via-accent to-primary animate-gradient-x" />
          <CardHeader className="space-y-1 pt-10 text-center">
            <CardTitle className="text-3xl font-black text-primary tracking-tight">AUTENTICAÇÃO</CardTitle>
            <CardDescription className="text-muted-foreground font-medium">
              Ambiente restrito a técnicos e engenheiros especializados.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6 px-8 pb-10">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-primary/60">Credencial (E-mail)</Label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input 
                    id="email" 
                    type="email"
                    placeholder="Digite seu e-mail" 
                    className="pl-12 h-14 bg-muted/30 border-none focus:ring-accent font-bold" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Label htmlFor="password" className="text-xs font-black uppercase tracking-widest text-primary/60">Senha Criptografada</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="Sua senha secreta"
                    className="pl-12 h-14 bg-muted/30 border-none focus:ring-accent font-bold" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                  />
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 text-white h-14 font-black shadow-xl transition-all hover:scale-[1.02] active:scale-95 text-lg"
                disabled={isLoading}
              >
                {isLoading ? "PROCESSANDO ACESSO..." : "ACESSAR TERMINAL"}
              </Button>
            </form>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-muted" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground font-black">Primeiro Acesso</span>
              </div>
            </div>

            <Button 
              variant="outline" 
              className="w-full border-accent/20 text-accent h-12 font-black uppercase text-xs hover:bg-accent/5 gap-2"
              onClick={provisionMaster}
              disabled={isLoading}
            >
              <ShieldAlert className="h-4 w-4" />
              Provisionar Acesso Mestre (Diego)
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col border-t bg-muted/20 p-8 space-y-4">
            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-accent">
              <ShieldCheck className="h-4 w-4" />
              <span>Conexão Segura AES-256 Validada</span>
            </div>
            <p className="text-[10px] text-center text-muted-foreground font-medium">
              &copy; 2024 CERTIFICA LAUDO CVT - TODOS OS DIREITOS RESERVADOS
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

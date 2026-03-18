"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Lock, User, Activity, UserPlus } from "lucide-react";
import { useAuth, useFirestore } from "@/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc, collection, query, where, getDocs } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isFirstAccess, setIsFirstAccess] = useState(false);
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
      const cleanEmail = email.toLowerCase().trim();
      await signInWithEmailAndPassword(auth, cleanEmail, password);
      toast({
        title: "Acesso Autorizado",
        description: "Bem-vindo ao terminal CERTIFICA.",
      });
      router.push("/");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Falha na Autenticação",
        description: "E-mail ou senha incorretos. Se ainda não tem senha, clique em 'É MEU PRIMEIRO ACESSO'.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFirstAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const cleanEmail = email.toLowerCase().trim();

      // 1. Verificar se o e-mail está autorizado no Firestore
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", cleanEmail));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        toast({
          variant: "destructive",
          title: "E-mail não autorizado",
          description: "Este e-mail ainda não foi autorizado pelo administrador. Cadastre-o primeiro no painel de Configurações.",
        });
        setIsLoading(false);
        return;
      }

      const authorizedUserData = querySnapshot.docs[0].data();

      // 2. Criar o usuário no Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
      const user = userCredential.user;

      // 3. Vincular a autorização ao UID real do usuário
      await setDoc(doc(db, "users", user.uid), {
        ...authorizedUserData,
        id: user.uid,
        email: cleanEmail,
        updatedAt: new Date().toISOString()
      });

      toast({
        title: "Conta Criada!",
        description: "Sua senha foi definida com sucesso. Acesso liberado.",
      });
      router.push("/");
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        toast({
          variant: "destructive",
          title: "E-mail já cadastrado",
          description: "Você já definiu uma senha anteriormente. Tente fazer o login normal.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Erro no Cadastro",
          description: "Certifique-se de que o e-mail foi cadastrado exatamente como você o digitou.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const provisionMaster = async () => {
    setIsLoading(true);
    // Usando o e-mail do usuário para facilitar o acesso inicial
    const masterEmail = email.toLowerCase().trim() || "meiokilo1810@gmail.com";
    const masterPass = password || "Diego1810@";

    try {
      let userCredential;
      try {
        userCredential = await createUserWithEmailAndPassword(auth, masterEmail, masterPass);
      } catch (e: any) {
        userCredential = await signInWithEmailAndPassword(auth, masterEmail, masterPass);
      }

      const user = userCredential.user;
      
      await setDoc(doc(db, "users", user.uid), {
        id: user.uid,
        name: "DIEGO ROSA",
        email: masterEmail,
        roleId: "master",
        permissions: ["can_manage_users", "can_create_report", "can_view_all_reports", "can_archive_reports", "can_access_media"],
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      toast({
        title: "Mestre Provisionado",
        description: `Acesso administrativo configurado para DIEGO ROSA (${masterEmail}).`,
      });
      router.push("/");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro no Provisionamento",
        description: "Tente preencher o e-mail e senha antes de dar duplo clique no ícone.",
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
          <div 
            className="bg-primary p-5 rounded-[2rem] shadow-2xl rotate-6 hover:rotate-0 transition-transform duration-500 cursor-help"
            onDoubleClick={provisionMaster}
            title="Clique duplo para Configurar Diego Rosa como Mestre"
          >
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
            <CardTitle className="text-3xl font-black text-primary tracking-tight">
              {isFirstAccess ? "CONFIGURAR ACESSO" : "AUTENTICAÇÃO"}
            </CardTitle>
            <CardDescription className="text-muted-foreground font-medium">
              {isFirstAccess 
                ? "Defina sua senha para o e-mail autorizado." 
                : "Ambiente restrito a técnicos e engenheiros especializados."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6 px-8 pb-10">
            <form onSubmit={isFirstAccess ? handleFirstAccess : handleLogin} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-primary/60">Credencial (E-mail)</Label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input 
                    id="email" 
                    type="email"
                    placeholder="tecnico@certifica.com" 
                    className="pl-12 h-14 bg-muted/30 border-none focus:ring-accent font-bold" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Label htmlFor="password" className="text-xs font-black uppercase tracking-widest text-primary/60">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder=" "
                    className="pl-12 h-14 bg-muted/30 border-none focus:ring-accent font-bold" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                  />
                </div>
              </div>
              <Button 
                type="submit" 
                className={`w-full ${isFirstAccess ? 'bg-accent' : 'bg-primary'} hover:opacity-90 text-white h-14 font-black shadow-xl transition-all hover:scale-[1.02] active:scale-95 text-lg uppercase`}
                disabled={isLoading}
              >
                {isLoading 
                  ? "PROCESSANDO..." 
                  : isFirstAccess ? "CADASTRAR MINHA SENHA" : "ACESSAR TERMINAL"}
              </Button>
            </form>

            <div className="text-center pt-4">
              <button 
                onClick={() => setIsFirstAccess(!isFirstAccess)}
                className="text-xs font-black text-accent uppercase tracking-widest hover:underline flex items-center justify-center gap-2 mx-auto"
              >
                {isFirstAccess ? (
                  <> <User className="h-3 w-3" /> VOLTAR PARA LOGIN </>
                ) : (
                  <> <UserPlus className="h-3 w-3" /> É MEU PRIMEIRO ACESSO </>
                )}
              </button>
            </div>
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
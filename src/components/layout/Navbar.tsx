
"use client";

import Link from "next/link";
import { ShieldCheck, PlusCircle, BarChart3, Settings, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser, useAuth, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  
  const userDocRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, "users", user.uid);
  }, [db, user?.uid]);
  
  const { data: currentUserDoc } = useDoc(userDocRef);
  const isMaster = currentUserDoc?.permissions?.includes("can_manage_users");
  const displayName = isMaster ? "DIEGO ROSA" : (currentUserDoc?.name || user?.email?.split('@')[0] || "ACESSANDO...");

  const handleLogout = () => {
    auth.signOut();
    window.location.href = "/login";
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white text-primary shadow-sm">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-primary p-2 rounded-xl transition-transform group-hover:scale-110 shadow-lg">
              <ShieldCheck className="h-7 w-7 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tighter uppercase leading-none">
                CERTIFICA <span className="text-accent italic">LAUDO CVT</span>
              </span>
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground mt-1">
                SISTEMA DE ALTA PRECISÃO INDUSTRIAL
              </span>
            </div>
          </Link>

          <nav className="hidden xl:flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] ml-10">
            <Link href="/reports/new" className="hover:text-accent transition-colors flex items-center gap-1.5">
              <PlusCircle className="h-4 w-4" /> NOVO LAUDO
            </Link>
            <Link href="/reports" className="hover:text-accent transition-colors flex items-center gap-1.5">
              <BarChart3 className="h-4 w-4" /> RELATÓRIOS
            </Link>
            {isMaster && (
              <Link href="/admin/users" className="hover:text-accent transition-colors flex items-center gap-1.5">
                <Settings className="h-4 w-4" /> CONFIGURAÇÃO
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-black leading-none uppercase tracking-tight text-primary">
              {displayName}
            </p>
            <p className="text-[9px] text-accent font-black leading-tight mt-1 uppercase tracking-widest">
              {isMaster ? "RESPONSÁVEL TÉCNICO (MESTRE)" : "TÉCNICO ESPECIALISTA"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Avatar className="h-12 w-12 border-2 border-accent/20">
              <AvatarImage src={`https://picsum.photos/seed/${user?.uid || 'user'}/200`} />
              <AvatarFallback className="bg-primary text-white font-black">
                {user?.email?.[0].toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <Button variant="ghost" size="icon" onClick={handleLogout} className="text-muted-foreground hover:text-destructive">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

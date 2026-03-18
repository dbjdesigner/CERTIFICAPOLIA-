"use client";

import Link from "next/link";
import { ChevronDown, Bell, Search, Activity, FileText, Settings, User, ShieldCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
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
                CERTIFICA<span className="text-accent">POLIA</span>
              </span>
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground mt-1">
                CONTROLE DE QUALIDADE BRAZILIAN
              </span>
            </div>
          </Link>

          <nav className="hidden xl:flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] ml-10">
            <Link href="/" className="hover:text-accent transition-colors flex items-center gap-1.5">
              <PlusCircle className="h-4 w-4" /> NOVO LAUDO
            </Link>
            <Link href="/reports" className="hover:text-accent transition-colors flex items-center gap-1.5">
              <BarChart3 className="h-4 w-4" /> RELATÓRIOS / EXCLUIR
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-black leading-none uppercase tracking-tight text-primary">MESTRE BRAZILIAN</p>
            <p className="text-[9px] text-accent font-black leading-tight mt-1 uppercase tracking-widest">ACESSO MESTRE LIBERADO</p>
          </div>
          <Avatar className="h-12 w-12 border-2 border-accent/20">
            <AvatarImage src="https://picsum.photos/seed/brazilian/200" />
            <AvatarFallback className="bg-primary text-white font-black">MB</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}

import { PlusCircle, BarChart3 } from "lucide-react";

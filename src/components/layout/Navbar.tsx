"use client";

import Link from "next/link";
import { ChevronDown, Bell, Search, Activity, FileText, Settings, User } from "lucide-react";
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
    <header className="sticky top-0 z-50 w-full border-b bg-primary text-primary-foreground shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-accent p-1.5 rounded-lg transition-transform group-hover:scale-110">
              <Activity className="h-6 w-6 text-primary" />
            </div>
            <span className="text-xl font-black tracking-tighter uppercase hidden sm:inline-block">
              CERTIFICA <span className="text-accent italic">LAUDO CVT</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em]">
            <Link href="/" className="hover:text-accent transition-colors">Dashboard</Link>
            <Link href="/reports" className="hover:text-accent transition-colors">Laudos</Link>
            <Link href="/clients" className="hover:text-accent transition-colors">Clientes</Link>
          </nav>
        </div>

        <div className="flex-1 max-w-md hidden lg:flex">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-primary-foreground/60" />
            <Input
              type="search"
              placeholder="Buscar registros CVT..."
              className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-accent font-bold"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 hidden sm:flex">
            <Bell className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-12 w-auto gap-3 px-3 text-white hover:bg-white/10 rounded-xl">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-black leading-none uppercase tracking-tight">Mestre Brazilian</p>
                  <p className="text-[10px] text-accent font-black leading-tight mt-1 uppercase tracking-widest">Supervisor</p>
                </div>
                <Avatar className="h-10 w-10 border-2 border-accent">
                  <AvatarImage src="https://picsum.photos/seed/user1/200" />
                  <AvatarFallback className="bg-accent text-primary font-black">MB</AvatarFallback>
                </Avatar>
                <ChevronDown className="h-4 w-4 text-white/60" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 font-bold">
              <DropdownMenuLabel className="uppercase text-[10px] tracking-widest">Painel do Usuário</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2 cursor-pointer">
                <User className="h-4 w-4" /> Perfil Técnico
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 cursor-pointer">
                <FileText className="h-4 w-4" /> Meus Certificados
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 cursor-pointer">
                <Settings className="h-4 w-4" /> Configurações
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive gap-2 font-black cursor-pointer">
                LOGOUT TERMINAL
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

"use client";

import Link from "next/link";
import { ChevronDown, Bell, Search, LayoutDashboard, FileText, Settings, User } from "lucide-react";
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
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-accent p-1.5 rounded-lg">
              <LayoutDashboard className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight hidden sm:inline-block">
              CertiFlow <span className="text-accent">Industrial</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
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
              placeholder="Buscar laudos, clientes ou equipamentos..."
              className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-accent"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 hidden sm:flex">
            <Bell className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-auto gap-3 px-2 text-white hover:bg-white/10">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold leading-none">Mestre Brazilian</p>
                  <p className="text-xs text-white/60 leading-tight mt-1">Administrador</p>
                </div>
                <Avatar className="h-9 w-9 border-2 border-accent">
                  <AvatarImage src="https://picsum.photos/seed/user1/200" />
                  <AvatarFallback className="bg-accent text-white">MB</AvatarFallback>
                </Avatar>
                <ChevronDown className="h-4 w-4 text-white/60" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2">
                <User className="h-4 w-4" /> Perfil
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2">
                <FileText className="h-4 w-4" /> Meus Relatórios
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2">
                <Settings className="h-4 w-4" /> Configurações
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive gap-2">
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
"use client";

import { Navbar } from "@/components/layout/Navbar";
import { MOCK_CLIENTS } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search, MapPin, Building2, FileText, ArrowUpRight, Factory } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ClientsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-primary uppercase tracking-tighter">Parceiros Industriais</h1>
            <p className="text-muted-foreground font-medium">Gestão centralizada de unidades industriais e contratos ativos.</p>
          </div>
          <Button className="bg-accent hover:bg-accent/90 text-white gap-2 h-12 px-6 font-bold shadow-lg">
            <PlusCircle className="h-5 w-5" />
            Cadastrar Novo Cliente
          </Button>
        </div>

        <div className="flex items-center gap-4 bg-white/80 backdrop-blur-sm p-5 rounded-2xl shadow-sm border border-white/50">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input placeholder="Buscar por unidade, setor ou CNPJ..." className="pl-12 h-12 bg-muted/20 border-none focus:ring-accent" />
          </div>
          <Button variant="outline" className="h-12 px-6 border-primary/10 hover:bg-primary/5 font-bold">Filtro por Setor</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MOCK_CLIENTS.map((client) => (
            <Card key={client.id} className="border-none shadow-lg hover:shadow-2xl transition-all overflow-hidden group relative bg-white/90">
              <div className="absolute top-0 right-0 p-4">
                <Badge className="bg-accent/10 text-accent border-none font-black text-[10px] uppercase">{client.industry}</Badge>
              </div>
              <CardHeader className="pb-4 pt-10">
                <div className="flex justify-between items-start">
                  <div className="bg-primary/5 p-4 rounded-2xl group-hover:bg-primary group-hover:text-white transition-all">
                    <Factory className="h-8 w-8" />
                  </div>
                  <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 hover:bg-accent/10 hover:text-accent">
                    <ArrowUpRight className="h-6 w-6" />
                  </Button>
                </div>
                <CardTitle className="mt-6 text-2xl font-black text-primary tracking-tight leading-tight">{client.name}</CardTitle>
                <CardDescription className="flex items-center gap-1.5 font-bold text-muted-foreground uppercase text-[10px] tracking-widest mt-2">
                  <MapPin className="h-3 w-3 text-accent" /> {client.location}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-8">
                <div className="grid grid-cols-2 gap-4 pt-6 border-t mt-4 border-muted/50">
                  <div className="space-y-1">
                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Contratos</p>
                    <p className="text-sm font-bold text-primary">Master Platinum</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Certificações</p>
                    <div className="flex items-center justify-end gap-1.5 text-accent font-black text-lg">
                      <FileText className="h-5 w-5" />
                      <span>{client.activeReports}</span>
                    </div>
                  </div>
                </div>
                <Button className="w-full mt-8 bg-primary/5 text-primary hover:bg-primary hover:text-white border-none font-bold h-12 rounded-xl transition-all">
                  GERENCIAR UNIDADE
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
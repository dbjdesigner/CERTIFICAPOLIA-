
"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { MOCK_REPORTS } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  PlusCircle, 
  FileDown, 
  ExternalLink,
  ChevronRight,
  MoreVertical
} from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ReportsListPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredReports = MOCK_REPORTS.filter(report => 
    report.reportNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.equipmentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.client.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary">Laudos de Qualidade</h1>
            <p className="text-muted-foreground">Gerencie e visualize todos os registros certificados do sistema.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <FileDown className="h-4 w-4" />
              Exportar
            </Button>
            <Link href="/reports/new">
              <Button className="bg-accent hover:bg-accent/90 text-white gap-2">
                <PlusCircle className="h-4 w-4" />
                Novo Laudo
              </Button>
            </Link>
          </div>
        </div>

        <Card className="border-none shadow-md">
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
              <div className="relative w-full md:max-w-md">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por número, equipamento ou cliente..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 w-full md:w-auto">
                <Button variant="ghost" className="gap-2 text-primary font-medium">
                  <Filter className="h-4 w-4" /> Filtros
                </Button>
                <div className="h-4 w-px bg-border mx-2" />
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  Mostrando {filteredReports.length} resultados
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 border-y">
                  <tr className="text-left">
                    <th className="px-6 py-4 font-semibold text-muted-foreground">Número</th>
                    <th className="px-6 py-4 font-semibold text-muted-foreground">Equipamento</th>
                    <th className="px-6 py-4 font-semibold text-muted-foreground">Cliente</th>
                    <th className="px-6 py-4 font-semibold text-muted-foreground">Data</th>
                    <th className="px-6 py-4 font-semibold text-muted-foreground">Status</th>
                    <th className="px-6 py-4 font-semibold text-muted-foreground text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredReports.map((report) => (
                    <tr key={report.id} className="hover:bg-accent/5 transition-colors group">
                      <td className="px-6 py-4 font-bold text-primary">{report.reportNumber}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold">{report.model}</span>
                          <span className="text-xs text-muted-foreground">{report.equipmentType}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-accent" />
                          <span className="text-muted-foreground">{report.client}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">{report.date}</td>
                      <td className="px-6 py-4">
                        <Badge 
                          variant={report.status === 'Published' ? 'default' : 'secondary'} 
                          className={report.status === 'Published' ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-none' : report.status === 'Archived' ? 'bg-slate-100 text-slate-800 border-none' : ''}
                        >
                          {report.status === 'Published' ? 'Publicado' : report.status === 'Archived' ? 'Arquivado' : 'Rascunho'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end items-center gap-2">
                          <Link href={`/reports/${report.id}`}>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-accent">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </Link>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Editar Laudo</DropdownMenuItem>
                              <DropdownMenuItem>Duplicar</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">Excluir</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredReports.length === 0 && (
                <div className="py-20 text-center">
                  <Search className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-primary">Nenhum laudo encontrado</h3>
                  <p className="text-muted-foreground">Tente ajustar seus termos de busca.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

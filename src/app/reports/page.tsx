"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
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
  Trash2,
  Activity
} from "lucide-react";
import Link from "next/link";
import { useFirestore, useCollection, useUser, useDoc, useMemoFirebase } from "@/firebase";
import { collection, query, where, doc, deleteDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

export default function ReportsListPage() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  const userDocRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, "users", user.uid);
  }, [db, user?.uid]);
  
  const { data: currentUserDoc } = useDoc(userDocRef);
  const isMaster = currentUserDoc?.permissions?.includes("can_manage_users");

  const reportsQuery = useMemoFirebase(() => {
    if (!db || !user || !currentUserDoc) return null;
    if (isMaster) {
      return collection(db, "reports");
    } else {
      return query(collection(db, "reports"), where("technicianId", "==", user.uid));
    }
  }, [db, user, isMaster, currentUserDoc]);

  const { data: reportsData, isLoading } = useCollection(reportsQuery);
  const reports = reportsData || [];

  const filteredReports = reports.filter(report => 
    report.reportNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.equipmentType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.serialNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!db) return;
    if (confirm("Confirmar exclusão definitiva do registro?")) {
      try {
        await deleteDoc(doc(db, "reports", id));
        toast({ title: "Registro Removido" });
      } catch (err) {
        toast({ variant: "destructive", title: "Erro ao remover", description: "Permissão negada." });
      }
    }
  };

  const handleExportCSV = () => {
    if (filteredReports.length === 0) {
      toast({ title: "Nenhum dado para exportar", variant: "destructive" });
      return;
    }

    const headers = ["Registro", "Equipamento", "Modelo", "Cliente", "Serie", "Status", "Data"];
    const rows = filteredReports.map(r => [
      r.reportNumber || 'N/A',
      r.equipmentType || 'N/A',
      r.model || 'N/A',
      r.clientName || 'N/A',
      r.serialNumber || 'N/A',
      r.status || 'N/A',
      r.createdAt ? new Date(r.createdAt).toLocaleDateString('pt-BR') : 'N/A'
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(";")).join("\n");
    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `relatorio_certifica_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({ title: "Relatório Exportado", description: "O arquivo CSV foi gerado com sucesso." });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-primary uppercase tracking-tighter">Relatórios Completos</h1>
            <p className="text-muted-foreground font-medium uppercase text-[10px] tracking-widest">Base de dados certificada em tempo real.</p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="gap-2 font-black uppercase text-xs h-12"
              onClick={handleExportCSV}
            >
              <FileDown className="h-4 w-4" />
              Exportar CSV
            </Button>
            <Link href="/reports/new">
              <Button className="bg-accent hover:bg-accent/90 text-white gap-2 font-black uppercase text-xs h-12">
                <PlusCircle className="h-4 w-4" />
                Novo Laudo
              </Button>
            </Link>
          </div>
        </div>

        <Card className="border-none shadow-xl bg-white overflow-hidden">
          <CardHeader className="pb-6 bg-muted/20 border-b">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
              <div className="relative w-full md:max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por número, série ou cliente..."
                  className="pl-10 h-12 border-primary/10 font-bold"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 w-full md:w-auto">
                <div className="h-4 w-px bg-border mx-2" />
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                  {filteredReports.length} REGISTROS LOCALIZADOS
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#0B1A2B] text-white">
                  <tr className="text-left">
                    <th className="px-6 py-4 font-black uppercase text-[10px] tracking-[0.2em]">Registro</th>
                    <th className="px-6 py-4 font-black uppercase text-[10px] tracking-[0.2em]">Unidade / Modelo</th>
                    <th className="px-6 py-4 font-black uppercase text-[10px] tracking-[0.2em]">Cliente Industrial</th>
                    <th className="px-6 py-4 font-black uppercase text-[10px] tracking-[0.2em]">Série</th>
                    <th className="px-6 py-4 font-black uppercase text-[10px] tracking-[0.2em]">Status</th>
                    <th className="px-6 py-4 font-black uppercase text-[10px] tracking-[0.2em] text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredReports.map((report) => (
                    <tr key={report.id} className="hover:bg-accent/5 transition-colors group cursor-pointer" onClick={() => window.location.href = `/reports/${report.id}`}>
                      <td className="px-6 py-5 font-black text-primary uppercase text-xs">{report.reportNumber}</td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className="font-black text-primary uppercase text-xs">{report.equipmentType}</span>
                          <span className="text-[10px] text-accent font-bold uppercase">{report.model}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-muted-foreground font-black uppercase text-[10px]">{report.clientName}</span>
                      </td>
                      <td className="px-6 py-5">
                        <Badge variant="outline" className="border-primary/20 text-primary font-black text-[10px]">{report.serialNumber}</Badge>
                      </td>
                      <td className="px-6 py-5">
                        <Badge 
                          className={
                            report.status === 'Published' ? 'bg-emerald-500 text-white border-none font-black text-[9px] uppercase' : 
                            report.status === 'InRecovery' ? 'bg-blue-500 text-white border-none font-black text-[9px] uppercase' : 
                            'bg-amber-500 text-white border-none font-black text-[9px] uppercase'
                          }
                        >
                          {report.status === 'Published' ? 'CERTIFICADO' : 
                           report.status === 'InRecovery' ? 'RECUPERAÇÃO' : 'ORÇAMENTO'}
                        </Badge>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex justify-end items-center gap-2">
                          <Link href={`/reports/${report.id}`} onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-accent">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={(e) => { e.stopPropagation(); handleDelete(report.id); }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {isLoading && (
                <div className="py-20 text-center flex flex-col items-center gap-4">
                  <Activity className="h-8 w-8 animate-spin text-accent" />
                  <p className="font-black text-[10px] text-primary uppercase tracking-widest">Acessando banco de dados...</p>
                </div>
              )}
              {!isLoading && filteredReports.length === 0 && (
                <div className="py-20 text-center">
                  <Search className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="text-lg font-black text-primary uppercase">Nenhum laudo encontrado</h3>
                  <p className="text-muted-foreground text-xs font-medium uppercase tracking-widest">Tente ajustar seus termos de busca.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

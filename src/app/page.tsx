
"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  PlusCircle, 
  Activity,
  Wrench,
  CheckCircle2,
  FileText,
  Trash2,
  DollarSign,
  TrendingUp,
  Lock
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFirestore, useCollection, useUser, useDoc, useMemoFirebase } from "@/firebase";
import { collection, query, where, doc, deleteDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { Bar, BarChart, CartesianGrid, XAxis, ResponsiveContainer, Tooltip } from "recharts";

export default function Dashboard() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();

  const userDocRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, "users", user.uid);
  }, [db, user?.uid]);
  
  const { data: currentUserDoc } = useDoc(userDocRef);
  const isMaster = currentUserDoc?.permissions?.includes("can_manage_users");
  
  // Nome oficial do responsável técnico
  const techName = "DIEGO ROSA";

  const reportsQuery = useMemoFirebase(() => {
    if (!db || !user || !currentUserDoc) return null;
    // Todos visualizam todos os relatórios para compor os valores do terminal
    return collection(db, "reports");
  }, [db, user, currentUserDoc]);

  const { data: reportsData, isLoading } = useCollection(reportsQuery);
  const reports = reportsData || [];

  const budgetReports = reports.filter(r => r.status === 'Budget');
  const inRecoveryReports = reports.filter(r => r.status === 'InRecovery');
  const publishedReports = reports.filter(r => r.status === 'Published');

  const calculateTotalValue = (items: any[]) => {
    const total = items.reduce((acc, curr) => {
      // Converte o valor para número sem dividir por 100
      const val = parseFloat(curr.value) || 0;
      return acc + val;
    }, 0);
    return total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
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

  const chartData = [
    { name: 'Orçamentos', total: budgetReports.length, fill: 'hsl(var(--warning))' },
    { name: 'Recuperação', total: inRecoveryReports.length, fill: 'hsl(var(--primary))' },
    { name: 'Certificados', total: publishedReports.length, fill: 'hsl(var(--accent))' },
  ];

  const ReportTable = ({ reports }: { reports: any[] }) => (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 border-b">
          <tr className="text-left">
            <th className="px-8 py-4 font-black text-muted-foreground uppercase text-[10px] tracking-[0.2em]">Registro</th>
            <th className="px-8 py-4 font-black text-muted-foreground uppercase text-[10px] tracking-[0.2em]">Unidade CVT</th>
            <th className="px-8 py-4 font-black text-muted-foreground uppercase text-[10px] tracking-[0.2em]">Cliente Industrial</th>
            <th className="px-8 py-4 font-black text-muted-foreground uppercase text-[10px] tracking-[0.2em]">Valor</th>
            <th className="px-8 py-4 font-black text-muted-foreground uppercase text-[10px] tracking-[0.2em] text-right">Ação</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-muted/30">
          {reports.map((report) => (
            <tr key={report.id} className="hover:bg-accent/5 transition-colors cursor-pointer group" onClick={() => window.location.href = `/reports/${report.id}`}>
              <td className="px-8 py-5 font-black text-primary tracking-tight">{report.reportNumber}</td>
              <td className="px-8 py-5">
                <div className="flex flex-col">
                  <span className="font-black text-primary uppercase tracking-tighter">{report.equipmentType} {report.customEquipmentType}</span>
                  <span className="text-[10px] text-accent font-black uppercase tracking-widest">{report.model}</span>
                </div>
              </td>
              <td className="px-8 py-5 text-muted-foreground font-black uppercase text-xs">{report.clientName || report.client}</td>
              <td className="px-8 py-5 text-accent font-black text-xs">
                {report.value ? (parseFloat(report.value) || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : "R$ 0,00"}
              </td>
              <td className="px-8 py-5 text-right">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-muted-foreground/30 hover:text-destructive transition-colors"
                  onClick={(e) => handleDelete(e, report.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </td>
            </tr>
          ))}
          {reports.length === 0 && !isLoading && (
            <tr>
              <td colSpan={5} className="px-8 py-20 text-center text-muted-foreground font-bold uppercase text-xs tracking-widest">
                Nenhum registro localizado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-primary uppercase tracking-tighter">Terminal Industrial</h1>
            <p className="text-muted-foreground flex items-center gap-2 font-medium uppercase text-[10px] tracking-widest">
              <Activity className="h-4 w-4 text-accent" />
              Responsável Técnico: {techName}
            </p>
          </div>
          <Link href="/reports/new">
            <Button className="bg-accent hover:bg-accent/90 text-white gap-2 h-14 px-8 text-lg font-black shadow-xl uppercase">
              <PlusCircle className="h-6 w-6" />
              Abrir Novo Orçamento
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-none shadow-md bg-white border-l-4 border-amber-500">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Orçamentos</p>
                <DollarSign className="h-4 w-4 text-amber-500" />
              </div>
              <div className="mt-2">
                <span className="text-2xl font-black text-primary">{calculateTotalValue(budgetReports)}</span>
                <p className="text-[9px] font-bold text-muted-foreground uppercase mt-1">{budgetReports.length} pendentes</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-md bg-white border-l-4 border-blue-500">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Recuperação</p>
                <Wrench className="h-4 w-4 text-blue-500" />
              </div>
              <div className="mt-2">
                <span className="text-2xl font-black text-primary">{calculateTotalValue(inRecoveryReports)}</span>
                <p className="text-[9px] font-bold text-muted-foreground uppercase mt-1">{inRecoveryReports.length} em execução</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-md bg-white border-l-4 border-emerald-500">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Vendas / Certificados</p>
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              </div>
              <div className="mt-2">
                <span className="text-2xl font-black text-primary">{calculateTotalValue(publishedReports)}</span>
                <p className="text-[9px] font-bold text-muted-foreground uppercase mt-1">{publishedReports.length} concluídos</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-md bg-white overflow-hidden">
            <CardContent className="p-0 h-full flex flex-col justify-center">
              <div className="px-6 py-2">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Fluxo de Unidades</p>
              </div>
              <div className="h-24 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <Bar dataKey="total" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-none shadow-xl bg-white overflow-hidden">
          <Tabs defaultValue="orcamentos" className="w-full">
            <CardHeader className="flex flex-col border-b bg-[#0B1A2B] text-white p-0">
              <TabsList className="bg-transparent h-16 px-8 gap-12 justify-start rounded-none w-full border-none">
                <TabsTrigger 
                  value="orcamentos" 
                  className="data-[state=active]:bg-transparent data-[state=active]:text-accent data-[state=active]:border-b-4 data-[state=active]:border-accent rounded-none h-full font-black uppercase text-[10px] tracking-[0.2em] px-0"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  ORÇAMENTOS ({budgetReports.length})
                </TabsTrigger>
                <TabsTrigger 
                  value="recuperacao" 
                  className="data-[state=active]:bg-transparent data-[state=active]:text-accent data-[state=active]:border-b-4 data-[state=active]:border-accent rounded-none h-full font-black uppercase text-[10px] tracking-[0.2em] px-0"
                >
                  <Wrench className="h-4 w-4 mr-2" />
                  EM RECUPERAÇÃO ({inRecoveryReports.length})
                </TabsTrigger>
                <TabsTrigger 
                  value="certificados" 
                  className="data-[state=active]:bg-transparent data-[state=active]:text-accent data-[state=active]:border-b-4 data-[state=active]:border-accent rounded-none h-full font-black uppercase text-[10px] tracking-[0.2em] px-0"
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  CERTIFICADOS ({publishedReports.length})
                </TabsTrigger>
              </TabsList>
            </CardHeader>
            
            <CardContent className="p-0">
              <TabsContent value="orcamentos" className="m-0"><ReportTable reports={budgetReports} /></TabsContent>
              <TabsContent value="recuperacao" className="m-0"><ReportTable reports={inRecoveryReports} /></TabsContent>
              <TabsContent value="certificados" className="m-0"><ReportTable reports={publishedReports} /></TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </main>
    </div>
  );
}

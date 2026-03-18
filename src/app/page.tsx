
"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  PlusCircle, 
  TrendingUp, 
  Activity,
  ArrowRight,
  ClipboardList,
  Wrench,
  CheckCircle2,
  FileText
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFirestore, useCollection, useUser, useDoc, useMemoFirebase } from "@/firebase";
import { collection, query, where, doc } from "firebase/firestore";

export default function Dashboard() {
  const { user } = useUser();
  const db = useFirestore();

  // Get user profile to check if they are Master
  const userDocRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, "users", user.uid);
  }, [db, user?.uid]);
  
  const { data: currentUserDoc } = useDoc(userDocRef);
  const isMaster = currentUserDoc?.permissions?.includes("can_manage_users");

  // Query reports based on user role - ensure users see only their data initially
  const reportsQuery = useMemoFirebase(() => {
    if (!db || !user || !currentUserDoc) return null;
    
    // If master, show everything. If technician, show only their reports.
    if (isMaster) {
      return collection(db, "reports");
    } else {
      return query(collection(db, "reports"), where("technicianId", "==", user.uid));
    }
  }, [db, user, isMaster, currentUserDoc]);

  const { data: reportsData, isLoading } = useCollection(reportsQuery);
  const reports = reportsData || [];

  const budgetReports = reports.filter(r => r.status === 'Budget');
  const inRecoveryReports = reports.filter(r => r.status === 'InRecovery');
  const publishedReports = reports.filter(r => r.status === 'Published');

  const ReportTable = ({ reports }: { reports: any[] }) => (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 border-b">
          <tr className="text-left">
            <th className="px-8 py-4 font-black text-muted-foreground uppercase text-[10px] tracking-[0.2em]">Registro</th>
            <th className="px-8 py-4 font-black text-muted-foreground uppercase text-[10px] tracking-[0.2em]">Unidade CVT</th>
            <th className="px-8 py-4 font-black text-muted-foreground uppercase text-[10px] tracking-[0.2em]">Cliente Industrial</th>
            <th className="px-8 py-4 font-black text-muted-foreground uppercase text-[10px] tracking-[0.2em]">Valor</th>
            <th className="px-8 py-4 font-black text-muted-foreground uppercase text-[10px] tracking-[0.2em] text-center">Status</th>
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
              <td className="px-8 py-5 text-accent font-black text-xs">R$ {report.value || "0,00"}</td>
              <td className="px-8 py-5 text-center">
                <Badge 
                  className={
                    report.status === 'Published' ? 'bg-emerald-100 text-emerald-800 border-none font-black text-[10px] uppercase px-3' : 
                    report.status === 'Budget' ? 'bg-amber-100 text-amber-800 border-none font-black text-[10px] uppercase px-3' :
                    report.status === 'InRecovery' ? 'bg-blue-100 text-blue-800 border-none font-black text-[10px] uppercase px-3' :
                    'font-black text-[10px] uppercase px-3'
                  }
                >
                  {report.status === 'Published' ? 'CERTIFICADO' : 
                   report.status === 'Budget' ? 'ORÇAMENTO' : 
                   report.status === 'InRecovery' ? 'RECUPERAÇÃO' : 'PENDENTE'}
                </Badge>
              </td>
            </tr>
          ))}
          {reports.length === 0 && !isLoading && (
            <tr>
              <td colSpan={5} className="px-8 py-20 text-center text-muted-foreground font-bold uppercase text-xs tracking-widest">
                Nenhum registro encontrado neste terminal.
              </td>
            </tr>
          )}
          {isLoading && (
            <tr>
              <td colSpan={5} className="px-8 py-20 text-center">
                <Activity className="h-6 w-6 animate-spin text-accent mx-auto" />
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
            <h1 className="text-3xl font-black text-primary uppercase tracking-tighter">Painel Operacional</h1>
            <p className="text-muted-foreground flex items-center gap-2 font-medium uppercase text-[10px] tracking-widest">
              <Activity className="h-4 w-4 text-accent" />
              Terminal: {currentUserDoc?.name || "Técnico"}
            </p>
          </div>
          <Link href="/reports/new">
            <Button className="bg-accent hover:bg-accent/90 text-white gap-2 h-14 px-8 text-lg font-black shadow-xl transition-all hover:scale-105 active:scale-95 uppercase">
              <PlusCircle className="h-6 w-6" />
              Emitir Novo Laudo
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-none shadow-md overflow-hidden group relative bg-white/80 backdrop-blur-sm border-l-4 border-primary">
            <CardContent className="p-6">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Volume Total</p>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-black text-primary tracking-tighter">{reports.length}</span>
                <span className="text-[10px] font-bold text-muted-foreground">REGISTROS</span>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-md overflow-hidden group relative bg-white/80 backdrop-blur-sm border-l-4 border-amber-500">
            <CardContent className="p-6">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Orçamentos</p>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-black text-primary tracking-tighter">{budgetReports.length}</span>
                <span className="text-[10px] font-bold text-muted-foreground">EM ANÁLISE</span>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-md overflow-hidden group relative bg-white/80 backdrop-blur-sm border-l-4 border-blue-500">
            <CardContent className="p-6">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Em Recuperação</p>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-black text-primary tracking-tighter">{inRecoveryReports.length}</span>
                <span className="text-[10px] font-bold text-muted-foreground">NA BANCADA</span>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-md overflow-hidden group relative bg-white/80 backdrop-blur-sm border-l-4 border-emerald-500">
            <CardContent className="p-6">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Certificados</p>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-black text-primary tracking-tighter">{publishedReports.length}</span>
                <span className="text-[10px] font-bold text-muted-foreground">CONCLUÍDOS</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-none shadow-xl bg-white overflow-hidden">
          <Tabs defaultValue="orcamentos" className="w-full">
            <CardHeader className="flex flex-col border-b bg-[#0B1A2B] text-white p-0">
              <div className="flex flex-row items-center justify-between px-8 py-6">
                <div>
                  <CardTitle className="text-2xl font-black uppercase tracking-tighter">Banco de Dados Industrial</CardTitle>
                  <CardDescription className="text-white/60 font-medium">Gestão de fluxo de trabalho CVT em tempo real.</CardDescription>
                </div>
              </div>
              
              <TabsList className="bg-transparent h-14 px-8 gap-8 justify-start border-t border-white/10 rounded-none w-full">
                <TabsTrigger 
                  value="orcamentos" 
                  className="data-[state=active]:bg-transparent data-[state=active]:text-accent data-[state=active]:border-b-2 data-[state=active]:border-accent rounded-none h-full font-black uppercase text-[10px] tracking-[0.2em] px-0 gap-2"
                >
                  <FileText className="h-4 w-4" />
                  ORÇAMENTOS ({budgetReports.length})
                </TabsTrigger>
                <TabsTrigger 
                  value="recuperacao" 
                  className="data-[state=active]:bg-transparent data-[state=active]:text-accent data-[state=active]:border-b-2 data-[state=active]:border-accent rounded-none h-full font-black uppercase text-[10px] tracking-[0.2em] px-0 gap-2"
                >
                  <Wrench className="h-4 w-4" />
                  EM RECUPERAÇÃO ({inRecoveryReports.length})
                </TabsTrigger>
                <TabsTrigger 
                  value="certificados" 
                  className="data-[state=active]:bg-transparent data-[state=active]:text-accent data-[state=active]:border-b-2 data-[state=active]:border-accent rounded-none h-full font-black uppercase text-[10px] tracking-[0.2em] px-0 gap-2"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  CERTIFICADOS ({publishedReports.length})
                </TabsTrigger>
              </TabsList>
            </CardHeader>
            
            <CardContent className="p-0">
              <TabsContent value="orcamentos" className="m-0 focus-visible:ring-0">
                <ReportTable reports={budgetReports} />
              </TabsContent>
              <TabsContent value="recuperacao" className="m-0 focus-visible:ring-0">
                <ReportTable reports={inRecoveryReports} />
              </TabsContent>
              <TabsContent value="certificados" className="m-0 focus-visible:ring-0">
                <ReportTable reports={publishedReports} />
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </main>
    </div>
  );
}

"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  PlusCircle, 
  TrendingUp, 
  History, 
  Activity,
  ChevronRight,
  ArrowRight,
  ClipboardList,
  Wrench,
  CheckCircle2
} from "lucide-react";
import { MOCK_REPORTS, SUMMARY_STATS } from "@/lib/mock-data";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { StatsChart } from "@/components/dashboard/StatsChart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Dashboard() {
  const budgetReports = MOCK_REPORTS.filter(r => r.status === 'Budget');
  const inRecoveryReports = MOCK_REPORTS.filter(r => r.status === 'InRecovery');
  const publishedReports = MOCK_REPORTS.filter(r => r.status === 'Published');

  const ReportTable = ({ reports }: { reports: typeof MOCK_REPORTS }) => (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 border-b">
          <tr className="text-left">
            <th className="px-8 py-4 font-black text-muted-foreground uppercase text-[10px] tracking-[0.2em]">Registro</th>
            <th className="px-8 py-4 font-black text-muted-foreground uppercase text-[10px] tracking-[0.2em]">Unidade CVT</th>
            <th className="px-8 py-4 font-black text-muted-foreground uppercase text-[10px] tracking-[0.2em]">Cliente Industrial</th>
            <th className="px-8 py-4 font-black text-muted-foreground uppercase text-[10px] tracking-[0.2em]">Data</th>
            <th className="px-8 py-4 font-black text-muted-foreground uppercase text-[10px] tracking-[0.2em] text-center">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-muted/30">
          {reports.map((report) => (
            <tr key={report.id} className="hover:bg-accent/5 transition-colors cursor-pointer group">
              <td className="px-8 py-5 font-black text-primary tracking-tight">{report.reportNumber}</td>
              <td className="px-8 py-5">
                <div className="flex flex-col">
                  <span className="font-black text-primary uppercase tracking-tighter">{report.model}</span>
                  <span className="text-[10px] text-accent font-black uppercase tracking-widest">{report.equipmentType}</span>
                </div>
              </td>
              <td className="px-8 py-5 text-muted-foreground font-black uppercase text-xs">{report.client}</td>
              <td className="px-8 py-5 text-muted-foreground font-mono font-bold text-xs">{report.date}</td>
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
          {reports.length === 0 && (
            <tr>
              <td colSpan={5} className="px-8 py-20 text-center text-muted-foreground font-bold uppercase text-xs tracking-widest">
                Nenhum registro encontrado nesta categoria.
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
            <h1 className="text-3xl font-black text-primary uppercase tracking-tighter">Terminal de Controle</h1>
            <p className="text-muted-foreground flex items-center gap-2 font-medium">
              <Activity className="h-4 w-4 text-accent" />
              Bem-vindo, <span className="font-black text-primary uppercase tracking-tight">DIEGO</span>. Sistema CERTIFICA operacional.
            </p>
          </div>
          <Link href="/reports/new">
            <Button className="bg-accent hover:bg-accent/90 text-primary gap-2 h-14 px-8 text-lg font-black shadow-xl transition-all hover:scale-105 active:scale-95 uppercase">
              <PlusCircle className="h-6 w-6" />
              Emitir Novo Laudo
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SUMMARY_STATS.map((stat, i) => (
            <Card key={i} className="border-none shadow-md overflow-hidden group relative bg-white/80 backdrop-blur-sm">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-accent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardContent className="p-6">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{stat.label}</p>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-black text-primary tracking-tighter">{stat.value}</span>
                  <div className="flex items-center text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {stat.change}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-none shadow-xl bg-white overflow-hidden">
          <Tabs defaultValue="orcamentos" className="w-full">
            <CardHeader className="flex flex-col border-b bg-[#0B1A2B] text-white p-0">
              <div className="flex flex-row items-center justify-between px-8 py-6">
                <div>
                  <CardTitle className="text-2xl font-black uppercase tracking-tighter">Banco de Dados CVT</CardTitle>
                  <CardDescription className="text-white/60 font-medium">Gestão de fluxo de trabalho em tempo real.</CardDescription>
                </div>
                <Link href="/reports">
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 font-black uppercase tracking-widest text-[10px] gap-2">
                    VER HISTÓRICO COMPLETO <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
              
              <TabsList className="bg-transparent h-14 px-8 gap-8 justify-start border-t border-white/10 rounded-none w-full">
                <TabsTrigger 
                  value="orcamentos" 
                  className="data-[state=active]:bg-transparent data-[state=active]:text-accent data-[state=active]:border-b-2 data-[state=active]:border-accent rounded-none h-full font-black uppercase text-[10px] tracking-[0.2em] px-0 gap-2"
                >
                  <ClipboardList className="h-4 w-4" />
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

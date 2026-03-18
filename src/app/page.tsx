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
  ArrowRight
} from "lucide-react";
import { MOCK_REPORTS, SUMMARY_STATS } from "@/lib/mock-data";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { StatsChart } from "@/components/dashboard/StatsChart";

export default function Dashboard() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-primary uppercase tracking-tighter">Terminal de Controle</h1>
            <p className="text-muted-foreground flex items-center gap-2 font-medium">
              <Activity className="h-4 w-4 text-accent" />
              Bem-vindo, <span className="font-black text-primary uppercase tracking-tight">Mestre Brazilian</span>. Sistema CERTIFICA operacional.
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 border-none shadow-lg bg-white">
            <CardHeader className="flex flex-row items-center justify-between border-b px-6 py-4">
              <div>
                <CardTitle className="text-xl font-black text-primary uppercase tracking-tight">Volume de Certificações CVT</CardTitle>
                <CardDescription className="font-medium">Produtividade mensal de laudos técnicos especializados.</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[10px] font-black h-6 px-3 bg-primary/5 border-primary/10">PUBLICADOS</Badge>
                <Badge variant="outline" className="text-[10px] font-black h-6 px-3 border-accent/20 text-accent">RASCUNHOS</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <StatsChart />
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-white">
            <CardHeader className="border-b px-6 py-4 bg-muted/5">
              <CardTitle className="text-xl font-black text-primary uppercase tracking-tight flex items-center gap-2">
                <History className="h-5 w-5 text-accent" />
                LOG DE ATIVIDADE
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {MOCK_REPORTS.slice(0, 5).map((report) => (
                  <Link key={report.id} href={`/reports/${report.id}`} className="block group">
                    <div className="px-6 py-5 hover:bg-accent/5 transition-colors flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-black text-primary group-hover:text-accent transition-colors tracking-tight">{report.reportNumber}</p>
                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-wide">{report.client}</p>
                        <p className="text-[10px] text-accent font-mono font-black">{report.model}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
              <div className="p-4 border-t bg-muted/10">
                <Link href="/reports">
                  <Button variant="ghost" className="w-full text-primary font-black uppercase tracking-widest text-[10px] hover:text-accent hover:bg-white transition-all">
                    Ver todos os registros
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-none shadow-xl bg-white overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between border-b px-8 py-6 bg-[#0B1A2B] text-white">
            <div>
              <CardTitle className="text-2xl font-black uppercase tracking-tighter">Últimos Laudos CVT</CardTitle>
              <CardDescription className="text-white/60 font-medium">Status em tempo real do banco de dados.</CardDescription>
            </div>
            <Link href="/reports">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 font-black uppercase tracking-widest text-[10px] gap-2">
                RELATÓRIO COMPLETO <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
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
                  {MOCK_REPORTS.map((report) => (
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
                          variant={report.status === 'Published' ? 'default' : 'secondary'} 
                          className={report.status === 'Published' ? 'bg-emerald-100 text-emerald-800 border-none font-black text-[10px] uppercase px-3' : 'font-black text-[10px] uppercase px-3'}
                        >
                          {report.status === 'Published' ? 'CERTIFICADO' : report.status === 'Draft' ? 'PENDENTE' : 'ARQUIVADO'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

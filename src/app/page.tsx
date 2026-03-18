"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  PlusCircle, 
  FileText, 
  Archive, 
  CheckCircle2, 
  ArrowRight, 
  TrendingUp, 
  History, 
  Activity,
  ChevronRight 
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
            <h1 className="text-3xl font-bold text-primary">Painel de Controle</h1>
            <p className="text-muted-foreground flex items-center gap-2">
              <Activity className="h-4 w-4 text-accent" />
              Bem-vindo de volta, <span className="font-semibold text-primary">Mestre Brazilian</span>. Sistema CertiFlow operacional.
            </p>
          </div>
          <Link href="/reports/new">
            <Button className="bg-accent hover:bg-accent/90 text-white gap-2 h-12 px-6 text-lg font-semibold shadow-lg transition-transform hover:scale-105 active:scale-95">
              <PlusCircle className="h-5 w-5" />
              Novo Laudo
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SUMMARY_STATS.map((stat, i) => (
            <Card key={i} className="border-none shadow-md overflow-hidden group relative">
              <div className="absolute top-0 left-0 w-1 h-full bg-accent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardContent className="p-6">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-bold text-primary">{stat.value}</span>
                  <div className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {stat.change}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 border-none shadow-md">
            <CardHeader className="flex flex-row items-center justify-between border-b px-6 py-4">
              <div>
                <CardTitle className="text-xl font-bold text-primary">Volume de Certificações</CardTitle>
                <CardDescription>Produção mensal de laudos certificados</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[10px] h-5">PUBLICADOS</Badge>
                <Badge variant="outline" className="text-[10px] h-5 border-accent text-accent">RASCUNHOS</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <StatsChart />
            </CardContent>
          </Card>

          <Card className="border-none shadow-md">
            <CardHeader className="border-b px-6 py-4">
              <CardTitle className="text-xl font-bold text-primary flex items-center gap-2">
                <History className="h-5 w-5 text-accent" />
                Atividade Recente
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {MOCK_REPORTS.slice(0, 5).map((report) => (
                  <Link key={report.id} href={`/reports/${report.id}`} className="block">
                    <div className="px-6 py-4 hover:bg-muted/30 transition-colors flex items-center justify-between group">
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-primary group-hover:text-accent transition-colors">{report.reportNumber}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">{report.client}</p>
                        <p className="text-[10px] text-muted-foreground font-mono uppercase">{report.equipmentType}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
              <div className="p-4 border-t">
                <Link href="/reports">
                  <Button variant="ghost" className="w-full text-accent font-bold hover:text-accent hover:bg-accent/5">
                    Ver todos os registros
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-none shadow-md">
          <CardHeader className="flex flex-row items-center justify-between border-b px-6 py-4">
            <div>
              <CardTitle className="text-xl font-bold text-primary">Últimos Laudos Registrados</CardTitle>
              <CardDescription>Visualização rápida dos status de controle de qualidade</CardDescription>
            </div>
            <Link href="/reports">
              <Button variant="ghost" className="text-accent font-semibold gap-1">
                Relatório Completo <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 border-b">
                  <tr className="text-left">
                    <th className="px-6 py-4 font-semibold text-muted-foreground uppercase text-[10px] tracking-widest">Número</th>
                    <th className="px-6 py-4 font-semibold text-muted-foreground uppercase text-[10px] tracking-widest">Equipamento</th>
                    <th className="px-6 py-4 font-semibold text-muted-foreground uppercase text-[10px] tracking-widest">Cliente</th>
                    <th className="px-6 py-4 font-semibold text-muted-foreground uppercase text-[10px] tracking-widest">Data</th>
                    <th className="px-6 py-4 font-semibold text-muted-foreground uppercase text-[10px] tracking-widest text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {MOCK_REPORTS.map((report) => (
                    <tr key={report.id} className="hover:bg-accent/5 transition-colors cursor-pointer group">
                      <td className="px-6 py-4 font-bold text-primary">{report.reportNumber}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-primary/80">{report.model}</span>
                          <span className="text-[10px] text-muted-foreground font-semibold uppercase">{report.equipmentType}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground font-medium">{report.client}</td>
                      <td className="px-6 py-4 text-muted-foreground font-mono">{report.date}</td>
                      <td className="px-6 py-4 text-center">
                        <Badge 
                          variant={report.status === 'Published' ? 'default' : 'secondary'} 
                          className={report.status === 'Published' ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-none font-bold' : 'font-bold'}
                        >
                          {report.status === 'Published' ? 'PUBLICADO' : report.status === 'Draft' ? 'RASCUNHO' : 'ARQUIVADO'}
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


"use client";

import { useParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { QualityReportForm } from "@/components/reports/QualityReportForm";
import { ChevronLeft, Printer, Share2, FileText } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MOCK_REPORTS } from "@/lib/mock-data";

export default function ViewReportPage() {
  const params = useParams();
  const reportId = params.id as string;
  const report = MOCK_REPORTS.find(r => r.id === reportId);

  if (!report) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p>Laudo não encontrado.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <Link href="/reports">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ChevronLeft className="h-6 w-6" />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold text-primary">Laudo {report.reportNumber}</h1>
                <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold uppercase">CERTIFICADO</span>
              </div>
              <p className="text-muted-foreground">Editando registro para {report.client}.</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" title="Imprimir">
              <Printer className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" title="Compartilhar">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="gap-2">
              <FileText className="h-4 w-4" /> Exportar PDF
            </Button>
            <Button className="bg-primary text-white shadow-md">Atualizar Registro</Button>
          </div>
        </div>

        <QualityReportForm />
      </main>
    </div>
  );
}

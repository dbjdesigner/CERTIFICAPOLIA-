
"use client";

import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { QualityReportForm } from "@/components/reports/QualityReportForm";
import { ChevronLeft, Printer, Share2, FileText, Activity, Trash2, Download } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useFirestore, useDoc, useMemoFirebase, useUser } from "@/firebase";
import { doc, deleteDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

export default function ViewReportPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const reportId = params.id as string;
  const db = useFirestore();
  const { user } = useUser();

  const reportRef = useMemoFirebase(() => {
    if (!db || !reportId) return null;
    return doc(db, "reports", reportId);
  }, [db, reportId]);

  const { data: report, isLoading } = useDoc(reportRef);

  const handleDelete = async () => {
    if (!db || !reportId) return;
    if (confirm("Deseja realmente excluir este laudo permanentemente?")) {
      try {
        await deleteDoc(doc(db, "reports", reportId));
        toast({ title: "Laudo Removido" });
        router.push("/");
      } catch (e) {
        toast({ variant: "destructive", title: "Erro ao remover", description: "Permissão negada." });
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center">
          <Activity className="h-10 w-10 animate-spin text-accent" />
          <p className="font-black text-primary uppercase mt-4 text-xs">Carregando Terminal...</p>
        </main>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6">
          <FileText className="h-20 w-20 text-muted-foreground opacity-20" />
          <h1 className="text-2xl font-black text-primary uppercase">Registro Não Localizado</h1>
          <Link href="/"><Button className="bg-primary">Voltar ao Terminal</Button></Link>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="print:hidden"><Navbar /></div>
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl space-y-6 print:p-0 print:max-w-none">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="rounded-full"><ChevronLeft className="h-6 w-6" /></Button>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-primary uppercase tracking-tighter">{report.reportNumber}</h1>
                <Badge className={
                  report.status === 'Published' ? 'bg-emerald-500 text-white' : 
                  report.status === 'InRecovery' ? 'bg-blue-500 text-white' : 'bg-amber-500 text-white'
                }>
                  {report.status === 'Published' ? 'CERTIFICADO' : 
                   report.status === 'InRecovery' ? 'RECUPERAÇÃO' : 'ORÇAMENTO'}
                </Badge>
              </div>
              <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] mt-1">
                Cliente: <span className="text-accent">{report.clientName || "N/A"}</span>
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="gap-2 font-black uppercase text-[10px]" onClick={handlePrint}>
              <Printer className="h-4 w-4" /> Exportar / Imprimir
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-destructive hover:bg-destructive/10" 
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <QualityReportForm />
      </main>
    </div>
  );
}

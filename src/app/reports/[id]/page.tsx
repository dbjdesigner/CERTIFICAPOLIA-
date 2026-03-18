
"use client";

import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { QualityReportForm } from "@/components/reports/QualityReportForm";
import { ChevronLeft, Printer, Share2, FileText, Activity, Trash2 } from "lucide-react";
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
        toast({ title: "Laudo Removido", description: "O registro foi excluído do terminal." });
        router.push("/");
      } catch (e) {
        toast({ variant: "destructive", title: "Erro ao remover", description: "Você não tem permissão para excluir este registro." });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center space-y-4">
          <Activity className="h-10 w-10 animate-spin text-accent" />
          <p className="font-black text-primary uppercase tracking-widest text-xs">Acessando Banco de Dados...</p>
        </main>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6">
          <div className="bg-destructive/10 p-6 rounded-full">
            <FileText className="h-16 w-16 text-destructive" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-primary uppercase">REGISTRO NÃO LOCALIZADO</h1>
            <p className="text-muted-foreground font-medium">O laudo solicitado não existe ou você não possui autorização de acesso.</p>
          </div>
          <Link href="/">
            <Button className="bg-primary h-12 px-8 font-black uppercase">VOLTAR AO TERMINAL</Button>
          </Link>
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
            <Link href="/">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/5">
                <ChevronLeft className="h-6 w-6" />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-primary uppercase tracking-tighter">Laudo {report.reportNumber}</h1>
                <span className={`text-[10px] font-black px-3 py-1 rounded uppercase border-none ${
                  report.status === 'Published' ? 'bg-emerald-500 text-white' : 
                  report.status === 'InRecovery' ? 'bg-blue-500 text-white' : 
                  'bg-amber-500 text-white'
                }`}>
                  {report.status === 'Published' ? 'CERTIFICADO' : 
                   report.status === 'InRecovery' ? 'RECUPERAÇÃO' : 'ORÇAMENTO'}
                </span>
              </div>
              <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest mt-1">
                Cliente: <span className="text-primary">{report.clientName || "NÃO INFORMADO"}</span>
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="icon" title="Imprimir" className="border-primary/10">
              <Printer className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" title="Compartilhar" className="border-primary/10">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="gap-2 border-primary/10 font-bold text-xs uppercase">
              <FileText className="h-4 w-4" /> PDF
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

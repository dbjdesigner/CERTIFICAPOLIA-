"use client";

import { Navbar } from "@/components/layout/Navbar";
import { QualityReportForm } from "@/components/reports/QualityReportForm";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NewReportPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ChevronLeft className="h-6 w-6" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-black text-primary uppercase tracking-tighter">Novo Laudo de Qualidade</h1>
              <p className="text-muted-foreground font-medium uppercase text-[10px] tracking-widest">Iniciando registro certificado no terminal industrial.</p>
            </div>
          </div>
        </div>

        <QualityReportForm />
      </main>
    </div>
  );
}

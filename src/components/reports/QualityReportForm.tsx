
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Sparkles,
  Save,
  Loader2,
  Activity,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  ThumbsUp,
  Wrench,
  CheckCircle,
  FileText,
  Award,
  ChevronRight
} from "lucide-react";
import { aiAssistedDataEntry } from "@/ai/flows/ai-assisted-data-entry-flow";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { useFirestore, useUser, useDoc, useMemoFirebase } from "@/firebase";
import { doc, collection } from "firebase/firestore";
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates";

const SELLERS = ["DOUGLAS", "LEANDRO", "LUIZ", "MERCADOLIVRE", "PAMELA", "RODRIGO", "RONALDO", "THIAGO", "VINICIUS"];
const CVT_MODELS = ["JF011", "JF011E", "JF011E 2X MOLAS", "JF015", "JF015E", "JF016"];

export function QualityReportForm() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useUser();
  const db = useFirestore();
  
  const [activeTab, setActiveTab] = useState("identificacao");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [status, setStatus] = useState<'Budget' | 'InRecovery' | 'Published'>('Budget');
  const [showCustomModel, setShowCustomModel] = useState(false);
  
  const [formData, setFormData] = useState({
    equipmentType: "JF011",
    customEquipmentType: "",
    model: "",
    manufacturer: "",
    serialNumber: "CF*",
    clientName: "",
    sellerName: "",
    clientInfo: "",
    operationType: "recovery" as 'recovery' | 'sale',
    value: "",
    partialDescription: "",
    priVacRef: "24",
    priVacAntes: "",
    priVacDepois: "",
    priPresRef: "510",
    priPresAntes: "",
    priPresDepois: "",
    secVacRef: "24",
    secVacAntes: "",
    secVacDepois: "",
    secPresRef: "510",
    secPresAntes: "",
    secPresDepois: "",
    createdAt: null
  });

  const reportId = params.id as string;
  const reportRef = useMemoFirebase(() => {
    if (!db || !reportId) return null;
    return doc(db, "reports", reportId);
  }, [db, reportId]);
  
  const { data: existingReport, isLoading: isReportLoading } = useDoc(reportRef);

  useEffect(() => {
    if (existingReport) {
      setFormData(prev => ({ ...prev, ...existingReport }));
      setStatus(existingReport.status || 'Budget');
    }
  }, [existingReport]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNumericInput = (field: string, value: string) => {
    const numericValue = value.replace(/[^\d]/g, "");
    handleInputChange(field, numericValue);
  };

  const handleAiAssist = async () => {
    const currentModel = formData.equipmentType === "CRIAR" ? formData.customEquipmentType : formData.equipmentType;
    setIsAiLoading(true);
    try {
      const result = await aiAssistedDataEntry({
        equipmentType: currentModel,
        partialDescription: formData.partialDescription,
        serialNumber: formData.serialNumber,
        operationType: formData.operationType
      });
      if (result.suggestedEquipmentDetails) {
        setFormData(prev => ({
          ...prev,
          model: result.suggestedEquipmentDetails?.model || prev.model,
          manufacturer: result.suggestedEquipmentDetails?.manufacturer || prev.manufacturer
        }));
      }
      toast({ title: "Assistência IA Concluída" });
    } catch (error) {
      toast({ title: "IA Indisponível", variant: "destructive" });
    } finally {
      setIsAiLoading(false);
    }
  };

  const saveReport = (newStatus?: typeof status) => {
    if (!db || !user) return;
    const finalStatus = newStatus || status;
    const finalId = reportId || doc(collection(db, "reports")).id;
    const finalRef = doc(db, "reports", finalId);

    const reportData = {
      ...formData,
      id: finalId,
      status: finalStatus,
      technicianId: user.uid,
      reportNumber: formData.serialNumber !== "CF*" ? `QC-${formData.serialNumber.replace("CF*", "")}` : `QC-${Math.floor(Math.random() * 10000)}`,
      updatedAt: new Date().toISOString(),
      createdAt: formData.createdAt || new Date().toISOString()
    };

    setDocumentNonBlocking(finalRef, reportData, { merge: true });
    
    if (!reportId) {
      router.push(`/reports/${finalId}`);
      toast({ title: "Orçamento Criado", description: "O registro foi salvo no banco de dados." });
    }
  };

  const TestSection = ({ title, prefix }: { title: string, prefix: 'pri' | 'sec' }) => (
    <div className="space-y-6">
      <div className="flex items-center gap-2 border-l-4 border-accent pl-4">
        <h3 className="text-lg font-black text-primary uppercase tracking-tight">{title}</h3>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border shadow-sm overflow-hidden bg-white">
          <div className="bg-muted/30 px-4 py-2 border-b flex justify-between items-center">
            <span className="text-[10px] font-black uppercase text-primary">Vácuo (INHG) - Ref: {formData[`${prefix}VacRef` as keyof typeof formData]}</span>
          </div>
          <CardContent className="p-4 grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-[9px] font-bold uppercase text-orange-600">Entrada</Label>
              <Input className="h-10 font-black bg-orange-50/50" value={formData[`${prefix}VacAntes` as keyof typeof formData] || ""} onChange={(e) => handleNumericInput(`${prefix}VacAntes`, e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label className="text-[9px] font-bold uppercase text-emerald-600">Saída</Label>
              <Input className="h-10 font-black bg-emerald-50/50" value={formData[`${prefix}VacDepois` as keyof typeof formData] || ""} onChange={(e) => handleNumericInput(`${prefix}VacDepois`, e.target.value)} />
            </div>
          </CardContent>
        </Card>
        <Card className="border shadow-sm overflow-hidden bg-white">
          <div className="bg-muted/30 px-4 py-2 border-b flex justify-between items-center">
            <span className="text-[10px] font-black uppercase text-primary">Pressão (KPA) - Ref: {formData[`${prefix}PresRef` as keyof typeof formData]}</span>
          </div>
          <CardContent className="p-4 grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-[9px] font-bold uppercase text-orange-600">Entrada</Label>
              <Input className="h-10 font-black bg-orange-50/50" value={formData[`${prefix}PresAntes` as keyof typeof formData] || ""} onChange={(e) => handleNumericInput(`${prefix}PresAntes`, e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label className="text-[9px] font-bold uppercase text-emerald-600">Saída</Label>
              <Input className="h-10 font-black bg-emerald-50/50" value={formData[`${prefix}PresDepois` as keyof typeof formData] || ""} onChange={(e) => handleNumericInput(`${prefix}PresDepois`, e.target.value)} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center bg-white p-6 rounded-xl shadow-sm border gap-4 print:hidden">
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 p-3 rounded-lg border border-primary/20">
            {status === 'Published' ? <CheckCircle className="h-6 w-6 text-emerald-600" /> : status === 'InRecovery' ? <Wrench className="h-6 w-6 text-blue-600" /> : <FileText className="h-6 w-6 text-amber-600" />}
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-black text-primary uppercase tracking-tighter">Fluxo do Terminal</h2>
            <Badge className={
              status === 'Published' ? "bg-emerald-500 text-white font-black text-[10px] uppercase" : 
              status === 'InRecovery' ? "bg-blue-500 text-white font-black text-[10px] uppercase" :
              "bg-amber-500 text-white font-black text-[10px] uppercase"
            }>
              {status === 'Published' ? "CERTIFICADO DE QUALIDADE" : status === 'InRecovery' ? "EM RECUPERAÇÃO" : "ORÇAMENTO PENDENTE"}
            </Badge>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 w-full lg:w-auto">
          {!reportId && (
            <Button className="bg-amber-500 hover:bg-amber-600 text-white font-black uppercase text-xs h-12 px-8 shadow-lg" onClick={() => saveReport('Budget')}>
              <Save className="h-4 w-4 mr-2" /> REGISTRAR ORÇAMENTO
            </Button>
          )}
          {status === 'Budget' && reportId && (
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-black uppercase text-xs h-12 px-8 shadow-lg" onClick={() => { setStatus('InRecovery'); saveReport('InRecovery'); toast({ title: "Orçamento Aprovado" }); }}>
              <ThumbsUp className="h-4 w-4 mr-2" /> APROVAR E INICIAR RECUPERAÇÃO
            </Button>
          )}
          {status === 'InRecovery' && (
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase text-xs h-12 px-8 shadow-lg" onClick={() => { setStatus('Published'); saveReport('Published'); toast({ title: "Laudo Finalizado" }); }}>
              <CheckCircle2 className="h-4 w-4 mr-2" /> FINALIZAR E CERTIFICAR
            </Button>
          )}
          <Button variant="outline" className="border-primary/20 text-primary font-black uppercase text-xs h-12 px-6" onClick={() => { saveReport(); toast({ title: "Alterações Salvas" }); }}>
            SALVAR ALTERAÇÕES
          </Button>
        </div>
      </div>

      <Card className="border-none shadow-xl overflow-hidden bg-white print:shadow-none print:border-none">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start h-auto p-0 bg-muted/30 rounded-none border-b overflow-x-auto print:hidden">
            {["identificacao", "testes", "servicos", "qualidade", "garantia"].map((tab, idx) => (
              <TabsTrigger key={tab} value={tab} className="px-8 py-5 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:border-b-4 data-[state=active]:border-primary rounded-none font-black uppercase text-[10px] tracking-widest">
                {idx + 1}. {tab === "identificacao" ? "Identificação" : tab === "testes" ? "Módulo Hidráulico" : tab === "servicos" ? "Serviços" : tab === "qualidade" ? "Qualidade" : "Garantia"}
              </TabsTrigger>
            ))}
          </TabsList>

          <CardContent className="p-8 space-y-12 print:p-0 print:space-y-8">
            <div className="hidden print:block border-b-4 border-primary pb-8">
              <div className="flex justify-between items-end">
                <div>
                  <h1 className="text-4xl font-black text-primary tracking-tighter uppercase">Certificado de Qualidade CVT</h1>
                  <p className="text-xs font-bold text-accent tracking-[0.3em] uppercase mt-2">Relatório Técnico Nº {formData.serialNumber}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-primary uppercase">CERTIFICA LAUDO CVT</p>
                  <p className="text-[8px] font-bold text-muted-foreground uppercase">Terminal de Alta Precisão Industrial</p>
                </div>
              </div>
            </div>

            <section className="space-y-8">
              <div className="flex justify-between items-center border-b pb-4">
                <h3 className="text-xl font-black text-primary uppercase tracking-tight flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-accent" /> Identificação da Unidade
                </h3>
                <div className="print:hidden">
                  <Button onClick={handleAiAssist} disabled={isAiLoading} variant="outline" className="gap-2 border-accent/20 text-accent font-black h-10 px-6">
                    {isAiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} IA ASSIST
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground">Cliente Industrial</Label>
                  <Input className="h-12 font-black uppercase print:border-none print:h-auto print:p-0" value={formData.clientName} onChange={(e) => handleInputChange('clientName', e.target.value.toUpperCase())} />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground">Vendedor Responsável</Label>
                  <Select value={formData.sellerName} onValueChange={(v) => handleInputChange('sellerName', v)}>
                    <SelectTrigger className="h-12 font-black print:hidden"><SelectValue /></SelectTrigger>
                    <SelectContent>{SELLERS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                  <div className="hidden print:block font-black uppercase">{formData.sellerName}</div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-accent">Valor Total (R$)</Label>
                  <div className="relative print:hidden">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-accent" />
                    <Input className="h-12 pl-10 font-black text-lg" value={formData.value} onChange={(e) => handleNumericInput('value', e.target.value)} />
                  </div>
                  <div className="hidden print:block font-black text-xl text-accent">R$ {formData.value}</div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground">Modelo Conjunto</Label>
                  <div className="font-black uppercase text-primary print:text-lg">{formData.equipmentType === "CRIAR" ? formData.customEquipmentType : formData.equipmentType}</div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground">Número de Série</Label>
                  <div className="font-black text-primary uppercase print:text-lg">{formData.serialNumber}</div>
                </div>
              </div>
            </section>

            <section className="space-y-12">
              <TestSection title="Polia Primária" prefix="pri" />
              <TestSection title="Polia Secundária" prefix="sec" />
            </section>

            <section className="print:block space-y-8">
              <div className="flex items-center gap-2 border-b pb-4">
                <Award className="h-6 w-6 text-accent" />
                <h3 className="text-xl font-black text-primary uppercase tracking-tight">Garantia e Qualidade</h3>
              </div>
              <Card className="bg-[#0B1A2B] text-white p-12 rounded-[2rem] text-center border-none print:bg-muted print:text-primary">
                <h4 className="text-2xl font-black uppercase text-accent mb-4">Certificação Técnica Validada</h4>
                <p className="text-white/80 font-bold max-w-2xl mx-auto print:text-primary">Unidade CVT testada e validada sob pressão nominal. Garantia de 03 meses exclusiva para o serviço executado conforme registro.</p>
                <div className="mt-8 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-around gap-8">
                  <div className="text-center">
                    <div className="h-px w-48 bg-white/20 mx-auto mb-2" />
                    <p className="text-[10px] font-black uppercase">Responsável Técnico</p>
                  </div>
                  <div className="text-center">
                    <div className="h-px w-48 bg-white/20 mx-auto mb-2" />
                    <p className="text-[10px] font-black uppercase">Data da Certificação</p>
                  </div>
                </div>
              </Card>
            </section>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
}

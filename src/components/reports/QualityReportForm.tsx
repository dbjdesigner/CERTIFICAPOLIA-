
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
  Calendar,
  UserCheck,
  DollarSign,
  ThumbsUp,
  Plus,
  Wrench,
  CheckCircle,
  FileText,
  AlertCircle
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
    // Polia Primaria
    priVacRef: "24",
    priVacAntes: "",
    priVacDepois: "",
    priPresRef: "510",
    priPresAntes: "",
    priPresDepois: "",
    // Polia Secundaria
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
      toast({ title: "Assistência IA", description: "Dados técnicos sugeridos com sucesso." });
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
    }
  };

  const handleApproveBudget = () => {
    setStatus('InRecovery');
    saveReport('InRecovery');
    toast({ title: "Orçamento Aprovado", description: "O laudo foi movido para a bancada de RECUPERAÇÃO." });
  };

  const handleFinalizeReport = () => {
    setStatus('Published');
    saveReport('Published');
    toast({ title: "Laudo Finalizado", description: "Certificado de qualidade emitido com sucesso." });
  };

  const TestSection = ({ title, prefix }: { title: string, prefix: 'pri' | 'sec' }) => (
    <div className="space-y-6">
      <div className="flex items-center gap-2 border-l-4 border-accent pl-4">
        <h3 className="text-lg font-black text-primary uppercase tracking-tight">{title}</h3>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border shadow-sm overflow-hidden">
          <div className="bg-muted/30 px-4 py-2 border-b flex justify-between items-center">
            <span className="text-[10px] font-black uppercase text-primary">Vácuo (INHG)</span>
            <Input 
              className="h-6 w-16 text-[10px] font-black bg-white border-accent/30 text-center" 
              value={formData[`${prefix}VacRef` as keyof typeof formData] || ""}
              onChange={(e) => handleNumericInput(`${prefix}VacRef`, e.target.value)}
            />
          </div>
          <CardContent className="p-4 grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-[9px] font-bold uppercase text-orange-600">Antes</Label>
              <Input className="h-10 font-black bg-orange-50/50" value={formData[`${prefix}VacAntes` as keyof typeof formData] || ""} onChange={(e) => handleNumericInput(`${prefix}VacAntes`, e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label className="text-[9px] font-bold uppercase text-emerald-600">Depois</Label>
              <Input className="h-10 font-black bg-emerald-50/50" value={formData[`${prefix}VacDepois` as keyof typeof formData] || ""} onChange={(e) => handleNumericInput(`${prefix}VacDepois`, e.target.value)} />
            </div>
          </CardContent>
        </Card>
        <Card className="border shadow-sm overflow-hidden">
          <div className="bg-muted/30 px-4 py-2 border-b flex justify-between items-center">
            <span className="text-[10px] font-black uppercase text-primary">Pressão (KPA)</span>
            <Input 
              className="h-6 w-16 text-[10px] font-black bg-white border-accent/30 text-center" 
              value={formData[`${prefix}PresRef` as keyof typeof formData] || ""}
              onChange={(e) => handleNumericInput(`${prefix}PresRef`, e.target.value)}
            />
          </div>
          <CardContent className="p-4 grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-[9px] font-bold uppercase text-orange-600">Antes</Label>
              <Input className="h-10 font-black bg-orange-50/50" value={formData[`${prefix}PresAntes` as keyof typeof formData] || ""} onChange={(e) => handleNumericInput(`${prefix}PresAntes`, e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label className="text-[9px] font-bold uppercase text-emerald-600">Depois</Label>
              <Input className="h-10 font-black bg-emerald-50/50" value={formData[`${prefix}PresDepois` as keyof typeof formData] || ""} onChange={(e) => handleNumericInput(`${prefix}PresDepois`, e.target.value)} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  if (isReportLoading && reportId) {
    return (
      <div className="flex flex-col items-center justify-center p-20 space-y-4">
        <Activity className="h-12 w-12 animate-spin text-accent" />
        <p className="font-black text-primary uppercase tracking-widest text-xs">Acessando Registro...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center bg-white p-6 rounded-xl shadow-sm border gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 p-3 rounded-lg border border-primary/20">
            {status === 'Published' ? <CheckCircle className="h-6 w-6 text-emerald-600" /> : status === 'InRecovery' ? <Wrench className="h-6 w-6 text-blue-600" /> : <FileText className="h-6 w-6 text-amber-600" />}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-primary uppercase tracking-tighter">Fluxo do Terminal</h2>
              <Badge className={
                status === 'Published' ? "bg-emerald-500 text-white font-black text-[10px] uppercase" : 
                status === 'InRecovery' ? "bg-blue-500 text-white font-black text-[10px] uppercase" :
                "bg-amber-500 text-white font-black text-[10px] uppercase"
              }>
                {status === 'Published' ? "CERTIFICADO" : status === 'InRecovery' ? "EM RECUPERAÇÃO" : "ORÇAMENTO EM ANÁLISE"}
              </Badge>
            </div>
            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">
              Unidade: <span className="text-accent">{formData.equipmentType === "CRIAR" ? formData.customEquipmentType : formData.equipmentType}</span>
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 w-full lg:w-auto">
          {status === 'Budget' && (
            <Button 
              className="flex-1 lg:flex-none bg-amber-500 hover:bg-amber-600 text-white gap-2 font-black uppercase text-xs h-12 px-6 shadow-lg"
              onClick={handleApproveBudget}
            >
              <ThumbsUp className="h-4 w-4" /> APROVAR E INICIAR RECUPERAÇÃO
            </Button>
          )}
          {status === 'InRecovery' && (
            <Button 
              className="flex-1 lg:flex-none bg-blue-600 hover:bg-blue-700 text-white gap-2 font-black uppercase text-xs h-12 px-6 shadow-lg"
              onClick={handleFinalizeReport}
            >
              <CheckCircle2 className="h-4 w-4" /> FINALIZAR E CERTIFICAR LAUDO
            </Button>
          )}
          <Button 
            variant="outline"
            className="flex-1 lg:flex-none border-primary/20 text-primary gap-2 font-black uppercase text-xs h-12 px-8"
            onClick={() => { saveReport(); toast({ title: "Registro Salvo" }); }}
          >
            <Save className="h-4 w-4" /> SALVAR RASCUNHO
          </Button>
        </div>
      </div>

      <Card className="border-none shadow-xl overflow-hidden bg-white">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start h-auto p-0 bg-muted/30 rounded-none border-b overflow-x-auto">
            {["identificacao", "testes", "servicos", "qualidade", "garantia"].map((tab, idx) => (
              <TabsTrigger key={tab} value={tab} className="px-8 py-5 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:border-b-4 data-[state=active]:border-primary rounded-none font-black uppercase text-[10px] tracking-widest">
                {idx + 1}. {tab === "identificacao" ? "Identificação" : tab === "testes" ? "Hidráulica" : tab === "servicos" ? "Serviços" : tab === "qualidade" ? "Qualidade" : "Garantia"}
              </TabsTrigger>
            ))}
          </TabsList>

          <CardContent className="p-8">
            <TabsContent value="identificacao" className="mt-0 space-y-8">
              <div className="flex justify-between items-center border-b pb-4">
                <h3 className="text-xl font-black text-primary uppercase tracking-tight flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-accent" /> DADOS DA UNIDADE
                </h3>
                <Button onClick={handleAiAssist} disabled={isAiLoading} variant="outline" className="gap-2 border-accent/20 text-accent font-black h-10 px-6">
                  {isAiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} IA ASSIST
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground">Cliente Industrial</Label>
                  <Input className="h-12 font-black uppercase" value={formData.clientName} onChange={(e) => handleInputChange('clientName', e.target.value.toUpperCase())} />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground">Vendedor</Label>
                  <Select value={formData.sellerName} onValueChange={(v) => handleInputChange('sellerName', v)}>
                    <SelectTrigger className="h-12 font-black"><SelectValue /></SelectTrigger>
                    <SelectContent>{SELLERS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-accent">Valor (R$)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-accent" />
                    <Input className="h-12 pl-10 font-black text-lg" value={formData.value} onChange={(e) => handleNumericInput('value', e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground">Conjunto CVT</Label>
                  <Select value={formData.equipmentType} onValueChange={(v) => { handleInputChange('equipmentType', v); setShowCustomModel(v === "CRIAR"); }}>
                    <SelectTrigger className="h-12 font-black"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {CVT_MODELS.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                      <SelectItem value="CRIAR" className="text-accent font-black">CRIAR NOVO...</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {showCustomModel && (
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-muted-foreground">Novo Modelo</Label>
                    <Input className="h-12 font-black uppercase border-accent" value={formData.customEquipmentType} onChange={(e) => handleInputChange('customEquipmentType', e.target.value.toUpperCase())} />
                  </div>
                )}
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground">Nº Série</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-black text-primary">CF*</span>
                    <Input className="h-12 pl-10 font-black" value={formData.serialNumber.replace("CF*", "")} onChange={(e) => handleNumericInput('serialNumber', "CF*" + e.target.value.replace(/[^\d]/g, ""))} />
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="testes" className="mt-0 space-y-12">
              <TestSection title="Polia Primária" prefix="pri" />
              <div className="border-t border-dashed" />
              <TestSection title="Polia Secundária" prefix="sec" />
            </TabsContent>
            <TabsContent value="servicos" className="mt-0 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {["INSPEÇÃO VISUAL", "LIMPEZA ULTRASSOM", "POLIMENTO POLIAS", "TESTE ESTANQUEIDADE", "CALIBRAÇÃO", "MONTAGEM TORQUE"].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-5 border rounded-2xl bg-muted/5">
                    <input type="checkbox" className="h-6 w-6 accent-primary" />
                    <Label className="font-black text-[11px] uppercase">{item}</Label>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="qualidade" className="mt-0">
              <div className="flex flex-col items-center justify-center p-12 text-center space-y-4">
                <ShieldCheck className="h-20 w-20 text-emerald-600" />
                <h4 className="text-2xl font-black uppercase text-primary">Controle de Qualidade Final</h4>
                <p className="text-muted-foreground max-w-md font-medium">Valide todos os módulos hidráulicos e mecânicos antes de emitir a certificação final da unidade CVT.</p>
              </div>
            </TabsContent>
            <TabsContent value="garantia" className="mt-0">
              <Card className="bg-[#0B1A2B] text-white p-12 rounded-[2.5rem] text-center border-none">
                <Award className="h-16 w-16 text-accent mx-auto mb-6" />
                <h4 className="text-3xl font-black uppercase text-accent mb-4">GARANTIA TÉCNICA CERTIFICA</h4>
                <p className="text-white/80 font-bold max-w-xl mx-auto mb-8">Unidade CVT testada e validada sob pressão nominal. Garantia de 03 meses exclusiva para o serviço executado conforme registro.</p>
                <div className="bg-white/10 p-6 rounded-2xl inline-block border border-white/10">
                  <p className="text-2xl font-black uppercase">VALIDADE: 90 DIAS</p>
                </div>
              </Card>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
}

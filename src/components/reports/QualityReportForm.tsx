
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  ClipboardCheck, 
  ImageIcon, 
  Sparkles,
  Save,
  Loader2,
  Activity,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  UserCheck,
  Award,
  DollarSign,
  ThumbsUp,
  Hash,
  Plus,
  Wrench,
  CheckCircle,
  FileText
} from "lucide-react";
import { aiAssistedDataEntry } from "@/ai/flows/ai-assisted-data-entry-flow";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { useFirestore, useUser, useDoc, useMemoFirebase } from "@/firebase";
import { doc, collection } from "firebase/firestore";
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates";

const SELLERS = [
  "DOUGLAS",
  "LEANDRO",
  "LUIZ",
  "MERCADOLIVRE",
  "PAMELA",
  "RODRIGO",
  "RONALDO",
  "THIAGO",
  "VINICIUS"
];

const CVT_MODELS = [
  "JF011",
  "JF011E",
  "JF011E 2X MOLAS",
  "JF015",
  "JF015E",
  "JF016"
];

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
    secPresDepois: ""
  });

  // Load existing report if ID is provided
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
    if (!currentModel && !formData.partialDescription) {
      toast({
        title: "Dados Insuficientes",
        description: "Insira o tipo de equipamento para a IA processar.",
        variant: "destructive"
      });
      return;
    }

    setIsAiLoading(true);
    try {
      const result = await aiAssistedDataEntry({
        equipmentType: currentModel,
        partialDescription: formData.partialDescription,
        serialNumber: formData.serialNumber,
        clientInfo: formData.clientInfo,
        operationType: formData.operationType
      });

      if (result.suggestedEquipmentDetails) {
        setFormData(prev => ({
          ...prev,
          model: result.suggestedEquipmentDetails?.model || prev.model,
          manufacturer: result.suggestedEquipmentDetails?.manufacturer || prev.manufacturer
        }));
      }

      toast({
        title: "Processamento Concluído",
        description: `Dados CVT sugeridos com sucesso.`,
      });
    } catch (error) {
      toast({
        title: "Falha de Processamento",
        description: "Serviço de IA temporariamente indisponível.",
        variant: "destructive"
      });
    } finally {
      setIsAiLoading(false);
    }
  };

  const saveReport = (newStatus?: typeof status) => {
    const finalStatus = newStatus || status;
    const finalId = reportId || doc(collection(db, "reports")).id;
    const finalRef = doc(db, "reports", finalId);

    const reportData = {
      ...formData,
      id: finalId,
      status: finalStatus,
      technicianId: user?.uid,
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
    toast({
      title: "Orçamento Aprovado",
      description: "O registro agora está liberado para execução e recuperação.",
    });
  };

  const handleFinalizeReport = () => {
    setStatus('Published');
    saveReport('Published');
    toast({
      title: "Laudo Finalizado",
      description: "Certificado de qualidade emitido com sucesso.",
    });
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
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-bold text-muted-foreground uppercase">Referência:</span>
              <Input 
                className="h-6 w-16 text-[10px] font-black bg-white border-accent/30 text-center" 
                value={formData[`${prefix}VacRef` as keyof typeof formData]}
                onChange={(e) => handleNumericInput(`${prefix}VacRef`, e.target.value)}
              />
            </div>
          </div>
          <CardContent className="p-4 grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-[9px] font-bold uppercase text-muted-foreground text-orange-600">Antes da Recuperação</Label>
              <div className="relative">
                <Input 
                  placeholder="0"
                  className="h-10 font-black bg-orange-50/50 border-orange-200 pr-10" 
                  value={formData[`${prefix}VacAntes` as keyof typeof formData]}
                  onChange={(e) => handleNumericInput(`${prefix}VacAntes`, e.target.value)}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[8px] font-black text-muted-foreground">INHG</span>
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-[9px] font-bold uppercase text-muted-foreground text-emerald-600">Depois da Recuperação</Label>
              <div className="relative">
                <Input 
                  placeholder="0"
                  className="h-10 font-black bg-emerald-50/50 border-emerald-200 pr-10" 
                  value={formData[`${prefix}VacDepois` as keyof typeof formData]}
                  onChange={(e) => handleNumericInput(`${prefix}VacDepois`, e.target.value)}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[8px] font-black text-muted-foreground">INHG</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-sm overflow-hidden">
          <div className="bg-muted/30 px-4 py-2 border-b flex justify-between items-center">
            <span className="text-[10px] font-black uppercase text-primary">Pressão (KPA)</span>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-bold text-muted-foreground uppercase">Referência:</span>
              <Input 
                className="h-6 w-16 text-[10px] font-black bg-white border-accent/30 text-center" 
                value={formData[`${prefix}PresRef` as keyof typeof formData]}
                onChange={(e) => handleNumericInput(`${prefix}PresRef`, e.target.value)}
              />
            </div>
          </div>
          <CardContent className="p-4 grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-[9px] font-bold uppercase text-muted-foreground text-orange-600">Antes da Recuperação</Label>
              <div className="relative">
                <Input 
                  placeholder="0"
                  className="h-10 font-black bg-orange-50/50 border-orange-200 pr-10" 
                  value={formData[`${prefix}PresAntes` as keyof typeof formData]}
                  onChange={(e) => handleNumericInput(`${prefix}PresAntes`, e.target.value)}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[8px] font-black text-muted-foreground">KPA</span>
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-[9px] font-bold uppercase text-muted-foreground text-emerald-600">Depois da Recuperação</Label>
              <div className="relative">
                <Input 
                  placeholder="0"
                  className="h-10 font-black bg-emerald-50/50 border-emerald-200 pr-10" 
                  value={formData[`${prefix}PresDepois` as keyof typeof formData]}
                  onChange={(e) => handleNumericInput(`${prefix}PresDepois`, e.target.value)}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[8px] font-black text-muted-foreground">KPA</span>
              </div>
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
        <p className="font-black text-primary uppercase tracking-widest text-xs">Carregando Dados do Laudo...</p>
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
              <h2 className="text-xl font-black text-primary uppercase tracking-tighter">Fluxo de Qualidade CVT</h2>
              <Badge 
                variant={status === 'Published' ? "default" : "outline"} 
                className={
                  status === 'Published' ? "bg-emerald-500 text-white border-none font-black text-[10px] uppercase" : 
                  status === 'InRecovery' ? "bg-blue-500 text-white border-none font-black text-[10px] uppercase" :
                  "border-amber-500 text-amber-600 font-black text-[10px] uppercase"
                }
              >
                {status === 'Published' ? "CERTIFICADO" : 
                 status === 'InRecovery' ? "EM RECUPERAÇÃO" : 
                 "ORÇAMENTO PENDENTE"}
              </Badge>
            </div>
            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Equipamento: <span className="text-accent">{formData.equipmentType} {formData.customEquipmentType}</span></p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 w-full lg:w-auto">
          {status === 'Budget' && (
            <Button 
              className="flex-1 lg:flex-none bg-amber-500 hover:bg-amber-600 text-white gap-2 font-black uppercase text-xs h-12 px-6 shadow-lg transition-all"
              onClick={handleApproveBudget}
            >
              <ThumbsUp className="h-4 w-4" />
              APROVAR ORÇAMENTO (CLIENTE AUTORIZOU)
            </Button>
          )}
          {status === 'InRecovery' && (
            <Button 
              className="flex-1 lg:flex-none bg-blue-600 hover:bg-blue-700 text-white gap-2 font-black uppercase text-xs h-12 px-6 shadow-lg transition-all"
              onClick={handleFinalizeReport}
            >
              <CheckCircle2 className="h-4 w-4" />
              FINALIZAR E LIBERAR LAUDO
            </Button>
          )}
          <Button 
            variant="outline"
            className="flex-1 lg:flex-none border-primary/20 text-primary gap-2 font-black uppercase text-xs h-12 px-8"
            onClick={() => {
              saveReport();
              toast({ title: "Laudo Sincronizado", description: "Dados salvos no banco de dados." });
            }}
          >
            <Save className="h-4 w-4" />
            SALVAR RASCUNHO
          </Button>
        </div>
      </div>

      <Card className="border-none shadow-xl overflow-hidden bg-white">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start h-auto p-0 bg-muted/30 rounded-none border-b overflow-x-auto">
            {[
              { id: "identificacao", label: "1. Identificação" },
              { id: "testes", label: "2. Testes Hidráulicos" },
              { id: "servicos", label: "3. Serviços & Peças" },
              { id: "qualidade", label: "4. Controle Final" },
              { id: "garantia", label: "5. Garantia" }
            ].map((tab) => (
              <TabsTrigger 
                key={tab.id}
                value={tab.id} 
                className="px-8 py-5 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:border-b-4 data-[state=active]:border-primary rounded-none font-black uppercase text-[10px] tracking-widest transition-all"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <CardContent className="p-8">
            <TabsContent value="identificacao" className="mt-0 space-y-8">
              <div className="flex justify-between items-center border-b pb-4">
                <h3 className="text-xl font-black text-primary uppercase tracking-tight flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-accent" />
                  Dados da Unidade CVT
                </h3>
                <Button 
                  onClick={handleAiAssist} 
                  disabled={isAiLoading}
                  variant="outline"
                  className="gap-2 border-accent/20 text-accent font-black h-10 px-6 hover:bg-accent/5"
                >
                  {isAiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  IA ASSISTANT
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Nome do Cliente Industrial</Label>
                  <Input 
                    placeholder="CLIENTE S/A" 
                    className="h-12 border-primary/10 focus:border-accent font-black uppercase bg-muted/5"
                    value={formData.clientName}
                    onChange={(e) => handleInputChange('clientName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Vendedor Responsável</Label>
                  <Select 
                    value={formData.sellerName} 
                    onValueChange={(value) => handleInputChange('sellerName', value)}
                  >
                    <SelectTrigger className="h-12 border-primary/10 font-black bg-muted/5">
                      <SelectValue placeholder="Selecione o Vendedor" />
                    </SelectTrigger>
                    <SelectContent>
                      {SELLERS.map(seller => (
                        <SelectItem key={seller} value={seller} className="font-black">{seller}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-accent tracking-widest">Valor do Serviço (R$)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-accent" />
                    <Input 
                      placeholder="0,00" 
                      className="h-14 border-accent/20 focus:border-accent font-black bg-accent/5 pl-10 text-lg"
                      value={formData.value}
                      onChange={(e) => handleNumericInput('value', e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Conjunto CVT</Label>
                  <Select 
                    value={formData.equipmentType} 
                    onValueChange={(value) => {
                      handleInputChange('equipmentType', value);
                      setShowCustomModel(value === "CRIAR");
                    }}
                  >
                    <SelectTrigger className="h-12 border-primary/10 font-black bg-muted/5">
                      <SelectValue placeholder="Selecione o Conjunto" />
                    </SelectTrigger>
                    <SelectContent>
                      {CVT_MODELS.map(model => (
                        <SelectItem key={model} value={model} className="font-black uppercase">{model}</SelectItem>
                      ))}
                      <SelectItem value="CRIAR" className="font-black text-accent uppercase flex items-center gap-2">
                        <Plus className="h-3 w-3 inline mr-1" /> CRIAR NOVO...
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {showCustomModel && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-left-2">
                    <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Especificar Novo Modelo</Label>
                    <Input 
                      placeholder="Digite o novo modelo CVT" 
                      className="h-12 border-accent/30 focus:border-accent font-black uppercase bg-accent/5"
                      value={formData.customEquipmentType}
                      onChange={(e) => handleInputChange('customEquipmentType', e.target.value.toUpperCase())}
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Tipo de Operação</Label>
                  <Select 
                    value={formData.operationType} 
                    onValueChange={(value) => handleInputChange('operationType', value as any)}
                  >
                    <SelectTrigger className="h-12 border-primary/10 font-black bg-muted/5">
                      <SelectValue placeholder="Selecione a Operação" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recovery" className="font-black uppercase">RECUPERAÇÃO TÉCNICA</SelectItem>
                      <SelectItem value="sale" className="font-black uppercase">VENDA TÉCNICA</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Número de Série</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-black text-primary text-sm tracking-tighter">CF*</span>
                    <Input 
                      placeholder="0000" 
                      className="h-12 border-primary/10 font-black uppercase bg-muted/5 pl-12"
                      value={formData.serialNumber.replace("CF*", "")}
                      onChange={(e) => {
                        const numericValue = e.target.value.replace(/[^\d]/g, "");
                        handleInputChange('serialNumber', "CF*" + numericValue);
                      }}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="testes" className="mt-0 space-y-12">
              <div className="flex items-center gap-3 text-primary border-b pb-4">
                <Activity className="h-6 w-6 text-accent" />
                <h3 className="text-xl font-black uppercase tracking-tighter">Comparativo de Performance Hidráulica</h3>
              </div>
              <div className="space-y-12">
                <TestSection title="Polia Primária" prefix="pri" />
                <div className="border-t border-dashed" />
                <TestSection title="Polia Secundária" prefix="sec" />
              </div>
            </TabsContent>

            <TabsContent value="servicos" className="mt-0 space-y-8">
              <div className="flex items-center gap-3 text-primary mb-6 border-b pb-4">
                <ShieldCheck className="h-6 w-6 text-accent" />
                <h3 className="text-xl font-black uppercase tracking-tight">Módulos de Manutenção Executados</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  "INSPEÇÃO VISUAL COMPLETA",
                  "LIMPEZA POR ULTRASSOM",
                  "POLIMENTO DE POLIAS (ESPECIAL)",
                  "SUBSTITUIÇÃO DE VEDAÇÕES",
                  "TESTE DE ESTANQUEIDADE",
                  "CALIBRAÇÃO DE PRESSÃO",
                  "GRAVAÇÃO DE NÚMERO DE SÉRIE",
                  "REVESTIMENTO TÉCNICO",
                  "MONTAGEM COM TORQUE CONTROLADO"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-5 border rounded-2xl hover:bg-accent/5 transition-all group cursor-pointer border-primary/5 bg-muted/5">
                    <input type="checkbox" className="h-6 w-6 rounded border-primary accent-primary cursor-pointer" id={`svc-${i}`} />
                    <Label htmlFor={`svc-${i}`} className="font-black text-[11px] uppercase cursor-pointer group-hover:text-primary transition-colors leading-tight">{item}</Label>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="qualidade" className="mt-0 space-y-8">
              <div className="flex items-center gap-3 text-primary border-b pb-4">
                <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                <h3 className="text-xl font-black text-primary uppercase tracking-tighter">Checklist de Aprovação Final</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  "CONFORMIDADE DIMENSIONAL OK",
                  "VALORES DE VÁCUO DENTRO DA REF.",
                  "VALORES DE PRESSÃO DENTRO DA REF.",
                  "IDENTIFICAÇÃO VISÍVEL E CORRETA"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-6 bg-emerald-50/30 rounded-2xl border border-emerald-100/50 hover:border-emerald-300 transition-all">
                    <input type="checkbox" className="h-6 w-6 accent-emerald-600 cursor-pointer" id={`chk-${i}`} />
                    <Label htmlFor={`chk-${i}`} className="font-black text-[11px] uppercase tracking-wider text-emerald-900">{item}</Label>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="garantia" className="mt-0 space-y-8">
              <Card className="border-4 border-accent/20 rounded-[2.5rem] overflow-hidden shadow-2xl bg-[#0B1A2B] text-white p-12 relative">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <ShieldCheck className="h-48 w-48 text-accent" />
                </div>
                <div className="space-y-10 relative z-10 text-center max-w-3xl mx-auto">
                  <div className="space-y-4">
                    <h4 className="text-4xl font-black uppercase tracking-tighter text-accent">GARANTIA DE ALTA PRECISÃO</h4>
                    <p className="text-lg font-bold text-white/80 leading-relaxed">
                      Este laudo técnico certifica que a unidade industrial CVT passou por processos de recuperação e testes hidráulicos atingindo os padrões nominais.
                    </p>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-md p-10 rounded-[2rem] border border-white/10 space-y-6">
                    <div className="flex flex-col items-center gap-4">
                      <Calendar className="h-10 w-10 text-accent" />
                      <p className="text-3xl font-black uppercase tracking-widest">
                        VALIDADE: <span className="text-accent underline decoration-white/20 underline-offset-8">03 MESES</span>
                      </p>
                    </div>
                    <p className="text-sm font-bold text-white/60 uppercase tracking-widest leading-loose">
                      A garantia cobre exclusivamente o <span className="text-white">SERVIÇO EXECUTADO</span>.
                    </p>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
}

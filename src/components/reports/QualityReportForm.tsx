
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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
  ClipboardCheck,
  Zap
} from "lucide-react";
import { aiAssistedDataEntry } from "@/ai/flows/ai-assisted-data-entry-flow";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { useFirestore, useUser, useDoc, useMemoFirebase } from "@/firebase";
import { doc, collection } from "firebase/firestore";
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates";

const SELLERS = ["DOUGLAS", "LEANDRO", "LUIZ", "MERCADOLIVRE", "PAMELA", "RODRIGO", "RONALDO", "THIAGO", "VINICIUS"];

const COMMON_SERVICES = [
  "LIMPEZA QUÍMICA POR ULTRASSOM",
  "TROCA DE CORREIA METÁLICA",
  "RETÍFICA DE POLIA PRIMÁRIA",
  "RETÍFICA DE POLIA SECUNDÁRIA",
  "TROCA DE ROLAMENTOS",
  "SUBSTITUIÇÃO DE VEDAÇÕES (KITS)",
  "CALIBRAÇÃO DE CORPO DE VÁLVULAS",
  "TESTE DE ESTANQUEIDADE",
  "PEÇA QUEBRADA SEM PODER REPARAR"
];

const QUALITY_CHECKS = [
  "ESTANQUEIDADE POSITIVA",
  "PRESSÃO DE LINHA ESTÁVEL",
  "AUSÊNCIA DE LIMALHA",
  "SENSORES DE ROTAÇÃO OK",
  "SOLENOIDES DENTRO DA FAIXA",
  "POLIAS SEM ESCORIAÇÕES",
  "CORPO DE VÁLVULAS CALIBRADO",
  "APROVADO EM TESTE DE BANCADA"
];

// Sub-componente extraído para evitar perda de foco ao digitar
interface TestSectionProps {
  title: string;
  prefix: 'pri' | 'sec';
  formData: any;
  handleNumericInput: (field: string, value: string) => void;
}

const TestSection = ({ title, prefix, formData, handleNumericInput }: TestSectionProps) => (
  <div className="space-y-6">
    <div className="flex items-center gap-2 border-l-4 border-accent pl-4">
      <h3 className="text-lg font-black text-primary uppercase tracking-tight">{title}</h3>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="border shadow-sm overflow-hidden bg-white">
        <div className="bg-muted/30 px-4 py-2 border-b flex justify-between items-center">
          <span className="text-[10px] font-black uppercase text-primary">Vácuo (INHG)</span>
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-bold text-muted-foreground">REF:</span>
            <Input 
              className="h-6 w-12 text-[10px] font-black p-1 text-center bg-white border-primary/20" 
              value={formData[`${prefix}VacRef`] || ""} 
              onChange={(e) => handleNumericInput(`${prefix}VacRef`, e.target.value)}
              maxLength={2}
            />
          </div>
        </div>
        <CardContent className="p-4 grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label className="text-[9px] font-bold uppercase text-orange-600">Entrada</Label>
            <Input 
              className="h-10 font-black bg-orange-50/50" 
              value={formData[`${prefix}VacAntes`] || ""} 
              onChange={(e) => handleNumericInput(`${prefix}VacAntes`, e.target.value)} 
              maxLength={2}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-[9px] font-bold uppercase text-emerald-600">Saída</Label>
            <Input 
              className="h-10 font-black bg-emerald-50/50" 
              value={formData[`${prefix}VacDepois`] || ""} 
              onChange={(e) => handleNumericInput(`${prefix}VacDepois`, e.target.value)} 
              maxLength={2}
            />
          </div>
        </CardContent>
      </Card>
      <Card className="border shadow-sm overflow-hidden bg-white">
        <div className="bg-muted/30 px-4 py-2 border-b flex justify-between items-center">
          <span className="text-[10px] font-black uppercase text-primary">Pressão (KPA)</span>
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-bold text-muted-foreground">REF:</span>
            <Input 
              className="h-6 w-14 text-[10px] font-black p-1 text-center bg-white border-primary/20" 
              value={formData[`${prefix}PresRef`] || ""} 
              onChange={(e) => handleNumericInput(`${prefix}PresRef`, e.target.value)}
              maxLength={4}
            />
          </div>
        </div>
        <CardContent className="p-4 grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label className="text-[9px] font-bold uppercase text-orange-600">Entrada</Label>
            <Input 
              className="h-10 font-black bg-orange-50/50" 
              value={formData[`${prefix}PresAntes`] || ""} 
              onChange={(e) => handleNumericInput(`${prefix}PresAntes`, e.target.value)} 
              maxLength={4}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-[9px] font-bold uppercase text-emerald-600">Saída</Label>
            <Input 
              className="h-10 font-black bg-emerald-50/50" 
              value={formData[`${prefix}PresDepois`] || ""} 
              onChange={(e) => handleNumericInput(`${prefix}PresDepois`, e.target.value)} 
              maxLength={4}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

export function QualityReportForm() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useUser();
  const db = useFirestore();
  
  const [activeTab, setActiveTab] = useState("identificacao");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [status, setStatus] = useState<'Budget' | 'InRecovery' | 'Published'>('Budget');
  
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
    selectedServices: [] as string[],
    selectedQualityChecks: [] as string[],
    additionalServices: "",
    qualityNotes: "UNIDADE APROVADA EM TESTE DE BANCADA COM PRESSÃO NOMINAL.",
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
  
  const userDocRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, "users", user.uid);
  }, [db, user?.uid]);
  
  const { data: currentUserDoc } = useDoc(userDocRef);
  const { data: existingReport, isLoading: isReportLoading } = useDoc(reportRef);

  useEffect(() => {
    if (existingReport) {
      setFormData(prev => ({ ...prev, ...existingReport }));
      setStatus(existingReport.status || 'Budget');
    }
  }, [existingReport]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNumericInput = (field: string, value: string) => {
    const numericValue = value.replace(/[^\d]/g, "");
    handleInputChange(field, numericValue);
  };

  const handleServiceToggle = (service: string) => {
    setFormData(prev => {
      const current = prev.selectedServices || [];
      const updated = current.includes(service)
        ? current.filter(s => s !== service)
        : [...current, service];
      return { ...prev, selectedServices: updated };
    });
  };

  const handleQualityCheckToggle = (check: string) => {
    setFormData(prev => {
      const current = prev.selectedQualityChecks || [];
      const updated = current.includes(check)
        ? current.filter(c => c !== check)
        : [...current, check];
      return { ...prev, selectedQualityChecks: updated };
    });
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
      technicianName: "DIEGO ROSA",
      reportNumber: formData.serialNumber !== "CF*" ? `QC-${formData.serialNumber.replace("CF*", "")}` : `QC-${Math.floor(Math.random() * 10000)}`,
      updatedAt: new Date().toISOString(),
      createdAt: formData.createdAt || new Date().toISOString()
    };

    setDocumentNonBlocking(finalRef, reportData, { merge: true });
    
    if (!reportId) {
      router.push(`/reports/${finalId}`);
      toast({ title: "Orçamento Criado", description: "O registro foi salvo na aba de orçamentos." });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center bg-white p-6 rounded-xl shadow-sm border gap-4 print:hidden">
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 p-3 rounded-lg border border-primary/20">
            {status === 'Published' ? <CheckCircle className="h-6 w-6 text-emerald-600" /> : status === 'InRecovery' ? <Wrench className="h-6 w-6 text-blue-600" /> : <FileText className="h-6 w-6 text-amber-600" />}
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-black text-primary uppercase tracking-tighter">Fluxo de Aprovação</h2>
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
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-black uppercase text-xs h-12 px-8 shadow-lg" onClick={() => { setStatus('InRecovery'); saveReport('InRecovery'); toast({ title: "Aprovado pelo Cliente" }); }}>
              <ThumbsUp className="h-4 w-4 mr-2" /> APROVAR E INICIAR RECUPERAÇÃO
            </Button>
          )}
          {status === 'InRecovery' && (
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase text-xs h-12 px-8 shadow-lg" onClick={() => { setStatus('Published'); saveReport('Published'); toast({ title: "Laudo Finalizado" }); }}>
              <CheckCircle2 className="h-4 w-4 mr-2" /> FINALIZAR E LIBERAR LAUDO
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
            <TabsTrigger value="identificacao" className="px-8 py-5 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:border-b-4 data-[state=active]:border-primary rounded-none font-black uppercase text-[10px] tracking-widest">
              1. Identificação
            </TabsTrigger>
            <TabsTrigger value="testes" className="px-8 py-5 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:border-b-4 data-[state=active]:border-primary rounded-none font-black uppercase text-[10px] tracking-widest">
              2. Testes
            </TabsTrigger>
            <TabsTrigger value="servicos" className="px-8 py-5 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:border-b-4 data-[state=active]:border-primary rounded-none font-black uppercase text-[10px] tracking-widest">
              3. Serviços
            </TabsTrigger>
            <TabsTrigger value="qualidade" className="px-8 py-5 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:border-b-4 data-[state=active]:border-primary rounded-none font-black uppercase text-[10px] tracking-widest">
              4. Qualidade
            </TabsTrigger>
            <TabsTrigger value="garantia" className="px-8 py-5 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:border-b-4 data-[state=active]:border-primary rounded-none font-black uppercase text-[10px] tracking-widest">
              5. Garantia
            </TabsTrigger>
          </TabsList>

          <CardContent className="p-8 space-y-12 print:p-0 print:space-y-8">
            <div className="hidden print:block border-b-4 border-primary pb-8 mb-8">
              <div className="flex justify-between items-end">
                <div>
                  <h1 className="text-4xl font-black text-primary tracking-tighter uppercase leading-none">Certificado de Qualidade CVT</h1>
                  <p className="text-[10px] font-bold text-accent tracking-[0.4em] uppercase mt-4">Relatório Técnico Industrial Nº {formData.serialNumber.replace("CF*", "")}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black text-primary uppercase">CERTIFICA LAUDO CVT</p>
                  <p className="text-[9px] font-bold text-muted-foreground uppercase">Terminal de Alta Precisão</p>
                </div>
              </div>
            </div>

            <TabsContent value="identificacao" className="mt-0 space-y-12">
              <section className="space-y-8">
                <div className="flex justify-between items-center border-b pb-4">
                  <h3 className="text-xl font-black text-primary uppercase tracking-tight flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-accent" /> Identificação Industrial
                  </h3>
                  <div className="print:hidden">
                    <Button onClick={handleAiAssist} disabled={isAiLoading} variant="outline" className="gap-2 border-accent/20 text-accent font-black h-10 px-6">
                      {isAiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} IA ASSIST
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-muted-foreground">Cliente / Parceiro</Label>
                    <Input className="h-12 font-black uppercase" value={formData.clientName} onChange={(e) => handleInputChange('clientName', e.target.value.toUpperCase())} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-muted-foreground">Vendedor</Label>
                    <Select value={formData.sellerName} onValueChange={(v) => handleInputChange('sellerName', v)}>
                      <SelectTrigger className="h-12 font-black"><SelectValue placeholder="Selecione o vendedor" /></SelectTrigger>
                      <SelectContent>{SELLERS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-accent">Valor Total (R$)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-accent" />
                      <Input className="h-12 pl-10 font-black text-lg" value={formData.value} onChange={(e) => handleNumericInput('value', e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-muted-foreground">Tipo de Operação</Label>
                    <Select value={formData.operationType} onValueChange={(v) => handleInputChange('operationType', v as 'recovery' | 'sale')}>
                      <SelectTrigger className="h-12 font-black"><SelectValue placeholder="Selecione a operação" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="recovery">RECUPERAÇÃO</SelectItem>
                        <SelectItem value="sale">VENDA</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-muted-foreground">Modelo Conjunto</Label>
                    <Input className="h-12 font-black uppercase" value={formData.equipmentType} onChange={(e) => handleInputChange('equipmentType', e.target.value.toUpperCase())} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-muted-foreground">Número de Série</Label>
                    <Input className="h-12 font-black uppercase" value={formData.serialNumber} onChange={(e) => handleInputChange('serialNumber', e.target.value.toUpperCase())} />
                  </div>
                </div>
              </section>
            </TabsContent>

            <TabsContent value="testes" className="mt-0 space-y-12">
              <section className="space-y-12">
                <TestSection 
                  title="Polia Primária (Hydraulic Unit)" 
                  prefix="pri" 
                  formData={formData} 
                  handleNumericInput={handleNumericInput} 
                />
                <TestSection 
                  title="Polia Secundária (Hydraulic Unit)" 
                  prefix="sec" 
                  formData={formData} 
                  handleNumericInput={handleNumericInput} 
                />
              </section>
            </TabsContent>

            <TabsContent value="servicos" className="mt-0 space-y-8">
              <section className="space-y-6">
                <div className="flex items-center gap-2 border-b pb-4">
                  <Wrench className="h-6 w-6 text-accent" />
                  <h3 className="text-xl font-black text-primary uppercase tracking-tight">Serviços Executados</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {COMMON_SERVICES.map((service) => (
                    <div key={service} className="flex items-center space-x-3 p-4 border rounded-xl hover:bg-accent/5 transition-colors cursor-pointer" onClick={() => handleServiceToggle(service)}>
                      <Checkbox 
                        id={service} 
                        checked={(formData.selectedServices || []).includes(service)}
                        onCheckedChange={() => handleServiceToggle(service)}
                      />
                      <Label htmlFor={service} className="text-[10px] font-black uppercase cursor-pointer leading-tight">{service}</Label>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 pt-6">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground">Informações Adicionais / Observações Técnicas</Label>
                  <Textarea 
                    className="min-h-[150px] font-bold text-primary p-6 bg-muted/20 border-primary/10" 
                    placeholder="Descreva detalhes específicos ou serviços não listados acima..."
                    value={formData.additionalServices}
                    onChange={(e) => handleInputChange('additionalServices', e.target.value)}
                  />
                </div>
              </section>
            </TabsContent>

            <TabsContent value="qualidade" className="mt-0 space-y-8">
              <section className="space-y-6">
                <div className="flex items-center gap-2 border-b pb-4">
                  <ClipboardCheck className="h-6 w-6 text-accent" />
                  <h3 className="text-xl font-black text-primary uppercase tracking-tight">Parecer de Qualidade</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {QUALITY_CHECKS.map((check) => (
                    <div key={check} className="flex items-center space-x-3 p-4 border rounded-xl hover:bg-accent/5 transition-colors cursor-pointer" onClick={() => handleQualityCheckToggle(check)}>
                      <Checkbox 
                        id={check} 
                        checked={(formData.selectedQualityChecks || []).includes(check)}
                        onCheckedChange={() => handleQualityCheckToggle(check)}
                      />
                      <Label htmlFor={check} className="text-[10px] font-black uppercase cursor-pointer leading-tight">{check}</Label>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground">Observações de Validação Técnica</Label>
                  <Textarea 
                    className="min-h-[250px] font-bold text-primary p-6 bg-muted/20 border-primary/10" 
                    value={formData.qualityNotes}
                    onChange={(e) => handleInputChange('qualityNotes', e.target.value)}
                  />
                </div>
              </section>
            </TabsContent>

            <TabsContent value="garantia" className="mt-0">
              <section className="space-y-8">
                <Card className="bg-[#0B1A2B] text-white p-12 rounded-[2.5rem] text-center border-none shadow-2xl">
                  <Award className="h-16 w-16 text-accent mx-auto mb-6" />
                  <h4 className="text-3xl font-black uppercase text-accent mb-4 tracking-tighter">GARANTIA TÉCNICA CERTIFICA</h4>
                  <p className="text-white/80 font-bold max-w-xl mx-auto mb-8 text-lg">Unidade CVT testada e validada sob pressão nominal. Garantia de 03 meses exclusiva para o serviço executado conforme registro.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-white/10">
                    <div className="text-center">
                      <div className="h-px w-48 bg-white/20 mx-auto mb-3" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-accent">Responsável Técnico</p>
                      <p className="font-black text-sm uppercase mt-1">
                        DIEGO ROSA
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="h-px w-48 bg-white/20 mx-auto mb-3" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-accent">Data de Emissão</p>
                      <p className="font-black text-sm mt-1">{new Date().toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>
                </Card>
              </section>
            </TabsContent>

            <div className="hidden print:block space-y-12 border-t-2 pt-12">
               <div className="grid grid-cols-2 gap-12">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-muted-foreground uppercase">Cliente Industrial</p>
                    <p className="font-black text-primary uppercase border-b pb-1">{formData.clientName}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-muted-foreground uppercase">Vendedor Responsável</p>
                    <p className="font-black text-primary uppercase border-b pb-1">{formData.sellerName}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-muted-foreground uppercase">Equipamento / Modelo</p>
                    <p className="font-black text-primary uppercase border-b pb-1">{formData.equipmentType} - {formData.model}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-muted-foreground uppercase">Operação / Certificação</p>
                    <p className="font-black text-accent uppercase border-b pb-1">
                      {formData.operationType === 'sale' ? 'VENDA' : 'RECUPERAÇÃO'} - QC-CVT-VALIDATED
                    </p>
                  </div>
               </div>

               <div className="space-y-4">
                  <h4 className="font-black text-primary uppercase text-sm border-l-4 border-accent pl-2">Laudo de Testes Hidráulicos</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border p-4 rounded-lg bg-muted/10">
                      <p className="text-[9px] font-black uppercase mb-2">Primária (Vac/Pres)</p>
                      <p className="text-xs font-bold">In: {formData.priVacAntes}/{formData.priPresAntes} | Out: {formData.priVacDepois}/{formData.priPresDepois}</p>
                    </div>
                    <div className="border p-4 rounded-lg bg-muted/10">
                      <p className="text-[9px] font-black uppercase mb-2">Secundária (Vac/Pres)</p>
                      <p className="text-xs font-bold">In: {formData.secVacAntes}/{formData.secPresAntes} | Out: {formData.secVacDepois}/{formData.secPresDepois}</p>
                    </div>
                  </div>
               </div>

               <div className="space-y-4">
                  <h4 className="font-black text-primary uppercase text-sm border-l-4 border-accent pl-2">Serviços e Qualidade</h4>
                  <div className="p-6 border rounded-xl bg-muted/5 min-h-[100px]">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {formData.selectedServices?.map(s => (
                        <Badge key={s} variant="outline" className="border-accent text-accent font-black text-[8px] uppercase">{s}</Badge>
                      ))}
                      {formData.selectedQualityChecks?.map(c => (
                        <Badge key={c} variant="outline" className="border-emerald-600 text-emerald-600 font-black text-[8px] uppercase">{c}</Badge>
                      ))}
                    </div>
                    <p className="text-[10px] font-bold text-primary whitespace-pre-wrap">{formData.additionalServices || "Nenhum serviço extra listado."}</p>
                    <p className="text-[10px] font-black text-accent mt-4 border-t pt-2">{formData.qualityNotes}</p>
                  </div>
               </div>

               <div className="mt-12 text-center pt-8">
                  <Zap className="h-8 w-8 text-accent mx-auto mb-2 opacity-30" />
                  <p className="text-[8px] font-black text-muted-foreground uppercase tracking-[0.5em]">AUTENTICIDADE VALIDADA POR DIEGO ROSA - TERMINAL CERTIFICA LAUDO CVT</p>
               </div>
            </div>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
}

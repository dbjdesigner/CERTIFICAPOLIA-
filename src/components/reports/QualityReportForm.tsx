
"use client";

import React, { useState } from "react";
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
  Plus
} from "lucide-react";
import { aiAssistedDataEntry } from "@/ai/flows/ai-assisted-data-entry-flow";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

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
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("identificacao");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [showCustomModel, setShowCustomModel] = useState(false);
  
  const [formData, setFormData] = useState({
    equipmentType: "JF011",
    customEquipmentType: "",
    model: "MODELO_CVT_2026",
    manufacturer: "BRAZILIAN_SYSTEMS",
    serialNumber: "CF*",
    clientName: "",
    sellerName: "",
    clientInfo: "",
    operationType: "recovery" as 'recovery' | 'sale',
    value: "",
    partialDescription: "",
    // Polia Primaria
    priVacRef: "-24",
    priVacAntes: "",
    priVacDepois: "",
    priPresRef: "510",
    priPresAntes: "",
    priPresDepois: "",
    // Polia Secundaria
    secVacRef: "-24",
    secVacAntes: "",
    secVacDepois: "",
    secPresRef: "510",
    secPresAntes: "",
    secPresDepois: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

  const handleApproveBudget = () => {
    setIsApproved(true);
    toast({
      title: "Orçamento Aprovado",
      description: "O registro agora está liberado para execução e certificação.",
    });
  };

  const TestSection = ({ title, prefix }: { title: string, prefix: 'pri' | 'sec' }) => (
    <div className="space-y-6">
      <div className="flex items-center gap-2 border-l-4 border-accent pl-4">
        <h3 className="text-lg font-black text-primary uppercase tracking-tight">{title}</h3>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Teste de Vácuo */}
        <Card className="border shadow-sm overflow-hidden">
          <div className="bg-muted/30 px-4 py-2 border-b flex justify-between items-center">
            <span className="text-[10px] font-black uppercase text-primary">Vácuo (INHG)</span>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-bold text-muted-foreground uppercase">Referência:</span>
              <Input 
                className="h-6 w-16 text-[10px] font-black bg-white border-accent/30 text-center" 
                value={formData[`${prefix}VacRef` as keyof typeof formData]}
                onChange={(e) => handleInputChange(`${prefix}VacRef`, e.target.value)}
              />
            </div>
          </div>
          <CardContent className="p-4 grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-[9px] font-bold uppercase text-muted-foreground text-orange-600">Antes da Recuperação</Label>
              <div className="relative">
                <Input 
                  placeholder="0.0"
                  className="h-10 font-black bg-orange-50/50 border-orange-200 pr-10" 
                  value={formData[`${prefix}VacAntes` as keyof typeof formData]}
                  onChange={(e) => handleInputChange(`${prefix}VacAntes`, e.target.value)}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[8px] font-black text-muted-foreground">INHG</span>
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-[9px] font-bold uppercase text-muted-foreground text-emerald-600">Depois da Recuperação</Label>
              <div className="relative">
                <Input 
                  placeholder="0.0"
                  className="h-10 font-black bg-emerald-50/50 border-emerald-200 pr-10" 
                  value={formData[`${prefix}VacDepois` as keyof typeof formData]}
                  onChange={(e) => handleInputChange(`${prefix}VacDepois`, e.target.value)}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[8px] font-black text-muted-foreground">INHG</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Teste de Pressão */}
        <Card className="border shadow-sm overflow-hidden">
          <div className="bg-muted/30 px-4 py-2 border-b flex justify-between items-center">
            <span className="text-[10px] font-black uppercase text-primary">Pressão (KPA)</span>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-bold text-muted-foreground uppercase">Referência:</span>
              <Input 
                className="h-6 w-16 text-[10px] font-black bg-white border-accent/30 text-center" 
                value={formData[`${prefix}PresRef` as keyof typeof formData]}
                onChange={(e) => handleInputChange(`${prefix}PresRef`, e.target.value)}
              />
            </div>
          </div>
          <CardContent className="p-4 grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-[9px] font-bold uppercase text-muted-foreground text-orange-600">Antes da Recuperação</Label>
              <div className="relative">
                <Input 
                  placeholder="0.0"
                  className="h-10 font-black bg-orange-50/50 border-orange-200 pr-10" 
                  value={formData[`${prefix}PresAntes` as keyof typeof formData]}
                  onChange={(e) => handleInputChange(`${prefix}PresAntes`, e.target.value)}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[8px] font-black text-muted-foreground">KPA</span>
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-[9px] font-bold uppercase text-muted-foreground text-emerald-600">Depois da Recuperação</Label>
              <div className="relative">
                <Input 
                  placeholder="0.0"
                  className="h-10 font-black bg-emerald-50/50 border-emerald-200 pr-10" 
                  value={formData[`${prefix}PresDepois` as keyof typeof formData]}
                  onChange={(e) => handleInputChange(`${prefix}PresDepois`, e.target.value)}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[8px] font-black text-muted-foreground">KPA</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border">
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 p-3 rounded-lg border border-primary/20">
            <Award className="h-6 w-6 text-primary" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-primary uppercase tracking-tighter">Certificação de Qualidade CVT</h2>
              <Badge 
                variant={isApproved ? "default" : "outline"} 
                className={isApproved ? "bg-emerald-500 text-white border-none font-black text-[10px] uppercase" : "border-amber-500 text-amber-600 font-black text-[10px] uppercase"}
              >
                {isApproved ? "APROVADO" : "ORÇAMENTO PENDENTE"}
              </Badge>
            </div>
            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Responsável Técnico: <span className="text-accent">DIEGO</span></p>
          </div>
        </div>
        <div className="flex gap-3">
          {!isApproved && (
            <Button 
              variant="outline"
              className="border-amber-500 text-amber-600 hover:bg-amber-50 gap-2 font-black uppercase text-xs h-12 px-6"
              onClick={handleApproveBudget}
            >
              <ThumbsUp className="h-4 w-4" />
              APROVAR ORÇAMENTO
            </Button>
          )}
          <Button 
            className="bg-primary hover:bg-primary/90 text-white gap-2 font-black uppercase text-xs h-12 px-8 shadow-lg transition-all hover:scale-105"
            onClick={() => toast({ title: "Laudo Sincronizado", description: "O registro foi salvo com sucesso no banco de dados." })}
          >
            <Save className="h-4 w-4" />
            {isApproved ? "ARQUIVAR NO BANCO" : "SALVAR RASCUNHO"}
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
              { id: "garantia", label: "5. Garantia" },
              { id: "midia", label: "6. Anexos" }
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
                  <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Valor do Serviço (R$)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="0,00" 
                      className="h-12 border-primary/10 font-black bg-muted/5 pl-10"
                      value={formData.value}
                      onChange={(e) => handleInputChange('value', e.target.value)}
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
                      <SelectItem value="recovery" className="font-black">RECUPERAÇÃO TÉCNICA</SelectItem>
                      <SelectItem value="sale" className="font-black">VENDA TÉCNICA</SelectItem>
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

              {formData.operationType && (
                <div className="bg-muted/10 p-6 rounded-2xl border border-dashed border-primary/10 animate-in fade-in slide-in-from-top-4">
                  <div className="flex items-center gap-3 mb-4">
                    <ClipboardCheck className="h-5 w-5 text-accent" />
                    <h4 className="font-black text-primary uppercase text-sm tracking-tight">Detalhes do Fluxo: {formData.operationType === 'recovery' ? 'RECUPERAÇÃO' : 'VENDA'}</h4>
                  </div>
                  <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                    {formData.operationType === 'recovery' 
                      ? "Fluxo focado na análise de entrada, testes hidráulicos comparativos e certificação de performance nominal pós-manutenção."
                      : "Fluxo focado na validação de saída, configuração conforme especificações de venda e emissão de termo de garantia de montagem."}
                  </p>
                </div>
              )}
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
              <div className="flex items-center gap-3 text-primary border-b pb-4">
                <Award className="h-6 w-6 text-accent" />
                <h3 className="text-xl font-black text-primary uppercase tracking-tighter">Certificado de Garantia</h3>
              </div>
              
              <Card className="border-4 border-accent/20 rounded-[2.5rem] overflow-hidden shadow-2xl bg-[#0B1A2B] text-white p-12 relative">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <ShieldCheck className="h-48 w-48 text-accent" />
                </div>
                <div className="space-y-10 relative z-10 text-center max-w-3xl mx-auto">
                  <div className="space-y-4">
                    <h4 className="text-4xl font-black uppercase tracking-tighter text-accent">GARANTIA DE ALTA PRECISÃO</h4>
                    <p className="text-lg font-bold text-white/80 leading-relaxed">
                      Este laudo técnico certifica que a unidade industrial CVT passou por rigorosos processos de recuperação e testes hidráulicos, atingindo os padrões nominais de performance.
                    </p>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-md p-10 rounded-[2rem] border border-white/10 space-y-6">
                    <div className="flex flex-col items-center gap-4">
                      <Calendar className="h-10 w-10 text-accent" />
                      <p className="text-3xl font-black uppercase tracking-widest">
                        VALIDADE: <span className="text-accent underline decoration-white/20 underline-offset-8">03 MESES</span>
                      </p>
                    </div>
                    <div className="h-px bg-white/20 w-full" />
                    <p className="text-sm font-bold text-white/60 uppercase tracking-widest leading-loose">
                      A garantia cobre exclusivamente o <span className="text-white">SERVIÇO EXECUTADO</span> e a <span className="text-white">MONTAGEM TÉCNICA</span> realizada. Danos por uso indevido ou contaminação externa não são cobertos.
                    </p>
                  </div>

                  <div className="pt-6">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-64 h-px bg-accent/50 mb-4" />
                      <p className="text-xl font-black uppercase tracking-tighter">DIEGO</p>
                      <p className="text-[10px] font-black text-accent uppercase tracking-[0.3em]">RESPONSÁVEL TÉCNICO CERTIFICADO</p>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="midia" className="mt-0 space-y-8">
              <div className="flex justify-between items-center border-b pb-4">
                <h3 className="text-xl font-black text-primary uppercase tracking-tighter flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-accent" />
                  Galeria de Evidências Técnicas
                </h3>
                <Button variant="outline" className="gap-2 font-black uppercase text-[10px] border-primary/20 h-10 px-6">
                  <ImageIcon className="h-4 w-4" /> ANEXAR FOTO/VÍDEO
                </Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="aspect-square bg-muted/20 rounded-[2rem] border-2 border-dashed border-muted-foreground/20 flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/30 transition-all cursor-pointer group shadow-inner">
                    <ImageIcon className="h-10 w-10 mb-2 opacity-20 group-hover:opacity-100 transition-opacity" />
                    <span className="text-[9px] font-black uppercase tracking-widest">FOTO {n}</span>
                  </div>
                ))}
                <div className="aspect-square border-2 border-dashed rounded-[2rem] flex items-center justify-center text-muted-foreground hover:bg-accent/5 cursor-pointer border-accent/30 bg-accent/5 transition-all shadow-sm group">
                  <div className="flex flex-col items-center gap-2">
                    <div className="bg-accent/10 p-4 rounded-full group-hover:bg-accent group-hover:text-white transition-all">
                      <Activity className="h-6 w-6" />
                    </div>
                    <span className="text-[10px] font-black text-accent uppercase tracking-widest">ADICIONAR</span>
                  </div>
                </div>
              </div>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>

      <footer className="py-12 text-center border-t mt-16 bg-muted/5 rounded-t-[3rem]">
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-3 mb-2">
            <ShieldCheck className="h-6 w-6 text-accent" />
            <p className="text-[11px] font-black text-primary uppercase tracking-[0.4em]">
              © 2024 CERTIFICA LAUDO CVT | SISTEMA DE ALTA PRECISÃO INDUSTRIAL
            </p>
          </div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            Responsável Técnico: <span className="text-accent font-black">DIEGO</span> | Versão de Engenharia: V1.5.0-PRO
          </p>
          <div className="flex gap-4 mt-4">
            <div className="bg-emerald-500/10 text-emerald-600 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-tighter">CONEXÃO SEGURA AES-256</div>
            <div className="bg-accent/10 text-accent px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-tighter">SISTEMA VALIDADO</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

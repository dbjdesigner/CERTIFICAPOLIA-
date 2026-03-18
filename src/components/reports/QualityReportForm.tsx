
"use client";

import React, { useState } from "react";
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
  ClipboardCheck, 
  ImageIcon, 
  Sparkles,
  Save,
  Loader2,
  Activity,
  ShieldCheck,
  ArrowRightLeft
} from "lucide-react";
import { aiAssistedDataEntry } from "@/ai/flows/ai-assisted-data-entry-flow";
import { useToast } from "@/hooks/use-toast";

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

export function QualityReportForm() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("identificacao");
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    equipmentType: "Unidade CVT Industrial",
    model: "MODELO_CVT_2026",
    manufacturer: "BRAZILIAN_SYSTEMS",
    serialNumber: "SN-9988-CVT",
    clientName: "",
    sellerName: "",
    clientInfo: "",
    operationType: "maintenance" as any,
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
    if (!formData.equipmentType && !formData.partialDescription) {
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
        equipmentType: formData.equipmentType,
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
            <span className="text-[10px] font-bold text-muted-foreground uppercase">Referência: {formData[`${prefix}VacRef` as keyof typeof formData]}</span>
          </div>
          <CardContent className="p-4 grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <Label className="text-[9px] font-bold uppercase text-muted-foreground">Mínimo Ref.</Label>
              <Input 
                className="h-9 font-bold border-accent/20" 
                value={formData[`${prefix}VacRef` as keyof typeof formData]}
                onChange={(e) => handleInputChange(`${prefix}VacRef`, e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[9px] font-bold uppercase text-muted-foreground text-orange-600">Antes</Label>
              <Input 
                placeholder="0.0"
                className="h-9 font-black bg-orange-50/50 border-orange-200" 
                value={formData[`${prefix}VacAntes` as keyof typeof formData]}
                onChange={(e) => handleInputChange(`${prefix}VacAntes`, e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[9px] font-bold uppercase text-muted-foreground text-emerald-600">Depois</Label>
              <Input 
                placeholder="0.0"
                className="h-9 font-black bg-emerald-50/50 border-emerald-200" 
                value={formData[`${prefix}VacDepois` as keyof typeof formData]}
                onChange={(e) => handleInputChange(`${prefix}VacDepois`, e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Teste de Pressão */}
        <Card className="border shadow-sm overflow-hidden">
          <div className="bg-muted/30 px-4 py-2 border-b flex justify-between items-center">
            <span className="text-[10px] font-black uppercase text-primary">Pressão (KPA)</span>
            <span className="text-[10px] font-bold text-muted-foreground uppercase">Referência: {formData[`${prefix}PresRef` as keyof typeof formData]}</span>
          </div>
          <CardContent className="p-4 grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <Label className="text-[9px] font-bold uppercase text-muted-foreground">Nominal Ref.</Label>
              <Input 
                className="h-9 font-bold border-accent/20" 
                value={formData[`${prefix}PresRef` as keyof typeof formData]}
                onChange={(e) => handleInputChange(`${prefix}PresRef`, e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[9px] font-bold uppercase text-muted-foreground text-orange-600">Antes</Label>
              <Input 
                placeholder="0.0"
                className="h-9 font-black bg-orange-50/50 border-orange-200" 
                value={formData[`${prefix}PresAntes` as keyof typeof formData]}
                onChange={(e) => handleInputChange(`${prefix}PresAntes`, e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[9px] font-bold uppercase text-muted-foreground text-emerald-600">Depois</Label>
              <Input 
                placeholder="0.0"
                className="h-9 font-black bg-emerald-50/50 border-emerald-200" 
                value={formData[`${prefix}PresDepois` as keyof typeof formData]}
                onChange={(e) => handleInputChange(`${prefix}PresDepois`, e.target.value)}
              />
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
          <div className="bg-primary/10 p-3 rounded-lg">
            <ClipboardCheck className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-primary uppercase">Registro de Certificação</h2>
            <p className="text-sm text-muted-foreground font-medium">Resp. Técnico: <span className="text-accent font-black uppercase">DIEGO</span></p>
          </div>
        </div>
        <Button 
          className="bg-primary hover:bg-primary/90 text-white gap-2 font-black uppercase text-xs h-12 px-6"
          onClick={() => toast({ title: "Laudo Salvo", description: "O registro foi sincronizado com sucesso." })}
        >
          <Save className="h-4 w-4" />
          SALVAR LAUDO NO BANCO
        </Button>
      </div>

      <Card className="border-none shadow-lg overflow-hidden bg-white">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start h-auto p-0 bg-muted/50 rounded-none border-b overflow-x-auto">
            {[
              { id: "identificacao", label: "Identificação" },
              { id: "testes", label: "Testes Hidráulicos" },
              { id: "servicos", label: "Serviços & Peças" },
              { id: "qualidade", label: "Controle Final" },
              { id: "midia", label: "Anexos" }
            ].map((tab) => (
              <TabsTrigger 
                key={tab.id}
                value={tab.id} 
                className="px-8 py-4 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none font-black uppercase text-[10px] tracking-widest transition-all"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <CardContent className="p-8">
            <TabsContent value="identificacao" className="mt-0 space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-black text-primary uppercase tracking-tight">Dados da Unidade CVT</h3>
                <Button 
                  onClick={handleAiAssist} 
                  disabled={isAiLoading}
                  variant="outline"
                  className="gap-2 border-primary/20 text-primary font-bold h-10 px-4"
                >
                  {isAiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 text-accent" />}
                  IA ASSISTANT
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Nome do Cliente</Label>
                  <Input 
                    placeholder="CLIENTE S/A" 
                    className="h-12 border-primary/10 focus:border-primary font-bold uppercase"
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
                    <SelectTrigger className="h-12 border-primary/10 font-bold">
                      <SelectValue placeholder="Selecione o Vendedor" />
                    </SelectTrigger>
                    <SelectContent>
                      {SELLERS.map(seller => (
                        <SelectItem key={seller} value={seller} className="font-bold">{seller}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Conjunto CVT</Label>
                  <Input 
                    placeholder="CONJUNTO CVT" 
                    className="h-12 border-primary/10 font-bold uppercase"
                    value={formData.equipmentType}
                    onChange={(e) => handleInputChange('equipmentType', e.target.value)}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="testes" className="mt-0 space-y-12">
              <div className="flex items-center gap-3 text-primary">
                <Activity className="h-6 w-6 text-accent" />
                <h3 className="text-xl font-black uppercase tracking-tighter">Comparativo de Performance Hidráulica</h3>
              </div>
              
              <div className="space-y-12">
                <TestSection title="Polia Primária" prefix="pri" />
                <div className="border-t border-dashed" />
                <TestSection title="Polia Secundária" prefix="sec" />
              </div>
            </TabsContent>

            <TabsContent value="servicos" className="mt-0 space-y-6">
              <div className="flex items-center gap-3 text-primary mb-4">
                <ShieldCheck className="h-6 w-6 text-accent" />
                <h3 className="text-lg font-black uppercase tracking-tight">Módulos de Manutenção Executados</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  "INSPEÇÃO VISUAL COMPLETA",
                  "LIMPEZA POR ULTRASSOM",
                  "POLIMENTO DE POLIAS (ESPECIAL)",
                  "SUBSTITUIÇÃO DE VEDAÇÕES",
                  "TESTE DE ESTANQUEIDADE",
                  "CALIBRAÇÃO DE PRESSÃO",
                  "GRAVAÇÃO DE NÚMERO DE SÉRIE",
                  "REVESTIMENTO TÉCNICO",
                  "MONTGEM COM TORQUE CONTROLADO"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 border rounded-xl hover:bg-accent/5 transition-colors group cursor-pointer">
                    <input type="checkbox" className="h-5 w-5 rounded border-primary accent-primary" id={`svc-${i}`} />
                    <Label htmlFor={`svc-${i}`} className="font-bold text-[10px] uppercase cursor-pointer group-hover:text-primary transition-colors">{item}</Label>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="qualidade" className="mt-0 space-y-6">
              <h3 className="text-lg font-black text-primary uppercase">Checklist de Aprovação Final</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "CONFORMIDADE DIMENSIONAL OK",
                  "VALORES DE VÁCUO DENTRO DA REF.",
                  "VALORES DE PRESSÃO DENTRO DA REF.",
                  "IDENTIFICAÇÃO VISÍVEL E CORRETA"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-5 bg-muted/20 rounded-xl border border-transparent hover:border-accent/30 transition-all">
                    <input type="checkbox" className="h-5 w-5 accent-accent" id={`chk-${i}`} />
                    <Label htmlFor={`chk-${i}`} className="font-black text-[10px] uppercase tracking-wide">{item}</Label>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="midia" className="mt-0 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-black text-primary uppercase">Galeria de Evidências Técnicas</h3>
                <Button variant="outline" className="gap-2 font-black uppercase text-[10px] border-primary/20">
                  <ImageIcon className="h-4 w-4" /> ANEXAR FOTO/VÍDEO
                </Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="aspect-square bg-muted/30 rounded-xl border-2 border-dashed border-muted-foreground/20 flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/50 transition-all cursor-pointer group">
                    <ImageIcon className="h-8 w-8 mb-2 opacity-20 group-hover:opacity-100 transition-opacity" />
                    <span className="text-[9px] font-black uppercase">FOTO {n}</span>
                  </div>
                ))}
                <div className="aspect-square border-2 border-dashed rounded-xl flex items-center justify-center text-muted-foreground hover:bg-muted/50 cursor-pointer border-accent/30 bg-accent/5">
                  <span className="text-[10px] font-black text-accent uppercase">ADICIONAR</span>
                </div>
              </div>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>

      <footer className="py-8 text-center border-t mt-12">
        <div className="flex flex-col items-center gap-2">
          <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">
            © 2024 CERTIFICA LAUDO CVT | SISTEMA DE ALTA PRECISÃO
          </p>
          <p className="text-[9px] font-bold text-muted-foreground uppercase">
            Responsável Técnico: <span className="text-accent">DIEGO</span> | V1.2.0-PRO
          </p>
        </div>
      </footer>
    </div>
  );
}

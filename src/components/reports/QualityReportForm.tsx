"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  ClipboardCheck, 
  Hammer, 
  ShieldCheck, 
  Image as ImageIcon, 
  FileCheck, 
  Info,
  Sparkles,
  Save,
  Loader2,
  Trash2,
  CheckCircle,
  XCircle,
  Archive,
  PlusCircle,
  AlertTriangle,
  Fingerprint,
  Activity,
  FileText,
  BarChart3,
  Wrench
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

export function QualityReportForm() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("identificacao");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
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
    specifications: [] as string[],
    testProcedures: [] as string[]
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
          manufacturer: result.suggestedEquipmentDetails?.manufacturer || prev.manufacturer,
          specifications: result.suggestedEquipmentDetails?.specifications || prev.specifications
        }));
      }

      toast({
        title: "Processamento Concluído",
        description: `Dados CVT sugeridos com alta precisão.`,
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

  return (
    <div className="space-y-6">
      {/* Dark Header Action Bar */}
      <div className="bg-[#0B1A2B] rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl border-b-4 border-accent">
        <div className="flex items-center gap-4">
          <div className="bg-white/10 p-3 rounded-xl border border-white/10">
            <ShieldCheck className="h-6 w-6 text-accent" />
          </div>
          <div>
            <p className="text-[10px] font-black text-accent uppercase tracking-[0.3em] leading-none mb-1">CERTIFICA LAUDO CVT</p>
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">ARQUIVAR NO BANCO DE DADOS</h2>
          </div>
        </div>
        
        <div className="flex flex-1 max-w-sm">
          <Input className="bg-white h-12 rounded-xl border-none shadow-inner font-bold text-primary" placeholder="REF_TECNICA_2026" />
        </div>

        <Button 
          className="bg-accent hover:bg-accent/90 text-primary font-black h-12 px-8 rounded-xl gap-2 transition-all hover:scale-105 active:scale-95 uppercase tracking-tight shadow-lg"
          onClick={() => toast({ title: "Registro Salvo", description: "O laudo CVT foi sincronizado com sucesso." })}
        >
          <Save className="h-5 w-5" />
          SALVAR REGISTRO
        </Button>
      </div>

      <Card className="border-none shadow-2xl overflow-hidden bg-white rounded-2xl">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full flex h-auto p-1 bg-muted/20 rounded-none border-b">
            {["identificacao", "testes", "servicos", "qualidade", "midia", "garantia"].map((tab) => (
              <TabsTrigger 
                key={tab}
                value={tab} 
                className="flex-1 py-5 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:border-b-4 data-[state=active]:border-accent rounded-none transition-all"
              >
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">{tab === "servicos" ? "SERVIÇOS" : tab}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <CardContent className="p-10">
            <TabsContent value="identificacao" className="mt-0 space-y-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-black text-primary uppercase tracking-tight">IDENTIFICAÇÃO DA UNIDADE CVT</h2>
                  <p className="text-sm text-muted-foreground font-medium">Dados técnicos e comerciais para certificação industrial.</p>
                </div>
                <Button 
                  onClick={handleAiAssist} 
                  disabled={isAiLoading}
                  className="bg-primary hover:bg-primary/90 text-white gap-2 shadow-lg h-12 px-6 font-black uppercase text-[10px] tracking-widest"
                >
                  {isAiLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5 text-accent" />}
                  ASSISTÊNCIA IA
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="space-y-3">
                  <Label className="font-black text-[10px] uppercase tracking-widest text-muted-foreground">Nome do Cliente</Label>
                  <Input 
                    placeholder="Ex: Mineração Vale" 
                    className="h-14 border-primary/10 focus:border-accent font-black text-primary bg-muted/5 uppercase"
                    value={formData.clientName}
                    onChange={(e) => handleInputChange('clientName', e.target.value)}
                  />
                </div>
                <div className="space-y-3">
                  <Label className="font-black text-[10px] uppercase tracking-widest text-muted-foreground">Vendedor Responsável</Label>
                  <Select 
                    value={formData.sellerName} 
                    onValueChange={(value) => handleInputChange('sellerName', value)}
                  >
                    <SelectTrigger className="h-14 border-primary/10 focus:ring-accent font-black text-primary bg-muted/5 uppercase">
                      <SelectValue placeholder="Selecione o Vendedor" />
                    </SelectTrigger>
                    <SelectContent>
                      {SELLERS.map(seller => (
                        <SelectItem key={seller} value={seller} className="font-bold">{seller}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label className="font-black text-[10px] uppercase tracking-widest text-muted-foreground">Tipo de Conjunto</Label>
                  <Input 
                    placeholder="Ex: CVT Heavy Duty" 
                    className="h-14 border-primary/10 focus:border-accent font-black text-primary bg-muted/5"
                    value={formData.equipmentType}
                    onChange={(e) => handleInputChange('equipmentType', e.target.value)}
                  />
                </div>
                <div className="space-y-3">
                  <Label className="font-black text-[10px] uppercase tracking-widest text-muted-foreground">Modelo / Tag CVT</Label>
                  <Input 
                    placeholder="Ex: CVT-G3-2026" 
                    className="h-14 border-primary/10 focus:border-accent font-black text-primary bg-muted/5"
                    value={formData.model}
                    onChange={(e) => handleInputChange('model', e.target.value)}
                  />
                </div>
                <div className="space-y-3">
                  <Label className="font-black text-[10px] uppercase tracking-widest text-muted-foreground">Número de Série</Label>
                  <Input 
                    placeholder="SN-XXXX" 
                    className="h-14 border-primary/10 focus:border-accent font-mono font-black text-accent bg-muted/5"
                    value={formData.serialNumber}
                    onChange={(e) => handleInputChange('serialNumber', e.target.value)}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="testes" className="mt-0 space-y-12">
              <div className="flex items-center gap-4 text-primary bg-muted/10 p-4 rounded-xl">
                <Activity className="h-8 w-8 text-accent" />
                <h2 className="text-2xl font-black uppercase tracking-tighter">2. TESTES DE PERFORMANCE CVT</h2>
              </div>
              
              <div className="space-y-16">
                {/* Polia Primária */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-4 rounded-full bg-accent" />
                    <h3 className="font-black text-lg uppercase tracking-tight text-primary">CONJUNTO POLIA PRIMÁRIA</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 p-8 border-2 border-dashed rounded-3xl bg-muted/5">
                    <div className="space-y-4">
                      <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">VÁCUO DE SUCÇÃO (INHG)</Label>
                      <div className="flex items-center gap-4">
                        <Input className="h-16 w-32 text-center text-2xl font-black border-muted-foreground/20 text-primary" defaultValue="0" />
                        <Input className="h-16 w-32 text-center text-2xl font-black bg-[#E6F7F9] border-accent/30 text-accent" defaultValue="0" />
                        <Input 
                          className="h-16 flex-1 text-center border-2 border-accent/20 rounded-2xl bg-white font-black text-accent text-sm shadow-sm"
                          defaultValue="MIN: -24 inHg"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">PRESSÃO DE TRABALHO (KPA)</Label>
                      <div className="flex items-center gap-4">
                        <Input className="h-16 w-32 text-center text-2xl font-black border-muted-foreground/20 text-primary" defaultValue="0" />
                        <Input className="h-16 w-32 text-center text-2xl font-black bg-[#E6F7F9] border-accent/30 text-accent" defaultValue="0" />
                        <Input 
                          className="h-16 flex-1 text-center border-2 border-accent/20 rounded-2xl bg-white font-black text-accent text-sm shadow-sm"
                          defaultValue="510 ±20 kPa"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Polia Secundária */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-4 rounded-full bg-primary" />
                    <h3 className="font-black text-lg uppercase tracking-tight text-primary">CONJUNTO POLIA SECUNDÁRIA</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 p-8 border-2 border-dashed rounded-3xl bg-muted/5">
                    <div className="space-y-4">
                      <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">VÁCUO DE SUCÇÃO (INHG)</Label>
                      <div className="flex items-center gap-4">
                        <Input className="h-16 w-32 text-center text-2xl font-black border-muted-foreground/20 text-primary" defaultValue="0" />
                        <Input className="h-16 w-32 text-center text-2xl font-black bg-[#E6F7F9] border-accent/30 text-accent" defaultValue="0" />
                        <Input 
                          className="h-16 flex-1 text-center border-2 border-accent/20 rounded-2xl bg-white font-black text-accent text-sm shadow-sm"
                          defaultValue="MIN: -24 inHg"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">PRESSÃO DE TRABALHO (KPA)</Label>
                      <div className="flex items-center gap-4">
                        <Input className="h-16 w-32 text-center text-2xl font-black border-muted-foreground/20 text-primary" defaultValue="0" />
                        <Input className="h-16 w-32 text-center text-2xl font-black bg-[#E6F7F9] border-accent/30 text-accent" defaultValue="0" />
                        <Input 
                          className="h-16 flex-1 text-center border-2 border-accent/20 rounded-2xl bg-white font-black text-accent text-sm shadow-sm"
                          defaultValue="710 ±20 kPa"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="servicos" className="mt-0 space-y-6">
              <div className="flex items-center gap-4 text-primary mb-8">
                <Wrench className="h-8 w-8 text-accent" />
                <h2 className="text-2xl font-black uppercase tracking-tighter">DETALHAMENTO DOS SERVIÇOS EXECUTADOS</h2>
              </div>
              
              <div className="bg-[#0B1A2B] rounded-2xl p-8 shadow-2xl">
                <Label className="text-[10px] font-black text-accent uppercase tracking-[0.3em] mb-4 block">LOG TÉCNICO DE MANUTENÇÃO</Label>
                <Textarea 
                  rows={15} 
                  className="bg-transparent border-none focus:ring-0 resize-none font-mono text-emerald-400 text-sm p-4 w-full leading-relaxed" 
                  placeholder="[2024-05-24 08:30] INÍCIO DO PROCESSO DE DESMONTAGEM CVT..." 
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="p-6 border-2 border-accent/10 rounded-2xl bg-white">
                  <h4 className="font-black text-[10px] uppercase tracking-widest text-muted-foreground mb-4">Mão de Obra Especializada</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm font-bold text-primary">
                      <span>Engenheiro Responsável:</span>
                      <span className="text-accent uppercase">DIEGO</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-bold text-primary">
                      <span>Equipe Técnica:</span>
                      <span className="text-accent uppercase">Time A - Hidráulica</span>
                    </div>
                  </div>
                </div>
                <div className="p-6 border-2 border-accent/10 rounded-2xl bg-white">
                  <h4 className="font-black text-[10px] uppercase tracking-widest text-muted-foreground mb-4">Tempo de Execução</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm font-bold text-primary">
                      <span>Duração Estimada:</span>
                      <span className="text-accent uppercase">18 HORAS TÉCNICAS</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-bold text-primary">
                      <span>Complexidade:</span>
                      <span className="text-accent uppercase">ALTA PRECISÃO</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="qualidade" className="mt-0 space-y-6">
              <h2 className="text-2xl font-black text-primary uppercase tracking-tight">Checklist de Qualidade Certificada</h2>
              <div className="grid gap-4">
                {[
                  "Inspeção dimensional de polias e correia CVT",
                  "Teste de estanqueidade do cárter",
                  "Calibração de sensores de pressão primária",
                  "Verificação de torque em parafusos estruturais",
                  "Análise espectrográfica de lubrificante"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-6 border-2 border-muted/20 rounded-3xl hover:border-accent/30 transition-all bg-white cursor-pointer group shadow-sm">
                    <input type="checkbox" className="h-8 w-8 rounded-lg border-2 border-primary accent-accent cursor-pointer" id={`q-${i}`} />
                    <Label htmlFor={`q-${i}`} className="flex-1 cursor-pointer font-black text-primary text-xl uppercase tracking-tighter">{item}</Label>
                    <Fingerprint className="h-8 w-8 text-muted-foreground/20 group-hover:text-accent transition-colors" />
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="midia" className="mt-0 space-y-6">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black text-primary uppercase tracking-tight">EVIDÊNCIAS DIGITAIS</h2>
                <Button className="bg-accent text-primary font-black gap-2 shadow-xl px-8 h-12 uppercase text-[10px] tracking-widest">
                  <ImageIcon className="h-5 w-5" /> ANEXAR FOTOS / VÍDEOS
                </Button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="aspect-square relative rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl group bg-slate-100">
                    <img 
                      src={`https://picsum.photos/seed/cvt-${i+20}/400`} 
                      alt="CVT Evidence" 
                      className="object-cover w-full h-full group-hover:scale-125 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button variant="ghost" className="text-white font-black uppercase text-[8px] tracking-[0.2em]">VISUALIZAR</Button>
                    </div>
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-primary/90 text-white text-[8px] font-black border-none px-3 py-1">CVT_IMG_00{i}</Badge>
                    </div>
                  </div>
                ))}
                <div className="aspect-square border-4 border-dashed border-muted rounded-[2.5rem] flex flex-col items-center justify-center gap-4 text-muted-foreground hover:bg-accent/5 hover:border-accent cursor-pointer transition-all bg-white group shadow-inner">
                  <PlusCircle className="h-12 w-12 text-muted-foreground/20 group-hover:text-accent" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em]">Adicionar</span>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="garantia" className="mt-0 space-y-10">
              <h2 className="text-2xl font-black text-primary uppercase tracking-tight">CERTIFICADO DE GARANTIA CVT</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <Label className="font-black text-[10px] uppercase tracking-widest text-muted-foreground">Período de Cobertura</Label>
                  <Select defaultValue="12">
                    <SelectTrigger className="h-20 border-primary/10 text-2xl font-black uppercase tracking-tighter bg-muted/5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6" className="font-bold">06 MESES CERTIFICADOS</SelectItem>
                      <SelectItem value="12" className="font-bold">12 MESES CERTIFICADOS</SelectItem>
                      <SelectItem value="24" className="font-bold">24 MESES CERTIFICADOS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-4">
                  <Label className="font-black text-[10px] uppercase tracking-widest text-muted-foreground">Início da Vigência</Label>
                  <Input type="date" className="h-20 border-primary/10 text-2xl font-black bg-muted/5" defaultValue={new Date().toISOString().split('T')[0]} />
                </div>
              </div>
              <div className="p-8 border-4 border-accent/20 rounded-[2rem] bg-accent/5">
                <p className="text-sm font-bold text-primary leading-relaxed text-center italic">
                  "Este certificado valida que a unidade CVT passou por rigorosos testes de qualidade industrial conforme normas ABNT e manuais do fabricante, operando dentro das tolerâncias especificadas."
                </p>
              </div>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
      
      {/* Footer info */}
      <footer className="py-16 text-center">
        <div className="flex justify-center mb-6">
          <ShieldCheck className="h-12 w-12 text-primary opacity-20" />
        </div>
        <p className="text-[10px] font-black text-primary/40 uppercase tracking-[0.4em]">
          © 2026 CERTIFICA LAUDO CVT - BRAZILIAN SOLUÇÕES INDUSTRIAIS - V6.0
        </p>
      </footer>
    </div>
  );
}

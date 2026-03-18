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
  PlusCircle,
  Fingerprint,
  Activity,
  ShieldCheck,
  History
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

const SERVICE_ITEMS = [
  "INSPEÇÃO VISUAL COMPLETA",
  "POLIMENTO REALIZADO",
  "GRAVAÇÃO DE CÓDIGO",
  "TESTE DE VÁCUO (ANTES/DEPOIS)",
  "TROCA DE CORRENTE",
  "TESTE DE PRESSÃO (ANTES/DEPOIS)",
  "CORRENTE: OK",
  "TESTE EM BANCADA ESPECIALIZADA",
  "SUBSTITUIÇÃO DE VEDAÇÕES"
];

export function QualityReportForm() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("identificacao");
  const [isAiLoading, setIsAiLoading] = useState(false);
  
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
    // Test data
    testVacInBefore: "0",
    testVacInAfter: "0",
    testPresInBefore: "0",
    testPresInAfter: "0",
    testRefVac: "-24",
    testRefPres: "510"
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
    <div className="space-y-8">
      <p className="text-center text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
        TERMINAL TÉCNICO DE CERTIFICAÇÃO INDUSTRIAL V4.5
      </p>

      {/* Dark Header Action Bar */}
      <div className="bg-[#0B1A2B] rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl border-b-4 border-accent">
        <div className="flex items-center gap-4">
          <div className="bg-accent/10 p-3 rounded-xl border border-accent/20">
            <ClipboardCheck className="h-7 w-7 text-accent" />
          </div>
          <div>
            <p className="text-[10px] font-black text-accent uppercase tracking-[0.3em] leading-none mb-1">GESTÃO INDUSTRIAL</p>
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">ARQUIVAR NO BANCO</h2>
          </div>
        </div>
        
        <div className="flex flex-1 max-w-sm">
          <Input className="bg-white h-12 rounded-xl border-none shadow-inner font-bold text-primary" placeholder="REFERÊNCIA_INTERNA" />
        </div>

        <Button 
          className="bg-accent hover:bg-accent/90 text-[#0B1A2B] font-black h-12 px-8 rounded-xl gap-2 transition-all hover:scale-105 active:scale-95 uppercase tracking-tight shadow-lg"
          onClick={() => toast({ title: "Registro Salvo", description: "O laudo foi sincronizado com DIEGO (Resp. Técnico)." })}
        >
          <Save className="h-5 w-5" />
          SALVAR REGISTRO
        </Button>
      </div>

      <Card className="border-none shadow-2xl overflow-hidden bg-white rounded-2xl">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full flex h-auto p-1 bg-[#F8FAFC] rounded-none border-b overflow-x-auto">
            {["identificacao", "testes", "servicos", "qualidade", "midia", "garantia"].map((tab) => (
              <TabsTrigger 
                key={tab}
                value={tab} 
                className="flex-1 py-5 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:border-b-4 data-[state=active]:border-accent rounded-none transition-all min-w-[120px]"
              >
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">{tab === "servicos" ? "SERVIÇOS" : tab}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <CardContent className="p-10">
            {/* IDENTIFICAÇÃO */}
            <TabsContent value="identificacao" className="mt-0 space-y-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-black text-primary uppercase tracking-tight">IDENTIFICAÇÃO DA UNIDADE</h2>
                  <p className="text-sm text-muted-foreground font-medium">Responsável Técnico: <span className="text-accent font-black">DIEGO</span></p>
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
                    placeholder="CLIENTE INDUSTRIAL" 
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
                    placeholder="CONJUNTO INDUSTRIAL" 
                    className="h-14 border-primary/10 focus:border-accent font-black text-primary bg-muted/5 uppercase"
                    value={formData.equipmentType}
                    onChange={(e) => handleInputChange('equipmentType', e.target.value)}
                  />
                </div>
              </div>
            </TabsContent>

            {/* TESTES */}
            <TabsContent value="testes" className="mt-0 space-y-12">
              <div className="flex items-center gap-4 text-primary bg-muted/10 p-4 rounded-xl">
                <Activity className="h-8 w-8 text-accent" />
                <h2 className="text-2xl font-black uppercase tracking-tighter">2. PERFORMANCE HIDRÁULICA (COMPARATIVO)</h2>
              </div>
              
              <div className="space-y-16">
                <div className="space-y-8">
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-4 rounded-full bg-accent" />
                    <h3 className="font-black text-lg uppercase tracking-tight text-primary">MONITORAMENTO DE POLIAS</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* VÁCUO SECTION */}
                    <div className="space-y-6 p-8 border-2 border-dashed rounded-[2.5rem] bg-muted/5 relative overflow-hidden">
                      <div className="absolute top-0 right-0 bg-accent text-white px-6 py-2 rounded-bl-3xl font-black text-[10px] uppercase tracking-widest shadow-lg">
                        VÁCUO (INHG)
                      </div>
                      
                      <div className="grid grid-cols-2 gap-6 mt-4">
                        <div className="space-y-3">
                          <Label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">COMO CHEGOU</Label>
                          <div className="relative">
                            <Input 
                              type="number"
                              className="h-20 text-center text-3xl font-black border-muted-foreground/20 text-primary bg-white rounded-2xl" 
                              value={formData.testVacInBefore}
                              onChange={(e) => handleInputChange('testVacInBefore', e.target.value)}
                            />
                            <span className="absolute bottom-2 right-4 text-[10px] font-black text-muted-foreground">INHG</span>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <Label className="text-[9px] font-black text-accent uppercase tracking-widest">PÓS RECUPERAÇÃO</Label>
                          <div className="relative">
                            <Input 
                              type="number"
                              className="h-20 text-center text-3xl font-black bg-[#E6F7F9] border-accent/30 text-accent rounded-2xl" 
                              value={formData.testVacInAfter}
                              onChange={(e) => handleInputChange('testVacInAfter', e.target.value)}
                            />
                            <span className="absolute bottom-2 right-4 text-[10px] font-black text-accent">INHG</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-muted/50">
                        <Label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-2 block">REFERÊNCIA TÉCNICA (EDITÁVEL)</Label>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-black text-primary uppercase">MIN:</span>
                          <Input 
                            className="h-10 w-24 text-center font-black border-accent/20 text-accent rounded-lg" 
                            value={formData.testRefVac}
                            onChange={(e) => handleInputChange('testRefVac', e.target.value)}
                          />
                          <span className="text-xs font-black text-muted-foreground">INHG</span>
                        </div>
                      </div>
                    </div>

                    {/* PRESSÃO SECTION */}
                    <div className="space-y-6 p-8 border-2 border-dashed rounded-[2.5rem] bg-muted/5 relative overflow-hidden">
                      <div className="absolute top-0 right-0 bg-primary text-white px-6 py-2 rounded-bl-3xl font-black text-[10px] uppercase tracking-widest shadow-lg">
                        PRESSÃO (KPA)
                      </div>

                      <div className="grid grid-cols-2 gap-6 mt-4">
                        <div className="space-y-3">
                          <Label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">COMO CHEGOU</Label>
                          <div className="relative">
                            <Input 
                              type="number"
                              className="h-20 text-center text-3xl font-black border-muted-foreground/20 text-primary bg-white rounded-2xl" 
                              value={formData.testPresInBefore}
                              onChange={(e) => handleInputChange('testPresInBefore', e.target.value)}
                            />
                            <span className="absolute bottom-2 right-4 text-[10px] font-black text-muted-foreground">KPA</span>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <Label className="text-[9px] font-black text-accent uppercase tracking-widest">PÓS RECUPERAÇÃO</Label>
                          <div className="relative">
                            <Input 
                              type="number"
                              className="h-20 text-center text-3xl font-black bg-[#E6F7F9] border-accent/30 text-accent rounded-2xl" 
                              value={formData.testPresInAfter}
                              onChange={(e) => handleInputChange('testPresInAfter', e.target.value)}
                            />
                            <span className="absolute bottom-2 right-4 text-[10px] font-black text-accent">KPA</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-muted/50">
                        <Label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-2 block">REFERÊNCIA TÉCNICA (EDITÁVEL)</Label>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-black text-primary uppercase">NOMINAL:</span>
                          <Input 
                            className="h-10 w-24 text-center font-black border-accent/20 text-accent rounded-lg" 
                            value={formData.testRefPres}
                            onChange={(e) => handleInputChange('testRefPres', e.target.value)}
                          />
                          <span className="text-xs font-black text-muted-foreground">KPA</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* SERVIÇOS */}
            <TabsContent value="servicos" className="mt-0 space-y-8">
              <div className="flex items-center gap-4 text-primary">
                <ShieldCheck className="h-8 w-8 text-accent" />
                <h2 className="text-2xl font-black uppercase tracking-tighter">3. SERVIÇOS REALIZADOS POR <span className="text-accent">DIEGO</span></h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {SERVICE_ITEMS.map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-8 border border-muted/20 rounded-[2rem] bg-white hover:border-accent/30 transition-all cursor-pointer group shadow-sm">
                    <div className="h-6 w-6 rounded-full border-2 border-primary group-hover:border-accent flex items-center justify-center shrink-0">
                      <div className="h-2 w-2 rounded-full bg-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <Label className="font-black text-primary text-[11px] uppercase tracking-tight cursor-pointer leading-tight">
                      {item}
                    </Label>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* QUALIDADE */}
            <TabsContent value="qualidade" className="mt-0 space-y-6">
              <h2 className="text-2xl font-black text-primary uppercase tracking-tight">Checklist de Qualidade Certificada</h2>
              <div className="grid gap-4">
                {[
                  "Inspeção dimensional de polias",
                  "Teste de estanqueidade",
                  "Calibração de sensores",
                  "Verificação de torque",
                  "Análise de lubrificante"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-6 border-2 border-muted/20 rounded-3xl hover:border-accent/30 transition-all bg-white cursor-pointer group shadow-sm">
                    <input type="checkbox" className="h-8 w-8 rounded-lg border-2 border-primary accent-accent cursor-pointer" id={`q-${i}`} />
                    <Label htmlFor={`q-${i}`} className="flex-1 cursor-pointer font-black text-primary text-xl uppercase tracking-tighter">{item}</Label>
                    <Fingerprint className="h-8 w-8 text-muted-foreground/20 group-hover:text-accent transition-colors" />
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* MÍDIA */}
            <TabsContent value="midia" className="mt-0 space-y-6">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black text-primary uppercase tracking-tight">EVIDÊNCIAS DIGITAIS</h2>
                <Button className="bg-accent text-primary font-black gap-2 shadow-xl px-8 h-12 uppercase text-[10px] tracking-widest">
                  <ImageIcon className="h-5 w-5" /> ANEXAR FOTOS / VÍDEOS
                </Button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
                {[1, 2, 3].map(i => (
                  <div key={i} className="aspect-square relative rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl group bg-slate-100">
                    <img 
                      src={`https://picsum.photos/seed/cvt-${i+20}/400`} 
                      alt="CVT Evidence" 
                      className="object-cover w-full h-full group-hover:scale-125 transition-transform duration-700"
                    />
                  </div>
                ))}
                <div className="aspect-square border-4 border-dashed border-muted rounded-[2.5rem] flex flex-col items-center justify-center gap-4 text-muted-foreground hover:bg-accent/5 hover:border-accent cursor-pointer transition-all bg-white group shadow-inner">
                  <PlusCircle className="h-12 w-12 text-muted-foreground/20 group-hover:text-accent" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em]">Adicionar</span>
                </div>
              </div>
            </TabsContent>

            {/* GARANTIA */}
            <TabsContent value="garantia" className="mt-0 space-y-10">
              <h2 className="text-2xl font-black text-primary uppercase tracking-tight">CERTIFICADO DE GARANTIA</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <Label className="font-black text-[10px] uppercase tracking-widest text-muted-foreground">Período de Cobertura</Label>
                  <Select defaultValue="12">
                    <SelectTrigger className="h-20 border-primary/10 text-2xl font-black uppercase tracking-tighter bg-muted/5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6" className="font-bold">06 MESES</SelectItem>
                      <SelectItem value="12" className="font-bold">12 MESES</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
      
      <footer className="py-12 text-center">
        <div className="flex flex-col items-center gap-2">
          <p className="text-[10px] font-black text-primary/40 uppercase tracking-[0.3em]">
            © 2026 BRAZILIAN SOLUÇÕES INDUSTRIAIS - SISTEMA DE QUALIDADE CERTIFICAPOLIA
          </p>
          <div className="flex items-center gap-4 text-[9px] font-black text-accent uppercase tracking-widest opacity-60">
            <span>UNIDADE: POLIA-MESTRE-01</span>
            <span className="h-1 w-1 bg-accent rounded-full" />
            <span>RESP. TÉCNICO: DIEGO</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

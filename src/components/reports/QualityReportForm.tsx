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
  BarChart3
} from "lucide-react";
import { aiAssistedDataEntry } from "@/ai/flows/ai-assisted-data-entry-flow";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export function QualityReportForm() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("testes");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    equipmentType: "Polia Industrial",
    model: "",
    manufacturer: "",
    serialNumber: "",
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
        description: "Insira o tipo de equipamento ou descreva o problema para a IA processar.",
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

      if (result.suggestedTestProcedures) {
        setFormData(prev => ({
          ...prev,
          testProcedures: result.suggestedTestProcedures || prev.testProcedures
        }));
      }

      toast({
        title: "Processamento Concluído",
        description: `Modelos e testes sugeridos com ${Math.round((result.confidenceScore || 0) * 100)}% de precisão.`,
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

  const handleFinalize = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Documento Certificado",
        description: "O laudo foi publicado e arquivado com sucesso.",
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Dark Header Action Bar (as seen in screenshot) */}
      <div className="bg-[#0B1A2B] rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="bg-white/10 p-3 rounded-xl border border-white/10">
            <FileText className="h-6 w-6 text-accent" />
          </div>
          <div>
            <p className="text-[10px] font-black text-accent uppercase tracking-[0.2em] leading-none mb-1">GESTÃO INDUSTRIAL</p>
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">ARQUIVAR NO BANCO</h2>
          </div>
        </div>
        
        <div className="flex flex-1 max-w-sm">
          <Input className="bg-white h-12 rounded-xl border-none shadow-inner" placeholder="" />
        </div>

        <Button 
          className="bg-accent hover:bg-accent/90 text-[#0B1A2B] font-black h-12 px-8 rounded-xl gap-2 transition-all hover:scale-105 active:scale-95 uppercase tracking-tight"
          onClick={() => toast({ title: "Registro Salvo", description: "O laudo foi sincronizado com o servidor." })}
        >
          <Save className="h-5 w-5" />
          SALVAR REGISTRO
        </Button>
      </div>

      <Card className="border-none shadow-xl overflow-hidden bg-white">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full flex h-auto p-1 bg-muted/20 rounded-none border-b">
            <TabsTrigger value="identificacao" className="flex-1 py-4 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-none rounded-none transition-all">
              <span className="text-[10px] font-black uppercase tracking-[0.15em]">IDENTIFICAÇÃO</span>
            </TabsTrigger>
            <TabsTrigger value="testes" className="flex-1 py-4 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-none rounded-none transition-all">
              <span className="text-[10px] font-black uppercase tracking-[0.15em]">TESTES</span>
            </TabsTrigger>
            <TabsTrigger value="servicos" className="flex-1 py-4 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-none rounded-none transition-all">
              <span className="text-[10px] font-black uppercase tracking-[0.15em]">SERVIÇOS</span>
            </TabsTrigger>
            <TabsTrigger value="qualidade" className="flex-1 py-4 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-none rounded-none transition-all">
              <span className="text-[10px] font-black uppercase tracking-[0.15em]">QUALIDADE</span>
            </TabsTrigger>
            <TabsTrigger value="midia" className="flex-1 py-4 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-none rounded-none transition-all">
              <span className="text-[10px] font-black uppercase tracking-[0.15em]">MÍDIA</span>
            </TabsTrigger>
            <TabsTrigger value="garantia" className="flex-1 py-4 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-none rounded-none transition-all">
              <span className="text-[10px] font-black uppercase tracking-[0.15em]">GARANTIA</span>
            </TabsTrigger>
          </TabsList>

          <CardContent className="p-10">
            <TabsContent value="identificacao" className="mt-0 space-y-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-black text-primary uppercase tracking-tight">Dados do Equipamento</h2>
                  <p className="text-sm text-muted-foreground font-medium">Especificações técnicas para rastreabilidade.</p>
                </div>
                <Button 
                  onClick={handleAiAssist} 
                  disabled={isAiLoading}
                  className="bg-primary hover:bg-primary/90 text-white gap-2 shadow-lg h-12 px-6 font-bold"
                >
                  {isAiLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5 text-accent" />}
                  ASSISTÊNCIA IA
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <Label className="font-black text-[10px] uppercase tracking-widest text-muted-foreground">Tipo de Máquina</Label>
                  <Input 
                    placeholder="Ex: Motor Síncrono" 
                    className="h-12 border-primary/10 focus:border-accent"
                    value={formData.equipmentType}
                    onChange={(e) => handleInputChange('equipmentType', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-black text-[10px] uppercase tracking-widest text-muted-foreground">Modelo / Tag</Label>
                  <Input 
                    placeholder="Ex: WEG-3000" 
                    className="h-12 border-primary/10 focus:border-accent"
                    value={formData.model}
                    onChange={(e) => handleInputChange('model', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-black text-[10px] uppercase tracking-widest text-muted-foreground">Número de Série</Label>
                  <Input 
                    placeholder="SN-XXXX" 
                    className="h-12 border-primary/10 focus:border-accent font-mono"
                    value={formData.serialNumber}
                    onChange={(e) => handleInputChange('serialNumber', e.target.value)}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="testes" className="mt-0 space-y-12">
              <div className="flex items-center gap-3 text-primary">
                <Activity className="h-7 w-7 text-primary" />
                <h2 className="text-2xl font-black uppercase tracking-tighter">2. TESTES HIDRÁULICOS</h2>
              </div>
              
              <div className="space-y-12">
                {/* Polia Primária */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-[#26A3BB]">
                    <div className="h-2 w-2 rounded-full bg-[#26A3BB]" />
                    <h3 className="font-black text-sm uppercase tracking-wider">POLIA PRIMÁRIA</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="space-y-3">
                      <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">VÁCUO (INHG)</Label>
                      <div className="flex items-center gap-4">
                        <Input className="h-14 w-32 text-center text-xl font-bold border-muted" defaultValue="0" />
                        <Input className="h-14 w-32 text-center text-xl font-bold bg-[#E6F7F9] border-[#B2E5EB]" defaultValue="0" />
                        <div className="h-14 flex items-center justify-center px-6 border-2 border-dashed rounded-xl bg-muted/5 font-black text-primary/60 text-sm">
                          {`>= -24 inHg`}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">PRESSÃO (KPA)</Label>
                      <div className="flex items-center gap-4">
                        <Input className="h-14 w-32 text-center text-xl font-bold border-muted" defaultValue="0" />
                        <Input className="h-14 w-32 text-center text-xl font-bold bg-[#E6F7F9] border-[#B2E5EB]" defaultValue="0" />
                        <div className="h-14 flex items-center justify-center px-6 border-2 border-dashed rounded-xl bg-muted/5 font-black text-primary/60 text-sm">
                          510 ±20 kPa
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Polia Secundária */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-[#26A3BB]">
                    <div className="h-2 w-2 rounded-full bg-[#26A3BB]" />
                    <h3 className="font-black text-sm uppercase tracking-wider">POLIA SECUNDÁRIA</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="space-y-3">
                      <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">VÁCUO (INHG)</Label>
                      <div className="flex items-center gap-4">
                        <Input className="h-14 w-32 text-center text-xl font-bold border-muted" defaultValue="0" />
                        <Input className="h-14 w-32 text-center text-xl font-bold bg-[#E6F7F9] border-[#B2E5EB]" defaultValue="0" />
                        <div className="h-14 flex items-center justify-center px-6 border-2 border-dashed rounded-xl bg-muted/5 font-black text-primary/60 text-sm">
                          {`>= -24 inHg`}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">PRESSÃO (KPA)</Label>
                      <div className="flex items-center gap-4">
                        <Input className="h-14 w-32 text-center text-xl font-bold border-muted" defaultValue="0" />
                        <Input className="h-14 w-32 text-center text-xl font-bold bg-[#E6F7F9] border-[#B2E5EB]" defaultValue="0" />
                        <div className="h-14 flex items-center justify-center px-6 border-2 border-dashed rounded-xl bg-muted/5 font-black text-primary/60 text-sm">
                          710 ±20 kPa
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="servicos" className="mt-0 space-y-4">
              <h2 className="text-2xl font-black text-primary uppercase tracking-tight">Detalhamento dos Serviços</h2>
              <div className="p-2 border rounded-xl bg-muted/10">
                <Textarea 
                  rows={12} 
                  className="bg-white border-none focus:ring-0 resize-none font-mono text-sm p-6" 
                  placeholder="TECNICO LOG [2024-05-24 10:00]: Iniciada desmontagem do conjunto rotativo..." 
                />
              </div>
            </TabsContent>

            <TabsContent value="qualidade" className="mt-0 space-y-6">
              <h2 className="text-2xl font-black text-primary uppercase tracking-tight">Padrão de Qualidade</h2>
              <div className="grid gap-4">
                {[
                  "Inspeção dimensional de eixos e sedes",
                  "Balanceamento dinâmico do rotor (Norma G2.5)",
                  "Teste hidrostático de vedação (1.5x PN)",
                  "Pintura industrial conforme padrão RAL",
                  "Verificação final de torque e travas"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-5 border rounded-2xl hover:bg-primary/5 transition-all bg-white cursor-pointer group shadow-sm">
                    <input type="checkbox" className="h-6 w-6 rounded-md border-2 border-primary accent-accent cursor-pointer" id={`q-${i}`} />
                    <Label htmlFor={`q-${i}`} className="flex-1 cursor-pointer font-bold text-primary text-lg">{item}</Label>
                    <Fingerprint className="h-6 w-6 text-muted-foreground/30" />
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="midia" className="mt-0 space-y-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black text-primary uppercase tracking-tight">Evidências Fotográficas</h2>
                <Button className="bg-accent text-[#0B1A2B] font-black gap-2 shadow-lg">
                  <ImageIcon className="h-4 w-4" /> UPLOAD DE ARQUIVOS
                </Button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="aspect-square relative rounded-3xl overflow-hidden border-4 border-white shadow-2xl group bg-slate-100">
                    <img 
                      src={`https://picsum.photos/seed/equip-${i+10}/400`} 
                      alt="Process Evidence" 
                      className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-white/90 text-primary text-[8px] font-black border-none px-2 py-1">FOTO_LOG_00{i}</Badge>
                    </div>
                  </div>
                ))}
                <div className="aspect-square border-4 border-dashed border-muted rounded-3xl flex flex-col items-center justify-center gap-3 text-muted-foreground hover:bg-accent/5 hover:border-accent cursor-pointer transition-all bg-white group">
                  <PlusCircle className="h-10 w-10 text-muted-foreground/30 group-hover:text-accent" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Novo Arquivo</span>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="garantia" className="mt-0 space-y-8">
              <h2 className="text-2xl font-black text-primary uppercase tracking-tight">Termos e Condições</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <Label className="font-black text-[10px] uppercase tracking-widest text-muted-foreground">Vigência da Garantia</Label>
                  <Select defaultValue="12">
                    <SelectTrigger className="h-16 border-primary/10 text-lg font-black uppercase">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6">06 MESES OPERACIONAIS</SelectItem>
                      <SelectItem value="12">12 MESES OPERACIONAIS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-4">
                  <Label className="font-black text-[10px] uppercase tracking-widest text-muted-foreground">Início do Ciclo</Label>
                  <Input type="date" className="h-16 border-primary/10 text-lg font-black" defaultValue={new Date().toISOString().split('T')[0]} />
                </div>
              </div>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
      
      {/* Footer info (as seen in screenshot) */}
      <footer className="py-12 text-center border-t border-muted/20">
        <p className="text-[10px] font-black text-primary/40 uppercase tracking-[0.3em]">
          © 2026 BRAZILIAN SOLUÇÕES INDUSTRIAIS - SISTEMA DE QUALIDADE V4.5
        </p>
      </footer>
    </div>
  );
}

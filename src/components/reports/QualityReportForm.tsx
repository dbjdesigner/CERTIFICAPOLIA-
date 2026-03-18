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
    testVacRef: "-24",
    testPresRef: "510",
    testVacValue: "",
    testPresValue: ""
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border">
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 p-3 rounded-lg">
            <ClipboardCheck className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-primary uppercase">Registro Técnico</h2>
            <p className="text-sm text-muted-foreground font-medium">Responsável: <span className="text-accent font-bold">DIEGO</span></p>
          </div>
        </div>
        <Button 
          className="bg-primary hover:bg-primary/90 text-white gap-2 font-bold"
          onClick={() => toast({ title: "Laudo Salvo", description: "O registro foi sincronizado com sucesso." })}
        >
          <Save className="h-4 w-4" />
          SALVAR LAUDO
        </Button>
      </div>

      <Card className="border-none shadow-lg overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start h-auto p-0 bg-muted/50 rounded-none border-b overflow-x-auto">
            {["identificacao", "testes", "servicos", "qualidade", "midia"].map((tab) => (
              <TabsTrigger 
                key={tab}
                value={tab} 
                className="px-8 py-4 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none font-bold uppercase text-[10px] tracking-widest transition-all"
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>

          <CardContent className="p-8">
            <TabsContent value="identificacao" className="mt-0 space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-primary uppercase tracking-tight">Dados da Unidade</h3>
                <Button 
                  onClick={handleAiAssist} 
                  disabled={isAiLoading}
                  variant="outline"
                  className="gap-2 border-primary/20 text-primary font-bold"
                >
                  {isAiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 text-accent" />}
                  IA ASSISTANT
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase text-muted-foreground">Nome do Cliente</Label>
                  <Input 
                    placeholder="CLIENTE S/A" 
                    className="h-12 border-primary/10 focus:border-primary font-bold"
                    value={formData.clientName}
                    onChange={(e) => handleInputChange('clientName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase text-muted-foreground">Vendedor</Label>
                  <Select 
                    value={formData.sellerName} 
                    onValueChange={(value) => handleInputChange('sellerName', value)}
                  >
                    <SelectTrigger className="h-12 border-primary/10 font-bold">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {SELLERS.map(seller => (
                        <SelectItem key={seller} value={seller} className="font-bold">{seller}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase text-muted-foreground">Tipo de Conjunto</Label>
                  <Input 
                    placeholder="CONJUNTO CVT" 
                    className="h-12 border-primary/10 font-bold"
                    value={formData.equipmentType}
                    onChange={(e) => handleInputChange('equipmentType', e.target.value)}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="testes" className="mt-0 space-y-8">
              <div className="flex items-center gap-3 text-primary mb-6">
                <Activity className="h-6 w-6 text-accent" />
                <h3 className="text-lg font-bold uppercase">Métricas de Performance</h3>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="border shadow-sm p-6 space-y-4">
                  <h4 className="font-bold text-sm uppercase text-primary border-b pb-2">Teste de Vácuo (INHG)</h4>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold text-muted-foreground uppercase">Referência Técnica (Editável)</Label>
                      <Input 
                        className="h-10 font-bold border-accent/20" 
                        value={formData.testVacRef}
                        onChange={(e) => handleInputChange('testVacRef', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold text-muted-foreground uppercase">Valor Medido</Label>
                      <Input 
                        type="number"
                        className="h-12 font-black text-xl text-primary" 
                        placeholder="0.0"
                        value={formData.testVacValue}
                        onChange={(e) => handleInputChange('testVacValue', e.target.value)}
                      />
                    </div>
                  </div>
                </Card>

                <Card className="border shadow-sm p-6 space-y-4">
                  <h4 className="font-bold text-sm uppercase text-primary border-b pb-2">Teste de Pressão (KPA)</h4>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold text-muted-foreground uppercase">Referência Técnica (Editável)</Label>
                      <Input 
                        className="h-10 font-bold border-accent/20" 
                        value={formData.testPresRef}
                        onChange={(e) => handleInputChange('testPresRef', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold text-muted-foreground uppercase">Valor Medido</Label>
                      <Input 
                        type="number"
                        className="h-12 font-black text-xl text-primary" 
                        placeholder="0.0"
                        value={formData.testPresValue}
                        onChange={(e) => handleInputChange('testPresValue', e.target.value)}
                      />
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="servicos" className="mt-0 space-y-6">
              <div className="flex items-center gap-3 text-primary mb-4">
                <ShieldCheck className="h-6 w-6 text-accent" />
                <h3 className="text-lg font-bold uppercase">Serviços Executados</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "INSPEÇÃO VISUAL",
                  "LIMPEZA TÉCNICA",
                  "POLIMENTO DE POLIAS",
                  "SUBSTITUIÇÃO DE VEDAÇÕES",
                  "TESTE EM BANCADA",
                  "CALIBRAÇÃO FINAL"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                    <input type="checkbox" className="h-5 w-5 rounded border-primary" id={`svc-${i}`} />
                    <Label htmlFor={`svc-${i}`} className="font-bold text-xs uppercase cursor-pointer">{item}</Label>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="qualidade" className="mt-0 space-y-6">
              <h3 className="text-lg font-bold text-primary uppercase">Checklist Final</h3>
              <div className="space-y-3">
                {[
                  "CONFORMIDADE DIMENSIONAL",
                  "ESTANQUEIDADE VALIDADA",
                  "TORQUE DE MONTAGEM",
                  "IDENTIFICAÇÃO GRAVADA"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 bg-muted/20 rounded-lg">
                    <input type="checkbox" className="h-5 w-5" id={`chk-${i}`} />
                    <Label htmlFor={`chk-${i}`} className="font-bold text-xs uppercase">{item}</Label>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="midia" className="mt-0 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-primary uppercase">Galeria de Evidências</h3>
                <Button variant="outline" className="gap-2 font-bold uppercase text-[10px]">
                  <ImageIcon className="h-4 w-4" /> Anexar Mídia
                </Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="aspect-square border-2 border-dashed rounded-xl flex items-center justify-center text-muted-foreground hover:bg-muted/50 cursor-pointer">
                  <span className="text-[10px] font-bold">UPLOAD</span>
                </div>
              </div>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>

      <footer className="py-6 text-center border-t mt-12">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
          © 2024 CERTIFICA LAUDO CVT | RESPONSÁVEL TÉCNICO: DIEGO
        </p>
      </footer>
    </div>
  );
}

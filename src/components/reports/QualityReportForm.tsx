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
  Fingerprint
} from "lucide-react";
import { aiAssistedDataEntry, type AiAssistedDataEntryOutput } from "@/ai/flows/ai-assisted-data-entry-flow";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export function QualityReportForm() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("identificacao");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    equipmentType: "",
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
    <Card className="border-none shadow-2xl overflow-hidden bg-white/80 backdrop-blur-sm">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-3 md:grid-cols-6 h-auto p-0 bg-primary/5 rounded-none border-b">
          <TabsTrigger value="identificacao" className="flex flex-col gap-1 py-5 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-none rounded-none border-r transition-all group">
            <Info className="h-5 w-5 text-muted-foreground group-data-[state=active]:text-accent" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Identificação</span>
          </TabsTrigger>
          <TabsTrigger value="testes" className="flex flex-col gap-1 py-5 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-none rounded-none border-r transition-all group">
            <ClipboardCheck className="h-5 w-5 text-muted-foreground group-data-[state=active]:text-accent" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Testes</span>
          </TabsTrigger>
          <TabsTrigger value="servicos" className="flex flex-col gap-1 py-5 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-none rounded-none border-r transition-all group">
            <Hammer className="h-5 w-5 text-muted-foreground group-data-[state=active]:text-accent" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Serviços</span>
          </TabsTrigger>
          <TabsTrigger value="qualidade" className="flex flex-col gap-1 py-5 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-none rounded-none border-r transition-all group">
            <ShieldCheck className="h-5 w-5 text-muted-foreground group-data-[state=active]:text-accent" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Qualidade</span>
          </TabsTrigger>
          <TabsTrigger value="midia" className="flex flex-col gap-1 py-5 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-none rounded-none border-r transition-all group">
            <ImageIcon className="h-5 w-5 text-muted-foreground group-data-[state=active]:text-accent" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Mídia</span>
          </TabsTrigger>
          <TabsTrigger value="garantia" className="flex flex-col gap-1 py-5 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-none rounded-none transition-all group">
            <FileCheck className="h-5 w-5 text-muted-foreground group-data-[state=active]:text-accent" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Garantia</span>
          </TabsTrigger>
        </TabsList>

        <CardContent className="p-8">
          <TabsContent value="identificacao" className="mt-0 space-y-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-primary">Dados do Equipamento</h2>
                <p className="text-sm text-muted-foreground">Preencha as especificações técnicas para identificação única.</p>
              </div>
              <Button 
                onClick={handleAiAssist} 
                disabled={isAiLoading}
                className="bg-primary hover:bg-primary/90 text-white gap-2 shadow-lg h-12 px-6"
              >
                {isAiLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5 text-accent" />}
                Assistência IA
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="equipmentType" className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Tipo de Máquina</Label>
                <Input 
                  id="equipmentType" 
                  placeholder="Ex: Motor Síncrono" 
                  className="bg-muted/30 border-none focus:ring-accent"
                  value={formData.equipmentType}
                  onChange={(e) => handleInputChange('equipmentType', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="model" className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Modelo / Tag</Label>
                <Input 
                  id="model" 
                  placeholder="Ex: WEG-3000" 
                  className="bg-muted/30 border-none focus:ring-accent"
                  value={formData.model}
                  onChange={(e) => handleInputChange('model', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="manufacturer" className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Fabricante Original</Label>
                <Input 
                  id="manufacturer" 
                  placeholder="Ex: Siemens" 
                  className="bg-muted/30 border-none focus:ring-accent"
                  value={formData.manufacturer}
                  onChange={(e) => handleInputChange('manufacturer', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="serialNumber" className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Número de Série</Label>
                <Input 
                  id="serialNumber" 
                  placeholder="SN-XXXX" 
                  className="bg-muted/30 border-none focus:ring-accent font-mono"
                  value={formData.serialNumber}
                  onChange={(e) => handleInputChange('serialNumber', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientInfo" className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Unidade do Cliente</Label>
                <Input 
                  id="clientInfo" 
                  placeholder="Unidade Industrial 01" 
                  className="bg-muted/30 border-none focus:ring-accent"
                  value={formData.clientInfo}
                  onChange={(e) => handleInputChange('clientInfo', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="operationType" className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Fluxo de Trabalho</Label>
                <Select 
                  value={formData.operationType} 
                  onValueChange={(val) => handleInputChange('operationType', val)}
                >
                  <SelectTrigger className="bg-muted/30 border-none">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recovery">Recuperação Estrutural</SelectItem>
                    <SelectItem value="sale">Venda Direta</SelectItem>
                    <SelectItem value="maintenance">Manutenção Preventiva</SelectItem>
                    <SelectItem value="installation">Instalação Técnica</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Contexto / Anomalias Observadas</Label>
              <Textarea 
                id="description" 
                rows={4} 
                placeholder="Relate o estado físico inicial ou falhas reportadas..." 
                className="bg-muted/30 border-none focus:ring-accent resize-none"
                value={formData.partialDescription}
                onChange={(e) => handleInputChange('partialDescription', e.target.value)}
              />
            </div>

            {formData.specifications.length > 0 && (
              <div className="mt-8 p-6 bg-accent/5 rounded-xl border border-accent/20 border-dashed">
                <div className="flex items-center gap-2 mb-4">
                  <Badge className="bg-accent text-white border-none">IA SUGGESTION</Badge>
                  <h3 className="text-sm font-bold text-primary uppercase tracking-widest">Ficha Técnica Sugerida</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {formData.specifications.map((spec, i) => (
                    <div key={i} className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm border border-accent/10">
                      <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                      <span className="text-sm font-medium text-primary/80">{spec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="testes" className="mt-0 space-y-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-primary">Procedimentos de Teste</h2>
                <p className="text-sm text-muted-foreground">Protocolos validados para garantia operacional.</p>
              </div>
            </div>
            
            {formData.testProcedures.length > 0 ? (
              <div className="grid gap-4">
                {formData.testProcedures.map((proc, i) => (
                  <div key={i} className="flex items-center gap-4 p-5 border rounded-xl bg-white shadow-sm hover:border-accent transition-colors group">
                    <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-primary text-white font-bold group-hover:bg-accent transition-colors">
                      {i+1}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-primary">{proc}</p>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter mt-1">Status: AGUARDANDO VALIDAÇÃO</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50 gap-2 font-bold hover:bg-emerald-100">
                        <CheckCircle className="h-4 w-4" /> APROVAR
                      </Button>
                      <Button size="sm" variant="outline" className="text-destructive border-destructive/20 bg-destructive/5 gap-2 font-bold hover:bg-destructive/10">
                        <XCircle className="h-4 w-4" /> REPROVAR
                      </Button>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="border-dashed h-16 text-muted-foreground gap-2">
                  <PlusCircle className="h-5 w-5" /> Adicionar Teste Manual
                </Button>
              </div>
            ) : (
              <div className="text-center py-20 border-2 border-dashed rounded-2xl bg-muted/20">
                <AlertTriangle className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-primary/50">Nenhum protocolo definido</h3>
                <p className="text-muted-foreground max-w-sm mx-auto mt-2">Utilize a assistência de IA na aba de identificação para gerar protocolos sugeridos.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="servicos" className="mt-0 space-y-4">
            <h2 className="text-2xl font-bold text-primary">Detalhamento dos Serviços</h2>
            <p className="text-sm text-muted-foreground mb-6">Registro cronológico e técnico das intervenções.</p>
            <div className="p-2 border rounded-xl bg-muted/10">
              <Textarea 
                rows={12} 
                className="bg-white border-none focus:ring-0 resize-none font-mono text-sm" 
                placeholder="TECNICO LOG [2024-05-24 10:00]: Iniciada desmontagem do conjunto rotativo..." 
              />
            </div>
          </TabsContent>

          <TabsContent value="qualidade" className="mt-0 space-y-6">
            <h2 className="text-2xl font-bold text-primary">Padrão de Qualidade</h2>
            <div className="grid gap-4">
              {[
                "Inspeção dimensional de eixos e sedes",
                "Balanceamento dinâmico do rotor (Norma G2.5)",
                "Teste hidrostático de vedação (1.5x PN)",
                "Pintura industrial conforme padrão RAL",
                "Verificação final de torque e travas"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-5 border rounded-xl hover:bg-primary/5 transition-all bg-white cursor-pointer group">
                  <div className="relative">
                    <input type="checkbox" className="h-6 w-6 rounded-md border-2 border-primary accent-accent cursor-pointer" id={`q-${i}`} />
                  </div>
                  <Label htmlFor={`q-${i}`} className="flex-1 cursor-pointer font-bold text-primary group-hover:text-accent transition-colors">{item}</Label>
                  <Fingerprint className="h-5 w-5 text-muted-foreground/30" />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="midia" className="mt-0 space-y-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-primary">Evidências Fotográficas</h2>
                <p className="text-sm text-muted-foreground">Documentação visual do antes, durante e depois.</p>
              </div>
              <Button className="bg-accent text-white gap-2 shadow-lg">
                <ImageIcon className="h-4 w-4" /> Upload de Arquivos
              </Button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="aspect-square relative rounded-2xl overflow-hidden border-4 border-white shadow-xl group bg-slate-100">
                  <img 
                    src={`https://picsum.photos/seed/equip-${i+10}/400`} 
                    alt="Process Evidence" 
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-primary/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button size="icon" variant="secondary" className="h-10 w-10 rounded-xl"><Info className="h-5 w-5" /></Button>
                    <Button size="icon" variant="destructive" className="h-10 w-10 rounded-xl"><Trash2 className="h-5 w-5" /></Button>
                  </div>
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-white/80 text-primary text-[8px] font-bold border-none">FOTO_LOG_00{i}</Badge>
                  </div>
                </div>
              ))}
              <div className="aspect-square border-4 border-dashed rounded-2xl flex flex-col items-center justify-center gap-3 text-muted-foreground hover:bg-accent/5 hover:border-accent cursor-pointer transition-all bg-white group">
                <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-all">
                  <PlusCircle className="h-6 w-6" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest">Novo Arquivo</span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="garantia" className="mt-0 space-y-8">
            <h2 className="text-2xl font-bold text-primary">Termos e Condições Certificadas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Vigência da Garantia</Label>
                <Select defaultValue="12">
                  <SelectTrigger className="h-14 bg-muted/30 border-none text-lg font-bold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6">06 MESES OPERACIONAIS</SelectItem>
                    <SelectItem value="12">12 MESES OPERACIONAIS</SelectItem>
                    <SelectItem value="18">18 MESES OPERACIONAIS</SelectItem>
                    <SelectItem value="24">24 MESES OPERACIONAIS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-4">
                <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Início do Ciclo</Label>
                <Input type="date" className="h-14 bg-muted/30 border-none text-lg font-bold" defaultValue={new Date().toISOString().split('T')[0]} />
              </div>
            </div>
            <div className="space-y-4">
              <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Cláusulas de Cobertura e Exclusões</Label>
              <Textarea 
                rows={8} 
                className="bg-muted/30 border-none focus:ring-accent font-medium leading-relaxed" 
                defaultValue="A garantia cobre exclusivamente defeitos de montagem e falhas prematuras de componentes substituídos, desde que operado dentro das especificações nominais. Exclui-se desgaste natural, mau uso ou intervenções de terceiros não autorizados." 
              />
            </div>
          </TabsContent>
        </CardContent>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-8 bg-primary/5 border-t">
          <div className="text-center sm:text-left">
            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.2em]">Selo de Autenticidade</p>
            <div className="flex items-center gap-2 mt-1">
              <CheckCircle className="h-5 w-5 text-emerald-500" />
              <p className="text-sm font-bold text-primary">CERTIFLOW INDUSTRIAL SYSTEM v2.4</p>
            </div>
          </div>
          <div className="flex gap-4 w-full sm:w-auto">
            <Button variant="outline" className="flex-1 sm:flex-none h-14 px-8 border-primary/20 hover:bg-primary/5 gap-2 font-bold" onClick={() => toast({ title: "Backup Efetuado", description: "O rascunho foi salvo no banco local." })}>
              <Archive className="h-5 w-5" /> ARQUIVAR NO BANCO
            </Button>
            <Button 
              className="flex-1 sm:flex-none bg-accent text-white hover:bg-accent/90 gap-2 h-14 px-12 font-black shadow-xl transition-all hover:scale-105 active:scale-95"
              onClick={handleFinalize}
              disabled={isSaving}
            >
              {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
              FINALIZAR E PUBLICAR LAUDO
            </Button>
          </div>
        </div>
      </Tabs>
    </Card>
  );
}
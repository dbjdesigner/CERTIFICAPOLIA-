
export interface QualityReport {
  id: string;
  reportNumber: string;
  equipmentType: string;
  model: string;
  serialNumber: string;
  client: string;
  operationType: 'recovery' | 'sale' | 'maintenance' | 'installation';
  status: 'Draft' | 'Published' | 'Archived';
  date: string;
  technician: string;
}

export interface Client {
  id: string;
  name: string;
  industry: string;
  location: string;
  activeReports: number;
}

export const MOCK_REPORTS: QualityReport[] = [
  {
    id: '1',
    reportNumber: 'QC-2024-001',
    equipmentType: 'Bomba Hidráulica',
    model: 'Rexroth A10VSO',
    serialNumber: 'SN982341',
    client: 'Mineração Vale do Rio',
    operationType: 'recovery',
    status: 'Published',
    date: '2024-05-15',
    technician: 'Mestre Brazilian',
  },
  {
    id: '2',
    reportNumber: 'QC-2024-002',
    equipmentType: 'Válvula de Controle',
    model: 'Fisher DVC6200',
    serialNumber: 'SN120993',
    client: 'Petrobras S.A.',
    operationType: 'sale',
    status: 'Published',
    date: '2024-05-18',
    technician: 'Mestre Brazilian',
  },
  {
    id: '3',
    reportNumber: 'QC-2024-003',
    equipmentType: 'Motor Elétrico',
    model: 'WEG W22 Premium',
    serialNumber: 'SN445566',
    client: 'Usina Coruripe',
    operationType: 'maintenance',
    status: 'Draft',
    date: '2024-05-20',
    technician: 'Mestre Brazilian',
  },
  {
    id: '4',
    reportNumber: 'QC-2024-004',
    equipmentType: 'Redutor de Velocidade',
    model: 'Flender H3SH',
    serialNumber: 'SN881277',
    client: 'Gerdau S.A.',
    operationType: 'recovery',
    status: 'Published',
    date: '2024-05-22',
    technician: 'Mestre Brazilian',
  },
  {
    id: '5',
    reportNumber: 'QC-2024-005',
    equipmentType: 'Compressor de Ar',
    model: 'Atlas Copco GA37',
    serialNumber: 'SN552211',
    client: 'Anglo American',
    operationType: 'maintenance',
    status: 'Archived',
    date: '2024-04-12',
    technician: 'Mestre Brazilian',
  },
  {
    id: '6',
    reportNumber: 'QC-2024-006',
    equipmentType: 'Painel Elétrico',
    model: 'Schneider PrismaP',
    serialNumber: 'SN009922',
    client: 'Klabin S.A.',
    operationType: 'installation',
    status: 'Published',
    date: '2024-05-25',
    technician: 'Mestre Brazilian',
  }
];

export const MOCK_CLIENTS: Client[] = [
  { id: 'c1', name: 'Mineração Vale do Rio', industry: 'Mineração', location: 'Itabira, MG', activeReports: 12 },
  { id: 'c2', name: 'Petrobras S.A.', industry: 'Óleo e Gás', location: 'Santos, SP', activeReports: 45 },
  { id: 'c3', name: 'Usina Coruripe', industry: 'Açúcar e Álcool', location: 'Coruripe, AL', activeReports: 8 },
  { id: 'c4', name: 'Gerdau S.A.', industry: 'Siderurgia', location: 'Ouro Branco, MG', activeReports: 21 },
  { id: 'c5', name: 'Anglo American', industry: 'Mineração', location: 'Conceição do Mato Dentro, MG', activeReports: 15 },
  { id: 'c6', name: 'Klabin S.A.', industry: 'Papel e Celulose', location: 'Ortigueira, PR', activeReports: 9 }
];

export const SUMMARY_STATS = [
  { label: 'Total de Laudos', value: '142', change: '+12% este mês' },
  { label: 'Em Processo', value: '8', change: '-2 desde ontem' },
  { label: 'Arquivados', value: '124', change: '+5% este ano' },
  { label: 'Taxa de Qualidade', value: '98.5%', change: '+0.2% vs média' },
];

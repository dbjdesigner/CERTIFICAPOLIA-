export interface QualityReport {
  id: string;
  reportNumber: string;
  equipmentType: string;
  model: string;
  serialNumber: string;
  client: string;
  operationType: 'recovery' | 'sale' | 'maintenance' | 'installation';
  status: 'Budget' | 'InRecovery' | 'Published' | 'Archived' | 'Draft';
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
    equipmentType: 'CVT',
    model: 'JF011',
    serialNumber: 'CF*9823',
    client: 'TRANSPORTADORA SILVA',
    operationType: 'recovery',
    status: 'InRecovery',
    date: '2024-05-15',
    technician: 'DIEGO',
  },
  {
    id: '2',
    reportNumber: 'QC-2024-002',
    equipmentType: 'CVT',
    model: 'JF015',
    serialNumber: 'CF*1209',
    client: 'LOGÍSTICA BRASIL',
    operationType: 'sale',
    status: 'Published',
    date: '2024-05-18',
    technician: 'DIEGO',
  },
  {
    id: '3',
    reportNumber: 'QC-2024-003',
    equipmentType: 'CVT',
    model: 'JF011E',
    serialNumber: 'CF*4455',
    client: 'USINA VERDE',
    operationType: 'recovery',
    status: 'Budget',
    date: '2024-05-20',
    technician: 'DIEGO',
  },
  {
    id: '4',
    reportNumber: 'QC-2024-004',
    equipmentType: 'CVT',
    model: 'JF016',
    serialNumber: 'CF*8812',
    client: 'GERDAU S.A.',
    operationType: 'recovery',
    status: 'InRecovery',
    date: '2024-05-22',
    technician: 'DIEGO',
  },
  {
    id: '5',
    reportNumber: 'QC-2024-005',
    equipmentType: 'CVT',
    model: 'JF011',
    serialNumber: 'CF*5522',
    client: 'ANGLO AMERICAN',
    operationType: 'maintenance',
    status: 'Budget',
    date: '2024-04-12',
    technician: 'DIEGO',
  }
];

export const MOCK_CLIENTS: Client[] = [
  { id: 'c1', name: 'Transportadora Silva', industry: 'Logística', location: 'Itabira, MG', activeReports: 12 },
  { id: 'c2', name: 'Logística Brasil', industry: 'Óleo e Gás', location: 'Santos, SP', activeReports: 45 },
  { id: 'c3', name: 'Usina Verde', industry: 'Energia', location: 'Coruripe, AL', activeReports: 8 },
  { id: 'c4', name: 'Gerdau S.A.', industry: 'Siderurgia', location: 'Ouro Branco, MG', activeReports: 21 },
  { id: 'c5', name: 'Anglo American', industry: 'Mineração', location: 'Conceição do Mato Dentro, MG', activeReports: 15 }
];

export const SUMMARY_STATS = [
  { label: 'Total de Laudos', value: '142', change: '+12% este mês' },
  { label: 'Em Processo', value: '8', change: '-2 desde ontem' },
  { label: 'Orçamentos', value: '5', change: '+1 hoje' },
  { label: 'Taxa de Qualidade', value: '98.5%', change: '+0.2% vs média' },
];

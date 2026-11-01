export const typeDefinitions = [
  {
    id: 'FASTA',
    validator: 'fasta',
    defaultExtension: '.fasta',
    scriptExtension: 'fa',
    uploadExtensions: ['.fasta', '.fa'],
    edgeColor: '#e74c3c',
    example: '>seq\nTTGCACTGACCTGAAGTCTTGGAGTATGACCGCGGCTCGGCTCTATCGAACGCTCGATCTAGCGCTATAGGTGGTGCCGAAGGCGGTCTGTCGTCGTA',
  },
  {
    id: 'Multi-FASTA',
    validator: 'multiFasta',
    defaultExtension: '.fasta',
    scriptExtension: 'fa',
    uploadExtensions: ['.fasta', '.fa'],
    edgeColor: '#d35400',
    example: '>seq1_human\nTTGATCCTTAATTGCGGCTTCGATTACTAAAAAACAGGGACAGCATCAACCAAACTGCTTACATTACTGTCGGCGCAACAGCGCGGAAACCGGTTGTTAA\n>seq2_cat\nTTGACCCTTAACTGCGGCTTCAATTACTAATAAACAGGGAAAGCATTACCCAAACTGCTTACATTACTGTCGGCGCAACAGCGCCGCAACCGATTGTTAA\n>seq3_mouse\nCTGACGTTTAAATGCGGCTGGAATTATTCAAAAACTGGTGAAGCATTTCCCAAGTTGCTTCCATTACAGTCTGCGGAACAGCGTCGAGAGCGATCGTAAA\n>seq4_dog\nCTGACGTCGAAATGCGGCTAGTATGATTAAAGAACTGGTAAAGCATTACCCAAATTGCTTCCATTACAGTCTGCGGAACAGCGTCGAAATCGATCGTAAA',
  },
  {
    id: 'EFA',
    validator: 'efa',
    defaultExtension: '.efa',
    scriptExtension: 'efa',
    uploadExtensions: ['.efa'],
    edgeColor: '#f06000',
    example: '<none.1\n>alpha\nACGTACGTACGTACGT\n>beta\nACGTACGTTCGTACGT\n>gamma\nACGTACGTACGTTCGT\n<abc.1\n>alpha\nACGTACGTACGTACGT\n>beta\nACGTACGTTCGTACGT\n>gamma\nACGTACGTACGTTCGT',
  },
  {
    id: 'FASTQ',
    validator: 'fastq',
    defaultExtension: '.fastq',
    scriptExtension: 'fq',
    uploadExtensions: ['.fastq', '.fq'],
    edgeColor: '#e67e22',
    example: '@read1\nGCTAAAGACAATTACATAACATACACGTCAGCACGAAACTTGTTGGCCCAGTGTGAATCGCTTAAGGGTTAAGTAAGTGT\n+\nIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII\n@read2\nGCACGAAACTTGTTGGCCCAGTGTGAATCGCTTAAGGGTTAAGTAAGTGTGATGCATACGCCTTTACTTGCTGTGTCCAC\n+\nIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII\n@read3\nCTTAAGGGTTAAGTAAGTGTGATGCATACGCCTTTACTTGCTGTGTCCACCCCATCGGACTGGCATTTTTATTACACTCA\n+\nIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII\n@read4\nCCTTTACTTGCTGTGTCCACCCCATCGGACTGGCATTTTTATTACACTCAGAAACAGAACTCGGGTAATTTTGACAGGTC\n+\nIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII\n@read5\nTGGCATTTTTATTACACTCAGAAACAGAACTCGGGTAATTTTGACAGGTCACGCAGAGGCGCGCCCTCCTGAAGTGCGTG\n+\nIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII\n@read6\nTCGGGTAATTTTGACAGGTCACGCAGAGGCGCGCCCTCCTGAAGTGCGTGGACACTCGCTATGAATCTCTGATTTACCCA\n+\nIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII',
  },
  {
    id: 'PackagedFASTQ',
    validator: 'packagedFastq',
    defaultExtension: '.txt',
    uploadExtensions: ['.txt'],
    edgeColor: '#2c3e50',
    example: 'GATTTGGGGTTCAAAGCAGTATCGATCAAATAGTAAATCCATTTGTTCAACTCACAGTTT\x7F!\'\'*((((***+))%%%++)(%%%%).1***-+*\'\'))**55CCF>>>>>>CCCCCCC6\x7FSEQ_ID\x7F+\x7F\t0',
  },
  {
    id: 'NUM',
    validator: 'num',
    defaultExtension: '.num',
    uploadExtensions: ['.num'],
    edgeColor: '#3498db',
    example: '0.123\n3.432\n2.341\n1.323\n7.538\n4.122\n0.242\n0.654\n5.633',
  },
  {
    id: 'BIN',
    validator: 'bin',
    defaultExtension: '.bin',
    uploadExtensions: ['.bin'],
    edgeColor: '#123456',
    example: '0\n1\n0',
  },
  {
    id: 'DNA',
    validator: 'dna',
    defaultExtension: '.txt',
    uploadExtensions: ['.txt'],
    edgeColor: '#9b59b6',
    example: 'CGTACGTAGCTGACTGATCGTAGCTAGCTGACTGACTAGCTGATCGTAGCTGATCGTACGTAGCTAGCTAGCTGACTAGCTGATCGTACGTAGCTGAC',
  },
  {
    id: 'RNA',
    validator: 'rna',
    defaultExtension: '.txt',
    uploadExtensions: ['.txt'],
    edgeColor: '#8e44ad',
    example: 'CGUACGUAGCUGACUGAUCGAUGCUACGUAGCUGACGUAGCUAGCUAGCUAGCUAGCUAGCUAGCUAGCUAGCUAGCUAGCUAGCUAGCUAGCUAGCUA',
  },
  {
    id: 'AminoAcids',
    validator: 'aminoAcids',
    defaultExtension: '.txt',
    uploadExtensions: ['.txt'],
    edgeColor: '#16a085',
    example: 'ACDEFGHIKLMNPQRSTVWYACDEFGHIKLMNPQRSTVWYACDEFGHIKLMNPQRSTVWYACDEFGHIKLMNPQRSTVWYACDEFGHIKLMNPQRSTV',
  },
  {
    id: 'POS',
    validator: 'pos',
    defaultExtension: '.pos',
    uploadExtensions: ['.pos'],
    edgeColor: '#7f8c8d',
    example: '1 10\n2 20',
  },
  {
    id: 'SVG',
    validator: 'svg',
    defaultExtension: '.svg',
    uploadExtensions: ['.svg'],
    edgeColor: '#27ae60',
    example: '<svg width=\'100\' height=\'100\'><rect width=\'100\' height=\'100\' style=\'fill:rgb(0,0,255);stroke-width:3;stroke:rgb(0,0,0)\' /></svg>',
  },
  {
    id: 'Group',
    validator: 'group',
    defaultExtension: '.txt',
    uploadExtensions: ['.txt'],
    edgeColor: '#34495e',
    example: 'PNUSH*X',
  },
  {
    id: 'BED',
    validator: 'bed',
    defaultExtension: '.bed',
    uploadExtensions: ['.bed'],
    edgeColor: '#f1c40f',
    example: 'seq\t0\t10\nseq1\t0\t20',
  },
  {
    id: 'GFF',
    validator: 'gff',
    defaultExtension: '.gff',
    scriptExtension: 'gff',
    uploadExtensions: ['.gff', '.gff3', '.gtf'],
    edgeColor: '#1abc9c',
    example: 'seq\t.\tgene\t1\t30\t.\t+\t.\tID=gene1\nseq\t.\tmRNA\t1\t30\t.\t+\t.\tID=tx1;Parent=gene1\nseq\t.\texon\t1\t30\t.\t+\t.\tParent=tx1\nseq\t.\tCDS\t1\t30\t.\t+\t0\tParent=tx1',
  },
  {
    id: 'VCF',
    validator: 'vcf',
    defaultExtension: '.vcf',
    scriptExtension: 'vcf',
    uploadExtensions: ['.vcf'],
    edgeColor: '#6c5ce7',
    example: '##fileformat=VCFv4.2\n##contig=<ID=seq,length=98>\n##FILTER=<ID=PASS,Description="All filters passed">\n##FORMAT=<ID=GT,Number=1,Type=String,Description="Genotype">\n#CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO\tFORMAT\tsample\nseq\t10\t.\tC\tA\t60\tPASS\t.\tGT\t0/1',
  },
  {
    id: 'LIST',
    validator: 'list',
    defaultExtension: '.lst',
    uploadExtensions: ['.lst', '.list'],
    edgeColor: '#7f8c8d',
    example: 'seq\nseq1\nseq2',
  },
  {
    id: 'JSON',
    validator: 'json',
    defaultExtension: '.json',
    scriptExtension: 'json',
    uploadExtensions: ['.json', '.jsonl'],
    edgeColor: '#415b54',
    example: '{"samples":[{"id":"sample_1","condition":"control","value":12.5},{"id":"sample_2","condition":"treated","value":18.2}],"metadata":{"organism":"example","assay":"measurement"}}',
  },
  {
    id: 'TEXT',
    validator: 'text',
    defaultExtension: '.txt',
    uploadExtensions: ['.txt'],
    edgeColor: '#2ecc71',
    example: 'Hello, World',
  },
  {
    id: 'BAM',
    validator: 'bam',
    defaultExtension: '.bam',
    uploadExtensions: ['.bam'],
    edgeColor: '#9dce32',
    format: 'binary'
  },
  {
    id: 'BAI',
    validator: 'bai',
    defaultExtension: '.bai',
    uploadExtensions: ['.bai'],
    edgeColor: '#ce32c1',
    format: 'binary'
  },
  {
    id: 'MMI',
    validator: 'mmi',
    defaultExtension: '.mmi',
    uploadExtensions: ['.mmi'],
    edgeColor: '#c7ba43',
    format: 'binary'
  },
  {
    id: 'CSI',
    validator: 'csi',
    defaultExtension: '.csi',
    uploadExtensions: ['.csi'],
    edgeColor: '#c75743',
    format: 'binary'
  },
  {
    id: 'BCF',
    validator: 'bcf',
    defaultExtension: '.bcf',
    uploadExtensions: ['.bcf'],
    edgeColor: '#059400',
    format: 'binary'
  },
  {
    id: 'FAI',
    validator: 'fai',
    defaultExtension: '.fai',
    uploadExtensions: ['.fai'],
    edgeColor: '#77016d',
  },
  {
    id: 'CRAM',
    validator: 'cram',
    defaultExtension: '.cram',
    uploadExtensions: ['.cram'],
    edgeColor: '#3b5502',
    format: 'binary'
  },
  {
    id: 'BIGBED',
    validator: 'bigbed',
    defaultExtension: '.bb',
    uploadExtensions: ['.bb', '.bigbed'],
    edgeColor: '#8d6e63',
    format: 'binary'
  },
  {
    id: 'BIGWIG',
    validator: 'bigwig',
    defaultExtension: '.bw',
    uploadExtensions: ['.bw', '.bigwig'],
    edgeColor: '#5c6bc0',
    format: 'binary'
  },
  {
    id: 'FMD',
    validator: 'fmd',
    defaultExtension: '.fmd',
    uploadExtensions: ['.fmd'],
    edgeColor: '#6d4c41',
    format: 'binary'
  },
  {
    id: 'YAK',
    validator: 'yak',
    defaultExtension: '.yak',
    uploadExtensions: ['.yak'],
    edgeColor: '#5d4037',
    format: 'binary'
  },
  {
    id: 'GTF',
    validator: 'gtf',
    defaultExtension: '.gtf',
    uploadExtensions: ['.gtf'],
    edgeColor: '#ab47bc',
    example: 'seq\tStringTie\ttranscript\t1\t30\t1000\t+\t.\tgene_id "gene1"; transcript_id "tx1"; FPKM "12.34";\nseq\tStringTie\texon\t1\t30\t1000\t+\t.\tgene_id "gene1"; transcript_id "tx1"; exon_number "1";',
  },
  {
    id: 'PAF',
    validator: 'paf',
    defaultExtension: '.paf',
    uploadExtensions: ['.paf'],
    edgeColor: '#26a69a',
    example: 'queryA\t500\t10\t490\t+\ttargetA\t1000\t100\t580\t470\t480\t60\nqueryB\t300\t0\t300\t-\ttargetA\t1000\t650\t950\t290\t300\t60',
  },
  {
    id: 'RGFA',
    validator: 'rgfa',
    defaultExtension: '.gfa',
    uploadExtensions: ['.gfa', '.rgfa'],
    edgeColor: '#bf360c',
    example: 'S\ts1\tACGTACGTAC\tSN:Z:seq\tSO:i:0\tSR:i:0\nS\ts2\tGGGGGCCCCC\tSN:Z:seq\tSO:i:10\tSR:i:0\nS\ts3\tTTTTTAAAAATT\tSN:Z:alt\tSO:i:0\tSR:i:1\nS\ts4\tCATGCATGCA\tSN:Z:seq\tSO:i:20\tSR:i:0\nL\ts1\t+\ts2\t+\t0M\tSR:i:0\nL\ts2\t+\ts4\t+\t0M\tSR:i:0\nL\ts1\t+\ts3\t+\t0M\tSR:i:1\nL\ts3\t+\ts4\t+\t0M\tSR:i:1',
  },
  {
    id: 'GFA',
    validator: 'gfa',
    defaultExtension: '.gfa',
    uploadExtensions: ['.gfa'],
    edgeColor: '#ef6c00',
    example: 'H\tVN:Z:1.0\nS\ts1\tACGTACGTACGT\nS\ts2\tTTACGTACGTAC\nL\ts1\t+\ts2\t+\t4M\nP\tp1\ts1+,s2+\t*',
  },
  {
    id: 'GAF',
    validator: 'gaf',
    defaultExtension: '.gaf',
    uploadExtensions: ['.gaf'],
    edgeColor: '#00acc1',
    example: 'read1\t600\t153\t446\t+\t>s1>s2\t600\t153\t446\t293\t293\t60\nread1\t600\t10\t148\t+\t>s1\t300\t160\t298\t138\t138\t60',
  },
  {
    id: 'WIG',
    validator: 'wig',
    defaultExtension: '.wig',
    uploadExtensions: ['.wig', '.wiggle'],
    edgeColor: '#ffa726',
    example: 'variableStep chrom=seq span=5\n1\t1.5\n11\t3',
  },
  {
    id: 'CLUSTAL',
    validator: 'clustal',
    defaultExtension: '.aln',
    uploadExtensions: ['.aln', '.clustal', '.clw'],
    edgeColor: '#7cb342',
    example: 'CLUSTAL format alignment by MAFFT (v7.526)\n\n\nseq1            ACGTACGTAC-GTACGT\nseq2            ACGTACGAACTGTACGT\nseq3            ACGTACGTAC-GTACGA\n                ******* ** ***** \n',
  },
  {
    id: 'SND',
    validator: 'snd',
    defaultExtension: '.snd',
    uploadExtensions: ['.snd'],
    edgeColor: '#ec407a',
    example: '#sample\tgene1\tgene2\tgene3\ncellA\t0.95\t0\t1.2\ncellB\t0\t0.31\t0.8\ncellC\t1.1\t0.07\t0',
  },
  {
    id: 'SAM',
    validator: 'sam',
    defaultExtension: '.sam',
    uploadExtensions: ['.sam'],
    edgeColor: '#1aa3fd',
    example: '@HD\tVN:1.6\tSO:queryname\n@SQ\tSN:seq\tLN:98\nread1\t99\tseq\t1\t60\t40M\t=\t59\t98\tTTGCACTGACCTGAAGTCTTGGAGTATGACCGCGGCTCGG\tIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII\nread1\t147\tseq\t59\t60\t40M\t=\t1\t-98\tCTAGCGCTATAGGTGGTGCCGAAGGCGGTCTGTCGTCGTA\tIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII',
  },
  {
    id: 'NEWICK',
    validator: 'newick',
    defaultExtension: '.nw',
    scriptExtension: 'nw',
    uploadExtensions: ['.nw', '.newick', '.tre', '.tree'],
    edgeColor: '#00897b',
    example: '((A:0.1,B:0.1)100:0.2,(C:0.1,D:0.1)100:0.2);\n((A:0.2,B:0.2)95:0.3,(C:0.2,D:0.2)95:0.3);\n((A:0.3,C:0.3)90:0.4,(B:0.3,D:0.3)90:0.4);',
  },
];

export function getTypeDefinitions() {
  return typeDefinitions;
}

export function getTypeDefinition(typeId) {
  return typeDefinitions.find(typeDef => typeDef.id === typeId);
}

export function getUploadExtensions() {
  return [...new Set(typeDefinitions.flatMap(typeDef => typeDef.uploadExtensions || []))];
}

export function getBinaryUploadExtensions() {
  return [...new Set(typeDefinitions.flatMap(typeDef => typeDef.format === "binary" ? (typeDef.uploadExtensions || []) : []))];
}

export function getDefaultExtension(typeId) {
  return getTypeDefinition(typeId)?.defaultExtension || '.txt';
}

export function getScriptExtension(typeId) {
  return getTypeDefinition(typeId)?.scriptExtension || getDefaultExtension(typeId).replace(/^\./, '');
}

export function getTypeExampleInput(typeId) {
  return getTypeDefinition(typeId)?.example || '';
}

export function getAllTypeExampleInputs() {
  return Object.fromEntries(
    typeDefinitions
      .filter(typeDef => typeDef.example)
      .map(typeDef => [typeDef.id, typeDef.example])
  );
}

const defaultEdgeColor = '#999'

export function getDefaultEdgeColor() {
  return defaultEdgeColor;
}

export function getEdgeColor(typeId) {
  return getTypeDefinition(typeId)?.edgeColor || defaultEdgeColor;
}

export function isTypeBinary(typeId) {
  return getTypeDefinition(typeId)?.format == "binary"
}

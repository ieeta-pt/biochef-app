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
    // t-SNE needs more than three times the perplexity samples: 151 for
    // bhtsne's default of 50
    example:
      '#cell\tSNAP25\tRBFOX3\tGFAP\tAQP4\tCX3CR1\tP2RY12\n' +
      'neuron_01\t7.9\t7.0\t0.2\t0.8\t0.5\t0.0\n' +
      'neuron_02\t8.0\t8.0\t0.3\t0.1\t0.7\t0.4\n' +
      'neuron_03\t8.0\t8.6\t0.3\t0.1\t0.3\t0.8\n' +
      'neuron_04\t8.5\t8.4\t0.5\t0.2\t0.3\t0.7\n' +
      'neuron_05\t5.4\t7.5\t0.7\t0.5\t0.7\t0.1\n' +
      'neuron_06\t6.1\t7.0\t0.1\t0.5\t0.5\t0.2\n' +
      'neuron_07\t8.7\t7.8\t0.2\t0.8\t0.1\t0.1\n' +
      'neuron_08\t7.2\t6.4\t0.2\t1.2\t0.5\t0.1\n' +
      'neuron_09\t8.2\t6.7\t0.2\t0.6\t0.5\t0.2\n' +
      'neuron_10\t7.8\t6.9\t0.2\t0.0\t0.3\t0.3\n' +
      'neuron_11\t8.1\t9.5\t0.4\t0.4\t0.1\t0.2\n' +
      'neuron_12\t6.3\t6.8\t0.0\t0.2\t0.2\t0.0\n' +
      'neuron_13\t8.4\t7.3\t0.2\t0.4\t0.7\t0.5\n' +
      'neuron_14\t6.6\t6.9\t0.1\t0.3\t0.6\t0.5\n' +
      'neuron_15\t7.4\t7.7\t0.1\t0.1\t0.4\t0.3\n' +
      'neuron_16\t7.1\t5.1\t0.1\t0.0\t0.1\t0.4\n' +
      'neuron_17\t7.5\t6.5\t0.3\t0.6\t0.3\t0.3\n' +
      'neuron_18\t7.8\t7.9\t0.1\t0.2\t0.8\t0.1\n' +
      'neuron_19\t8.4\t5.6\t0.6\t0.2\t0.3\t0.5\n' +
      'neuron_20\t6.4\t6.6\t0.1\t0.4\t0.5\t0.2\n' +
      'neuron_21\t7.5\t7.2\t0.3\t0.5\t0.3\t0.6\n' +
      'neuron_22\t10.8\t8.3\t0.3\t0.6\t0.6\t0.0\n' +
      'neuron_23\t7.8\t6.9\t0.4\t0.5\t0.3\t0.4\n' +
      'neuron_24\t6.9\t8.3\t0.2\t0.2\t0.2\t0.4\n' +
      'neuron_25\t7.4\t8.7\t0.1\t0.3\t0.1\t0.5\n' +
      'neuron_26\t7.3\t7.3\t0.5\t0.1\t0.5\t0.3\n' +
      'neuron_27\t6.2\t6.5\t0.2\t1.1\t0.3\t0.3\n' +
      'neuron_28\t6.7\t6.9\t0.3\t0.6\t0.6\t0.8\n' +
      'neuron_29\t6.0\t8.7\t0.2\t0.5\t0.6\t0.6\n' +
      'neuron_30\t8.0\t7.3\t0.5\t0.3\t0.5\t0.2\n' +
      'neuron_31\t8.4\t7.7\t0.8\t0.6\t0.8\t0.7\n' +
      'neuron_32\t9.1\t7.0\t0.3\t0.3\t0.6\t0.1\n' +
      'neuron_33\t7.3\t7.6\t0.5\t0.4\t0.1\t0.2\n' +
      'neuron_34\t7.7\t4.1\t0.2\t0.1\t0.3\t0.7\n' +
      'neuron_35\t7.8\t7.0\t0.7\t0.0\t0.3\t0.5\n' +
      'neuron_36\t6.8\t5.3\t0.1\t0.2\t0.3\t0.8\n' +
      'neuron_37\t9.6\t8.9\t0.0\t0.4\t1.1\t0.1\n' +
      'neuron_38\t7.6\t6.8\t0.0\t0.3\t0.5\t0.1\n' +
      'neuron_39\t6.2\t8.0\t0.3\t0.4\t0.1\t0.2\n' +
      'neuron_40\t7.6\t7.4\t0.0\t0.1\t0.3\t0.2\n' +
      'neuron_41\t9.1\t7.2\t0.1\t0.2\t0.3\t0.1\n' +
      'neuron_42\t7.4\t7.5\t0.4\t0.8\t0.7\t0.2\n' +
      'neuron_43\t8.5\t5.1\t0.3\t0.3\t0.1\t0.5\n' +
      'neuron_44\t7.9\t9.9\t0.2\t0.1\t0.1\t0.1\n' +
      'neuron_45\t9.1\t7.1\t0.5\t0.2\t0.3\t0.1\n' +
      'neuron_46\t6.9\t7.7\t0.0\t0.4\t0.1\t0.3\n' +
      'neuron_47\t8.5\t7.8\t0.5\t0.5\t0.9\t0.7\n' +
      'neuron_48\t7.4\t8.7\t0.5\t0.1\t0.1\t0.2\n' +
      'neuron_49\t7.5\t9.4\t0.4\t0.5\t0.2\t0.1\n' +
      'neuron_50\t7.3\t7.5\t0.1\t0.3\t0.2\t0.4\n' +
      'neuron_51\t9.5\t7.6\t0.1\t0.1\t0.6\t0.6\n' +
      'astrocyte_01\t0.6\t0.4\t6.8\t8.8\t0.7\t1.0\n' +
      'astrocyte_02\t0.4\t0.2\t6.8\t9.5\t0.3\t0.4\n' +
      'astrocyte_03\t0.3\t0.0\t6.5\t7.1\t0.3\t0.0\n' +
      'astrocyte_04\t0.2\t0.4\t7.3\t6.0\t0.4\t0.4\n' +
      'astrocyte_05\t0.5\t0.0\t7.9\t8.0\t0.3\t0.0\n' +
      'astrocyte_06\t0.3\t0.2\t7.3\t7.7\t0.6\t0.1\n' +
      'astrocyte_07\t0.5\t0.2\t8.1\t8.4\t0.5\t0.2\n' +
      'astrocyte_08\t0.1\t0.1\t7.6\t6.8\t0.9\t0.1\n' +
      'astrocyte_09\t0.3\t0.3\t6.6\t7.7\t0.1\t0.2\n' +
      'astrocyte_10\t0.6\t0.3\t6.4\t7.5\t0.0\t0.7\n' +
      'astrocyte_11\t0.6\t0.1\t5.7\t8.0\t0.6\t0.1\n' +
      'astrocyte_12\t0.5\t0.5\t5.7\t6.2\t0.5\t0.4\n' +
      'astrocyte_13\t0.0\t0.1\t7.6\t8.0\t0.1\t0.4\n' +
      'astrocyte_14\t0.2\t0.8\t7.3\t8.1\t0.6\t0.1\n' +
      'astrocyte_15\t0.8\t0.4\t7.6\t5.7\t0.2\t0.6\n' +
      'astrocyte_16\t0.3\t0.2\t6.4\t6.4\t0.6\t0.1\n' +
      'astrocyte_17\t0.1\t0.0\t10.0\t6.8\t0.7\t0.2\n' +
      'astrocyte_18\t0.3\t0.0\t8.4\t7.8\t0.5\t0.1\n' +
      'astrocyte_19\t0.5\t0.1\t8.9\t6.9\t0.4\t0.2\n' +
      'astrocyte_20\t0.5\t0.4\t8.4\t9.0\t0.1\t0.2\n' +
      'astrocyte_21\t0.2\t0.6\t8.0\t7.0\t0.3\t0.1\n' +
      'astrocyte_22\t1.1\t0.5\t7.6\t7.4\t0.7\t0.4\n' +
      'astrocyte_23\t0.0\t0.0\t8.8\t8.3\t0.2\t0.0\n' +
      'astrocyte_24\t0.7\t0.3\t7.1\t8.6\t0.5\t0.1\n' +
      'astrocyte_25\t0.4\t0.2\t6.7\t9.0\t0.2\t0.5\n' +
      'astrocyte_26\t0.7\t0.3\t7.4\t7.0\t0.1\t0.3\n' +
      'astrocyte_27\t0.9\t0.3\t6.2\t6.5\t0.3\t0.2\n' +
      'astrocyte_28\t0.5\t0.5\t7.3\t6.9\t0.6\t0.9\n' +
      'astrocyte_29\t0.2\t0.2\t7.1\t8.2\t0.1\t0.9\n' +
      'astrocyte_30\t0.3\t0.1\t7.8\t6.7\t0.2\t0.5\n' +
      'astrocyte_31\t0.5\t0.0\t8.8\t7.5\t0.3\t0.7\n' +
      'astrocyte_32\t0.1\t0.5\t6.2\t7.8\t0.8\t0.3\n' +
      'astrocyte_33\t0.2\t0.1\t5.8\t6.7\t0.5\t0.6\n' +
      'astrocyte_34\t0.1\t0.5\t9.0\t6.9\t0.5\t0.0\n' +
      'astrocyte_35\t0.7\t0.0\t7.7\t6.4\t0.5\t0.5\n' +
      'astrocyte_36\t0.2\t0.2\t7.2\t8.8\t0.2\t0.1\n' +
      'astrocyte_37\t0.6\t0.1\t8.4\t8.1\t0.2\t0.0\n' +
      'astrocyte_38\t0.6\t0.1\t7.5\t9.2\t0.1\t0.2\n' +
      'astrocyte_39\t0.1\t0.1\t7.1\t8.3\t0.3\t0.6\n' +
      'astrocyte_40\t0.2\t0.1\t6.8\t8.3\t0.2\t0.1\n' +
      'astrocyte_41\t0.2\t0.4\t9.0\t8.3\t0.0\t0.8\n' +
      'astrocyte_42\t0.4\t0.7\t9.5\t10.5\t0.2\t0.2\n' +
      'astrocyte_43\t0.3\t0.5\t8.2\t7.7\t0.2\t0.5\n' +
      'astrocyte_44\t0.0\t1.2\t8.9\t5.8\t0.0\t0.2\n' +
      'astrocyte_45\t0.2\t0.7\t7.6\t7.2\t0.4\t0.0\n' +
      'astrocyte_46\t0.8\t0.6\t6.6\t7.6\t0.1\t1.4\n' +
      'astrocyte_47\t0.1\t0.5\t7.3\t7.8\t0.4\t0.2\n' +
      'astrocyte_48\t0.1\t0.9\t8.5\t7.3\t0.1\t0.5\n' +
      'astrocyte_49\t0.3\t0.3\t7.9\t6.9\t0.2\t0.2\n' +
      'astrocyte_50\t0.2\t0.1\t6.1\t8.3\t0.7\t0.3\n' +
      'astrocyte_51\t0.3\t0.6\t8.2\t8.4\t0.2\t0.2\n' +
      'microglia_01\t0.5\t0.1\t0.7\t0.2\t6.3\t6.5\n' +
      'microglia_02\t0.4\t0.3\t0.1\t0.1\t6.6\t8.4\n' +
      'microglia_03\t0.6\t0.3\t0.1\t0.1\t5.0\t6.9\n' +
      'microglia_04\t0.3\t0.6\t0.5\t0.1\t6.0\t6.7\n' +
      'microglia_05\t0.2\t0.3\t0.4\t0.1\t8.0\t7.9\n' +
      'microglia_06\t0.0\t0.1\t0.2\t0.1\t6.7\t8.8\n' +
      'microglia_07\t1.2\t0.3\t0.5\t0.5\t8.0\t7.6\n' +
      'microglia_08\t0.3\t0.4\t0.1\t0.4\t7.3\t6.5\n' +
      'microglia_09\t0.3\t0.0\t0.5\t0.4\t8.6\t6.6\n' +
      'microglia_10\t0.2\t0.5\t0.5\t0.2\t7.5\t9.3\n' +
      'microglia_11\t0.2\t0.0\t0.4\t0.2\t7.6\t7.2\n' +
      'microglia_12\t0.3\t0.1\t0.7\t0.6\t7.2\t7.4\n' +
      'microglia_13\t0.1\t0.0\t0.1\t0.3\t9.5\t7.7\n' +
      'microglia_14\t0.0\t0.0\t0.0\t0.3\t6.6\t8.1\n' +
      'microglia_15\t0.4\t0.8\t0.2\t0.3\t7.8\t6.0\n' +
      'microglia_16\t0.5\t0.3\t0.4\t0.1\t7.8\t6.2\n' +
      'microglia_17\t0.4\t0.0\t0.1\t0.8\t8.4\t7.0\n' +
      'microglia_18\t0.6\t0.3\t0.0\t0.1\t8.1\t9.2\n' +
      'microglia_19\t0.2\t0.1\t0.0\t0.1\t7.8\t8.2\n' +
      'microglia_20\t0.2\t0.4\t0.7\t0.0\t6.6\t7.9\n' +
      'microglia_21\t0.4\t0.0\t0.9\t0.4\t7.8\t8.0\n' +
      'microglia_22\t0.3\t0.1\t0.7\t0.2\t7.3\t7.2\n' +
      'microglia_23\t0.1\t0.3\t0.2\t1.0\t7.7\t7.1\n' +
      'microglia_24\t0.2\t0.7\t0.4\t0.5\t5.3\t7.0\n' +
      'microglia_25\t0.3\t0.4\t0.1\t0.1\t7.8\t6.9\n' +
      'microglia_26\t0.2\t0.3\t0.1\t0.3\t5.7\t7.3\n' +
      'microglia_27\t0.3\t0.2\t0.6\t0.4\t9.0\t7.5\n' +
      'microglia_28\t0.7\t0.2\t0.3\t0.1\t9.6\t7.6\n' +
      'microglia_29\t0.4\t0.6\t0.1\t0.2\t7.0\t8.6\n' +
      'microglia_30\t0.2\t0.9\t0.3\t0.4\t7.9\t7.7\n' +
      'microglia_31\t0.5\t0.1\t0.4\t0.2\t5.8\t6.5\n' +
      'microglia_32\t0.3\t0.7\t0.1\t0.2\t5.6\t10.3\n' +
      'microglia_33\t1.2\t0.8\t0.2\t0.8\t8.6\t6.8\n' +
      'microglia_34\t1.1\t0.2\t0.2\t0.6\t6.9\t8.9\n' +
      'microglia_35\t0.6\t0.3\t0.2\t0.7\t7.0\t7.1\n' +
      'microglia_36\t0.2\t0.2\t0.5\t0.1\t7.3\t7.1\n' +
      'microglia_37\t0.0\t0.1\t0.3\t0.1\t7.5\t7.9\n' +
      'microglia_38\t0.1\t0.4\t0.2\t0.1\t7.9\t6.6\n' +
      'microglia_39\t0.2\t0.4\t0.1\t0.3\t7.0\t7.1\n' +
      'microglia_40\t0.0\t1.0\t0.1\t0.2\t6.6\t7.8\n' +
      'microglia_41\t0.4\t0.7\t0.5\t0.3\t8.1\t8.9\n' +
      'microglia_42\t0.0\t0.1\t0.6\t0.6\t8.0\t7.7\n' +
      'microglia_43\t0.6\t0.1\t0.1\t0.4\t6.7\t7.2\n' +
      'microglia_44\t0.4\t0.3\t0.3\t0.3\t6.2\t8.1\n' +
      'microglia_45\t0.2\t0.1\t0.5\t0.3\t8.0\t7.7\n' +
      'microglia_46\t0.1\t0.5\t0.4\t0.1\t8.9\t6.7\n' +
      'microglia_47\t0.4\t0.2\t0.1\t0.2\t7.6\t7.3\n' +
      'microglia_48\t0.0\t0.3\t0.3\t0.8\t8.5\t8.1\n' +
      'microglia_49\t0.2\t0.2\t0.1\t0.2\t8.6\t5.7\n' +
      'microglia_50\t0.8\t0.2\t0.3\t0.5\t8.3\t8.9\n' +
      'microglia_51\t0.7\t0.3\t0.2\t0.4\t6.7\t7.5',
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
  {
    id: 'LONG_READS',
    validator: 'longReads',
    defaultExtension: '.fastq',
    uploadExtensions: ['.fastq', '.fq', '.fasta', '.fa'],
    edgeColor: '#bf360c',
    example: [
      '@read1',
      'GCTAAAGACAATTACATAACATACACGTCAGCACGAAACTTGTTGGCCCAGTGTGAATCGCTTAAGGGTTAAGTAAGTGT'
        + 'GATGCATACGCCTTTACTTGCTGTGTCCACCCCATCGGACTGGCATTTTTATTACACTCAGAAACAGAACTCGGGTAATT'
        + 'TTGACAGGTCACGCAGAGGCGCGCCCTCCTGAAGTGCGTGGACACTCGCTATGAATCTCTGATTTACCCACTCTGCCAAA'
        + 'CTCCAGCGCGGTCAGTTCCATCACCCTAAGTAACCGAATAATGCGTTCGCTCTATTGACTACGACGCGCTCATTCCCTTG'
        + 'TCGGAGAGTTATGGAACAAGGACGCTGTCTGAGACTAGAAGACAGATAGTGCACACGACCGGCGTCGGAGAAACTCTATT'
        + 'TGCCGCCTGACAAGTCAATGCGATCCGTAGGGGCAGCGCAGTATGCCAAGACTATAGGCACTGTCGCATCACAAACGATT'
        + 'AACTGATAAATGAGCCCTTTATGACACGGGCATATGACTGGTTTACGATAGTATGTCCAACGGCGAGCTTTACATTTGCT'
        + 'GTGAGAGGTACAGGGATTAGTGAGAAGCCGTGCGTATCAATTCGTACCTTGGGGGTCGTTACCACTCTGTTCCCACGAGC'
        + 'GGCATTTCTGGATGGCCAGCTTTTGACATTTAATTTCACCCATAAACCAGCGTAAAGCTGCAAGTGGCTCCATGAACTTA'
        + 'GCTGCTAGTGTCAGACTCGCCTCGGATCCTTACTACACTAACTTGAACGCCTAGTGGTCAAAGAGTACTGGTAATCGTCG'
        + 'GTATCTATATAAGCAGGGGAGGGGAAACATTTGTTCTCAGCCGGTGACTCCTAATGCTAAGACATTTCCCTTCAGGGGGG'
        + 'GCTCCCCCGCGATGCCATAAATCTGAGCAACCAGCTGAAGCAGGCACGACAGTGCGACATTATATCACTGTGGTAGGTTA'
        + 'GCTTCATCTAATGTCCAACTAGCCGGCCAATTCGCATGATACCTCTCCATCTGACCCAAGATTGTGCTTGTTCAATTCTT'
        + 'CTTAACGTGATAACAGAATCAAACCTGCCAGGCGGTCGTCGCGGACCTCGGTCGAAGTAGTGGTGCGGATCCAGGGGAAC'
        + 'CGTTGACTCAAAAGGAGCTGCCGTCCACCTAACGTGAAGTTCCAAAATCCCAAACCTCTCGAGATATTTATCCAGCAAGG'
        + 'AGTGGCAACGCCCGCTGCTTTAATCGCTACCAAAACGCAAACAAAAGCATACCCAAAAGTACACGGGTGAGGGAGGTGAT'
        + 'ATAGTACAGCTACGAAGTATCTGGCGCCTCAATAGGATTATAGCGGTCTCTCAGGCTGCTTGCCGTCCGGCCCGGCCGCG'
        + 'ACACTCCGGTGCAAGCTTAATTCGTACGTACTTCCCATTGGATCTCGTTTATCGATTAAGCCCGATCTAGGTTCCTAGAG'
        + 'GTTAAATTGGACGTCTTCCCACTCCGTTGCTGCGTGTCTAGGCGGTTTAGCGTAAGCGAACAGGACCCTGCCTCAGCTCA'
        + 'TAAGTCCTTATTCTCTCACGTTGTGTTACGAAAGATTCACTCGAGGTCGTGTGAGGGTTGGGCTAGCGGCAATTATGAAA'
        + 'CTATCACATCACATAAGCGGGCTAGATATAATTTAATCTTAATCCATAAAACACTAGCTCAGCAGTTGAAAAAATGGCTA'
        + 'GGTTCCAGCTTTTGGGGAGACGTCTTTCTGAGGGTCAGCCGTGATTCCGATTCGATTAGACTGGTCCCCACGGGTCCATG'
        + 'AGTACGAGGAAACTCGGTATCGAGCCTAAAAGTTATAAGGCATCTCGCCCAGGAAAGTAACGACGTATGGGTAGTTCTCC'
        + 'ATCACCAGCTATAATGGCTAGCGCACTCTCGTTCCAGGGCGTAGTTACACTGAGCGTGCCATGTCAGCATGCTAGCGTAT'
        + 'CGCCCCCCAATGCCCCGCAATAGGGTAATTCGCCGACGAGTAAGCGTAGATTACACACCCAGGAAACGATCTAGACAGAT'
        + 'TGAAATCCCCTTCATTATAGGTCGTGTAGCGCTAGACAGTCACCTTTAAAGGAAGAATCAGAGGCAAGATCTACGTGGCA'
        + 'GTCTCGTGTTGACGCCTTAGCCGGTGGCGAACAGTATTGACCTGGCCGATGCTAATATTCTGATTTGGGGTTGATTTGCG'
        + 'CTTCAGGCGCTAAAGTGGTTTTGAGTAACATGTCCTTTTGACGGGAGCAGGTCGCCTCAAGATAAGAGTAAACCTGCCTA'
        + 'CCAAAACTTTAAGCCGGCAGAAGCTTAACTATACCCACCGATGTGTACTCTGTTACACCGTCAGTGAGTGTAATGCTCTG'
        + 'GCTAGAGCCCACGCTTCCGGCTTCGTCCTCGTGCTCCAAGTACGATACCGCAAGGCAGACGCTGGTTCGCAGGTATCTGA'
        + 'CGAGCATACTCGCTAGCCTGTGAAGAACAAGCGATTCGAGTTGTACTCTCAGCCCGCACGGTACGCCTTCCATCGGCCCG'
        + 'ATCCTTCAGAGTCAAGGCAG',
      '+',
      '63?/1/+><<7;.)&-2=3.6?0:;=2*7\'*?,*<77?;,07)<:(/3(65:9*;?360&318\'>=1\'518>&2-)7,-6'
        + '1\'.(?.,=9777*.;/10+0)88?.0&\'>1&4=.5:\'=,/.(=<5&986;*25=82+,.*;),\'7/?0?0\'+3(<>/.;2'
        + '5(7(7:--7.8+?/\'=5825-736:4(4>,-50,19&=8863\'08+7-901+>,/3148(6)6&,8<7>+4446*7754&'
        + '/.+&40>0,\'.)6;<&&)5</9,>)>&47>-:&2?)3\'=7\',7..117832&6>0(>=?\':=/00)0*7-5/4).-(;3/'
        + ';,51*,6?8*?/(3462>69>*;7*+8705?/3(9-+<*>-3707>4>6?*/-5.6,1&:)05(3(62-+(/(/0>40**'
        + '=./2086:*3)>::>?.-,,71=32.(/2:,0&\'88\'1;:5239.</4>+>3,,,1=<,->:2(4;,1=6?*85=4:(*-'
        + '3>2-;2250<?-02,+5&5)3:5)+5&.5*,+.*\')/4\'(/9:.7/:26.?8\'>:&<7/79(<\'./915,>6)\'11540?'
        + '>51-&9??)16?*2)97(\'<2);=4*:,7?4\';.&8)>)*5-/?://907&3(2&:4)07>0=4>\'5(7:4/9)=8;*>('
        + ';0;\'*8;,/=3?()>2?\'5633?>;.8-86=29*>=-0-;050?,9),>64,43139\',)-&.\'.<132<\'776>&&:7>'
        + '0<80??;+?189;09-.844)*&*46*<48&&+22;<2).,,*<&940*5-3<1.<=45(+)-5-/).6=8.04.62&4?'
        + '.=+6,,)\'1)<\',1>0-,6++899&5\'<>:43306748\'&((9+/>8?2:\'*/+?0=+=005-84/:=:<3,+893/47/'
        + ':\'<>?6=0*0\'&=/?)(18)6,(?>1+5950*45,9-?3&?-?7,>6:(38-5.8/7+04*;0>..(=5.42?;&6>+3;'
        + '0&,:=\'5/)9?::1.61</<-\'-&5(>3\'2:=19->9:..6/87\'&.:?1&<8=-7*;4\'0?(9>91\',/6?.7=,6&13'
        + ').>=;=8.:767278,9*/\'8<+49:/)+(\',,?-16/5&(3748<<;+):>052<6&634,9?&)&.09?,+;?89,2<'
        + '=).;,,.*17;*6/((:5/:73308,6<--/.2/+,92:70-.>&,06>1;/41262.:+,\'9.8831-+07?5\'-+,;,'
        + '))630<;\'-*6*1.&,138<:(>=.0(311-,0*<53\'\'+3;\'\'8(06?3<+8911.\'&356:+&;0-*9(+:6>\'35?9'
        + '-\'0(-&&:&8*8(0:,07=&\'59*+*>3>(6\'=;0?-0,.85>:?7;:,7<,-4**3452);<>):2+<:9;>./);\',<'
        + '+6&3+?+*>?+11>\'/2:=.\':.85/7+6<<-6(?\'886.1:533+\'-?5>\'5.\'(/772+:/\')74,=(663.0&115:'
        + '7><&?/329?/)+.=6--260**0((0+;*06/39;,:,29>;)2&547.<25*>2/50\'/-,:>:78?\'(333.7,>.2'
        + '-3,7-9683*:0,+;4,\'5;1;+/:/80,4;\'+824>/*-6053,&.;2>/>&3*/-:1?,(??9.8;4/=><;;,633&'
        + ':/)0)&8<*4(-41/8555);(+\'((?13>4(82.4/997..5);1/33.0)\'?:/66&*447&34&;+6--07.;8?18'
        + '>6-53002+/&<7\'359<?..4;-2.0(3(,?07-,.96389/)>=6-=2\'5?&6<;)2&1:48+&-:>/&3538=:\'58'
        + '3;5=?(/-;-&3*;611<389>3/\'\';94&/--)(-&)\'753&?2?.3?+//=\'(78,()+(4+,3220>&\'\'39;;9:('
        + '781?9/-:+,<52(5=6<7=,2(5?**1-):9./;>7\';\'563(+/0;42+=)>8?&?8:4-8)+*4<<-.95:*9(0-4'
        + '-/97/53>;;3;7,=7,>?18&-2<:5=.&-86,)1776?48??2,??-?>+4032>+31/&62(8+.16-7*5.?=3/;'
        + ',2&>6**3?+>*9*6:<\'5&11>;;/=3/692<+:8*&>/4;+53=12(\'*8).6:(+>4>6=(216+14/<\'?1=>.(1'
        + '\';*1:51,,+0;&>=+;0?,-6;1(0,:61\'1-90=;52=91<6/5-)9&:-3.>)(08)*3,.\'=?7<,1.&.>**&0-'
        + '-56&&91<4732&(=7/-<,<9:?89<>(:45=,>=9\')7&<):/3.5963*1(;79(7625,7=<&+5(;01:39<&-8'
        + '6=;(8>+.\'+(::(+48><)*4:?-?/8:)11:/:25*64&/\'5,;\'(323,7.\'8=;38+)7?<-<?+3*+=2=,(:3,'
        + '3&;47=/*&<9.4<8+&=>*)7;\'-&?-9=-=(\'\'0\'*)<&>1--4*<>+=,758\'/?-+;455=)/<5-&?-<4(<5&4'
        + '<7=2?/&/=<=?*50:635858):0)43\'2+(0\'2*99*\'9=7+125?:3728)6?)+4\')6;=.2;3(;/+<&=2+.*7'
        + ';7>473++0+7?,\',.5=/=',
      '@read2',
      'CGCGCCGACCTGGCCGATTGTGCCTCTCGAAATCCTAATTTGCCAACGTACTGCCTTGACTCTGAAGGATCGGGCCGATG'
        + 'GAAGGCGTACCGTGCGGGCTGAGAGTACAACTCGAATCGCTTGTTCTTCACAGGCTAGCGAGTATGCTCGTCAGATACCT'
        + 'GCGAACCAGCGTCTGCCTTGCGGTATCGTACTTGGAGCACGAGGACGAAGCCGGAAGCGTGGGCTCTAGCCAGAGCATTA'
        + 'CACTCACTGACGGTGTAACAGAGTACACATCGGTGGGTATAGTTAAGCTTCTGCCGGCTTAAAGTTTTGGTAGGCAGGTT'
        + 'TACTCTTATCTTGAGGCGACCTGCTCCCGTCAAAAGGACATGTTACTCAAAACCACTTTAGCGCCTGAAGCGCAAATCAA'
        + 'CCCCAAATCAGAATATTAGCATCGGCCAGGTCAATACTGTTCGCCACCGGCTAAGGCGTCAACACGAGACTGCCACGTAG'
        + 'ATCTTGCCTCTGATTCTTCCTTTAAAGGTGACTGTCTAGCGCTACACGACCTATAATGAAGGGGATTTCAATCTGTCTAG'
        + 'ATCGTTTCCTGGGTGTGTAATCTACGCTTACTCGTCGGCGAATTACCCTATTGCGGGGCATTGGGGGGCGATACGCTAGC'
        + 'ATGCTGACATGGCACGCTCAGTGTAACTACGCCCTGGAACGAGAGTGCGCTAGCCATTATAGCTGGTGATGGAGAACTAC'
        + 'CCATACGTCGTTACTTTCCTGGGCGAGATGCCTTATAACTTTTAGGCTCGATACCGAGTTTCCTCGTACTCATGGACCCG'
        + 'TGGGGACCAGTCTAATCGAATCGGAATCACGGCTGACCCTCAGAAAGACGTCTCCCCAAAAGCTGGAACCTAGCCATTTT'
        + 'TTCAACTGCTGAGCTAGTGTTTTATGGATTAAGATTAAATTATATCTAGCCCGCTTATGTGATGTGATAGTTTCATAATT'
        + 'GCCGCTAGCCCAACCCTCACACGACCTCGAGTGAATCTTTCGTAACACAACGTGAGAGAATAAGGACTTATGAGCTGAGG'
        + 'CAGGGTCCTGTTCGCTTACGCTAAACCGCCTAGACACGCAGCAACGGAGTGGGAAGACGTCCAATTTAACCTCTAGGAAC'
        + 'CTAGATCGGGCTTAATCGATAAACGAGATCCAATGGGAAGTACGTACGAATTAAGCTTGCACCGGAGTGTCGCGGCCGGG'
        + 'CCGGACGGCAAGCAGCCTGAGAGACCGCTATAATCCTATTGAGGCGCCAGATACTTCGTAGCTGTACTATATCACCTCCC'
        + 'TCACCCGTGTACTTTTGGGTATGCTTTTGTTTGCGTTTTGGTAGCGATTAAAGCAGCGGGCGTTGCCACTCCTTGCTGGA'
        + 'TAAATATCTCGAGAGGTTTGGGATTTTGGAACTTCACGTTAGGTGGACGGCAGCTCCTTTTGAGTCAACGGTTCCCCTGG'
        + 'ATCCGCACCACTACTTCGACCGAGGTCCGCGACGACCGCCTGGCAGGTTTGATTCTGTTATCACGTTAAGAAGAATTGAA'
        + 'CAAGCACAATCTTGGGTCAGATGGAGAGGTATCATGCGAATTGGCCGGCTAGTTGGACATTAGATGAAGCTAACCTACCA'
        + 'CAGTGATATAATGTCGCACTGTCGTGCCTGCTTCAGCTGGTTGCTCAGATTTATGGCATCGCGGGGGAGCCCCCCCTGAA'
        + 'GGGAAATGTCTTAGCATTAGGAGTCACCGGCTGAGAACAAATGTTTCCCCTCCCCTGCTTATATAGATACCGACGATTAC'
        + 'CAGTACTCTTTGACCACTAGGCGTTCAAGTTAGTGTAGTAAGGATCCGAGGCGAGTCTGACACTAGCAGCTAAGTTCATG'
        + 'GAGCCACTTGCAGCTTTACGCTGGTTTATGGGTGAAATTAAATGTCAAAAGCTGGCCATCCAGAAATGCCGCTCGTGGGA'
        + 'ACAGAGTGGTAACGACCCCCAAGGTACGAATTGATACGCACGGCTTCTCACTAATCCCTGTACCTCTCACAGCAAATGTA'
        + 'AAGCTCGCCGTTGGACATACTATCGTAAACCAGTCATATGCCCGTGTCATAAAGGGCTCATTTATCAGTTAATCGTTTGT'
        + 'GATGCGACAGTGCCTATAGTCTTGGCATACTGCGCTGCCCCTACGGATCGCATTGACTTGTCAGGCGGCAAATAGAGTTT'
        + 'CTCCGACGCCGGTCGTGTGCACTATCTGTCTTCTAGTCTCAGACAGCGTCCTTGTTCCATAACTCTCCGACAAGGGAATG'
        + 'AGCGCGTCGTAGTCAATAGAGCGAACGCATTATTCGGTTACTTAGGGTGATGGAACTGACCGCGCTGGAGTTTGGCAGAG'
        + 'TGGGTAAATCAGAGATTCATAGCGAGTGTCCACGCACTTCAGGAGGGCGCGCCTCTGCGTGACCTGTCAAAATTACCCGA'
        + 'GTTCTGTTTCTGAGTGTAATAAAAATGCCAGTCCGATGGGGTGGACACAGCAAGTAAAGGCGTATGCATCACACTTACTT'
        + 'AACCCTTAAGCGATTCACAC',
      '+',
      '0+;\'-..=-),=2/51/(9</;0/2</<=;-+:<9,1(3</&.\'>+=?<*908\'&5\'7),)=)&<7&+89-4:6;?+\':7'
        + '(5--12())=-\'/56>7,2,?\'+::<=+-&72570>(:\'<8/+45\'9(1=2>/\'70??&)/8?<+-*1>)\'.?->?(\'?*'
        + '-2>/\'\'4=:*/11:(.1,2/11--+=3?&66.6)=7*75/61<839)(+2;::=)..<);\'68<789,&:2,3<4:*;;/'
        + '?,>&.5:*,7&\'*);0:).7<+2+,)79&/)5+2<((.:788,.,\'\'=9,<<=5.<\'5.39:99:4->*)<;6/2===55'
        + '.)=0?6/7378401560;+61,=+5;0)2**8/<.,3=1&7:4>&1,2?:.-7\',\'?+/9?(-89(17:848)</33.8<'
        + ';1,*\';?02?1+58,>-19:56-58/*,3..53756.?;-8)8774)?&.80:):+;+??.7+;)8(>&7<,.\'76:068'
        + '413;(:71/?02;?&0352?)<7/:,?,41/70.:.38=(.8860?/8;6<8,(?\',04;;7=\'29-)0=(;=6,+)(1:'
        + '(0,,\'?,*52)=>3*9>>)-?>.0))&(5-:=;;267:5&168,:\'610,/=>814,*981)>*;-9/>.02&5*79>3>'
        + '---.200*)\'?&?(&3:.&=94=\'&(3-?(=35>880=<4<4?04=7;?0-(\'6(3+&96:>=12\'54(>/:3.5+653/'
        + '.:-18*7?64/&91335**/5?=45012;2/+;(64+8)2+3.>6,\'3;\'+9=>4,065272.5.-1\'?89&2(2()-<2'
        + '+(0<?<33=>41;.963644;80-2:17))?,<=/&5+>(36)/+\'7,4&=;,?=&2>;<&=44(;7(6):+=;98&0:6'
        + ';71);&1\'9;6<?,698,/-1?0+=-=,;?-+91,9-8>:/924*4)-8<0&>;4/\'\'7*:7?)0;;\'\';=>1+0\')2-2'
        + '460.0>6/4<.0:,99*.83&-=*5.*)=8;+*57>/.,+3+>0.=.47:37>5==(/01>4\'*.4=:-?)(,59<).90'
        + '95/;&=6>?+,66/451&=)-?:93719.9+7--,2<(+.&&9>(=/31.=*-873,2<,849*+<(-<?9*7-46=.>&'
        + '-2(7/\'<141;?&5?++57?;=/3/47/=3(3(=>8&=>0*02+(?+>-<(?0;(348?4;<):6-:6-7<<=2:5(->&'
        + ',5<\'7&/>,&2,=;*0>08<*?)649./*1:9=,3:46(-/-:,(7/9*(3\'>9+62(28*431>++/27?\'8.=()9\'.'
        + '+209-=\'>/??,=9;.?86=.2(4?773;9)76/8;9&9/7:??;<:&=&-<>)389>+8-/.9/<;91919+0<>1*<)'
        + ')*529,47*7/?&((44&,<+09&=:8(9:=57<19?,96,2::\'35)+/;>89;4;9\'2\';3:-?1=+1?;96-427/5'
        + '-)&/\'1/--1\'34185/9?/&/+9*8+8)(),27.<5</.+>6&+-+7(9>,*)?,982\'6/04(98;&2)1/&1+\'4+7'
        + ').-&*/2(+?=)&1<4;37((06<(&67/<3?6?+<,)\'5*?87:--&.7;9\'=,08?<)6?958(>/5<)5==?<1490'
        + '6*9?+18)1<=694+6&?;;220?4(\'(3=2().;0+1:889&7)58\'?*>.>?)/<47,-*&1>:<,=3*77-=3*94.'
        + '/\':478/73-.1<1>0+1=),+5:><0(4+&-4-*,<33.034)+->80<8*-7<4,+=4<><*<154+3+?\'.968/95'
        + '.2.+8.\'=5?8)91,*02=\'64(\'.&8.72)5(/7&)?0?>746858+*:8>9291):>6&=-(<8?>*8<51)4+>,+,'
        + '646:2?)\'5<+)->2,:43+-:)+;,108:\'=43*334621363(65)?(4.\'43,0=>\'=2**1),(4>,<<;1*/&,:'
        + '0</4)/465*288;&8/6*-?62/17<4\'4-/9>3>84)9><:8/3\'9?423(;5\'-8->-29+?76(0(63+0/(*21\''
        + '<<0.?)?.0<=:+30916;71=-1-*4)/.?2?661==383*/4086505(<,:3586==5-86=>5.(+144167>?*+'
        + '2)+?(15>-:(/??((,**2*935=(>3*9<:&33426-4*?;>;*=)2819>8\'>0,):;1/61\'2+?\',*<-(.?(*9'
        + '<47.5);:>;-=.57\'/256/9\'2)65<,.332;<\'&1-0+-<*933)4\'05<0++\'9>6/=?/?)05555,:-?*=9;0'
        + ';49/6405<*1:4+6=.0,38(6\'(?758271(?8(4<9*5*,;4\'?>4=;48:+2;(67\',8),<<+85)19?,-.)-;'
        + '9<5;</5)0\'9=.->794-9-;(5,>)=*&/36,,:.5585/,22<*:=,:34172&(?++<:*.4\'.2*(.*>=8\'/?:'
        + '/.&22749\'/=75=<.)&87\'7+\';,:0357+9110\'7.9\'68,19.37*;+4:?7/).\'\'\'</434;2\'.3=2*0;*:-'
        + '70,::5?(>;*2-6;=.121',
      '@read3',
      'CTGTGTCCACCCCATCGGACTGGCATTTTTATTACACTCAGAAACAGAACTCGGGTAATTTTGACAGGTCACGCAGAGGC'
        + 'GCGCCCTCCTGAAGTGCGTGGACACTCGCTATGAATCTCTGATTTACCCACTCTGCCAAACTCCAGCGCGGTCAGTTCCA'
        + 'TCACCCTAAGTAACCGAATAATGCGTTCGCTCTATTGACTACGACGCGCTCATTCCCTTGTCGGAGAGTTATGGAACAAG'
        + 'GACGCTGTCTGAGACTAGAAGACAGATAGTGCACACGACCGGCGTCGGAGAAACTCTATTTGCCGCCTGACAAGTCAATG'
        + 'CGATCCGTAGGGGCAGCGCAGTATGCCAAGACTATAGGCACTGTCGCATCACAAACGATTAACTGATAAATGAGCCCTTT'
        + 'ATGACACGGGCATATGACTGGTTTACGATAGTATGTCCAACGGCGAGCTTTACATTTGCTGTGAGAGGTACAGGGATTAG'
        + 'TGAGAAGCCGTGCGTATCAATTCGTACCTTGGGGGTCGTTACCACTCTGTTCCCACGAGCGGCATTTCTGGATGGCCAGC'
        + 'TTTTGACATTTAATTTCACCCATAAACCAGCGTAAAGCTGCAAGTGGCTCCATGAACTTAGCTGCTAGTGTCAGACTCGC'
        + 'CTCGGATCCTTACTACACTAACTTGAACGCCTAGTGGTCAAAGAGTACTGGTAATCGTCGGTATCTATATAAGCAGGGGA'
        + 'GGGGAAACATTTGTTCTCAGCCGGTGACTCCTAATGCTAAGACATTTCCCTTCAGGGGGGGCTCCCCCGCGATGCCATAA'
        + 'ATCTGAGCAACCAGCTGAAGCAGGCACGACAGTGCGACATTATATCACTGTGGTAGGTTAGCTTCATCTAATGTCCAACT'
        + 'AGCCGGCCAATTCGCATGATACCTCTCCATCTGACCCAAGATTGTGCTTGTTCAATTCTTCTTAACGTGATAACAGAATC'
        + 'AAACCTGCCAGGCGGTCGTCGCGGACCTCGGTCGAAGTAGTGGTGCGGATCCAGGGGAACCGTTGACTCAAAAGGAGCTG'
        + 'CCGTCCACCTAACGTGAAGTTCCAAAATCCCAAACCTCTCGAGATATTTATCCAGCAAGGAGTGGCAACGCCCGCTGCTT'
        + 'TAATCGCTACCAAAACGCAAACAAAAGCATACCCAAAAGTACACGGGTGAGGGAGGTGATATAGTACAGCTACGAAGTAT'
        + 'CTGGCGCCTCAATAGGATTATAGCGGTCTCTCAGGCTGCTTGCCGTCCGGCCCGGCCGCGACACTCCGGTGCAAGCTTAA'
        + 'TTCGTACGTACTTCCCATTGGATCTCGTTTATCGATTAAGCCCGATCTAGGTTCCTAGAGGTTAAATTGGACGTCTTCCC'
        + 'ACTCCGTTGCTGCGTGTCTAGGCGGTTTAGCGTAAGCGAACAGGACCCTGCCTCAGCTCATAAGTCCTTATTCTCTCACG'
        + 'TTGTGTTACGAAAGATTCACTCGAGGTCGTGTGAGGGTTGGGCTAGCGGCAATTATGAAACTATCACATCACATAAGCGG'
        + 'GCTAGATATAATTTAATCTTAATCCATAAAACACTAGCTCAGCAGTTGAAAAAATGGCTAGGTTCCAGCTTTTGGGGAGA'
        + 'CGTCTTTCTGAGGGTCAGCCGTGATTCCGATTCGATTAGACTGGTCCCCACGGGTCCATGAGTACGAGGAAACTCGGTAT'
        + 'CGAGCCTAAAAGTTATAAGGCATCTCGCCCAGGAAAGTAACGACGTATGGGTAGTTCTCCATCACCAGCTATAATGGCTA'
        + 'GCGCACTCTCGTTCCAGGGCGTAGTTACACTGAGCGTGCCATGTCAGCATGCTAGCGTATCGCCCCCCAATGCCCCGCAA'
        + 'TAGGGTAATTCGCCGACGAGTAAGCGTAGATTACACACCCAGGAAACGATCTAGACAGATTGAAATCCCCTTCATTATAG'
        + 'GTCGTGTAGCGCTAGACAGTCACCTTTAAAGGAAGAATCAGAGGCAAGATCTACGTGGCAGTCTCGTGTTGACGCCTTAG'
        + 'CCGGTGGCGAACAGTATTGACCTGGCCGATGCTAATATTCTGATTTGGGGTTGATTTGCGCTTCAGGCGCTAAAGTGGTT'
        + 'TTGAGTAACATGTCCTTTTGACGGGAGCAGGTCGCCTCAAGATAAGAGTAAACCTGCCTACCAAAACTTTAAGCCGGCAG'
        + 'AAGCTTAACTATACCCACCGATGTGTACTCTGTTACACCGTCAGTGAGTGTAATGCTCTGGCTAGAGCCCACGCTTCCGG'
        + 'CTTCGTCCTCGTGCTCCAAGTACGATACCGCAAGGCAGACGCTGGTTCGCAGGTATCTGACGAGCATACTCGCTAGCCTG'
        + 'TGAAGAACAAGCGATTCGAGTTGTACTCTCAGCCCGCACGGTACGCCTTCCATCGGCCCGATCCTTCAGAGTCAAGGCAG'
        + 'TACGTTGGCAAATTAGGATTTCGAGAGGCACAATCGGCCAGGTCGGCGCGGCAAATACTTTCGACCCCTTAATTCCGAAT'
        + 'CGAATGATACCTGATGCTAG',
      '+',
      '\'\'41<73=5-,-6?1+07?/61<33.<-*;&==(2;*=\')<-2?>78,+;4(\',10;92)?&,8<+*5-;:44?7&9/;-'
        + '&\'2,))(7,<1-85(6,(\'305=)),52>0\'1.&<==>)/>.))?4.7)*45;<(\'=,-9;&*\'*1.771+9=<62:4:*'
        + '\':?>4096)>)4-4:5246(-=.);=1,>?/72=5799+.=.-3:8:245/+23(+(.+=683>8>>;6:()-1*82>(-'
        + '+>5:2&==+\'+?/.;;1&?,8,-4+396;?\'540,2,;&83**(27:5<;5,9,78/)9,+14628;39.\':961<+,0='
        + '4.5*6**,+9<44)>.4=?(<?<3=7;?1)5>??)(:.*7;7/8\'7,>=:15&2&\'9,)>*+02&170=:1-<=?)59>/'
        + '.+60<:(:<\'.\'9-,&8123+,8;3&7(49)3?;22677;>48&09<)/2/0&\'5:/1481832,=&*6?<(15)1+>5-'
        + ';/-69=>)8):0?+=,2+5::<<-3*0:2<(\'49.9>8(4122\'173,:0.&3:1\'\'8:+14*-28+58*>>&?1</)-8'
        + '40*(8<?6?(;92=+>/8*+?1:1200/;:.+=+>=:&)\'5,/+-0(?;\';*0+**:=.=.-)\'&;,2;\'<6(-(=-13)'
        + '-)9\'62>9++617:8.*854=7>*5?8+9.\'3:(>8<+)/2;5,1*\';1;=7;74?;?28?58,<8;&3,.=7932&,\'8'
        + '//)0*=5=>=\'9/7/3+9789\'-3-&6/1(-55\',,;2)79&&-9=8&4440>3-0-<&-:+09&&1;*72846/18<6&'
        + '**-\'1,+,=*,/(+<;\'6((?1-<94-)++=7=6;9==*33*>)18>=\'&-\'01=.*\'0\'28(9->\'+/5(50/972<9?'
        + '(&+3)3;/648.15.5985(.:=.-*?3&>571/6\'1-.5=>(;48+,3-?40?\'\'37)7)94=>\'(/+*1+<>:.79=6'
        + '7(><<3:)5;;*5/,>/<\'2+5090).&/,\'(0;4?9)985-280&8-,&<21:;\')*/\'919=82(3.93:1*::.7<0'
        + '/,(0.<,?8&=2,4:26*>2544,076*7101;\'*6*212+3,<.-:,(<&9023>1)\'9<\'>*-15?*,;;6,>1/8)9'
        + '<1<921/1)94=<&)44,21,4.*3>44-):\'\'\'66-:.4-;+):53?;2+7.\'<?:?=*5(:356*>2=</+-/7;952'
        + ',\'+9+07:2/-6<9*:;>,<595**;29<*>;/4,6502+5/(0.40>&3-:=-48>59=:\':3/53&&=*;\'3=:-08/'
        + '>05<2279..,*(?>./,2;:)+-95,+*9<<,>:1*:00.+&,*4(*1(.)=8;4:&8*13&.;65198=>71,.>?&/'
        + '9:+.-996187>55+942;.0..*3(*0*6>/;-?,)*&/+=&;+12?88;9>:*58595&\'.;5*3/:(\';66&?<208'
        + '594,4;/2/766)&0:&24/;8:+4?05-4.::&?10,,<?;(>11**((095*3878(2-:\'7.>4.86)&/6;.,-.+'
        + '*7,\'\'5&/)*5+-97:.6,1:+*?(4((;48,<:?3(;?&6707,=8(426.:726=8/61294+(6>1?>==915:/*,'
        + '(1>*0;)1:5<+&;9->&\',000<-?2\'13155;59>,3<<?<5\'4-=?=(5:.6(<(\'.32>:+0?5-4>4*&)+,1*;'
        + '<?69693\'/+6728(3+)9=(=7:>/\'29320.>&=7*4-9=(/3*8)<-06=;5?9-;.4.,21=4>2?3)5=9*=*97'
        + ')<8)<320,:&5?;?4=>8=.,394?270<,&;?9-08/5:0.3,1?)96),352\'15625?;7-7-?-2-/38,1;8**'
        + '3<1>+97==(</;?96.):84\'3:<.<=,4)./5::5;;1=17=3649>>9\'*\'*88=8>44<*<\'8-=.0>70&(<-50'
        + ';-\'\',8>,*+:<,+4:1:=5:<86;30><57<)8>/=*62*)&15>(>8/=*&6&1\';.39)2;1?<,1=41.+;70:6<'
        + '*)0>&-0?(:233.6&3++&?=3255:47>&.400=8/;6810/.<\')78>96>649<.1+8>>81.2:73(45<\'>5;9'
        + '7(<**:551<59)\'=73>;6.01\'\':++;+0=7\'*1(->*\'27)/,?\':65?+\'(368:&.,32)*7>75+>3=98=3-1'
        + '9;:)4&4405-563?//,+&4.=/88.25788*?3>=,5;&\'?/8>-7*1>:.6068((=?+26?,0(&=96:;2:*;36'
        + ';/=+*?,..(36)?5(>=9\'.-;+1/19)9/+-=20=?(&9&;-):=&,((/9=73:))8.,41,(>?44\'?=6>31?:;'
        + ',+.:./8.-1;\'9-:,143\'4,=736<0*1?*8-(:6:*0-0,;3*<4-,8955:>031?.-(<<5>)=8./0,\'/0>:?'
        + '?\'(*1.559+).)9962+0+<-\'1*-0*8-2:<-&186+-/.:(2:8.:5/2<>-66-37&+92&3+0>(*:.:.0>85)'
        + '3*+,69)8+,\'/+2.6/0?4',
      '@read4',
      'ATTGATATTGAGACGTCGTGGGTCAAGCACGTAGGTCCGACACCTTAGAACTAGCATCAGGTATCATTCGATTCGGAATT'
        + 'AAGGGGTCGAAAGTATTTGCCGCGCCGACCTGGCCGATTGTGCCTCTCGAAATCCTAATTTGCCAACGTACTGCCTTGAC'
        + 'TCTGAAGGATCGGGCCGATGGAAGGCGTACCGTGCGGGCTGAGAGTACAACTCGAATCGCTTGTTCTTCACAGGCTAGCG'
        + 'AGTATGCTCGTCAGATACCTGCGAACCAGCGTCTGCCTTGCGGTATCGTACTTGGAGCACGAGGACGAAGCCGGAAGCGT'
        + 'GGGCTCTAGCCAGAGCATTACACTCACTGACGGTGTAACAGAGTACACATCGGTGGGTATAGTTAAGCTTCTGCCGGCTT'
        + 'AAAGTTTTGGTAGGCAGGTTTACTCTTATCTTGAGGCGACCTGCTCCCGTCAAAAGGACATGTTACTCAAAACCACTTTA'
        + 'GCGCCTGAAGCGCAAATCAACCCCAAATCAGAATATTAGCATCGGCCAGGTCAATACTGTTCGCCACCGGCTAAGGCGTC'
        + 'AACACGAGACTGCCACGTAGATCTTGCCTCTGATTCTTCCTTTAAAGGTGACTGTCTAGCGCTACACGACCTATAATGAA'
        + 'GGGGATTTCAATCTGTCTAGATCGTTTCCTGGGTGTGTAATCTACGCTTACTCGTCGGCGAATTACCCTATTGCGGGGCA'
        + 'TTGGGGGGCGATACGCTAGCATGCTGACATGGCACGCTCAGTGTAACTACGCCCTGGAACGAGAGTGCGCTAGCCATTAT'
        + 'AGCTGGTGATGGAGAACTACCCATACGTCGTTACTTTCCTGGGCGAGATGCCTTATAACTTTTAGGCTCGATACCGAGTT'
        + 'TCCTCGTACTCATGGACCCGTGGGGACCAGTCTAATCGAATCGGAATCACGGCTGACCCTCAGAAAGACGTCTCCCCAAA'
        + 'AGCTGGAACCTAGCCATTTTTTCAACTGCTGAGCTAGTGTTTTATGGATTAAGATTAAATTATATCTAGCCCGCTTATGT'
        + 'GATGTGATAGTTTCATAATTGCCGCTAGCCCAACCCTCACACGACCTCGAGTGAATCTTTCGTAACACAACGTGAGAGAA'
        + 'TAAGGACTTATGAGCTGAGGCAGGGTCCTGTTCGCTTACGCTAAACCGCCTAGACACGCAGCAACGGAGTGGGAAGACGT'
        + 'CCAATTTAACCTCTAGGAACCTAGATCGGGCTTAATCGATAAACGAGATCCAATGGGAAGTACGTACGAATTAAGCTTGC'
        + 'ACCGGAGTGTCGCGGCCGGGCCGGACGGCAAGCAGCCTGAGAGACCGCTATAATCCTATTGAGGCGCCAGATACTTCGTA'
        + 'GCTGTACTATATCACCTCCCTCACCCGTGTACTTTTGGGTATGCTTTTGTTTGCGTTTTGGTAGCGATTAAAGCAGCGGG'
        + 'CGTTGCCACTCCTTGCTGGATAAATATCTCGAGAGGTTTGGGATTTTGGAACTTCACGTTAGGTGGACGGCAGCTCCTTT'
        + 'TGAGTCAACGGTTCCCCTGGATCCGCACCACTACTTCGACCGAGGTCCGCGACGACCGCCTGGCAGGTTTGATTCTGTTA'
        + 'TCACGTTAAGAAGAATTGAACAAGCACAATCTTGGGTCAGATGGAGAGGTATCATGCGAATTGGCCGGCTAGTTGGACAT'
        + 'TAGATGAAGCTAACCTACCACAGTGATATAATGTCGCACTGTCGTGCCTGCTTCAGCTGGTTGCTCAGATTTATGGCATC'
        + 'GCGGGGGAGCCCCCCCTGAAGGGAAATGTCTTAGCATTAGGAGTCACCGGCTGAGAACAAATGTTTCCCCTCCCCTGCTT'
        + 'ATATAGATACCGACGATTACCAGTACTCTTTGACCACTAGGCGTTCAAGTTAGTGTAGTAAGGATCCGAGGCGAGTCTGA'
        + 'CACTAGCAGCTAAGTTCATGGAGCCACTTGCAGCTTTACGCTGGTTTATGGGTGAAATTAAATGTCAAAAGCTGGCCATC'
        + 'CAGAAATGCCGCTCGTGGGAACAGAGTGGTAACGACCCCCAAGGTACGAATTGATACGCACGGCTTCTCACTAATCCCTG'
        + 'TACCTCTCACAGCAAATGTAAAGCTCGCCGTTGGACATACTATCGTAAACCAGTCATATGCCCGTGTCATAAAGGGCTCA'
        + 'TTTATCAGTTAATCGTTTGTGATGCGACAGTGCCTATAGTCTTGGCATACTGCGCTGCCCCTACGGATCGCATTGACTTG'
        + 'TCAGGCGGCAAATAGAGTTTCTCCGACGCCGGTCGTGTGCACTATCTGTCTTCTAGTCTCAGACAGCGTCCTTGTTCCAT'
        + 'AACTCTCCGACAAGGGAATGAGCGCGTCGTAGTCAATAGAGCGAACGCATTATTCGGTTACTTAGGGTGATGGAACTGAC'
        + 'CGCGCTGGAGTTTGGCAGAGTGGGTAAATCAGAGATTCATAGCGAGTGTCCACGCACTTCAGGAGGGCGCGCCTCTGCGT'
        + 'GACCTGTCAAAATTACCCGA',
      '+',
      '(*=;130\'=)7;<24?=+&042\'3\'(\'0<8-&.&60?1>5+60*>3(3-8+,4+,(;3\'=)?06404>(-7)4/=8+*>('
        + '<?53358026/.?3=11.0+-,<7?91-55?323>598=&:(?;\'5,)9:+<:=,*>:>=0>0)*);(++>4)09\'6-:6'
        + '-++=7+:&7-9056+<9=>/-1-8=-,5?-2-8;7/6=7,80\'+>;2\'7(-&<0003::300/9.)611=;>&&(/9=>?'
        + ',;7*.6*75));5;==4;<80(50/*1&<30:7).+8,0-?(5\'(=;(-.,/6-9)90;\'.>7(3>09;?::)=9<..-('
        + ',<4-=/+3,3\')+9+8><(82>->-2?..<729(4/)&<&7()4;9>)<:?7:81>2:2***\'*:=(+,:4)9(431+:9'
        + '52630\'5<\'22,&43;<;-;,)+=3;,.=&2-:9:5;4*,8-)+=*0;8&\':\'>&4.,7?9+,1?4>=6\'9>2.2,7.98'
        + '/&=&?34,:(676\'8/<+(0<(7(;*4/:436<+/>*3*;8+79-8.33.*,,<<8(+1>/79\':(9+=68<?3>4>++2'
        + '1:*99=*6,3(<>50=3,++,,4>/+.;&3+/0?,7&47>.8-+.&/>\'\'&,52<)?66&0,:8539*,66957&*>.)&'
        + '=-)2/&+&3*,62/43*+)?&\'973?;(&735287-\'(952&90(>2/.+9,;:;=?&.(:0-018/77*)=9;94/+:.'
        + '<28=+6.=-9?5,4+)-9==\',/:.33/39663\'68-0>-04;9?02//<2</7926,02>4?16,4/=/565?6*9+>?'
        + '\'4>65:+3/?68+\'5.0++5?=7<18)/;128\'4)-\'<;88?=;1+,9=;,<555&?3-02(==?247>;8*9):9\':4;'
        + '8\'-\'5>>718\'91-4\'8&+>=63->503-2-:.&925>=339>544*-::45\'975&<99;3+&*(/?&)239+5<&)09'
        + '48+413<)/++>?;+\'95;5+1\'3==;6&=<&*2)>3;/(+?:9:86(2.>17<,</:\';\'\'?+3)8565,/4.<.)4:.'
        + '&0\'8\';)?+&:8,;\'7*.*2+86-9?6573)>0(2>8:5-/:/\'=16<6.14:56744+&;7*3***.466(/?=65,7*'
        + '/1.+9.7*,145+6700(3?\'6:(\'/,>=(9-&/6,+5=3334/6,2-/6-?8\';6469?2*0:/30.-7/45+)1>?2+'
        + '17+-022)*8?9(0\'?0\'(8:9,(--9(/4/+,?>7*&53).4)3::2&8-,\'+<+5:80<??8:\'?<&**57<0662):'
        + '/1032-7+8?/1))\'879</6&;27;>1.>-?>(502;66;/,&=(211-)&?&,-&.;*-4,9.?.,83<+&6-89569'
        + '/5:-<1=0<\'&4453\'.&:06\',8,6+9&<)69?3420146>7<&8*5>8+=1/>;203,7<23)9,(.\'7)2)0>,22&'
        + '-7:*:8/10/.4-5&->2<*+23(3=52>+<)/)7):\'6\',?4=6=6*\',.-&>62)11<79\'0(:?-;:>2)\'1;\'&\'='
        + '86396?2\':8-.3(*?.<0&53.=<1=;5+>2\';=+1=015/,(?.6:,(::8,3>(37+7==>&5/\'9),230>11232'
        + '3,=<+0/*.+&4436?;3(5\'>=+(-,\'(6(5:-(327)7*((.0&/+&<&?=*.6*14<037?)6/5(180526=*(94'
        + '9-1+,/8*3-=)//64???0?2,349553>1>>*>>50*/-,+\',<*32)\'3)3?6))=34350&77\'\',)411&:<44.'
        + '?5411):74+/86\'*&(8<\'\'?34+7961\'\'84934?;8285?+=:?*)4,-92:7+3&++8\'-5+83004+:26/(-(='
        + '87-=?3&:4.<+,68/&-0=&:<9-.>:1>(/&70,+(2=;9<8,;?.-430\'>\'.),,&;::2;6;,>:*/&?+-)+(3'
        + '(==),1-35&,9(=\'93.8.*.:<+*/;6.8.?379<4&\'=?&=:)&;;=,)&56//(598&9=2)>67,:>=+02-&09'
        + '57*6,,?./5.*?0*5&>)7,9:7(*;2\';2*=0=<>=3()\')0-7.062?<\'(6.9=53>:.;+55(-6=.2==54(2\''
        + '+0+1+)21:&)\'.;&\'759*?,&<+&./7<\':9-?(>?<9&3(2<1>*\'?*0+39(,/,/\'+9.<(-/&624?-98+5+4'
        + '=&&-7->*\'.(486.(6-6;+/(8/&6&9345)4;(*64\'-,;--*4*600+++-.\'03*61):+-1\'7.04>5+7&:.)'
        + '\'+\'9/(;./**7\'72&967&8&?0?\'.-637:;-\'/491=/1><=3+:,3\')(4-1</<=6;\'4=..--8:(55-:19?\''
        + '2&<1:*+\'.>+\')1:2:74+9,8(>0-6+3/*97;&<?8;(?8/0>1):&,*88,9\':4\'65;65.=\',&3*290=3:<<'
        + '028=4+73:8+&-1:\'/,.\'4?;&;83.;-\'2?+3*0\';+99(53:<>\'&71+/7::9;3?.;1;>\'8\'(7;,<.\',=-*'
        + '3/305>;906+9;\'-4(<)1',
      '@read5',
      'GACACTCGCTATGAATCTCTGATTTACCCACTCTGCCAAACTCCAGCGCGGTCAGTTCCATCACCCTAAGTAACCGAATA'
        + 'ATGCGTTCGCTCTATTGACTACGACGCGCTCATTCCCTTGTCGGAGAGTTATGGAACAAGGACGCTGTCTGAGACTAGAA'
        + 'GACAGATAGTGCACACGACCGGCGTCGGAGAAACTCTATTTGCCGCCTGACAAGTCAATGCGATCCGTAGGGGCAGCGCA'
        + 'GTATGCCAAGACTATAGGCACTGTCGCATCACAAACGATTAACTGATAAATGAGCCCTTTATGACACGGGCATATGACTG'
        + 'GTTTACGATAGTATGTCCAACGGCGAGCTTTACATTTGCTGTGAGAGGTACAGGGATTAGTGAGAAGCCGTGCGTATCAA'
        + 'TTCGTACCTTGGGGGTCGTTACCACTCTGTTCCCACGAGCGGCATTTCTGGATGGCCAGCTTTTGACATTTAATTTCACC'
        + 'CATAAACCAGCGTAAAGCTGCAAGTGGCTCCATGAACTTAGCTGCTAGTGTCAGACTCGCCTCGGATCCTTACTACACTA'
        + 'ACTTGAACGCCTAGTGGTCAAAGAGTACTGGTAATCGTCGGTATCTATATAAGCAGGGGAGGGGAAACATTTGTTCTCAG'
        + 'CCGGTGACTCCTAATGCTAAGACATTTCCCTTCAGGGGGGGCTCCCCCGCGATGCCATAAATCTGAGCAACCAGCTGAAG'
        + 'CAGGCACGACAGTGCGACATTATATCACTGTGGTAGGTTAGCTTCATCTAATGTCCAACTAGCCGGCCAATTCGCATGAT'
        + 'ACCTCTCCATCTGACCCAAGATTGTGCTTGTTCAATTCTTCTTAACGTGATAACAGAATCAAACCTGCCAGGCGGTCGTC'
        + 'GCGGACCTCGGTCGAAGTAGTGGTGCGGATCCAGGGGAACCGTTGACTCAAAAGGAGCTGCCGTCCACCTAACGTGAAGT'
        + 'TCCAAAATCCCAAACCTCTCGAGATATTTATCCAGCAAGGAGTGGCAACGCCCGCTGCTTTAATCGCTACCAAAACGCAA'
        + 'ACAAAAGCATACCCAAAAGTACACGGGTGAGGGAGGTGATATAGTACAGCTACGAAGTATCTGGCGCCTCAATAGGATTA'
        + 'TAGCGGTCTCTCAGGCTGCTTGCCGTCCGGCCCGGCCGCGACACTCCGGTGCAAGCTTAATTCGTACGTACTTCCCATTG'
        + 'GATCTCGTTTATCGATTAAGCCCGATCTAGGTTCCTAGAGGTTAAATTGGACGTCTTCCCACTCCGTTGCTGCGTGTCTA'
        + 'GGCGGTTTAGCGTAAGCGAACAGGACCCTGCCTCAGCTCATAAGTCCTTATTCTCTCACGTTGTGTTACGAAAGATTCAC'
        + 'TCGAGGTCGTGTGAGGGTTGGGCTAGCGGCAATTATGAAACTATCACATCACATAAGCGGGCTAGATATAATTTAATCTT'
        + 'AATCCATAAAACACTAGCTCAGCAGTTGAAAAAATGGCTAGGTTCCAGCTTTTGGGGAGACGTCTTTCTGAGGGTCAGCC'
        + 'GTGATTCCGATTCGATTAGACTGGTCCCCACGGGTCCATGAGTACGAGGAAACTCGGTATCGAGCCTAAAAGTTATAAGG'
        + 'CATCTCGCCCAGGAAAGTAACGACGTATGGGTAGTTCTCCATCACCAGCTATAATGGCTAGCGCACTCTCGTTCCAGGGC'
        + 'GTAGTTACACTGAGCGTGCCATGTCAGCATGCTAGCGTATCGCCCCCCAATGCCCCGCAATAGGGTAATTCGCCGACGAG'
        + 'TAAGCGTAGATTACACACCCAGGAAACGATCTAGACAGATTGAAATCCCCTTCATTATAGGTCGTGTAGCGCTAGACAGT'
        + 'CACCTTTAAAGGAAGAATCAGAGGCAAGATCTACGTGGCAGTCTCGTGTTGACGCCTTAGCCGGTGGCGAACAGTATTGA'
        + 'CCTGGCCGATGCTAATATTCTGATTTGGGGTTGATTTGCGCTTCAGGCGCTAAAGTGGTTTTGAGTAACATGTCCTTTTG'
        + 'ACGGGAGCAGGTCGCCTCAAGATAAGAGTAAACCTGCCTACCAAAACTTTAAGCCGGCAGAAGCTTAACTATACCCACCG'
        + 'ATGTGTACTCTGTTACACCGTCAGTGAGTGTAATGCTCTGGCTAGAGCCCACGCTTCCGGCTTCGTCCTCGTGCTCCAAG'
        + 'TACGATACCGCAAGGCAGACGCTGGTTCGCAGGTATCTGACGAGCATACTCGCTAGCCTGTGAAGAACAAGCGATTCGAG'
        + 'TTGTACTCTCAGCCCGCACGGTACGCCTTCCATCGGCCCGATCCTTCAGAGTCAAGGCAGTACGTTGGCAAATTAGGATT'
        + 'TCGAGAGGCACAATCGGCCAGGTCGGCGCGGCAAATACTTTCGACCCCTTAATTCCGAATCGAATGATACCTGATGCTAG'
        + 'TTCTAAGGTGTCGGACCTACGTGCTTGACCCACGACGTCTCAATATCAATTCCTACGATCAGAACTGACTACAGCGGAGA'
        + 'CGGTAGAGGAACGGCTATAA',
      '+',
      '8+5);&;1>23?16;1);.8576:65++)>827\'<14)-)((:=8+<*9)864>?;)8+4*0<?.4:*\'27:4)-+2>50'
        + '.(8&*17?2?*06.-(3)(>:+?*,0(.\'2-?5&41=)>14<--1,-+74\'9,(282,=-66(7-&92+3=1:5(-\';8;'
        + '(&)719.*6371+,088,9,?.\'43&13\'&50?<.1()45?7>3**0)*897&61?>-.)9>8).26?9)2.<?-)1))>'
        + '.*;?=.\'5>75;5/03-:3*22&,1+;1\'<</=3*.2.6/=3>*92;4;.)*,=0-62&5+*<,\'\'(=>)>*?35?-.>='
        + '+=05:;:*><8*>?70=8617(&6=&\'4*.4701117=6?2<+<096(5<7+6=/,;&((:\'));-?:18;&/+19<1+&'
        + '764,>?-047;*7*,3/8)*8-66)*77:-75:;.<;,?&;,:96(.)-9))0=;1/<8):<44=..62>8./-??--84'
        + '&8+2>9=2(),1&;2.*&*3+6::)><)3)?><-14?\'?\'&7;:4+:-8+&<82?+,,<49+4.*>.7=*)89<>8*/62'
        + '8\'.5?6/..)*3-<)8,5*17*5800\'/(>353)(<,1,<;?+<+2>11,2:<2-*9/+3671-&-8>264..>9;-6;*'
        + '=47??&13=5&49=(\',./9/2\'21\'\'5,;:51:=:6&25<*>,*(3&+;0\'9.1041(+?\'8-=5:\'+(6(+1<;6898'
        + '7,2&7)199/8*.1+*&5:83/;9(*.:./?*9>=86/?889>;22668\'\'83->4(*>-24*.0&<8.4,()<08\'>2,'
        + '7+?179&70?*&<9+2-2/-\'/42(;5.?7+&&>=.(8=53?\'=:6:--=3>(01?6)66(:624?2)&.\'>767=<?*-'
        + '(\'<84758\'&&+)79/5)001+;1)?/<*.4,8>/+?053+5?=)5*:)15&*,0=89&\'9)./*0+-8:17>-?&53.('
        + '5/\'25?&,.-9)=-00?6=2\'.6).0*\'\'2*,\'9;5<6:;77,,;+00)-+9.358573*1>4?\'623?.7:/-861>64'
        + ')<9(88?45<>/(3:+8=\'?-+*6<10<&:8>.9057+87;2\',1>\'4.\'7/(+=92:2?-090+684??>?15;48\'(.'
        + '233>29-391&0&3,0?&&5<191?962,)1\'\'4+?5<4&\'>+0,+)64=9+*:.<=;5*0\'&7(93?&<,2?3*&4=(8'
        + '(4&84*\'50=<520154046=/<58\'?<&3535/*4717-/1<+<3.):+\'/77+=0:6?=?01=1386.,06.+++61>'
        + '&/,4,-32+=3,=-<2:,32*/>)\';:&9>=-2&:64722;-2<-=\'<>-53+=5:=1;)?((>>2&2:*:+;+7\'94/,'
        + '/*8:13\':2-1=,=?,.;.(90587*1*76&7(-.:>1\'*(=-.6-\'37,(.4-5+)0503?>+1=7&;&(91;\'6&.6.'
        + ';(6=)\'-:9*(55030/?2967736*?\'+&(\'>1/156=9=;126&&:1&:*8(=<-;<&&>*&++5;\'\'.4.9&-;/7)'
        + '8/4?:3>?>>=;6&73\':(7-\'39159788(2<3(23:49?,1?1;8&39>&.*\'<0023?5).=7/8/=))+&?<48;&'
        + '24+16?.(&8-82:718=30)?*,;<*83*74.5+*4:=</2:6(,)(1>77839<8*00)9/?;48:&?+.+1).(8.2'
        + '\'*\'.2&(\'4.6/>6((4&?6)&=<<;9&(4;+4337>2;2)36;;1)5\')>:&,&(&>2<&-0\'40*-24&;,0\'4807>'
        + '=++36782(7)2947&+>).)/<15(*+;<=+<6/<\'09/36\'1</)+,.(+7+5355,9+:*:>-\'3.*.79?*))4.6'
        + '*6:+922.9(,0;+91+97-&65&59-\'=9+*1*)7(8636)&;(7.(<+,,;6?=/+.?.<<:?72)88.3,8+<99\'+'
        + '.-4\'(,..7.,0=-+&9\'1;+0)-.5:63.()1;3-,10,,>&270809)66,/<-&<\'8.=-36)7/().938&:,:81'
        + '))17>=67<=&&;/=3<&=90>)>/319;2.?>?=2(\'01;,9&0>8:/33*507=2)5\'=**37.:3.3=&*6.180>0'
        + ':\'=0>9:5789:.63;3;)+=.;5.:<408.919/53036=\'8984=?<<\'>38=47)45/2?\'/30&8(92317)99;0'
        + '87-\'/8/9\')<>1+-*?)7*75<,49==*>)7:&-\'97;75/-46;\'832.1-5,)8-9,?+\'&/,>1\'1-0:/88)<00'
        + '?/&=077+98>504);?;*+9(-<4(468/);54/3.:=\'219-&-8;3-)),0.9?<71<\',79<0\'*\'(6<&&-5>?<'
        + '\'(6;2&;03-(8,&90/:8<3*?,).17\'53,41=0;4=8.9.1,80->8>38,868=&<>,7+1:85*4:725(-3/7.'
        + '&78<3>:,85,->.()+8*-2?927(<-):79(21*<55)8/47=&?56+)43,)1*(\'94679\'12283,7/\'-&5,?('
        + '>+7>/4&/7,6>+145;-\'*',
      '@read6',
      'TGCACTCCAACACGGTGCGCCTGAAGAAGTTTAAGCTTACCGACGGCTTATTATAGCCGTTCCTCTACCGTCTCCGCTGT'
        + 'AGTCAGTTCTGATCGTAGGAATTGATATTGAGACGTCGTGGGTCAAGCACGTAGGTCCGACACCTTAGAACTAGCATCAG'
        + 'GTATCATTCGATTCGGAATTAAGGGGTCGAAAGTATTTGCCGCGCCGACCTGGCCGATTGTGCCTCTCGAAATCCTAATT'
        + 'TGCCAACGTACTGCCTTGACTCTGAAGGATCGGGCCGATGGAAGGCGTACCGTGCGGGCTGAGAGTACAACTCGAATCGC'
        + 'TTGTTCTTCACAGGCTAGCGAGTATGCTCGTCAGATACCTGCGAACCAGCGTCTGCCTTGCGGTATCGTACTTGGAGCAC'
        + 'GAGGACGAAGCCGGAAGCGTGGGCTCTAGCCAGAGCATTACACTCACTGACGGTGTAACAGAGTACACATCGGTGGGTAT'
        + 'AGTTAAGCTTCTGCCGGCTTAAAGTTTTGGTAGGCAGGTTTACTCTTATCTTGAGGCGACCTGCTCCCGTCAAAAGGACA'
        + 'TGTTACTCAAAACCACTTTAGCGCCTGAAGCGCAAATCAACCCCAAATCAGAATATTAGCATCGGCCAGGTCAATACTGT'
        + 'TCGCCACCGGCTAAGGCGTCAACACGAGACTGCCACGTAGATCTTGCCTCTGATTCTTCCTTTAAAGGTGACTGTCTAGC'
        + 'GCTACACGACCTATAATGAAGGGGATTTCAATCTGTCTAGATCGTTTCCTGGGTGTGTAATCTACGCTTACTCGTCGGCG'
        + 'AATTACCCTATTGCGGGGCATTGGGGGGCGATACGCTAGCATGCTGACATGGCACGCTCAGTGTAACTACGCCCTGGAAC'
        + 'GAGAGTGCGCTAGCCATTATAGCTGGTGATGGAGAACTACCCATACGTCGTTACTTTCCTGGGCGAGATGCCTTATAACT'
        + 'TTTAGGCTCGATACCGAGTTTCCTCGTACTCATGGACCCGTGGGGACCAGTCTAATCGAATCGGAATCACGGCTGACCCT'
        + 'CAGAAAGACGTCTCCCCAAAAGCTGGAACCTAGCCATTTTTTCAACTGCTGAGCTAGTGTTTTATGGATTAAGATTAAAT'
        + 'TATATCTAGCCCGCTTATGTGATGTGATAGTTTCATAATTGCCGCTAGCCCAACCCTCACACGACCTCGAGTGAATCTTT'
        + 'CGTAACACAACGTGAGAGAATAAGGACTTATGAGCTGAGGCAGGGTCCTGTTCGCTTACGCTAAACCGCCTAGACACGCA'
        + 'GCAACGGAGTGGGAAGACGTCCAATTTAACCTCTAGGAACCTAGATCGGGCTTAATCGATAAACGAGATCCAATGGGAAG'
        + 'TACGTACGAATTAAGCTTGCACCGGAGTGTCGCGGCCGGGCCGGACGGCAAGCAGCCTGAGAGACCGCTATAATCCTATT'
        + 'GAGGCGCCAGATACTTCGTAGCTGTACTATATCACCTCCCTCACCCGTGTACTTTTGGGTATGCTTTTGTTTGCGTTTTG'
        + 'GTAGCGATTAAAGCAGCGGGCGTTGCCACTCCTTGCTGGATAAATATCTCGAGAGGTTTGGGATTTTGGAACTTCACGTT'
        + 'AGGTGGACGGCAGCTCCTTTTGAGTCAACGGTTCCCCTGGATCCGCACCACTACTTCGACCGAGGTCCGCGACGACCGCC'
        + 'TGGCAGGTTTGATTCTGTTATCACGTTAAGAAGAATTGAACAAGCACAATCTTGGGTCAGATGGAGAGGTATCATGCGAA'
        + 'TTGGCCGGCTAGTTGGACATTAGATGAAGCTAACCTACCACAGTGATATAATGTCGCACTGTCGTGCCTGCTTCAGCTGG'
        + 'TTGCTCAGATTTATGGCATCGCGGGGGAGCCCCCCCTGAAGGGAAATGTCTTAGCATTAGGAGTCACCGGCTGAGAACAA'
        + 'ATGTTTCCCCTCCCCTGCTTATATAGATACCGACGATTACCAGTACTCTTTGACCACTAGGCGTTCAAGTTAGTGTAGTA'
        + 'AGGATCCGAGGCGAGTCTGACACTAGCAGCTAAGTTCATGGAGCCACTTGCAGCTTTACGCTGGTTTATGGGTGAAATTA'
        + 'AATGTCAAAAGCTGGCCATCCAGAAATGCCGCTCGTGGGAACAGAGTGGTAACGACCCCCAAGGTACGAATTGATACGCA'
        + 'CGGCTTCTCACTAATCCCTGTACCTCTCACAGCAAATGTAAAGCTCGCCGTTGGACATACTATCGTAAACCAGTCATATG'
        + 'CCCGTGTCATAAAGGGCTCATTTATCAGTTAATCGTTTGTGATGCGACAGTGCCTATAGTCTTGGCATACTGCGCTGCCC'
        + 'CTACGGATCGCATTGACTTGTCAGGCGGCAAATAGAGTTTCTCCGACGCCGGTCGTGTGCACTATCTGTCTTCTAGTCTC'
        + 'AGACAGCGTCCTTGTTCCATAACTCTCCGACAAGGGAATGAGCGCGTCGTAGTCAATAGAGCGAACGCATTATTCGGTTA'
        + 'CTTAGGGTGATGGAACTGAC',
      '+',
      '.+?5.&>=;>62&(=(??0?236;>54.,6?5?\'1?&<6=58>:<&;/814<02/&=(*4-4:?.,0==02*5;8-3<<,'
        + '=?(50:>7*76?36/*5<01,.1+(-(.-&80;)?,&9)91/*9(?8)8.&.54\'//52/96.,86/:*);(/2</0>00'
        + '7\'(8:228=10.:84=927-)<=>\'29<8**<;4+;?40.644)<5)0&?&&?*>\'>:4723/-<()<0)+36\'(+)-?3'
        + ',:?66723?9&2</),88;42,=;.22&68:1\'0<4>:;:88\'>5/(\'0)//>1\',?7-;(&041;2+*98\';/)&*63:'
        + '8),6;7-9.(>0\'+;))3=<90&>-2<+\'38+0630>:)\'76/4;08)-67?6>7(:/=0/,\'0<0;+6*:121+5.70='
        + ')-?*98\'7)(?6\'=87=&=559\'/:?57-05/0(7.;5:./76+?&,7?00=0?&4?<,=;987(,6/0)34-52,++;5'
        + '971*+><>,)4\'=9</0;6<)=?*,5\'9;2=/>1\'<)\'6:&5*<)5><99-;+:\'-(0?2,4=,\'14*.;0+:1*5)\')&'
        + '\'*<.:7)84598?)17>4?43/,1/+,4756+.:=17=+3*6.;6:83).6;7>3)3*)?9+>72)>5.\'?/1,=7?01<'
        + '*;&3<3-0-/;4915)7709*312:208.4(80,7.;6\'&1*/=7;7--<0:<=&9+\'2+.8&2?&+945///:)-&*=\''
        + '>.)\'&-0,*7(8,=5;.6*14\',4-;<.9\',5?-\'<1<1+?)9/+/1-8(821901701/><,&;/677,<5--2-.5=,'
        + '2<-;04+->>0879:7:)3(-:7,:>-?\'1::**0&.&.-98?(<4;(06\'3-4\'()35,:/0,2?;(<>51>4/)9)->'
        + '(23-:5;((3.<)(5//\'5=9+:&&/\'3(\'*7+)7<+0.\'/9?<>?4&?:>;0,4;/&2::1-6/5&:1\'9&7:>->*=='
        + '27351++-(:./,9)4/&383-(?-/79+/>>6,:)95-35&?89).>>3,>27*=27?*2;0=)2111*.9/?0-826-'
        + '2.8681&--6&?\'21++\'=*?491/<3>8-=62>:75&74=8&&\'<7)*3.&,9:=/752>=90)89<;>/..<.\':?6/'
        + '6.1,56)6(++?,/&+9/-;>0\';.3=--5(>/0/9))0=)?1=3<53;\'/>;=5();>7:8\'></;;&1)/:)+64=(4'
        + '&+\'::7<36.+3.&+8+8.5;>400=7)/\'346(5=\'617//9535390?>6;,09+<+8\';+>,?*;+=5*6>(71-40'
        + '(\'?:=66807+(569,..22/)..0)0&;,,.->/,6=8&05<+61?-40/.9235:/,&+-;+9/;2<;6*+147\'<>>'
        + '0)79(<*,?39)5?9->,>./>2./+)(7&(/-;88>7,4&*,3:\'<3)-.,=6=*+:8-=+:6</-?\'8-1\'<(=?>\'?'
        + '+75/503;\'&664*7;?:&:718>=)9;03:.;72-*+-,+837)5.4\'84?5&7-),1(848=;)&37*8=39;?:>=&'
        + '?)7)//3.;2\')7<?;1;*0+5..=?+1.000>9:\'6*=:+=/<(58*4-/+,:06)7;.5)9.0>.,4)(95/1&04.\''
        + '65.7;9:<-*;<2>90-57>/=1?;&=(,,+*0(89-&7/\'?<:9*>).>\'./97--+3<72+9>&*?*/,0/<4\';742'
        + '-+3=+4.>?.6>,;2<7+42=-?/(:<>65,+;/=2*6:(+(\'?.2*(97;12>,>/;;*-3;71;;32/\':251:*):2'
        + '<)-2*=/>=1\'*:7?(*(:\'54<8.8?;4396,<)7.9\'65:2065).?,;8978?(2=?3?297?&393281>)>/*0>'
        + '9+(6<.04,);\'6>(+&&.)0,8>5>*\'\'>3:*4(*4<*;)/30\'9):\':=?&-.4-(+/==+<+.:+\'89)-9:<-9,9'
        + '6=\'742/6&7(7)04<9>47;7-8&5:250?>6\'>(061*6=211&.-55*+8(0=)<6\'7*?&=29/()<1334(?+,\''
        + '.1*4.?0827+*0*8\'+/80<13>6610*-.)\'/(/;&70);&*9+=\'+(,5)67*4+0:&7*/:-3<&6.&665))46\''
        + '*=-19));*6>,<54801\':56?*2&3.:9=&99)4<?/\'*;?582-233>046,4.0*&\'2->29-&.36:=9.(*:\'>'
        + '0.;&&<476<48*\'?9<=.=+)=(3,=857568((6</\';-857)+(\'=>.</-/++.)0>-759&3729,+2?>9&.,3'
        + '5=<)?<7)6?8;504\'1?46&,)37,?*0:75&64:<;40)3-.8*299)698=;586993&1(97((-*5/?/=?78<5'
        + ':,,:&5?7<>6&75<>5>,)206?7=+<4+8>(/606,4?+1>\'7(;(7?,(1+1(>*396+&.69,1(76+;-=;\'.;*'
        + ')0),<=&7*4(?)3(:3388.(=31)>5?)8/34(53<01/<<000)5?8;5>&6;2/>4\'-*5623;5(,<+;48;6;6'
        + '/8(4;:+.*7;-):0?-//<',
      '@read7',
      'ACGACGCGCTCATTCCCTTGTCGGAGAGTTATGGAACAAGGACGCTGTCTGAGACTAGAAGACAGATAGTGCACACGACC'
        + 'GGCGTCGGAGAAACTCTATTTGCCGCCTGACAAGTCAATGCGATCCGTAGGGGCAGCGCAGTATGCCAAGACTATAGGCA'
        + 'CTGTCGCATCACAAACGATTAACTGATAAATGAGCCCTTTATGACACGGGCATATGACTGGTTTACGATAGTATGTCCAA'
        + 'CGGCGAGCTTTACATTTGCTGTGAGAGGTACAGGGATTAGTGAGAAGCCGTGCGTATCAATTCGTACCTTGGGGGTCGTT'
        + 'ACCACTCTGTTCCCACGAGCGGCATTTCTGGATGGCCAGCTTTTGACATTTAATTTCACCCATAAACCAGCGTAAAGCTG'
        + 'CAAGTGGCTCCATGAACTTAGCTGCTAGTGTCAGACTCGCCTCGGATCCTTACTACACTAACTTGAACGCCTAGTGGTCA'
        + 'AAGAGTACTGGTAATCGTCGGTATCTATATAAGCAGGGGAGGGGAAACATTTGTTCTCAGCCGGTGACTCCTAATGCTAA'
        + 'GACATTTCCCTTCAGGGGGGGCTCCCCCGCGATGCCATAAATCTGAGCAACCAGCTGAAGCAGGCACGACAGTGCGACAT'
        + 'TATATCACTGTGGTAGGTTAGCTTCATCTAATGTCCAACTAGCCGGCCAATTCGCATGATACCTCTCCATCTGACCCAAG'
        + 'ATTGTGCTTGTTCAATTCTTCTTAACGTGATAACAGAATCAAACCTGCCAGGCGGTCGTCGCGGACCTCGGTCGAAGTAG'
        + 'TGGTGCGGATCCAGGGGAACCGTTGACTCAAAAGGAGCTGCCGTCCACCTAACGTGAAGTTCCAAAATCCCAAACCTCTC'
        + 'GAGATATTTATCCAGCAAGGAGTGGCAACGCCCGCTGCTTTAATCGCTACCAAAACGCAAACAAAAGCATACCCAAAAGT'
        + 'ACACGGGTGAGGGAGGTGATATAGTACAGCTACGAAGTATCTGGCGCCTCAATAGGATTATAGCGGTCTCTCAGGCTGCT'
        + 'TGCCGTCCGGCCCGGCCGCGACACTCCGGTGCAAGCTTAATTCGTACGTACTTCCCATTGGATCTCGTTTATCGATTAAG'
        + 'CCCGATCTAGGTTCCTAGAGGTTAAATTGGACGTCTTCCCACTCCGTTGCTGCGTGTCTAGGCGGTTTAGCGTAAGCGAA'
        + 'CAGGACCCTGCCTCAGCTCATAAGTCCTTATTCTCTCACGTTGTGTTACGAAAGATTCACTCGAGGTCGTGTGAGGGTTG'
        + 'GGCTAGCGGCAATTATGAAACTATCACATCACATAAGCGGGCTAGATATAATTTAATCTTAATCCATAAAACACTAGCTC'
        + 'AGCAGTTGAAAAAATGGCTAGGTTCCAGCTTTTGGGGAGACGTCTTTCTGAGGGTCAGCCGTGATTCCGATTCGATTAGA'
        + 'CTGGTCCCCACGGGTCCATGAGTACGAGGAAACTCGGTATCGAGCCTAAAAGTTATAAGGCATCTCGCCCAGGAAAGTAA'
        + 'CGACGTATGGGTAGTTCTCCATCACCAGCTATAATGGCTAGCGCACTCTCGTTCCAGGGCGTAGTTACACTGAGCGTGCC'
        + 'ATGTCAGCATGCTAGCGTATCGCCCCCCAATGCCCCGCAATAGGGTAATTCGCCGACGAGTAAGCGTAGATTACACACCC'
        + 'AGGAAACGATCTAGACAGATTGAAATCCCCTTCATTATAGGTCGTGTAGCGCTAGACAGTCACCTTTAAAGGAAGAATCA'
        + 'GAGGCAAGATCTACGTGGCAGTCTCGTGTTGACGCCTTAGCCGGTGGCGAACAGTATTGACCTGGCCGATGCTAATATTC'
        + 'TGATTTGGGGTTGATTTGCGCTTCAGGCGCTAAAGTGGTTTTGAGTAACATGTCCTTTTGACGGGAGCAGGTCGCCTCAA'
        + 'GATAAGAGTAAACCTGCCTACCAAAACTTTAAGCCGGCAGAAGCTTAACTATACCCACCGATGTGTACTCTGTTACACCG'
        + 'TCAGTGAGTGTAATGCTCTGGCTAGAGCCCACGCTTCCGGCTTCGTCCTCGTGCTCCAAGTACGATACCGCAAGGCAGAC'
        + 'GCTGGTTCGCAGGTATCTGACGAGCATACTCGCTAGCCTGTGAAGAACAAGCGATTCGAGTTGTACTCTCAGCCCGCACG'
        + 'GTACGCCTTCCATCGGCCCGATCCTTCAGAGTCAAGGCAGTACGTTGGCAAATTAGGATTTCGAGAGGCACAATCGGCCA'
        + 'GGTCGGCGCGGCAAATACTTTCGACCCCTTAATTCCGAATCGAATGATACCTGATGCTAGTTCTAAGGTGTCGGACCTAC'
        + 'GTGCTTGACCCACGACGTCTCAATATCAATTCCTACGATCAGAACTGACTACAGCGGAGACGGTAGAGGAACGGCTATAA'
        + 'TAAGCCGTCGGTAAGCTTAAACTTCTTCAGGCGCACCGTGTTGGAGTGCACTACCGTGAGGCAACTAGGCCAGGGCGTGA'
        + 'GGTGCCGCCCATTTTGCACG',
      '+',
      '\'00.+;+/*309-2&2)\'(35+4871);+5/)(.8/.-5>562)8-8+?/5=(=+<(;+/60&/&0.;>((5.4./6+*;'
        + '800<(-60>09?0=/&2:,1*?;7?)26>?>04=)4\'=)-\'(&707*&:*\'=0,2>56/9/3<&,=>7291&32(,)<(,'
        + '??4\'9385**.&\'<7=03:.;-&+196\'4954<?-:37\'))??7<\'76-35*3051<*?;7,2,<(;,4+2-,/2.::9&'
        + '09,,<;846?&6:,71):<8\'3</72):3?554245,,446:=087/.:2\'=6::,<.,1,2**18,;9602/-+\'&1.2'
        + '*/005.3)7998<:*2598;;0*.31807=70&58.>,=0)93,94(3&2\'<(*&,6\'\'\'3::1/*0<4.-&1;\'<<8.4'
        + '&*;?+(*(53>::6415//*&,?/,;:?;?9()597?888=7)3&<)6/=-&0&*96>--5437\',6)>9=+>4-11*(6'
        + ';=+,=>8?(028396+(>?97:02*107<03)\'8.?=;(/;:&=\':9+8)<?-6\'6/+15=90.3?/-<);\'-.&+&;96'
        + '*3/:)59+;195+&4*+,872)43&7/+15+77621(,;15./)\'/>+(1933:3=/*8<32.)+53==4\'.?0<851<2'
        + '=,)1:&-9>.9<+5>17>)*&>3*=:=4&+95&61*<\'--9>73*)*&,5?-7/0??9?0)?&-5;954,*7?11<+,(&'
        + '=(,1:;:/>(\'/12\'18)(110;00-(;:.70>&?=\'?.(+8.56\'?09-92-;;7-7(836.907>*;+:&4-*76)6,'
        + '\'=4.28*<>92/;+7/;1)+,328(45:6&*4/?.=/12=8=:23453/,5/4952=6>/((*339/690041,;*&8,;'
        + '?54:<::??<6*=-2(.*(380(\'/2.2-,1\'954-01))+,>1\'9012\'*<3=-\'87/()52>\'>/3282<\'/+26?)-'
        + '+>7(98=:5?2.+81\'/3(+529:&\';+<596*1&+3+,94-7)4(4(\',9&9:>5)-211(4?384<)83*0-,.&<6<'
        + '-*<,3*)1<7&.-6-?.-1\'=;/=;)0+(>/0)4.\';5.2=-?)3;3*=57,734\'&-/-023/\':,148,>1)0<74,?'
        + '/28/8.<83-6<09070(\')==>-0;(,?.,5=<,97,.48,1)?0*88&0<-1>:+2:&17<-=>>(*478)7\'9&-52'
        + '&,:545<-6,3\'.;(6\'046858*,(82\'0)..<92524;/:();1>(4(-1**0:/27??3;,>?=)&?1:69/>)\'1*'
        + '4\'=-8,+>.:,,*;6:>/+&:5(//5)84<><*\'<46,6(;:6*+,>6&=<\'9)8398/?:)&&-0&.7123*,:/.<.3'
        + '>:(:=-*3*66:=00(+))8*7++8>+(4536-(.0243587+:*2=8?,=5&\'2?->.=<5(=,>82(?1<,:>)=753'
        + '*(+568,,0?7>?/;4-/\'07\'=48-/+1/*7=-*&+1,,87=42<8-2*0)69,+80928,<89=&+.6+48-15.,,6'
        + ':9,&2\'1=3:??:12=&&/2*;12-/34\')>6/=)+6(3.2?\'/<?45&50(**-:-28/>4:102,37:/=9\'(=4\'3<'
        + '-8?\'4,&=(9/+0;>=5>2/?;3\';+3&):-<=-+*\'(4&.5&+*316-8(8-6(-=)61?&../58=)*0&(>)0\'+&&'
        + '+=83/3-51</)+>-9(55>>-=02/,7+70)-0/)9;9+&38(<5)0)80?4:62&5.+>20\'9\':*3=->>;80&287'
        + '765&5-<5.;2-2<.-*8/)73,\'-:.8>.7992?;?)-.42=\'9,\'8(/:*0=2,-68?92&9*)\'3?*+(7/09/(*>'
        + '(.1.306.\'6;4,9?,84;.9.89:(4,=/9\'-3/??0>2,\',<>>;:23(6><*610183-3,11(&35>,(=>:,9)/'
        + '>.*:2;0&&5/\'0(/74.&*51355;1+&=/:\';;<.7\'/9:3;:*(;/3>((&=;8?\'<834+,/.(&00/2*?\'-;\'*'
        + '69=*<:(-(-)=<45?&++;+=+:)-<1::&/9(0\'09++;>0-+(:\'+03&+14:-.6:(9(4&?:=?*/9>=-.9?,:'
        + ';-\'3-4)<31953;;>=,3(*;.*\'85+720+1/7\'*;=38;71.6,;).96(7/2::.(-0;*&0:38=\'</<./;(97'
        + '98=60:>=76=)=2/9?+(-5*6*:>-4?.86&.2*)*?1(4;72958?7.5&<&45=064\';.:0?,7;>&5\'3,->.&'
        + ',,*220\':0=7(=)..2.\'=*\'9&?.48(?38?87;+(94?9/3.9-\'**(&>:-=);=,:6)3&=+,?8.7>39(;9=\''
        + '>(28695/.3-=\'77???3\'1<10+>;71&-24<45/+,,<=,8*9,<6847455;(/+66</5,23><.*=91)/=/?8'
        + ';<-10./=;854+>>*&1+7=3,::3114;5(.45-*;.),;6\'9/5204,675:>(.+<0-:?)11*&:++137/1)<.'
        + '6.?.27064)(07171+0?(',
      '@read8',
      'ATCCGTCTCGTGCTTTGTGGTCGAATGTGCGTCCGCATACACCGTGTCCCCGTGCAAAATGGGCGGCACCTCACGCCCTG'
        + 'GCCTAGTTGCCTCACGGTAGTGCACTCCAACACGGTGCGCCTGAAGAAGTTTAAGCTTACCGACGGCTTATTATAGCCGT'
        + 'TCCTCTACCGTCTCCGCTGTAGTCAGTTCTGATCGTAGGAATTGATATTGAGACGTCGTGGGTCAAGCACGTAGGTCCGA'
        + 'CACCTTAGAACTAGCATCAGGTATCATTCGATTCGGAATTAAGGGGTCGAAAGTATTTGCCGCGCCGACCTGGCCGATTG'
        + 'TGCCTCTCGAAATCCTAATTTGCCAACGTACTGCCTTGACTCTGAAGGATCGGGCCGATGGAAGGCGTACCGTGCGGGCT'
        + 'GAGAGTACAACTCGAATCGCTTGTTCTTCACAGGCTAGCGAGTATGCTCGTCAGATACCTGCGAACCAGCGTCTGCCTTG'
        + 'CGGTATCGTACTTGGAGCACGAGGACGAAGCCGGAAGCGTGGGCTCTAGCCAGAGCATTACACTCACTGACGGTGTAACA'
        + 'GAGTACACATCGGTGGGTATAGTTAAGCTTCTGCCGGCTTAAAGTTTTGGTAGGCAGGTTTACTCTTATCTTGAGGCGAC'
        + 'CTGCTCCCGTCAAAAGGACATGTTACTCAAAACCACTTTAGCGCCTGAAGCGCAAATCAACCCCAAATCAGAATATTAGC'
        + 'ATCGGCCAGGTCAATACTGTTCGCCACCGGCTAAGGCGTCAACACGAGACTGCCACGTAGATCTTGCCTCTGATTCTTCC'
        + 'TTTAAAGGTGACTGTCTAGCGCTACACGACCTATAATGAAGGGGATTTCAATCTGTCTAGATCGTTTCCTGGGTGTGTAA'
        + 'TCTACGCTTACTCGTCGGCGAATTACCCTATTGCGGGGCATTGGGGGGCGATACGCTAGCATGCTGACATGGCACGCTCA'
        + 'GTGTAACTACGCCCTGGAACGAGAGTGCGCTAGCCATTATAGCTGGTGATGGAGAACTACCCATACGTCGTTACTTTCCT'
        + 'GGGCGAGATGCCTTATAACTTTTAGGCTCGATACCGAGTTTCCTCGTACTCATGGACCCGTGGGGACCAGTCTAATCGAA'
        + 'TCGGAATCACGGCTGACCCTCAGAAAGACGTCTCCCCAAAAGCTGGAACCTAGCCATTTTTTCAACTGCTGAGCTAGTGT'
        + 'TTTATGGATTAAGATTAAATTATATCTAGCCCGCTTATGTGATGTGATAGTTTCATAATTGCCGCTAGCCCAACCCTCAC'
        + 'ACGACCTCGAGTGAATCTTTCGTAACACAACGTGAGAGAATAAGGACTTATGAGCTGAGGCAGGGTCCTGTTCGCTTACG'
        + 'CTAAACCGCCTAGACACGCAGCAACGGAGTGGGAAGACGTCCAATTTAACCTCTAGGAACCTAGATCGGGCTTAATCGAT'
        + 'AAACGAGATCCAATGGGAAGTACGTACGAATTAAGCTTGCACCGGAGTGTCGCGGCCGGGCCGGACGGCAAGCAGCCTGA'
        + 'GAGACCGCTATAATCCTATTGAGGCGCCAGATACTTCGTAGCTGTACTATATCACCTCCCTCACCCGTGTACTTTTGGGT'
        + 'ATGCTTTTGTTTGCGTTTTGGTAGCGATTAAAGCAGCGGGCGTTGCCACTCCTTGCTGGATAAATATCTCGAGAGGTTTG'
        + 'GGATTTTGGAACTTCACGTTAGGTGGACGGCAGCTCCTTTTGAGTCAACGGTTCCCCTGGATCCGCACCACTACTTCGAC'
        + 'CGAGGTCCGCGACGACCGCCTGGCAGGTTTGATTCTGTTATCACGTTAAGAAGAATTGAACAAGCACAATCTTGGGTCAG'
        + 'ATGGAGAGGTATCATGCGAATTGGCCGGCTAGTTGGACATTAGATGAAGCTAACCTACCACAGTGATATAATGTCGCACT'
        + 'GTCGTGCCTGCTTCAGCTGGTTGCTCAGATTTATGGCATCGCGGGGGAGCCCCCCCTGAAGGGAAATGTCTTAGCATTAG'
        + 'GAGTCACCGGCTGAGAACAAATGTTTCCCCTCCCCTGCTTATATAGATACCGACGATTACCAGTACTCTTTGACCACTAG'
        + 'GCGTTCAAGTTAGTGTAGTAAGGATCCGAGGCGAGTCTGACACTAGCAGCTAAGTTCATGGAGCCACTTGCAGCTTTACG'
        + 'CTGGTTTATGGGTGAAATTAAATGTCAAAAGCTGGCCATCCAGAAATGCCGCTCGTGGGAACAGAGTGGTAACGACCCCC'
        + 'AAGGTACGAATTGATACGCACGGCTTCTCACTAATCCCTGTACCTCTCACAGCAAATGTAAAGCTCGCCGTTGGACATAC'
        + 'TATCGTAAACCAGTCATATGCCCGTGTCATAAAGGGCTCATTTATCAGTTAATCGTTTGTGATGCGACAGTGCCTATAGT'
        + 'CTTGGCATACTGCGCTGCCCCTACGGATCGCATTGACTTGTCAGGCGGCAAATAGAGTTTCTCCGACGCCGGTCGTGTGC'
        + 'ACTATCTGTCTTCTAGTCTC',
      '+',
      '1-(5*2+75)6(./&2>\'>,35*,?:6:5,\'-342&<*(:;2<8:+9.:8(<8,1&,-9&9*8)204\'8:9\'\'//&75)6'
        + '02>,*034,78+<3>\'-=86?<1&7?,9>(;1>18+7\'/&;*602\'+8:*/&\'53).:.4;-/<9)-\'??-,27?4/3\'='
        + ',;+&,&&7)91+?.;761,)95&48=1+553/?70;.1?0<,<+>,;;78<38/;);>401-67,&(014-.3.4,-/=&'
        + '25)&0+&,08<?/;/52(?&.\'?;;*<./+.8<?:11=8;:=)3.&;7.=.,>/>2>032:2\'0<*02=>06+45+,(/5'
        + '*,=)&2+670.3682&?95/91:39\';(0+<1,7,65\'=?*(97314=.?75==2,>62?&5+,,=(-3+):1()=&2*<'
        + '-(6,5&;.\':3:>3<4-<4>)<?.*1=:>,;8:*3(?2/).<94)-0)=):<\'\'65>4/\'67-59/5978760-:09.+?'
        + '(2?&9>;02>-\'(:?4&\'6=*6?+;.2778:\',+-,9;:-:+54=(64742595(:((79)3:70:-*)<(35\'7<:0;='
        + '&7:)?+4/,)/6.-?3*-98=+++0>01.2<:1,>29;8+)+-8,>;,=28?\'-6:7;+:/)77202/9+&\'=7,8*>)7'
        + '.*=.=:(\'70&;25+820.082(6&:+4)36/3/&897:<*,547?821?.*;/+6**>&;(7;93;:44;(.19(:(*/'
        + '02+3<)3\'0\'75-6*85=++:,\')4)=&94-5<;2.>,-2)(?+,760/6.:)27+*\'.13?3-;2:248,).82-2\'\'+'
        + ';85,1;43<79&/17)498*\'7&,/4-//3)8(:<*710/?0-8\'--?\'6/()9<5>01&;&2&28+\'(570;9//3,\'1'
        + '=?=;+8/03?):*:/9,-?19.061/2<)9,*=05(\'9/6/=+)-&3(17277(=23)6<=;0=&)7>7640\':5)17<5'
        + '2.9?\'></&63\'8,<0-1,=4(-/>.22*4?,5)2?/<+(<+.=78?,,/511.8&>.6=:)*89>8,/\'\'12*3?8)1('
        + ':?&+*6?373>4-<0.&87=18<)\'+4?,2+4?;584;=</;;496.4?=(:/49:(;&))-23*&,.25(8;---5,++'
        + '-/5=?:+1;)18+\'?&8=74?+5>.5,:-+-7&*725/,-(;.)&037</=7-06/25\'7&/94023.\'<:46*5\'8/&7'
        + ':.4>40>=&\'\'+6-654.:&-7/?8)=-=997/,&8,+53?02,7=3-/,1+6:=56\';0,753&(9/,);&4(&?11\'8'
        + ';6:;*8;\'?8/1-/4;\'*)\'93819*-/+7**:..123,44+?,+89?\'&?;(,5,271*?+<2:)-*;-204(*1+/94'
        + '1.64-8=7<\'3(*,620\'+-7>+&,\'003(-;+;(4,-4,0=8>=0;0-,0\',*=/51?/&=*8=(3>)-?+0)(8?5:\''
        + '5.1/\'8(4;<8&7&,.-;0;*+;5321,,(9?-4=(51;79>)2\'7/,>>?*&\'9346):.\'866&=>.5&44<37;8-?'
        + '+88**8/.9<6?-)6+1(8=58-(+/700&3:1((226&2=:4:9&/6,662:3/7::1<,+&,((=3*9?5*=5-..=='
        + ':,:?/.:;0<::/)7&237-=,740-6077010?<>?9=(3+4>)315*1\',()9>19==1;9;73++67:>6\'+?=5:/'
        + '*479+8)/995=84&>+,.3.<+-<=\'(9<2=-*4(3)8,.3+,7?=9>(/(453(,+/97(/>*<4=81?.0\'8\'(0.5'
        + '+:72?.;,*8182(,883?842?980:\'.23?)*-&\'915:--(.<5\',8+2/0(2/3,8:;0<8&3/50735?7.20()'
        + '1,;6,/2),8+(2392:9;:80*4:&>6;<459?<59..\'+<:=1<6?;3;7(?)&?93=\'8=6<9&<;3<>&95./32&'
        + ';<)*9)*?59+16.15+&,3-(*>&.1729\':;\'1:>*21>&\'/2..=&4/4<(\'?4+8::-\'9?2+)54=(:=37/=8)'
        + '<(307>=(*/()229(38+290=,0;6792<*?06-+65*;3(\'?24?>182702\'>,=+>:&*724\',0\'8+<>87454'
        + '/1?03->\'?0<361(/..0,,4\'9<?0//-84=/-23(5=6=(3*;?8)3,:>,;5\'9(6&<&08:\'9?;9((87)32;.'
        + ',3&/5?15.&0::(26(87/0*.<>*0;*?4?\'/:-+3&0(31\'><,330-*(8-*;7)*:45()5\'03-<,+))>:5;='
        + ')/\'3&;,*6\'<?095+&=()*95:/7.96.3.<)/-0&4\'9>-10>57885*-+*=+)5/).4\'0;181;7.&(>-3&)='
        + '\'88\';5&+3;;+8)2\'0&<=7;34?\',29,+=70(<>(=56=.+4.)++631(03?:4)<0824&<+,7797>+1?<(,?'
        + ';2\',+>6\'\'5&/\'64.10;3,.?=01,0*00>*+/>810823+<7+0:*+.../++;5.(/8>&93/47.4)++=(*\'0('
        + ';*4<+=;>82&/+;&4<4-(',
      '@read9',
      'TGCCGCCTGACAAGTCAATGCGATCCGTAGGGGCAGCGCAGTATGCCAAGACTATAGGCACTGTCGCATCACAAACGATT'
        + 'AACTGATAAATGAGCCCTTTATGACACGGGCATATGACTGGTTTACGATAGTATGTCCAACGGCGAGCTTTACATTTGCT'
        + 'GTGAGAGGTACAGGGATTAGTGAGAAGCCGTGCGTATCAATTCGTACCTTGGGGGTCGTTACCACTCTGTTCCCACGAGC'
        + 'GGCATTTCTGGATGGCCAGCTTTTGACATTTAATTTCACCCATAAACCAGCGTAAAGCTGCAAGTGGCTCCATGAACTTA'
        + 'GCTGCTAGTGTCAGACTCGCCTCGGATCCTTACTACACTAACTTGAACGCCTAGTGGTCAAAGAGTACTGGTAATCGTCG'
        + 'GTATCTATATAAGCAGGGGAGGGGAAACATTTGTTCTCAGCCGGTGACTCCTAATGCTAAGACATTTCCCTTCAGGGGGG'
        + 'GCTCCCCCGCGATGCCATAAATCTGAGCAACCAGCTGAAGCAGGCACGACAGTGCGACATTATATCACTGTGGTAGGTTA'
        + 'GCTTCATCTAATGTCCAACTAGCCGGCCAATTCGCATGATACCTCTCCATCTGACCCAAGATTGTGCTTGTTCAATTCTT'
        + 'CTTAACGTGATAACAGAATCAAACCTGCCAGGCGGTCGTCGCGGACCTCGGTCGAAGTAGTGGTGCGGATCCAGGGGAAC'
        + 'CGTTGACTCAAAAGGAGCTGCCGTCCACCTAACGTGAAGTTCCAAAATCCCAAACCTCTCGAGATATTTATCCAGCAAGG'
        + 'AGTGGCAACGCCCGCTGCTTTAATCGCTACCAAAACGCAAACAAAAGCATACCCAAAAGTACACGGGTGAGGGAGGTGAT'
        + 'ATAGTACAGCTACGAAGTATCTGGCGCCTCAATAGGATTATAGCGGTCTCTCAGGCTGCTTGCCGTCCGGCCCGGCCGCG'
        + 'ACACTCCGGTGCAAGCTTAATTCGTACGTACTTCCCATTGGATCTCGTTTATCGATTAAGCCCGATCTAGGTTCCTAGAG'
        + 'GTTAAATTGGACGTCTTCCCACTCCGTTGCTGCGTGTCTAGGCGGTTTAGCGTAAGCGAACAGGACCCTGCCTCAGCTCA'
        + 'TAAGTCCTTATTCTCTCACGTTGTGTTACGAAAGATTCACTCGAGGTCGTGTGAGGGTTGGGCTAGCGGCAATTATGAAA'
        + 'CTATCACATCACATAAGCGGGCTAGATATAATTTAATCTTAATCCATAAAACACTAGCTCAGCAGTTGAAAAAATGGCTA'
        + 'GGTTCCAGCTTTTGGGGAGACGTCTTTCTGAGGGTCAGCCGTGATTCCGATTCGATTAGACTGGTCCCCACGGGTCCATG'
        + 'AGTACGAGGAAACTCGGTATCGAGCCTAAAAGTTATAAGGCATCTCGCCCAGGAAAGTAACGACGTATGGGTAGTTCTCC'
        + 'ATCACCAGCTATAATGGCTAGCGCACTCTCGTTCCAGGGCGTAGTTACACTGAGCGTGCCATGTCAGCATGCTAGCGTAT'
        + 'CGCCCCCCAATGCCCCGCAATAGGGTAATTCGCCGACGAGTAAGCGTAGATTACACACCCAGGAAACGATCTAGACAGAT'
        + 'TGAAATCCCCTTCATTATAGGTCGTGTAGCGCTAGACAGTCACCTTTAAAGGAAGAATCAGAGGCAAGATCTACGTGGCA'
        + 'GTCTCGTGTTGACGCCTTAGCCGGTGGCGAACAGTATTGACCTGGCCGATGCTAATATTCTGATTTGGGGTTGATTTGCG'
        + 'CTTCAGGCGCTAAAGTGGTTTTGAGTAACATGTCCTTTTGACGGGAGCAGGTCGCCTCAAGATAAGAGTAAACCTGCCTA'
        + 'CCAAAACTTTAAGCCGGCAGAAGCTTAACTATACCCACCGATGTGTACTCTGTTACACCGTCAGTGAGTGTAATGCTCTG'
        + 'GCTAGAGCCCACGCTTCCGGCTTCGTCCTCGTGCTCCAAGTACGATACCGCAAGGCAGACGCTGGTTCGCAGGTATCTGA'
        + 'CGAGCATACTCGCTAGCCTGTGAAGAACAAGCGATTCGAGTTGTACTCTCAGCCCGCACGGTACGCCTTCCATCGGCCCG'
        + 'ATCCTTCAGAGTCAAGGCAGTACGTTGGCAAATTAGGATTTCGAGAGGCACAATCGGCCAGGTCGGCGCGGCAAATACTT'
        + 'TCGACCCCTTAATTCCGAATCGAATGATACCTGATGCTAGTTCTAAGGTGTCGGACCTACGTGCTTGACCCACGACGTCT'
        + 'CAATATCAATTCCTACGATCAGAACTGACTACAGCGGAGACGGTAGAGGAACGGCTATAATAAGCCGTCGGTAAGCTTAA'
        + 'ACTTCTTCAGGCGCACCGTGTTGGAGTGCACTACCGTGAGGCAACTAGGCCAGGGCGTGAGGTGCCGCCCATTTTGCACG'
        + 'GGGACACGGTGTATGCGGACGCACATTCGACCACAAAGCACGAGACGGATTGCATAAGTTGTAAGGATGCAACCCAGGTG'
        + 'CGCGTAGTGGGCGATAGCCT',
      '+',
      '+9,.5);/\'::&3&06:(+>>2:,99200<.<;16289/7561)/<*\'8-81//*\'>7448458+&841)5>0.(+617\''
        + '<61:24.3&>1&786<83..\'5?5((3(:52\'1-.6=-,:5*?+-)>>,((&<=?8+:;&;<+541.15+:,>3*6\'6*:'
        + ',-09:.=3735\'/2*28:+:*5=/-&7+.\'3?44=)4,=/-=2<-3\'6=-.;.+-:1.68.*--78/2=72>&68,?1;2'
        + '>;*80>/4:05,51++8)76/::085+>5<?(6/+7:*671=947.9\'-<.,\'.=*1-\'0:67+\'(>294?8.*:6=(;<'
        + '&3&<.6+:\'078/:7?8,95,*-88:*5<10,+077(-/.;(?22?1,++.>9/&04,\'(,+5+<.<&/-51+:,5+505'
        + '3/7(6,<95>-2+<;&>;&<860=32),,2+3<)176)&:9))&5:6<2-9\'?()((44:=2210982;),:=77(.-3*'
        + ';//595:<:,163+=0//:/78.27)<0<7=6;;216==2<9/))\'8<.5-8;00-;4<;)07\'\'5*-3.82?+>:&7+0'
        + '29<</;&-?8&&>77.>:/,*6,8<?\'(29\'86/>)588<03<;*90\'\'*73\'>60716<?<949<4<?&9*?8+&8?./'
        + '8993<7-.2,2+4,14=(8;00\'3;0,*\'1.=(;=:7(>6;*/165;;/75,-72:;0<?340+7,153;56*=,92>0<'
        + '<<16/15/>1*3\'&\'-\'5)*);)?(.10>.85:;)9>8*?*;.3\'-)2:+5;0,(4)2>=:1\'31=((-?<)<&(*66.*'
        + '0<+/-:6(7,8:*3(5.-793<<&):-2)48414*+?&08.7>;10\'14&88>,0>>)\'>5(04/,3=83\'75?9;03:*'
        + '1:1.3,7&,<6/,7,4/<*=<*-<31??=2+(&&-*0&;=>;39*;&;\'+5?>.\',60139+&.<9&51<1+;-;/2;08'
        + '&*??;4/?><-+)2)6--*8;-.-.9*1?5-538((,/*3\'87=*>&?<6<)**(8=&0?73;973*(0>-\'?,.4>*)1'
        + '908=807*((,9346=6:1\'4,01\'+9,*7/*:;.)+1?/4(&-3)**6/1>94/+0;*9>30\'-=&7:;2/6\'&235&,'
        + '\';;*:4(9.<7<>&9>/04;+83=2=569(-5&>>0><--8:-:,7*831>32;4*=?:\'*3/1,+:*)>-\'7?=\'132='
        + '=2?8>2&=6.&6<?.&2:\'&,7*<+,>()3;)+/).>><&++:2:.-&?651::4,6\'=>)6*/<+56,8&8,819*&30'
        + '7\'6.(\'*=8,,36+<962\'?/7>=8(03(9<6,83+(3687-\'<*,42,.;999++*.=1*\'2,80425;9,/,:.>8\'4'
        + '0><);-7*\'\'0-1,&28*;(\'*94<,,1;)(73.&::5:80/,:=<\'4\',72,)8993??,\')5,?&=:3-594328)**'
        + ';5;439:<653)&63.?9>**5***/>-9<?=+-,;>8&?.(3?*.=(,+/<\'6&9&=</5)-=<\'34:-.:&29?+54,'
        + '-2+?(*::878&:1/(<4==0)6>(,?250*\':)9\'83<45;?\'(),54;+9;=-+8,3;051\'?3/.0=61=8*(4-;\''
        + '&38&96:>;=+13<6)1-0,8(8//39?073=:6=.8//6?-.9)07,)-?=/,*(2270117+6:0//23&)-1(5/5?'
        + '4>2)(\'(7-&+\'3:;*,1-4;-&60*;5.;,+&+?=486(*904*.(/*.96392=1.<4)38;2-5+7?/62&)/.<*<'
        + ',539*(1*>>=/:05;\':&1./.>)1<+(:<059+565.4(+6\'?)3)3;4?*;(?*73<01460>/;;<?*=*2?+,/.'
        + '9\'&39.6<4+;8\'?3+(<-4=661)6/;0431\':3+:*,32*>/>8;:;<0>0<?)2;->(*&:(1><9:6,;&>(/62?'
        + '+04=)47<)4(704.&?/*39+-4-9.::?+0*9(,06--559506)28,<;/;:<>6/;-190+;+<?+9,\'8>2/+0('
        + '.<60\'8+:<7;8.<(?-0;5533&0,*18>\',6\'->>3-*4&56*26:9.&/2(8*:+4\'*(19(>\'\'4><49*5976(('
        + '*3=0*7*2-69(33:2=4./137?*1+?.96>,&6<1*,29(.2?)&--2=09,:7+>7*&282;6)9<&6370=/=&+4'
        + '+2>,&\'+&6*-..>3=24:9;=&;2+1=.\'4?64<316+&<)62=7561&5*&;\'=0.(-8+44<2-85>2?),3(2(??'
        + '6<5(5?,+0.*9*<\'0+0)*?>?848.8;+6<<=,*025?*6:>><7\'940(;,\',,6663>>,38?)203?81;\'-.27'
        + ')06?3/69,1<,1)7.126&751>3;*=)633716-.>>=8:,88,1./55?+25*1020:95=36)3.,=2/44=/+.5'
        + '1,9=,;61436(8=-8870>23),656<4<)2*&7;1)(365??24:<<,.9,::4:08*99==&>-><-79<=,:<84*'
        + '4,=(5<8>6<.-2>/);?:1',
      '@read10',
      'GACCACGCGGACTCTGAAAGTCATTTTCGAACGAAGCTGGGCCGGTTGTTAGGCTATCGCCCACTACGCGCACCTGGGTT'
        + 'GCATCCTTACAACTTATGCAATCCGTCTCGTGCTTTGTGGTCGAATGTGCGTCCGCATACACCGTGTCCCCGTGCAAAAT'
        + 'GGGCGGCACCTCACGCCCTGGCCTAGTTGCCTCACGGTAGTGCACTCCAACACGGTGCGCCTGAAGAAGTTTAAGCTTAC'
        + 'CGACGGCTTATTATAGCCGTTCCTCTACCGTCTCCGCTGTAGTCAGTTCTGATCGTAGGAATTGATATTGAGACGTCGTG'
        + 'GGTCAAGCACGTAGGTCCGACACCTTAGAACTAGCATCAGGTATCATTCGATTCGGAATTAAGGGGTCGAAAGTATTTGC'
        + 'CGCGCCGACCTGGCCGATTGTGCCTCTCGAAATCCTAATTTGCCAACGTACTGCCTTGACTCTGAAGGATCGGGCCGATG'
        + 'GAAGGCGTACCGTGCGGGCTGAGAGTACAACTCGAATCGCTTGTTCTTCACAGGCTAGCGAGTATGCTCGTCAGATACCT'
        + 'GCGAACCAGCGTCTGCCTTGCGGTATCGTACTTGGAGCACGAGGACGAAGCCGGAAGCGTGGGCTCTAGCCAGAGCATTA'
        + 'CACTCACTGACGGTGTAACAGAGTACACATCGGTGGGTATAGTTAAGCTTCTGCCGGCTTAAAGTTTTGGTAGGCAGGTT'
        + 'TACTCTTATCTTGAGGCGACCTGCTCCCGTCAAAAGGACATGTTACTCAAAACCACTTTAGCGCCTGAAGCGCAAATCAA'
        + 'CCCCAAATCAGAATATTAGCATCGGCCAGGTCAATACTGTTCGCCACCGGCTAAGGCGTCAACACGAGACTGCCACGTAG'
        + 'ATCTTGCCTCTGATTCTTCCTTTAAAGGTGACTGTCTAGCGCTACACGACCTATAATGAAGGGGATTTCAATCTGTCTAG'
        + 'ATCGTTTCCTGGGTGTGTAATCTACGCTTACTCGTCGGCGAATTACCCTATTGCGGGGCATTGGGGGGCGATACGCTAGC'
        + 'ATGCTGACATGGCACGCTCAGTGTAACTACGCCCTGGAACGAGAGTGCGCTAGCCATTATAGCTGGTGATGGAGAACTAC'
        + 'CCATACGTCGTTACTTTCCTGGGCGAGATGCCTTATAACTTTTAGGCTCGATACCGAGTTTCCTCGTACTCATGGACCCG'
        + 'TGGGGACCAGTCTAATCGAATCGGAATCACGGCTGACCCTCAGAAAGACGTCTCCCCAAAAGCTGGAACCTAGCCATTTT'
        + 'TTCAACTGCTGAGCTAGTGTTTTATGGATTAAGATTAAATTATATCTAGCCCGCTTATGTGATGTGATAGTTTCATAATT'
        + 'GCCGCTAGCCCAACCCTCACACGACCTCGAGTGAATCTTTCGTAACACAACGTGAGAGAATAAGGACTTATGAGCTGAGG'
        + 'CAGGGTCCTGTTCGCTTACGCTAAACCGCCTAGACACGCAGCAACGGAGTGGGAAGACGTCCAATTTAACCTCTAGGAAC'
        + 'CTAGATCGGGCTTAATCGATAAACGAGATCCAATGGGAAGTACGTACGAATTAAGCTTGCACCGGAGTGTCGCGGCCGGG'
        + 'CCGGACGGCAAGCAGCCTGAGAGACCGCTATAATCCTATTGAGGCGCCAGATACTTCGTAGCTGTACTATATCACCTCCC'
        + 'TCACCCGTGTACTTTTGGGTATGCTTTTGTTTGCGTTTTGGTAGCGATTAAAGCAGCGGGCGTTGCCACTCCTTGCTGGA'
        + 'TAAATATCTCGAGAGGTTTGGGATTTTGGAACTTCACGTTAGGTGGACGGCAGCTCCTTTTGAGTCAACGGTTCCCCTGG'
        + 'ATCCGCACCACTACTTCGACCGAGGTCCGCGACGACCGCCTGGCAGGTTTGATTCTGTTATCACGTTAAGAAGAATTGAA'
        + 'CAAGCACAATCTTGGGTCAGATGGAGAGGTATCATGCGAATTGGCCGGCTAGTTGGACATTAGATGAAGCTAACCTACCA'
        + 'CAGTGATATAATGTCGCACTGTCGTGCCTGCTTCAGCTGGTTGCTCAGATTTATGGCATCGCGGGGGAGCCCCCCCTGAA'
        + 'GGGAAATGTCTTAGCATTAGGAGTCACCGGCTGAGAACAAATGTTTCCCCTCCCCTGCTTATATAGATACCGACGATTAC'
        + 'CAGTACTCTTTGACCACTAGGCGTTCAAGTTAGTGTAGTAAGGATCCGAGGCGAGTCTGACACTAGCAGCTAAGTTCATG'
        + 'GAGCCACTTGCAGCTTTACGCTGGTTTATGGGTGAAATTAAATGTCAAAAGCTGGCCATCCAGAAATGCCGCTCGTGGGA'
        + 'ACAGAGTGGTAACGACCCCCAAGGTACGAATTGATACGCACGGCTTCTCACTAATCCCTGTACCTCTCACAGCAAATGTA'
        + 'AAGCTCGCCGTTGGACATACTATCGTAAACCAGTCATATGCCCGTGTCATAAAGGGCTCATTTATCAGTTAATCGTTTGT'
        + 'GATGCGACAGTGCCTATAGT',
      '+',
      '84+/==&7/8/+/>6>9,4./(:1=21<8/:5;:/?)/3&*=94:--08?*:.-)94-653+<?:;5*9(-?53:;68(2'
        + '3),?(*5\'\'8<?48--3>20:5?700&>:?33>0>4.19.>1\'?\'+,28384?<9<,91?4,428>2++/.?=?-41&;='
        + '?:):81/-(0\'531\'0:6&=7>5;<31-,/;8-2738(3),:)=/5+/:?,)>0,&.2-0>8=>/<>;<0;>384/3+&1'
        + '05\'\'9\'&)?))<3-+((27*6,-,-\'>9(-&<&=&*((8.<2><(29>*,5.2\'96:1-.539\'<\'/*;\'3>93<3?6=7'
        + '/2((>,4*/3<4==05=/4,+>4/0028-7(4(8<),5+40\'/1==.4(:\'80:3968,?>\'488&1.8=7<*12:<:00'
        + ':/<&(,<./.57:&1+3/19=11)/2,349>+>)><5:&85/):&*430.77;=7=*+&;?+4-;>4+)+<7<\'((69<<'
        + '*.78<:\'),43\')??>7(0\'321837:7:2:;&,4/31=,040:.1&<?1((/34)=6<45:/;41=+&.8<>.2=68;:'
        + '-8?/&+.0+203.38(96*/:=01?,*676790.318(+-\'7,0.=388,*06;812)0156)&\'-9>&:<(/\'?+)&-&'
        + ';../.-6:\'=28699/1-/*,-52?5&(),(38\'/(-7?\'=0,,?67?+)08<)\'./03\'4=;6??\'0,=6*-<+.7700'
        + '--)?::7&>6<,>*?2)?*;))6=.)2\'<&951.067764&./;)/5<>1?,8&?\'.?/)?*/=8\'=:;&3=*16(?5;>'
        + ')&\'61-5\'3&-);;&-*<->4-=>-&*)<97;0<\'-3&?5,/&90,1;3?\'8=&5:8(=0&((9?*2\'&+1:=)51)2.;'
        + ':+2(,(:,006<+:5/\'&9;5\'5,244-7*8;349;9;=/(?)/&&2689/).3*?*6:/556,>8)?*?,8*82>**.='
        + '5469/9/-10*<825+:>696<?83.1,&-76?:1=989.1<&4+&7<78,(:00<==?*\'85()8,2,6+14:>/\'=0:'
        + '?,<213=<.>\')2?<?06;26+791?&:=3*(?)?*,,=.27=.-:9+3&&27*\'2=2:2---6,,61\'8)<=,4/(:\'7'
        + '&1=1193\'0++\'4\'43>+(024<<&?*26230,;+//3::724*0=;>13>?3/;9,7..-,-:3.=2>&>\'8<=.+;1*'
        + ';>).,,\'(-,7);=58;(/?(.<?;0.<=&/:.417++;0(68\'3->35&-(+)-6>=2?>+)73:\'</02(?.-;<\'>1'
        + '\'-27&.\'9.>=5.9./9./?)17,:+<-887=;5>-68>/0.;,002>,;1+*25\'5/,3;5-5:;20.)<0</>)399='
        + '>:(=4:*.0?):20>::=./7::&)>\'?(069642-=:(44-&+824-79;,29:->80+(1=;<\'(4+&++>\'4-(7(8'
        + ';8-+.&6)4.6\'4./=)/55<\'5-56=5;3=14/?*3&(=+1;9,>,9+<;*\'<\';(0.,>\'3/>5?4)).7;:.?)+-9'
        + '6>54-\'./29(667)1.&+:=0;9/.,=1>>0(:\'40*\':;*.0.84(&54\'786?4*35*,82/9/?*3/4</,2&;;='
        + '1<6926)&0?5,>/,<2)</?44:083;/-*0=,?8&*),5);3,7-87<508=5+&<05*558;0/-7:\'<56-.(&->'
        + '&49*9=->9;\'3,6<4353=(.>)(+72-645=/029+3/\'7)-19611,\'82&=*1?1?17&+,.1/?=+.7?)90(>9'
        + '6:*<1*5:/4-<*+,<)0:\'?77++8&?2(1-&4-;;)?0;4*.473?7.<+,;1?47<..(:>/\'&=/=<7<9,24=\'.'
        + '3.,:-,>;:57,)(65/1):>66\'6*9089\'+1/;953**8>>?&,,8?*56-2&(:54(9;.0?,(6*4?*(\'(+9=:)'
        + '59376*/6:748-\':(*</-;<;1)\'5,,?:+=.3*/7-36241(=5303/99(=?4.593;-1/?\'*61)39:4.68:<'
        + ';-5\'(<+<3)&80:+;--/\'422/.>7-==&9?,?7*,>*7<-(3*4156:.82>65,8(9\'691&3232(?*478++-3'
        + '2)&2(-&9=+.16()\'6>745>3(-=/(/\'*?(273=*(*5?&.:*:=.(14:(->,*57>&-722.8),(<7&-&/.6+'
        + '\'=+,274/7;\',,*)3-82(4895/>6838\'2;6=(=0&<294:57*5=..60.8087)(/-40:*(;+=13>+>*(+<:'
        + '/3&4&05&&7(6/,*2\'7&?>.37-.*>*?1.7+56(2+/&:&1242<&?>92,++:&3/0/(;5\'*,3&(<1&133>=8'
        + '.\'5;:=;81*>.>.;(7>\'9/?7)<&7,,/*)392<-=&(7<-5&9<(<4;+4;87>\'3//:?=:+02\':0><-,3256='
        + '/441<\'*?)2?36))\'-772&&8)=4/,7<\'2+*:<-.17>72*4?\'&5)(*88?+49.*&<(5\'/0674\'\'.&\'(\'>3('
        + '20?-+&3<):?;34/(&))*',
      '@read11',
      'ATGACACGGGCATATGACTGGTTTACGATAGTATGTCCAACGGCGAGCTTTACATTTGCTGTGAGAGGTACAGGGATTAG'
        + 'TGAGAAGCCGTGCGTATCAATTCGTACCTTGGGGGTCGTTACCACTCTGTTCCCACGAGCGGCATTTCTGGATGGCCAGC'
        + 'TTTTGACATTTAATTTCACCCATAAACCAGCGTAAAGCTGCAAGTGGCTCCATGAACTTAGCTGCTAGTGTCAGACTCGC'
        + 'CTCGGATCCTTACTACACTAACTTGAACGCCTAGTGGTCAAAGAGTACTGGTAATCGTCGGTATCTATATAAGCAGGGGA'
        + 'GGGGAAACATTTGTTCTCAGCCGGTGACTCCTAATGCTAAGACATTTCCCTTCAGGGGGGGCTCCCCCGCGATGCCATAA'
        + 'ATCTGAGCAACCAGCTGAAGCAGGCACGACAGTGCGACATTATATCACTGTGGTAGGTTAGCTTCATCTAATGTCCAACT'
        + 'AGCCGGCCAATTCGCATGATACCTCTCCATCTGACCCAAGATTGTGCTTGTTCAATTCTTCTTAACGTGATAACAGAATC'
        + 'AAACCTGCCAGGCGGTCGTCGCGGACCTCGGTCGAAGTAGTGGTGCGGATCCAGGGGAACCGTTGACTCAAAAGGAGCTG'
        + 'CCGTCCACCTAACGTGAAGTTCCAAAATCCCAAACCTCTCGAGATATTTATCCAGCAAGGAGTGGCAACGCCCGCTGCTT'
        + 'TAATCGCTACCAAAACGCAAACAAAAGCATACCCAAAAGTACACGGGTGAGGGAGGTGATATAGTACAGCTACGAAGTAT'
        + 'CTGGCGCCTCAATAGGATTATAGCGGTCTCTCAGGCTGCTTGCCGTCCGGCCCGGCCGCGACACTCCGGTGCAAGCTTAA'
        + 'TTCGTACGTACTTCCCATTGGATCTCGTTTATCGATTAAGCCCGATCTAGGTTCCTAGAGGTTAAATTGGACGTCTTCCC'
        + 'ACTCCGTTGCTGCGTGTCTAGGCGGTTTAGCGTAAGCGAACAGGACCCTGCCTCAGCTCATAAGTCCTTATTCTCTCACG'
        + 'TTGTGTTACGAAAGATTCACTCGAGGTCGTGTGAGGGTTGGGCTAGCGGCAATTATGAAACTATCACATCACATAAGCGG'
        + 'GCTAGATATAATTTAATCTTAATCCATAAAACACTAGCTCAGCAGTTGAAAAAATGGCTAGGTTCCAGCTTTTGGGGAGA'
        + 'CGTCTTTCTGAGGGTCAGCCGTGATTCCGATTCGATTAGACTGGTCCCCACGGGTCCATGAGTACGAGGAAACTCGGTAT'
        + 'CGAGCCTAAAAGTTATAAGGCATCTCGCCCAGGAAAGTAACGACGTATGGGTAGTTCTCCATCACCAGCTATAATGGCTA'
        + 'GCGCACTCTCGTTCCAGGGCGTAGTTACACTGAGCGTGCCATGTCAGCATGCTAGCGTATCGCCCCCCAATGCCCCGCAA'
        + 'TAGGGTAATTCGCCGACGAGTAAGCGTAGATTACACACCCAGGAAACGATCTAGACAGATTGAAATCCCCTTCATTATAG'
        + 'GTCGTGTAGCGCTAGACAGTCACCTTTAAAGGAAGAATCAGAGGCAAGATCTACGTGGCAGTCTCGTGTTGACGCCTTAG'
        + 'CCGGTGGCGAACAGTATTGACCTGGCCGATGCTAATATTCTGATTTGGGGTTGATTTGCGCTTCAGGCGCTAAAGTGGTT'
        + 'TTGAGTAACATGTCCTTTTGACGGGAGCAGGTCGCCTCAAGATAAGAGTAAACCTGCCTACCAAAACTTTAAGCCGGCAG'
        + 'AAGCTTAACTATACCCACCGATGTGTACTCTGTTACACCGTCAGTGAGTGTAATGCTCTGGCTAGAGCCCACGCTTCCGG'
        + 'CTTCGTCCTCGTGCTCCAAGTACGATACCGCAAGGCAGACGCTGGTTCGCAGGTATCTGACGAGCATACTCGCTAGCCTG'
        + 'TGAAGAACAAGCGATTCGAGTTGTACTCTCAGCCCGCACGGTACGCCTTCCATCGGCCCGATCCTTCAGAGTCAAGGCAG'
        + 'TACGTTGGCAAATTAGGATTTCGAGAGGCACAATCGGCCAGGTCGGCGCGGCAAATACTTTCGACCCCTTAATTCCGAAT'
        + 'CGAATGATACCTGATGCTAGTTCTAAGGTGTCGGACCTACGTGCTTGACCCACGACGTCTCAATATCAATTCCTACGATC'
        + 'AGAACTGACTACAGCGGAGACGGTAGAGGAACGGCTATAATAAGCCGTCGGTAAGCTTAAACTTCTTCAGGCGCACCGTG'
        + 'TTGGAGTGCACTACCGTGAGGCAACTAGGCCAGGGCGTGAGGTGCCGCCCATTTTGCACGGGGACACGGTGTATGCGGAC'
        + 'GCACATTCGACCACAAAGCACGAGACGGATTGCATAAGTTGTAAGGATGCAACCCAGGTGCGCGTAGTGGGCGATAGCCT'
        + 'AACAACCGGCCCAGCTTCGTTCGAAAATGACTTTCAGAGTCCGCGTGGTCCTGCGGAGATCCGTCACGATCTCGAACACG'
        + 'CGACTTATGTGACCAACCTA',
      '+',
      '<:&12030&9181053?8031-<5/47)8=5:8+2=&5=5(2)--.?/-;+2-9.,2-/7.,:43)4.8?4:63,578-6'
        + '2&:2<<(2):<***(36.,<699.+3946;\'>1\'(4:7)4,>;+,)3679\'23=10<6\'\'+8/<1>/2&:.15,9/?*/2'
        + '=6\':(;?&1&6+,4(\'7237+7-)?\'*)2463-5:9.6+45*-965>.(82286?/-=90=&49:+)10:,)+>,7/1)<'
        + '9:)-:84,19,/40)9=</&4,,.&?0=3;/>0/(\'<-89?3\'/:4:\'06\'859)<8&33/.\'>/2=<90+=:1740(4/'
        + ';/480/>=3=3+:9((?+/>,).8=+9?=&008\'1=\'<4.7&7:0=*=31=.*.9;(4/&(8/(0&&+>,0?=6:=?355'
        + '*3?,7:/=15&.67(<),288*;,,,&.036147+?&75208\'<1:)*,;7++/2:+&*56\'943*(-+55&?(10:422'
        + '-:*764;0.:5=+(&=,>363723\'-800:/)1<:;>3*;7:)?4\'<17\':/\'9*>66-(?1;5*;,6-3/.?7144=37'
        + ',:4=39\'77,.7:):))9?+?560)&-?&0:54.)2<\'6,\'>\'<-394874(9=3;-17>9)85>.,..;3??)>-91(2'
        + '3241>?>\'9=.6(233-&*1,(;;79,=7)-<):2\'178/709=28;6547:::>1:066<=7+797>&4(;+:=*)3\'8'
        + '</=/023.56=+2<0(*8=.\'00.3&155?77&(:+)*+335*7-;,5469-;=6/&<.)::269)4>15).2*\'00)8='
        + '7::29&*&\',,4>+.+=9-78\'0<\'99)9>4,1(-5,678)1?,35(32>6-5*4-701<8424.&6>+41(==&\'70+='
        + ':+.*06*)9218..()?+=246:\'>&6:5,02(,;&.5-./=48(8-=5;\'4-.0>\'8;/;5?\'((69\'-:.2?;\'4-?<'
        + '&.-/:?)+2*;=7-29&+41:?)*.,9=3/,:0<656=1051:?/941=&&\'?3\'(11>9-8,6:,.0()74,4>9*3/-'
        + '=6\'64\';768,85+5.)3;012*71-22>3\'??6)2/0)5:&/19<4?&<&<:(*39*-*>3(1&68+0)).;56/26.<'
        + '3=7*=3>&+8+32/4?4..18/\'-.&2*/>)0)1/?3384<992(<+)64/4*:<99910,/\':<;2-/2,9,)35>?)6'
        + '28=+*.\'(01?4..909783((>5/-3;\'14>56;/;,-.;.47\'<8/)+964=?>?15<:?\'>36;<?*+,3*>00:25'
        + '61;,*4&038372;-7>&*97=?2*6/\'.+>7\')1385-,:8=81;:8?/=.9->&6,17)2\'74)76=69\'?(;4+<=*'
        + '5<:22-5.<?;\'4(//\',/4-6>&,0;*59,5\'/(;59:25?+3\'1=+5*224?(2>/87509?;=-7&&*(3\'/47-?0'
        + '-5;)9):,<;4:4(8;/9&-??2/&==?,*58=<&>6/\')&:\'2-58=:>7\'(=52.3(1;\'\'5>./6()*3+9&1*38:'
        + '.2(>=;3*?<;0)=,3)135.+4,7/(9,*.\'675)5.)*)68<>(,0(9;:8),**9(?\'/\';?7(<*>+(--\')5>+1'
        + '698((0**0+/5=4/1084<((>+(+&;1+8-(>7?5,9,6-67;768(10+2=<),4,52>*:9+<)/*=();66)66\''
        + '18\'2-868\'*\'(9()7/652(;\'6(6.-<)<88514/&>--?15*8=;252<47&)\'9*+&6-3=5450,1*0:6/>:&('
        + '?;:.:&)60=77+820.=<-9)8?>12>:<\':;8,2>-.7>33\'6=+0843+?4:(1\'2?2;07?(,49*4*6+\'\'9274'
        + '.*,&5\'.8::**=>?.00./5552/3-&04:1&459/;8)-7:).9<:?8377+,+\'6&/2=0&.,<9-7>*+4(-/.8/'
        + '?4\'-?.9905-((;3?,9?4+0\':-2-&)0=9+(\'?286?&/>-9=<4.<5\'-+<-.-847/).5;<0;417)>31)>2>'
        + '*2.>1/?*00>>4:\'-99>+>550:>3)220/+49,7;7-&86+=:&,-(&=6>>7>+)1)**689->;(>(2.-0+716'
        + '492=*--0*22041<1<>,&-2-6;55/,88>?>&/,+7;0-=*4-5;9/3655+>&-2<9;63+=)9273?,+<+:+42'
        + ')?1--1+1+33?3,58+8705/,0.&0+9=4.\'+117\'\'.+;412(7?-)+;9/+<\'-*,;88.5,&2\'/)>2&9+:*30'
        + '<>?)5:)<<1(;*3\'&?>85*58\'?\'03(?51</?;:-);/87=87?=:<(-9,87-*13)1;>2=+)3.(>&3085,4+'
        + '?5),1\'*-)1>-73+>,,6\'(63)3/7?2-0-7)=<08*4.>+101?9)2>,:*69>);?0(8:6-74?():;<0\'&&)-'
        + '9<?3&12,,,;6/7>4)64>?7?<010&6;175985474*=&8=2;/+*84\'?0>?8&:&8&54;4+51</8-5&?3.1:'
        + '*)<><43>50>1&:/>>)6=',
    ].join('\n'),
  },
  {
    id: 'READ_OVERLAPS',
    validator: 'readOverlaps',
    defaultExtension: '.paf',
    uploadExtensions: ['.paf'],
    edgeColor: '#0097a7',
    example: [
      'read1\t2500\t54\t2499\t-\tread2\t2500\t51\t2496\t2445\t2445\t0\ttp:A:S\tcm:i:819\ts1:i:2445\tdv:f:0.0001\trl:i:0',
      'read1\t2500\t102\t2499\t+\tread3\t2500\t2\t2399\t2397\t2397\t0\ttp:A:S\tcm:i:804\ts1:i:2397\tdv:f:0.0001\trl:i:0',
      'read1\t2500\t154\t2499\t-\tread4\t2500\t151\t2496\t2345\t2345\t0\ttp:A:S\tcm:i:790\ts1:i:2345\tdv:f:0.0001\trl:i:0',
      'read1\t2500\t203\t2499\t+\tread5\t2500\t3\t2299\t2296\t2296\t0\ttp:A:S\tcm:i:772\ts1:i:2296\tdv:f:0.0001\trl:i:0',
      'read1\t2500\t250\t2499\t-\tread6\t2500\t251\t2500\t2249\t2249\t0\ttp:A:S\tcm:i:755\ts1:i:2249\tdv:f:0.0001\trl:i:0',
      'read1\t2500\t300\t2499\t+\tread7\t2500\t0\t2199\t2199\t2199\t0\ttp:A:S\tcm:i:739\ts1:i:2199\tdv:f:0.0001\trl:i:0',
      'read1\t2500\t351\t2499\t-\tread8\t2500\t351\t2499\t2148\t2148\t0\ttp:A:S\tcm:i:723\ts1:i:2148\tdv:f:0.0001\trl:i:0',
      'read1\t2500\t403\t2499\t+\tread9\t2500\t3\t2099\t2096\t2096\t0\ttp:A:S\tcm:i:706\ts1:i:2096\tdv:f:0.0001\trl:i:0',
      'read1\t2500\t453\t2499\t-\tread10\t2500\t451\t2497\t2046\t2046\t0\ttp:A:S\tcm:i:690\ts1:i:2046\tdv:f:0.0001\trl:i:0',
      'read1\t2500\t500\t2499\t+\tread11\t2500\t0\t1999\t1999\t1999\t0\ttp:A:S\tcm:i:671\ts1:i:1999\tdv:f:0.0001\trl:i:0',
      'read2\t2500\t0\t2448\t-\tread3\t2500\t2\t2450\t2448\t2448\t0\ttp:A:S\tcm:i:820\ts1:i:2448\tdv:f:0.0001\trl:i:0',
      'read2\t2500\t0\t2396\t+\tread4\t2500\t100\t2496\t2396\t2396\t0\ttp:A:S\tcm:i:806\ts1:i:2396\tdv:f:0\trl:i:0',
      'read2\t2500\t0\t2347\t-\tread5\t2500\t3\t2350\t2347\t2347\t0\ttp:A:S\tcm:i:788\ts1:i:2347\tdv:f:0.0001\trl:i:0',
      'read2\t2500\t0\t2300\t+\tread6\t2500\t200\t2500\t2300\t2300\t0\ttp:A:S\tcm:i:771\ts1:i:2300\tdv:f:0\trl:i:0',
      'read2\t2500\t0\t2250\t-\tread7\t2500\t0\t2250\t2250\t2250\t0\ttp:A:S\tcm:i:755\ts1:i:2250\tdv:f:0.0001\trl:i:0',
      'read2\t2500\t0\t2199\t+\tread8\t2500\t300\t2499\t2199\t2199\t0\ttp:A:S\tcm:i:739\ts1:i:2199\tdv:f:0\trl:i:0',
      'read2\t2500\t0\t2147\t-\tread9\t2500\t3\t2150\t2147\t2147\t0\ttp:A:S\tcm:i:722\ts1:i:2147\tdv:f:0.0001\trl:i:0',
      'read3\t2500\t54\t2496\t-\tread4\t2500\t54\t2496\t2442\t2442\t0\ttp:A:S\tcm:i:820\ts1:i:2442\tdv:f:0.0001\trl:i:0',
      'read3\t2500\t103\t2496\t+\tread5\t2500\t3\t2396\t2393\t2393\t0\ttp:A:S\tcm:i:802\ts1:i:2393\tdv:f:0.0001\trl:i:0',
      'read3\t2500\t150\t2496\t-\tread6\t2500\t154\t2500\t2346\t2346\t0\ttp:A:S\tcm:i:785\ts1:i:2346\tdv:f:0.0001\trl:i:0',
      'read3\t2500\t200\t2496\t+\tread7\t2500\t0\t2296\t2296\t2296\t0\ttp:A:S\tcm:i:769\ts1:i:2296\tdv:f:0.0001\trl:i:0',
      'read3\t2500\t251\t2496\t-\tread8\t2500\t254\t2499\t2245\t2245\t0\ttp:A:S\tcm:i:753\ts1:i:2245\tdv:f:0.0001\trl:i:0',
      'read3\t2500\t303\t2496\t+\tread9\t2500\t3\t2196\t2193\t2193\t0\ttp:A:S\tcm:i:736\ts1:i:2193\tdv:f:0.0001\trl:i:0',
      'read4\t2500\t4\t2447\t-\tread5\t2500\t3\t2446\t2443\t2443\t0\ttp:A:S\tcm:i:820\ts1:i:2443\tdv:f:0.0001\trl:i:0',
      'read4\t2500\t4\t2400\t+\tread6\t2500\t104\t2500\t2396\t2396\t0\ttp:A:S\tcm:i:803\ts1:i:2396\tdv:f:0\trl:i:0',
      'read4\t2500\t4\t2350\t-\tread7\t2500\t0\t2346\t2346\t2346\t0\ttp:A:S\tcm:i:787\ts1:i:2346\tdv:f:0.0001\trl:i:0',
      'read4\t2500\t4\t2299\t+\tread8\t2500\t204\t2499\t2295\t2295\t0\ttp:A:S\tcm:i:771\ts1:i:2295\tdv:f:0\trl:i:0',
      'read4\t2500\t4\t2247\t-\tread9\t2500\t3\t2246\t2243\t2243\t0\ttp:A:S\tcm:i:754\ts1:i:2243\tdv:f:0.0001\trl:i:0',
      'read5\t2500\t50\t2496\t-\tread6\t2500\t54\t2500\t2446\t2446\t0\ttp:A:S\tcm:i:821\ts1:i:2446\tdv:f:0.0001\trl:i:0',
      'read5\t2500\t100\t2496\t+\tread7\t2500\t0\t2396\t2396\t2396\t0\ttp:A:S\tcm:i:805\ts1:i:2396\tdv:f:0.0001\trl:i:0',
      'read5\t2500\t151\t2496\t-\tread8\t2500\t154\t2499\t2345\t2345\t0\ttp:A:S\tcm:i:789\ts1:i:2345\tdv:f:0.0001\trl:i:0',
      'read5\t2500\t203\t2496\t+\tread9\t2500\t3\t2296\t2293\t2293\t0\ttp:A:S\tcm:i:772\ts1:i:2293\tdv:f:0.0001\trl:i:0',
      'read6\t2500\t2\t2450\t-\tread7\t2500\t0\t2448\t2448\t2448\t0\ttp:A:S\tcm:i:821\ts1:i:2448\tdv:f:0.0001\trl:i:0',
      'read6\t2500\t2\t2399\t+\tread8\t2500\t102\t2499\t2397\t2397\t0\ttp:A:S\tcm:i:805\ts1:i:2397\tdv:f:0\trl:i:0',
      'read6\t2500\t2\t2347\t-\tread9\t2500\t3\t2348\t2345\t2345\t0\ttp:A:S\tcm:i:788\ts1:i:2345\tdv:f:0.0001\trl:i:0',
      'read7\t2500\t51\t2497\t-\tread8\t2500\t53\t2499\t2446\t2446\t0\ttp:A:S\tcm:i:821\ts1:i:2446\tdv:f:0.0001\trl:i:0',
      'read7\t2500\t103\t2497\t+\tread9\t2500\t3\t2397\t2394\t2394\t0\ttp:A:S\tcm:i:804\ts1:i:2394\tdv:f:0.0001\trl:i:0',
      'read8\t2500\t0\t2447\t-\tread9\t2500\t3\t2450\t2447\t2447\t0\ttp:A:S\tcm:i:822\ts1:i:2447\tdv:f:0.0001\trl:i:0',
      'read10\t2500\t50\t2497\t-\tread9\t2500\t53\t2500\t2447\t2447\t0\ttp:A:S\tcm:i:823\ts1:i:2447\tdv:f:0.0001\trl:i:0',
      'read10\t2500\t4\t2450\t-\tread11\t2500\t0\t2446\t2446\t2446\t0\ttp:A:S\tcm:i:822\ts1:i:2446\tdv:f:0.0001\trl:i:0',
      'read10\t2500\t100\t2497\t+\tread8\t2500\t0\t2397\t2397\t2397\t0\ttp:A:S\tcm:i:806\ts1:i:2397\tdv:f:0.0001\trl:i:0',
      'read10\t2500\t153\t2497\t-\tread7\t2500\t153\t2497\t2344\t2344\t0\ttp:A:S\tcm:i:788\ts1:i:2344\tdv:f:0.0001\trl:i:0',
      'read10\t2500\t202\t2497\t+\tread6\t2500\t2\t2297\t2295\t2295\t0\ttp:A:S\tcm:i:772\ts1:i:2295\tdv:f:0.0001\trl:i:0',
      'read10\t2500\t254\t2497\t-\tread5\t2500\t253\t2496\t2243\t2243\t0\ttp:A:S\tcm:i:756\ts1:i:2243\tdv:f:0.0001\trl:i:0',
      'read10\t2500\t304\t2497\t+\tread4\t2500\t4\t2197\t2193\t2193\t0\ttp:A:S\tcm:i:738\ts1:i:2193\tdv:f:0.0001\trl:i:0',
      'read10\t2500\t354\t2497\t-\tread3\t2500\t353\t2496\t2143\t2143\t0\ttp:A:S\tcm:i:720\ts1:i:2143\tdv:f:0.0001\trl:i:0',
      'read10\t2500\t400\t2497\t+\tread2\t2500\t0\t2097\t2097\t2097\t0\ttp:A:S\tcm:i:706\ts1:i:2097\tdv:f:0.0001\trl:i:0',
      'read11\t2500\t0\t2400\t+\tread9\t2500\t100\t2500\t2400\t2400\t0\ttp:A:S\tcm:i:804\ts1:i:2400\tdv:f:0\trl:i:0',
      'read11\t2500\t0\t2350\t-\tread8\t2500\t0\t2350\t2350\t2350\t0\ttp:A:S\tcm:i:787\ts1:i:2350\tdv:f:0.0001\trl:i:0',
      'read11\t2500\t0\t2297\t+\tread7\t2500\t200\t2497\t2297\t2297\t0\ttp:A:S\tcm:i:769\ts1:i:2297\tdv:f:0\trl:i:0',
      'read11\t2500\t0\t2248\t-\tread6\t2500\t2\t2250\t2248\t2248\t0\ttp:A:S\tcm:i:753\ts1:i:2248\tdv:f:0.0001\trl:i:0',
      'read11\t2500\t0\t2196\t+\tread5\t2500\t300\t2496\t2196\t2196\t0\ttp:A:S\tcm:i:737\ts1:i:2196\tdv:f:0\trl:i:0',
      'read11\t2500\t0\t2146\t-\tread4\t2500\t4\t2150\t2146\t2146\t0\ttp:A:S\tcm:i:719\ts1:i:2146\tdv:f:0.0001\trl:i:0',
      'read11\t2500\t0\t2096\t+\tread3\t2500\t400\t2496\t2096\t2096\t0\ttp:A:S\tcm:i:701\ts1:i:2096\tdv:f:0\trl:i:0',
      'read11\t2500\t0\t2050\t-\tread2\t2500\t0\t2050\t2050\t2050\t0\ttp:A:S\tcm:i:687\ts1:i:2050\tdv:f:0.0001\trl:i:0',
    ].join('\n'),
  },
  {
    id: 'EPS',
    validator: 'eps',
    defaultExtension: '.eps',
    uploadExtensions: ['.eps'],
    edgeColor: '#546e7a',
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

import { isDataValue } from './dataValue';
import logger from './logger';
import { getTypeDefinitions, isTypeBinary } from './typeDefinitions';

const BINARY_MAGIC = {
  BGZF: [0x1f, 0x8b, 0x08, 0x04],   // gzip compressed
  BAM:  [0x42, 0x41, 0x4d, 0x01],   // "BAM\x01" (uncompressed)
  BCF:  [0x42, 0x43, 0x46, 0x02],   // "BCF\x02" (uncompressed)
  BAI:  [0x42, 0x41, 0x49, 0x01],   // "BAI\x01" (index for BAM)
  CSI:  [0x43, 0x53, 0x49, 0x01],   // "CSI\x01" (index for BCF/VCF)
  CRAM: [0x43, 0x52, 0x41, 0x4d],   // "CRAM"
  MMI:  [0x4d, 0x4d, 0x49, 0x02],   // "MMI\x02" (minimap2 index)
  BIGBED: [0xeb, 0xf2, 0x89, 0x87], // 0x8789F2EB, little-endian
  BIGBED_BE: [0x87, 0x89, 0xf2, 0xeb],
  BIGWIG: [0x26, 0xfc, 0x8f, 0x88], // 0x888FFC26, little-endian
  BIGWIG_BE: [0x88, 0x8f, 0xfc, 0x26],
  FMD:  [0x52, 0x4c, 0x44, 0x03],   // "RLD\x03" (ropebwt3 fermi-delta index)
  YAK:  [0x59, 0x41, 0x4b, 0x02],   // "YAK\x02" (yak k-mer hash table)
};

function validateFasta(content) {
  const lines = content?.trim().split('\n');
  if (!lines || lines[0][0] !== '>') return false;

  const sequence = lines.slice(1).join('').trim();
  return sequence && /^[A-Z*.\-\s]+$/i.test(sequence);
}

function validateMultiFasta(content) {
  if (!content) return false

  const headerCount = (content.match(/>/g) || []).length;
  if (headerCount == 0) return false

  const entries = content.split('>').filter(entry => entry.trim());
  if (headerCount !== entries.length) {
    return false;
  }
  return entries.every(entry => validateFasta('>' + entry.trim()));
}

function validateEfa(content) {
  if (!content) return false;

  const sections = content
    .split(/(?=^<)/m)
    .map(section => section.trim())
    .filter(Boolean);

  if (!sections.length) return false;

  return sections.every(section => {
    const lines = section.split(/\r?\n/);
    if (!lines[0].startsWith('<') || lines.length < 3) return false;
    return validateMultiFasta(lines.slice(1).join('\n'));
  });
}

function validateFastq(content) {
  const lines = content?.trim().split('\n');

  if (lines.length % 4 !== 0) return false;

  for (let i = 0; i < lines.length; i += 4) {
    const header = lines[i].trim();
    const sequence = lines[i + 1].trim();
    const plusLine = lines[i + 2].trim();
    const quality = lines[i + 3].trim();

    if (header[0] !== '@' || plusLine[0] !== '+') {
      return false;
    }

    if (!/^[A-Z\s]+$/i.test(sequence)) {
      return false;
    }

    if (!/^[\x21-\x7E]+$/.test(quality)) {
      return false;
    }
  }

  return true;
}

function validateDNA(content) {
  return /^[ACGTN]+$/i.test(content.trim());
}

function validateRNA(content) {
  return /^[ACGUN]+$/i.test(content.trim());
}

function validateAminoAcids(content) {
  return /^[ACDEFGHIKLMNPQRSTUVWY-]+$/i.test(content.trim());
}

function validatePackagedFastq(content) {
  // ???????
}

function validateNum(content) {
  const lines = content.trim().split('\n');

  return lines.every(line => /^[+-]?(\d+(\.\d*)?|\.\d+)$/.test(line.trim()));
}

function validateBin(content) {
  const lines = content.trim().split('\n');

  return lines.every(line => /^[01]+$/.test(line.trim()));
}

function validateBed(content) {
  if (!content) return false;
  const lines = content.trim().split('\n');
  return lines.every(line => {
    if (line.startsWith('track') || line.startsWith('browser')) return true;
    const fields = line.split('\t');
    return fields.length >= 3 && !isNaN(fields[1]) && !isNaN(fields[2]);
  });
}

function validateGff(content) {
  if (!content) return false;
  const lines = content.trim().split('\n');
  return lines.every(line => {
    if (!line.trim() || line.startsWith('#')) return true;
    const fields = line.split('\t');
    if (fields.length !== 9) return false;

    const [, , , start, end, , strand, phase] = fields;
    return !isNaN(start) &&
      !isNaN(end) &&
      ['+', '-', '.'].includes(strand) &&
      ['0', '1', '2', '.'].includes(phase);
  });
}

function validateGtf(content) {
  if (!content?.trim()) return false;

  for (const line of content.trim().split('\n')) {
    if (line.startsWith('#') || !line.trim()) continue;
    const fields = line.split('\t');
    if (fields.length !== 9) return false;
    const [, , , start, end, , strand, frame, attributes] = fields;
    if (!/^\d+$/.test(start) || !/^\d+$/.test(end)) return false;
    if (!['+', '-', '.'].includes(strand)) return false;
    if (!['0', '1', '2', '.'].includes(frame)) return false;
    // GTF attributes are key "value"; pairs that name the gene or transcript
    if (!attributes.includes('gene_id') && !attributes.includes('transcript_id')) return false;
  }
  return true;
}

function validatePaf(content) {
  if (!content?.trim()) return false;

  for (const line of content.trim().split('\n')) {
    if (!line.trim()) continue;
    const fields = line.split('\t');
    // 12 mandatory columns, then optional SAM-style tags
    if (fields.length < 12) return false;
    for (const i of [1, 2, 3, 6, 7, 8, 9, 10, 11]) {
      if (!/^-?\d+$/.test(fields[i])) return false;
    }
    if (!['+', '-'].includes(fields[4])) return false;
    // A target written as a graph path (>s1<s2) makes the line GAF
    if (/^[<>]/.test(fields[5])) return false;
  }
  return true;
}

function validateGaf(content) {
  if (!content?.trim()) return false;

  for (const line of content.trim().split('\n')) {
    if (!line.trim()) continue;
    const fields = line.split('\t');
    // GAF keeps PAF's 12 mandatory columns; the target is either a graph
    // path such as >s1<s2 or, for a stable rGFA sequence, a plain name
    if (fields.length < 12) return false;
    for (const i of [1, 2, 3, 6, 7, 8, 9, 10, 11]) {
      if (!/^-?\d+$/.test(fields[i])) return false;
    }
    if (!['+', '-'].includes(fields[4])) return false;
    if (/^[<>]/.test(fields[5]) && !/^([<>][^<>\s]+)+$/.test(fields[5])) return false;
  }
  return true;
}

function validateWig(content) {
  if (!content?.trim()) return false;

  const number = /^-?(\d+\.?\d*|\.\d+)([eE][-+]?\d+)?$/;
  let mode = null;
  let hasData = false;
  for (const raw of content.trim().split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('track') || line.startsWith('browser')) continue;
    // bigWigToWig writes a bedGraph-backed bigWig as commented sections
    if (line.startsWith('#bedGraph section')) {
      mode = 'bedGraph';
      continue;
    }
    if (line.startsWith('#')) continue;
    const fields = line.split(/\s+/);
    if (fields[0] === 'variableStep') {
      if (!fields.slice(1).some(f => f.startsWith('chrom='))) return false;
      mode = 'variableStep';
      continue;
    }
    if (fields[0] === 'fixedStep') {
      const keys = new Set(fields.slice(1).map(f => f.split('=')[0]));
      if (!['chrom', 'start', 'step'].every(k => keys.has(k))) return false;
      mode = 'fixedStep';
      continue;
    }
    let ok;
    if (mode === 'variableStep') ok = fields.length === 2 && /^\d+$/.test(fields[0]) && number.test(fields[1]);
    else if (mode === 'fixedStep') ok = fields.length === 1 && number.test(fields[0]);
    else if (mode === 'bedGraph') ok = fields.length === 4 && /^\d+$/.test(fields[1]) && /^\d+$/.test(fields[2]) && number.test(fields[3]);
    // Data before any declaration is not wiggle
    else return false;
    if (!ok) return false;
    hasData = true;
  }
  return hasData;
}

function validateGfa(content) {
  if (!content?.trim()) return false;

  let hasSegment = false;
  for (const line of content.trim().split('\n')) {
    if (!line.trim()) continue;
    const fields = line.split('\t');
    // Every record starts with a one-letter type. GFA1 uses H/S/L/C/P/W/J,
    // GFA2 adds E/F/G/O/U, and the spec tells readers to skip types they do
    // not know, which tools rely on: miniasm writes 'a' and 'x' records.
    if (line[0] !== '#' && !/^[A-Za-z]$/.test(fields[0])) return false;
    if (fields[0] === 'S') {
      if (fields.length < 3) return false;
      hasSegment = true;
    }
  }
  return hasSegment;
}

function validateRgfa(content) {
  if (!validateGfa(content)) return false;

  // rGFA is GFA whose every segment carries its stable sequence (SN), its
  // offset on it (SO) and its rank (SR), as minigraph writes them
  for (const line of content.trim().split('\n')) {
    const fields = line.split('\t');
    if (fields[0] !== 'S') continue;
    const tags = fields.slice(3);
    if (!(tags.some(t => /^SN:Z:\S+$/.test(t))
      && tags.some(t => /^SO:i:\d+$/.test(t))
      && tags.some(t => /^SR:i:\d+$/.test(t)))) return false;
  }
  return true;
}

function validateClustal(content) {
  if (!content?.trim()) return false;

  const lines = content.trim().split('\n');
  // Clustal, MAFFT --clustalout and MAFFT f2cl all open with a CLUSTAL banner
  if (!lines[0].startsWith('CLUSTAL')) return false;

  let hasSequence = false;
  for (const line of lines.slice(1)) {
    if (!line.trim()) continue;
    if (/^\s/.test(line)) {
      // conservation line under each block: '*', ':', '.' and spaces
      if (!/^[\s*:.]*$/.test(line)) return false;
      continue;
    }
    const fields = line.trim().split(/\s+/);
    if (fields.length !== 2 && fields.length !== 3) return false;
    if (!/^[A-Za-z*.-]+$/.test(fields[1])) return false;
    if (fields.length === 3 && !/^\d+$/.test(fields[2])) return false;
    hasSequence = true;
  }
  return hasSequence;
}

function validateSnd(content) {
  // bhtsne's SND table: optional '#' header, then one row per sample,
  // a name followed by tab-separated numbers, every row the same width
  if (!content?.trim()) return false;

  const number = /^[+-]?(\d+(\.\d*)?|\.\d+)([eE][+-]?\d+)?$/;
  let width = null;
  for (const line of content.trim().split('\n')) {
    if (!line.trim() || line.startsWith('#')) continue;
    const fields = line.replace(/\r$/, '').split('\t');
    if (fields.length < 2) return false;
    if (width === null) width = fields.length;
    else if (fields.length !== width) return false;
    if (!fields.slice(1).every(value => number.test(value))) return false;
  }
  return width !== null;
}

function validateVcf(content) {
  if (!content) return false;
  const lines = content.trim().split(/\r?\n/);
  let headerFound = false;

  for (const line of lines) {
    if (line.startsWith('##')) continue;

    if (line.startsWith('#CHROM')) {
      headerFound = true;
      if (line.trim().split(/\s+/).length < 8) return false;
      continue;
    }

    if (!headerFound) return false;

    const fields = line.trim().split(/\s+/);
    if (fields.length < 8) return false;

    const [, pos, , ref, alt, qual] = fields;
    if (!/^\d+$/.test(pos)) return false;
    if (!/^[ACGTN]+$/i.test(ref)) return false;
    if (!alt.split(',').every(a => /^[ACGTN]+$/i.test(a))) return false;
    if (qual !== '.' && !/^\d+(\.\d+)?$/.test(qual)) return false;
  }

  return headerFound;
}

function validateList(content) {
  if (!content.trim()) return false;
  const lines = content.split('\n');
  return lines.every(line => {
    if (!line.trim()) return true;
    const seqId = line.split('\t')[0];
    return seqId && !seqId.includes(' ');
  });
}

// bgt's Flat Metadata Format: per line a name, then tab-separated
// key:type:value fields, type Z (text), f (number) or i (integer). A file
// without any field is a plain list of names.
function validateFmf(content) {
  if (!content || !content.trim()) return false;

  let hasField = false;
  for (const line of content.trim().split('\n')) {
    const [name, ...fields] = line.replace(/\r$/, '').split('\t');
    if (!name) return false;

    for (const field of fields) {
      const match = /^([^:]+):([Zfi]):(.*)$/.exec(field);
      if (!match) return false;
      const [, , kind, value] = match;
      if (kind === 'i' && !/^[+-]?\d+$/.test(value)) return false;
      if (kind === 'f' && !/^[+-]?(\d+(\.\d*)?|\.\d+)([eE][+-]?\d+)?$/.test(value)) return false;
      hasField = true;
    }
  }
  return hasField;
}

function validateSam(content) {
  if (!content) {
    return false;
  }

  const lines = content.trim().split('\n');

  for (const line of lines) {
    // header lines
    if (line.startsWith('@')) {
      continue;
    }

    const fields = line.split('\t');

    if (fields.length < 11) {
      return false;
    }

    const qname = fields[0];
    const flag = fields[1];
    const rname = fields[2];
    const pos = fields[3];

    // check numeric fields
    if (!/^\d+$/.test(flag)) {
      return false;
    }

    if (!/^\d+$/.test(pos)) {
      return false;
    }
  }

  return true;
}

function validateBinWithMagic(content, magic) {
  if (!content) {
    return false;
  }

  if (content.length < 2) {
    return false;
  }

  for (let i = 0; i < magic.length; i++) {
    if (content[i] != magic[i]) {
      return false
    }
  }

  return true
}

// A tar (POSIX ustar): 512-byte headers with "ustar" at offset 257, each
// followed by its file padded to 512 bytes, ended by an empty block.
// Returns the names of its files, or null when it is not a well-formed tar.
// Extended headers (pax) and the ._ files macOS adds are left out; a pax
// header that renames or resizes a file makes it not a plain tar.
function tarMembers(content) {
  if (!content || content.length < 512) return null;

  const text = (start, length) => {
    let end = start;
    while (end < start + length && content[end]) end++;
    return String.fromCharCode(...content.subarray(start, end));
  };
  const octal = (start, length) => {
    const field = text(start, length).trim();
    return /^[0-7]+$/.test(field) ? parseInt(field, 8) : NaN;
  };

  const names = [];
  let offset = 0;
  while (offset + 512 <= content.length) {
    const header = content.subarray(offset, offset + 512);
    if (header.every(byte => byte === 0)) return names;
    if (text(offset + 257, 5) !== 'ustar') return null;

    let sum = 0;
    for (let i = 0; i < 512; i++) sum += i >= 148 && i < 156 ? 32 : header[i];
    if (octal(offset + 148, 8) !== sum) return null;

    const size = octal(offset + 124, 12);
    if (Number.isNaN(size) || offset + 512 + size > content.length) return null;

    const type = String.fromCharCode(header[156]);
    if (type === '0' || header[156] === 0) {
      const name = text(offset, 100);
      if (header[345] || !name.startsWith('._')) names.push(header[345] ? text(offset + 345, 155) + '/' + name : name);
    } else if (type === 'x' || type === 'g') {
      const records = String.fromCharCode(...content.subarray(offset + 512, offset + 512 + size));
      if (/(^|\n)\d+ (path|linkpath|size|GNU\.sparse[^=]*)=/.test(records)) return null;
    } else {
      return null;
    }
    offset += 512 + Math.ceil(size / 512) * 512;
  }
  return null;
}

// A BGT database (bgt): a tar holding exactly the four files bgt import
// writes, named as BioChef's bgt operations name them.
const BGT_MEMBERS = ['bgt.bcf', 'bgt.bcf.csi', 'bgt.pbf', 'bgt.spl'];

function validateBgt(content) {
  const names = tarMembers(content);
  return !!names && names.length === BGT_MEMBERS.length
    && BGT_MEMBERS.every(member => names.includes(member));
}

function validateBam(content) {
  return validateBinWithMagic(content, BINARY_MAGIC.BAM) || validateBinWithMagic(content, BINARY_MAGIC.BGZF)
}

function validateCram(content) {
  return validateBinWithMagic(content, BINARY_MAGIC.CRAM)
}

function validateBigBed(content) {
  return validateBinWithMagic(content, BINARY_MAGIC.BIGBED) || validateBinWithMagic(content, BINARY_MAGIC.BIGBED_BE)
}

function validateBigWig(content) {
  return validateBinWithMagic(content, BINARY_MAGIC.BIGWIG) || validateBinWithMagic(content, BINARY_MAGIC.BIGWIG_BE)
}

function validateFmd(content) {
  return validateBinWithMagic(content, BINARY_MAGIC.FMD)
}

function validateYak(content) {
  return validateBinWithMagic(content, BINARY_MAGIC.YAK)
}

function validateBai(content) {
  return validateBinWithMagic(content, BINARY_MAGIC.BAI)
}

function validateMmi(content) {
  return validateBinWithMagic(content, BINARY_MAGIC.MMI)
}

function validateCsi(content) {
  return validateBinWithMagic(content, BINARY_MAGIC.CSI) || validateBinWithMagic(content, BINARY_MAGIC.BGZF)
}

function validateBcf(content) {
  return validateBinWithMagic(content, BINARY_MAGIC.BCF) || validateBinWithMagic(content, BINARY_MAGIC.BGZF)
}

function validateNewick(content) {
  if (typeof content !== 'string') return false;
  if (content.startsWith('\uFEFF')) content = content.slice(1);
  if (!content.replace(/[ \t\r\n]/g, '')) return false;

  const tokens = /[ \t\r\n]+|'(?:[^'\r\n]|'')*'|[(),:;]|[^ \t\r\n(),:;\[\]']+/y;
  const number = /^[+-]?(?:[0-9]+(?:\.[0-9]*)?|\.[0-9]+)(?:[eE][+-]?[0-9]+)?$/;
  let pos = 0, depth = 0, trees = 0;
  let state = 'node', seenNode = false;

  while (pos < content.length) {
    if (content[pos] === '[') {
      let comments = 1;
      pos++;
      while (pos < content.length && comments) {
        if (content[pos] === '[') comments++;
        if (content[pos] === ']') comments--;
        pos++;
      }
      if (comments) return false;
      continue;
    }
    tokens.lastIndex = pos;
    const match = tokens.exec(content);
    if (!match) return false;
    const token = match[0];
    pos = tokens.lastIndex;
    if (/^[ \t\r\n]+$/.test(token)) continue;

    if (token === '(') {
      if (state !== 'node') return false;
      depth++;
      seenNode = true;
    } else if (token === ')') {
      if (!depth || state === 'length') return false;
      depth--;
      state = 'label';
    } else if (token === ',') {
      if (!depth || state === 'length') return false;
      state = 'node';
    } else if (token === ':') {
      if (!['node', 'label', 'suffix'].includes(state)) return false;
      state = 'length';
      seenNode = true;
    } else if (token === ';') {
      if (depth || state === 'length') return false;
      trees++;
      state = 'node';
      seenNode = false;
    } else if (state === 'length') {
      if (!number.test(token)) return false;
      state = 'end';
    } else if (['node', 'label'].includes(state) &&
               !/[\p{C}\p{Z}]/u.test(token.replace(/[ \t]/g, ''))) {
      state = 'suffix';
      seenNode = true;
    } else {
      return false;
    }
  }
  return trees > 0 && depth === 0 && !seenNode;
}

function validateJson(content) {
  if (!content?.trim()) return false;

  try {
    JSON.parse(content);
    return true;
  } catch {
    return false;
  }
}

function validateFai(content) {
  if (!content || !content.trim()) return false;

  const lines = content.trim().split(/\r?\n/);
  
  for (const line of lines) {
    const parts = line.split('\t');
    if (parts.length < 5) return false;

    const [seqName, length, offset, lineBases, lineWidth] = parts;

    // sequence name should be non-empty
    if (!seqName || !seqName.trim()) return false;

    // numeric fields must be digits
    if (![length, offset, lineBases, lineWidth].every(p => /^\d+$/.test(p))) {
      return false;
    }
  }

  return true;
}

const validators = {
  fasta: validateFasta,
  multiFasta: validateMultiFasta,
  efa: validateEfa,
  fastq: validateFastq,
  packagedFastq: validatePackagedFastq,
  num: validateNum,
  bin: validateBin,
  dna: validateDNA,
  rna: validateRNA,
  aminoAcids: validateAminoAcids,
  bed: validateBed,
  gff: validateGff,
  gtf: validateGtf,
  paf: validatePaf,
  gaf: validateGaf,
  rgfa: validateRgfa,
  gfa: validateGfa,
  wig: validateWig,
  clustal: validateClustal,
  snd: validateSnd,
  bigbed: validateBigBed,
  bigwig: validateBigWig,
  fmd: validateFmd,
  yak: validateYak,
  bgt: validateBgt,
  vcf: validateVcf,
  fmf: validateFmf,
  list: validateList,
  sam: validateSam,
  bam: validateBam,
  cram: validateCram,
  bai: validateBai,
  mmi: validateMmi,
  csi: validateCsi,
  bcf: validateBcf,
  newick: validateNewick,
  fai: validateFai,
  json: validateJson,
  text: () => true, // Default fallback for TEXT
};

// these are in order of priority
const allTypes = getTypeDefinitions()
  .map(typeDef => ({
    type: typeDef.id,
    validator: validators[typeDef.validator],
  }))
  .filter(typeDef => typeDef.validator);

export function detectDataType(dataValue, allowed = []) {
  return matchType(dataValue, { allowed })
}

export function detectAllDataTypes(dataValue) {
  return matchType(dataValue, { returnAll: true })
}

function matchType(dataValue, { allowed = [], returnAll = false }) {
  const results = []

  if (!isDataValue(dataValue)) {
    return returnAll ? [] : "UNKNOWN"
  }

  for (const { type, validator } of allTypes) {
    if (isTypeBinary(type) && dataValue.kind !== "binary") continue
    if (!isTypeBinary(type) && dataValue.kind === "binary") continue

    if (!validator(dataValue.data)) continue

    const isAllowed = allowed.includes(type) ? 1 : 0
    results.push({ type, isAllowed })
  }

  if (results.length === 0) {
    return returnAll ? [] : "UNKNOWN"
  }

  results.sort((a, b) => b.isAllowed - a.isAllowed)

  if (returnAll) {
    return results.map(r => r.type)
  }

  return results[0].type
}

export function detectIsBinaryFile(bytes) {
  if (!bytes || !bytes.length) return false;

  // A tar, even one cut short: "ustar" in its first header
  if (bytes.length >= 262 && String.fromCharCode(...bytes.subarray(257, 262)) === 'ustar') return true;

  for (const magic of Object.values(BINARY_MAGIC)) {
    if (bytes.length < magic.length) continue;

    let matches = true;
    for (let i = 0; i < magic.length; i++) {
      if (bytes[i] !== magic[i]) {
        matches = false;
        break;
      }
    }

    if (matches) return true;
  }

  return false;
}

import * as Lu from 'react-icons/lu';
import fs from 'fs';

const iconsToCheck = [
    'LuCheck',
    'LuBold',
    'LuItalic',
    'LuUnderline',
    'LuCode',
    'LuHeading1',
    'LuHeading2',
    'LuHeading3',
    'LuQuote',
    'LuList',
    'LuListOrdered',
    'LuPenLine',
    'LuSparkles',
    'LuSearch',
    'LuEye',
    'LuChevronDown',
    'LuMoveRight',
    'LuGlobe',
    'LuShieldCheck',
    'LuAlertTriangle',
    'LuZap',
    'LuBookOpen'
];

const available = Object.keys(Lu);
const missing = iconsToCheck.filter(icon => !available.includes(icon));

let output = '--- Missing Icons ---\n';
output += missing.join('\n');

output += '\n\n--- Alternatives ---\n';
output += 'Alert/Triangle matches: ' + available.filter(k => k.includes('Triangle') || k.includes('Alert')).join(', ') + '\n';
output += 'Heading matches: ' + available.filter(k => k.includes('Heading')).join(', ') + '\n';
output += 'List matches: ' + available.filter(k => k.includes('List')).join(', ') + '\n';

fs.writeFileSync('icons_log.txt', output);

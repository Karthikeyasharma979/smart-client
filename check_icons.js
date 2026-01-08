
import * as Lu from 'react-icons/lu';

const desired = ['LuBriefcase', 'LuCoffee', 'LuSmile', 'LuUser', 'LuGhost', 'LuHeart', 'LuGraduationCap'];
const available = Object.keys(Lu);
const present = desired.filter(d => available.includes(d));
console.log('Available icons:', present);

import { hideBin } from 'yargs/helpers';

const [application, ...args] = hideBin(process.argv);

console.log(application, args);

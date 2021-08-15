import { hideBin } from 'yargs/helpers';
import { format } from './scripts';

const [command] = hideBin(process.argv);

switch (command) {
  case 'format': {
    format();
    break;
  }
  default: {
    throw new Error('unknown command');
  }
}

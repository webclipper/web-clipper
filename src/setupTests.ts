import { configure } from 'enzyme';
import 'reflect-metadata';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

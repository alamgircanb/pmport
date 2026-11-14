import {examSet,qs} from '../authoring';
import {CCMP_D as D} from './domains';
import {F2,E2,S2} from './exam2a';
import {P2,X2,C2} from './exam2b';

export const CCMP_EXAM2=examSet(2,'Scenarios: sponsorship, resistance, adoption and sustainment',[
  ...qs('M2F',D.F,F2),...qs('M2E',D.E,E2),...qs('M2S',D.S,S2),...qs('M2P',D.P,P2),...qs('M2X',D.X,X2),...qs('M2C',D.C,C2)]);

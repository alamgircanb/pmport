import {examSet,qs} from '../authoring';
import {CCMP_D as D} from './domains';
import {F1,E1,S1} from './exam1a';
import {P1,X1,C1} from './exam1b';

export const CCMP_EXAM1=examSet(1,'Foundations: the change management process from evaluation to closure',[
  ...qs('M1F',D.F,F1),...qs('M1E',D.E,E1),...qs('M1S',D.S,S1),...qs('M1P',D.P,P1),...qs('M1X',D.X,X1),...qs('M1C',D.C,C1)]);

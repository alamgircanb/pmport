import {examSet,qs} from '../authoring';
import {CAPM_D as D} from './domains';
import {F,P} from './exam4a';
import {A,B} from './exam4b';

export const CAPM_EXAM4=examSet(4,'Principles, procurement, motivation, flow and solution evaluation',[...qs('C4F',D.F,F),...qs('C4P',D.P,P),...qs('C4A',D.A,A),...qs('C4B',D.B,B)]);

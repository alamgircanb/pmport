import {examSet,qs} from '../authoring';
import {CAPM_D as D} from './domains';
import {F,P} from './exam5a';
import {A,B} from './exam5b';

export const CAPM_EXAM5=examSet(5,'Quality tools, risk thresholds, scaling, DevOps and transition',[...qs('C5F',D.F,F),...qs('C5P',D.P,P),...qs('C5A',D.A,A),...qs('C5B',D.B,B)]);

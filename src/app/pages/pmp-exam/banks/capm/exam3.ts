import {examSet,qs} from '../authoring';
import {CAPM_D as D} from './domains';
import {F,P} from './exam3a';
import {A,B} from './exam3b';

export const CAPM_EXAM3=examSet(3,'Risk responses, scope control, Lean flow and business models',[...qs('C3F',D.F,F),...qs('C3P',D.P,P),...qs('C3A',D.A,A),...qs('C3B',D.B,B)]);

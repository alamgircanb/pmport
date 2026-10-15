import {examSet,qs} from '../authoring';
import {CAPM_D as D} from './domains';
import {F,P} from './exam2a';
import {A,B} from './exam2b';

export const CAPM_EXAM2=examSet(2,'Estimating, earned value, Kanban metrics and stakeholders',[...qs('C2F',D.F,F),...qs('C2P',D.P,P),...qs('C2A',D.A,A),...qs('C2B',D.B,B)]);

import {examSet,qs} from '../authoring';
import {CAPM_D as D} from './domains';
import {F,P} from './exam1a';
import {A,B} from './exam1b';

export const CAPM_EXAM1=examSet(1,'Fundamentals, schedules, Scrum basics and requirements',[...qs('C1F',D.F,F),...qs('C1P',D.P,P),...qs('C1A',D.A,A),...qs('C1B',D.B,B)]);

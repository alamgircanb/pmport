import {ExamSet} from '../exam-types';
import {CASE_QUESTIONS as E1_CQ,CASE_STUDIES as E1_C} from './exam1/cases';
import {PEOPLE_QUESTIONS as E1_P} from './exam1/people';
import {PROCESS_QUESTIONS as E1_R} from './exam1/process';
import {BUSINESS_ENVIRONMENT_QUESTIONS as E1_B} from './exam1/business-environment';
import {EXAM2} from './exam2';
import {EXAM3} from './exam3';
import {EXAM4} from './exam4';
import {EXAM5} from './exam5';

export const EXAM1:ExamSet={id:1,title:'Exam Simulator 1',subtitle:'Utility billing · mobile banking · health-centre construction',cases:E1_C,caseQuestions:E1_CQ,questions:[...E1_P,...E1_R,...E1_B]};

export const EXAMS:ExamSet[]=[EXAM1,EXAM2,EXAM3,EXAM4,EXAM5];

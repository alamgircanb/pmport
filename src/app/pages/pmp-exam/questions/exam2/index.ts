import {ExamSet} from '../../exam-types';
import {CASE_QUESTIONS,CASE_STUDIES} from './cases';
import {PEOPLE_QUESTIONS} from './people';
import {PROCESS_QUESTIONS} from './process';
import {BUSINESS_ENVIRONMENT_QUESTIONS} from './business-environment';

export const EXAM2:ExamSet={id:2,title:'Exam Simulator 2',subtitle:'Transit fare system · patient portal · wind-farm substation',cases:CASE_STUDIES,caseQuestions:CASE_QUESTIONS,questions:[...PEOPLE_QUESTIONS,...PROCESS_QUESTIONS,...BUSINESS_ENVIRONMENT_QUESTIONS]};

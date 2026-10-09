import {ExamSet} from '../../exam-types';
import {CASE_QUESTIONS,CASE_STUDIES} from './cases';
import {PEOPLE_QUESTIONS} from './people';
import {PROCESS_QUESTIONS} from './process';
import {BUSINESS_ENVIRONMENT_QUESTIONS} from './business-environment';

export const EXAM3:ExamSet={id:3,title:'Exam Simulator 3',subtitle:'Grain co-op platform · digital licensing service · bridge rehabilitation',cases:CASE_STUDIES,caseQuestions:CASE_QUESTIONS,questions:[...PEOPLE_QUESTIONS,...PROCESS_QUESTIONS,...BUSINESS_ENVIRONMENT_QUESTIONS]};

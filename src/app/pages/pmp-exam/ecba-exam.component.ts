import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {ExamGraphicComponent} from './exam-graphic.component';
import {ExamSimulatorBase} from './exam-simulator.base';
import {ECBA_PROGRAM} from './programs/ecba-program';

@Component({standalone:true,selector:'app-ecba-exam',imports:[RouterLink,ExamGraphicComponent],templateUrl:'./pmp-exam.component.html',styleUrl:'./pmp-exam.component.css'})
export class EcbaExamComponent extends ExamSimulatorBase{constructor(){super(ECBA_PROGRAM)}}

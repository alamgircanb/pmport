import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {ExamGraphicComponent} from './exam-graphic.component';
import {ExamSimulatorBase} from './exam-simulator.base';
import {CBAP_PROGRAM} from './programs/cbap-program';

@Component({standalone:true,selector:'app-cbap-exam',imports:[RouterLink,ExamGraphicComponent],templateUrl:'./pmp-exam.component.html',styleUrl:'./pmp-exam.component.css'})
export class CbapExamComponent extends ExamSimulatorBase{constructor(){super(CBAP_PROGRAM)}}

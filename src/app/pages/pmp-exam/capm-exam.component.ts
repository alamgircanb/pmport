import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {ExamGraphicComponent} from './exam-graphic.component';
import {ExamSimulatorBase} from './exam-simulator.base';
import {CAPM_PROGRAM} from './programs/capm-program';

@Component({standalone:true,selector:'app-capm-exam',imports:[RouterLink,ExamGraphicComponent],templateUrl:'./pmp-exam.component.html',styleUrl:'./pmp-exam.component.css'})
export class CapmExamComponent extends ExamSimulatorBase{constructor(){super(CAPM_PROGRAM)}}

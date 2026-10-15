import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {ExamGraphicComponent} from './exam-graphic.component';
import {ExamSimulatorBase} from './exam-simulator.base';
import {PMP_PROGRAM} from './programs/pmp-program';

@Component({standalone:true,selector:'app-pmp-exam',imports:[RouterLink,ExamGraphicComponent],templateUrl:'./pmp-exam.component.html',styleUrl:'./pmp-exam.component.css'})
export class PmpExamComponent extends ExamSimulatorBase{constructor(){super(PMP_PROGRAM)}}

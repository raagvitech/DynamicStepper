import { LightningElement, api, track } from 'lwc';

export default class StepComponent extends LightningElement {
    @api label;
    @api value;
    @api currentstepindex;
    @api stepIndex;
    @api steps = [];
    @track isCurrentStep = 0;

    renderedCallback() {
         const line= this.template.querySelectorAll('[data-id="li"]');
        if(line.length>0){
          console.log('====>',line.length);
          line[line.length-1].classList.add('hideline');
        }
      console.log('current==>',this.currentstepindex); 
    this.template.querySelector(`[data-id="${1}"]`).classList.add('stepColor')
  }  
  @api handleNextInChild(next){
    console.log('next in child',next)
    this.template.querySelector(`[data-id="${next}"]`).classList.add('stepColor')
    this.template.querySelector(`[data-id="${next-1}"]`).classList.remove('stepColor')
    
  }
  @api handleBackInChild(previous){
    console.log('back in child',previous)
    this.template.querySelector(`[data-id="${previous}"]`).classList.add('stepColor')
    this.template.querySelector(`[data-id="${previous+1}"]`).classList.remove('stepColor')

  }
  @api handleSkipInChild(skip){
    console.log('skip in child',skip);
    this.template.querySelector(`[data-id="${skip}"]`).classList.add('stepColor')
    this.template.querySelector(`[data-id="${skip-2}"]`).classList.remove('stepColor')

  }
  
}

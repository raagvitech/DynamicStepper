import { LightningElement,api } from 'lwc';

export default class CompleteScreen extends LightningElement {
    @api skipupnowscreen;
    @api successmessages;
   @api saveforlatermessages;
   @api technicalerrored;
   renderedCallback(){
    console.log('technical',this.technicalerrored);
   }
}
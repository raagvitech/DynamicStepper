import { LightningElement, api } from 'lwc';

export default class SelectContact extends LightningElement {

    @api recordId;
    @api casenumbererror;
    @api contacterror;
    @api selectedbutton;
    @api displayfirstcase;
    @api record;
    @api radiochecks;
    @api selectedcontact;
    currentstepindex = 0;
    caseNumbers = [];
    firstCase;
    showError = false;
    select;
    radioButton = false;
    
    renderedCallback(){
        if( this.radiochecks===true){

            this.template.querySelectorAll('[data-id="ds1"]').forEach((radio,index)=>{
                if(index==0){
                    radio.checked=true;
                }
            });
        }
    }
  
    //Handle change for case number
    handleCaseNumber(event){
        this.firstCase = event.target.value;
        const eventData = new CustomEvent('handlecasenumber', {
           detail: this.firstCase
         });
         this.dispatchEvent(eventData);
        console.log('first change',this.firstCase);
    }

    //Handle Change for selecting the contact
    getSelectedContacts(event){
        this.selectedCon =event.target.value;
        console.log(this.selectedCon);
        const eventData = new CustomEvent('handlecontactradiobutton', {
            detail:  this.selectedCon   
          });
          this.dispatchEvent(eventData);
          console.log('contact from parent',this.selectedbutton);  
    }

    //Method to display the error message if the case number is invalid
    @api handleValidCase(){
            this.template.querySelector('[data-id="caseError"]').classList.add('caseError')        
      }

    //Method to remove the case error message  
      @api removecase(){
        this.template.querySelector('[data-id="caseError"]').classList.remove('caseError') 
      }
}
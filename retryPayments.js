import { LightningElement,track,api, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';


//import { getRecord } from 'lightning/uiRecordApi';
import getAccount from '@salesforce/apex/CaseController.getAccount';

export default class RetryPayments extends  NavigationMixin(LightningElement) {
  contacts;
@api recordId;
    @track PaymentModal = false;
    @track showError = false;
    @track paynowradio = false;
    @track paylaterradio = false;
    openRetryPaymentComponent(){
        this.PaymentModal = true;
        console.log('recordid',this.contacts);
    }
    // @wire( getRecord, {recordId:'$recordId'})
    // contactMethod({data,error}){
    // }
    @wire(getAccount,{recordId:'$recordId'})
    wiredContacts({ error, data }) {
        if (data) {
          data.forEach(ele=>{
            this.contacts = ele.Id;
          })
           // this.contacts = data;
          
            console.log('data>>>',  this.contacts );
        } else if (error) {
            this.error = error;

            //this.contacts = undefined;
            console.log('data>>>',error);
        }
    }
    // rendercallback(){

    // }

    handleRadioButton(event){
        if(event.target.name === 'payNow'){
          this.paynowradio = true;
       
          this.showError = false;
          console.log('clicked button 1   ',this.paynowradio);
        }
        else{
          this.paynowradio = false;
        }
  
        if(event.target.name === 'payLater'){
          this.paylaterradio = true;


      
          this.showError =false
          console.log('clicked button 2   ',this.paylaterradio);
        }
        else{
          this.paylaterradio = false;
        }}
    handleNext(event){
  
        if (!this.paynowradio && !this.paylaterradio) {
            console.log('paynowradio clicked',this.paynowradio);
            console.log('paylaterradio clicked',this.paylaterradio);
            this.template.querySelectorAll('[data-name="pan1"]').forEach(ele=>{
                  ele.classList.add('adderror');

             });
             console.log( this.template.querySelectorAll('[data-name="pan1"]').length);
             this.showError = true;
        }
          else{
            this.template.querySelectorAll('[data-name="pan1"]').forEach(ele=>{
              ele.classList.remove('adderror');
                
         });
         console.log( this.template.querySelectorAll('[data-name="pan1"]').length);
            this.showError = false;
          }
         
      
          //  event.preventDefault();
  if(this.paylaterradio){

        let componentDef = {
            componentDef: "c:stepperParentComponent",
            attributes: {
              
              // myParam: this.contacts,
                label: 'navigate',
                recordId:this.contacts

            }
        };

     
        let encodedComponentDef = btoa(JSON.stringify(componentDef));
        console.log('encodedComponentDef'+encodedComponentDef);
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
               
                url: '/one/one.app#' + encodedComponentDef
            },
           
        });
      
   }
    
   if(this.paynowradio){
    console.log('this.contacts in retry ',this.contacts)
    let componentDef = {
        componentDef: "c:setUpPaymentPlan",
        attributes: {
            label: 'Navigated',
            recordId:this.contacts
        }
    };
 
    let encodedComponentDef =btoa(JSON.stringify(componentDef));
    this[NavigationMixin.Navigate]({
        type: 'standard__webPage',
        attributes: {
            url: '/one/one.app#' + encodedComponentDef
        }
    });

   }

}
closePopup(){
    this.PaymentModal=false
}
}
import { LightningElement,api } from 'lwc';

export default class SelectPlanOptionAndDate extends LightningElement {
    @api selectrecord;
    @api optionserror;
    @api calendarerror;
    @api firstdate;
    @api mockvalues
    displayinformation = false;
    
    renderedCallback(){
       console.log('prevradiovaluesrender',this.prevradiovalues);
       let i = parseInt(this.mockvalues);
        this.template.querySelectorAll('[data-name="ra1"]').forEach((radio, index) => {
            console.log('index', index)
            console.log('previousradioval',i)
            if (index === i-1) {
                console.log('previousradioval',this.mockvalues)
                radio.checked = true;
                console.log(' index', index);
                console.log('radio', JSON.stringify(radio));
            }
        });
    }

    //Handle change to display the data fetched from API callout
    handleChange(event){
        this.mockData = event.target.value;

        const eventData = new CustomEvent('handlemockdata', {
            detail:  this.mockData
             
          });
          this.dispatchEvent(eventData);
          console.log('mock data in child',JSON.stringify(this.mockData));
    }

    //Handle change to select starting date
    handleDateChange(event){
        this.startingDate = event.target.value;

        const eventdata = new CustomEvent('handledate',{
            detail: this.startingDate
        });
        this.dispatchEvent(eventdata);
        console.log('selected date in calendar',this.startingDate);
    }

    //On hover display information
    displayinfomessage(){
        this.displayinformation = true;
    }

    //On remove hide information
    removemessage(){
        this.displayinformation = false;
    }

    //Handle date error
    @api handleValidDate(){
        this.template.querySelector('[data-id="dateError"]').classList.add('dateError')        
     }

     //Remove date error
     @api removeDate(){
        this.template.querySelector('[data-id="dateError"]').classList.remove('dateError') 
    }
}
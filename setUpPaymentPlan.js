import { LightningElement, api, track, wire } from 'lwc';
import getRelatedCases from '@salesforce/apex/AccountRelatedCasesAndContacts.getRelatedCases';
import getRelatedContacts from '@salesforce/apex/AccountRelatedCasesAndContacts.getRelatedContacts';
import getresponseData from '@salesforce/apex/SelectPaymentAPIcallout.getresponseData';
import getPayementResponseData from '@salesforce/apex/PaymentAssistanceCallout.getPayementResponseData';
import exceptioncallout from '@salesforce/apex/ExceptionCallout.makeCallout';
export default class setUpPaymentPlan extends LightningElement {
    @api recordId;
    @api steps = [
        { label: 'Select Contact', value: '1' },
        { label: 'Select Plan Option & Date', value: '2' },
        { label: 'confirmation', value: '3' },
        { label: 'completed', value: '4' }
      
    ];

    record;
    radiocheck = false;
    casefromchild
    currentstepindex = 0;
    authorization = true;
    skipbutton = false;
    nextStep = true;
    previous = false;
    stepOne = true;
    stepTwo = false;
    stepThree = false;
    stepFour = false;
    radiobuttonvalue;
    casedetails;
    calloutData;
    errorCalloutData;
    headerline = true;
    footerline = true;
    contacterror = false;
    accountauthority = false;
    casenumbererror = false;
    firstCase;
    mockdatavalue;
    selecteddate;
    optionserror = false;
    calendarerror = false;
    selectContact = [];
    Setupnowbutton = false;
    skipvalue = 3;
    skipupnow = false;
    successmessage = false;
    Saveforlater = false;
    saveforlatermessage=false;
    technicalerror=false;
    connectedCallback(){
        this.exceptionfunction()
    }
    @wire(getRelatedCases, { accountId: '$recordId' })
    wiredCases({ data, error }) {

        if (data) {
            this.caseNumbers = data;
           console.log('case number', JSON.stringify(this.caseNumbers));
            this.firstCase = this.caseNumbers[0].CaseNumber
            console.log('first case', JSON.stringify(this.firstCase));
        } else if (error) {
            console.log('errormessage----------------------->',error);
        }
    }

    @wire(getRelatedContacts, { accid: '$recordId' })
    wiredContacts({ data, error }) {
        console.log('con data-->', data);
        if (data) {
            this.selectContact = data;
            console.log('con record===>', JSON.stringify(this.selectContact));

        }
    }
    exceptionfunction(){
    exceptioncallout()
    .then(result => {
        // Process the result if the callout was successful
        this.result = result;
    })
    .catch(error => {
        // Handle the exception and display the error message
        console.error('Callout failed:', error.body.message);
        // Perform any necessary error handling logic
    });
}

    
    @wire(getresponseData)
    wiredResponseData({ error, data }) {
        if (data) {
            console.log('data', data);
            this.calloutData = JSON.parse(data);

            console.log('callout data', this.calloutData);
        }
    }



    handlecontactradiobutton(event) {
        console.log('event');
        this.radiobuttonvalue = event.detail;
        console.log('ravlaue', JSON.stringify(this.radiobuttonvalue));
    }
    handlecasenumber(event) {
        console.log('handlecase', event.detail)
        this.casefromchild = event.detail;
        console.log('handle case from child', this.casefromchild);
    }
    handlemockdata(event) {
        this.mockdatavalue = event.detail;
        console.log('mockdatavalue in parent===>', this.mockdatavalue);
        for (let i = 0; i < this.calloutData.length; i++) {
            if (this.calloutData[i].ppOfferId === parseInt(this.mockdatavalue)) {
                this.selectedmockvalue = this.calloutData[i];
                console.log('selectedmockvalue', this.selectedmockvalue);


            }
        }
    }
    handledate(event) {
        this.selecteddate = event.detail;
        console.log(this.selecteddate);
    }

    //Handle the Next button functionalities
    handleNext() {

        console.log('casenumberwss', JSON.stringify(this.caseNumbers));
        console.log('current step index', this.currentstepindex)
        switch (this.currentstepindex) {

            case 0:
                this.handleSelectContactScreen();

                break;
            case 1:
                this.handleSelectPlanOptionScreen();
                break;
            default:
                break;
        }

    }

    //Method to handle the functionalities of Select Contact Component
    handleSelectContactScreen() {
        //         this.caseNumbers.push(this.firstCase);
        //         newArray.pushValues(this.caseNumbers);
        // newArray.pushValues(dataArray2);
        console.log("casenumbers: " + this.caseNumbers);
        if (this.currentstepindex < this.steps.length - 1) {
            this.caseNumbers.forEach(ele => {
                console.log('case', ele.CaseNumber)
                console.log('first case', this.firstCase)
                if (this.casefromchild === ele.CaseNumber) {
                    this.casenumbererror = false;
                    this.template.querySelector('c-select-contact').removecase();
                    console.log('case number in next', ele.CaseNumber)
                    if (this.radiobuttonvalue != undefined) {
                        if (this.radiobuttonvalue === 'Account owner') {
                            this.currentstepindex++;
                            this.casenumbererror = false;
                            this.template.querySelector('c-select-contact').removecase();
                        }
                        else {
                            this.accountauthority = true;
                            console.log('check account', this.accountauthority);
                            this.authorization = false;
                            this.nextStep = false;
                            this.previous = false;
                            this.headerline = false;
                            this.footerline = false;
                        }
                    }
                    else {
                        this.contacterror = true;
                    }
                }
                else if (this.casefromchild != ele.CaseNumber) {
                    this.casenumbererror = true;
                    this.template.querySelector('c-select-contact').handleValidCase();
                }

            });
        }
        if (this.radiobuttonvalue === undefined) {
            this.contacterror = true;
        }
        else {
            this.contacterror = false;
        }
        if (this.currentstepindex === 0) {
            this.stepOne = true;
            this.previous = false;
        }
        if (this.currentstepindex === 1) {
            this.nextStep = this.currentstepindex !== this.steps.length - 1;
            this.previous = true;
            this.template.querySelector('c-dynamic-stepper-component').handleNextInChild(this.currentstepindex + 1);
            this.stepTwo = true;
            this.skipbutton = true;
            this.stepOne = false;
            this.previous = true;
        }
        else {
            this.stepTwo = false;
            this.previous = false;
        }
    }

    //Method to handle the functionalities of Select Plan Option & Date Component
    handleSelectPlanOptionScreen() {
        if (this.mockdatavalue != undefined) {
            if (this.selecteddate != undefined) {
                this.currentstepindex++;
                if (this.currentstepindex === 2) {
                    this.stepThree = true;
                    this.Setupnowbutton = true;
                    this.Saveforlater = true;
                    this.previous = true;
                    this.template.querySelector('c-dynamic-stepper-component').handleNextInChild(this.currentstepindex + 1);
                    this.stepThree = true;
                    this.stepOne = false;
                    this.stepTwo = false;
                    this.optionserror = false;
                    this.skipbutton = false;
                    this.nextStep = false;

                }
            }
        }
        if (this.mockdatavalue === undefined) {
            this.optionserror = true;
        }
        else {
            this.optionserror = false;
        }
        if (this.selecteddate === undefined) {
            this.calendarerror = true;
            this.template.querySelector('c-select-plan-option-and-date').handleValidDate();
        }
        else {
            this.calendarerror = false;
            this.template.querySelector('c-select-plan-option-and-date').removeDate();
        }
    }

    requestbody = {
        "data": {
            "requestType": 'ACCEPT_FPA_OFFER',
            "customerAccountUuid": "1e019dbf-075f-0857-920f-cc07d6545672",
            "delegationLevel": "GET_FPA_FOH_DELEGATION",
            "ppStartDate": "2022-05-10",
            "ppofferId": "OFF-58d55501-d1e6-47b3-9546-1869826d841a",
            "startDate": "2022-03-10",
            "reason": "I need more time",
            "assets": [
                {
                    "id": "PRN1 OR SUBSCRIPTION1"
                }
            ]
        }
    }

    //Method to handle the functionalities of Confirmation Page
    handleSetup() {
        getPayementResponseData({ requestbody: JSON.stringify(this.requestbody) })
            .then((result) => {
                this.responsebody = result;
                console.log('responsedbody------------------>', result);    
                if (this.responsebody ===200) {
                    console.log('success', this.responsebody);
                    this.currentstepindex++;
                    this.mockvalue = this.mockdatavalue;
                    console.log('step three component');
                    if (this.currentstepindex === 3) {
                        this.stepFour = true;
                        this.previous = false;
                        this.nextStep = false;
                        this.template.querySelector('c-dynamic-stepper-component').handleNextInChild(this.currentstepindex + 1);
                        this.stepThree = false;
                        this.stepOne = false;
                        this.stepTwo = false;
                        this.skipbutton = false;
                        this.footerline = false;
                        this.headerline = false;
                        this.Setupnowbutton = false;
                        this.Saveforlater = false;
                        this.successmessage=true;
                     

                    }
                }
                else {
                    console.log('calloutfails');
                    this.currentstepindex++;
                    console.log('currentindex',this.currentstepindex)
                    this.technicalerror=true;
                    if (this.currentstepindex === 3) {
                        this.stepFour = true;
                        this.previous = false;
                        this.nextStep = false;
                        this.template.querySelector('c-dynamic-stepper-component').handleNextInChild(this.currentstepindex + 1);
                        this.stepThree = false;
                        this.stepOne = false;
                        this.stepTwo = false;
                        this.skipbutton = false;
                        this.footerline = false;
                        this.headerline = false;
                        this.Setupnowbutton = false;
                        this.Saveforlater = false;
                        this.technicalerror=true;
                        console.log('technicalerror',this.technicalerror)
                        this.successmessage=false;

                    }


                }
            })
            .catch((error) => {
                this.error = error;

            });


    }
    handleSkip() {
        this.currentstepindex = this.skipvalue;
        console.log(this.currentstepindex);

        if (this.currentstepindex === 3) {
            this.stepFour = true;
            this.previous = false;
            this.skipupnow = true;
            this.nextStep = false;
            this.template.querySelector('c-dynamic-stepper-component').handleSkipInChild(this.currentstepindex + 1);
            this.stepThree = false;
            this.stepOne = false;
            this.stepTwo = false;
            this.skipbutton = false;
            this.successmessage = false;
            this.footerline = false;
            this.headerline = false;
        }
    }
    //Method to handle the Complete Screen Page
    handlesaveforlater() {
        this.currentstepindex++;
        if (this.currentstepindex === 3) {
            this.stepFour = true;
            this.previous = false;
            this.nextStep = false;
            this.template.querySelector('c-dynamic-stepper-component').handleNextInChild(this.currentstepindex + 1);
            this.stepThree = false;
            this.stepOne = false;
            this.stepTwo = false;
            this.skipbutton = false;
            this.footerline = false;
            this.headerline = false;
            this.Setupnowbutton = false;
            this.Saveforlater = false;
            this.saveforlatermessage=true;
            this.successmessage=false;
        }
    }

    //Handle the Back Button Functionalities
    handleBack() {
        this.contacterror = false;
        if (this.currentstepindex > 0) {
            this.currentstepindex--;
            this.mockvalue = this.mockdatavalue;
            this.firstCase = this.casefromchild;
            this.radiocheck = true;
            console.log('radiocheck', this.radiocheck)
        }
        if (this.currentstepindex === 0) {
            this.previous = this.currentstepindex !== 0;
            this.nextStep = true;
            this.template.querySelector('c-dynamic-stepper-component').handleBackInChild(this.currentstepindex + 1);
            this.stepOne = true;
            this.stepTwo = false;
            this.casenumbererror = false;
            this.skipbutton = false;
            this.stepThree = false;
        }
        if (this.currentstepindex === 1) {
            this.previous = this.currentstepindex !== 0;
            this.mockvalue = this.mockdatavalue;
            this.nextStep = true;
            this.template.querySelector('c-dynamic-stepper-component').handleBackInChild(this.currentstepindex + 1);
            this.stepOne = false;
            this.stepTwo = true;
            this.skipbutton = true;
            this.stepThree = false;
            this.Setupnowbutton = false;
            this.Saveforlater = false;
        }
        else if (this.currentstepindex === 2) {
            this.previous = this.currentstepindex !== 0;
            this.nextStep = true;
            this.template.querySelector('c-dynamic-stepper-component').handleBackInChild(this.currentstepindex + 1);
            this.stepThree = true;
            this.stepOne = false;
            this.stepTwo = false;
            this.skipbutton = false;
            this.stepFour = false;
        }
    }
}
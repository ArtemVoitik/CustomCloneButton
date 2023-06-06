import {api, LightningElement, track} from 'lwc';
import {NavigationMixin} from 'lightning/navigation';
import {ShowToastEvent} from "lightning/platformShowToastEvent";
import getRecord from '@salesforce/apex/CustomCloneButtonCtrl.getRecord';
import saveRecord from '@salesforce/apex/CustomCloneButtonCtrl.saveRecord';

export default class CustomCloneButton extends NavigationMixin(LightningElement) {
    @api recordId;
    @track isButtonDisabled = false;
    opportunity;

    get stageName() {
        return "Prospecting";
    }

    connectedCallback() {
        setTimeout(() => {
            getRecord({recordId: this.recordId})
                .then(result => {
                    this.opportunity = result;
                    this.opportunity.BillingAddress__c = Object.values(result.Account.BillingAddress).filter(line => !!line).join(', ');
                })
                .catch(error => {
                    const evt = new ShowToastEvent({
                        title: 'Error!',
                        message: error.body.message,
                        variant: 'error',
                        mode: 'dismissable'
                    });
                    this.dispatchEvent(evt);
                });
        }, 5);
    }

    handleSubmit(event) {
        this.isButtonDisabled = true;
        event.preventDefault();
        let opp = JSON.parse(JSON.stringify(event.detail.fields));
        if (opp.AccountId === null || opp.AccountId === undefined) {
            opp.AccountId = this.opportunity.AccountId;
        }
        console.log(opp);
        saveRecord({opportunity: opp, oppRecordId: this.recordId})
            .then(result => {
                const even = new ShowToastEvent({
                    title: 'Success!',
                    message: 'Record created!',
                    variant: 'success'
                });
                this.dispatchEvent(even);
                this[NavigationMixin.Navigate]({
                    type: 'standard__recordPage',
                    attributes: {
                        recordId: result,
                        objectApiName: 'Opportunity',
                        actionName: 'view'
                    }
                })
            })
            .catch(error => {
                this.isButtonDisabled = false;
                const evt = new ShowToastEvent({
                    title: 'Error!',
                    message: error.body.message,
                    variant: 'error',
                    mode: 'dismissable'
                });
                this.dispatchEvent(evt);
            });
    }
}
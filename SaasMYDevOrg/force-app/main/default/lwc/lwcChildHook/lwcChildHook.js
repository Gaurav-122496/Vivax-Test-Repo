import { LightningElement } from 'lwc';

export default class LwcChildHook extends LightningElement {
    constructor() {
        //super(); 
        console.log('Constructor called from child comp');
    }

    connectedCallback() {
        console.log('Component connected to the DOM from child comp');
    }

    renderedCallback() {
        console.log('Component rendered or re-rendered from child comp');
    }
    errorCallback(){
        console.log('error callback from child comp');
    }
}
import { LightningElement } from 'lwc';

export default class LwcLifecyleHooks extends LightningElement {

    constructor() {
        super();  // this method iniatailize all the things inside the component
        console.log('Constructor called');
    }

    connectedCallback() {
        console.log('Component connected to the DOM');
    }

    renderedCallback() {
        console.log('Component rendered or re-rendered');
    }
    
    // errorCallback(error, stack) {
    //     console.log('Error occurred:', error);
    //     console.log('Stack trace:', stack);
    // }
    
    // disconnectedCallback() {
    //     console.log('Component disconnected from the DOM');
    // }
    
    
}
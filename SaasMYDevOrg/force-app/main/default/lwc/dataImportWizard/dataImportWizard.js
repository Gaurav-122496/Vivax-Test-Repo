import { LightningElement } from 'lwc';
import loadCSVData from '@salesforce/apex/DataImportController.loadCSVData';
import getCreatableObjects from '@salesforce/apex/DataImportController.getCreatableObjects';
import getFieldsForObject from '@salesforce/apex/DataImportController.getFieldsForObject';
import insertRecord  from '@salesforce/apex/DataImportController.insertRecord';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class DataImportWizard extends LightningElement {

    acceptedFormats =['.csv'];
    salesforceObjects=[];
    fieldList=[];
    columnHeader=[];
    fileData=[];
    fieldMapping={};
    selectedObjectName='';

    handleUploadFinished(event){
        if(event.detail.files.length>0){
       console.log(event.detail.files[0]);
       let file = event.detail.files[0];
       const contentDocumentId =  file.documentId;
       this.readFile(contentDocumentId);
        }
        else{
            const event =  new ShowToastEvent({
                title: 'Seems like no file uploaded',
                message: 
                'Salesforce documnetation is availabel in the app'
            });
            this.dispatchEvent(event);
        }
    }
    // async readFile(contentDocumentId){
    //     try{
    //     const CSVData = await loadCSVData({documentId: contentDocumentId});
    //     console.log('CSV Data'+CSVData);
    //     const correctData= this.correctCSV(CSVData);
    //     this.columnHeader= this.getCSVHeader(correctData);
    //     this.fileData = this.extractFileData(correctData);
    //     this.fetchObjects();
    //     }catch{
    //         const event =  new ShowToastEvent({
    //             title: 'Error occured',
    //             message: 
    //             'While reading the file'
    //         });
    //         this.dispatchEvent(event);
    //     }
    // }
    async readFile(contentDocumentId) {
        try {
            console.log('Fetching CSV Data for Document:', contentDocumentId);
            const CSVData = await loadCSVData({ documentId: contentDocumentId });
            console.log('CSV Data received:', CSVData);
    
            if (!CSVData || CSVData.length === 0) {
                console.error('CSV Data is empty!');
                this.showToast('Error', 'CSV file is empty or failed to load.', 'error');
                return;
            }
    
            const correctData = this.correctCSV(CSVData);
            this.columnHeader = this.getCSVHeader(correctData);
            this.fileData = this.extractFileData(correctData);
            this.fetchObjects();
        } catch (error) {
            console.error('Error in readFile:', error);
            this.showToast('Error', 'Error while reading the file: ' + error.body.message, 'error');
        }
    }
    

    correctCSV(CSVData){
        //removeing /r from the csv data
        let correctedData= [];   
        for(let i=0; i < CSVData.length; i++){  
            correctedData.push (CSVData[i].replaceAll('\r',''));
        }
        return correctedData;
    }
    getCSVHeader(correctedData){    
        return correctedData[0].split(',').map(headerValue=>{
            return {label:headerValue,value:headerValue}
        });
    }
    extractFileData(correctData){
        let fileData=[];ß
        for (let i=1; i<correctData.length;i++){
            let row={};
            let k=0;
            let correctDataRowValue =correctData[i].split(',');
            this.columnHeader.forEach(header=>{
                row[header.label]=correctDataRowValue[k];
                k++;
            })
            fileData.push(row);
        }
        console.log('file data'+ fileData);
        return fileData;
    }

   async fetchObjects(){
     let objectNameLabel = await getCreatableObjects();
     let objectOptions =[];
     objectNameLabel.forEach(objectInfo =>{
        objectOptions.push ({label:objectInfo.label, value:objectInfo.apiName})
     })
     this.salesforceObjects = objectOptions;

    }

    // handleObjectSelection(event){
    //  this.selectedObjectName = event.detail.value;
    //  this.fetchFieldsForSelectedObject(selectedObjectName);

    // }
    handleObjectSelection(event){
        this.selectedObjectName = event.detail.value;
        this.fetchFieldsForSelectedObject();
    }

    async fetchFieldsForSelectedObject(){
       this.fieldList =  await getFieldsForObject({ObjectName:this.selectedObjectName});
       
    }

    handleColumnSelection(event){
        let column= event.detail.value;
        this.fieldMapping[column]= event.target.dataset.apiName;


    }
    importData(){
        let recordList =[];
        for(let i=0;i< this.fileData.length;i++){
            let record={};
            let column = Object.keys(this.fileData[i]);
            for(let j=0; j<column.length;j++){
                let apiName = this.fieldMapping[column[j]];
                record[apiName]= this.fileData[i][column[j]];
            }
            recordList.push(record);
        }
        this.insertRecordOfCsv(recordList);
    }
   async insertRecordOfCsv(recordList){
    //   let insertResult = await insertRecord({records:recordList,objectName:this.selectedObjectName});
    //   console.log('inserting record'+insertResult);
    try {
        let insertResult = await insertRecord({
            records: recordList,
            objectName: this.selectedObjectName
        });
        console.log('Inserted records:', insertResult);
        this.showToast('Success', 'Records inserted successfully!', 'success');
    } catch (error) {
        this.showToast('Error', 'Error inserting records.', 'error');
        console.error(error);
    }
    }
}   


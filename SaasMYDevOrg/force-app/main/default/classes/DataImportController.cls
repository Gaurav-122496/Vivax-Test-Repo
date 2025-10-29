public with sharing class DataImportController {

    @AuraEnabled
    public static List<String> loadCSVData(String documentId){
        try{
            // validate input 
            if(String.isEmpty(documentId)){
               throw new AuraHandledException('Document Id cannot be null or Empty.');
            }
            // query to get contentversion based on contentDocumnetID
            ContentVersion contentversionobj = [SELECT Id, VersionData FROM ContentVersion
                                                WHERE Id = :documentId
                                                LIMIT 1];   
            //convert blob to string
            String data = contentversionobj.VersionData.toString();
            System.debug('CSV Data :'+ data);

            // split CSv into the lines
            List<String> csvFileLines = data.split('\n');
            system.debug('csv Lines:'+csvFileLines);

            //you might want to process upsert here 
            return csvFileLines;
        }catch(Exception e){
            //log detail error inforfmation
            system.debug('Error on Line Number'+e.getLineNumber());
            system.debug('Error cause'+ e.getCause());
            throw new AuraHandledException('Error Processing CSV data'+ e.getMessage());
        }
    }
   // this method is used to get all the object from salesforce
    @AuraEnabled(cacheable=true)
    public static List<SObjectDescribe> getCreatableObjects(){
        List<SObjectDescribe> CreatableObjects = new List<SObjectDescribe>();
        for(Schema.SObjectType objectType: Schema.getGlobalDescribe().values()){
            Schema.DescribeSObjectResult describeResult = objectType.getDescribe();
            if(describeResult.isCreateable()&& !describeResult.isCustomSetting()){
                CreatableObjects.add(new SObjectDescribe(describeResult.getLabel(),describeResult.getName()));
            }
        }
        return CreatableObjects;
    }
//     @AuraEnabled(cacheable=true)
//     public static List<Map<String, String>> getCreatableObjects() {
//     List<Map<String, String>> creatableObjects = new List<Map<String, String>>();
//     for (Schema.SObjectType objectType : Schema.getGlobalDescribe().values()) {
//         Schema.DescribeSObjectResult describeResult = objectType.getDescribe();
//         if (describeResult.isCreateable() && !describeResult.isCustomSetting()) {
//             Map<String, String> obj = new Map<String, String>();
//             obj.put('label', describeResult.getLabel());
//             obj.put('apiName', describeResult.getName());
//             creatableObjects.add(obj);
//         }
//     }
// return creatableObjects;
// }
    // for particluar object querying the fields
    @AuraEnabled(cacheable=true)
   public static List<SObjectFieldDescribe> getFieldsForObject(String ObjectName){
    Schema.DescribeSObjectResult objectDescribe = Schema.getGlobalDescribe().get(ObjectName).getDescribe();
    List<SObjectFieldDescribe> fieldsList = new List<SObjectFieldDescribe>();
    for(Schema.SObjectField field : objectDescribe.fields.getMap().values()){
        Schema.DescribeFieldResult fieldDescribe = field.getDescribe();
        if(fieldDescribe.isCreateable()){
            fieldsList.add(new SObjectFieldDescribe(fieldDescribe.getLabel(), fieldDescribe.getName()));
        }
    }
    return fieldsList;
}
    // inserting the fields and record into the object
    @AuraEnabled
    public static void insertRecord(List<Map<String, Object>> records, String objectName) {
        try {
            List<SObject> sObjectList = new List<SObject>();
            for (Map<String, Object> record : records) {
                SObject sObjectRecord = Schema.getGlobalDescribe().get(objectName).newSObject();
                for (String field : record.keySet()) {
                    if (Schema.getGlobalDescribe().get(objectName).getDescribe().fields.getMap().containsKey(field)) {
                        sObjectRecord.put(field, record.get(field));
                    }
                }
                sObjectList.add(sObjectRecord);
            }
            insert sObjectList;
        } catch (Exception e) {
            throw new AuraHandledException('Error inserting records: ' + e.getMessage());
        }
    }
    

    public class SObjectDescribe{
        @AuraEnabled public String label;
        @AuraEnabled public String apiName;
        public SObjectDescribe(String label,String apiName){
            this.label = label; // Set the label to the parameter value
            this.apiName = apiName; // Set the apiName to the parameter value
        }
    }
    public class SObjectFieldDescribe {
        @AuraEnabled public String label;
        @AuraEnabled public String apiName;
        public SObjectFieldDescribe(String label, String apiName) {
            this.label = label;
            this.apiName = apiName;
        }
    }
}
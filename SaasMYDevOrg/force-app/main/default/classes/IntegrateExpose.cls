@RestResource(urlMapping='/AccountInte/*')    
global with sharing class IntegrateExpose {
    @HttpPost
    global static string getAccounts() {
        system.debug('Recived Response'+ RestContext.request.requestBody.toString());
        string JsonAccounts= RestContext.request.requestBody.toString();
        system.debug('JSON--->'+JsonAccounts);
    	    
        List<Account> deseializeAccounts = (List<Account>)JSON.deserialize(JsonAccounts,List<Account>.class);
        
        for(Account acc:deseializeAccounts){
            system.debug('acc==>'+acc);
        }
        system.debug('deserial--->'+deseializeAccounts);
        return 'Records Recived Successfully';    
    }
    
    //global static string getAccountNumbers(){
        
        //system.debug('recived response--->'+ RestContext.request.requestBody.toString());
        // get the body from the request in jsonAcc string
        //string jsonAcc = RestContext.request.requestBody .toString();
        //system.debug('json--->'+jsonAcc);
        //List<Account> deserializeAcc = (List<Account>)JSON.deserialize(jsonAcc,List<Account>.class);
        
        //for(Account acc1 :deserializeAcc){
         //   system.debug(acc1);  
        //}
       // system.debug('deserial---->'+ deserializeAcc);
      //  return 'record recieved succesfully';
        
    //}
}
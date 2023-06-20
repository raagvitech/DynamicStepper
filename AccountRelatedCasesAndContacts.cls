public with sharing class AccountRelatedCasesAndContacts {
    @AuraEnabled(cacheable=true)
    public static List<Case> getRelatedCases(Id accountId){
        System.debug('id '+accountId);
        List<Case> listOfOpenCases =  [ SELECT CaseNumber 
                                       FROM Case 
                                       WHERE AccountId =: accountId AND status = 'Open'
                                       ORDER BY CreatedDate Desc];
        System.debug('listOfOpenCases'+listOfOpenCases);
        return listOfOpenCases;
        
    }
    @AuraEnabled(cacheable=true)
    public static List<Contact> getRelatedContacts(Id accid){
       System.debug('ID==>'+accid);
       return [SELECT Id,Name, Authority_Type__c FROM Contact WHERE AccountId =:accid  AND Authority_Type__c IN ('Account owner','Full Authority')];
    }
}
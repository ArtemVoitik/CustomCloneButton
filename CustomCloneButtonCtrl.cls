public with sharing class CustomCloneButtonCtrl {
    public CustomCloneButtonCtrl() {}

    @AuraEnabled(Cacheable=false)
    public static Opportunity getRecord(String recordId) {
        Opportunity opportunity = [
                SELECT Name, AccountId, CloseDate, Type, Account.BillingAddress
                FROM Opportunity
                WHERE Id = :recordId
                LIMIT 1
        ];
        return opportunity;
    }

    @AuraEnabled
    public static String saveRecord(Opportunity opportunity, String oppRecordId) {
        try {
            insert opportunity;

            return opportunity.Id;
        } catch (Exception ex) {
            throw new AuraHandledException(ex.getMessage());
        }
    }
}
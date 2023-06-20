public class SelectPaymentAPIcallout {
    class WrapperData{
        public String ppInstalmentAmount;
        public String ppFrequency;
        public Integer ppNumOfInstallments;
        public String totalPayableAmount;
        public String validToDate;
        public Integer ppOfferId;
        public Integer statusCode;
    }
    
    public static Map<String, Object> results = new Map<String,object>();
    @AuraEnabled(cacheable=true)
    public static String getresponseData(){
        try{
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        request.setEndpoint('callout:MockResponse');
        request.setHeader('Content-Type', 'application/json');
        request.setHeader('Accept','application/json');
        request.setMethod('GET');
        System.debug('Request body::::::'+request);
        HttpResponse response = http.send(request);
        System.debug(response);
        //System.debug('body===>'+response.getBody());
        if (response.getStatusCode() == 200) {
        results = (Map<String,Object>)JSON.deserializeUntyped(response.getBody());
        System.debug('results--->'+results);
        
        List<WrapperData> wrapperDataList = new  List<WrapperData>();
        
        Map<String, Object> dataMap;
        
        if(results.containsKey('data')) {
            dataMap = (Map<String, Object>) results.get('data');
        }
        System.debug(dataMap);
        
        List<Object> fpaOfferslist;
        if(dataMap.containsKey('fpaOffers')){
            fpaOfferslist = (List<Object>) dataMap.get('fpaOffers');
        }
        System.debug('fpaOfferslist===>'+fpaOfferslist);
        
        
        if(!fpaOfferslist.isEmpty()){
            for(Object fpaOffersObj : fpaOfferslist ){
                Map<String, Object> fpaOffersMap =  (Map<String, Object>)fpaOffersObj;
                String delegationLevel = (String) fpaOffersMap.get('delegationLevel');
                if (delegationLevel.equals('GET_FPA_FOH_DELEGATION')) {
                    WrapperData wrapperdata = new WrapperData();
                    wrapperdata.ppInstalmentAmount = (String) fpaOffersMap.get('ppInstalmentAmount');
                    wrapperdata.ppFrequency = (String) fpaOffersMap.get('ppFrequency');
                    wrapperdata.ppNumOfInstallments = (Integer) fpaOffersMap.get('ppNumOfInstallments');
                    wrapperdata.totalPayableAmount = (String) fpaOffersMap.get('totalPayableAmount');
                    wrapperdata.validToDate = (String) fpaOffersMap.get('validToDate');
                    wrapperdata.ppOfferId = (Integer) fpaOffersMap.get('ppOfferId');
                    wrapperDataList.add(wrapperdata);
                }
            } 
            
        }
        System.debug(wrapperDataList);
        // System.debug(wrapperDataList.size());
        return JSON.serialize(wrapperDataList);
    }
    else{
        throw new CalloutException('Callout failed with status code: ' + response.getStatusCode());
    }
    }
    catch(Exception ex){
        throw new CalloutException('An error occurred during the callout: ' + ex.getMessage());

    } 
    
}
}
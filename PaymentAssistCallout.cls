public class PaymentAssistCallout {

    public static String results;
    @AuraEnabled(cacheable=true)
    public static String getresponseData(String requesbody){
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        request.setEndpoint('callout:PaymentOfferCallout');
        request.setHeader('Content-Type', 'application/json');
        request.setHeader('Accept','application/json');
        request.setMethod('GET');
        request.setBody(requesbody);
        HttpResponse response = http.send(request);
        System.debug('Request body::::::'+request);
      
        System.debug(response);
        // System.debug('response::::::'+response.getStatusCode());
        System.debug('body::::::'+response.getBody());
        results=response.getBody();
        //Deserialize the JSON string into collections of primitive data types.
    
        // System.debug('results--->'+results);
        return results;
    }

}
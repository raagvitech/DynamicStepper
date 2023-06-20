public class ExceptionCallout {
    @AuraEnabled(cacheable=true)
    public static String makeCallout() {
        HttpRequest request = new HttpRequest();
      request.setEndpoint('callout:ExceptionCallout');
  request.setHeader('Content-Type', 'application/json');
        request.setHeader('Accept','application/json');
        request.setMethod('GET');

        try {
            Http http = new Http();
            HttpResponse response = http.send(request);

            if (response.getStatusCode() == 200) {
                // Process the response here
                return 'success';
            } else {
                // Handle the error response
                throw new CalloutException('Callout failed with status code: ' + response.getStatusCode());
              
            }
        } catch (Exception ex) {
            // Handle any exceptions that occurred during the callout
            throw new CalloutException('An error occurred during the callout: ' + ex.getMessage());
        }
    }
}
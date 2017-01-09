var QUERY_URL = 'http://localhost:8080/';


$(document).ready(function(){
   $.get('http://localhost:8080/books', {}, function(data){
       console.log("wywolane");
        console.log(data);
   });
});
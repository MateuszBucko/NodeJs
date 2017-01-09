var QUERY_URL = 'http://localhost:8080/';


$(document).ready(function(){
   $.get(QUERY_URL+'books', {}, function(data){
       console.log("wywolane");
        console.log(data);
        data.forEach(function(book){
            console.log(data);
            var row = $("<tr></tr>");
            var id  = $("<td></td>").text(book.id);
            var title = $("<td></td>").text(book.title);
            var title_en = $("<td></td>").text(book.title_en);
            var isbn = $("<td></td>").text(book.isbn);
            var add_date = $("<td></td>").text(book.add_date);
            var category = $("<td></td>").text(book.category);
            var description = $("<td></td>").text(book.description);
            var publisher = $("<td></td>").text(book.publisher);
            var quantity = $("<td></td>").text(book.quantity);
            var authors = $("<td></td>").text(book.authors);
            
            $(row).prepend(id,title,title_en,isbn,add_date,category,description,publisher,quantity,authors);
            $("#books").append(row);
        });
   });
});
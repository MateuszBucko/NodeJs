var QUERY_URL = 'http://localhost:8080/';


$(document).ready(function(){
   $.get(QUERY_URL+'books', {}, function(data){
        data.forEach(function(data){
            AddBook(data);
        });
   });
   
   $.get(QUERY_URL+'authors', function(data) {
        data.forEach(function(data){
            AddAuthor(data);
        });
    });
   
   
   function AddBook (book){
        var table = $("#books_table");
        var newabook = $("#book_prototype").clone(true);
        
        newabook.children(".id").text(book.id);
        newabook.children(".title").text(book.title);
        newabook.children(".title_en").text(book.title_en);
        newabook.children(".isbn").text(book.isbn);
        newabook.children(".add_date").text(book.add_date);
        newabook.children(".category").text(book.category);
        newabook.children(".description").text(book.description);
        newabook.children(".publisher").text(book.publisher);

        
        table.append(newabook);
        newabook.show();
    }
            
    function AddAuthor(author){
        var table = $("#authors_table");
        var newauthor = $("#author_prototype").clone(true);
        newauthor.children(".id").text(author.id);
        newauthor.children(".name").text(author.name);
        newauthor.children(".surname").text(author.surname);
        
        table.append(newauthor);
        newauthor.show();
    }
});
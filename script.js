var QUERY_URL = 'http://localhost:8080/';
var view = 0;
var books;
var authors;

function Author(id, name, surname){
    this.id = ko.observable(id);
    this.name = ko.observable(name);
    this.surname = ko.observable(surname);
}

function AuthorsViewModel() {
    var self = this;
    this.authors = ko.observableArray();
    
    $.getJSON(QUERY_URL + 'authors', {}, function (data) {
        var mappedData = $.map(data, function(item){
            return new Author(item.id,
                item.name,
                item.surname);
        });
        self.authors(mappedData);
    });
    this.removeAuthor = function (author) {
        $.ajax({
            url: QUERY_URL + 'authors/' + author.id(),
            type: 'DELETE',
            contentType: "application/json",
            success: function (result) {
                self.authors.remove(author);
            }
        });
    };
}

function Book(id, title, title_en, isbn, add_date, category, description, publisher){
    this.id = ko.observable(id);
    this.title = ko.observable(title);
    this.title_en = ko.observable(title_en);
    this.isbn = ko.observable(isbn);
    this.add_date = ko.observable(add_date);
    this.category = ko.observable(category);
    this.description = ko.observable(description);
    this.publisher = ko.observable(publisher);
}

function BooksViewModel() {
    var self = this;
    this.books = ko.observableArray();
    
    $.getJSON(QUERY_URL + 'books', {}, function (data) {
        var mappedData = $.map(data, function(item){
            return new Book(item.id,
                item.title,
                item.title_en,
                item.isbn,
                item.add_date,
                item.category,
                item.description,
                item.publisher);
        });
        self.books(mappedData);
    });
    this.removeBook = function (book) {
        $.ajax({
            url: QUERY_URL + 'books/' + book.id(),
            type: 'DELETE',
            contentType: "application/json",
            success: function (result) {
                self.books.remove(book);
            }
        });
    };
}

$(document).ready(function () {
   
   ko.applyBindings(new BooksViewModel(),document.getElementById("books_table"));
   ko.applyBindings(new AuthorsViewModel(),document.getElementById("authors_table"));
  
});
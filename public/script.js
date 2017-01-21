var QUERY_URL = 'http://localhost:8080/';
var view = 0;
var books;
var authors;

var c_ID = 0;
var c_TITLE = 1;
var c_NAME = 2;
var c_SURNAME = 3;
var c_TITLE_EN = 4;
var c_CATEGORY = 5;
var c_PUBLISHER = 6;
var c_DESCRIPTION = 7;
var c_ISBN = 8;
var c_DATE = 9;

function CompareString(a, b){
    return a.localeCompare(b);
}

function Author(id, name, surname){
    this.id = ko.observable(id);
    this.name = ko.observable(name);
    this.surname = ko.observable(surname);
    this.s_name = name + ' ' + surname;
}
var Authors = [];


function AuthorsViewModel() {
    var self = this;
    this.dropModify = function(e){
        //dropModify(e);
    };
    this.authors = ko.observableArray().publishOn("authors_list");
    this.visible = ko.observable(false);
    ko.postbox.subscribe("section", function(newValue) {
        console.log(newValue);
        this.visible(newValue === "Authors");
    }, this);
    self.nameIn = ko.observable("");
    self.surnameIn = ko.observable("");
    $.getJSON(QUERY_URL + 'authors', {}, function (data) {
        var mappedData = $.map(data, function(item){
            return new Author(item.id,
                item.name,
                item.surname);
        });
        self.authors(mappedData);
    });
    this.getAuthors = function(){
        return self.authors;
    };
    this.add = function () {
        console.log(this);
      //self.authors.push(new Authors(this.name, this.surname));  
    };
    this.removeAuthor = function (author) {
        console.log(author.id());
        $.ajax({
            url: QUERY_URL + 'authors/' + author.id(),
            type: 'DELETE',
            contentType: "application/json",
            success: function (result) {
                self.authors.remove(author);
            }
        });
    };
    this.sortASC = function (column) {
        self.authors.sort(function(a, b){
            var z, x;
            switch (column) {
                case 'id' :
                    return a - b;
                    break;
                case 'name' :
                    z = a.name();
                    x = b.name();
                    break;
                case 'surname' :
                    z = a.surname();
                    x = b.surname();
                    ;
                    break;
            }
            return z.localeCompare(x);
        });
    };
    this.nextid = ko.computed(function (){
        return self.authors().length+1;
    },this);
    this.nextid = ko.computed(function () {
        return self.authors().length + 1;
    }, this);

    this.add = function () {
        var newauthor = new Author(15, this.nameIn(), this.surnameIn());
        if (this.nameIn() !== null && this.nameIn().length > 0 && this.surnameIn() !== null && this.surnameIn().length > 0) {
            $.ajax({
                url: QUERY_URL + 'authors/',
                type: 'post',
                data: ko.toJSON(newauthor),
                contentType: "application/json",
                success: function (result) {
                    self.authors.push(new Author(result.id, result.name, result.surname));
                }
            });
        } else {
            alert("Imię i nazwisko nie może być puste !");
        }
    };

    this.sortIdDesc = function () {
        self.authors.sort(function (a, b) {
            return a.id() - b.id();
        });
    };
    this.sortNameDesc = function () {
        self.authors.sort(function (a, b) {
            return CompareString(a.name(), b.name());
        });
    };
    this.sortSurnameDesc = function () {
        self.authors.sort(function (a, b) {
            return CompareString(a.surname(), b.surname());
        });
    };

    this.sortIdAsc = function () {
        self.authors.sort(function (a, b) {
            return b.id() - a.id();
        });
    };
    this.sortNameAsc = function () {
        self.authors.sort(function (a, b) {
            return CompareString(b.name(), a.name());
        });
    };
    this.sortSurnameAsc = function () {
        self.authors.sort(function (a, b) {
            return CompareString(b.surname(), a.surname());
        });
    };
}

function Book(id, title, title_en, isbn, add_date, category, description, publisher,authors){
    this.id = ko.observable(id);
    this.title = ko.observable(title);
    this.title_en = ko.observable(title_en);
    this.isbn = ko.observable(isbn);
    this.add_date = ko.observable(add_date);
    this.category = ko.observable(category);
    this.description = ko.observable(description);
    this.publisher = ko.observable(publisher);
    this.authors = ko.observableArray(authors);
}

function BooksViewModel() {
    var self = this;
    this.isModify = ko.observable(false);
    this.modifyBook = ko.observable(); 
    var tempBook;
    this.modifyAccept = function(e) {
        
    };
    this.modifyUndo = function(e) {
        console.log('lol');
        self.modifyBook(tempBook);
    };
    this.modifyClose = function(e) {
      self.isModify(false);  
    };
    this.setModify = function(e) {
        if(self.isModify())
            if(e.id()!=self.modifyBook().id());
            else self.isModify(false);
        else{
            self.isModify(true);
            console.log(e);
            tempBook = new Book(e);
            console.log(tempBook.id());
            self.modifyBook(tempBook);
        }
        
    };
    
    this.visible = ko.observable().subscribeTo("section", function(newValue) {
        return newValue === "Books";
    });
    this.selectedAuthors = ko.observableArray([]);
    this.books = ko.observableArray();
    this.title = ko.observable("");
    this.title_en = ko.observable("");
    this.isbn = ko.observable("");
    this.authors = ko.observable("").subscribeTo("authors_list");
    var today = new Date();
    var today_s = today.getFullYear()+"-"+today.getMonth()+1+"-"+today.getDate();
    this.add_date = ko.observable(today_s);
    console.log(this.add_date());
    this.category = ko.observable("");
    this.description = ko.observable("");
    this.publisher = ko.observable("");
    $.getJSON(QUERY_URL + 'books', {}, function (data) {
        var mappedData = $.map(data, function(item){
            
            return new Book(item.id,
                item.title,
                item.title_en,
                item.isbn,
                item.add_date,
                item.category,
                item.description,
                item.publisher,
                item.authors);
        });
        self.books(mappedData);
    });
    this.modify = function(){
        console.log(this);
    };
    this.add = function(){
        var newbook = new Book(15,this.title(),
                this.title_en(),
                this.isbn(),
                this.add_date(),
                this.category(),
                this.description(),
                this.publisher(),
                this.selectedAuthors());
                
        $.ajax({
            url: QUERY_URL + 'books/',
            type: 'post',
            data: ko.toJSON(newbook),
            contentType: "application/json",
            success: function (result) {
                self.books.push(new Book(result.id, result.title, result.title_en, result.isbn, 
                result.add_date, result.category, result.description, result.publisher, result.authors));
                
        console.log(result);
            }
        });
    };
    this.nextid = ko.computed(function (){
        return self.books().length+1;
    },this);
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
    this.sort = function(column,desc) {
        self.books.sort(function (a, b) {
            var z, x;
            switch (column) {
                case c_ID :
                    if (desc)
                        return b.id() - a.id();
                    else
                        return a.id() - b.id();
                    break;
                case c_TITLE :
                    z = a.title();
                    x = b.title();
                    break;
                case c_TITLE_EN :
                    z = a.title_en();
                    x = b.title_en();
                    break;
                case c_CATEGORY :
                    z = a.category();
                    x = b.category();
                    break;
                case c_PUBLISHER :
                    z = a.publisher();
                    x = b.publisher();
                    break;
                case c_DESCRIPTION :
                    z = a.description();
                    x = b.description();
                    break;
                case c_ISBN :
                    if (desc)
                        return b.isbn() - a.isbn();
                    else
                        return a.isbn() - b.isbn();
                    break;
                case c_DATE :
                    z = a.add_date();
                    x = b.add_date();
                    break;
            }
            if (desc)
                return x.localeCompare(z);
            else
                return z.localeCompare(x);
        });
    };
}

function ViewsModel() {
    var self = this;
    this.views = ko.observableArray([
       'Books',
       'Authors'
    ]);
    this.selectedView = ko.observable().publishOn("section");
}
var active;
$(document).ready(function () {
    
   $(".add_bar").slideUp();
   ko.applyBindings(new ViewsModel(),document.getElementById("navigation"));
   ko.applyBindings(new AuthorsViewModel,document.getElementById("authors_table"));
   ko.applyBindings(new BooksViewModel,document.getElementById("books_table"));
   active = $('#navigation_bar a:first-child').addClass('active');
   $("#navigation_bar a.active").click();
   $("#navigation_bar a").click(function(e){
       $(active).removeClass('active');
       active = $(this).addClass('active');
   });
   $(".sort").click(function(e){
      e.preventDefault(); 
   });
   $(".add_drop").click(function(e){
       $(".add_bar").slideToggle();
   });
   
});
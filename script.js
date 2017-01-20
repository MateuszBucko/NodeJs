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
}

function header(name,sort_desc,sort_asc,parent){
    this.name=name;
    this.sort_desc=parent.sort(sort_desc);
    this.sort_asc=parent.sort(sort_asc);
}


function AuthorsViewModel() {
    var self = this;
    this.authors = ko.observableArray();
    /*
    this.headers = ko.observableArray([
        new header('id',),
    ]);*/
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
            switch(column){
                case 'id' : return a-b; break;
                case 'name' : z=a.name(); x=b.name(); break;
                case 'surname' : z=a.surname(); x=b.surname();; break;
            }
            return z.localeCompare(x);
        });
    };
    this.nextid = ko.computed(function (){
        return self.authors().length+1;
    },this);
    this.add = function(){
        var newauthor = new Author(15,this.nameIn(),this.surnameIn());
        $.ajax({
            url: QUERY_URL + 'authors/',
            type: 'post',
            data: ko.toJSON(newauthor),
            contentType: "application/json",
            success: function (result) {
                authors.push(new Author(result.id,result.name,result.surname));
            }
        });
    };
    
    this.sortIdDesc = function () {self.authors.sort(function(a, b) {return a.id()-b.id();});};
    this.sortNameDesc = function () {self.authors.sort(function(a, b) {return CompareString(a.name(),b.name());});};
    this.sortSurnameDesc = function () {self.authors.sort(function(a, b) {return CompareString(a.surname(),b.surname());});};
    
    this.sortIdAsc = function () {self.authors.sort(function(a, b) {return b.id()-a.id();});};
    this.sortNameAsc = function () {self.authors.sort(function(a, b) {return CompareString(b.name(),a.name());});};
    this.sortSurnameAsc = function () {self.authors.sort(function(a, b) {return CompareString(b.surname(),a.surname());});};
    
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
    this.title = ko.observable("");
    this.title_en = ko.observable("");
    this.isbn = ko.observable("");
    this.add_date = ko.observable("");
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
                item.publisher);
        });
        self.books(mappedData);
    });
    this.add = function(){
        var newbook = new Book(15,this.title(),
                this.title_en(),
                this.isbn(),
                this.add_date(),
                this.category(),
                this.description(),
                this.publisher());
        $.ajax({
            url: QUERY_URL + 'authors/',
            type: 'post',
            data: ko.toJSON(newauthor),
            contentType: "application/json",
            success: function (result) {
                authors.push(new Author(result.id,result.name,result.surname));
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
        self.books.sort(function(a, b){
            var z, x;
            switch(column){
                case c_ID : if(desc)return b.id()-a.id();
                            else return a.id()-b.id(); break;
                case c_TITLE : z=a.title(); x=b.title(); break;
                case c_TITLE_EN : z=a.title_en(); x=b.title_en(); break;
                case c_CATEGORY : z=a.category(); x=b.category(); break;
                case c_PUBLISHER : z=a.publisher(); x=b.publisher(); break;
                case c_DESCRIPTION : z=a.description(); x=b.description(); break;
                case c_ISBN : if(desc)return b.isbn()-a.isbn();
                            else return a.isbn()-b.isbn(); break;
                case c_DATE : if(desc)return b.add_date()-a.add_date();
                            else return a.add_date()-b.add_date(); break;
            }
            if(desc)
                return x.localeCompare(z);
            else
                return z.localeCompare(x);
        });
    };
}

function View(title, template, data){
    this.title=title;
    this.template=template;
    this.data=data;
}

function ViewsModel() {
    var self = this;
    
    this.views = ko.observableArray([
       new View('books','books_template',BooksViewModel),
       new View('authors','authors_template',AuthorsViewModel)
    ]);
    this.selectedView = ko.observable();
    this.sort = function(a,b){
       console.log(self.selectedView().data);
    }
    this.add = function(){
        console.log('lol');
    }
}
var active;

$(document).ready(function () {
   ko.applyBindings(new ViewsModel());
   
   active = $('#navigation_bar a:first-child').addClass('active');
   $("#navigation_bar a.active").click();
   $("#navigation_bar a").click(function(e){
       $(active).removeClass('active');
       active = $(this).addClass('active');
   });
   $(".sort").click(function(e){
      e.preventDefault(); 
   });

});
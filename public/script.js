var QUERY_URL = 'http://localhost:8081/';
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

var authorsViewModel = new AuthorsViewModel;
var booksViewModel = new BooksViewModel;

function CompareString(a, b) {
    return a.localeCompare(b);
}


function Author(id, name, surname) {
    this.id = ko.observable(id);
    this.name = ko.observable(name);
    this.surname = ko.observable(surname);
    this.s_name = name + ' ' + surname;
}
var Authors = [];

Array.prototype.diff = function (a) {
    return this.filter(function (i) {
        return a.indexOf(i) < 0;
    });
};


function SearchViewModel() {

    this.searchText = ko.observable("keyword");
    this.search = function () {

    };
}
function AuthorsViewModel() {
    var self = this;
    this.isModify = ko.observable(false);
    this.modifyAuthor = ko.observable();
    this.modifyOriginal = ko.observable();

    this.authorBooks = ko.observableArray();
    this.authorBooksOrg = ko.observableArray();
    this.populateSelected = function () {
        this.authorBooks.removeAll();
        this.authorBooksOrg.removeAll();
        for (var i = 0; i < self.books().length; i++) {
            for (var j = 0; j < self.books()[i].authors().length; j++) {
                if (self.books()[i].authors()[j] == self.modifyAuthor().id) {
                    self.authorBooks.push(self.books()[i].id());
                    self.authorBooksOrg.push(self.books()[i].id());
                }
            }
        }
    };

    this.modifyAccept = function (e) {
        var id = self.modifyAuthor().id;
        $.ajax({
            url: QUERY_URL + 'authors/' + id,
            type: 'PUT',
            data: ko.toJSON(self.modifyAuthor),
            contentType: "application/json",
            success: function (result) {
                self.modifyOriginal.name(result.name);
                self.modifyOriginal.surname(result.surname);
                self.modifyAuthor();
                self.modifyClose();
                var diff = self.authorBooks().diff(self.authorBooksOrg());
                console.log("diff");

                diff = diff.concat(self.authorBooksOrg().diff(self.authorBooks()));

                var lookup = {};
                for (var i = 0, len = self.books().length; i < len; i++) {
                    lookup[self.books()[i].id()] = self.books()[i];
                }
                console.log(diff);
                for (var i = 0; i < diff.length; i++) {
                    if (lookup[diff[i]].authors().find(function (idd, val) {
                        return idd == id;
                    }) == null)
                        lookup[diff[i]].authors().push(id);
                    else {
                        lookup[diff[i]].authors().splice(lookup[diff[i]].authors().indexOf(id), 1);
                    }
                    $.ajax({url: QUERY_URL + 'books/' + lookup[diff[i]].id(),
                        type: 'PUT',
                        data: ko.toJSON(lookup[diff[i]]),
                        contentType: "application/json",
                        success: function (result) { }
                    });
                }

            }
        });
    };

    this.modifyUndo = function (e) {
        self.modifyAuthor(ko.toJS(self.modifyOriginal));
    };
    this.modifyClose = function (e) {
        self.isModify(false);
    };
    this.setModify = function (e) {
        if (self.isModify())
            if (e.id() != self.modifyAuthor.id) {
                self.modifyOriginal = e;
                self.modifyAuthor(ko.observable(ko.toJS(e))());
                self.populateSelected();
            } else
                self.isModify(false);
        else {
            self.isModify(true);
            self.modifyOriginal = e;
            self.modifyAuthor(ko.observable(ko.toJS(e))());
            self.populateSelected();
        }
    };


    this.authors = ko.observableArray().publishOn("authors_list");
    this.books = ko.observable("").subscribeTo("books_list");
    this.selectedBooks = ko.observableArray();
    this.visible = ko.observable(false);
    ko.postbox.subscribe("section", function (newValue) {
        console.log(newValue);
        this.visible(newValue === "Authors");
    }, this);
    self.nameIn = ko.observable("");
    self.surnameIn = ko.observable("");
    $.getJSON(QUERY_URL + 'authors', {}, function (data) {
        var mappedData = $.map(data, function (item) {
            return new Author(item.id,
                    item.name,
                    item.surname);
        });
        self.authors(mappedData);
    });
    this.getAuthors = function () {
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

    this.removeAuthorFromTable = function (author) {
        self.authors.remove(author);
    };

    this.addAutorEx = function (author) {
        self.authors.push(author);
    };

    this.clearAuthorFilter = function () {

//        $.getJSON(QUERY_URL + 'authors', {async: false}, function (data) {
//        var mappedData = $.map(data, function (item) {
//            return new Author(item.id,
//                    item.name,
//                    item.surname);
//                   
//        });
//        self.authors(mappedData);
//    });


        $.ajax({
            type: 'GET',
            async: false,
            url: QUERY_URL + 'authors',
            dataType: 'json',
            success: function (data) {
                console.log(data);
                var mappedData = $.map(data, function (item) {
                    return new Author(item.id,
                            item.name,
                            item.surname);

                });
                self.authors(mappedData);
            }

        });


    };



    this.sortASC = function (column) {
        self.authors.sort(function (a, b) {
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
    this.nextid = ko.computed(function () {
        return self.authors().length + 1;
    }, this);
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

function Book(id, title, title_en, isbn, add_date, category, description, publisher, authors) {
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
    this.modifyOriginal = ko.observable();
    this.modifyAccept = function (e) {
        console.log(self.modifyBook().id);
        $.ajax({
            url: QUERY_URL + 'books/' + self.modifyBook().id,
            type: 'PUT',
            data: ko.toJSON(self.modifyBook),
            contentType: "application/json",
            success: function (result) {
                console.log(result);
                self.modifyOriginal.title(result.title);
                self.modifyOriginal.title_en(result.title_en);
                self.modifyOriginal.isbn(result.isbn);
                self.modifyOriginal.publisher(result.publisher);
                self.modifyOriginal.category(result.category);
                self.modifyOriginal.description(result.description);
                self.modifyOriginal.add_date(result.add_date);
                self.modifyOriginal.authors(result.authors);
                self.modifyBook();
                self.modifyClose();
            }
        });
    };
    this.modifyUndo = function (e) {
        self.modifyBook(ko.toJS(self.modifyOriginal));
    };
    this.modifyClose = function (e) {
        self.isModify(false);
    };
    this.setModify = function (e) {
        if (self.isModify())
            if (e.id() != self.modifyBook.id) {
                self.modifyOriginal = e;
                self.modifyBook(ko.observable(ko.toJS(e))());
            } else
                self.isModify(false);
        else {
            self.isModify(true);
            self.modifyOriginal = e;
            self.modifyBook(ko.observable(ko.toJS(e))());
        }

    };

    this.visible = ko.observable().subscribeTo("section", function (newValue) {
        return newValue === "Books";
    });
    this.selectedAuthors = ko.observableArray([]);
    this.books = ko.observableArray();
    this.title = ko.observable("");
    this.title_en = ko.observable("");
    this.isbn = ko.observable("");
    this.authors = ko.observable("").subscribeTo("authors_list");
    this.books = ko.observableArray().publishOn("books_list");
    var today = new Date();
    var today_s = today.getFullYear() + "-" + today.getMonth() + 1 + "-" + today.getDate();
    this.add_date = ko.observable(today_s);
    console.log(this.add_date());
    this.category = ko.observable("");
    this.description = ko.observable("");
    this.publisher = ko.observable("");
    $.getJSON(QUERY_URL + 'books', {}, function (data) {
        var mappedData = $.map(data, function (item) {

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
    this.modify = function () {
        console.log(this);
    };
    this.add = function () {
        var newbook = new Book(15, this.title(),
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
    this.nextid = ko.computed(function () {
        return self.books().length + 1;
    }, this);
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

    this.removeBookFromTable = function (book) {
        self.books.remove(book);
    };

    this.addBookEx = function (book) {
        self.books.push(book);
    };

    this.clearBooksFilter = function () {
        
       

        $.getJSON(QUERY_URL + 'books', {}, function (data) {
            var mappedData = $.map(data, function (item) {

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
    }

    this.sort = function (column, desc) {
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

    this.books = ko.observableArray("").subscribeTo("books_list");
    this.authors = ko.observableArray("").subscribeTo("authors_list");
    var cleard = false;
    var removalAuthor = [];
    var removalBook = [];

    function clearAuthors() {
        authorsViewModel.clearAuthorFilter();
    }

    this.search = function () {
        var keyword = $("#keyword").val();

        removalAuthor = [];

        if (keyword !== null && keyword.length > 0) {
            if (self.selectedView() === "Authors") {
                var tempind = 0;

               for (var i = 0; i < removalAuthor.length; i++) {
                    authorsViewModel.addAutorEx(removalAuthor[i]);
                }
                removalAuthor = [];
                for (var i = 0; i < self.authors().length; i++) {

                    if (self.authors()[i].name() === keyword.valueOf() || self.authors()[i].surname() === keyword.valueOf()) {
                    } else {
                        removalAuthor[tempind] = self.authors()[i];
                        tempind++;
                    }
                }

                for (var j = 0; j < removalAuthor.length; j++) {
                    authorsViewModel.removeAuthorFromTable(removalAuthor[j]);
                }

            }


            if (self.selectedView() === "Books") {
                var tempbid = 0;
                for (var i = 0; i < removalBook.length; i++) {
                    booksViewModel.addBookEx(removalBook[i]);
                }
                
                removalBook = [];
                for (var i = 0; i < self.books().length; i++) {
                    if (self.books()[i].title() === keyword.valueOf() || self.books()[i].title_en() === keyword.valueOf() ||
                            self.books()[i].isbn() === keyword.valueOf()) {

                    } else {
                        removalBook[tempbid] = self.books()[i];
                        tempbid++;
                    }
                }

                for (var j = 0; j < removalBook.length; j++) {
                    booksViewModel.removeBookFromTable(removalBook[j]);
                }

            }

        }
    };

    this.clear = function () {
        $("#keyword").val("");
        if (self.selectedView() === "Authors") {

            for (var i = 0; i < removalAuthor.length; i++) {
                authorsViewModel.addAutorEx(removalAuthor[i]);
            }
            removalAuthor = [];
            //authorsViewModel.clearAuthorFilter();
        }
        if (self.selectedView() === "Books") {
            for (var i = 0; i < removalBook.length; i++) {
                booksViewModel.addBookEx(removalBook[i]);
            }
            removalBook = [];
            //booksViewModel.clearBooksFilter();
        }
    };
}

var active;
$(document).ready(function () {

    $(".add_bar").slideUp();
    authorsViewModel = new AuthorsViewModel;
    booksViewModel = new BooksViewModel;
    ko.applyBindings(new ViewsModel(), document.getElementById("navigation"));
    ko.applyBindings(authorsViewModel, document.getElementById("authors_table"));
    ko.applyBindings(booksViewModel, document.getElementById("books_table"));
    active = $('#navigation_bar a:first-child').addClass('active');
    $("#navigation_bar a.active").click();
    $("#navigation_bar a").click(function (e) {
        $(active).removeClass('active');
        active = $(this).addClass('active');
    });
    $(".sort").click(function (e) {
        e.preventDefault();
    });
    $(".add_drop").click(function (e) {
        $(".add_bar").slideToggle();
    });


}
);
var QUERY_URL = 'http://localhost:8080/';
var view = 0;
var books;
var authors;
$(document).ready(function () {
    if (books == null)
        $.get(QUERY_URL + 'books', {}, function (data) {
            view = 1;
            books = data;
            var i = 1;
            data.forEach(function (books) {

                AddBook(books, i++);
            });
        });
    if (authors == null)
        $.get(QUERY_URL + 'authors', function (data) {
            authors = data;
            var i = 1;
            data.forEach(function (authors) {
                AddAuthor(authors, i++);
            });
        });
});

function DeleteBook(object) {
    var par = $(object).parent().parent();
    var id = par.find(".id").text() - 1;
    $.ajax({

        url: QUERY_URL + 'books/' + books[id].id,
        type: 'DELETE',
        success: function (result) {
            books.splice(id, 1);
            console.log(books);
            par.nextAll().find(".id").text(function (i, txt) {
                return txt - 1;
            });
            par.remove();
        }
    });
}

function DeleteAuthor(object) {
    var par = $(object).parent().parent();
    var id = par.find(".id").text() - 1;
    $.ajax({
        url: QUERY_URL + 'authors/' + authors[id].id,
        type: 'DELETE',
        success: function (result) {
            authors.splice(id, 1);
            par.nextAll().find(".id").text(function (i, txt) {
                return txt - 1;
            });
            par.remove();
        }
    });
}

function AddBook(book, id) {
    var table = $("#books_table");
    var newabook = $("#book_prototype").clone(true);

    newabook.children(".id").text(id);
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

function AddAuthor(author, id) {
    var table = $("#authors_table");
    var newauthor = $("#author_prototype").clone(true);
    newauthor.children(".id").text(id);
    newauthor.children(".name").text(author.name);
    newauthor.children(".surname").text(author.surname);

    table.append(newauthor);
    newauthor.show();
}
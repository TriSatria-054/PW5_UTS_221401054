const bookSubmit = document.getElementById("bookSubmit");
const inputBookTitle = document.getElementById("inputBookTitle");
const inputBookAuthor = document.getElementById("inputBookAuthor");
const inputBookYear = document.getElementById("inputBookYear");
const inputBookIsComplete = document.getElementById("inputBookIsComplete");
const incompleteBookshelfList = document.getElementById("incompleteBookshelfList");
const completeBookshelfList = document.getElementById("completeBookshelfList");

const makeId = () => {
  return String(Date.now());
};

const books = {};

const addBook = (book) => {
  const shelf = book.isComplete ? completeBookshelfList : incompleteBookshelfList;
  const newBook = makeBookElement(book);
  shelf.appendChild(newBook);
  books[book.id] = book;

  saveData();
};

//menambahkan buku dari input user
const addBookSubmit = (e) => {
  e.preventDefault();

  const title = inputBookTitle.value;
  const author = inputBookAuthor.value;
  const year = parseInt(inputBookYear.value);
  const isComplete = inputBookIsComplete.checked;
  const id = makeId();

  if (title && author && year) {
    const newBook = {
      id: id,
      title: title,
      author: author,
      year: year,
      isComplete: isComplete
    };
    addBook(newBook);
  } else {
    alert("Harap lengkapi semua informasi buku");
  }

  inputBookTitle.value = "";
  inputBookAuthor.value = "";
  inputBookYear.value = "";
  inputBookIsComplete.checked = false;

  saveData();
};


//localstorage
const RENDER_EVENT = 'render-bookshelf';
const SAVED_EVENT = 'saved-bookshelf';
const STORAGE_KEY = 'BOOKSHELF_APPS';

function isStorageExist() /* boolean */ {
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

/**
 * Fungsi ini digunakan untuk menyimpan data ke localStorage
 * berdasarkan KEY yang sudah ditetapkan sebelumnya.
 */
function saveData() {
  if (isStorageExist()) {
    const parsed /* string */ = JSON.stringify(Object.values(books));
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

/**
 * Fungsi ini digunakan untuk memuat data dari localStorage
 * Dan memasukkan data hasil parsing ke variabel {@see todos}
 */
function loadDataFromStorage() {
  const serializedData /* string */ = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books[book.id] = book;
    }
    displayAllBooks();
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}





const makeBookElement = (book) => {
  const article = document.createElement("article");
  article.classList.add("book_item");
  article.setAttribute("id", book.id);

  const bookTitle = document.createElement("h3");
  bookTitle.innerText = book.title;

  const bookAuthor = document.createElement("p");
  bookAuthor.innerText = `Penulis: ${book.author}`;

  const bookYear = document.createElement("p");
  bookYear.innerText = `Tahun: ${book.year}`;

  const action = document.createElement("div");
  action.classList.add("action");

  const buttonToggle = createButton("green", book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca", toggleBookStatus);
  const buttonRemove = createButton("red", "Hapus buku", function () {
    removeBook(book.id);
  });

  action.appendChild(buttonToggle);
  action.appendChild(buttonRemove);

  article.appendChild(bookTitle);
  article.appendChild(bookAuthor);
  article.appendChild(bookYear);
  article.appendChild(action);

  return article;
};

const createButton = (buttonTypeClass, buttonText, eventListener) => {
  const button = document.createElement("button");
  button.classList.add(buttonTypeClass);
  button.innerText = buttonText;
  button.addEventListener("click", eventListener);
  return button;
};


//memindahkan buku ke rak selesai dibaca atau belum slesai dibaca
const toggleBookStatus = (e) => {
  const bookElement = e.target.parentElement.parentElement;
  const isComplete = bookElement.parentElement.id === "completeBookshelfList";

  if (isComplete) {
    incompleteBookshelfList.appendChild(bookElement);
  } else {
    completeBookshelfList.appendChild(bookElement);
  }

  const button = e.target;
  const bookId = bookElement.id;
  changeBookStatus(button, !isComplete);
  updateBookStatus(bookId, !isComplete);

  saveData();
};

const changeBookStatus = (button, isComplete) => {
  button.innerText = isComplete ? "Belum selesai dibaca" : "Selesai dibaca";
};

const updateBookStatus = (bookId, isComplete) => {
  const book = books[bookId];
  book.isComplete = isComplete;
};


//menghapus buku
const removeBook = (bookId) => {
  deleteBookElement(bookId);
  delete books[bookId];

  saveData();
};

const deleteBookElement = (bookId) => {
  const bookElement = document.getElementById(bookId);
  if (bookElement) {
    bookElement.remove();
  }
};


//cari bukunya dari judul
const searchBookByTitle = (title) => {

  const searchResult = Object.values(books).filter((book) => {
    return book.title.toLowerCase().includes(title.toLowerCase());
  });

  incompleteBookshelfList.innerHTML = "";
  completeBookshelfList.innerHTML = "";

  searchResult.forEach((book) => {
    const shelf = book.isComplete ? completeBookshelfList : incompleteBookshelfList;
    addBookToShelf(shelf, book);
  });

  saveData();
};

const addBookToShelf = (shelf, book) => {
  const newBook = makeBookElement(book);
  shelf.appendChild(newBook);
  if (book.isComplete) {
    completeBookshelfList.appendChild(newBook);
  } else {
    incompleteBookshelfList.appendChild(newBook);
  }
};


const displayAllBooks = () => {
  incompleteBookshelfList.innerHTML = "";
  completeBookshelfList.innerHTML = "";

  Object.values(books).forEach((book) => {
    const shelf = book.isComplete ? completeBookshelfList : incompleteBookshelfList;
    addBookToShelf(shelf, book);
  });
};


const searchSubmit = document.getElementById("searchSubmit");
const searchBookTitle = document.getElementById("searchBookTitle");



const addSearchSubmitListener = () => {
  searchSubmit.addEventListener("click", (e) => {
    e.preventDefault();
    const title = searchBookTitle.value;
    if (title) {
      searchBookByTitle(title);
    } else {
      displayAllBooks();
    }
  });
};

document.addEventListener('DOMContentLoaded', function () {

  addSearchSubmitListener();
  bookSubmit.addEventListener("click", addBookSubmit);

  if (isStorageExist()) {
    loadDataFromStorage();
  }

});

document.addEventListener(SAVED_EVENT, () => {
  console.log(localStorage.getItem(STORAGE_KEY));
});

document.addEventListener(RENDER_EVENT, function () {
  displayAllBooks();
});


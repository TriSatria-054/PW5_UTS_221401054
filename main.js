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

let carouselInner = document.getElementsByClassName("carousel-inner")[0];
let booksandmanga = [
  {
    title: 'Berserk',
    author: 'Kentarou Miura',
    img: 'https://cdn.myanimelist.net/images/manga/1/157897.jpg',
    year: 1990,
    content: 'Berserk adalah manga fantasi gelap yang mengikuti perjalanan Guts, seorang tentara bayaran yang hidup sendirian dengan masa lalu tragis. Penuh dengan pertempuran intens, karakter kompleks, dan narasi yang memikat, manga ini menjelajahi tema kelangsungan hidup dan konsekuensi dari pilihan seseorang.'
  },
  {
    title: 'Vagabond',
    author: 'Takehiko Inoue',
    img: 'https://cdn.myanimelist.net/images/manga/1/259070.jpg',
    year: 1998,
    content: 'Vagabond adalah manga sejarah yang terinspirasi dari kehidupan Miyamoto Musashi, seorang pedang legendaris. Dengan seni yang menakjubkan dan perkembangan karakter yang dalam, manga ini menggali perjalanan penemuan diri, penguasaan, dan pencarian jalan pedang.'
  },
  { 
    title: 'Naruto', 
    author: 'Masashi Kishimoto', 
    img: 'https://cdn.myanimelist.net/images/manga/3/249658.jpg', 
    year: 1999, 
    content: 'Naruto mengikuti kisah Naruto Uzumaki, seorang ninja muda dengan impian menjadi ninja terkuat dan mendapatkan gelar Hokage. Penuh dengan aksi, persahabatan, dan pertumbuhan, manga ini menjelajahi tema ketekunan dan perjuangan untuk mencapai tujuan seseorang.' 
  },
  { 
    title: 'Dragon Ball', 
    author: 'Akira Toriyama', 
    img: 'https://cdn.myanimelist.net/images/manga/1/267793.jpg', 
    year: 1984, 
    content: 'Dragon Ball adalah manga ikonik yang memperkenalkan petualangan Goku saat ia mencari Dragon Balls. Menggabungkan aksi, humor, dan pertempuran epik, manga ini memengaruhi generasi pembuat manga dan anime.' 
  },
  { 
    title: 'Attack on Titan', 
    author: 'Hajime Isayama', 
    img: 'https://cdn.myanimelist.net/images/manga/2/37846.jpg', 
    year: 2009, 
    content: 'Attack on Titan adalah manga fantasi gelap yang berlatar di dunia yang diserang oleh makhluk raksasa humanoid. Mengikuti perjuangan untuk kelangsungan hidup dan mengungkap misteri di balik Titan, manga ini menawarkan narasi yang memikat dan intens.' 
  },
  { 
    title: 'Death Note', 
    author: 'Tsugumi Ohba', 
    img: 'https://cdn.myanimelist.net/images/manga/1/258245.jpg', 
    year: 2003, 
    content: 'Death Note berkisah tentang seorang siswa sekolah menengah yang memiliki buku catatan dengan kekuatan untuk membunuh siapa pun yang namanya tertulis di dalamnya. Manga ini menjelajahi moralitas, keadilan, dan konsekuensi dari kekuasaan mutlak.' 
  },
  { 
    title: 'Fullmetal Alchemist', 
    author: 'Hiromu Arakawa', 
    img: 'https://cdn.myanimelist.net/images/manga/3/243675.jpg', 
    year: 2001, 
    content: 'Fullmetal Alchemist mengikuti perjalanan dua bersaudara, Edward dan Alphonse Elric, saat mereka mencari Batu Filsuf untuk mengembalikan tubuh mereka setelah eksperimen alkimia yang gagal. Manga ini menjelajahi pengorbanan, penebusan, dan konsekuensi dari campur tangan dengan tatanan alam.' 
  },
  { 
    title: 'My Hero Academia', 
    author: 'Kohei Horikoshi', 
    img: 'https://cdn.myanimelist.net/images/manga/1/209370.jpg', 
    year: 2014, 
    content: 'My Hero Academia berlatar di dunia di mana orang memiliki kekuatan super yang dikenal sebagai Quirks. Cerita ini mengikuti Izuku Midoriya, seorang anak tanpa Quirk yang bercita-cita menjadi pahlawan. Menggabungkan aksi, humor, dan perkembangan karakter, manga ini menjelajahi tema kepahlawanan dan identitas.' 
  },
  { 
    title: 'Demon Slayer', 
    author: 'Koyoharu Gotouge', 
    img: 'https://cdn.myanimelist.net/images/manga/3/179023.jpg', 
    year: 2016, 
    content: 'Demon Slayer mengikuti Tanjiro Kamado, seorang anak muda yang menjadi pemburu iblis setelah keluarganya dibantai oleh iblis. Dengan seni yang menakjubkan dan pertempuran yang intens, manga ini menjelajahi tema kehilangan, tekad, dan perjuangan melawan kekuatan supernatural.' 
  },
  { 
    title: 'Hunter x Hunter', 
    author: 'Yoshihiro Togashi', 
    img: 'https://cdn.myanimelist.net/images/manga/2/253119.jpg', 
    year: 1998, 
    content: 'Hunter x Hunter mengikuti Gon Freecss dalam perjuangannya menjadi Hunter dan mencari ayahnya yang hilang. Dikenal karena karakter-karakter kompleks dan pembangunan dunia yang rumit, manga ini menjelajahi tema persahabatan, petualangan, dan pencapaian tujuan pribadi.' 
  },
  { 
    title: 'One Punch Man', 
    author: 'ONE', 
    img: 'https://cdn.myanimelist.net/images/manga/3/80661.jpg', 
    year: 2009, 
    content: 'One Punch Man adalah manga parodi pahlawan super yang mengikuti Saitama, seorang pahlawan yang bisa mengalahkan lawan dengan satu pukulan. Penuh dengan humor, aksi, dan satir pada tropes pahlawan super, manga ini merupakan pengambilan unik pada genre pahlawan super.' 
  },
  { 
    title: 'Tokyo Ghoul', 
    author: 'Sui Ishida', 
    img: 'https://cdn.myanimelist.net/images/manga/3/114037.jpg', 
    year: 2011, 
    content: 'Tokyo Ghoul menjelajahi kehidupan Kaneki Ken, seorang mahasiswa yang berubah menjadi setengah-ghoul setelah kejadian kebetulan. Dengan tema gelap, kedalaman psikologis, dan pertempuran intens, manga ini menggali perjuangan identitas dan penerimaan dalam dunia manusia dan ghoul.' 
  },
  { 
    title: 'Monster', 
    author: 'Naoki Urasawa', 
    img: 'https://cdn.myanimelist.net/images/manga/3/258224.jpg', 
    year: 1994, 
    content: 'Monster mengikuti Dr. Kenzo Tenma saat ia mengungkap konspirasi yang melibatkan seorang anak muda dengan asal-usul yang jahat. Terkenal karena ketegangan dan dilema moralnya, manga ini menjelajahi konsekuensi dari pilihan dan sifat baik dan jahat.' 
  },

];



for (let i = 0; i < booksandmanga.length; i++) {
  const isActive = i === 0 ? 'active' : '';
  const obj = {
    id: makeId(),
    title: booksandmanga[i]["title"],
    author: booksandmanga[i]["author"],
    year: booksandmanga[i]["year"],
    isComplete: false,
  };

  const carouselItem = document.createElement("div");
  carouselItem.className = `carousel-item ${isActive}`;
  carouselItem.innerHTML = `
    <div class="clickable-content" style="cursor:pointer;">
      <img src="${booksandmanga[i]["img"]}" class="d-block mx-auto img-fluid" alt="${booksandmanga[i]["title"]}">
      <div class="carousel-caption d-none d-md-block">
        <h5>${booksandmanga[i]["title"]}</h5>
        <p>Author: ${booksandmanga[i]["author"]}</p>
        <p>Year: ${booksandmanga[i]["year"]}</p>
      </div>
    </div>
  `;
  
  carouselItem.addEventListener("click", () => tes(obj));
  carouselInner.appendChild(carouselItem);

  const kartu = document.getElementById("kartu");
  kartu.innerHTML += `
  <div class="card" style="width: 20rem;">
  <img src="${booksandmanga[i]["img"]}" class="card-img-top" alt="...">
  <div class="card-body">
    <h5 class="card-title">${booksandmanga[i]["title"]}</h5>
    <p class="card-text">${booksandmanga[i]["content"]}</p>
  </div>
</div>
  `
}

function tes(obj) {
  // Check if the book is already in the books array
  const isBookInArray = Object.values(books).some(
    (book) =>
      book.title === obj.title &&
      book.author === obj.author &&
      book.year === obj.year
  );

  // If the book is not in the array, add it
  if (!isBookInArray) {
    addBook(obj);
  } else {
    alert("Book sudah dimasukkan ke list.");
  }
}









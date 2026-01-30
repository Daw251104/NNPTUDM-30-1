const API = 'https://api.escuelajs.co/api/v1/products';

let data = [];
let filteredData = [];
let currentPage = 1;
let pageSize = 5;
let sortField = null;
let sortAsc = true;

// ===== GET ALL =====
async function getAll() {
    try {
        const res = await fetch(API);
        data = await res.json();
        filteredData = [...data];
        render();
    } catch (err) {
        console.error('Lỗi tải dữ liệu:', err);
    }
}

// ===== RENDER TABLE =====
function render() {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const pageData = filteredData.slice(start, end);

    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';

    pageData.forEach(item => {
        tbody.innerHTML += `
      <tr>
        <td>${item.id}</td>
        <td><img src="${item.images[0] || ''}" alt="${item.title}"></td>
        <td>${item.title}</td>
        <td>${item.price}</td>
      </tr>
    `;
    });

    renderPagination();
}

// ===== PAGINATION =====
function renderPagination() {
    const totalPages = Math.ceil(filteredData.length / pageSize);
    const div = document.getElementById('pagination');
    div.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        div.innerHTML += `<button onclick="goPage(${i})">${i}</button>`;
    }
}

function goPage(page) {
    currentPage = page;
    render();
}

// ===== SEARCH =====
document.getElementById('search').addEventListener('input', e => {
    const keyword = e.target.value.toLowerCase();
    filteredData = data.filter(d =>
        d.title.toLowerCase().includes(keyword)
    );
    currentPage = 1;
    render();
});

// ===== PAGE SIZE =====
document.getElementById('pageSize').addEventListener('change', e => {
    pageSize = Number(e.target.value);
    currentPage = 1;
    render();
});

// ===== SORT =====
function sortBy(field) {
    sortAsc = sortField === field ? !sortAsc : true;
    sortField = field;

    filteredData.sort((a, b) => {
        if (a[field] > b[field]) return sortAsc ? 1 : -1;
        if (a[field] < b[field]) return sortAsc ? -1 : 1;
        return 0;
    });

    render();
}

getAll();

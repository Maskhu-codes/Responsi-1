// ====== ADMIN DASHBOARD - COMPLETE CRUD FUNCTIONALITY ======

// Data storage (in memory array)
let students = [
  { id: 1, name: 'Muhammad Ali', nim: '2105007', major: 'Teknik Informatika', email: 'ali@email.com' },
  { id: 2, name: 'Siti Nurhaliza', nim: '2105008', major: 'Sistem Informasi', email: 'siti@email.com' },
  { id: 3, name: 'Budi Santoso', nim: '2105009', major: 'Teknik Komputer', email: 'budi@email.com' }
];

let nextId = 4;
let editingIndex = null;

// ====== DOM ELEMENTS ======
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebar = document.getElementById('sidebar');
const navLinks = document.querySelectorAll('.sidebar .nav-link');
const pages = document.querySelectorAll('.page');
const addForm = document.getElementById('addForm');
const editForm = document.getElementById('editForm');
const studentTableBody = document.getElementById('studentTableBody');
const countBadge = document.getElementById('countBadge');

// Bootstrap Modals
const editModalEl = document.getElementById('editModal');
const deleteModalEl = document.getElementById('deleteModal');
const editModal = new bootstrap.Modal(editModalEl);
const deleteModal = new bootstrap.Modal(deleteModalEl);

// ====== SIDEBAR TOGGLE (Mobile) ======
sidebarToggle.addEventListener('click', () => {
  sidebar.classList.toggle('show-mobile');
});

// Close sidebar when clicking outside (mobile)
document.addEventListener('click', (e) => {
  if (window.innerWidth <= 767.98) {
    if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
      sidebar.classList.remove('show-mobile');
    }
  }
});

// ====== PAGE NAVIGATION ======
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const pageToShow = link.dataset.page;

    // Remove active class from all links
    navLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');

    // Hide all pages
    pages.forEach(page => {
      page.classList.add('d-none');
    });

    // Show selected page
    const selectedPage = document.getElementById(`page-${pageToShow}`);
    if (selectedPage) {
      selectedPage.classList.remove('d-none');
    }

    // Close sidebar on mobile after click
    if (window.innerWidth <= 767.98) {
      sidebar.classList.remove('show-mobile');
    }
  });
});

// ====== RENDER TABLE ======
function renderTable() {
  studentTableBody.innerHTML = '';

  if (students.length === 0) {
    studentTableBody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center text-muted py-5">
          <i class="bi bi-inbox" style="font-size: 2rem; opacity: 0.5;"></i>
          <p class="mt-2">Belum ada data mahasiswa</p>
        </td>
      </tr>
    `;
    countBadge.textContent = '0';
    return;
  }

  students.forEach((student, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><strong>#${index + 1}</strong></td>
      <td><strong>${escapeHtml(student.name)}</strong></td>
      <td>${escapeHtml(student.nim)}</td>
      <td>${escapeHtml(student.major)}</td>
      <td>${escapeHtml(student.email)}</td>
      <td>
        <button class="btn btn-sm btn-primary me-1" onclick="openEditModal(${index})">
          <i class="bi bi-pencil-square"></i> Edit
        </button>
        <button class="btn btn-sm btn-danger" onclick="openDeleteModal(${index})">
          <i class="bi bi-trash"></i> Hapus
        </button>
      </td>
    `;
    studentTableBody.appendChild(row);
  });

  countBadge.textContent = students.length;
}

// ====== ESCAPE HTML (Security) ======
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ====== ADD STUDENT ======
addForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const nim = document.getElementById('nim').value.trim();
  const major = document.getElementById('major').value.trim();
  const email = document.getElementById('email').value.trim();

  // Validation
  if (!name || !nim || !major || !email) {
    showAlert('Semua field harus diisi!', 'warning');
    return;
  }

  if (!isValidEmail(email)) {
    showAlert('Email tidak valid!', 'warning');
    return;
  }

  if (nim.length < 7) {
    showAlert('NIM minimal 7 karakter!', 'warning');
    return;
  }

  // Add to array
  students.push({
    id: nextId++,
    name,
    nim,
    major,
    email
  });

  // Reset form
  addForm.reset();
  renderTable();
  showAlert('Data mahasiswa berhasil ditambahkan!', 'success');

  // Navigate to table view
  navLinks[2].click();
});

// ====== VALIDATE EMAIL ======
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// ====== OPEN EDIT MODAL ======
function openEditModal(index) {
  editingIndex = index;
  const student = students[index];

  document.getElementById('editIndex').value = index;
  document.getElementById('editName').value = student.name;
  document.getElementById('editNim').value = student.nim;
  document.getElementById('editMajor').value = student.major;
  document.getElementById('editEmail').value = student.email;

  editModal.show();
}

// ====== SAVE EDIT ======
document.getElementById('saveEditBtn').addEventListener('click', () => {
  const index = parseInt(document.getElementById('editIndex').value);
  const name = document.getElementById('editName').value.trim();
  const nim = document.getElementById('editNim').value.trim();
  const major = document.getElementById('editMajor').value.trim();
  const email = document.getElementById('editEmail').value.trim();

  // Validation
  if (!name || !nim || !major || !email) {
    showAlert('Semua field harus diisi!', 'warning');
    return;
  }

  if (!isValidEmail(email)) {
    showAlert('Email tidak valid!', 'warning');
    return;
  }

  if (nim.length < 7) {
    showAlert('NIM minimal 7 karakter!', 'warning');
    return;
  }

  // Update array
  students[index] = {
    ...students[index],
    name,
    nim,
    major,
    email
  };

  editModal.hide();
  renderTable();
  showAlert('Data mahasiswa berhasil diperbarui!', 'success');
});

// ====== OPEN DELETE MODAL ======
function openDeleteModal(index) {
  editingIndex = index;
  const student = students[index];
  document.getElementById('deleteIndex').value = index;
  
  const deleteText = `Apakah Anda yakin ingin menghapus data <strong>${escapeHtml(student.name)}</strong>?`;
  const deleteBody = deleteModalEl.querySelector('.modal-body');
  deleteBody.innerHTML = deleteText + `<input type="hidden" id="deleteIndex" value="${index}">`;

  deleteModal.show();
}

// ====== CONFIRM DELETE ======
document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
  const index = parseInt(document.getElementById('deleteIndex').value);

  students.splice(index, 1);
  deleteModal.hide();
  renderTable();
  showAlert('Data mahasiswa berhasil dihapus!', 'success');
});

// ====== SHOW ALERT ======
function showAlert(message, type = 'info') {
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
  alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);';
  alertDiv.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;

  document.body.appendChild(alertDiv);

  setTimeout(() => {
    alertDiv.remove();
  }, 4000);
}

// ====== JQUERY USAGE (REQUIRED) ======
$(document).ready(function() {
  // Use jQuery to initialize and add some interactive features
  
  // Add hover effect with jQuery
  $('#studentTableBody').on('mouseenter', 'tr', function() {
    $(this).css('background-color', 'rgba(99, 102, 241, 0.05)');
  }).on('mouseleave', 'tr', function() {
    $(this).css('background-color', '');
  });

  // Sidebar animation with jQuery
  $('#sidebarToggle').on('click', function() {
    $('#sidebar').toggleClass('show-mobile');
  });

  // Add smooth scroll
  $('a[href^="#"]').on('click', function(e) {
    e.preventDefault();
    const target = $(this.getAttribute('href'));
    if (target.length) {
      $('html, body').stop().animate({
        scrollTop: target.offset().top - 100
      }, 500);
    }
  });
});

// ====== INITIAL RENDER ======
renderTable();

// ====== EXPORT DATA (Bonus Feature) ======
window.exportToCSV = function() {
  if (students.length === 0) {
    showAlert('Tidak ada data untuk diekspor!', 'warning');
    return;
  }

  let csv = 'Nama,NIM,Jurusan,Email\n';
  students.forEach(student => {
    csv += `"${student.name}","${student.nim}","${student.major}","${student.email}"\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'data_mahasiswa.csv';
  a.click();
  window.URL.revokeObjectURL(url);

  showAlert('Data berhasil diekspor!', 'success');
};

// ====== PRINT DATA (Bonus Feature) ======
window.printData = function() {
  if (students.length === 0) {
    showAlert('Tidak ada data untuk dicetak!', 'warning');
    return;
  }

  let html = '<h2>Laporan Data Mahasiswa</h2><table border="1" style="border-collapse: collapse; width: 100%;"><tr><th>No</th><th>Nama</th><th>NIM</th><th>Jurusan</th><th>Email</th></tr>';
  students.forEach((student, index) => {
    html += `<tr><td>${index + 1}</td><td>${student.name}</td><td>${student.nim}</td><td>${student.major}</td><td>${student.email}</td></tr>`;
  });
  html += '</table>';

  const printWindow = window.open('', '', 'height=600,width=900');
  printWindow.document.write(html);
  printWindow.print();
};

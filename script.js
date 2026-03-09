const cvForm = document.getElementById('cvForm');
const themeToggle = document.getElementById('themeToggle');
const downloadPdfBtn = document.getElementById('downloadPdf');
const resumePreview = document.getElementById('resumePreview');

const fields = {
  fullName: document.getElementById('previewName'),
  title: document.getElementById('previewTitle'),
  summary: document.getElementById('previewSummary'),
  skills: document.getElementById('previewSkills'),
  website: document.getElementById('previewWebsite'),
};

const listFields = {
  experience: document.getElementById('previewExperience'),
  education: document.getElementById('previewEducation'),
};

const defaults = {
  fullName: 'Your Name',
  title: 'Professional Title',
  summary: 'A short professional summary will appear here.',
  skills: 'Your key skills will appear here.',
  website: 'yourportfolio.com',
  contact: 'email@example.com • +1 555 000 0000 • City, Country',
  experience: ['Your experience highlights will appear here.'],
  education: ['Your education details will appear here.'],
};

function toBulletItems(text, fallback) {
  const items = text
    .split('\n')
    .map((line) => line.replace(/^\s*[•\-*]\s?/, '').trim())
    .filter(Boolean);

  return items.length ? items : fallback;
}

function renderList(node, items) {
  node.innerHTML = items.map((item) => `<li>${item}</li>`).join('');
}

function updatePreview() {
  const formData = new FormData(cvForm);

  Object.keys(fields).forEach((name) => {
    const value = formData.get(name)?.toString().trim();
    fields[name].textContent = value || defaults[name];
  });

  const contactParts = ['email', 'phone', 'location']
    .map((name) => formData.get(name)?.toString().trim())
    .filter(Boolean);

  document.getElementById('previewContact').textContent =
    contactParts.length ? contactParts.join(' • ') : defaults.contact;

  renderList(
    listFields.experience,
    toBulletItems(formData.get('experience')?.toString() || '', defaults.experience),
  );

  renderList(
    listFields.education,
    toBulletItems(formData.get('education')?.toString() || '', defaults.education),
  );
}

cvForm.addEventListener('input', updatePreview);
cvForm.addEventListener('reset', () => setTimeout(updatePreview, 0));

const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  document.documentElement.setAttribute('data-theme', savedTheme);
}

function syncThemeButton() {
  const dark = document.documentElement.getAttribute('data-theme') === 'dark';
  themeToggle.textContent = dark ? '☀️ Light Mode' : '🌙 Dark Mode';
}

syncThemeButton();

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  syncThemeButton();
});

downloadPdfBtn.addEventListener('click', () => {
  const options = {
    margin: 0.2,
    filename: `${fields.fullName.textContent.replace(/\s+/g, '_') || 'resume'}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
  };

  html2pdf().set(options).from(resumePreview).save();
});

updatePreview();

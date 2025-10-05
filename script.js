// script.js for Cotton Candy Moments Photobooth
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const photo = document.getElementById('photo');
const placeholder = document.getElementById('placeholder');
const flash = document.getElementById('camera-flash');
const captureBtn = document.getElementById('capture-btn');
const retakeBtn = document.getElementById('retake-btn');
const downloadBtn = document.getElementById('download-btn');
const filterBtns = document.querySelectorAll('.filter-btn');
const postCaptureControls = document.querySelector('.post-capture-controls');

let currentFilter = 'none';
let stream = null;

// Filter CSS for canvas
const filterStyles = {
    'none': '',
    'pastel-dream': 'contrast(1.1) brightness(1.15) saturate(1.2) hue-rotate(10deg)',
    'sepia-classic': 'sepia(0.7) contrast(1.1) brightness(1.1)',
    'retro-90s': 'contrast(1.2) brightness(1.05) hue-rotate(-20deg) saturate(1.3)',
    'sparkle': '' // Sparkle handled separately
};

function showVideo() {
    video.classList.add('active');
    canvas.classList.remove('active');
    photo.classList.remove('active');
    postCaptureControls.classList.remove('active');
    placeholder.style.display = 'none';
}

function showPhoto() {
    video.classList.remove('active');
    canvas.classList.remove('active');
    photo.classList.add('active');
    postCaptureControls.classList.add('active');
}

function showPlaceholder() {
    video.classList.remove('active');
    canvas.classList.remove('active');
    photo.classList.remove('active');
    postCaptureControls.classList.remove('active');
    placeholder.style.display = 'flex';
}

function applyFilter(ctx, w, h) {
    if (currentFilter === 'sparkle') {
        ctx.filter = filterStyles['none'];
        // Draw sparkle effect
        for (let i = 0; i < 20; i++) {
            const x = Math.random() * w;
            const y = Math.random() * h;
            const r = Math.random() * 8 + 2;
            ctx.save();
            ctx.globalAlpha = 0.5 + Math.random() * 0.5;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, 2 * Math.PI);
            ctx.fillStyle = 'rgba(255,255,255,0.7)';
            ctx.shadowColor = '#fff';
            ctx.shadowBlur = 8;
            ctx.fill();
            ctx.restore();
        }
    } else {
        ctx.filter = filterStyles[currentFilter] || '';
    }
}

function takePhoto() {
    const w = video.videoWidth;
    const h = video.videoHeight;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, w, h);
    applyFilter(ctx, w, h);
    // Camera flash effect
    flash.classList.add('active');
    setTimeout(() => flash.classList.remove('active'), 120);
    // Show photo
    photo.src = canvas.toDataURL('image/png');
    showPhoto();
}

function retakePhoto() {
    showVideo();
}

function downloadPhoto() {
    const link = document.createElement('a');
    link.href = photo.src;
    link.download = 'cotton-candy-moment.png';
    link.click();
}

function setFilter(filter) {
    currentFilter = filter;
    filterBtns.forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.filter-btn[data-filter="${filter}"]`).classList.add('active');
    if (video.classList.contains('active')) {
        video.style.filter = filterStyles[filter] || '';
    }
}

// Event Listeners
captureBtn.addEventListener('click', takePhoto);
retakeBtn.addEventListener('click', retakePhoto);
downloadBtn.addEventListener('click', downloadPhoto);
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => setFilter(btn.dataset.filter));
});

// Camera setup
async function startCamera() {
    try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        video.onloadedmetadata = () => {
            showVideo();
            setFilter('none');
        };
    } catch (err) {
        placeholder.innerHTML = '<p>Gagal mengakses kamera.<br>Pastikan izin kamera sudah diberikan.</p>';
        showPlaceholder();
    }
}

// Hide controls until camera ready
showPlaceholder();
startCamera();

// DOM 元素
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const qualitySlider = document.getElementById('quality');
const qualityValue = document.getElementById('qualityValue');
const originalPreview = document.getElementById('originalPreview');
const compressedPreview = document.getElementById('compressedPreview');
const originalSize = document.getElementById('originalSize');
const compressedSize = document.getElementById('compressedSize');
const downloadBtn = document.getElementById('downloadBtn');

// 当前处理的图片数据
let currentFile = null;

// 事件监听器
dropZone.addEventListener('click', () => fileInput.click());
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = '#1a73e8';
    dropZone.style.background = '#f8f9fa';
});
dropZone.addEventListener('dragleave', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = '#e0e0e0';
    dropZone.style.background = 'white';
});
dropZone.addEventListener('drop', handleDrop);
fileInput.addEventListener('change', handleFileSelect);
qualitySlider.addEventListener('input', handleQualityChange);
downloadBtn.addEventListener('click', handleDownload);

// 处理拖放
function handleDrop(e) {
    e.preventDefault();
    dropZone.style.borderColor = '#e0e0e0';
    dropZone.style.background = 'white';
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        processImage(file);
    }
}

// 处理文件选择
function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
        processImage(file);
    }
}

// 处理质量滑块变化
function handleQualityChange(e) {
    qualityValue.textContent = `${e.target.value}%`;
    if (currentFile) {
        compressImage(currentFile, e.target.value / 100);
    }
}

// 处理图片下载
function handleDownload() {
    const link = document.createElement('a');
    link.download = `compressed_${currentFile.name}`;
    link.href = compressedPreview.src;
    link.click();
}

// 处理图片文件
function processImage(file) {
    currentFile = file;
    
    // 显示原始图片
    const reader = new FileReader();
    reader.onload = (e) => {
        originalPreview.src = e.target.result;
        originalSize.textContent = formatFileSize(file.size);
        
        // 压缩图片
        compressImage(file, qualitySlider.value / 100);
    };
    reader.readAsDataURL(file);
}

// 压缩图片
function compressImage(file, quality) {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    
    img.onload = () => {
        // 创建 canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // 设置 canvas 尺寸
        canvas.width = img.width;
        canvas.height = img.height;
        
        // 绘制图片
        ctx.drawImage(img, 0, 0);
        
        // 压缩并转换为 base64
        const compressedDataUrl = canvas.toDataURL(file.type, quality);
        
        // 显示压缩后的图片
        compressedPreview.src = compressedDataUrl;
        
        // 计算压缩后的大小
        const compressedSize = Math.round((compressedDataUrl.length - 22) * 3 / 4);
        document.getElementById('compressedSize').textContent = formatFileSize(compressedSize);
        
        // 启用下载按钮
        downloadBtn.disabled = false;
        
        // 释放内存
        URL.revokeObjectURL(img.src);
    };
}

// 格式化文件大小
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
} 
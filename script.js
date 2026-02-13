const input = document.getElementById('inputText');
const output = document.getElementById('outputText');
const uploadBox = document.getElementById('uploadBox');
const loading = document.getElementById('loading');
const clearBtn = document.getElementById('clearBtn');

// show checkmark only on selected length
function updateLengthCheck() {
    const select = document.getElementById('length');
    const labels = {
        short: 'Короткий',
        medium: 'Средний',
        long: 'Длинный'
    };
    
    for (let option of select.options) {
        const text = labels[option.value];
        option.textContent = (option.selected ? '✔ ' : '') + text;
    }
    
    // add highlight color to current selection
    
    select.classList.add('highlight');
};

// initialize checkmarks on load
window.addEventListener('DOMContentLoaded', updateLengthCheck);

input.addEventListener('input', () => {
    document.getElementById('inputCount').textContent = 'Слова: ' + input.value.trim().split(/\s+/).filter(Boolean).length;

    if (input.value.length > 0) {
        clearBtn.classList.remove('hidden');
    }
    else {
        clearBtn.classList.add('hidden');
    }
});

function clearInput() {
    input.value = '';
    // Kích hoạt lại sự kiện input để cập nhật đếm từ và ẩn nút X
    input.dispatchEvent(new Event('input'));
    input.focus();
}

function switchTab(tab) {
    const tabText = document.getElementById('tabText');
    const tabFile = document.getElementById('tabFile');
    
    // remove active state
    tabText.classList.remove('active');
    tabFile.classList.remove('active');
    
    if (tab === 'text') {
        // activate TEXT interface
        tabText.classList.add('active');
        input.classList.remove('hidden');
        uploadBox.classList.add('hidden');
        if (input.value.length > 0) clearBtn.classList.remove('hidden');
    }
    else if (tab === 'file') {
        // activate FILE interface
        tabFile.classList.add('active');
        input.classList.add('hidden');
        uploadBox.classList.remove('hidden');
        clearBtn.classList.add('hidden');
    }
}

function startProcessing() {
    loading.style.display = 'flex';
    
    setTimeout(() => {
        output.value = input.value.slice(0, 150);
        document.getElementById('outputCount').textContent = 'Слова: ' + output.value.trim().split(/\s+/).filter(Boolean).length;
        
        loading.style.display = 'none';
    }, 1500);
}

function copyResult() {

    if (!output.value) return;

    navigator.clipboard.writeText(output.value);

    const btn = event.target;
    const originalText = btn.textContent;
    btn.textContent = 'Копирован!';
    setTimeout(() => btn.textContent = originalText, 2000);
}

function downloadResult() {

    if (!output.value) return;

    const blob = new Blob([output.value], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'summary.txt';
    a.click();
}

// FILE UPLOAD -> switch to loading (Interface 3)
document.getElementById('fileInput').addEventListener('change', function() {
    const file = this.files[0];
    
    if (!file) return;
    loading.style.display = 'flex';
    
    const reader = new FileReader();
    reader.onload = e => {
        setTimeout(() => {
            input.value = e.target.result;
            switchTab('text');
            input.dispatchEvent(new Event('input'));
            loading.style.display = 'none';
        }, 1200);
    };
    reader.readAsText(file);
});
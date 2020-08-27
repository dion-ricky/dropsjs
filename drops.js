class Drops {
    uploadPath = null;
    uploadedRef = null;

    uploadTask = null;

    uploading = false;
    uploaded = false;

    storageRef = null;
    
    acceptedFileType = [];
    height = '150px';

    // DOM element references
    dropArea = null;
    fileInput = null;
    innerProgressBar = null;
    uploadPercentageTxt = null;
    uploadStatusTxt = null;

    callback = {
        uploaded = null,
        canceled = null
    }

    icons = {
    compressed: `<svg class="bi bi-file-earmark-zip" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 1h5v1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V6h1v7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2z"/>
                    <path d="M9 4.5V1l5 5h-3.5A1.5 1.5 0 0 1 9 4.5z"/>
                    <path fill-rule="evenodd" d="M5 8.5a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v.938l.4 1.599a1 1 0 0 1-.416 1.074l-.93.62a1 1 0 0 1-1.11 0l-.929-.62a1 1 0 0 1-.415-1.074L5 9.438V8.5zm2 0H6v.938a1 1 0 0 1-.03.243l-.4 1.598.93.62.929-.62-.4-1.598A1 1 0 0 1 7 9.438V8.5z"/>
                    <path d="M6 2h1.5v1H6zM5 3h1.5v1H5zm1 1h1.5v1H6zM5 5h1.5v1H5zm1 1h1.5v1H6V6z"/>
                </svg>`,
    image: `<svg class="bi bi-image" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M14.002 2h-12a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1zm-12-1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12z"/>
                <path d="M10.648 7.646a.5.5 0 0 1 .577-.093L15.002 9.5V14h-14v-2l2.646-2.354a.5.5 0 0 1 .63-.062l2.66 1.773 3.71-3.71z"/>
                <path fill-rule="evenodd" d="M4.502 7a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/>
            </svg>`,
    other: `<svg class="bi bi-file-earmark" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 1h5v1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V6h1v7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2z"/>
                <path d="M9 4.5V1l5 5h-3.5A1.5 1.5 0 0 1 9 4.5z"/>
            </svg>`,
    play: `<svg data-drops-play class="bi bi-play" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M10.804 8L5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z"/>
            </svg>`,
    pause: `<svg data-drops-pause class="bi bi-pause" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M6 3.5a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5zm4 0a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5z"/>
            </svg>`,
    cancel: `<svg data-drops-cancel class="bi bi-x" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M11.854 4.146a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708-.708l7-7a.5.5 0 0 1 .708 0z"/>
                <path fill-rule="evenodd" d="M4.146 4.146a.5.5 0 0 0 0 .708l7 7a.5.5 0 0 0 .708-.708l-7-7a.5.5 0 0 0-.708 0z"/>
            </svg>`
    }

    constructor (options) {

    if (options.el && options.el.toString() === "[object HTMLDivElement]") {
        this.dropArea = options.el;
    } else {
        this.DropsException('Drops Init Error', 'Empty drop area element', 'drops/undefined-drop-area');
    }

    this.acceptedFileType = options.acceptedFileType || [];

    this.hook.upload = options.hook.upload || this.DropsException();

    this.callback.uploaded = options.callback.uploaded || null;
    this.callback.canceled = options.callback.canceled || null;
    // this.callback.error = options.callback.error || null;
    
    this.height = options.height || '150px';

    this.dropsClear();
    this.dropsInit();
    this.dropsFileInputInit();
    this.dropsAddEventListener();

    }

    dropsFileInputInit() {
    this.fileInput = this.dropArea.querySelector("input[data-drops-file-input]");
    this.fileInput.addEventListener('change', function(e) {this.handleClick(e, this)}.bind(this), false);
    }

    dropsInit() {
    let dropArea = this.dropArea;

    dropArea.style.height = this.height;

    dropArea.classList.add("drops");

    dropArea.innerHTML += `<input type="file" name="file" data-drops-file-input hidden>`;

    dropArea.innerHTML += `
        <div class="inner-line"></div>
    `;

    dropArea.querySelector("div[class='inner-line']")
    .innerHTML += `
        <div class="message">
            <svg class="bi bi-upload" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M.5 8a.5.5 0 0 1 .5.5V12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8.5a.5.5 0 0 1 1 0V12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V8.5A.5.5 0 0 1 .5 8zM5 4.854a.5.5 0 0 0 .707 0L8 2.56l2.293 2.293A.5.5 0 1 0 11 4.146L8.354 1.5a.5.5 0 0 0-.708 0L5 4.146a.5.5 0 0 0 0 .708z"/>
            <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0v-8A.5.5 0 0 1 8 2z"/>
            </svg>
            <span>Click or drop file here to upload!</span>
        </div>
    `;
    }

    dropsAddEventListener() {
    let dropArea = this.dropArea;

    dropArea.addEventListener('click', this.dropsClick);

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, this.preventDefaults, false);
    });

    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, this.highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, this.unhighlight, false);
    });

    dropArea.addEventListener('drop', function(e) {this.handleDrop(e, this)}.bind(this), false);

    }

    dropsClick(e) {
    let _i = this.querySelector("input[data-drops-file-input]");
        _i.click();
    }

    dropsClear() {
    this.dropArea.innerHTML = "";
    }

    dropsReinit() {
    let drops = this;

    drops.uploaded = false;
    drops.uploading = false;

    drops.dropsClear();
    drops.dropsInit();
    drops.dropsFileInputInit();
    
    setTimeout(() => {
        drops.dropArea.addEventListener('click', drops.dropsClick);
    }, 0);
    }

    dropsCancel(e = null, drops = null) {
    if (this && !drops) {
        drops = this;
    }

    if (drops.uploaded) {
        // delete file from bucket
        drops.uploadedRef.delete().then(function() {
        drops.dropsReinit();
        }).catch(err => {
        drops.DropsException('Drops Delete Error', err.message, err.code);
        });
    } else {
        // cancel upload 
        drops.uploadTask.cancel();
        drops.dropsReinit();
    }

    if (drops.canceledCallback) {
        drops.canceledCallback(drops);
    }
    }

    highlight(e) {
    this.classList.add("highlight");
    }

    unhighlight(e) {
    this.classList.remove("highlight");
    }

    preventDefaults (e) {
    e.preventDefault();
    e.stopPropagation();
    }

    handleDrop(e, drops) {
    let dt = e.dataTransfer;
    let files = dt.files;

    if (files.length > 1) {
        app.newNotif('Max 1 file', 'Cannot upload more than 1 file at a time!', 'upload/max-file-exceeded', 'error');
        return;
    }

    drops.handleFile(files.item(0));
    }

    handleClick(e, drops) {
    let fileInput = drops.fileInput;

    drops.handleFile(fileInput.files.item(0));
    }

    handleFile(file) {
    if (this.acceptedFileType.length !== 0) {
        if (!this.acceptedFileType.includes(file.type)) {
        this.DropsException('Drops File Error', 'Invalid file type: accepted ' + this.acceptedFileType.join(', ') + ' given ' + file.type, 'drops/illegal-file-type');
        }
    }

    let dropArea = this.dropArea;
    let icons = this.icons;

    dropArea.removeEventListener('click', this.dropsClick);

    dropArea.innerHTML = `
        <div class="file-uploaded">
        <div class="file-icon mr-3">
            
        </div>
        <div class="file-upload-info">
            
            <div class="file-info mb-2">
            <span class="file-name mr-4">filename</span>
            <div class="file-upload-operation"></div>
            </div>

            <div class="file-progress-bar file-progress-bar-outter">
            <div class="file-progress-bar file-progress-bar-inner"></div>
            </div>

            <div style="font-size: .7rem; color: #666;">
            <span  data-drops-upload-percentage>0</span><span>% · </span><span data-drops-status-text>Uploading ...</span>
            </div>
        </div>
        </div>
    `;

    this.uploadPercentageTxt = dropArea.querySelector("[data-drops-upload-percentage]");
    this.uploadStatusTxt = dropArea.querySelector("[data-drops-status-text]");

    let fileUploadOp = dropArea.querySelector("div[class='file-upload-operation']");
    fileUploadOp.innerHTML += icons.play;
    fileUploadOp.innerHTML += icons.pause;
    fileUploadOp.innerHTML += icons.cancel;

    let fileIcon = dropArea.querySelector("div[class*='file-icon']");
    let icon = icons.other;

    switch(file.type) {
        case 'image/png':
        case 'image/jpeg':
        case 'image/svg+xml':
        icon = icons.image;
        break;
        case 'application/x-rar-compressed':
        case 'application/zip':
        case 'application/x-zip-compressed':
        case 'multipart/x-zip':
        icon = icons.compressed;
        break;
    }

    fileIcon.innerHTML = icon;

    let fileName = dropArea.querySelector("span[class*='file-name']");
    fileName.innerHTML = file.name.substr(0, 25) + (file.name.length > 25 ? ' ...' : '');

    let play = dropArea.querySelector("svg[data-drops-play]");
    let pause = dropArea.querySelector("svg[data-drops-pause]");
    let cancel = dropArea.querySelector("svg[data-drops-cancel]");

    play.style.display = 'none';

    let drops = this;

    play.addEventListener('click', function(e) {
        if (drops.uploaded) {
        // do nothing
        } else {
        drops.uploadTask.resume();
        pause.style.display = 'inline';
        play.style.display = 'none';
        }
    });

    pause.addEventListener('click', function(e) {
        if (drops.uploaded) {
        // do nothing
        } else {
        drops.uploadTask.pause();
        pause.style.display = 'none';
        play.style.display = 'inline';
        }
    });

    cancel.addEventListener('click', function(e) {
        drops.dropsCancel(e, drops);
    });

    setTimeout(function() {
        drops.innerProgressBar = drops.dropArea.querySelector("div[class*='file-progress-bar-inner']");
        
        drops.upload(drops.uploadPath, file);
    });
    }

    upload(path, file) {
    const drops = this;
    var fileName = btoa( file.name + String.fromCharCode(getRndInteger(122, 65)) ) + '.' + file.name.split('.').pop();
    var uploadTask = drops.storageRef.child(path + fileName).put(file);

    drops.uploadTask = uploadTask;

    // Register three observers:
    // 1. 'state_changed' observer, called any time the state changes
    // 2. Error observer, called on failure
    // 3. Completion observer, called on successful completion
    uploadTask.on('state_changed', function(snapshot){
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        drops.innerProgressBar.classList.remove('paused');
        drops.innerProgressBar.classList.remove('finished');
        drops.innerProgressBar.style.width = Math.floor(progress) + "%";
        drops.uploadPercentageTxt.innerHTML = Math.floor(progress);

        switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED: // or 'paused'
            drops.uploading = false;
            drops.innerProgressBar.classList.add('paused');
            drops.uploadStatusTxt.classList.remove('file-uploading');
            drops.uploadStatusTxt.innerHTML = 'Paused';
            break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
            drops.uploading = true;
            drops.uploadStatusTxt.classList.add('file-uploading');
            drops.uploadStatusTxt.innerHTML = 'Uploading ...';
            break;
        }
    }, function(error) {
        // Handle unsuccessful uploads
        drops.dropsCancel();
        drops.DropsException('Drops Upload Error', error.message, error.code, 'error');
    }, function() {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...

        drops.uploading = false;
        drops.uploaded = true;
        drops.uploadedRef = uploadTask.snapshot.ref;
        drops.innerProgressBar.classList.add('finished');
        drops.uploadStatusTxt.classList.remove('file-uploading');
        drops.uploadStatusTxt.innerHTML = 'Uploaded';

        uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
        drops.uploadedUrl = downloadURL;
        })
        .catch(function (err) {
        drops.DropsException('Drops Download URL Error', err.message, err.code);
        });

        if (drops.uploadedCallback) {
        drops.uploadedCallback(drops);
        }
    });
    }

    DropsException(title, message, code) {
        throw new Error(message);
    }
}
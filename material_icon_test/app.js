const data = [
  {
    'folder': true,
    'title': 'NewNewPictures',
    'children': [
      {
        'title': 'logo.png'
      },
      {
        'folder': true,
        'title': 'Vacations',
        'children': [
          {
            'title': 'spain.jpeg'
          }
        ]
      }
    ]
  },
  {
    'folder': true,
    'title': 'NewPictures',
    'children': [
      {
        'title': 'logo.png'
      },
      {
        'folder': true,
        'title': 'Vacations',
        'children': [
          {
            'title': 'spain.jpeg'
          }
        ]
      }
    ]
  },
  {
    'folder': true,
    'title': 'Pictures',
    'children': [
      {
        'title': 'logo.png'
      },
      {
        'folder': true,
        'title': 'Vacations',
        'children': [
          {
            'title': 'spain.jpeg'
          }
        ]
      }
    ]
  },
  {
    'folder': true,
    'title': 'Desktop',
    'children': [
      {
        'folder': true,
        'title': 'screenshots',
        'children': null
      }
    ]
  },
  {
    'folder': true,
    'title': 'Downloads',
    'children': [
      {
        'folder': true,
        'title': 'JS',
        'children': null
      },
      {
        'title': 'nvm-setup.exe'
      },
      {
        'title': 'node.exe'
      }
    ]
  },
  {
    'title': 'credentials.txt'
  }
];

const rootNode = document.getElementById('root');

class FileSystemElement {
  constructor(title) {
    this.parent = null;
    this.children = [];
    this.title = title;
    this.isFileSystemElement = true;
    this.iconElement = document.createElement('i');
    this.titleElement = document.createElement('span');
    this.titleElement.classList.add('fileNodeDescription');
    this.titleElement.innerText = this.title;
    this.fileNode = document.createElement('div');
    this.fileNode.classList.add('fileNode');
    this.fileNode.appendChild(this.iconElement);
    this.fileNode.appendChild(this.titleElement);

    this.container = document.createElement('div');
    this.container.classList.add('container');
    this.container.appendChild(this.fileNode);

    this.getTitle = () => this.title;
  }
  rename() {
    const inputElement = document.createElement('input');
    inputElement.addEventListener('blur', ({target}) => {
      this.titleElement.innerText = target.value;
      this.title = target.value;
      this.fileNode.replaceChild(this.titleElement,target);
    });
    inputElement.setAttribute('type','text');
    inputElement.setAttribute('autofocus','true');
    inputElement.classList.add('fileNodeDescription');
    inputElement.defaultValue = this.getTitle();
    this.fileNode.replaceChild(inputElement,this.titleElement);
    inputElement.select();
    inputElement.setSelectionRange(0, inputElement.defaultValue.split('.')[0].length);
  }
  remove() {
    console.info('Try remove ', this.getTitle());
    if(this.children) {
      this.children.forEach((child) => {
        child.remove();
      })
    }
    this.fileNode.remove();
    if(this.parent) {
      this.parent.children = this.parent.children.filter(el => el !== this);
      this.parent.render();
    }
  }
  show() {
    this.container.classList.remove('contentHidden');
  }
  hide() {
    this.container.classList.add('contentHidden');
  }
  addEventListener(event, listener) {
    this.fileNode.addEventListener(event,listener.bind(this));
  }
  setAttribute(key, value) {
    this.fileNode.setAttribute(key,value);
  }
  render() {
    if(this.children.length > 0) {
      this.children.forEach(el => {
        this.container.appendChild(el.render());
      });
    }
    return this.container;
  }
}

class FileElement extends FileSystemElement {
  constructor(title) {
    super(title);
    this.iconElement.classList.add('material-icons','fileIcon');
    this.iconElement.textContent = 'insert_drive_file';
  }
}

class FolderElement extends FileSystemElement {
  constructor(title, children = []) {
    super(title);
    this.iconElement.classList.add('material-icons','folderIcon');
    this.iconElement.textContent = 'folder';
    this.children = []; /*Array of FileSystemElements*/
    children.forEach(child => {
      if(child.isFileSystemElement) {
        child.hide();
        child.parent = this;
        this.children.push(child);
      } else {
        console.warn('Warning child is incorrect type');
      }
    });
  }

  isOpen() {
    return this.iconElement.textContent === 'folder_open';
  }

  open() {
    this.iconElement.textContent = 'folder_open';
    this.children.forEach(el => el.show());
  }

  close() {
    this.iconElement.textContent = 'folder';
    this.children.forEach(el => el.hide());
  }

  render() {
    if(!this.children.length) {
      const emptyFolder = new FileSystemElement('Folder is empty');
      emptyFolder.hide();
      emptyFolder.setAttribute('style','font-style:italic;');
      emptyFolder.parent = this;
      this.children.push(emptyFolder);
    }
    return super.render();
  }
}

class ContextMenu {
  constructor() {
    this.container = document.createElement('div');
    this.container.classList.add('contextMenu');
    this.rename = document.createElement('p');
    this.rename.classList.add('contextMenuItems');
    this.rename.innerText = 'Rename';
    this.del = document.createElement('p');
    this.del.classList.add('contextMenuItems');
    this.del.innerText = 'Delete';
    this.container.appendChild(this.rename);
    this.container.appendChild(this.del);
  }
    
  _closeListener(e) {
    e.preventDefault();
    if(
        !e.target.classList.contains('active') && 
         e.target.parentElement &&
        !e.target.parentElement.classList.contains('active')
      ){
        console.debug(e);
        this.hide();
    }
  }

  open(event,onRenameHandler,onDeleteHandler) {
    if(this.container.classList.contains('active')) {
      this.hide();
    }
    this._closeListener = this._closeListener.bind(this);
    document.addEventListener('click', this._closeListener);
    this.container.classList.add('active');
    this.container.setAttribute('style', `top:${event.clientY}px;legft:${event.clientX}px`)
    this.rename.onclick = (e) => {
      e.stopPropagation();
      this.hide(); 
      onRenameHandler();
    }
    this.del.onclick = (e) => {
      e.stopPropagation();
      this.hide(); 
      onDeleteHandler();
    }
    event.target.appendChild(this.container);
  }

  hide() {
    console.log('Hide context menu');
    this.container.classList.remove('active');
    document.removeEventListener('click',this._closeListener);
  }
}

let contextMenu = new ContextMenu();

function buildElementStruct(element) {
  let children = [];
  let res = {};
  if(element.children) {
    children = element.children.map(child => buildElementStruct(child));
  }
  if(element.folder) {
    const folder = new FolderElement(element.title, children);
    folder.addEventListener('click', e => {
      e.preventDefault();
      if(folder.isOpen()) {
        folder.close();
      } else {
        folder.open();
      }
    });
    res = folder; 
  } else {
    res = new FileElement(element.title);
  }
  res.addEventListener('contextmenu', e => {
    e.preventDefault();
    contextMenu.open(e, res.rename.bind(res), res.remove.bind(res));
  });
  return res;
}

function createDOM(data, rootElement) {
  data.forEach(el => rootElement.appendChild(buildElementStruct(el).render()));
  const paragraph = document.createElement('p');
  paragraph.classList.add('blue');
  paragraph.setAttribute('style','background-color:yellow');
  paragraph.textContent = 'Hello world';
  rootElement.appendChild(paragraph);
  setTimeout(() => {
    paragraph.classList.remove('blue');
  },10000);
  setTimeout(() => {
    paragraph.remove();
  },20000);
  
}

createDOM(data, rootNode);

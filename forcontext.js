const ContextMenuExampleItem = {
    type: 'option',
    text: "Button",
    checked: false,
    hidden: false,
    onclick: () => void(0),
    items: []
};

ContextMenuExampleItem.items.push(ContextMenuExampleItem);

let ContextMenu = function ContextMenu (items=[{
    type: 'option',
    text: "Button",
    checked: false,
    hidden: false,
    onclick: () => void(0),
    items: [ ContextMenuExampleItem ]
}]) {
    if(!(this instanceof ContextMenu)) return new ContextMenu(items);
    this.items = items;
    const cover = this.__cover__ = document.createElement('div');
    cover.className = 'context-menu-cover';
    cover.style.display = 'none';
    document.body.appendChild(cover);
    const div = this.__menu__ = document.createElement('div');
    div.style.opacity = '0';
    div.className = 'context-menu';
    cover.appendChild(div);
    cover.onclick = cover.oncontextmenu = cover.onwheel = cover.onscroll = cover.ondrop = event => {
        event.preventDefault();
        this.close();
        window.removeEventListener('blur', cover.onclick);
    };
    div.onwheel = div.onscroll = event => event.stopImmediatePropagation();
    cover.onmousedown = event => { event.preventDefault() };
    cover.ontouchstart = event => { event.preventDefault() };
    this.updateItems();
};

ContextMenu.Active = null;

ContextMenu.prototype.show = function (options={
    x: 0,
    y: 0
}) {
    if(ContextMenu.Active) return false;
    ContextMenu.Active = this;
    window.addEventListener('blur', this.__cover__.onclick);
    this.__cover__.style.display = '';
    if(options.x < window.innerWidth/2) {
        this.__menu__.style.left = options.x+'px';
        this.__menu__.style.right = '';
    } else {
        this.__menu__.style.right = (window.innerWidth-options.x)+'px';
        this.__menu__.style.left = '';
    }
    if(options.y < window.innerHeight/2) {
        this.__menu__.style.top = options.y+'px';
        this.__menu__.style.bottom = '';
    } else {
        this.__menu__.style.bottom = (window.innerHeight-options.y)+'px';
        this.__menu__.style.top = '';
    }
    setTimeout(() => this.__menu__.style.opacity = '1.0', 10);
};

ContextMenu.prototype.close = function () {
    if(!ContextMenu.Active == this) return false;
    ContextMenu.Active = null;
    this.__menu__.style.opacity = '0';
    setTimeout(() => this.__cover__.style.display = 'none', 325);
};

ContextMenu.prototype.updateItems = function () {
    this.__menu__.innerText = '';
    this.items.forEach(item => {
        const elem = document.createElement('div');
        elem.className = item.type === 'separator' ? 'context-menu-separator' : 'context-menu-item';
        if(item.type != 'separator') {
            elem.innerText = item.text;
            if(item.type === 'checkbox') {
                if(item.checked) elem.classList.add('context-menu-checked');
                elem.onclick = elem.oncontextmenu = () => {
                    item.checked = !item.checked;
                    elem.className = 'context-menu-item' + (item.checked ? ' context-menu-checked' : '');
                    item.onclick({ checked: item.checked });
                };
            } else if(item.type === 'folder') {
                elem.onclick = elem.oncontextmenu = event => event.preventDefault(),event.stopImmediatePropagation();
            } else {
                elem.onclick = elem.oncontextmenu = () => {
                    item.onclick();
                };
            }
        }
        this.__menu__.appendChild(elem);
    });
};

if(typeof module != 'undefined') { module.exports = ContextMenu };

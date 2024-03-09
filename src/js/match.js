// Info:
//     document = DOM de la web
//     chrome = SI definido

window.addEventListener('load', e => {

    addButton();
    addModal();
    loadBigProductos();
    addModalButton();
});

function addButton() {

    var addButton = document.createElement('button');
    addButton.textContent = 'Agregar Producto';
    addButton.style.position = 'fixed';
    addButton.style.top = '10px';
    addButton.style.right = '10px';
    addButton.style.zIndex = '9999';

    addButton.addEventListener('click', e => {
        updateProducts();
    });

    document.body.appendChild(addButton);
}

function addModalButton() {

    var addButton = document.createElement('button');
    addButton.textContent = 'Modal';
    addButton.style.position = 'fixed';
    addButton.style.top = '44px';
    addButton.style.right = '10px';
    addButton.style.zIndex = '9999';

    addButton.addEventListener('click', e => {
        openModal();
    });

    document.body.appendChild(addButton);
}

function addModal() {

    let modal = document.createElement('div');
    modal.id = 'hisham-modal-cosmetica';
    modal.className = 'mi-modal';
    let windowDiv = document.createElement('div');
    windowDiv.className = 'window';
    let list = document.createElement('ul');
    list.id = 'product-list-big';
    list.className = 'product-list product-list-big';

    windowDiv.appendChild(list);
    modal.appendChild(windowDiv);
    document.body.appendChild(modal);

    insertCss();
}

function updateProducts() {

    chrome.storage.local.get('productos', function (result) {
        let productos;
        try {
            let storage = result.productos;
            productos = JSON.parse(storage ?? '[]');
        } catch (e) {
            productos = [];
        }

        productos.push(getProductByScrap());

        chrome.storage.local.set({ 'productos': JSON.stringify(productos) }, function () {

        });
    });
}


function getProductByScrap() {

    let img = document.querySelector('img[data-image-medium-src]');
    let title = document.querySelector('h1[class="h1"][itemprop="name"]');
    let price = document.querySelector('span[class="h5"][itemprop="price"]');
    let brand = document.querySelector('div.soy_marca');
    let type = document.querySelector('span[class="h5"][itemprop="price"]');

    return {
        "img": img.dataset.imageMediumSrc,
        "title": title.textContent.trim(),
        "price": price.getAttribute('content'),
        "reviews": '',
        "brand": brand.textContent.trim(),
        "type": '',
    };
}

function openModal() {

    let modal = document.querySelector('#hisham-modal-cosmetica');
    modal.classList.toggle('show');
}

function insertCss() {

    let cssContent = `
    .mi-modal ,
    .mi-modal * {
        margin:0;
        padding:0;
        box-sizing:border-box;
        font-family:sans-serif;
        font-size:16px;
    }


    .mi-modal {
        opacity:0;
        visibility:hidden;
        background:rgba(0, 0, 0, 0.7);
        position:fixed;
        z-index:999;
        top:0;
        left:0;
        width:100vw;
        height:100vh;
        display:flex;
    }
    .mi-modal.show {
        opacity:1;
        visibility:visible;
    }
    .mi-modal .window {
        width:80%;
        height:80%;
        background:#fff;
        border-radius:10px;
        margin:auto;
        overflow-x:hidden;
        overflow-y:auto;
    }
    ul.product-list-big {
        list-style:none;
    }
    ul.product-list-big .mi-fila {
        width:100%;
        --gap: 20px;
        padding:20px;
        display:grid;
        gap:var(--gap);
        grid-template-columns: repeat(8, calc( calc( 100% - calc( var(--gap) * calc(8 - 1) ) ) / 8 ));
    }
    ul.product-list-big li {
        border-radius:5px;
        border:1px solid transparent;
        opacity:.6;
    }
    ul.product-list-big li.product-favourite {
        border-color:blue;
        opacity:1;
    }
    ul.product-list-big li.hidra {
        background:#82bd8230;
    }
    ul.product-list-big li.limpia {
        background:#828fbd30;
    }
    ul.product-list-big li.serum {
        background:#bd828230;
    }
    ul.product-list-big li.ojos {
        background:#a4705030;
    }
    
    
    ul.product-list-big li > * {
        display:block;
        margin-right:10px;
        width:100%;
    }
    ul.product-list-big li img {
        width:100%;
        aspect-ratio:3/2;
        object-fit:contain;
        filter:brightness(1.1);
        mix-blend-mode:multiply;
    }
    .producto-titulo {
        width:40%;
        height:25px;
        line-height:25px;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
    }
    .producto-input {
        border:0;
    }
    .producto-precio {
        line-height:25px;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
    }
    .producto-brand {
        line-height:25px;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
    }
    `;
    let styles = document.createElement('style');
    styles.innerHTML = cssContent;
    document.body.appendChild(styles);
}

function loadBigProductos() {

    let productList = document.getElementById('product-list-big');
    productList.innerHTML = '';
    chrome.storage.local.get('productos', function (result) {

        let productos;
        try {
            let storage = result.productos;
            productos = JSON.parse(storage ?? '[]');
        } catch (e) {
            productos = [];
        }

        productos.sort((a, b) => (a.reviews > b.reviews) ? -1 : 1)

        let productosByType = {};
        productos.forEach(product => {
            if (!productosByType[product.type]) {
                productosByType[product.type] = [];
            }

            productosByType[product.type].push(product);
        });

        for (let type in productosByType) {

            let prods = productosByType[type];
            let miniList = document.createElement('div');
            miniList.classList.add('mi-fila');

            prods.forEach((product, i) => {
                let li = document.createElement('li');
                li.id = `producto-${i}`;
                li.className = product.type;
                li.addEventListener('click', toggleFavourite);

                let img = document.createElement('img');
                let pTitle = document.createElement('p');
                let pPrice = document.createElement('p');
                let pBrand = document.createElement('p');

                pTitle.className = 'producto-titulo';
                pPrice.className = 'producto-precio';
                pBrand.className = 'producto-brand';

                img.src = product.img;
                pTitle.innerHTML = product.title;
                pPrice.innerHTML = product.price + '€ / ' + product.reviews + ' opiniones';
                pBrand.innerHTML = product.brand + ' / ' + product.type;

                li.appendChild(img);
                li.appendChild(pTitle);
                li.appendChild(pPrice);
                li.appendChild(pBrand);
                miniList.appendChild(li);
            });
            productList.appendChild(miniList);

        }
    });
}

function toggleFavourite(e) {

    let li = e.currentTarget;
    li.classList.toggle('product-favourite')
}
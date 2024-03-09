

// Info:
//     document = DOM de la extension
//     chrome = SI definido


document.addEventListener('DOMContentLoaded', function () {
    let button = document.querySelector('#boton-limpiar');
    button.addEventListener('click', cleanProductos);

    loadProductos();
});

function loadProductos() {

    let productList = document.getElementById('product-list');
    productList.innerHTML = '';
    chrome.storage.local.get('productos', function (result) {

        let productos;
        try {
            let storage = result.productos;
            productos = JSON.parse(storage ?? '[]');
        } catch (e) {
            productos = [];
        }

        productos.forEach((product, i) => {
            let li = document.createElement('li');
            li.id = `producto-${i}`;
            li.className = product.type;

            let img = document.createElement('img');
            let pTitle = document.createElement('p');
            let pPrice = document.createElement('p');
            let inputReviews = document.createElement('input');
            let pBrand = document.createElement('p');
            let inputType = document.createElement('input');

            pTitle.className = 'producto-titulo';
            pPrice.className = 'producto-precio';
            pBrand.className = 'producto-brand';
            inputReviews.className = 'producto-input';
            inputReviews.dataset.id = i;
            inputReviews.placeholder = "Reviews";
            inputType.className = 'producto-input';
            inputType.dataset.id = i;
            inputType.placeholder = "Tipo";

            img.src = product.img;
            pTitle.innerHTML = product.title;
            pPrice.innerHTML = product.price;
            inputReviews.value = product.reviews;
            pBrand.innerHTML = product.brand;
            inputType.value = product.type;

            inputReviews.addEventListener('change', modifyReviews);
            inputType.addEventListener('change', modifyType);

            li.appendChild(img);
            li.appendChild(pTitle);
            li.appendChild(pPrice);
            li.appendChild(inputReviews);
            li.appendChild(pBrand);
            li.appendChild(inputType);
            productList.appendChild(li);
        });
    });
}

function cleanProductos() {

    chrome.storage.local.set({ 'productos': '[]' }, function () {
        loadProductos();
    });
}

function modifyReviews(e) {
    let input = e.currentTarget;
    let reviews = parseInt(input.value);
    let id = input.dataset.id;

    chrome.storage.local.get('productos', function (result) {
        let productos;
        try {
            let storage = result.productos;
            productos = JSON.parse(storage ?? '[]');
        } catch (e) {
            productos = [];
        }

        productos[id]['reviews'] = reviews;

        chrome.storage.local.set({ 'productos': JSON.stringify(productos) }, function () { });
    });
}

function modifyType(e) {
    let input = e.currentTarget;
    let type = input.value;
    let id = input.dataset.id;

    chrome.storage.local.get('productos', function (result) {
        let productos;
        try {
            let storage = result.productos;
            productos = JSON.parse(storage ?? '[]');
        } catch (e) {
            productos = [];
        }

        productos[id]['type'] = type;

        chrome.storage.local.set({ 'productos': JSON.stringify(productos) }, function () { });
    });
}

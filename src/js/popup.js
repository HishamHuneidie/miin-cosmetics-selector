

// Info:
//     document = Extension's DOM
//     chrome = Defined


document.addEventListener('DOMContentLoaded', function () {
    let button = document.querySelector('#button-clean');
    button.addEventListener('click', cleanProducts);

    loadProducts();
});

function loadProducts() {

    let productList = document.getElementById('product-list');
    productList.innerHTML = '';
    chrome.storage.local.get('products', function (result) {

        let products;
        try {
            let storage = result.products;
            products = JSON.parse(storage ?? '[]');
        } catch (e) {
            products = [];
        }

        products.forEach((product, i) => {
            let li = document.createElement('li');
            li.id = `product-${i}`;
            li.dataset.id = i;
            li.className = product.type;
            li.addEventListener('dblclick', removeProduct);

            let img = document.createElement('img');
            let pTitle = document.createElement('p');
            let pPrice = document.createElement('p');
            let inputReviews = document.createElement('input');
            let pBrand = document.createElement('p');
            let inputType = document.createElement('input');

            pTitle.className = 'product-title';
            pPrice.className = 'product-price';
            pBrand.className = 'product-brand';
            inputReviews.className = 'product-input';
            inputReviews.dataset.id = i;
            inputReviews.placeholder = "Reviews";
            inputType.className = 'product-input';
            inputType.dataset.id = i;
            inputType.placeholder = "Type";

            img.src = product.img;
            pTitle.innerHTML = product.title;
            pPrice.innerHTML = product.price;
            inputReviews.value = product.reviews;
            pBrand.innerHTML = product.brand;
            inputType.value = product.type;

            inputReviews.addEventListener('change', e => {
                modifyProduct(e, "reviews");
            });
            inputType.addEventListener('change', e => {
                modifyProduct(e, "type");
            });

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

function cleanProducts() {

    chrome.storage.local.set({ 'products': '[]' }, function () {
        loadProducts();
    });
}

function modifyProduct(e, optionName) {
    let input = e.currentTarget;
    let id = input.dataset.id;

    chrome.storage.local.get('products', function (result) {
        let products;
        try {
            let storage = result.products;
            products = JSON.parse(storage ?? '[]');
        } catch (e) {
            products = [];
        }

        products[id][optionName] = input.value;

        chrome.storage.local.set({ 'products': JSON.stringify(products) }, function () { });
    });
}

function removeProduct(e) {
    
    let li = e.currentTarget;
    let id = li.dataset.id;
    chrome.storage.local.get('products', function (result) {
        let products;
        try {
            let storage = result.products;
            products = JSON.parse(storage ?? '[]');
        } catch (e) {
            products = [];
        }

        let newProductList = [];
        products.forEach( (product, i) => {
            if ( i != id ) {
                newProductList.push(product);
            }
        });

        chrome.storage.local.set({ 'products': JSON.stringify(newProductList) }, function () {
            loadProducts();
        });
    });
}
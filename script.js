// CÓDIGO FINAL Y FUNCIONAL (script.js)

// ===================================================================
// 1. DATA Y ESTADO GLOBAL
// ===================================================================

const menuData = {
    Hamburguesas: [
        { nombre: "PIZZABURGER 🍕", precio: 135.00, descripcion: "PEPERONI, QUESO POR TODOS LADOS, 1 CARNE DE RES, SALSA DE TOMATE." },
        { nombre: "HAMBURGUESA RES 🐂 (Clásica)", precio: 90.00, descripcion: "Carne de res, pan artesanal, queso, jamón, lechuga, jitomate y cebolla caramelizada." },
        { nombre: "LA GRILL 🥓", precio: 90.00, descripcion: "Carne arrachera, pan artesanal, queso chedar, triple tocino, lechuga y jitomate." },
        { nombre: "LA ESTELAR 🌟 (LA DE LA CASA)", precio: 125.00, descripcion: "Costra de queso mozzarella, doble carne de arrachera, salchicha roja, cebolla caramelizada." },
        { nombre: "CRISPY CHICKEN 🔥", precio: 89.00, descripcion: "Doble nugget de pollo, queso americano, lechuga, jitomate y cebolla caramelizada." },
        { nombre: "LA SUPER BEEF 🧀", precio: 116.00, descripcion: "Doble capa de carne sirloin, queso cheedar, tocino, lechuga y jitomate." },
        { nombre: "Hamburguesa De TIRAS DE POLLO 🍗", precio: 119.00, descripcion: "Tiras de pollo bañadas en salsa red hot, mayonesa, queso cheedar derretido y tocino." }
    ],
    Alitas: [
        { nombre: "Alitas 230GR 🍗", precio: 140.00, descripcion: "Alitas sazonadas en casa, crujientes, con la salsa de tu elección." },
        { nombre: "1/2KG DE ALITAS 🍗", precio: 250.00, descripcion: "Alitas sazonadas en casa, crujientes, con la salsa de tu elección." },
        { nombre: "1KG ALITAS 🍗", precio: 370.00, descripcion: "Alitas sazonadas en casa, crujientes, con la salsa de tu elección." }
    ],
    Boneless: [
        { nombre: "Boneless 200 Gr.", precio: 150.00, descripcion: "Aproximadamente 5-7 piezas con la salsa de tu elección." },
        { nombre: "Boneless 400 Gr.", precio: 280.00, descripcion: "Aproximadamente 9-11 piezas con la salsa de tu elección." },
        { nombre: "Boneless 1 Kg.", precio: 560.00, descripcion: "Para compartir. Boneless en tu salsa favorita." }
    ],
    "Tiras Crunchy": [
        { nombre: "5 Tiras de Pollo Crunchy", precio: 99.00, descripcion: "Perfectas para una entrada o snack." },
        { nombre: "7 Tiras de Pollo Crunchy", precio: 138.00, descripcion: "Porción regular de tiras de pollo empanizadas." },
        { nombre: "10 Tiras de Pollo Crunchy", precio: 209.00, descripcion: "Ideal para compartir." }
    ],
    Complementos: [
        { nombre: "Papas A La Francesa (200 Gr)", precio: 120.00, descripcion: "Clásicas y crujientes." },
        { nombre: "Dedos De Queso (5pz)", precio: 130.00, descripcion: "Mozzarella sticks con aderezo ranch." },
        { nombre: "Popper's (5pz)", precio: 130.00, descripcion: "Chiles jalapeños rellenos de queso crema." }
    ],
    Platillos: [
        { nombre: "HOT DOG ESPECIAL 🌭", precio: 117.00, descripcion: "Salchicha jumbo rellena con queso, envuelta en tocino, cebolla caramelizada y papas." },
        { nombre: "Chicken & Fries", precio: 198.00, descripcion: "Tiras de pollo en salsa búfalo y ranch sobre una cama de papas con queso amarillo y tocino." }
    ]
};

const salsasDisponibles = [
    "Mango Habanero",
    "BBQ Habanero",
    "Piña Hot",
    "Buffalo",
    "Tamarindo",
    "Naturales"
];

let carrito = [];
let selectedProduct = null;
let currentService = 'Domicilio'; 


// ===================================================================
// 2. REFERENCIAS A ELEMENTOS DEL DOM
// ===================================================================

const cartModal = document.getElementById('cart-modal');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalSpan = document.getElementById('cart-total');
const cartButton = document.querySelector('.cart-floating');
const closeModalButton = document.querySelector('#cart-modal .close-button');
const serviceDisplay = document.getElementById('selected-service-display');

const optionsModal = document.getElementById('options-modal');
const closeOptionsButton = document.getElementById('close-options-modal');
const addToCartWithOptionsButton = document.getElementById('add-to-cart-with-options');

const deliveryBtn = document.getElementById('delivery-btn');
const pickupBtn = document.getElementById('pickup-btn');
const serviceButtons = document.querySelectorAll('.service-btn');

const closedModal = document.getElementById('closed-modal');
const closeClosedModalBtn = document.getElementById('close-closed-modal');

const checkoutModal = document.getElementById('checkout-modal');
const closeCheckoutBtn = document.getElementById('close-checkout-modal');
const checkoutContinueBtn = document.getElementById('checkout-continue-btn');

const checkoutAddressFields = document.getElementById('checkout-address-fields');
const checkoutPickupInfo = document.getElementById('checkout-pickup-info');

// Referencias de formulario de Checkout
const checkoutName = document.getElementById('checkout-name');
const checkoutPhone = document.getElementById('checkout-phone');
const checkoutColony = document.getElementById('checkout-colony');
const checkoutStreet = document.getElementById('checkout-street');
const checkoutNumber = document.getElementById('checkout-number');
const checkoutBetween = document.getElementById('checkout-between');
const checkoutReferences = document.getElementById('checkout-references');
const checkoutNotes = document.getElementById('checkout-notes');

const paymentMethod = document.getElementById('payment-method');
const cashPaymentInfo = document.getElementById('cash-payment-info');
const cashAmount = document.getElementById('cash-amount');

// ⚠️ ELIMINADO: locationBtn ya que se usa el mapa

const locationDisplay = document.getElementById('location-display');


// ===================================================================
// 3. LÓGICA DE GOOGLE MAPS (Debe ser Global) 🗺️
// ===================================================================

let tenancingoLatLng = { lat: 18.9482, lng: -99.5912 }; // Coordenadas aproximadas del centro de Tenancingo
let map;
let marker;
let geocoder;
let isMapReady = false; // Flag para saber si el mapa cargó

// Función global que Google Maps llama después de cargar la API
function initMap() {
    // Verificar si el contenedor del mapa existe (solo si estamos en el modal de checkout)
    const mapContainer = document.getElementById("map-container");
    if (!mapContainer) return;

    geocoder = new google.maps.Geocoder();
    
    map = new google.maps.Map(mapContainer, {
        center: tenancingoLatLng,
        zoom: 14, 
        mapTypeId: 'roadmap'
    });

    // Marcador inicial
    marker = new google.maps.Marker({
        position: tenancingoLatLng,
        map: map,
        draggable: true, 
        title: "Arrastra para definir tu ubicación"
    });

    // Listener para actualizar la ubicación al mover el marcador
    marker.addListener("dragend", () => {
        geocodeLatLng(marker.getPosition());
    });
    
    // Al hacer clic en el mapa, el marcador se mueve allí
    map.addListener("click", (event) => {
        marker.setPosition(event.latLng);
        geocodeLatLng(event.latLng);
    });
    
    locationDisplay.textContent = "📍 Mueve el marcador para definir la dirección.";
    isMapReady = true;
}

// Función para convertir Lat/Lng a una dirección legible (Geocodificación)
function geocodeLatLng(latlng) {
    if (!geocoder) return;

    geocoder.geocode({ location: latlng })
        .then((response) => {
            if (response.results[0]) {
                const address = response.results[0].formatted_address;
                locationDisplay.textContent = `✅ Ubicación definida: ${address}`;
                
                // Rellena campos con datos del mapa
                checkoutColony.value = "Ubicación Geocodificada";
                checkoutStreet.value = address.split(',')[0] || '';
                checkoutNumber.value = "Marcado en mapa";
                
            } else {
                locationDisplay.textContent = "Ubicación: No se encontró dirección.";
            }
        })
        .catch((e) => {
            locationDisplay.textContent = `Error de Geocodificación.`;
        });
}

// ⚠️ Se eliminó la función handleLocationClick (simulación)
// ⚠️ Se eliminó el listener del botón #location-btn (simulación)

// ===================================================================
// 4. FUNCIONES DE LÓGICA GENERAL
// ===================================================================

function renderMenu() {
    const menuContainer = document.getElementById('menu-container');
    const navBar = document.getElementById('menu-nav');

    let navHTML = '';
    let menuHTML = '';

    for (const categoria in menuData) {
        const cleanId = categoria.replace(/\s/g, '-');
        navHTML += `<a href="#${cleanId}">${categoria}</a>`;

        menuHTML += `
            <section id="${cleanId}" class="menu-section">
                <h2>${categoria}</h2>
                <div class="menu-grid">
        `;

        menuData[categoria].forEach(producto => {
            menuHTML += `
                <div class="product-card">
                    <div class="product-info">
                        <h3>${producto.nombre}</h3>
                        <p>${producto.descripcion}</p>
                        <div class="price-button">
                            <span class="price">MX$${producto.precio.toFixed(2)}</span>
                            <button class="add-to-cart" data-name="${producto.nombre}" data-price="${producto.precio}">
                                Añadir
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });

        menuHTML += `
                </div>
            </section>
        `;
    }
    
    navBar.innerHTML = navHTML;
    menuContainer.innerHTML = menuHTML;

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', handleAddToCartClick);
    });
}

function updateCartDisplay() {
    cartItemsContainer.innerHTML = '';
    let total = 0;

    if (carrito.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-message">Tu carrito está vacío.</p>';
    } else {
        carrito.forEach(item => {
            total += item.precio;
            const itemHTML = `
                <div class="cart-item">
                    <div class="item-details">
                        <span>1x ${item.nombre}</span>
                        <span>MX$${item.precio.toFixed(2)}</span>
                    </div>
                    <button class="delete-item-btn" data-id="${item.id}">🗑️</button>
                </div>
            `;
            cartItemsContainer.innerHTML += itemHTML;
        });
    }

    cartTotalSpan.textContent = `MX$${total.toFixed(2)}`;
    
    document.querySelectorAll('.delete-item-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const id = parseFloat(event.currentTarget.dataset.id);
            removeItem(id);
        });
    });
} 

// --- Funciones de Modales ---

function openCartModal() {
    let displayHTML = (currentService === 'Domicilio') 
                      ? '🛵 Servicio a Domicilio' 
                      : '🚶 Pasar a Recoger';
    
    serviceDisplay.innerHTML = displayHTML;
    updateCartDisplay(); 
    cartModal.style.display = 'block';
}

function closeCartModal() {
    cartModal.style.display = 'none';
}

function openCheckoutModal() {
    closeCartModal(); 
    checkoutModal.style.display = 'block'; 
    // Asegura que el estado de los campos de dirección sea correcto al abrir
    const event = { currentTarget: document.querySelector('.service-btn.active') };
    if (event.currentTarget) setActiveService(event); 

    // Al abrir el modal de checkout, si el mapa está listo, reajustar el tamaño para que sea visible
    if (isMapReady && map) {
        google.maps.event.trigger(map, 'resize');
        map.setCenter(marker.getPosition()); // Centrar en la posición actual
    }
}

function closeCheckoutModal() {
    checkoutModal.style.display = 'none';
}

function closeOptionsModal() {
    optionsModal.style.display = 'none';
    selectedProduct = null;
}

function closeClosedModal() {
    closedModal.style.display = 'none';
}

// --- Lógica de Carrito y Opciones ---

function generateSalsaOptions() {
    let html = '<h3>Selecciona una salsa:</h3>';
    salsasDisponibles.forEach((salsa, index) => {
        html += `
            <label class="salsa-option">
                <input type="radio" name="salsa" value="${salsa}" ${index === 0 ? 'checked' : ''}>
                ${salsa}
            </label><br>
        `;
    });
    return html;
}

function openOptionsModal(productName) {
    document.getElementById('options-modal-title').textContent = `Personaliza: ${productName}`;
    document.getElementById('options-content').innerHTML = generateSalsaOptions();
    optionsModal.style.display = 'block';
}

function finalizeAddToCart(name, price, salsa = null) {
    let finalName = name;
    if (salsa) {
        finalName += ` (Salsa: ${salsa})`;
    }

    carrito.push({
        id: Date.now() + Math.random(), 
        nombre: finalName,
        precio: price,
        opciones: salsa ? { salsa } : {}
    });

    alert(`✅ ¡"${finalName}" añadido al pedido!`);
    updateCartDisplay();
    if (optionsModal.style.display === 'block') {
        closeOptionsModal();
    }
}

function removeItem(id) {
    carrito = carrito.filter(item => item.id !== id);
    updateCartDisplay();
    alert("❌ Producto eliminado del pedido.");
}

function handleAddToCartClick(event) {
    const name = event.target.dataset.name;
    const price = parseFloat(event.target.dataset.price);

    selectedProduct = { name, price };
    const requiresOptions = name.includes('Alitas') || name.includes('Boneless');

    if (requiresOptions) {
        openOptionsModal(name);
    } else {
        finalizeAddToCart(name, price); 
    }
}

function setActiveService(event) {
    serviceButtons.forEach(btn => btn.classList.remove('active'));
    event.currentTarget.classList.add('active');
    
    if (event.currentTarget.id === 'delivery-btn') {
        currentService = 'Domicilio';
        checkoutAddressFields.style.display = 'block'; 
        checkoutPickupInfo.style.display = 'none';
    } else {
        currentService = 'Recoger';
        checkoutAddressFields.style.display = 'none'; 
        checkoutPickupInfo.style.display = 'block';
    }
}

function handlePaymentMethodChange() {
    if (paymentMethod.value === 'efectivo') {
        cashPaymentInfo.style.display = 'block';
        cashAmount.setAttribute('required', 'required');
    } else {
        cashPaymentInfo.style.display = 'none';
        cashAmount.removeAttribute('required');
    }
}


function buildWhatsAppMessage() {
    const totalText = cartTotalSpan.textContent;
    const totalValue = parseFloat(totalText.replace('MX$', ''));

    let itemsList = '';
    carrito.forEach(item => {
        itemsList += ` - 1x ${item.nombre} | $${item.precio.toFixed(2)}\n`;
    });

    // 1. Datos Generales
    let message = `*¡NUEVO PEDIDO FAST BURGER!* 🍔\n\n`;
    message += `*Servicio:* ${currentService}\n`;
    message += `*Cliente:* ${checkoutName.value}\n`;
    message += `*Teléfono:* +52 ${checkoutPhone.value}\n\n`;
    
    // 2. Datos de Envío
    message += `*--- DETALLE DE ENVÍO ---*\n`;
    if (currentService === 'Domicilio') {
        message += `*Dirección:*\n`;
        message += `Colonia: ${checkoutColony.value}\n`;
        message += `Calle y Número: ${checkoutStreet.value} #${checkoutNumber.value}\n`;
        if (checkoutBetween.value) message += `Entre calles: ${checkoutBetween.value}\n`;
        if (checkoutReferences.value) message += `Referencias: ${checkoutReferences.value}\n`;
        if (locationDisplay.textContent.includes('definida')) message += `*Ubicación: ✅ Geocodificada*\n`;
        else message += `*Ubicación: ❌ No se pudo geocodificar*\n`;
    } else {
        message += `*Recoger en Tienda* (Cliente pasará)\n`;
    }
    message += `\n`;
    
    // 3. Productos y Total
    message += `*--- PRODUCTOS ---*\n`;
    message += itemsList;
    message += `\n*TOTAL: ${totalText}*\n\n`;

    // 4. Pago
    message += `*--- MÉTODO DE PAGO ---*\n`;
    message += `*Forma de Pago:* ${paymentMethod.options[paymentMethod.selectedIndex].text.trim()}\n`;
    if (paymentMethod.value === 'efectivo' && cashAmount.value) {
        const cashValue = parseFloat(cashAmount.value);
        const cambio = cashValue - totalValue;
        message += `*Paga con:* $${cashValue.toFixed(2)}\n`;
        message += `*Cambio a dar:* $${cambio.toFixed(2)}\n`;
    }

    // 5. Notas
    if (checkoutNotes.value) {
        message += `\n*Notas Adicionales:*\n ${checkoutNotes.value}\n`;
    }
    
    // Abre WhatsApp. Reemplaza 527221234567 con el número real.
    const whatsappLink = `https://api.whatsapp.com/send?phone=527221234567&text=${encodeURIComponent(message)}`;
    
    window.open(whatsappLink, '_blank');

    // Simulación de finalización
    alert("🎉 ¡Pedido enviado a WhatsApp! Vaciando carrito.");
    carrito = [];
    updateCartDisplay();
    closeCheckoutModal();
}


// --- Lógica de Horario (Se mantiene igual) ---
function checkClosingTime() {
    const now = new Date();
    const currentHour = now.getHours(); 
    const currentMinute = now.getMinutes();
    
    const HORA_CIERRE = 23; // 11:00 PM
    const HORA_APERTURA = 12; // 12:45 PM
    const MINUTO_APERTURA = 45;

    let isClosed = false;

    if (currentHour >= HORA_CIERRE) {
        isClosed = true;
    } else if (currentHour < HORA_APERTURA) {
        isClosed = true;
    } else if (currentHour === HORA_APERTURA && currentMinute < MINUTO_APERTURA) {
        isClosed = true;
    } 
    
    if (closedModal) {
        const menuContainer = document.getElementById('menu-container');
        const cartFloatingBtn = document.querySelector('.cart-floating');

        if (isClosed) {
            closedModal.style.display = 'block';
            if (menuContainer) {
                menuContainer.style.pointerEvents = 'none'; 
                menuContainer.style.opacity = '0.5'; 
            }
            if (cartFloatingBtn) {
                cartFloatingBtn.style.display = 'none'; 
            }
        } else {
            closedModal.style.display = 'none';
            if (menuContainer) {
                menuContainer.style.pointerEvents = 'auto'; 
                menuContainer.style.opacity = '1'; 
            }
            if (cartFloatingBtn) {
                cartFloatingBtn.style.display = 'block'; 
            }
        }
    }
}


// ===================================================================
// 5. EVENT LISTENERS GLOBALES (Inicio de la Aplicación)
// ===================================================================

document.addEventListener('DOMContentLoaded', () => {
    
    checkClosingTime();
    renderMenu();
    
    // Listeners de Servicio
    if (deliveryBtn && pickupBtn) {
        deliveryBtn.addEventListener('click', setActiveService);
        pickupBtn.addEventListener('click', setActiveService);
    }
    
    // Listeners de Modales
    cartButton.addEventListener('click', openCartModal);
    if (closeModalButton) closeModalButton.addEventListener('click', closeCartModal);
    closeOptionsButton.addEventListener('click', closeOptionsModal);
    closeClosedModalBtn.addEventListener('click', closeClosedModal);
    if (closeCheckoutBtn) closeCheckoutBtn.addEventListener('click', closeCheckoutModal);

    // Listener para el botón 'Continuar' del carrito
    document.querySelector('.checkout-button').addEventListener('click', () => {
        if (carrito.length > 0) {
            openCheckoutModal();
        } else {
            alert("⚠️ Por favor, añade productos a tu pedido antes de continuar.");
        }
    });

    // Listener para añadir con opciones
    addToCartWithOptionsButton.addEventListener('click', () => {
        const selectedSalsaInput = document.querySelector('input[name="salsa"]:checked');
        
        if (selectedProduct && selectedSalsaInput) {
            const selectedSalsa = selectedSalsaInput.value;
            finalizeAddToCart(selectedProduct.name, selectedProduct.price, selectedSalsa);
        } else {
            alert("⚠️ Por favor, selecciona una salsa.");
        }
    });

    // Listener para método de pago
    paymentMethod.addEventListener('change', handlePaymentMethodChange);
    handlePaymentMethodChange(); // Ejecutar al inicio para establecer la visibilidad

    // ⚠️ ELIMINADO: Listener para ubicación (la interacción se realiza directamente en el mapa)
    // if (locationBtn) locationBtn.addEventListener('click', handleLocationClick);

    // Listener para finalizar el pedido (Enviar por WhatsApp)
    checkoutContinueBtn.addEventListener('click', (event) => {
        
        // Validación de campos del formulario
        const nameValid = checkoutName.reportValidity();
        const phoneValid = checkoutPhone.reportValidity() && checkoutPhone.value.length === 10;
        
        let addressValid = true;
        if (currentService === 'Domicilio') {
            addressValid = checkoutColony.reportValidity() && 
                           checkoutStreet.reportValidity() && 
                           checkoutNumber.reportValidity();

            // Validación adicional para ubicación marcada
            if (!locationDisplay.textContent.includes('definida')) {
                 alert("⚠️ Por favor, marca tu ubicación en el mapa.");
                 addressValid = false;
            }
        }

        let paymentValid = true;
        if (paymentMethod.value === 'efectivo') {
            // Se asume que el input de efectivo debe ser mayor o igual al total
            const total = parseFloat(cartTotalSpan.textContent.replace('MX$', ''));
            const cash = parseFloat(cashAmount.value);

            paymentValid = cashAmount.reportValidity() && (cash >= total);
            if (!paymentValid && cash < total) {
                 alert("⚠️ La cantidad para pagar es menor al total del pedido. Por favor, corrige la cantidad.");
            }
        }
        
        if (nameValid && phoneValid && addressValid && paymentValid) {
            buildWhatsAppMessage();
        } else {
             if (phoneValid && checkoutPhone.value.length !== 10) {
                 // Esta validación ya está implícita en phoneValid, pero se deja el mensaje
                 alert("⚠️ Por favor, introduce un número de teléfono válido de 10 dígitos.");
             } else if (!paymentValid && paymentMethod.value === 'efectivo') {
                 // El mensaje específico de pago se maneja arriba
             } else if(addressValid) {
                 alert("⚠️ Por favor, completa todos los campos obligatorios.");
             }
        }
    });

    // Cierre de modales haciendo clic fuera
    window.addEventListener('click', (event) => {
        if (event.target === cartModal) { closeCartModal(); }
        if (event.target === optionsModal) { closeOptionsModal(); }
        if (event.target === closedModal) { closeClosedModal(); }
        if (event.target === checkoutModal) { closeCheckoutModal(); }
    });
});
const productos = [
{
        id: 1, // IDs ajustados para empezar en 1 (o podrías usar 11 si fuera continuación)
        nombre: "Gafas de sol cuadradas",
        precio: 120.00,
        categoria: "Lentes de sol",
        imagen: "/Imagenes/Productos/cuadrado.jpg"
    },
    {
        id: 2,
        nombre: "Reloj de pulsera acero inox",
        precio: 229.00,
        categoria: "Relojes",
        imagen: "/Imagenes/Productos/reloj.jpg"
    },
    {
        id: 3,
        nombre: "Reloj pulsera malla metálica",
        precio: 189.00,
        categoria: "Relojes",
        imagen: "/Imagenes/Productos/malla.jpg"
    },
    {
        id: 4,
        nombre: "Cartera de dos asas Lya",
        precio: 99.90,
        categoria: "Carteras",
        imagen: "/Imagenes/Productos/cartera.jpg"
    },
    {
        id: 5,
        nombre: "Cartera Amara",
        precio: 134.50,
        categoria: "Carteras",
        imagen: "/Imagenes/Productos/amaraa.jpg"
    },
    {
        id: 6,
        nombre: "Cinturón de cuero hombre",
        precio: 169.00,
        categoria: "Cinturones", // Inferencia, ya que no estaba en los filtros
        imagen: "/Imagenes/Productos/cinturon.jpg"
    },
    {
        id: 7,
        nombre: "Bucket hat reversible cereza",
        precio: 39.90,
        categoria: "Sombreros",
        imagen: "/Imagenes/Productos/cerezaa.jpg"
    },
    {
        id: 8,
        nombre: "Lentes de sol rectangulares negro",
        precio: 34.90,
        categoria: "Lentes de sol",
        imagen: "/Imagenes/Productos/lentes.jpg"
    },
    {
        id: 9,
        nombre: "Set de anillos frutales dorados",
        precio: 16.90,
        categoria: "Anillos",
        imagen: "/Imagenes/Productos/anillos.jpg"
    },
    {
        id: 10,
        nombre: "Pañuelo de seda",
        precio: 660.00,
        categoria: "Pañuelos",
        imagen: "/Imagenes/Productos/pañueloo.jpg"
    }
];

// ========== FUNCIONALIDAD DEL BUSCADOR CON AUTOCOMPLETADO ==========
document.addEventListener('DOMContentLoaded', function() {
    
    const searchWrapper = document.querySelector('.search-wrapper');
    const searchBtn = document.querySelector('.search-btn');
    const searchInput = document.querySelector('.search-expand');
    const searchSuggestions = document.getElementById('searchSuggestions');

    // Verificar que existen los elementos
    if (!searchWrapper || !searchBtn || !searchInput || !searchSuggestions) {
        console.error('Error: No se encontraron los elementos del buscador');
        return;
    }

    // ========== FUNCIÓN DE BÚSQUEDA ==========
    function buscarProductos(query) {
        if (!query || query.length < 2) {
            return [];
        }

        const queryLower = query.toLowerCase().trim();
        
        return productos.filter(producto => {
            return producto.nombre.toLowerCase().includes(queryLower) ||
                producto.categoria.toLowerCase().includes(queryLower);
        });
    }

    // ========== RESALTAR TEXTO COINCIDENTE ==========
    function highlightText(text, query) {
        if (!query) return text;
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<span class="highlight">$1</span>');
    }

    // ========== MOSTRAR SUGERENCIAS ==========
    function mostrarSugerencias(query) {
        const resultados = buscarProductos(query);
        
        if (resultados.length === 0) {
            searchSuggestions.innerHTML = '<div class="no-results">No se encontraron productos</div>';
            searchSuggestions.classList.add('active');
            return;
        }

        let html = '';
        resultados.slice(0, 6).forEach(producto => {
            html += `
                <div class="suggestion-item" data-id="${producto.id}">
                    <img src="${producto.imagen}" alt="${producto.nombre}" class="suggestion-img" onerror="this.src='https://via.placeholder.com/50'">
                    <div class="suggestion-info">
                        <div class="suggestion-name">${highlightText(producto.nombre, query)}</div>
                        <div class="suggestion-category">${producto.categoria}</div>
                        <div class="suggestion-price">S/ ${producto.precio.toFixed(2)}</div>
                    </div>
                </div>
            `;
        });

        searchSuggestions.innerHTML = html;
        searchSuggestions.classList.add('active');

        // Agregar event listeners a las sugerencias
        document.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', function() {
                const productoId = this.getAttribute('data-id');
                const producto = productos.find(p => p.id == productoId);
                
                console.log('Producto seleccionado:', producto);
                alert(`Seleccionaste: ${producto.nombre}\nPrecio: S/ ${producto.precio}`);
                
                searchSuggestions.classList.remove('active');
                searchInput.value = producto.nombre;
            });
        });
    }

    // ========== OCULTAR SUGERENCIAS ==========
    function ocultarSugerencias() {
        searchSuggestions.classList.remove('active');
    }

    // ========== EVENT LISTENERS ==========

    // Click en el botón de búsqueda
    searchBtn.addEventListener('click', function(e) {
        e.preventDefault();
        searchWrapper.classList.toggle('active');
        
        if (searchWrapper.classList.contains('active')) {
            searchInput.focus();
        } else {
            ocultarSugerencias();
        }
    });

    // Buscar mientras se escribe
    let timeoutId;
    searchInput.addEventListener('input', function() {
        const query = this.value.trim();
        
        clearTimeout(timeoutId);
        
        if (query.length < 2) {
            ocultarSugerencias();
            return;
        }

        // Esperar 300ms después de que el usuario deje de escribir
        timeoutId = setTimeout(() => {
            mostrarSugerencias(query);
        }, 300);
    });

    // Mostrar sugerencias al hacer focus
    searchInput.addEventListener('focus', function() {
        if (this.value.trim().length >= 2) {
            mostrarSugerencias(this.value.trim());
        }
    });

    // Cerrar al hacer clic fuera del buscador
    document.addEventListener('click', function(e) {
        if (!searchWrapper.contains(e.target)) {
            searchWrapper.classList.remove('active');
            ocultarSugerencias();
        }
    });

    // Prevenir que se cierre al hacer clic dentro del input
    searchInput.addEventListener('click', function(e) {
        e.stopPropagation();
    });

    // Prevenir que se cierre al hacer clic en las sugerencias
    searchSuggestions.addEventListener('click', function(e) {
        e.stopPropagation();
    });

    // Buscar al presionar Enter
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const query = this.value.trim();
            if (query) {
                console.log('Búsqueda:', query);
                // Aquí puedes redirigir a una página de resultados
                // window.location.href = `/buscar.html?q=${encodeURIComponent(query)}`;
            }
        }
    });
});
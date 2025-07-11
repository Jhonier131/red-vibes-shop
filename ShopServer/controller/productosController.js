const { response } = require("./helpers/dataResponse");
const { productsW } = require('../database/models/productsWomens.schema.js');
const { productsM } = require('../database/models/productsMens.schema.js');
const { allProducts } = require('../database/models/products.schema.js'); 
const { categoriesF } = require('../database/models/categoryFilters.js');

const getAllProducts = async (req, res) => {
  try {
    const genderParam = req.params.gender?.toLowerCase();

    console.log(`getAllProducts: ${genderParam}`);

    if (!['women', 'men'].includes(genderParam)) {
      return res.status(400).json({ message: "Género inválido. Usa 'women', 'men'" });
    }

    const filteredProducts = await allProducts.find({ gender: genderParam });

    response(res, { payload: filteredProducts });

  } catch (error) {
    console.log("Error -> ", error.message);
    return res.status(500).json(error.message);
  }
};

const getItem = async (req, res) => {
  try {
    const id = req.params.id;

    // Busca por _id en MongoDB
    const product = await allProducts.findById(id);

    if (!product) {
        return res.status(404).json({ message: 'Producto no encontrado' });
    }

    response(res, { payload: product });
  } catch (error) {
    console.log("Error -> ", error.message);
    return res.status(500).json({ message: error.message });
  }
}

const aplyFilters = async (req, res) => {
  try {
    const { order, sizes, categories, mode } = req.body;
    console.log(req.body);

    // Construir el filtro base
    const query = {};

    // Filtrar por género
    if (mode) {
      query.gender = mode;
    }

    // Filtrar por categorías
    if (categories && categories.length) {
      query.category = { $in: categories };
    }

    // Filtrar por tallas (esto requiere lógica posterior si 'size' es un array en cada producto)
    let products = await allProducts.find(query);

    if (sizes && sizes.length) {
      products = products.filter(product =>
        product.size.some(size => sizes.includes(size))
      );
    }

    // Ordenar por precio
    if (Number(order)) {
      products = products.sort((a, b) => b.price - a.price); // Mayor a menor
    } else {
      products = products.sort((a, b) => a.price - b.price); // Menor a mayor
    }

    console.log(
      'Filter by:',
      sizes,
      'Order by:',
      Number(order) ? 'Mayor precio' : 'Menor precio',
      'Category:', categories,
      'Mode:', mode
    );

    response(res, { payload: products });
  } catch (error) {
    console.log("Error -> ", error.message);
    return res.status(500).json(error.message);
  }
};


const getFilters = async (req, res) => {
    try {
        const filters = await categoriesF.find();
        response(res, { payload: filters})
    } catch (error) {
        console.log("Error -> ", error.message);
        return res.status(500).json(error.message);
    }
}

module.exports = {
    getAllProducts,
    getItem,
    aplyFilters,
    getFilters
}
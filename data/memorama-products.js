window.MEMORAMA_PRODUCTS = [
  {
    productId: "alpura",
    name: "Alpura chocolate",
    image: "assets/memorama/alpura-chocolate.svg",
    seals: [],
    sugar: { value: 1.4, display: "1.4 g", basis: "por 100 ml", qualifier: "de azúcares añadidos", teaspoons: 0.35, teaspoonsLabel: "≈ ⅓ cucharadita" },
    comparison: { productId: "coca", label: "Coca-Cola", value: "10.5 g / 100 ml" },
    message: "Este producto no tiene sellos, pero eso no significa que no tenga azúcar. La etiqueta también da información."
  },
  {
    productId: "coca",
    name: "Coca-Cola",
    image: "assets/memorama/coca-cola.svg",
    seals: ["sugar", "calories"],
    sugar: { value: 10.5, display: "10.5 g", basis: "por 100 ml", qualifier: "de azúcares añadidos", teaspoons: 2.5, teaspoonsLabel: "≈ 2½ cucharaditas" },
    comparison: { productId: "alpura", label: "Alpura chocolate", value: "1.4 g / 100 ml" },
    message: "En la misma cantidad, Coca-Cola tiene bastante más azúcar añadida que esta leche de chocolate."
  },
  {
    productId: "yogurt-lala",
    name: "Yogurt bebible Lala",
    image: "assets/memorama/yogurt-lala.svg",
    seals: ["sugar"],
    sugar: { value: 4.3, display: "≈ 4.3 g", basis: "por 100 g", qualifier: "de azúcares añadidos", teaspoons: 1, teaspoonsLabel: "≈ 1 cucharadita" },
    comparison: { productId: "alpura", label: "Alpura chocolate", value: "1.4 g / 100 ml", note: "Las bases son distintas: 100 g y 100 ml." },
    message: "Productos que parecen similares pueden tener cantidades diferentes. La etiqueta ayuda a compararlos."
  },
  {
    productId: "arizona",
    name: "Arizona",
    image: "assets/memorama/arizona.svg",
    seals: ["calories", "sugar"],
    sugar: { value: null, display: "Dato por confirmar", basis: "", qualifier: "", teaspoons: null, teaspoonsLabel: "Aproximación pendiente" },
    comparison: null,
    message: "Todavía falta confirmar este dato. Por ahora, sus sellos siguen siendo una primera pista."
  },
  {
    productId: "red-bull",
    name: "Red Bull",
    image: "assets/memorama/red-bull.svg",
    seals: ["calories", "sugar"],
    sugar: { value: 10.6, display: "10.6 g", basis: "por 100 ml", qualifier: "de azúcares añadidos", teaspoons: 2.5, teaspoonsLabel: "≈ 2½ cucharaditas" },
    comparison: { productId: "coca", label: "Coca-Cola", value: "10.5 g / 100 ml" },
    message: "¡Son casi iguales! Aunque son bebidas diferentes, tienen una cantidad de azúcar muy parecida."
  },
  {
    productId: "delaware",
    name: "Delaware Punch",
    image: "assets/memorama/delaware-punch.svg",
    seals: ["calories", "sugar"],
    sugar: { value: 4.9, display: "≈ 4.9 g", basis: "por 100 ml", qualifier: "de azúcares añadidos", teaspoons: 1.25, teaspoonsLabel: "≈ 1¼ cucharaditas" },
    comparison: { productId: "coca", label: "Coca-Cola", value: "10.5 g / 100 ml" },
    message: "Tienen los mismos tipos de sellos, pero eso no significa que tengan exactamente la misma cantidad de azúcar."
  }
];

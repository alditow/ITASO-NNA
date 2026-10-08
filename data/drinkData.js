window.ITASO_DRINKS = [
  { id:'agua', name:'Agua', presentation:600, unit:'ml', addedSugarG:0, sugarPer100:0, image:'../assets/bebidas/agua.svg', sourceLabel:'Cantidad base del prototipo', needsPhysicalLabelCheck:false },
  { id:'arizona', name:'Arizona Green Tea', presentation:680, unit:'ml', addedSugarG:48, sugarPer100:7.06, image:'../assets/bebidas/arizona.svg', sourceLabel:'Verificar con etiqueta física del envase', needsPhysicalLabelCheck:true },
  { id:'yakult', name:'Yakult', presentation:80, unit:'ml', addedSugarG:10.7, sugarPer100:13.38, image:'../assets/bebidas/yakult.svg', sourceLabel:'Cantidad base del prototipo', needsPhysicalLabelCheck:false },
  { id:'alpura', name:'Alpura Vaquitas Chocolate', presentation:200, unit:'ml', addedSugarG:2.8, sugarPer100:1.4, image:'../assets/bebidas/leche.svg', sourceLabel:'Cantidad base del prototipo', needsPhysicalLabelCheck:false },
  { id:'pepsi', name:'Pepsi', presentation:600, unit:'ml', addedSugarG:45, sugarPer100:7.5, image:'../assets/bebidas/pepsi.svg', sourceLabel:'Verificar con etiqueta física del envase', needsPhysicalLabelCheck:true },
  { id:'coca', name:'Coca-Cola Original', presentation:355, unit:'ml', addedSugarG:37.3, sugarPer100:10.51, image:'../assets/bebidas/coca.svg', sourceLabel:'Cantidad base del prototipo', needsPhysicalLabelCheck:false },
  { id:'sprite', name:'Sprite', presentation:355, unit:'ml', addedSugarG:17.4, sugarPer100:4.9, image:'../assets/bebidas/sprite.svg', sourceLabel:'Cantidad base del prototipo', needsPhysicalLabelCheck:false },
  { id:'fuze', name:'Fuze Tea Durazno', presentation:600, unit:'ml', addedSugarG:36, sugarPer100:6, image:'../assets/bebidas/fuzetea.svg', sourceLabel:'Cantidad base del prototipo', needsPhysicalLabelCheck:false },
  { id:'redbull', name:'Red Bull', presentation:250, unit:'ml', addedSugarG:27, sugarPer100:10.8, image:'../assets/bebidas/redbull.svg', sourceLabel:'Cantidad base del prototipo', needsPhysicalLabelCheck:false },
  { id:'fanta', name:'Fanta Naranja', presentation:355, unit:'ml', addedSugarG:17.4, sugarPer100:4.9, image:'../assets/bebidas/fanta.svg', sourceLabel:'Cantidad base del prototipo', needsPhysicalLabelCheck:false },
  { id:'manzanita', name:'Manzanita Sol', presentation:355, unit:'ml', addedSugarG:16.3, sugarPer100:4.59, image:'../assets/bebidas/manzanita.svg', sourceLabel:'Verificar con etiqueta física del envase', needsPhysicalLabelCheck:true },
  { id:'delaware', name:'Delaware Punch', presentation:355, unit:'ml', addedSugarG:17.5, sugarPer100:4.93, image:'../assets/bebidas/delaware.svg', sourceLabel:'Cantidad base del prototipo', needsPhysicalLabelCheck:false },
  { id:'yogurt', name:'Yogurt Lala Fresa', presentation:220, unit:'g', addedSugarG:9.5, sugarPer100:4.32, image:'../assets/bebidas/yogurtfresa.svg', sourceLabel:'Cantidad base del prototipo', needsPhysicalLabelCheck:false },
  { id:'gatorade', name:'Gatorade Ponche', presentation:500, unit:'ml', addedSugarG:30, sugarPer100:6, image:'../assets/bebidas/gatorade.svg', sourceLabel:'Cantidad base del prototipo', needsPhysicalLabelCheck:false },
  { id:'fresca', name:'Fresca', presentation:355, unit:'ml', addedSugarG:15.1, sugarPer100:4.25, image:'../assets/bebidas/fresca.svg', sourceLabel:'Cantidad base del prototipo', needsPhysicalLabelCheck:false }
];

window.ITASO_COMPARISON_BANK = [
  { id:'tutorial', products:['agua','alpura'], tutorial:true },
  { id:'fermentados', products:['yakult','yogurt'] },
  { id:'envases-grandes', products:['pepsi','arizona'] },
  { id:'refresco-bebida-deportiva', products:['coca','gatorade'] },
  { id:'energetica-te', products:['redbull','fuze'] },
  { id:'empate', products:['sprite','fanta'] },
  { id:'sabores-frutales', products:['manzanita','delaware'] },
  { id:'cantidades-cercanas', products:['fresca','fanta'] }
];

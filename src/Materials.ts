interface Material {
  name: string;
  color: string;
  fallSpeed: number;
}
enum MaterialTypes {
  air,
  sand,
}

let Materials: Material[] = [];
Materials[MaterialTypes.air] = {
  name: "air",
  color: "#000000",
  fallSpeed: 0,
};
Materials[MaterialTypes.sand] = {
  name: "sand",
  color: "#FF0000",
  fallSpeed: 1,
};

function getMaterial(id: MaterialTypes) {
  // will be more complex later to allow for modding
  return Materials[id] || Materials[0];
}
function allMaterials() {
  return Object.keys(Materials);
}

export { getMaterial, allMaterials, MaterialTypes, Material };

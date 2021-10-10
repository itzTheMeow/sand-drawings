interface Material {
  name: string;
  color: string;
  fallSpeed: number;
}
enum MaterialTypes {
  air,
  sand,
  wall,
}

let Materials: Material[] = [];
Materials[MaterialTypes.air] = {
  name: "air",
  color: "#000000",
  fallSpeed: 0,
};
Materials[MaterialTypes.sand] = {
  name: "sand",
  color: "#d2b48c",
  fallSpeed: 1,
};
Materials[MaterialTypes.wall] = {
  name: "wall",
  color: "#767676",
  fallSpeed: 0,
};

function getMaterial(id: MaterialTypes) {
  // will be more complex later to allow for modding
  return Materials[id] || Materials[0];
}
function allMaterials() {
  return Object.keys(Materials);
}

export { getMaterial, allMaterials, MaterialTypes, Material };

const Materials = {
  0: {
    name: "air",
    color: "#000000",
    fallSpeed: 0,
  },
  1: {
    name: "sand",
    color: "#FF0000",
    fallSpeed: 1,
  },
};

enum MaterialTypes {
  air,
  sand,
}

function getMaterial(id) {
  // will be more complex later to allow for modding
  return Materials[id] || Materials[0];
}
function allMaterials() {
  return Object.keys(Materials);
}

export { getMaterial, allMaterials, MaterialTypes };

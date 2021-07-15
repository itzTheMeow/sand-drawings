const Materials = {
  0: {
    name: "air",
    color: "#000000"
  },
  1: {
    name: "sand",
    color: "#FFFFFF"
  }
}

function getMaterial(id) {
  // will be more complex later to allow for modding
  return Materials[id] || Materials[0];
}
function allMaterials() {
  return Object.keys(Materials);
}

export { getMaterial, allMaterials }
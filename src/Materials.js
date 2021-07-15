const Materials = {
  1: {
    name: "sand",
    color: "#FFFFFF"
  }
}

function getMaterial(id) {
  // will be more complex later to allow for modding
  return Materials[id] || Materials[1];
}
function allMaterials() {
  return Object.keys(Materials);
}

export { getMaterial, allMaterials }
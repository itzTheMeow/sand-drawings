import { Howl } from "howler";

interface Material {
  name: string;
  color: string;
  fallSpeed: number;
  sound: Howl | null;
}
enum MaterialTypes {
  air,
  sand,
  wall,
}

function sound(data: [string, number, number]) {
  return new Howl({
    src: data[0],
    loop: true,
    preload: true,
    sprite: {
      draw: [data[1], data[2]],
    },
    volume: 0.8,
  });
}

let Materials: Material[] = [];
Materials[MaterialTypes.air] = {
  name: "air",
  color: "#000000",
  fallSpeed: 0,
  sound: null,
};
Materials[MaterialTypes.sand] = {
  name: "sand",
  color: "#d2b48c",
  fallSpeed: 1,
  sound: sound(["sound/sand.mp3", 3600, 300]),
};
Materials[MaterialTypes.wall] = {
  name: "wall",
  color: "#767676",
  fallSpeed: 0,
  sound: null,
};

function getMaterial(id: MaterialTypes) {
  // will be more complex later to allow for modding
  return Materials[id] || Materials[0];
}
function allMaterials() {
  return Object.keys(Materials);
}

export { getMaterial, allMaterials, MaterialTypes, Material };

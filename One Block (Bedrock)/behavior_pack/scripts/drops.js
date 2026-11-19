// Vanilla-style drops for the one block. Silk Touch, Fortune, shears, and tool tier are included.

const LEAVES = {
  "minecraft:oak_leaves": { sapling: "minecraft:oak_sapling", apple: true, jungle: false },
  "minecraft:dark_oak_leaves": { sapling: "minecraft:dark_oak_sapling", apple: true, jungle: false },
  "minecraft:jungle_leaves": { sapling: "minecraft:jungle_sapling", apple: false, jungle: true },
  "minecraft:spruce_leaves": { sapling: "minecraft:spruce_sapling", apple: false, jungle: false },
};

const SAPLING_CHANCE = [0.05, 0.0625, 0.083333336, 0.1];
const JUNGLE_SAPLING_CHANCE = [0.025, 0.03125, 0.041666668, 0.05];
const STICK_CHANCE = [0.02, 0.022222223, 0.025, 0.033333335];
const APPLE_CHANCE = [0.005, 0.0055555557, 0.00625, 0.008333334];

const TIER = {
  "minecraft:obsidian": 4,
  "minecraft:crying_obsidian": 4,
  "minecraft:gold_ore": 3,
  "minecraft:deepslate_gold_ore": 3,
  "minecraft:deepslate_diamond_ore": 3,
  "minecraft:emerald_ore": 3,
  "minecraft:deepslate_emerald_ore": 3,
  "minecraft:deepslate_redstone_ore": 3,
  "minecraft:nether_quartz_ore": 3,
  "minecraft:iron_ore": 2,
  "minecraft:deepslate_iron_ore": 2,
  "minecraft:copper_ore": 2,
  "minecraft:deepslate_lapis_ore": 2,
  "minecraft:coal_ore": 1,
  "minecraft:deepslate_coal_ore": 1,
  "minecraft:stone": 1,
  "minecraft:cobblestone": 1,
  "minecraft:andesite": 1,
  "minecraft:granite": 1,
  "minecraft:diorite": 1,
  "minecraft:deepslate": 1,
  "minecraft:cobbled_deepslate": 1,
  "minecraft:deepslate_tiles": 1,
  "minecraft:deepslate_bricks": 1,
  "minecraft:chiseled_deepslate": 1,
  "minecraft:tuff": 1,
  "minecraft:dripstone_block": 1,
  "minecraft:amethyst_block": 1,
  "minecraft:sandstone": 1,
  "minecraft:cut_sandstone": 1,
  "minecraft:smooth_sandstone": 1,
  "minecraft:chiseled_sandstone": 1,
  "minecraft:prismarine": 1,
  "minecraft:prismarine_bricks": 1,
  "minecraft:tube_coral_block": 1,
  "minecraft:netherrack": 1,
  "minecraft:nether_bricks": 1,
  "minecraft:blackstone": 1,
  "minecraft:magma": 1,
  "minecraft:end_stone": 1,
  "minecraft:end_stone_bricks": 1,
  "minecraft:purpur_block": 1,
  "minecraft:purpur_pillar": 1,
  "minecraft:packed_ice": 1,
  "minecraft:blue_ice": 1,
};

const ORES = {
  "minecraft:coal_ore": { item: "minecraft:coal", min: 1, max: 1 },
  "minecraft:deepslate_coal_ore": { item: "minecraft:coal", min: 1, max: 1 },
  "minecraft:iron_ore": { item: "minecraft:raw_iron", min: 1, max: 1 },
  "minecraft:deepslate_iron_ore": { item: "minecraft:raw_iron", min: 1, max: 1 },
  "minecraft:copper_ore": { item: "minecraft:raw_copper", min: 2, max: 3 },
  "minecraft:gold_ore": { item: "minecraft:raw_gold", min: 1, max: 1 },
  "minecraft:deepslate_gold_ore": { item: "minecraft:raw_gold", min: 1, max: 1 },
  "minecraft:deepslate_diamond_ore": { item: "minecraft:diamond", min: 1, max: 1 },
  "minecraft:emerald_ore": { item: "minecraft:emerald", min: 1, max: 1 },
  "minecraft:deepslate_redstone_ore": { item: "minecraft:redstone", min: 4, max: 5 },
  "minecraft:deepslate_lapis_ore": { item: "minecraft:lapis_lazuli", min: 4, max: 9 },
  "minecraft:nether_quartz_ore": { item: "minecraft:quartz", min: 1, max: 1 },
};

function roll(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

function chance(table, fortune) {
  return table[Math.min(fortune, table.length - 1)];
}

function fortuneCount(base, fortune) {
  if (fortune <= 0) return base;
  const bonus = Math.floor(Math.random() * (fortune + 2)) - 1;
  return base * ((bonus < 0 ? 0 : bonus) + 1);
}

function one(id, amount = 1) {
  return amount > 0 ? [{ id, amount }] : [];
}

function leafDrops(blockId, tool) {
  if (tool.shears || tool.silk) return one(blockId);
  const leaf = LEAVES[blockId];
  const drops = [];
  const saplingChance = chance(leaf.jungle ? JUNGLE_SAPLING_CHANCE : SAPLING_CHANCE, tool.fortune);
  if (Math.random() < saplingChance) drops.push({ id: leaf.sapling, amount: 1 });
  if (Math.random() < chance(STICK_CHANCE, tool.fortune)) drops.push({ id: "minecraft:stick", amount: 1 });
  if (leaf.apple && Math.random() < chance(APPLE_CHANCE, tool.fortune)) drops.push({ id: "minecraft:apple", amount: 1 });
  return drops;
}

export function blockDrops(blockId, tool) {
  if (LEAVES[blockId]) return leafDrops(blockId, tool);

  if (blockId === "minecraft:grass_block" || blockId === "minecraft:podzol") {
    return one(tool.silk ? blockId : "minecraft:dirt");
  }
  if (blockId === "minecraft:stone") {
    if (tool.tier < 1) return [];
    return one(tool.silk ? blockId : "minecraft:cobblestone");
  }
  if (blockId === "minecraft:deepslate") {
    if (tool.tier < 1) return [];
    return one(tool.silk ? blockId : "minecraft:cobbled_deepslate");
  }
  if (blockId === "minecraft:clay") {
    return tool.silk ? one(blockId) : one("minecraft:clay_ball", 4);
  }
  if (blockId === "minecraft:melon_block") {
    if (tool.silk) return one(blockId);
    return one("minecraft:melon_slice", Math.min(9, roll(3, 7) + tool.fortune));
  }
  if (blockId === "minecraft:snow_block") {
    if (!tool.shovel) return [];
    return tool.silk ? one(blockId) : one("minecraft:snowball", 4);
  }
  if (blockId === "minecraft:packed_ice" || blockId === "minecraft:blue_ice") {
    if (!tool.silk || tool.tier < 1) return [];
    return one(blockId);
  }
  if (blockId === "minecraft:glowstone") {
    if (tool.silk) return one(blockId);
    return one("minecraft:glowstone_dust", Math.min(4, fortuneCount(roll(2, 4), tool.fortune)));
  }
  if (blockId === "minecraft:sea_lantern") {
    if (tool.silk) return one(blockId);
    return one("minecraft:prismarine_crystals", Math.min(5, fortuneCount(roll(2, 3), tool.fortune)));
  }
  if (blockId === "minecraft:tube_coral_block") {
    if (tool.tier < 1) return [];
    return one(tool.silk ? blockId : "minecraft:dead_tube_coral_block");
  }
  if (blockId === "minecraft:sculk") {
    return tool.silk ? one(blockId) : [];
  }

  const need = TIER[blockId] ?? 0;
  if (tool.tier < need) return [];

  const ore = ORES[blockId];
  if (ore) {
    if (tool.silk) return one(blockId);
    return one(ore.item, fortuneCount(roll(ore.min, ore.max), tool.fortune));
  }
  return one(blockId);
}

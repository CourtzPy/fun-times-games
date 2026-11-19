// Phase tables for One Block. A count of 1 is the usual stack, and 10 is rare.

export const PHASE_LENGTH = 300;

const THIN = new Set([
  "minecraft:oak_sapling",
  "minecraft:wheat_seeds",
  "minecraft:dandelion",
  "minecraft:poppy",
  "minecraft:red_mushroom",
  "minecraft:brown_mushroom",
  "minecraft:vine",
  "minecraft:kelp",
  "minecraft:water",
  "minecraft:cactus",
  "minecraft:bamboo",
  "minecraft:cocoa",
  "minecraft:cave_vines",
  "minecraft:cave_vines_body_with_berries",
  "minecraft:cave_vines_head_with_berries",
  "minecraft:candle",
  "minecraft:chorus_flower",
  "minecraft:chorus_plant",
  "minecraft:end_rod",
  "minecraft:short_grass",
  "minecraft:tall_grass",
  "minecraft:deadbush",
  "minecraft:seagrass",
  "minecraft:torch",
]);

export function isThinBlock(typeId) {
  return THIN.has(typeId);
}

const SINGLE = new Set([
  "minecraft:shears",
  "minecraft:iron_pickaxe",
  "minecraft:stone_pickaxe",
  "minecraft:fishing_rod",
  "minecraft:shield",
  "minecraft:name_tag",
  "minecraft:leather_helmet",
  "minecraft:leather_chestplate",
  "minecraft:leather_leggings",
  "minecraft:leather_boots",
  "minecraft:bucket",
  "minecraft:iron_leggings",
  "minecraft:elytra",
  "minecraft:cake",
]);

const LEATHER = [
  "minecraft:leather_helmet",
  "minecraft:leather_chestplate",
  "minecraft:leather_leggings",
  "minecraft:leather_boots",
];

function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

export function rollCount() {
  const weights = [48, 12, 6, 4, 3, 2, 2, 1, 1, 1];
  let roll = Math.floor(Math.random() * 80);
  for (let count = 1; count <= 10; count++) {
    roll -= weights[count - 1];
    if (roll < 0) return count;
  }
  return 1;
}

function amountFor(id) {
  return SINGLE.has(id) ? 1 : rollCount();
}

function stack(id, rare) {
  return { id, rare: rare === true };
}

export const phases = [
  {
    name: "Meadow",
    base: "minecraft:grass_block",
    hostileCommon: false,
    villager: true,
    blocks: [
      "minecraft:grass_block",
      "minecraft:dirt",
      "minecraft:oak_log",
      "minecraft:oak_wood",
      "minecraft:oak_planks",
      "minecraft:oak_leaves",
      "minecraft:coarse_dirt",
    ],
    hostile: ["minecraft:zombie", "minecraft:skeleton"],
    passive: ["minecraft:pig", "minecraft:cow", "minecraft:mooshroom", "minecraft:sheep", "minecraft:chicken"],
    chest: [
      stack("minecraft:bread"),
      stack("minecraft:apple"),
      stack("minecraft:bone_meal"),
      stack("minecraft:oak_sapling"),
      stack("minecraft:wheat_seeds"),
      stack("minecraft:dandelion"),
      stack("minecraft:poppy"),
      stack("minecraft:wheat"),
      stack("minecraft:carrot"),
      stack("minecraft:egg"),
      stack("minecraft:stick"),
      stack("minecraft:bowl"),
    ],
  },
  {
    name: "Dark Forest",
    base: "minecraft:podzol",
    hostileCommon: false,
    villager: true,
    blocks: [
      "minecraft:dark_oak_log",
      "minecraft:dark_oak_planks",
      "minecraft:dark_oak_leaves",
      "minecraft:podzol",
      "minecraft:rooted_dirt",
      "minecraft:moss_block",
    ],
    hostile: ["minecraft:spider", "minecraft:zombie", "minecraft:skeleton"],
    passive: ["minecraft:pig", "minecraft:chicken"],
    chest: [
      stack("minecraft:red_mushroom"),
      stack("minecraft:brown_mushroom"),
      stack("minecraft:vine"),
      stack("minecraft:dark_oak_sapling"),
      stack("minecraft:shears"),
      stack("minecraft:sweet_berries"),
      stack("minecraft:spider_eye"),
      stack("minecraft:string"),
      stack("minecraft:stick"),
      stack("minecraft:bowl"),
      stack("minecraft:rotten_flesh"),
      stack("minecraft:apple"),
    ],
  },
  {
    name: "Stone Mine",
    base: "minecraft:stone",
    hostileCommon: false,
    villager: true,
    blocks: [
      "minecraft:stone",
      "minecraft:cobblestone",
      "minecraft:coal_ore",
      "minecraft:iron_ore",
      "minecraft:andesite",
      "minecraft:granite",
      "minecraft:diorite",
    ],
    hostile: ["minecraft:silverfish", "minecraft:zombie", "minecraft:skeleton"],
    passive: ["minecraft:glow_squid", "minecraft:bat"],
    chest: [
      stack("minecraft:torch"),
      stack("minecraft:coal"),
      stack("minecraft:iron_pickaxe"),
      stack("minecraft:raw_iron"),
      stack("minecraft:iron_nugget"),
      stack("minecraft:cobblestone"),
      stack("minecraft:flint"),
      stack("minecraft:stick"),
      stack("minecraft:stone_pickaxe"),
      stack("minecraft:lantern"),
      stack("minecraft:rail"),
      stack("minecraft:iron_ingot"),
    ],
  },
  {
    name: "Deep Cavern",
    base: "minecraft:deepslate",
    hostileCommon: true,
    villager: true,
    blocks: [
      "minecraft:deepslate",
      "minecraft:deepslate_iron_ore",
      "minecraft:deepslate_diamond_ore",
      "minecraft:deepslate_redstone_ore",
      "minecraft:deepslate_gold_ore",
      "minecraft:deepslate_lapis_ore",
      "minecraft:tuff",
      "minecraft:copper_ore",
    ],
    hostile: ["minecraft:zombie", "minecraft:skeleton", "minecraft:creeper"],
    passive: ["minecraft:glow_squid", "minecraft:bat"],
    chest: [
      stack("minecraft:iron_ingot"),
      stack("minecraft:bread"),
      stack("minecraft:shield"),
      stack("minecraft:raw_iron"),
      stack("minecraft:raw_copper"),
      stack("minecraft:coal"),
      stack("minecraft:redstone"),
      stack("minecraft:lapis_lazuli"),
      stack("minecraft:copper_ingot"),
      stack("minecraft:torch"),
      stack("minecraft:deepslate"),
      stack("minecraft:cobbled_deepslate"),
    ],
  },
  {
    name: "Warm Ocean",
    base: "minecraft:sand",
    hostileCommon: true,
    villager: true,
    blocks: [
      "minecraft:sand",
      "minecraft:sandstone",
      "minecraft:prismarine",
      "minecraft:prismarine_bricks",
      "minecraft:tube_coral_block",
      "minecraft:sea_lantern",
    ],
    hostile: ["minecraft:drowned", "minecraft:guardian"],
    passive: ["minecraft:squid", "minecraft:turtle", "minecraft:tropicalfish"],
    chest: [
      stack("minecraft:fishing_rod"),
      stack("minecraft:kelp"),
      stack("minecraft:seagrass"),
      stack("minecraft:cod"),
      stack("minecraft:salmon"),
      stack("minecraft:tropical_fish"),
      stack("minecraft:prismarine_shard"),
      stack("minecraft:prismarine_crystals"),
      stack("minecraft:sand"),
      stack("minecraft:ink_sac"),
      stack("minecraft:cooked_cod"),
      stack("minecraft:pufferfish"),
      stack("minecraft:heart_of_the_sea", true),
    ],
  },
  {
    name: "Desert Temple",
    base: "minecraft:sandstone",
    hostileCommon: true,
    villager: true,
    blocks: [
      "minecraft:sand",
      "minecraft:sandstone",
      "minecraft:cut_sandstone",
      "minecraft:smooth_sandstone",
      "minecraft:chiseled_sandstone",
      "minecraft:gold_ore",
    ],
    hostile: ["minecraft:husk", "minecraft:skeleton", "minecraft:creeper"],
    passive: ["minecraft:rabbit", "minecraft:camel"],
    chest: [
      stack("minecraft:gold_ingot"),
      stack("minecraft:bone"),
      stack("minecraft:emerald"),
      stack("minecraft:cactus"),
      stack("minecraft:deadbush"),
      stack("minecraft:sandstone"),
      stack("minecraft:sand"),
      stack("minecraft:gunpowder"),
      stack("minecraft:gold_nugget"),
      stack("minecraft:rabbit_hide"),
      stack("minecraft:rotten_flesh"),
      stack("minecraft:stick"),
      stack("minecraft:enchanted_golden_apple", true),
    ],
  },
  {
    name: "Jungle Temple",
    base: "minecraft:moss_block",
    hostileCommon: true,
    villager: true,
    blocks: [
      "minecraft:jungle_log",
      "minecraft:jungle_planks",
      "minecraft:jungle_leaves",
      "minecraft:melon_block",
      "minecraft:moss_block",
      "minecraft:podzol",
    ],
    hostile: ["minecraft:zombie", "minecraft:skeleton"],
    passive: ["minecraft:ocelot", "minecraft:parrot", "minecraft:panda", "minecraft:mooshroom"],
    chest: [
      stack("minecraft:melon_seeds"),
      stack("minecraft:cocoa_beans"),
      stack("minecraft:bamboo"),
      stack("minecraft:name_tag"),
      stack("minecraft:emerald"),
      stack("minecraft:jungle_sapling"),
      stack("minecraft:melon_slice"),
      stack("minecraft:vine"),
      stack("minecraft:stick"),
      stack("minecraft:cookie"),
      stack("minecraft:apple"),
      stack("minecraft:bowl"),
    ],
  },
  {
    name: "Swamp Hut",
    base: "minecraft:mud",
    hostileCommon: true,
    villager: true,
    blocks: [
      "minecraft:mud",
      "minecraft:packed_mud",
      "minecraft:clay",
      "minecraft:oak_log",
      "minecraft:moss_block",
      "minecraft:slime_block",
    ],
    hostile: ["minecraft:slime", "minecraft:witch", "minecraft:zombie"],
    passive: ["minecraft:frog", "minecraft:chicken"],
    chest: [
      stack("minecraft:slime_ball"),
      stack("minecraft:glass_bottle"),
      stack("minecraft:redstone"),
      stack("minecraft:stick"),
      stack("minecraft:lily_pad"),
      stack("minecraft:vine"),
      stack("minecraft:clay_ball"),
      stack("minecraft:string"),
      stack("minecraft:spider_eye"),
      stack("minecraft:bowl"),
      stack("minecraft:blue_orchid"),
      stack("minecraft:seagrass"),
    ],
  },
  {
    name: "Frozen Peaks",
    base: "minecraft:snow_block",
    hostileCommon: true,
    villager: true,
    blocks: [
      "minecraft:snow_block",
      "minecraft:packed_ice",
      "minecraft:blue_ice",
      "minecraft:spruce_log",
      "minecraft:spruce_planks",
      "minecraft:emerald_ore",
    ],
    hostile: ["minecraft:stray", "minecraft:zombie"],
    passive: ["minecraft:goat", "minecraft:rabbit", "minecraft:fox"],
    chest: [
      stack("leather"),
      stack("minecraft:emerald"),
      stack("minecraft:pumpkin_pie"),
      stack("minecraft:snowball"),
      stack("minecraft:spruce_sapling"),
      stack("minecraft:sweet_berries"),
      stack("minecraft:rabbit_hide"),
      stack("minecraft:stick"),
      stack("minecraft:cooked_rabbit"),
      stack("minecraft:string"),
      stack("minecraft:packed_ice"),
      stack("minecraft:blue_ice"),
    ],
  },
  {
    name: "Lush Cave",
    base: "minecraft:moss_block",
    hostileCommon: true,
    villager: true,
    blocks: [
      "minecraft:moss_block",
      "minecraft:dripstone_block",
      "minecraft:clay",
      "minecraft:copper_ore",
      "minecraft:rooted_dirt",
      "minecraft:amethyst_block",
    ],
    hostile: ["minecraft:zombie", "minecraft:skeleton", "minecraft:drowned"],
    passive: ["minecraft:axolotl", "minecraft:glow_squid", "minecraft:mooshroom"],
    chest: [
      stack("minecraft:glow_berries"),
      stack("minecraft:copper_ingot"),
      stack("minecraft:bucket"),
      stack("minecraft:raw_copper"),
      stack("minecraft:amethyst_shard"),
      stack("minecraft:clay_ball"),
      stack("minecraft:moss_block"),
      stack("minecraft:bone_meal"),
      stack("minecraft:glow_ink_sac"),
      stack("minecraft:spore_blossom"),
      stack("minecraft:hanging_roots"),
      stack("minecraft:slime_ball"),
    ],
  },
  {
    name: "Ancient City",
    base: "minecraft:deepslate_tiles",
    hostileCommon: true,
    blocks: [
      "minecraft:sculk",
      "minecraft:deepslate_tiles",
      "minecraft:deepslate_bricks",
      "minecraft:cobbled_deepslate",
      "minecraft:chiseled_deepslate",
      "minecraft:white_wool",
    ],
    hostile: ["minecraft:zombie", "minecraft:skeleton"],
    passive: ["minecraft:sniffer", "minecraft:glow_squid"],
    chest: [
      stack("minecraft:echo_shard"),
      stack("minecraft:disc_fragment_5"),
      stack("minecraft:iron_leggings"),
      stack("minecraft:candle"),
      stack("minecraft:sculk"),
      stack("minecraft:cobbled_deepslate"),
      stack("minecraft:soul_lantern"),
      stack("minecraft:compass"),
      stack("minecraft:iron_ingot"),
      stack("minecraft:bone"),
      stack("minecraft:string"),
      stack("minecraft:deepslate_tiles"),
    ],
  },
  {
    name: "Nether Wastes",
    base: "minecraft:netherrack",
    hostileCommon: true,
    blocks: [
      "minecraft:netherrack",
      "minecraft:nether_bricks",
      "minecraft:nether_quartz_ore",
      "minecraft:glowstone",
      "minecraft:soul_sand",
      "minecraft:magma",
      "minecraft:blackstone",
    ],
    hostile: ["minecraft:zombie_pigman", "minecraft:magma_cube", "minecraft:ghast"],
    passive: ["minecraft:strider", "minecraft:happy_ghast"],
    chest: [
      stack("minecraft:quartz"),
      stack("minecraft:gold_ingot"),
      stack("potion"),
      stack("minecraft:netherite_scrap"),
      stack("minecraft:gold_nugget"),
      stack("minecraft:nether_brick"),
      stack("minecraft:magma_cream"),
      stack("minecraft:glowstone_dust"),
      stack("minecraft:soul_sand"),
      stack("minecraft:netherrack"),
      stack("minecraft:blackstone"),
      stack("minecraft:fire_charge"),
    ],
  },
  {
    name: "Crimson Forest",
    base: "minecraft:crimson_nylium",
    hostileCommon: true,
    blocks: [
      "minecraft:crimson_stem",
      "minecraft:crimson_planks",
      "minecraft:crimson_nylium",
      "minecraft:nether_wart_block",
      "minecraft:shroomlight",
      "minecraft:netherrack",
    ],
    hostile: ["minecraft:hoglin", "minecraft:zombie_pigman"],
    passive: ["minecraft:strider", "minecraft:happy_ghast"],
    chest: [
      stack("minecraft:nether_wart"),
      stack("minecraft:crimson_fungus"),
      stack("minecraft:weeping_vines"),
      stack("minecraft:gold_ingot"),
      stack("minecraft:netherite_scrap"),
      stack("minecraft:crimson_roots"),
      stack("minecraft:nether_wart_block"),
      stack("minecraft:gold_nugget"),
      stack("minecraft:leather"),
      stack("minecraft:nether_brick"),
      stack("minecraft:shroomlight"),
      stack("minecraft:crimson_nylium"),
    ],
  },
  {
    name: "The End",
    base: "minecraft:end_stone",
    hostileCommon: true,
    blocks: [
      "minecraft:end_stone",
      "minecraft:end_stone_bricks",
      "minecraft:obsidian",
      "minecraft:crying_obsidian",
      "minecraft:purpur_block",
      "minecraft:purpur_pillar",
    ],
    hostile: ["minecraft:enderman", "minecraft:endermite"],
    passive: ["minecraft:allay", "minecraft:bat"],
    chest: [
      stack("minecraft:ender_pearl"),
      stack("minecraft:chorus_fruit"),
      stack("minecraft:chorus_flower"),
      stack("minecraft:diamond"),
      stack("minecraft:netherite_scrap"),
      stack("minecraft:end_stone"),
      stack("minecraft:obsidian"),
      stack("minecraft:purpur_block"),
      stack("minecraft:popped_chorus_fruit"),
      stack("minecraft:end_stone_bricks"),
      stack("minecraft:purpur_pillar"),
      stack("minecraft:crying_obsidian"),
    ],
  },
  {
    name: "End City",
    base: "minecraft:end_stone_bricks",
    hostileCommon: true,
    endless: true,
    blocks: [
      "minecraft:purpur_block",
      "minecraft:purpur_pillar",
      "minecraft:end_stone_bricks",
      "minecraft:end_stone",
      "minecraft:obsidian",
      "minecraft:crying_obsidian",
    ],
    hostile: ["minecraft:shulker", "minecraft:enderman"],
    passive: ["minecraft:allay", "minecraft:bat"],
    chest: [
      stack("minecraft:diamond"),
      stack("minecraft:dragon_breath"),
      stack("minecraft:end_rod"),
      stack("minecraft:netherite_scrap"),
      stack("minecraft:shulker_shell"),
      stack("minecraft:purpur_block"),
      stack("minecraft:end_stone_bricks"),
      stack("minecraft:chorus_fruit"),
      stack("minecraft:ender_pearl"),
      stack("minecraft:obsidian"),
      stack("minecraft:popped_chorus_fruit"),
      stack("minecraft:iron_ingot"),
      stack("minecraft:elytra", true),
    ],
  },
];

export const CHEST_EVERY = 50;
export const TOOL_EVERY = 150;

const RARITY = {
  "minecraft:grass_block": 28,
  "minecraft:dirt": 28,
  "minecraft:coarse_dirt": 16,
  "minecraft:oak_log": 18,
  "minecraft:oak_wood": 10,
  "minecraft:oak_planks": 14,
  "minecraft:oak_leaves": 18,
  "minecraft:dark_oak_log": 16,
  "minecraft:dark_oak_planks": 10,
  "minecraft:dark_oak_leaves": 16,
  "minecraft:podzol": 14,
  "minecraft:rooted_dirt": 8,
  "minecraft:moss_block": 12,
  "minecraft:stone": 28,
  "minecraft:cobblestone": 20,
  "minecraft:coal_ore": 10,
  "minecraft:iron_ore": 6,
  "minecraft:andesite": 16,
  "minecraft:granite": 14,
  "minecraft:diorite": 14,
  "minecraft:deepslate": 22,
  "minecraft:deepslate_iron_ore": 4,
  "minecraft:deepslate_diamond_ore": 1,
  "minecraft:deepslate_redstone_ore": 3,
  "minecraft:deepslate_gold_ore": 2,
  "minecraft:deepslate_lapis_ore": 2,
  "minecraft:tuff": 12,
  "minecraft:copper_ore": 8,
  "minecraft:sand": 24,
  "minecraft:sandstone": 16,
  "minecraft:cut_sandstone": 8,
  "minecraft:smooth_sandstone": 6,
  "minecraft:chiseled_sandstone": 4,
  "minecraft:gold_ore": 3,
  "minecraft:prismarine": 4,
  "minecraft:prismarine_bricks": 3,
  "minecraft:tube_coral_block": 8,
  "minecraft:sea_lantern": 2,
  "minecraft:jungle_log": 16,
  "minecraft:jungle_planks": 10,
  "minecraft:jungle_leaves": 16,
  "minecraft:melon_block": 6,
  "minecraft:mud": 16,
  "minecraft:packed_mud": 6,
  "minecraft:clay": 10,
  "minecraft:slime_block": 2,
  "minecraft:snow_block": 18,
  "minecraft:packed_ice": 8,
  "minecraft:blue_ice": 3,
  "minecraft:spruce_log": 16,
  "minecraft:spruce_planks": 10,
  "minecraft:emerald_ore": 1,
  "minecraft:dripstone_block": 10,
  "minecraft:amethyst_block": 4,
  "minecraft:sculk": 4,
  "minecraft:deepslate_tiles": 4,
  "minecraft:deepslate_bricks": 4,
  "minecraft:cobbled_deepslate": 12,
  "minecraft:chiseled_deepslate": 2,
  "minecraft:white_wool": 4,
  "minecraft:netherrack": 28,
  "minecraft:nether_bricks": 6,
  "minecraft:nether_quartz_ore": 8,
  "minecraft:glowstone": 5,
  "minecraft:soul_sand": 10,
  "minecraft:magma": 8,
  "minecraft:blackstone": 14,
  "minecraft:crimson_stem": 14,
  "minecraft:crimson_planks": 8,
  "minecraft:crimson_nylium": 14,
  "minecraft:nether_wart_block": 8,
  "minecraft:shroomlight": 3,
  "minecraft:end_stone": 24,
  "minecraft:end_stone_bricks": 8,
  "minecraft:obsidian": 5,
  "minecraft:crying_obsidian": 2,
  "minecraft:purpur_block": 6,
  "minecraft:purpur_pillar": 4,
};

function weightOf(id) {
  return RARITY[id] ?? 8;
}

function pickWeighted(ids) {
  let total = 0;
  for (const id of ids) total += weightOf(id);
  let roll = Math.random() * total;
  for (const id of ids) {
    roll -= weightOf(id);
    if (roll < 0) return id;
  }
  return ids[ids.length - 1];
}

function chestEntry(entry) {
  if (entry.id === "leather") return { id: pick(LEATHER), amount: 1 };
  if (entry.id === "potion") return { id: "potion", amount: 1 };
  return { id: entry.id, amount: amountFor(entry.id) };
}

export function rollKind(phase, breaksSinceChest, breaksSinceTool) {
  if (breaksSinceTool + 1 >= TOOL_EVERY) return "tool";
  if (Math.random() < 0.005) return "food";
  if (breaksSinceChest + 1 >= CHEST_EVERY) return "chest";
  if (phase.villager && Math.random() < 0.01) return "villager";
  if (Math.random() < 0.005) return "trader";
  const mobChance = phase.hostileCommon ? 0.15 : 0.08;
  if (Math.random() < mobChance) return "mob";
  return "block";
}

export function rollBlock(phase) {
  return pickWeighted(phase.blocks);
}

export function rollMob(phase) {
  const hostileChance = phase.hostileCommon ? 0.7 : 0.4;
  const list = Math.random() < hostileChance ? phase.hostile : phase.passive;
  return pick(list);
}

export function phaseChestItems(phase) {
  const ordinary = phase.chest.filter((entry) => !entry.rare);
  const shuffled = ordinary.slice().sort(() => Math.random() - 0.5);
  const items = [];
  const skipped = [];
  for (const entry of shuffled) {
    if (Math.random() > 0.6) skipped.push(entry);
    else items.push(chestEntry(entry));
  }
  for (const entry of skipped) {
    if (items.length >= 7) break;
    items.push(chestEntry(entry));
  }
  for (const entry of phase.chest) {
    if (!entry.rare || Math.random() > 0.12) continue;
    items.push(chestEntry(entry));
  }
  return items;
}

const ARMOR = [
  ["leather", 25],
  ["chainmail", 25],
  ["golden", 20],
  ["iron", 20],
  ["diamond", 7],
  ["netherite", 3],
];

const TOOLS = [
  ["wooden", 25],
  ["stone", 25],
  ["golden", 20],
  ["iron", 20],
  ["diamond", 7],
  ["netherite", 3],
];

function rollMaterial(table, fallback) {
  let roll = Math.random() * 100;
  for (const [material, chance] of table) {
    roll -= chance;
    if (roll < 0) return material;
  }
  return fallback;
}

function gear(table, fallback, pieces) {
  return pieces.map((piece) => ({
    id: `minecraft:${rollMaterial(table, fallback)}_${piece}`,
    amount: 1,
  }));
}

export function toolChestItems() {
  return gear(ARMOR, "leather", ["helmet", "chestplate", "leggings", "boots"]).concat(
    gear(TOOLS, "wooden", ["sword", "axe", "pickaxe"])
  );
}

export function foodChestItems() {
  const items = [
    { id: "minecraft:bread", amount: rollCount() },
    { id: "minecraft:cake", amount: 1 },
    { id: "minecraft:potato", amount: rollCount() },
    { id: "minecraft:carrot", amount: rollCount() },
  ];
  if (Math.random() < 0.5) items.push({ id: "minecraft:golden_apple", amount: 1 });
  return items;
}

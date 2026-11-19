import { world, system, ItemStack, Potions, EquipmentSlot, GameMode } from "@minecraft/server";
import { blockDrops } from "./drops.js";
import {
  PHASE_LENGTH,
  phases,
  rollKind,
  rollBlock,
  rollMob,
  phaseChestItems,
  foodChestItems,
  toolChestItems,
  isThinBlock,
  CHEST_EVERY,
} from "./phases.js";

const BLOCK = { x: 0, y: 64, z: 0 };
const STAND = { x: 0.5, y: 68.5, z: 0.5 };
const FEET = { x: 0.5, y: 65, z: 0.5 };
const HOP = { x: 0.5, y: 65.5, z: 0.5 };
const TIMER_TAG = "oneblock_timer";

const KEY_PHASE = "obPhase";
const KEY_BREAKS = "obBreaks";
const KEY_TRANSITION = "obTransition";
const KEY_CHEST = "obChestGap";
const KEY_TOOL = "obToolGap";
const TOOL_STRUCTURE = "oneblock:tool_equip";

let replacing = false;
let holdTicks = 0;

function overworld() {
  return world.getDimension("minecraft:overworld");
}

function readNumber(key, fallback) {
  const value = world.getDynamicProperty(key);
  return typeof value === "number" ? value : fallback;
}

function phaseIndex() {
  return readNumber(KEY_PHASE, 0);
}

function breaks() {
  return readNumber(KEY_BREAKS, 0);
}

function transitionLeft() {
  return readNumber(KEY_TRANSITION, 0);
}

function chestGap() {
  return readNumber(KEY_CHEST, 0);
}

function toolGap() {
  return readNumber(KEY_TOOL, 0);
}

function currentPhase() {
  return phases[phaseIndex()] ?? phases[0];
}

function blockAt() {
  return overworld().getBlock(BLOCK);
}

function isOneBlock(location) {
  return Math.floor(location.x) === BLOCK.x && Math.floor(location.y) === BLOCK.y && Math.floor(location.z) === BLOCK.z;
}

function setBlock(typeId) {
  const block = blockAt();
  if (block) block.setType(typeId);
}

function ensureState() {
  if (typeof world.getDynamicProperty(KEY_PHASE) !== "number") {
    world.setDynamicProperty(KEY_PHASE, 0);
    world.setDynamicProperty(KEY_BREAKS, 0);
    world.setDynamicProperty(KEY_TRANSITION, 0);
    world.setDynamicProperty(KEY_CHEST, 0);
    world.setDynamicProperty(KEY_TOOL, 0);
  }
  if (typeof world.getDynamicProperty(KEY_CHEST) !== "number") {
    world.setDynamicProperty(KEY_CHEST, 0);
  }
  if (typeof world.getDynamicProperty(KEY_TOOL) !== "number") {
    world.setDynamicProperty(KEY_TOOL, 0);
  }
}

function applyRules() {
  try {
    world.gameRules.doMobSpawning = false;
    world.gameRules.keepInventory = false;
    world.gameRules.doImmediateRespawn = true;
  } catch (error) {
    console.warn(`One Block could not set game rules: ${error}`);
  }
}

function itemStack(entry) {
  if (entry.id === "potion") {
    return Potions.resolve("minecraft:fire_resistance", "minecraft:potion");
  }
  return new ItemStack(entry.id, entry.amount);
}

function fillChest(items, attempt) {
  const block = blockAt();
  const inventory = block?.getComponent("minecraft:inventory");
  const container = inventory?.container;
  if (!container) {
    if (attempt < 5) system.run(() => fillChest(items, attempt + 1));
    return;
  }
  items.forEach((entry, slot) => {
    try {
      container.setItem(slot, itemStack(entry));
    } catch (error) {
      console.warn(`One Block could not add ${entry.id}: ${error}`);
    }
  });
}

function placeChest(items, named) {
  if (named) {
    let placed = false;
    try {
      world.structureManager.place(TOOL_STRUCTURE, overworld(), BLOCK);
      placed = blockAt()?.typeId === "minecraft:chest";
    } catch (error) {
      console.warn(`One Block could not place Tool Equip: ${error}`);
    }
    if (!placed) setBlock("minecraft:chest");
  } else {
    setBlock("minecraft:chest");
  }
  system.run(() => fillChest(items, 0));
}

function spawnMob(typeId) {
  try {
    overworld().spawnEntity(typeId, FEET);
  } catch (error) {
    console.warn(`One Block could not spawn ${typeId}: ${error}`);
  }
}

function itemForBlock(typeId) {
  if (typeId === "minecraft:cocoa") return "minecraft:cocoa_beans";
  if (typeId === "minecraft:cave_vines" || typeId.startsWith("minecraft:cave_vines_")) return "minecraft:glow_berries";
  if (typeId === "minecraft:water" || typeId === "minecraft:flowing_water") return undefined;
  return typeId;
}

function enchantLevel(item, names) {
  const enchantable = item?.getComponent("minecraft:enchantable");
  if (!enchantable) return 0;
  for (const id of names) {
    try {
      const level = enchantable.getEnchantment(id)?.level ?? 0;
      if (level > 0) return level;
    } catch (error) {
      // This id is not the one this version uses.
    }
  }
  return 0;
}

function unbreakingLevel(item) {
  return enchantLevel(item, ["unbreaking", "minecraft:unbreaking"]);
}

function toolInfo(player) {
  let item;
  try {
    item = player?.getComponent("minecraft:equippable")?.getEquipment(EquipmentSlot.Mainhand);
  } catch (error) {
    item = undefined;
  }
  const id = item?.typeId ?? "";
  let tier = 0;
  if (id.includes("pickaxe")) {
    if (id.includes("netherite") || id.includes("diamond")) tier = 4;
    else if (id.includes("iron")) tier = 3;
    else if (id.includes("stone")) tier = 2;
    else tier = 1;
  }
  return {
    tier,
    silk: enchantLevel(item, ["silk_touch", "minecraft:silk_touch"]) > 0,
    fortune: enchantLevel(item, ["fortune", "minecraft:fortune"]),
    shears: id === "minecraft:shears",
    shovel: id.includes("shovel"),
  };
}

function giveStack(player, itemId, amount) {
  if (!itemId || amount <= 0) return;
  let stack;
  try {
    stack = new ItemStack(itemId, amount);
  } catch (error) {
    console.warn(`One Block could not make ${itemId}: ${error}`);
    return;
  }
  try {
    const container = player?.getComponent("minecraft:inventory")?.container;
    if (container) {
      const leftover = container.addItem(stack);
      if (!leftover || leftover.amount <= 0) return;
      overworld().spawnItem(leftover, HOP);
      return;
    }
  } catch (error) {
    console.warn(`One Block could not give ${itemId}: ${error}`);
  }
  try {
    overworld().spawnItem(stack, HOP);
  } catch (error) {
    console.warn(`One Block could not drop ${itemId}: ${error}`);
  }
}

function giveDrops(player, blockId) {
  for (const drop of blockDrops(blockId, toolInfo(player))) {
    giveStack(player, drop.id, drop.amount);
  }
}

function wearTool(player) {
  try {
    const mode = player.getGameMode();
    if (mode === GameMode.creative || mode === GameMode.spectator) return;
  } catch (error) {
    // Survival still wears the tool if the game mode cannot be read.
  }
  let equippable;
  try {
    equippable = player.getComponent("minecraft:equippable");
  } catch (error) {
    return;
  }
  const item = equippable?.getEquipment(EquipmentSlot.Mainhand);
  if (!item) return;
  const durability = item.getComponent("minecraft:durability");
  if (!durability) return;
  const unbreaking = unbreakingLevel(item);
  if (Math.random() >= 1 / (unbreaking + 1)) return;
  durability.damage += 1;
  try {
    if (durability.damage >= durability.maxDurability) {
      equippable.setEquipment(EquipmentSlot.Mainhand, undefined);
      player.playSound("random.break");
      return;
    }
    equippable.setEquipment(EquipmentSlot.Mainhand, item);
  } catch (error) {
    console.warn(`One Block could not wear the tool: ${error}`);
  }
}

function giveItem(player, typeId) {
  giveStack(player, itemForBlock(typeId), 1);
}

function placeRolledBlock(typeId) {
  if (isThinBlock(typeId)) {
    setBlock(currentPhase().base);
    const holder = world.getPlayers().find(inColumn) ?? world.getPlayers()[0];
    if (holder) giveItem(holder, typeId);
    return;
  }
  setBlock(typeId);
}

function placeRoll() {
  const phase = currentPhase();
  const since = chestGap();
  const sinceTool = toolGap();
  const kind = rollKind(phase, since, sinceTool);
  if (kind !== "food") {
    const chestDue = since + 1 >= CHEST_EVERY;
    world.setDynamicProperty(KEY_CHEST, kind === "chest" ? 0 : chestDue ? CHEST_EVERY - 1 : since + 1);
  }
  world.setDynamicProperty(KEY_TOOL, kind === "tool" ? 0 : sinceTool + 1);
  if (kind === "food") {
    placeChest(foodChestItems());
    return;
  }
  if (kind === "tool") {
    placeChest(toolChestItems(), true);
    return;
  }
  if (kind === "chest") {
    placeChest(phaseChestItems(phase));
    return;
  }
  if (kind === "trader") {
    setBlock(phase.base);
    spawnMob("minecraft:wandering_trader");
    return;
  }
  if (kind === "villager") {
    setBlock(phase.base);
    spawnMob("minecraft:villager");
    return;
  }
  if (kind === "mob") {
    setBlock(phase.base);
    spawnMob(rollMob(phase));
    return;
  }
  placeRolledBlock(rollBlock(phase));
}

function clearTimers() {
  for (const entity of overworld().getEntities({ tags: [TIMER_TAG] })) {
    entity.remove();
  }
}

function showTimer(seconds) {
  let stand = overworld().getEntities({ tags: [TIMER_TAG] })[0];
  if (!stand) {
    try {
      stand = overworld().spawnEntity("oneblock:timer", STAND);
      stand.addTag(TIMER_TAG);
    } catch (error) {
      try {
        stand = overworld().spawnEntity("minecraft:armor_stand", STAND);
        stand.addTag(TIMER_TAG);
      } catch (backupError) {
        console.warn(`One Block could not create the timer: ${backupError}`);
        return;
      }
    }
  }
  stand.nameTag = `§e${seconds}`;
  try {
    stand.teleport(STAND);
  } catch (error) {
    console.warn(`One Block could not move the timer: ${error}`);
  }
}

function finishTransition() {
  clearTimers();
  const phase = currentPhase();
  setBlock(phase.base);
  const number = phaseIndex() + 1;
  for (const player of world.getPlayers()) {
    player.onScreenDisplay.setTitle(phase.name, {
      subtitle: `Phase ${number}`,
      fadeInDuration: 10,
      stayDuration: 60,
      fadeOutDuration: 20,
    });
    player.playSound("firework.blast");
  }
}

function startTransition() {
  const next = Math.min(phaseIndex() + 1, phases.length - 1);
  world.setDynamicProperty(KEY_PHASE, next);
  world.setDynamicProperty(KEY_BREAKS, 0);
  world.setDynamicProperty(KEY_TRANSITION, 30);
  setBlock("minecraft:bedrock");
  clearTimers();
  showTimer(30);
}

function restorePlatform() {
  if (transitionLeft() > 0) {
    setBlock("minecraft:bedrock");
    return;
  }
  const block = blockAt();
  if (!block || block.typeId === "minecraft:air") setBlock(currentPhase().base);
}

function standOnBlock(player) {
  try {
    player.teleport(FEET, { checkForBlocks: false });
  } catch (error) {
    console.warn(`One Block could not place the player on the block: ${error}`);
  }
}

function anchorPlayer(player) {
  try {
    player.setSpawnPoint({ dimension: overworld(), x: 0, y: 64, z: 0 });
  } catch (error) {
    console.warn(`One Block could not set the spawn: ${error}`);
  }
  standOnBlock(player);
}

function inColumn(player) {
  return Math.abs(player.location.x - 0.5) <= 1.2 && Math.abs(player.location.z - 0.5) <= 1.2;
}

function standingOnBlock(player) {
  return inColumn(player) && player.location.y >= 64.4 && player.location.y < 66.2;
}

function hopPlayer(player) {
  try {
    player.teleport(HOP, { checkForBlocks: false });
  } catch (error) {
    console.warn(`One Block could not hop the player: ${error}`);
  }
}

function liftPlayers() {
  for (const player of world.getPlayers()) {
    if (!inColumn(player) || player.location.y >= 64.9) continue;
    try {
      player.teleport(FEET, { checkForBlocks: false });
    } catch (error) {
      player.teleport(FEET);
    }
  }
}

function supportPlayers() {
  const block = blockAt();
  const missing = !block || block.typeId === "minecraft:air";
  const thin = block && isThinBlock(block.typeId);
  if (!replacing && transitionLeft() <= 0 && (missing || thin)) {
    if (thin) {
      const holder = world.getPlayers().find(inColumn) ?? world.getPlayers()[0];
      if (holder) giveItem(holder, block.typeId);
    }
    setBlock(currentPhase().base);
  } else if (missing && !replacing && transitionLeft() > 0) {
    setBlock("minecraft:bedrock");
  }
  if (missing || thin) liftPlayers();
  if (holdTicks > 0) holdTicks -= 1;
}

function tick() {
  const left = transitionLeft();
  if (left > 0) {
    setBlock("minecraft:bedrock");
    showTimer(left);
    if (left === 1) {
      world.setDynamicProperty(KEY_TRANSITION, 0);
      finishTransition();
    } else {
      world.setDynamicProperty(KEY_TRANSITION, left - 1);
    }
    return;
  }
  if (!replacing) restorePlatform();
}

function onBreak(event) {
  if (!isOneBlock(event.block.location)) return;
  if (transitionLeft() > 0) {
    event.cancel = true;
    return;
  }
  const typeId = event.block.typeId;
  const breaker = event.player;
  const keepVanillaBreak = typeId === "minecraft:chest";
  if (!keepVanillaBreak) event.cancel = true;
  const phase = currentPhase();
  const spent = breaks() + 1;
  const phaseChange = !phase.endless && spent >= PHASE_LENGTH;
  const hopBreaker = standingOnBlock(breaker);
  replacing = true;
  holdTicks = 15;
  const bounce = () => {
    if (hopBreaker) hopPlayer(breaker);
  };
  system.run(() => {
    try {
      if (!phaseChange) world.setDynamicProperty(KEY_BREAKS, spent);
      if (!keepVanillaBreak) {
        giveDrops(breaker, typeId);
        wearTool(breaker);
      }
      if (phaseChange) startTransition();
      else placeRoll();
      bounce();
    } finally {
      replacing = false;
    }
  });
  for (const delay of [1, 2, 3]) system.runTimeout(bounce, delay);
}

function startup() {
  ensureState();
  applyRules();
  restorePlatform();
  for (const player of world.getPlayers()) anchorPlayer(player);
}

world.afterEvents.worldLoad.subscribe(() => system.run(startup));
world.beforeEvents.playerBreakBlock.subscribe(onBreak);
world.afterEvents.playerSpawn.subscribe((event) => {
  const player = event.player;
  const settle = () => {
    restorePlatform();
    anchorPlayer(player);
  };
  system.run(settle);
  for (const delay of [1, 3, 8]) system.runTimeout(settle, delay);
});

system.runInterval(tick, 20);
system.runInterval(supportPlayers, 1);
system.run(startup);

#!/usr/bin/env python3
"""Build One Block.mcworld, a void world that imports as a Minecraft Bedrock world."""

import os
import random
import struct
import zipfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BP = os.path.join(ROOT, "behavior_pack")
RP = os.path.join(ROOT, "resource_pack")
OUT = os.path.join(ROOT, "One Block.mcworld")

FLAT = (
    '{"biome_id":1,"block_layers":[],"encoding_version":6,'
    '"structure_options":null,"world_version":"version.post_1_18"}'
)


def _name(text):
    raw = text.encode("utf-8")
    return struct.pack("<H", len(raw)) + raw


def _named(kind, key, payload):
    return bytes([kind]) + _name(key) + payload


def byte(key, value):
    return _named(1, key, struct.pack("<b", value))


def int_tag(key, value):
    return _named(3, key, struct.pack("<i", value))


def long_tag(key, value):
    return _named(4, key, struct.pack("<q", value))


def float_tag(key, value):
    return _named(5, key, struct.pack("<f", value))


def string_tag(key, value):
    return _named(8, key, _name(value))


def int_list(key, values):
    payload = bytes([3]) + struct.pack("<i", len(values))
    for value in values:
        payload += struct.pack("<i", value)
    return _named(9, key, payload)


def list_tag(key, elem_type, payloads):
    body = bytes([elem_type]) + struct.pack("<i", len(payloads))
    for payload in payloads:
        body += payload
    return _named(9, key, body)


def empty_list(key):
    return _named(9, key, bytes([0]) + struct.pack("<i", 0))


def tool_equip_structure():
    """A 1-block chest whose container title is Tool Equip."""
    chest = b"".join(
        [
            string_tag("name", "minecraft:chest"),
            compound("states", string_tag("minecraft:cardinal_direction", "south")),
            int_tag("version", 18163713),
        ]
    ) + b"\x00"
    entity = b"".join(
        [
            string_tag("CustomName", "Tool Equip"),
            byte("Findable", 0),
            string_tag("id", "Chest"),
            byte("isMovable", 1),
            empty_list("Items"),
            int_tag("x", 0),
            int_tag("y", 0),
            int_tag("z", 0),
        ]
    )
    palette = compound(
        "default",
        list_tag("block_palette", 10, [chest])
        + compound("block_position_data", compound("0", compound("block_entity_data", entity))),
    )
    structure = compound(
        "structure",
        list_tag("block_indices", 9, [
            bytes([3]) + struct.pack("<i", 1) + struct.pack("<i", 0),
            bytes([3]) + struct.pack("<i", 1) + struct.pack("<i", -1),
        ])
        + empty_list("entities")
        + compound("palette", palette),
    )
    root = b"".join(
        [
            int_tag("format_version", 1),
            int_list("size", [1, 1, 1]),
            structure,
            int_list("structure_world_origin", [0, 0, 0]),
        ]
    )
    return bytes([10]) + _name("") + root + b"\x00"


def write_tool_equip_structure():
    folder = os.path.join(BP, "structures", "oneblock")
    os.makedirs(folder, exist_ok=True)
    path = os.path.join(folder, "tool_equip.mcstructure")
    with open(path, "wb") as handle:
        handle.write(tool_equip_structure())
    return path


def compound(key, inner):
    return _named(10, key, inner + b"\x00")


def level_dat():
    abilities = b"".join(
        [
            byte("attackmobs", 1),
            byte("attackplayers", 1),
            byte("build", 1),
            byte("doorsandswitches", 1),
            byte("flying", 0),
            float_tag("flySpeed", 0.05),
            byte("instabuild", 0),
            byte("invulnerable", 0),
            byte("lightning", 0),
            byte("mayfly", 0),
            byte("mine", 1),
            byte("mute", 0),
            byte("noclip", 0),
            byte("op", 0),
            byte("opencontainers", 1),
            byte("teleport", 0),
            float_tag("verticalFlySpeed", 1.0),
            float_tag("walkSpeed", 0.1),
        ]
    )
    body = b"".join(
        [
            compound("abilities", abilities),
            string_tag("baseGameVersion", "*"),
            byte("bonusChestEnabled", 0),
            byte("bonusChestSpawned", 1),
            byte("CenterMapsToOrigin", 0),
            byte("cheatsEnabled", 0),
            byte("commandsEnabled", 0),
            byte("ConfirmedPlatformLockedContent", 0),
            long_tag("currentTick", 0),
            int_tag("Difficulty", 2),
            byte("dodaylightcycle", 1),
            byte("doimmediaterespawn", 1),
            byte("domobspawning", 0),
            string_tag("FlatWorldLayers", FLAT),
            byte("ForceGameType", 1),
            int_tag("GameType", 0),
            int_tag("Generator", 5),
            byte("hasBeenLoadedInCreative", 0),
            string_tag("InventoryVersion", "1.21.100"),
            byte("isCreatedInEditor", 0),
            byte("isFromWorldTemplate", 0),
            byte("keepinventory", 0),
            byte("LANBroadcast", 1),
            byte("LANBroadcastIntent", 1),
            int_list("lastOpenedWithVersion", [1, 21, 100, 0, 0]),
            string_tag("LevelName", "One Block"),
            int_tag("LimitedWorldOriginX", 0),
            int_tag("LimitedWorldOriginY", 64),
            int_tag("LimitedWorldOriginZ", 0),
            int_list("MinimumCompatibleClientVersion", [1, 21, 90, 0, 0]),
            long_tag("RandomSeed", random.randint(1, 2**62)),
            byte("spawnMobs", 0),
            int_tag("SpawnX", 0),
            int_tag("SpawnY", 65),
            int_tag("SpawnZ", 0),
            int_tag("StorageVersion", 10),
            byte("texturePacksRequired", 0),
            long_tag("Time", 1000),
            int_tag("worldStartCount", 1),
        ]
    )
    payload = bytes([10]) + _name("") + body + b"\x00"
    return struct.pack("<II", 10, len(payload)) + payload


def add_tree(archive, source, destination):
    for dirpath, _, filenames in os.walk(source):
        for filename in filenames:
            if filename == ".DS_Store":
                continue
            full = os.path.join(dirpath, filename)
            rel = os.path.relpath(full, source).replace(os.sep, "/")
            archive.write(full, f"{destination}/{rel}")


def main():
    write_tool_equip_structure()
    icon = os.path.join(ROOT, "world_icon.jpeg")
    png = os.path.join(BP, "pack_icon.png")
    if os.path.exists(png):
        os.system(f'sips -s format jpeg "{png}" --out "{icon}" >/dev/null')

    if os.path.exists(OUT):
        os.remove(OUT)
    with zipfile.ZipFile(OUT, "w", compression=zipfile.ZIP_DEFLATED) as archive:
        archive.writestr("level.dat", level_dat())
        archive.writestr("levelname.txt", "One Block\n")
        archive.writestr(
            "world_behavior_packs.json",
            '[{"pack_id":"5a7f3f2a-3f29-49b8-ae8d-e0e25cc6c85c","version":[1,1,0]}]',
        )
        archive.writestr(
            "world_resource_packs.json",
            '[{"pack_id":"3924bd1f-3ee6-430e-a7f2-e3e9dacaa002","version":[1,1,0]}]',
        )
        add_tree(archive, BP, "behavior_packs/One Block BP")
        add_tree(archive, RP, "resource_packs/One Block RP")
        if os.path.exists(icon):
            archive.write(icon, "world_icon.jpeg")
    if os.path.exists(icon):
        os.remove(icon)
    print(OUT)


if __name__ == "__main__":
    main()

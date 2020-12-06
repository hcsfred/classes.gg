from datetime import datetime

from db.json_database_engine import JSONDatabaseEngine
from model.attachment import *
from model.player import Player
from model.weapon import Weapon


USERNAME = "teepee"
LOADOUT = Weapon.VLK_ROGUE.value
ORIGIN = "MW"
SOURCE = "https://tinyurl.com/teep-classes"
COMMAND, MESSAGE = (None, "")
ATTACHMENTS = [
    Muzzle.FORGE_TAC_MARAUDER,
    Barrel.WARLORD,
    Laser.MW_LASER_5,
    # Optic.VLK_3X_OPTIC,
    Stock.NO_STOCK,
    # Underbarrel.MERC_FOREGRIP,
    Ammunition.DRAGONS_BREATH_ROUNDS_8R,
    # RearGrip.STIPPLED_GRIP_TAPE,
    # Perk.SLEIGHT_OF_HAND,
    # TriggerAction.LIGHTWEIGHT_TRIGGER
]


def _add_loadout():
    db = JSONDatabaseEngine()
    player = db.select_player(USERNAME)
    attachments = {attachment.get_type(): attachment.value for attachment in ATTACHMENTS}

    _print_validation(player, attachments)
    confirmation = input("Confirm? ")

    if confirmation == "y":
        player.last_updated = datetime.now().isoformat()
        player.loadouts[LOADOUT] = {
            "origin": ORIGIN,
            "source": SOURCE,
            "attachments": attachments
        }

        if COMMAND:
            player.commands[COMMAND] = MESSAGE

        db.add_player(player)
        print(f"Added {player.username}'s {LOADOUT}")


def _print_validation(player: Player, attachments: dict):
    print(f"{player.username}'s {LOADOUT}:")

    if LOADOUT in player.loadouts:
        previous_attachments = list(player.loadouts[LOADOUT]["attachments"].values())
        sorted_keys = sorted(attachments)
        [print(f"\t{previous_attachments[i]} -> {attachments[sorted_keys[i]]}") for i in range(5)]
    else:
        [print(f"\t{attachment}") for attachment in attachments.values()]

    print(f"{COMMAND}: {MESSAGE}")
    print("-" * 15)


if __name__ == '__main__':
    _add_loadout()

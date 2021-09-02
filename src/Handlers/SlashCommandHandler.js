import { SlashCommandBuilder } from "../Structures/SlashCommand.js";
import { GuildResolver } from "../Utilities/Resolver_Utils.js";

/**
 * @class SlashCommandHandler - Handler for deploying Interaction-commands in Discord API
 * @param {Snowflake} client Discord API Client for Accessing Application Commands for Guild and Global
 * @param {Object} CreateOptions CreateOptions for Creating a Slash Command Data
 */

export class SlashCommandHandler {
  /**
   * @constructor
   * @property {Snowflake} client Discord API Client for Accessing Application Commands for Guild and Global
   * @property {Snowflake} guild Discord Guild Collection <Snowflake>.<Collection> from discord.js v13
   * @property {Boolean} global If Handler should Deploy Slash Commands Globally | Can take time minimum 1 Hour as per Discord API Protocols
   * @property {Array} SlashCommands Array of Slash Commands for Interaction of Application Commands Manager
   * @property {Boolean} deployed if Previous Set Commands are Deployed ? True/False
   * @property {Array} ApplicationCommands Discord API Fetched Application Commands Collection.<Array>
   */

  constructor(client, CreateOptions) {
    this.client = client;
    this.guild = CreateOptions.guild
      ? GuildResolver(client, CreateOptions.guild, {
          ifmessage: true,
        })
      : null;
    this.global = CreateOptions.global || false;
    this.SlashCommands = CreateOptions.commands || null;
    this.deployed = false;
    this.ApplicationCommands = [];
  }

  /**
   * @method set - Setting up Slash Commands in to the Cache to Deploy for Discord's Application Command Manager
   * @param {Array} commands Array of Raw Slash Commands Data to be Cooked in Slash Commander Builder <class>
   * @returns {Array} SlashCommands - Cooked Slash Command from the Builder
   */

  async set(commands) {
    this.SlashCommands = commands || this.deployed ? null : this.SlashCommands;
    if (!this.SlashCommands && this.deployed)
      throw SyntaxError(
        `Slash Command has been already Deployed with Previous Set Values | Try Setting New Slash Commands`
      );
    else if (!this.SlashCommands)
      throw SyntaxError(
        `Slash Command has not been Set/Saved | Try Setting Slash Commands - <SlashCommandHandler>.set()`
      );
    else if (!this.client.application?.owner)
      await this.client.application?.fetch();
    const SlashCommandInstance = new SlashCommandBuilder(
      Client,
      this.SlashCommands
    );
    this.SlashCommands = SlashCommandInstance.create();
    if (this.SlashCommands) {
      this.deployed = false;
      return this.SlashCommands;
    } else return void null;
  }

  /**
   * @method deploy - Deploying Slash Commands Discord's Application Command Manager | Discord API
   * @returns {this} SlashCommandHandler - Well Formed Class Instance after deployment
   */

  async deploy() {
    if (this.deployed || !this.SlashCommands)
      throw SyntaxError(
        `No New Slash Command has been Set to Deploy | Try Setting New Slash Commands- <SlashCommandHandler>.set()`
      );
    else if (this.ApplicationCommands.length <= 0)
      throw SyntaxError(
        `No Slash Command has been Set to Deploy | try - <SlashCommandHandler>.set()`
      );
    else if (!this.client.application?.owner)
      await this.client.application?.fetch();
    return await this.client.application.commands
      .set(this.SlashCommands)
      .then((ApplicationCommands) => {
        this.deployed = true;
        this.ApplicationCommands = Array.from(ApplicationCommands.values());
        return this;
      })
      .catch((error) => {
        throw Error(error);
      });
  }

  /**
   * @method get - getting/fetching Slash Commands Data from the Cache for Discord's Application Command Manager
   * @param {Number} CommandId Command.id from Application Commands Manager
   * @returns {Array} ApplicationCommand - Well Formed Data of Appliaction Commands after deployment
   */

  async get(CommandId) {
    if (!this.deployed || !this.SlashCommands)
      throw SyntaxError(
        `No New Slash Command has been Set to Deploy | Try Setting New Slash Commands- <SlashCommandHandler>.set()`
      );
    else if (this.ApplicationCommands.length <= 0)
      throw SyntaxError(
        `No Slash Command has been Set to Deploy | try - <SlashCommandHandler>.set()`
      );
    else if (!this.client.application?.owner)
      await this.client.application?.fetch();
    if (CommandId) {
      return this.client.application.commands
        .fetch(`${CommandId}`)
        .then((ApplicationCommand) => {
          this.#HandleApplicationCommandsCache(ApplicationCommand);
          return ApplicationCommand;
        })
        .catch((error) => {
          throw Error(error);
        });
    } else {
      return this.client.application.commands
        .fetch()
        .then((ApplicationCommands) => {
          this.ApplicationCommands = Array.from(ApplicationCommands.values());
          return ApplicationCommands;
        })
        .catch((error) => {
          throw Error(error);
        });
    }
  }

  /**
   * @method destroy - Destroy Slash Commands Data from the Cache for Discord's Application Command Manager
   * @param {Number} CommandId Command.id from Application Commands Manager
   * @returns {Array} ApplicationCommands - Well Formed Data of Appliaction Commands after deployment
   */

  async destroy(CommandId) {
    if (!this.deployed || !this.SlashCommands)
      throw SyntaxError(
        `No New Slash Command has been Set to Deploy | Try Setting New Slash Commands- <SlashCommandHandler>.set()`
      );
    else if (this.ApplicationCommands.length <= 0)
      throw SyntaxError(
        `No Slash Command has been Set to Deploy | try - <SlashCommandHandler>.set()`
      );
    else if (!this.client.application?.owner)
      await this.client.application?.fetch();
    if (CommandId) return this.#DeleteApplciationCommands();
    else return this.#DeleteApplciationCommands();
  }

  /**
   * @method #HandleApplicationCommandsCache - Handle Slash Commands Data from the Cache for Discord's Application Command Manager for New Value
   * @param {Snowflake} AppplicationCommand Discord API Fetched Application Commands Collection.<Array>[index]
   * @returns {null} Undefined Value | Null Value
   */

  #HandleApplicationCommandsCache(AppplicationCommand) {
    var count = 0;
    for (count = 0; count < this.ApplicationCommands.length; ++count) {
      if (this.ApplicationCommands[count].id === AppplicationCommand.id) {
        this.ApplicationCommands[count] = AppplicationCommand;
        break;
      }
    }
    return void null;
  }

  /**
   * @method #DeleteApplciationCommands - Destroy Slash Commands Data from the Cache for Discord's Application Command Manager
   * @param {Number} CommandId Command.id from Application Commands Manager
   * @returns {Array} ApplicationCommands - Well Formed Data of Appliaction Commands after deployment
   */

  #DeleteApplciationCommands(CommandId) {
    var count = 0;
    const ApplicationCommands = this.ApplicationCommands;
    for (count = 0; count < this.ApplicationCommands.length; ++count) {
      if (CommandId && this.ApplicationCommands[count].id === CommandId) {
        this.client.application.commands
          .delete(`${CommandId}`)
          .then((ApplicationCommand) => {
            this.ApplicationCommands[count].splice(count, 1);
            return ApplicationCommand;
          })
          .catch((error) => {
            throw Error(error);
          });
      }
      this.client.application.commands
        .delete(`${this.ApplicationCommands[count].id}`)
        .then(() => {
          this.ApplicationCommands[count].splice(count, 1);
        })
        .catch((error) => {
          throw Error(error);
        });
    }
    this.deployed = false;
    this.SlashCommands = null;
    return ApplicationCommands;
  }
}

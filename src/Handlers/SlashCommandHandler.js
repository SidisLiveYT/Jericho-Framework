const { Client } = require('discord.js');
const SlashCommandBuilder = require('../Structures/SlashCommand.js');
const { GuildResolver } = require('../Utilities/Resolver_Utils.js');

/**
 * @class SlashCommandHandler - Handler for deploying Interaction-commands in Discord API
 * @param {Client} client Discord API Client for Accessing Application Commands for Guild and Global
 * @param {object} CreateSlashCommandsOptions CreateOptions for Creating a Slash Command Data
 */

module.exports = class SlashCommandHandler {
  /**
   * @property {Boolean} deployed What if Slash Command has been deployed to Discord API
   */

  static #deployed = false;

  /**
   * @constructor
   * @param {Client} client Discord API Client for Accessing Application Commands for Guild and Global
   * @param {object} SlashCommandHandlerInterfaceOptions Discord API Fetched Application Commands Interface Options
   */

  constructor(
    client,
    SlashCommandHandlerInterfaceOptions = {
      guild: undefined,
      global: false,
      SlashCommands: [],
    },
  ) {
    this.client = client;
    this.guild = SlashCommandHandlerInterfaceOptions.guild
      ? GuildResolver(client, SlashCommandHandlerInterfaceOptions.guild, {
        ifmessage: true,
      })
      : null;
    this.global = !(this.guild || !SlashCommandHandlerInterfaceOptions.global);
    this.SlashCommands = SlashCommandHandlerInterfaceOptions.SlashCommands || null;
    this.ApplicationCommands = [];
  }

  /**
   * @method set - Setting up Slash Commands in to the Cache to Deploy for Discord's Application Command Manager
   * @param {Array} commands Array of Raw Slash Commands Data to be Cooked in Slash Commander Builder <class>
   * @returns {Promise<Array>} SlashCommands - Cooked Slash Command from the Builder
   */

  async set(commands) {
    this.SlashCommands = commands || (SlashCommandHandler.#deployed ? null : this.SlashCommands);
    if (!this.SlashCommands && SlashCommandHandler.#deployed) {
      throw SyntaxError(
        'Slash Command has been already Deployed with Previous Set Values | Try Setting New Slash Commands',
      );
    } else if (!this.SlashCommands) {
      throw SyntaxError(
        'Slash Command has not been Set/Saved | Try Setting Slash Commands - <SlashCommandHandler>.set()',
      );
    } else if (!this.client.application?.owner) await this.client.application?.fetch();
    const SlashCommandInstance = new SlashCommandBuilder(
      Client,
      this.SlashCommands,
    );
    this.ApplicationCommands = SlashCommandInstance.create();
    if (this.ApplicationCommands) {
      SlashCommandHandler.#deployed = false;
      return this.ApplicationCommands;
    }
    return undefined;
  }

  /**
   * @method deploy - Deploying Slash Commands Discord's Application Command Manager | Discord API
   * @returns {Promise<this>} SlashCommandHandler - Well Formed Class Instance after deployment
   */

  async deploy() {
    if (SlashCommandHandler.#deployed || !this.SlashCommands) {
      throw SyntaxError(
        'No New Slash Command has been Set to Deploy | Try Setting New Slash Commands- <SlashCommandHandler>.set()',
      );
    } else if (this.ApplicationCommands.length <= 0) {
      throw SyntaxError(
        'No Slash Command has been Set to Deploy | try - <SlashCommandHandler>.set()',
      );
    } else if (!this.client.application?.owner) await this.client.application?.fetch();
    if (this.global) {
      return await this.client.application.commands
        .set(this.SlashCommands)
        .then((ApplicationCommands) => {
          SlashCommandHandler.#deployed = true;
          this.ApplicationCommands = Array.from(ApplicationCommands.values());
          return this;
        })
        .catch((error) => {
          throw Error(error);
        });
    }
    return await this.client.application.commands
      .set(this.SlashCommands, this.guild.id)
      .then((ApplicationCommands) => {
        SlashCommandHandler.#deployed = true;
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
   * @returns {Promise<Array>} ApplicationCommand - Well Formed Data of Appliaction Commands after deployment
   */

  async get(CommandId) {
    if (!SlashCommandHandler.#deployed || !this.SlashCommands) {
      throw SyntaxError(
        'No New Slash Command has been Set to Deploy | Try Setting New Slash Commands- <SlashCommandHandler>.set()',
      );
    } else if (this.ApplicationCommands.length <= 0) {
      throw SyntaxError(
        'No Slash Command has been Set to Deploy | try - <SlashCommandHandler>.set()',
      );
    } else if (!this.client.application?.owner) await this.client.application?.fetch();
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
    }
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

  /**
   * @method destroy - Destroy Slash Commands Data from the Cache for Discord's Application Command Manager
   * @param {Number} CommandId Command.id from Application Commands Manager
   * @returns {Promise<Array>} ApplicationCommands - Well Formed Data of Appliaction Commands after deployment
   */

  async destroy(CommandId) {
    if (!SlashCommandHandler.#deployed || !this.SlashCommands) {
      throw SyntaxError(
        'No New Slash Command has been Set to Deploy | Try Setting New Slash Commands- <SlashCommandHandler>.set()',
      );
    } else if (this.ApplicationCommands.length <= 0) {
      throw SyntaxError(
        'No Slash Command has been Set to Deploy | try - <SlashCommandHandler>.set()',
      );
    } else if (!this.client.application?.owner) await this.client.application?.fetch();
    if (CommandId) return this.#DeleteApplciationCommands();
    return this.#DeleteApplciationCommands();
  }

  /**
   * @method #HandleApplicationCommandsCache - Handle Slash Commands Data from the Cache for Discord's Application Command Manager for New Value
   * @param {Collection} AppplicationCommand Discord API Fetched Application Commands Collection.<Array>[index]
   * @returns {null} Undefined Value | Null Value
   */

  #HandleApplicationCommandsCache(AppplicationCommand) {
    let count = 0;
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
    const { ApplicationCommands } = this;
    if (!CommandId) {
      return this.client.application.commands
        .set([])
        .then(() => {
          this.ApplicationCommands = null;
          SlashCommandHandler.#deployed = false;
          this.SlashCommands = null;
          return [ApplicationCommands];
        })
        .catch((error) => {
          throw Error(error);
        });
    }
    let count = 0;
    for (count = 0; count < this.ApplicationCommands.length; ++count) {
      if (CommandId && this.ApplicationCommands[count].id === CommandId) {
        return this.client.application.commands
          .delete(`${CommandId}`)
          .then((ApplicationCommand) => {
            this.ApplicationCommands[count].splice(count, 1);
            return ApplicationCommand;
          })
          .catch((error) => {
            throw Error(error);
          });
      }
    }
    return undefined;
  }
};

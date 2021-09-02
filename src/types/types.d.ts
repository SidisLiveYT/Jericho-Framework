export { ThreadHandler } from ".././Handlers/ThreadHandler.js";
export { SlashCommandHandler } from ".././Handlers/SlashCommandHandler.js";

/**
 * @typedef {class} ThreadHandler
 * @property {Snowflake} Client Discord API Client from discord.js v13
 * @property {Snowflake} guild Guild Resolve from Discord.js v13
 * @property {Snowflake} channel Channel Resolve from Discord.js v13
 * @property {Object} metadata Extra Stuff to check or Cache Data
 */

export interface ThreadHandler {
  Client: Snowflake;
  guild: Snowflake;
  channel: Snowflake;
  metadata: Object;
}

/**
 * @typedef {class} SlashCommandHandler
 * @property {Snowflake} client Discord API Client from discord.js v13
 * @property {Snowflake} guild Guild Resolve from Discord.js v13
 * @property {boolean} global Channel Resolve from Discord.js v13
 * @property {Array} SlashCommands Extra Stuff to check or Cache Data
 * @property {Boolean} deployed Extra Stuff to check or Cache Data
 * @property {Array} ApplicationCommands Extra Stuff to check or Cache Data
 */

export interface SlashCommandHandler {
  Client: Snowflake;
  guild: Snowflake;
  global: boolean;
  SlashCommands: Array;
  deployed: boolean;
  ApplicationCommands: Array;
}

declare module "jericho-framework";

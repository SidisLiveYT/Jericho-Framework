export { ThreadHandler } from '.././Handlers/ThreadHandler.js';
export { SlashCommandHandler } from '.././Handlers/SlashCommandHandler.js';
import { Client, Guild, GuildChannel } from 'discord.js';

/**
 * @typedef ThreadHandler
 * @property {Client} Client Discord API Client from discord.js v13
 * @property {Guild} guild Guild Resolve from Discord.js v13
 * @property {GuildChannel} channel Channel Resolve from Discord.js v13
 * @property {object} metadata Extra Stuff to check or Cache Data
 */

export interface ThreadHandler {
	Client: Client;
	guild: Guild;
	channel: GuildChannel;
	metadata: object;
}

/**
 * @typedef {class} SlashCommandHandler
 * @property {Client} client Discord API Client from discord.js v13
 * @property {Guild} guild Guild Resolve from Discord.js v13
 * @property {Boolean} global Channel Resolve from Discord.js v13
 * @property {Array} SlashCommands Extra Stuff to check or Cache Data
 * @property {Boolean} deployed Extra Stuff to check or Cache Data
 * @property {Array} ApplicationCommands Extra Stuff to check or Cache Data
 */

export interface SlashCommandHandler {
	Client: Client;
	guild: Guild;
	global: Boolean;
	SlashCommands: Array;
	deployed: Boolean;
	ApplicationCommands: Array;
}

declare module 'jericho-framework';
